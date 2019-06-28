import Vue from 'vue'
import Router from 'vue-router'
import store from "./store";
import Login from './views/login.vue'
import Trip from './views/trip.vue'
import TripMap from './views/tripMap.vue'


import Traffic from './views/traffic.vue'

import History from './views/history.vue'
import historyDetail from './views/historyDetail.vue'

import Myinfo from './views/myinfo.vue'

Vue.use(Router)

 var router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: Trip.name,
      component: Trip,
      props: true,
    },
    {
      path: '/login',
      name: Login.name,
      component: Login
    },
    {
      path: '/trip',
      name: Trip.name,
      component: Trip,
      props: true,
      children: [
        {
          path: 'tripMap',
          component: TripMap,
          name: TripMap.name,
          props: true
        }
      ]
    },
    {
      path: '/traffic',
      name: Traffic.name,
      component: Traffic
    },
    {
      path: '/history',
      name: History.name,
      component: History,
      children: [
        {
          path: 'detail',
          name: historyDetail.name,
          component: historyDetail,
          props: true
        }
      ]
    },
    {
      path: '/myinfo',
      name: Myinfo.name,
      component: Myinfo
    }
  ]
  
})
router.beforeEach((to, from, next) => {
  if(to.name!=="login" && !Object.keys(store.state.userInfo).length){
    next("/login")
  } else {
    next()
  }
})
export default router