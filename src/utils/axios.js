import axios from 'axios'
const http = (url, method,params) => {
  let baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'https://triprecord-server.herokuapp.com';

  // 封装axios模块
  // return new Promise((resolve, reject) => {
  //   let instance = axios.create({
  //      baseURL
  //   });
  //   // 请求拦截器
  //   instance.interceptors.request.use(
  //     config => {
  //       store.commit("setLoading", true)
  //     }
  //   )w
  // })
  return axios[method](baseURL + url, params)
}
window.myAxios = http;