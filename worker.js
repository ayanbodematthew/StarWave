const cacheFiles = ["/Audio.html", "/Audio.js"]

const cacheName = "v4";

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

        event.respondWith(async () => {
            return await caches.match(event.request).then(resp => {

                if (resp) {
                    console.log(resp)
                    return resp;
                }

            }).catch(() => {

                let resps = fetch(event.request)
                resps.then(respy => {
                    let clone = respy.clone()
                    caches.open(cacheName).then(cache => {
                        cache.put(event.request, clone)
                    })
                    return respy;
                })

            })

        })

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