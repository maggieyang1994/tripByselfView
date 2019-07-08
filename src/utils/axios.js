import axios from 'axios';
import store from '@/store';
import router from  '@/router'

const http = (url, method,params) => {
  let baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'https://triprecord-server.herokuapp.com';

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