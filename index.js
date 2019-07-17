if(navigator.serviceWorker){
  navigator.serviceWorker.register("./serviceWorker.js").then(function(res){
    console.log("service worker 注册成功", res)
  }).catch(e => {
    console.log(e.message)
  })
}
console.log('rinima')