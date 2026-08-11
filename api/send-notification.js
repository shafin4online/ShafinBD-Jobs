import firebaseAdmin from 'firebase-admin';

const admin = firebaseAdmin.default || firebaseAdmin;

// Initialize Firebase Admin SDK if not already initialized
if (!admin.getApps().length) {
  const projectId = process.env.FIREBASE_PROJECT_ID || 'shafinbdjobs';
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (privateKey) {
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  if (clientEmail && privateKey) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      console.log('🚀 Firebase Admin initialized successfully');
    } catch (err) {
      console.error('❌ Firebase Admin initialization error:', err);
    }
  } else {
    console.warn('⚠️ Firebase Admin credentials missing in environment variables');
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { title, body, url = '/', icon, jobCategory } = req.body || {};

    if (!title || !body) {
      return res.status(400).json({ error: 'Title and Body are required' });
    }

    if (!admin.getApps().length) {
      return res.status(500).json({
        error: 'Firebase Admin not initialized. Please ensure FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY environment variables are configured.',
      });
    }

    const db = admin.firestore();
    const notificationIcon = icon || 'https://res.cloudinary.com/prmoymao/image/upload/v1786423884/pwa-192x192.webp';

    // 1. Record broadcast log in Firestore push_broadcasts collection
    try {
      await db.collection('push_broadcasts').add({
        title,
        body,
        url,
        jobCategory: jobCategory || 'General',
        icon: notificationIcon,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } catch (e) {
      console.warn('Warning writing push_broadcasts log:', e);
    }

    // 2. Fetch all registered user tokens from push_tokens
    const tokensSnapshot = await db.collection('push_tokens').get();
    const tokens = [];

    tokensSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.token && data.active !== false) {
        tokens.push(data.token);
      }
    });

    if (tokens.length === 0) {
      return res.json({
        success: true,
        message: 'No registered push tokens found to send notification',
        recipientCount: 0,
      });
    }

    // Deduplicate tokens
    const uniqueTokens = Array.from(new Set(tokens));

    // Chunk tokens into batches of 500 (FCM max batch limit)
    const batchSize = 500;
    let successCount = 0;
    let failureCount = 0;
    const invalidTokens = [];

    for (let i = 0; i < uniqueTokens.length; i += batchSize) {
      const tokenBatch = uniqueTokens.slice(i, i + batchSize);

      const message = {
        tokens: tokenBatch,
        notification: {
          title,
          body,
        },
        data: {
          title,
          body,
          url,
          icon: notificationIcon,
        },
        webpush: {
          headers: {
            Urgency: 'high',
          },
          notification: {
            title,
            body,
            icon: notificationIcon,
            badge: notificationIcon,
            requireInteraction: true,
            data: { url },
          },
          fcmOptions: {
            link: url,
          },
        },
      };

      const response = await admin.messaging().sendEachForMulticast(message);
      successCount += response.successCount;
      failureCount += response.failureCount;

      // Clean up stale or invalid registration tokens
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          const errCode = resp.error?.code;
          if (
            errCode === 'messaging/invalid-registration-token' ||
            errCode === 'messaging/registration-token-not-registered'
          ) {
            invalidTokens.push(tokenBatch[idx]);
          }
        }
      });
    }

    // Remove invalid tokens from Firestore
    if (invalidTokens.length > 0) {
      const batch = db.batch();
      invalidTokens.forEach((t) => {
        const ref = db.collection('push_tokens').doc(t);
        batch.delete(ref);
      });
      await batch.commit().catch((e) => console.warn('Token cleanup error:', e));
    }

    return res.json({
      success: true,
      message: `Notification sent successfully to ${successCount} devices`,
      successCount,
      failureCount,
      totalTokens: uniqueTokens.length,
    });
  } catch (error) {
    console.error('Send notification error:', error);
    return res.status(500).json({
      error: error.message || 'Internal server error while sending push notification',
    });
  }
}
