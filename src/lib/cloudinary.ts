// src/lib/cloudinary.ts

const CLOUDINARY_CLOUD_NAME = 'prmoymao';
const CLOUDINARY_API_KEY = '432341747543753';

export const MAX_FILE_SIZE_BYTES = 700 * 1024; // 700 KB = 716,800 bytes

/**
 * Extracts Cloudinary public_id from a full Cloudinary URL
 */
export function extractCloudinaryPublicId(url: string): string | null {
  if (!url || typeof url !== 'string' || !url.includes('cloudinary.com')) return null;
  const parts = url.split('/upload/');
  if (parts.length < 2) return null;
  const pathParts = parts[1].split('/');
  // Filter out transformation segments like f_auto,q_auto, w_800, or v1234567
  const cleanParts = pathParts.filter((p) => !p.match(/^[fqs]_[^/]+/) && !p.match(/^v\d+$/));
  let cleanPath = cleanParts.join('/');
  // Remove file extension (.webp, .png, .jpg, etc.)
  cleanPath = cleanPath.replace(/\.[^/.]+$/, '');
  return cleanPath || null;
}

/**
 * Compresses and optimizes an image client-side before upload to ensure:
 * 1. Image format is converted/optimized to WebP
 * 2. File size is strictly under 700 KB (716,800 bytes)
 * 3. Dimensions are clamped to reasonable max limits (e.g., 2000px)
 */
export async function compressAndOptimizeImage(
  fileOrBase64: File | string,
  maxKb: number = 700,
  maxDimension: number = 2000
): Promise<string> {
  return new Promise((resolve, reject) => {
    const processImageSource = (src: string) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        let { width, height } = img;

        // Scale down if exceeds max dimension
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          return resolve(src);
        }

        // Fill white background before drawing in case of transparent PNGs
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Target size in bytes (700KB)
        const maxSizeBytes = maxKb * 1024;

        // Export as WebP format
        let quality = 0.90;
        let dataUrl = canvas.toDataURL('image/webp', quality);

        // Downscale quality if data exceeds max 700KB
        while (dataUrl.length * (3 / 4) > maxSizeBytes && quality > 0.15) {
          quality -= 0.08;
          dataUrl = canvas.toDataURL('image/webp', quality);
        }

        // If still exceeds 700KB, shrink canvas dimensions step-by-step
        let currentWidth = width;
        let currentHeight = height;
        while (dataUrl.length * (3 / 4) > maxSizeBytes && currentWidth > 400) {
          currentWidth = Math.round(currentWidth * 0.85);
          currentHeight = Math.round(currentHeight * 0.85);
          const scaledCanvas = document.createElement('canvas');
          scaledCanvas.width = currentWidth;
          scaledCanvas.height = currentHeight;
          const sCtx = scaledCanvas.getContext('2d');
          if (sCtx) {
            sCtx.fillStyle = '#FFFFFF';
            sCtx.fillRect(0, 0, currentWidth, currentHeight);
            sCtx.drawImage(img, 0, 0, currentWidth, currentHeight);
            dataUrl = scaledCanvas.toDataURL('image/webp', quality);
          }
        }

        resolve(dataUrl);
      };

      img.onerror = (err) => reject(err);
      img.src = src;
    };

    if (typeof fileOrBase64 === 'string') {
      processImageSource(fileOrBase64);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        processImageSource(e.target?.result as string);
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(fileOrBase64);
    }
  });
}

/**
 * Uploads an image (File or Base64 data URL) to Cloudinary.
 * Automates compression to <=700KB, converts to WebP, and signs request server-side.
 */
export async function uploadToCloudinary(
  fileOrBase64: File | string,
  folder: string = 'shafinbd_jobs'
): Promise<string> {
  try {
    // 1. Pre-process client side: optimize & enforce max 700KB size limit + WebP format
    const optimizedBase64 = await compressAndOptimizeImage(fileOrBase64, 700);

    // 2. Call backend server endpoint for signed Cloudinary upload
    const response = await fetch('/api/cloudinary/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file: optimizedBase64,
        folder,
      }),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.error || 'Cloudinary upload server request failed');
    }

    const data = await response.json();
    if (!data.secure_url) {
      throw new Error('Cloudinary response missing secure_url');
    }

    // Ensure format is WebP URL with auto quality optimization:
    let finalUrl = data.secure_url;
    if (finalUrl.includes('/upload/') && !finalUrl.includes('/f_')) {
      finalUrl = finalUrl.replace('/upload/', '/upload/f_webp,q_auto/');
    }

    return finalUrl;
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    // Fallback: return optimized data URL if server request fails
    if (typeof fileOrBase64 === 'string' && fileOrBase64.startsWith('data:')) {
      return fileOrBase64;
    }
    return await compressAndOptimizeImage(fileOrBase64, 700);
  }
}

/**
 * Deletes an image from Cloudinary using Cloudinary Destroy API (Signed SHA-1)
 */
export async function deleteFromCloudinary(urlOrPublicId: string): Promise<boolean> {
  if (!urlOrPublicId) return false;

  const publicId = urlOrPublicId.includes('cloudinary.com')
    ? extractCloudinaryPublicId(urlOrPublicId)
    : urlOrPublicId;

  if (!publicId) return false;

  try {
    const response = await fetch('/api/cloudinary/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ public_id: publicId }),
    });

    if (!response.ok) {
      console.warn('Failed to delete image from Cloudinary:', publicId);
      return false;
    }

    const resData = await response.json();
    console.log(`Cloudinary image auto-deleted successfully [${publicId}]:`, resData.result);
    return resData.result === 'ok';
  } catch (err) {
    console.error('Cloudinary Auto-Delete Error:', err);
    return false;
  }
}
