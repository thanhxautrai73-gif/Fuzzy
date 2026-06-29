const CACHE_NAME = 'fuzzy-pwa-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  '/favicon.svg',
  '/css/iconsax.css',
  '/css/bootstrap.min.css',
  '/css/swiper-bundle.min.css',
  '/css/style.css',
  '/js/swiper-bundle.min.js',
  '/js/custom-swiper.js',
  '/js/iconsax.js',
  '/js/bootstrap.bundle.min.js',
  '/js/homescreen-popup.js',
  '/js/offcanvas-popup.js',
  '/js/script.js',
  '/images/logo.png',
  '/images/favicon.png',
  '/images/48.png',
  '/images/1.png',
  '/images/2.png',
  '/images/3.png',
  '/images/design1.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
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
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Chỉ xử lý các yêu cầu GET
  if (event.request.method !== 'GET') return;

  // Bỏ qua các cuộc gọi API từ Next.js
  if (event.request.url.includes('/api/')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          // Khi mất mạng và người dùng đổi hướng trang, hiển thị offline.html
          if (event.request.mode === 'navigate') {
            return caches.match('/offline.html');
          }
        });
    })
  );
});
