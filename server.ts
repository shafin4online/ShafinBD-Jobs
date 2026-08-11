import express from 'express';
import path from 'path';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import sendNotificationHandler from './api/send-notification.js';

const app = express();
const PORT = 3000;

// Cloudinary Configuration
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'prmoymao';
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || '432341747543753';
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || 'wfssD6spvvVaEaaYGxccffUcO9E';

// Body parsers with large size limit for image uploads
app.use(express.json({ limit: '12mb' }));
app.use(express.urlencoded({ extended: true, limit: '12mb' }));

// Health Check API
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', cloudName: CLOUDINARY_CLOUD_NAME });
});

// Push Notification API Route (Firebase Admin FCM)
app.post('/api/send-notification', (req, res) => {
  sendNotificationHandler(req, res);
});

// Cloudinary Upload API Route
app.post('/api/cloudinary/upload', async (req, res) => {
  try {
    const { file, folder = 'shafinbd_jobs' } = req.body;
    if (!file) {
      return res.status(400).json({ error: 'Missing file payload' });
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const format = 'webp';

    // Parameters to sign with SHA-1
    const paramsToSign: Record<string, any> = {
      folder,
      format,
      timestamp,
    };

    // Build SHA-1 signature string
    const sortedString = Object.keys(paramsToSign)
      .sort()
      .map((k) => `${k}=${paramsToSign[k]}`)
      .join('&');

    const stringToSign = sortedString + CLOUDINARY_API_SECRET;
    const signature = crypto.createHash('sha1').update(stringToSign).digest('hex');

    // Send request to Cloudinary API
    const formData = new URLSearchParams();
    formData.append('file', file);
    formData.append('api_key', CLOUDINARY_API_KEY);
    formData.append('timestamp', timestamp.toString());
    formData.append('folder', folder);
    formData.append('format', format);
    formData.append('signature', signature);

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
    const cRes = await fetch(cloudinaryUrl, {
      method: 'POST',
      body: formData,
    });

    const cData = await cRes.json();
    if (!cRes.ok) {
      console.error('Cloudinary upload response error:', cData);
      return res.status(cRes.status).json({ error: cData.error?.message || 'Upload to Cloudinary failed' });
    }

    // Format secure WebP URL with auto quality optimization
    let secureUrl = cData.secure_url;
    if (secureUrl && !secureUrl.includes('/f_')) {
      secureUrl = secureUrl.replace('/upload/', '/upload/f_webp,q_auto/');
    }

    res.json({
      secure_url: secureUrl,
      public_id: cData.public_id,
      format: cData.format,
      bytes: cData.bytes,
      width: cData.width,
      height: cData.height,
    });
  } catch (error: any) {
    console.error('Server Cloudinary Upload Error:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

// Cloudinary Auto-Delete (Destroy) API Route
app.post('/api/cloudinary/delete', async (req, res) => {
  try {
    const { public_id } = req.body;
    if (!public_id) {
      return res.status(400).json({ error: 'Missing public_id' });
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const paramsToSign = {
      public_id,
      timestamp,
    };

    const sortedString = Object.keys(paramsToSign)
      .sort()
      .map((k) => `${k}=${paramsToSign[k]}`)
      .join('&');

    const stringToSign = sortedString + CLOUDINARY_API_SECRET;
    const signature = crypto.createHash('sha1').update(stringToSign).digest('hex');

    const formData = new URLSearchParams();
    formData.append('public_id', public_id);
    formData.append('api_key', CLOUDINARY_API_KEY);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);

    const destroyUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/destroy`;
    const cRes = await fetch(destroyUrl, {
      method: 'POST',
      body: formData,
    });

    const cData = await cRes.json();
    console.log(`Cloudinary destroy result [${public_id}]:`, cData);
    res.json(cData);
  } catch (error: any) {
    console.error('Server Cloudinary Delete Error:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
