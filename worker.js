const cacheFiles = ["/Audio.html", "/Audio.js"]

const cacheName = "v4";

const dura = 7 * 24 * 60 * 60 * 1000;

self.addEventListener("install", function(event) {
    event.waitUntil(caches.open(cacheName).then(cache => {
        console.log("Worker adding file to cache: ", cache)
        return cache.addAll(cacheFiles)
    }).then(() => {
        return self.skipWaiting();
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
    }).then(() => {
        return self.clients.claim();
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
            return caches.match("/Audio.html")
        })
    }))
})

async function cacheFirstWithExpiration(req) {

    try {
        /* code */
        const cache = await caches.open(cacheName);

        // Check cache first
        const cachedResp = await cache.match(req);
        var resps;

        if (cachedResp) {
            resps = cachedResp;
        } else {
            // Fetch from network if not in cache
            resps = await fetch(req);

            if (resps.ok) {
                // Clone the response before caching
                await cache.put(req, resps.clone());
            }
        }

        let data = await resps.json()

        if (!data || !data.items) {
            return;
        } else {
            console.log(data)
            return resps;
        }

    } catch (e) {
        console.error("Error: ", e)
        return new Response("Failed to fetch and no cached version available.", {
            status: 503,
            statusText: "Service unavailable."
        });
    }

}
