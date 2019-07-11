import Vue from 'vue'
import App from './App.vue'
//  这里 store里面引入了router  所以  store一定要先引入
import store from './store'
import router from './router'

import element from 'element-ui';
import plugins from './components/index.js';
import 'element-ui/lib/theme-chalk/index.css';
// iconfont
import "./icons"


Vue.use(element)
Vue.use(plugins)
Vue.config.productionTip = false;
import './utils/axios'

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
