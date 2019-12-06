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
  <slot name="headerPanel" :address ="address" :district="district" :handleColorChange="handleColorChange"></slot>


  <!--  路线规划 -->
   <y-routeConfig :map="map" :city="city" v-if="loadRoute && showRoute"></y-routeConfig>



  <!-- 底部开始按钮 -->
   <slot name="bottom" :buttonText="buttonText" :positioning='positioning'></slot>
  

  <!-- 位置跟踪遮罩层 -->
  <transition name="slide"> 
     <y-tripStart v-if="showTripStart" ref="tripStart" :map="map" :tripType="tripType" @drawPolyline="drawPolyline"/>
  </transition>


 </div>
  
</template>
<script>
import routeConfig from "./map/routeConfig.vue";
import TripStart from "./map/tripStart.vue";
export default {
  name: "y-map",
  components: {
    "y-tripStart": TripStart,
    "y-routeConfig": routeConfig
  },
  props: {
    tripType: {
      type: String
    },
    showRoute: {
      type: Boolean,
      default: false
    }
  },
  
  data() {
   return {
      // mapColor: this.mapColor,
      map: null,
      address: "",
      district: "",
      buttonText: "开始",
      positioning: false,
      loading: true,
      loadRoute: false,
 
      marker: null,
      longitude: "",
      latitude: "",
      showTripStart: false
    };
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

      
    },
    async getPosition() {
      // 异步加载 插件geolocation 加载成功执行回掉
      var self = this;
      this.positioning = true;
      return new Promise((resolve, reject) => {
        self.map.plugin("AMap.Geolocation", function() {
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
    },
    drawPolyline(path) {
      var self = this;
      // 先删除之前的折线
      this.map.plugin("AMap.PolyEditor", function () {
        self.polyline && self.map.remove(self.polyline);
        // 创建折线实例
        self.polyline = new AMap.Polyline({
          path,
          strokeWeight: 10, // 线条宽度s
          strokeColor: '#fff', // 线条颜色
          isOutline: true,	// 是否描边
          outlineColor: 'red', // 描边颜色
          borderWeight: 5, // 描边宽度
          lineJoin: 'round', // 折线拐点连接处样式
          zIndex: 1000
        });
        // 将折线添加至地图实例
        self.map.add(self.polyline);
      })
    },
  },
  created() {
    // 在组件挂载之前   加载js
    // 动态加载js
    let self = this;
    let aMapScript = document.createElement("script");
    aMapScript.setAttribute(
      "src",
      "https://webapi.amap.com/maps?v=1.4.15&key=651f51a67d2e3cdaaea1e63d784cec0a"
    );
    document.head.appendChild(aMapScript);
    aMapScript.onload = async function() {
      await self.init();
      // init完毕之后  告诉其爸爸 init完成了
      self.$emit("update:isInit", false)
      self.loading = false;
      self.loadRoute = true
    };


    // 监听来自mapPanel的事件
    this.$on('handleColorChange', this.handleColorChange);
    this.$on('getPosition', this.getPosition)
    this.$on('handerButtonClick', this.handleClick)
  }
};
</script>
<style scoped lang="scss">
#mapWrapper {
  width: 100%;
  height: 100%;
  #map {
    height: 100%;
    z-index: 0;
  }
  .beginTripSelf{
    position: fixed;
    bottom: 80px;
    width: 40%;
    left: 50%;
    transform: translate(-50%);
    z-index: 4;
    button{
      display: inline-block;
      width: 100%;
    }
  };
 
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
