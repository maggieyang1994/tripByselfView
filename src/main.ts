import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import element from 'element-ui';
import plugins from './components/index.js';
import 'element-ui/lib/theme-chalk/index.css';
// iconfont
import './assets/css/iconfont.css'

Vue.use(element)
Vue.use(plugins)
Vue.config.productionTip = false;


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
