import Vue from 'vue'
import Router from 'vue-router'
import store from "./store";
import Login from './views/login.vue'
import Trip from './views/trip.vue'

Vue.use(Router)

 var router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      name: Login.name,
      component: Login
    },
    {
      path: '/trip',
      name: Trip.name,
      component: Trip
    }
  ],
  
})
router.beforeEach((to, from, next) => {
  if(to.name!=="login" && !Object.keys(store.state.userInfo).length){
    next("/login")
  } else {
    next()
  }
})
export default router