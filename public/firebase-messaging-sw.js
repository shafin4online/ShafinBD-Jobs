importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyAX6CWkB17-lwIfz9OmKJZaGPfTbvEyXec",
  authDomain: "shafinbdjobs.firebaseapp.com",
  projectId: "shafinbdjobs",
  storageBucket: "shafinbdjobs.firebasestorage.app",
  messagingSenderId: "564277557296",
  appId: "1:564277557296:web:9c6a8dc760bf82714095f5",
  measurementId: "G-DNHMXH4NJ0"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

const APP_ICON = "https://res.cloudinary.com/prmoymao/image/upload/v1786423884/pwa-192x192.webp";

// Firebase background message handler
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification?.title || payload.data?.title || 'ShafinBD Jobs - নতুন চাকরির বিজ্ঞপ্তি';
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body || 'নতুন নিয়োগ বিজ্ঞপ্তি প্রকাশিত হয়েছে। দেখতে ট্যাপ করুন।',
    icon: APP_ICON,
    badge: APP_ICON,
    data: {
      url: payload.data?.url || '/'
    },
    vibrate: [200, 100, 200],
    actions: [
      { action: 'open_app', title: 'সার্কুলার দেখুন 🚀' }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Generic Web Push event listener
self.addEventListener('push', (event) => {
  if (event.data) {
    try {
      const data = event.data.json();
      const title = data.title || data.notification?.title || 'ShafinBD Jobs - চাকরির খবর';
      const options = {
        body: data.body || data.notification?.body || 'নতুন চাকরির বিজ্ঞপ্তি প্রকাশিত হয়েছে!',
        icon: APP_ICON,
        badge: APP_ICON,
        data: { url: data.url || '/' },
        vibrate: [200, 100, 200]
      };
      event.waitUntil(self.registration.showNotification(title, options));
    } catch (e) {
      const text = event.data.text();
      event.waitUntil(
        self.registration.showNotification('ShafinBD Jobs - নতুন আপডেট', {
          body: text,
          icon: APP_ICON,
          badge: APP_ICON
        })
      );
    }
  }
});

// Handle notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
