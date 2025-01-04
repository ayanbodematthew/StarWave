const cacheFiles = ["/Audio.html", "/Audio.js"]

const cacheName = "v3";

const dura = 7 * 24 * 60 * 60 * 1000;

self.addEventListener("install", function(event) {
    event.waitUntil(caches.open(cacheName).then(cache => {
        console.log("Worker adding file to cache: ", cache)
        return cache.addAll(cacheFiles)
    }))
})

self.addEventListener("activate", function(event) {
    event.waitUntil(caches.keys().then(cacheNames => {
        return Promise.all(cacheNames.map(thisCacheName => {
            if (thisCacheName !== cacheName) {
                console.log("Worker removing old cache: ", thisCacheName)
                return caches.delete(thisCacheName)
            }
        }))
    }))
})

self.addEventListener("fetch", function(event) {

    if (event.request.method !== "GET") {
        return;
    }

    var url = new URL(event.request.url)
    if (url.origin == "https://www.googleapis.com") {

        event.respondWith(cacheFirstWithExpiration(event.request))
        return;

    }

    event.respondWith(fetch(event.request).then(response => {
        const clone = response.clone();
        caches.open(cacheName).then(cache => {
            cache.put(event.request,
                clone)
        })
        return response;
    }).catch(() => {
        return caches.match(event.request).then(resp => {
            if (resp) {
                return resp;
            }
            return caches.match("./Audio.html")
        })
    }))
})

async function cacheFirstWithExpiration(req) {
    const cache = await caches.open(cacheName);

    // Check cache first
    const cachedResp = await cache.match(req);
    if (cachedResp) {
        return cachedResp;
    }

    // Fetch from network if not in cache
    const netResp = await fetch(req);
    if (netResp && netResp.ok) {
        // Clone the response before caching
        cache.put(req, netResp.clone());
    }

    return netResp;
}