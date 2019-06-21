<template>
   <div class="tripWrapper">
     <div class="tab" v-if="!showMap">
       <el-tabs v-model="activeTab"  :stretch="true">
        <el-tab-pane  v-for="item in tripData" :label="item.tripType" :name="item.tripType" :key="item.tripType">
          <!-- {{item.distance}} -->
          <div class="tripCenter">
            <p>累计{{item.tripType}}</p>
            <h1>{{item.distance}}</h1>
            <p>本月累计{{item.tripType}}{{item.distance}}公里</p>
          </div>
          <div class="beginTrip">
            <el-button type="primary" @click="beginTrip()">开始{{item.tripType}}</el-button>
          </div>
        </el-tab-pane>
       </el-tabs>
       
     </div>
     <div class="tripMap" v-else>
        <y-map :tripType="activeTab"/>
     </div>
 </div>
</template>
<script>
import axios from 'axios'
export default {
  name: "trip",
  data() {
    return {
      activeTab: '徒步',
      tripData: [],
      showMap: false
    }
  },
  methods: {
    beginTrip(){
      this.showMap = true
    }
  },
  mounted(){
    axios.get("http://localhost:4000/trip").then(res => {
      this.tripData = res.data
    })
  }
}
</script>
<style lang="scss" scoped>
.tripWrapper{
  background-image: url("../assets/img/bg.png");
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

</style>


