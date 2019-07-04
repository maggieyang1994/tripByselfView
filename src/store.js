import Vue from 'vue'
import Vuex from 'vuex'
import { routes, mathRoutes} from './router'
import axios from 'axios';
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    userInfo: JSON.parse(localStorage.getItem("userInfo") || '{}'),
    mapColor: localStorage.getItem("mapColor") || 'normal',
    dialogMap: {},
    routes,
    totalTrips: [],
    mathRoutes
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
    }
  },
  actions: {
    setTrips({commit}){
      axios.get("/trip/getTotalTrips").then(res => {
        commit("setTrips", res.data);
      })
    }
  }
})
