const cacheFiles = ["/Audio.html", "/Audio.js"]

const cacheName = "v3";
const cacheName2 = "video_cache_v1";

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

    const cache = await caches.open(cacheName2)
    const resp = cache.match(req)
    console.log(resp)

    if (resp) {

        const cacheTime = new Date(resp.headers.get("date")).getTime()
        const now = Date.now();

        if (now - cacheTime < dura) {
            return resp;
        } else {
            await caches.delete(req);
        }

    }

    const net_resp = await fetch(req);
    if (net_resp.ok) {
        const cloned = net_resp.clone()
        cache.put(req, cloned);
    }
    return net_resp;

}
