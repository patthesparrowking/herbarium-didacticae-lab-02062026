const CACHE_NAME = "herbarium-cache-v2";

const OFFLINE_URL = "./offline.html";

const CORE_ASSETS = [
    "./",
    "./index.html",
    "./offline.html",
    "./manifest.json",

    "./css/base.css",
    "./css/layout.css",
    "./css/navigation.css",
    "./css/forms.css",
    "./css/print.css",
    "./css/map.css",

    "./js/app.js",
    "./js/navigation.js",

    "./data/templates.json",
    "./data/dictionary.json",

    "./pages/more.html",
    "./pages/label-create.html",
    "./pages/label-list.html",
    "./pages/label-preview.html",
    "./pages/label-edit.html",
    "./pages/collection.html",
    "./pages/specimen-create.html",
    "./pages/specimen-detail.html",
    "./pages/specimen-edit.html",
    "./pages/templates.html",
    "./pages/dictionary.html",
    "./pages/map.html",
    "./pages/settings.html"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(async cache => {
            for (const asset of CORE_ASSETS) {
                try {
                    await cache.add(asset);
                } catch (error) {
                    console.warn("Konnte nicht gecacht werden:", asset, error);
                }
            }
        })
    );

    self.skipWaiting();
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            );
        })
    );

    self.clients.claim();
});

self.addEventListener("fetch", event => {
    if (event.request.method !== "GET") return;

    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(event.request).catch(() => {
                if (event.request.mode === "navigate") {
                    return caches.match(OFFLINE_URL);
                }
            });
        })
    );
});