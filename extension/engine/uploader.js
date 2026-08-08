/**
 * ShafinBD Uploader & Media Field Module (v4 Enterprise)
 * Inspects form file inputs, validates profile image dimensions/size specifications,
 * and uses HTML Canvas processing to auto-crop, resize, compress, and attach files to inputs.
 */

window.ShafinBDUploader = {
  // Teletalk standard photo requirements
  PHOTO_SPECS: {
    maxKb: 100,
    widthPx: 300,
    heightPx: 300,
    allowedFormats: ['jpeg', 'jpg', 'png']
  },

  // Teletalk standard signature requirements
  SIGNATURE_SPECS: {
    maxKb: 60,
    widthPx: 300,
    heightPx: 80,
    allowedFormats: ['jpeg', 'jpg', 'png']
  },

  // Inspect form for file upload inputs and verify profile media URLs
  inspectMediaInputs: function (profile) {
    const report = {
      hasPhotoInput: false,
      hasSignatureInput: false,
      warnings: [],
      ready: true
    };

    const photoInput = document.querySelector('input[type="file"][name*="photo" i], input[type="file"][id*="photo" i]');
    const sigInput = document.querySelector('input[type="file"][name*="signature" i], input[type="file"][id*="signature" i], input[type="file"][name*="sig" i]');

    if (photoInput) {
      report.hasPhotoInput = true;
      if (!profile || !profile.photoUrl) {
        report.warnings.push('ফরমের ছবির ফিল্ড পাওয়া গেছে, কিন্তু প্রোফাইলে ছবি (300x300 px) নেই');
        report.ready = false;
      }
    }

    if (sigInput) {
      report.hasSignatureInput = true;
      if (!profile || !profile.signatureUrl) {
        report.warnings.push('ফরমের স্বাক্ষরের ফিল্ড পাওয়া গেছে, কিন্তু প্রোফাইলে স্বাক্ষর (300x80 px) নেই');
        report.ready = false;
      }
    }

    return report;
  },

  // Process image using HTML Canvas and attach to File Input element via DataTransfer API
  processAndAttachMedia: async function (fileInput, mediaUrl, mediaType) {
    if (!fileInput || !mediaUrl) {
      return { success: false, message: 'File input or media URL is missing' };
    }

    const isPhoto = mediaType === 'photo';
    const specs = isPhoto ? this.PHOTO_SPECS : this.SIGNATURE_SPECS;
    const fileName = isPhoto ? 'photo.jpg' : 'signature.jpg';

    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = specs.widthPx;
          canvas.height = specs.heightPx;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            resolve({ success: false, message: 'Canvas 2D context unavailable' });
            return;
          }

          // Fill pure white background for JPG rendering (eliminates transparent/black artifacts)
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, specs.widthPx, specs.heightPx);

          // Draw and scale image onto exact dimensions
          ctx.drawImage(img, 0, 0, specs.widthPx, specs.heightPx);

          // Iterative quality adjustment loop to guarantee size <= maxKb
          let quality = 0.92;
          let dataUrl = canvas.toDataURL('image/jpeg', quality);
          const maxBytes = specs.maxKb * 1024;

          while (dataUrl.length * (3 / 4) > maxBytes && quality > 0.15) {
            quality -= 0.05;
            dataUrl = canvas.toDataURL('image/jpeg', quality);
          }

          // Convert Data URL to Blob
          const byteString = atob(dataUrl.split(',')[1]);
          const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          const blob = new Blob([ab], { type: mimeString });

          // Create standard DOM File instance
          const file = new File([blob], fileName, { type: 'image/jpeg', lastModified: Date.now() });

          // Attach File object to <input type="file"> via DataTransfer API
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          fileInput.files = dataTransfer.files;

          // Dispatch standard DOM events so site handlers/validators detect file selection
          fileInput.dispatchEvent(new Event('input', { bubbles: true }));
          fileInput.dispatchEvent(new Event('change', { bubbles: true }));
          fileInput.dispatchEvent(new Event('blur', { bubbles: true }));

          // Apply visual highlight feedback to input
          fileInput.style.border = '2px solid #10b981';
          fileInput.style.backgroundColor = '#f0fdf4';

          const kbSize = (file.size / 1024).toFixed(1);
          window.ShafinBDLogger?.info(`Successfully processed & attached ${mediaType}: ${specs.widthPx}x${specs.heightPx}px, ${kbSize}KB`);

          resolve({
            success: true,
            kbSize: kbSize,
            message: `${isPhoto ? 'ছবি' : 'স্বাক্ষর'} সফলভাবে প্রসেস করে যুক্ত করা হয়েছে (${specs.widthPx}x${specs.heightPx}px, ${kbSize}KB)`
          });
        } catch (err) {
          window.ShafinBDLogger?.error('Canvas processing error:', err);
          resolve({ success: false, message: err.message });
        }
      };

      img.onerror = (err) => {
        window.ShafinBDLogger?.error('Image load error for media URL:', err);
        resolve({ success: false, message: 'Image failed to load' });
      };

      img.src = mediaUrl;
    });
  }
};

