/* Flybird GIV — offline app-shell cache.
   Bump CACHE (e.g. v2, v3) whenever you change index.html so phones pick up the new version. */
const CACHE = "flybird-giv-v1";
const ASSETS = ["./", "./index.html", "./manifest.json"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
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
  const url = new URL(e.request.url);
  // Never cache the submit endpoint — it must hit the network when online.
  if (url.pathname.includes("/api/")) return;
  // App shell: serve from cache first, fall back to network.
  e.respondWith(
    caches.match(e.request).then((hit) => hit || fetch(e.request))
  );
});
