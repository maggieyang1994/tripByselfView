self.addEventListener("install", function(e){
    self.skipWaiting()
    console.log('install', e)
})