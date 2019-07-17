// The files we want to cache
let cacheName = 'rinima';
// 缓存文件和请求路径
let cacheFile = [
    '/index.html',
    '/manifest.json',
    '/trip/getTrips',
    'https://triprecord-server.herokuapp.com/trip/getTrips'

]


self.addEventListener("install", function(e){
    self.skipWaiting()
    // 确保安装成功后 添加文件到缓存
    e.waitUntil(
        caches.open(cacheName).then(cache => {
            return cache.addAll(cacheFile)
        })
    )

});

self.addEventListener("fetch", function(e){
    console.log("捕捉到fetch请求")
    e.respondWith(
        caches.match(e.request).then(response => {
            // 如果缓存有 直接返回缓存 否则就存到缓存中

            // 缓存请求路径
            let cloneRequest = e.request.clone()
            if(response) {
                console.log("读取缓存")
                return response
            }
            else {
                console.log("没有缓存  直接请求")
               return  fetch(cloneRequest).then(response => {
                    let cloneResponse = response.clone()
                    console.log(response.type)
                    if(!response || response.status !== 200){
                        return response
                    }else{
                        caches.open(cacheName).then(cache => {
                            cache.put(e.request, cloneResponse)
                        })
                    }
                    return response
                })
            }
        })
    )
})