const CACHE_NAME = 'shafinbd-jobs-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://res.cloudinary.com/prmoymao/image/upload/v1786423884/pwa-192x192.webp',
  'https://res.cloudinary.com/prmoymao/image/upload/v1786423884/pwa-512x512.webp',
  'https://res.cloudinary.com/prmoymao/image/upload/v1786423885/logo.webp'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch background update for cache
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
          }
        }).catch(() => {/* Ignore network errors on revalidate */});
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        // Return index.html fallback if navigating
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});

// Push notification listener
self.addEventListener('push', (event) => {
  const APP_ICON = "https://res.cloudinary.com/prmoymao/image/upload/v1786423884/pwa-192x192.webp";
  let title = "ShafinBD Jobs - নতুন চাকরির বিজ্ঞপ্তি";
  let body = "নতুন সরকারি ও বেসরকারি চাকরির বিজ্ঞপ্তি দেখতে ট্যাপ করুন।";
  let url = "/";

  if (event.data) {
    try {
      const data = event.data.json();
      title = data.title || title;
      body = data.body || body;
      url = data.url || url;
    } catch (e) {
      body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: APP_ICON,
      badge: APP_ICON,
      vibrate: [200, 100, 200],
      data: { url }
    })
  );
});

// Notification click listener
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
