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

import Trend from './views/trend.vue'
import analysis from './views/analysis.vue'
import userDetail from './views/userDetail.vue'


import Fans from './views/fans.vue'

Vue.use(Router);
//  如果这里不export routes 其他页面引入的时候拿不到routes
// New Router 返回的是undefine 所以要额外export

export const mathRoutes = [
  {
    path: '/trend',
    name: Trend.name,
    component: Trend,
    meta: {
      text: '出行趋势',
      icon: 'trending'
    }
  },
  {
    path: '/analysis',
    name: analysis.name,
    component: analysis,
    meta: {
      text: '数据分析',
      icon: 'analysis'
    }
  },
  {
    path: '/userDetail',
    name: userDetail.name,
    component: userDetail,
    meta: {
      text: '信息总览',
      icon: 'detail'
    }
  },
  {
    path: '/fans/:id',
    props: true,
    name: Fans.name,
    component: Fans,
  }
]
export const routes = [
  {
    path: '/',
    redirect: "/trip"
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
    meta: {
      text: '出行',
      icon: 'home',
    },
    children: [
      {
        path: 'tripMap',
        component: TripMap,
        name: TripMap.name,
        props: true,
        meta: {
          text: "tripMap"
        }
      }
    ]
  },
  {
    path: '/traffic',
    name: Traffic.name,
    component: Traffic,
    meta: {
      text: '交通',
      icon: 'location'
    }
  },
  {
    path: '/history',
    name: History.name,
    component: History,
    meta: {
      text: '历史',
      icon: 'historychoose'
    },
    children: [
      {
        path: 'detail',
        name: historyDetail.name,
        component: historyDetail,
        props: true,
        meta: {
          text: "title"
        }
      }
     
    ]
  },
  {
    path: '/myinfo',
    name: Myinfo.name,
    component: Myinfo,
    meta: {
      text: '我的',
      icon: 'people'
    },
  }
]
var router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routes.concat(mathRoutes)
})
router.beforeEach((to, from, next) => {
  if(to.name!=="login" && !Object.keys(store.state.userInfo).length){
    next("/login")
  } else {
    next()
  }
})
export default router