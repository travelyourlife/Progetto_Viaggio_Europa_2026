// ═══════════════════════════════════════════════════════════════
// Service Worker — Viaggio Europa 2026 V8.3
// Strategy: Network-First for own assets (always fresh)
//           Cache-First for CDN (stable, versioned)
//           Network-Only for API calls
// ═══════════════════════════════════════════════════════════════
'use strict';

const CACHE_NAME = 'quo-vadis-v8.3';
const STATIC_ASSETS = [
  './',
  './index.html',
  './index_en.html',
  './style.css',
  './data.js',
  './wiki-links.js',
  './weather-coords.js',
  './app.js',
  './manifest.json',
  './icon.png',
  './icon-192.png',
  './icon-maskable-180.png',
  './icon-maskable-192.png',
  './icon-maskable-512.png',
  './icons/van-marker.svg'
];

const CDN_ASSETS = [
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-database-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-storage-compat.js'
];

// ─── Install: pre-cache CDN assets, skip waiting immediately ───
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log('[SW] Installing v8.3 — caching CDN assets');
      return cache.addAll(CDN_ASSETS);
    }).then(function() {
      // Force immediate activation — don't wait for old SW to release
      return self.skipWaiting();
    })
  );
});

// ─── Activate: clean ALL old caches, take control immediately ───
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) { return key !== CACHE_NAME; })
            .map(function(key) {
              console.log('[SW] Deleting old cache:', key);
              return caches.delete(key);
            })
      );
    }).then(function() {
      // Take control of ALL open tabs immediately
      return self.clients.claim();
    }).then(function() {
      // Notify all clients to reload
      return self.clients.matchAll({ type: 'window' }).then(function(clients) {
        clients.forEach(function(client) {
          client.postMessage({ type: 'SW_UPDATED', version: CACHE_NAME });
        });
      });
    })
  );
});

// ─── Fetch strategy router ───
self.addEventListener('fetch', function(event) {
  var url = new URL(event.request.url);

  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Network-Only for API calls (Firebase, meteo) — never cache
  if (isApiRequest(url)) {
    return; // Let the browser handle it normally
  }

  // Cache-First for CDN assets (versioned, stable)
  if (isCdnAsset(url)) {
    event.respondWith(cacheFirst(event.request));
    return;
  }

  // Network-First for OWN assets (always get latest version)
  event.respondWith(networkFirst(event.request));
});

// ─── Helpers ───

function isApiRequest(url) {
  return url.hostname === 'api.open-meteo.com' ||
         url.hostname.includes('firebaseio.com') ||
         url.hostname.includes('firebasedatabase.app') ||
         url.hostname.includes('googleapis.com') ||
         url.pathname.includes('/__/auth/') ||
         url.pathname.includes('version.json');
}

function isCdnAsset(url) {
  return url.hostname === 'unpkg.com' ||
         url.hostname === 'www.gstatic.com' ||
         url.hostname === 'cdn.jsdelivr.net' ||
         url.hostname === 'fonts.googleapis.com' ||
         url.hostname === 'fonts.gstatic.com';
}

// Network-First: try network, fall back to cache (for own assets)
function networkFirst(request) {
  return fetch(request).then(function(response) {
    if (response && response.status === 200) {
      var clone = response.clone();
      caches.open(CACHE_NAME).then(function(cache) {
        cache.put(request, clone);
      });
    }
    return response;
  }).catch(function() {
    // Offline: serve from cache
    return caches.match(request).then(function(cached) {
      return cached || new Response('Offline', { status: 503 });
    });
  });
}

// Cache-First: serve from cache, only fetch if not cached (for CDN)
function cacheFirst(request) {
  return caches.match(request).then(function(cached) {
    if (cached) return cached;
    return fetch(request).then(function(response) {
      if (response && response.status === 200) {
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(request, clone);
        });
      }
      return response;
    });
  });
}

// ─── Message handling ───
self.addEventListener('message', function(event) {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
  if (event.data === 'checkUpdate') {
    // Force re-registration check
    self.registration.update();
  }
});

// ═══════════════════════════════════════════════════════════════
// ─── FCM PUSH NOTIFICATIONS ───
// ═══════════════════════════════════════════════════════════════

importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyCuUYGu_5PlIlDbxwYsFYL5y4OmoGehzzg',
  authDomain: 'viaggio-europa-2026.firebaseapp.com',
  projectId: 'viaggio-europa-2026',
  storageBucket: 'viaggio-europa-2026.firebasestorage.app',
  messagingSenderId: '859844907239',
  appId: '1:859844907239:web:f226b10961df1fe66fd242'
});

var messaging = firebase.messaging();

// Handle background push messages
messaging.onBackgroundMessage(function(payload) {
  console.log('[SW] Background message received:', payload);
  var data = payload.notification || payload.data || {};
  var title = data.title || 'Quo Vadis';
  var options = {
    body: data.body || '',
    icon: './icon-maskable-192.png',
    badge: './icon-maskable-192.png',
    tag: 'quo-vadis-' + (data.tag || 'general'),
    data: { url: data.click_action || data.url || './' },
    vibrate: [100, 50, 100],
    actions: [
      { action: 'open', title: data.actionLabel || 'Apri' }
    ]
  };
  return self.registration.showNotification(title, options);
});

// Handle notification click
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  var url = (event.notification.data && event.notification.data.url) || './';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (var i = 0; i < clientList.length; i++) {
        if (clientList[i].url.indexOf('quo-vadis') !== -1 || clientList[i].url.indexOf('viaggio') !== -1) {
          clientList[i].focus();
          return clientList[i].navigate(url);
        }
      }
      return self.clients.openWindow(url);
    })
  );
});
