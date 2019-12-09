<template>
   <div class="tripWrapper" :style="{backgroundImage:'url(' + $store.state.ngixPath+'bg.png)'}">
     <div class="tab" v-if="!showMap">
       <!--  顶部导航 -->
       <el-tabs v-model="activeTab"  :stretch="true">
        <el-tab-pane  v-for="item in tripData" :label="item.tripType.substring(0,2)" :name="item.tripType" :key="item.tripType">
          <!-- {{item.distance}} -->
          <div class="tripCenter">
            <p>累计{{item.tripType}}</p>
            <h1>{{Number(item.distance).toFixed(2)}}</h1>
            <p>本月累计{{item.tripType}}{{Number(item.distance).toFixed(2)}}公里</p>
          </div>
          <div class="beginTrip">
            <el-button type="primary" @click="beginTrip()">开始{{item.tripType.substring(0,2)}}</el-button>
          </div>
        </el-tab-pane>
       </el-tabs>
       
     </div>
    
       <router-view/>
 </div>
</template>
<script>
// const bottomTripMap = {
//   icon
// }
// import axios from 'axios'
export default {
  name: "trip",

  data() {
    return {
      activeTab: '徒步出行',
      tripData: [],
      showMap: false
    }
  },
  watch: {
    '$route.params': {
      handler: function(newV){
        let {showMap, distance} = newV;
        let curTripIndex = this.tripData.findIndex(x => x.tripType === this.activeTab);
        let curTrip = this.tripData.find(x => x.tripType === this.activeTab)
        if(distance) this.$set(this.tripData, curTripIndex, {...curTrip, distance: curTrip.distance + distance * 1})
        if(showMap === false) this.showMap = false
      },
      deep: true
    },
    $route(to, from){
      // this.activeName = to.name;
      // console.log(to, from);
      if(to.name==='trip') this.showMap = false
    }
  },
  methods: {
    beginTrip(){
      this.showMap = true
      this.$router.push({name: 'tripMap', params: {tripType: this.activeTab}});
      // practise 简单请求 复杂请求

      // axios.get('https://triprecord-server.herokuapp.com/trip/getTotalTrips').then(res => {
      //   console.log(res)
      // })

      // practise service worker push nofication
      // myAxios('/user/sendNotifaction', 'get').then(res => {
      //   console.log(res)
      // })
    },
  },
  mounted(){
    myAxios('/trip/getTrips','get').then(res => {
      this.tripData = ["骑车出行", "跑步出行","自驾出行","徒步出行"].map(x => {
       let temp = res.data.find(y => y.tripType === x);
       return {
         tripType: x,
         distance: (temp && temp.distance) || 0
       }
     })
    })
  }
}
</script>
<style lang="scss" scoped>
.tripWrapper{
  // background-image: url("../assets/img/bg.png");
  width:100%;
  height:100%;
  background-size: cover;
  position: absolute;
  top: 0;
  bottom: 0;
  .tab{
    padding-top:20px;
    text-align:center;
    .tripCenter{
      margin-top:30px;
      margin-bottom: 30px;
      display:inline-block;
      padding:24px;
      border: 2px dashed #ccc;
      border-radius: 50%;
    }
  };
  .tripMap{
    height:100%
  }
}

div.el-message-box {
  width: 100%!important;
  word-break: break-all;
  word-wrap: break-word;
}

</style>


