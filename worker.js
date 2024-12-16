const cacheFiles = ["/Audio.html", "/Audio.js", "/Screenshot_20241216-125252_2.jpg"]

const cacheName = "v3";

self.addEventListener("install", (event) => {
    event.waitUntil(caches.open(cacheName).then(cache => {
        console.log("Worker adding file to cache: ", cache)
        return cache.addAll(cacheFiles)
    }))
})

self.addEventListener("activate", (event) => {
    event.waitUntil(caches.keys().then(cacheNames => {
        return Promise.all(cacheNames.map(thisCacheName => {
            if (thisCacheName !== cacheName) {
                console.log("Worker removing old cache: ", thisCacheName)
                return caches.delete(thisCacheName)
            }
        }))
    }))
})

self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") {
        console.log("Not to cache")
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
