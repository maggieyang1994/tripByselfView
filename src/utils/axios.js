import axios from 'axios';
import store from '@/store';
import router from  '@/router'


// axios 发送的请求 默认不携带cookie
// 携带cookie 前端和后端同时设置才有效
// Access-Control-Allow-Credentials:true  Access-Control-Allow-origin:http://localhost:8080
// axios.defaults.withCredentials = true

const http = (url, method,params) => {
  let baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'https://triprecord-server.herokuapp.com';
// let baseURL = 'https://triprecord-server.herokuapp.com'
  // 封装axios模块  实现统一错误处理 和loading 


  // 请求拦截
  axios.interceptors.request.use(config => {
    store.commit('setLoading', true);
    return config
  }, err => {
    // this.$message({
    //   showClose: true,
    //   message: '请求错误：' + JSON.stringify(err),
    //   type:  'error'
    // })
    // 调到error页面
    console.log(error)
    router.push({name: 'error'})

  });
  //响应拦截
  axios.interceptors.response.use(res => {
   store.commit('setLoading', false);
   if(res.status === 200) return res;

  }, error => {
    store.commit('setLoading', false);
    router.push({name: 'error', params: {errorMessages: error.message}})
  })
  return axios[method](baseURL + url, params)
}
window.myAxios = http;