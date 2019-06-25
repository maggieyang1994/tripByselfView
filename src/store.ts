import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: JSON.parse(localStorage.getItem("userInfo") || '{}'),
    mapColor: localStorage.getItem("mapColor") || 'normal',
    dialogMap: {}
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
    }
  },
  actions: {

  }
})
