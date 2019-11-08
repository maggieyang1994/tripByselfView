import Vue from 'vue'
import Vuex from 'vuex'
import { routes, mathRoutes} from './router'
// import localMixin from "mixin/localMixin.js"
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    loading: false,
    userInfo: JSON.parse(localStorage.getItem("userInfo") || '{}'),
    mapColor: localStorage.getItem("mapColor") || 'normal',
    dialogMap: {},
    routes,
    totalTrips: [],
    mathRoutes,
    // chrome 会自动将http转为https
    ngixPath: 'https://fedev.me/images'
  },
  mutations: {
    setUserInfo(state, data){
      state.userInfo = data
    },
    setMapColor(state,data) {
      state.mapColor = data
    },
    setDialogMap(state, data){
      // state.dialogMap = {};
      state.dialogMap = JSON.parse(JSON.stringify(data))
    },
    setTrips(state, data){
      state.totalTrips = data
    },
    setLoading(state, data){
      state.loading = data
    }
  },
  actions: {
    setTrips({commit}){
      myAxios("/trip/getTotalTrips", 'get').then(res => {
        res && commit("setTrips", res.data);
      })
    }
  }
})
