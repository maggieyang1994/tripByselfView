// The files we want to cache
// const webpush = require('web-push');
let cacheName = 'rinima';
// 缓存文件和请求路径
let cacheFile = [


    'https://webapi.amap.com/maps?v=1.4.15&key=651f51a67d2e3cdaaea1e63d784cec0a',
    'https://webapi.amap.com/maps/cookie?key=amap_ver&value=1571644530085&callback=jsonp_499535_&platform=JS&logversion=2.0&appname=http%3A%2F%2Flocalhost%3A8080%2FtripByselfView%2Ftraffic&csid=9F925999-1BA4-4574-9C17-02B458C46724&sdkversion=1.4.15'

]


self.addEventListener("install", function (e) {
    //   以下情况都会触发 Installation：

    // service worker 没有被注册过 第一次注册
    //  当改过service worker.js 这个文件的时候

    self.skipWaiting();
    // 如果没有skipWaiting   当改变了serviceWorker.js的时候 install完成之后会进入waiting状态
    // 因为这个时候旧的service worker还在工作  还是会加载之前的旧的service worker
    // 当所有旧的浏览器窗口都关闭的时候 浏览器才会加载新的serviceworker.js
    // self.skipWaiting 可以避免这个状态

    console.log("install")
    // 确保安装成功后 添加文件到缓存
    e.waitUntil(
        caches.open(cacheName).then(cache => {
            return cache.addAll(cacheFile)
        })
    )

});
self.addEventListener('activate', event => {
    // 每次更新 serviceworker 页面刷新的时候 会触发activate 激活钩子   这里适合做过期资源释放的事情

    // waitUntil 延长时间寿命 以保证waitUntill中的事件完成 才会进入下一个状态
    // waitUntil接收一个Promise
    event.waitUntil(
        caches.keys().then(cachesName => {
            return Promise.all(cachesName.map(x => {
                if (x !== cacheName) {
                    return caches.delete(x)
                }
            }))

        })
    )


    console.log('Service Worker 已激活，刷新页面后的请求都会走Service Worker');
});

self.addEventListener("fetch", function (e) {
    console.log(e, 'fetch');
    let cloneRequest = e.request.clone()
    e.respondWith(
        fetch(cloneRequest).then(response => {
           let cloneResponse = response.clone()
           caches.open(cacheName).then(cache => {
               console.log("res", cloneResponse)
               cache.put(e.request, cloneResponse)
           });
           console.log('network online')
           return response
       }).catch(() => {
           console.log('network offline, use cache')
           return caches.match(e.request)
       })
   )
})



//  推送
self.addEventListener("push", function (event) {
    console.log("接受到push通知", event);
    var data = event.data.json();
    console.log(data)
    event.waitUntil(
        self.registration.showNotification(data.title, data)
    )
})


// 添加notificationclick事件监听器，在点击notification时触发
self.addEventListener('notificationclick', function (event) {
    // 关闭当前的弹窗
    event.notification.close();
    // 在新窗口打开页面
    event.waitUntil(
        clients.openWindow('https://google.com')
    );
});

// // 触发一条通知
// self.registration.showNotification('您有新消息', {
//     body: 'Hello Service Worker',
//     icon: './images/logo/logo152.png',
// });



//  页面关闭之后  serviceWorker会进入stop状态  定时器会关闭  打开页面后如果  有命中addEventListener  中的事件 会重新激活
// setInterval(function(){
//     fetch("http://localhost:5000/trip/getTrips").then(data => {
//         console.log(data)
//     })
// }, 3000)