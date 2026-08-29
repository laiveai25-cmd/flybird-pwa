/* Flybird GIV — offline app-shell cache.
   Bump CACHE (e.g. v2, v3) whenever you change index.html so phones pick up the new version. */
const CACHE = "flybird-giv-v19";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png",
  "./favicon.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then(async (cache) => {
      try {
        await cache.addAll(ASSETS);
      } catch (err) {
        console.warn("Pre-cache addAll failed, caching individually:", err);
        await Promise.all(
          ASSETS.map((url) =>
            fetch(url)
              .then((res) => {
                if (res.ok) return cache.put(url, res);
              })
              .catch((e) => console.warn(`Failed to cache ${url}:`, e))
          )
        );
      }
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  // Only handle GET requests
  if (e.request.method !== "GET") return;

  const url = new URL(e.request.url);

  // Never cache the submit/auth API endpoint — it must hit the network when online.
  if (url.pathname.includes("/api/")) return;

  // App shell & assets: serve from cache first, fall back to network and cache dynamic responses.
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      const fetchPromise = fetch(e.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === "basic") {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE).then((cache) => {
              cache.put(e.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // If offline and request is a navigation request, fallback to index.html
          if (e.request.mode === "navigate") {
            return caches.match("./index.html") || caches.match("./");
          }
        });

      return cachedResponse || fetchPromise;
    })
  );
});

