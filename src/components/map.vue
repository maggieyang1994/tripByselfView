<template>
 <div id ="mapWrapper"  v-loading="loading"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">
    <!-- 地图 -->
   <div id="map" 
    v-loading="positioning"
    element-loading-text="定位中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">
   </div>

   <!-- 头部工具栏 -->
   <y-mapPanel :address ="address" :district="district" @changeMapColor="handleColorChange"/>

  <div class="route" v-if="false">
     <el-input v-model="routeFrom" placeholder="起  请输入起点" id="routeFrom">


     </el-input>
     <i class="el-icon-sort" @click="reverseRoute"></i>
     <el-input v-model="routeTo" placeholder="终  请输入终点" id="routeTo"></el-input>
     <el-button type="primary" @click="beginRoute" class="beginRoute"><span>开始</span></el-button>
  </div>

<!-- 底部开始按钮 -->
  <div class="beginTripSelf">
     <el-button  type="primary" @click="handleClick">{{buttonText}}</el-button>
  </div>

  <!-- 位置跟踪遮罩层 -->
  <transition name="slide"> 
     <y-tripStart v-if="showTripStart" ref="tripStart" :map="map" :tripType="tripType"/>
  </transition>
 
 </div>
  
</template>
<script>
import { mapState } from "vuex";
import TripStart from "./tripStart.vue";
import MapPanel from "./mapPanel.vue"
const typeMap = {
  徒步: "Walking",
  跑步: "walking",
  骑行: "Riding",
  自驾: "Driving"
};
// const policyMap = {
//   'Walking':
// }
export default {
  name: "y-map",
  components: {
    "y-tripStart": TripStart,
    "y-mapPanel": MapPanel
  },
  props: {
    tripType: {
      type: String,
      require: true
    }
  },
  
  data() {
    return {
      // mapColor: this.mapColor,
      map: null,
      address: "",
      district: "",
      
      positioning: false,
      loading: true,
      routeFrom: "",
      routeTo: "",
      routeCoordinate: {},
      marker: null,
      longitude: "",
      latitude: "",
      showTripStart: false,
      buttonText: "开始"
    };
  },
  watch: {
    
  },
  methods: {
    handleClick(){
      if(this.buttonText === "开始"){
        this.buttonText = "结束";
        this.showTripStart = true
      } else if (this.buttonText === '结束'){
        this.buttonText = '退出';
        this.$refs.tripStart.tripEnd(this);
      }else {
       this.buttonText = "开始";
       this.$emit("backToTrip", this.$refs.tripStart.distance)
      }
    },
    handleColorChange(value){
      this.map.setMapStyle(`amap://styles/${value}`);
    },
    reverseRoute() {
      [this.routeFrom, this.routeTo] = [this.routeTo, this.routeFrom];
      let temp = JSON.parse(JSON.stringify(this.routeCoordinate));
      this.routeCoordinate.routeFrom = temp.routeTo;
      this.routeCoordinate.routeTo = temp.routeFrom;
    },
    beginRoute() {
      // 开始路线规划
      var self = this;
      console.log(self.routeFrom, self.routeTo);
      AMap.plugin("AMap.Driving", function() {
        // 设置驾车路线规划策略

        var driving = new AMap.Driving({
          // 驾车路线规划策略，AMap.DrivingPolicy.LEAST_TIME是最快捷模式
          policy: AMap.DrivingPolicy.LEAST_TIME
        });

        driving.search(
          self.routeCoordinate.routeFrom,
          self.routeCoordinate.routeTo,
          function(status, result) {
            // 未出错时，result即是对应的路线规划方案
            console.log(status, result);
          }
        );
      });
    },
    async init() {
      var self = this;
      this.map = new AMap.Map("map", {
        resizeEnable: true,
        zoom: 17
      });
      this.map.setMapStyle(`amap://styles/${this.$store.state.mapColor}`);

      // 添加缩小放大
      this.map.plugin("AMap.ToolBar", function() {
        //异步加载插件
        var toolbar = new AMap.ToolBar();
        self.map.addControl(toolbar);
      });
      // 初始定位
      await this.getPosition();

      // 添加输入提示
      // self.placeSearch("routeFrom");
      // self.placeSearch("routeTo");
    },
    placeSearch(key) {
      var self = this;
      this.map.plugin("AMap.Autocomplete", function() {
        let autoOptions = {
          city: self.city,
          input: key
        };
        let autoComplete = new AMap.Autocomplete(autoOptions);
        //监听选中事件
        AMap.event.addListener(autoComplete, "select", function(res) {
          debugger;
          self[key] = res.poi.name;
          // 保存经纬度
          self.routeCoordinate[key] = [res.poi.location.Q, res.poi.location.P];
        });
      });
    },
    async getPosition() {
      // 异步加载 插件geolocation 加载成功执行回掉
      var self = this;
      this.positioning = true;
      return new Promise((resolve, reject) => {
        this.map.plugin("AMap.Geolocation", function() {
          var geolocation = new AMap.Geolocation({
            // 是否使用高精度定位，默认：true
            enableHighAccuracy: true,
            // 设置定位超时时间，默认：无穷大
            timeout: 10000,
            // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
            buttonOffset: new AMap.Pixel(10, 20),
            //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            zoomToAccuracy: true,
            //  定位按钮的排放位置,  RB表示右下
            buttonPosition: "LB",
            showButton: true,
            showMarker: false,
            showCircle: false
          });
          self.map.addControl(geolocation);
          geolocation.getCurrentPosition();
          AMap.event.addListener(geolocation, "complete", onComplete);
          AMap.event.addListener(geolocation, "error", onError);

          function onComplete(data) {
            self.address = data.formattedAddress;
            self.district = data.addressComponent.district;
            self.positioning = false;
            self.addressComponent = JSON.parse(
              JSON.stringify(data.addressComponent)
            );
            self.city = data.addressComponent.city;
            self.latitude = data.position.P;
            self.longitude = data.position.Q;
            self.drawMarker(self.longitude, self.latitude);
            resolve();
            // self.routeFrom = self.district + self.addressComponent.street + self.addressComponent.township + self.addressComponent.streetNumber
          }

          function onError(data) {
            // 定位出错
            this.$message({
              showClose: true,
              message: "定位失败",
              type: "error"
            });
            reject(data);
          }
        });
      });
    },
    async drawMarker(long, lati) {
      // let gaoDeLat = await this.toGaodeCor([this.longitude, this.latitude]);
      // 先删除之前的marker
      this.marker && this.map.remove(this.marker);
      this.marker = new AMap.Marker({
        position: new AMap.LngLat(long, lati), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        title: "你在这里"
      });

      // 将创建的点标记添加到已有的地图实例：
      this.map.add(this.marker);
    }
  },
  mounted() {
    // 动态加载js
    let self = this;
    let aMapScript = document.createElement("script");
    aMapScript.setAttribute(
      "src",
      "https://webapi.amap.com/maps?v=1.4.15&key=651f51a67d2e3cdaaea1e63d784cec0a"
    );
    document.head.appendChild(aMapScript);
    aMapScript.onload = function() {
      self.init();
      self.loading = false;
    };
  }
};
</script>
<style scoped lang="scss">
#mapWrapper {
  width: 100%;
  height: 100%;
  #map {
    height: 100%;
    z-index: 1;
  }
  
  .route {
    position: fixed;
    top: 100px;
    z-index: 2;
    width: 60%;
    // left: 50%;
    // transform: translate(-50%);
    .beginRoute {
      margin-top: 30px;
    }
  };
  .beginTripSelf{
    position: fixed;
    bottom: 40px;
    width: 40%;
    left: 50%;
    transform: translate(-50%);
    z-index: 4;
    button{
      display: inline-block;
      width: 100%;
    }
  }
}

// 动画
.slide-enter-active {
  animation: fade-in .5s;
}
@keyframes  fade-in{
  0% {
    height: 0;
  } 
  50% {
    height: 50%;
  }
  100% {
    height: 100%;
  }
}

</style>
