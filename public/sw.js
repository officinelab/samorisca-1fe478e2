
const CACHE_NAME = 'sa-morisca-admin-v1';
const ADMIN_SCOPE = '/admin/';

// Files to cache for the admin dashboard
const CACHE_URLS = [
  '/admin/dashboard',
  '/admin/settings',
  '/admin/multilingual',
  '/admin/preview',
  '/src/main.tsx',
  '/src/index.css'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('PWA: Cache opened for admin dashboard');
        return cache.addAll(CACHE_URLS);
      })
      .catch((error) => {
        console.log('PWA: Cache installation failed', error);
      })
  );
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('PWA: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - only handle admin routes
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Only handle requests within admin scope, exclude public menu
  if (!url.pathname.startsWith(ADMIN_SCOPE) || url.pathname.startsWith('/menu')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          console.log('PWA: Serving from cache', event.request.url);
          return response;
        }
        
        return fetch(event.request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Return a fallback page for admin routes when offline
            return caches.match('/admin/dashboard');
          });
      })
  );
});

// Handle background sync for admin operations
self.addEventListener('sync', (event) => {
  if (event.tag === 'admin-data-sync') {
    event.waitUntil(
      // Handle offline admin data synchronization
      console.log('PWA: Background sync triggered for admin data')
    );
  }
});
