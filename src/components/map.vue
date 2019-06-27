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
   <y-mapPanel :address ="address" :district="district" @changeMapColor="handleColorChange"  v-if="!showRoute"/>

  <div class="route"  v-if="showRoute" @click="clickOutSide">
    <el-form :model="ruleForm" :rules="rules" labelWidth="0" ref="ruleForm" label-width="100px" class="demo-ruleForm">
     <div style="display:flex">
      <el-form-item  prop="routeFrom" style="flex: 1">
        <el-input v-model="ruleForm.routeFrom" placeholder="起  请输入起点" id="routeFrom" ></el-input>
      </el-form-item>

   <el-form-item  prop="trafficType" style="width: 30%">
       <el-select v-model="ruleForm.trafficType" placeholder="请选择出行方式" >
          <el-option
            v-for="item in tripTypeMap"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
    </el-form-item>
     </div>
<!-- reverse按钮 -->
     <i class="el-icon-sort reverseButton" @click="reverseRoute"></i>


    <div style="display:flex">
       <el-form-item  prop="routeTo" style="flex: 1"> <el-input v-model="ruleForm.routeTo" placeholder="终  请输入终点" id="routeTo"> </el-input></el-form-item>
       <el-form-item  prop="selectedPolicy" style="width: 30%">
         <el-select v-model="ruleForm.selectedPolicy" placeholder="请选择规划策略"  :disabled="ruleForm.trafficType === 'Walking'">
          <el-option
            v-for="item in currentPolicyOption"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
     </div>
   
      <el-button type="primary" @click="beginRoute('ruleForm')"><span>搜索</span></el-button>
    </el-form>
  </div>

<!-- 底部开始按钮 -->
  <div class="beginTripSelf" v-if="!showRoute">
     <el-button  type="primary" @click="handleClick">{{buttonText}}</el-button>
  </div>

  <!-- 位置跟踪遮罩层 -->
  <transition name="slide"> 
     <y-tripStart v-if="showTripStart" ref="tripStart" :map="map" :tripType="tripType"/>
  </transition>

  <!-- 路线规划结果 -->
  <div   id="panelWrapper" :style="{height: isPanelCollapse ? '50%': '4%'}" v-show="showPanel">
    <div  class="collapse">
      <span>请选择合适路线</span>
      <span></span>
      <svg-icon :iconClass="isPanelCollapse? 'ico-two-down-arrow': 'ico-two-up-arrow'" @click="isPanelCollapse=!isPanelCollapse"></svg-icon>
      <el-button @click="confirm" type ="primary" size="mini">确定</el-button>
    </div>
    <div>
      <div id ="panel"></div>
    </div>
  </div>


  <!-- 确认dialog -->
 <div  class="saveConfirmDialog">
     <el-dialog
        title="本次出行"
        :visible.sync="dialogVisible"
        width="87%">
        <div style="display:flex;justify-content: space-between">
          <span>交通方式</span>
          <span>{{ruleForm.trafficType}}</span>
        </div>
        <div style="display:flex;justify-content: space-between">
          <span>出发地</span>
          <span>{{ruleForm.routeFrom}}</span>
        </div>
        <div style="display:flex;justify-content: space-between">
          <span>目的地</span>
          <span>{{ruleForm.routeTo}}</span>
        </div>
        <div style="display:flex;justify-content: space-between">
          <span>花费</span>
          <el-input-number v-model="spend"  :min="1"></el-input-number>
        </div>
        <div style="display:flex;justify-content: space-between">
          <span>日期</span>
          <span>{{curDate}}</span>
        </div>
        <div style="display:flex;justify-content: space-between">
          <span style="width: 12%">备注</span>
          <el-input v-model="remarks"></el-input>
        </div>

        <!--  嵌套dialog -->
        <el-dialog
          title="保存失败"
          :visible="!!saveErrorMessage"
          append-to-body
          width="85%"
          >
          <span>{{saveErrorMessage}}</span>
          <span slot="footer" class="dialog-footer">
          
            <el-button type="primary" @click="saveErrorMessage=''">确 定</el-button>
          </span>
        </el-dialog>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmSave">确认保存</el-button>
        </span>
      </el-dialog>
 </div>
 
 </div>
  
</template>
<script>
import { mapState } from "vuex";
import TripStart from "./tripStart.vue";
import MapPanel from "./mapPanel.vue";
import dayjs from 'dayjs';
import axios from 'axios';
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
      type: String
    },
    showRoute: {
      type: Boolean,
      default: false
    }
  },
  
  data() {
    const tripTypeMap = JSON.parse('[{"value":"Walking","label":"步行"},{"value":"Transfer","label":"公交/地铁"},{"value":"Riding","label":"骑行"},{"value":"Driving","label":"自驾"}]');
    
    return {
      // mapColor: this.mapColor,
      map: null,
      address: "",
      district: "",
      buttonText: "开始",
      positioning: false,
      loading: true,
      routeCoordinate: {},
      marker: null,
      longitude: "",
      latitude: "",
      showTripStart: false,
      tripTypeMap,
      policyMap: {},
      currentPolicyOption: [],
      showPanel: false,
      remarks:'',
      spend: 0,
      dialogVisible: false,
      saveErrorMessage:"",
      curDate: '',
      trafficDistance: '',
      isPanelCollapse: true,
      trafficTime: "",
      ruleForm: {
        routeFrom: '',
        routeTo: '',
        trafficType: 'Walking',
        selectedPolicy: ''
      },
      rules: {
        routeFrom: [
          {required: true, message: "请输入起点", trigger: "change"}
        ],
        routeTo: [
          {required: true, message: "请输入终点", trigger: "change"}
        ],
        selectedPolicy: [
          {required: true, message: "请选择出行策略", trigger: "change"}
        ]
      }
    };
  },
  // computed: {
    
  // },
  watch: {
   'ruleForm.trafficType': {
     handler: function(newV){
       this.ruleForm.selectedPolicy = newV ===  'Walking' ? 'Default': '';
       this.policyMap[newV] && this.policyMap[newV].length && (this.currentPolicyOption = this.policyMap[newV]);
      //  this.computeRules = newV === 'Walking' ? {routeFrom: this.rules.routeFrom,routeTo: this.rules.routeTo}: this.rules;
      //  console.log(this.computeRules)
     }, 
     // 代表在wacth里声明了这个方法之后立即先去执行handler方法
    immediate: true
   }
  },
  methods: {
    clickOutSide(e){
      document.querySelector("#panel") && (document.querySelector("#panel").innerHTML = '')
      // this.showPanel && (this.showPanel = false)
    },
    confirm(){
      // 存到数据库
      // 清空输入框
     
      this.curDate = dayjs().format("YYYY-MM-DD hh:ss")
      this.dialogVisible = true
    },
    confirmSave(){
      // 保存到数据库
      let params = {
        userId: this.$store.state.userInfo[0].userId,
        type: 'traffic',
        tripType: this.ruleForm.trafficType,
        distance: this.trafficDistance,
        time: this.trafficTime,
        date: this.curDate,
        Calorie: this.Calories,
        price: this.spend,
        startPlace: this.routeFrom,
        endPlace: this.routeTo,
        startCode: this.routeCoordinate.routeFrom,
        endCode: this.routeCoordinate.routeTo,
        mark: this.remarks

      };
      axios.post("http://localhost:4000/trip/saveTrip", params).then(res => {
        console.log(res);
        if(res.data.code){
           this.$message({
            showClose: true,
            message:'保存成功,此次记录已经上传',
            type:  'success'
          })
          this.showPanel = false;
          this.ruleForm.routeTo = '';
          this.ruleForm.routeFrom = '';
          this.$refs['ruleForm'].resetFields();
          this.dialogVisible = false
        } else {
        //   this.$alert(`<span style="color:red">${res.data.error}</span>`, '保存失败', {
        //   dangerouslyUseHTMLString: true
        // });
          this.saveErrorMessage = res.data.error
        }
       
      }).catch(err => {
        console.log(err)
      })
    },
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
    beginRoute(formName) {

      // 开始验证
      var self = this;
      this.$refs[formName].validate((valid) => {
         if(!valid) return false;
         // 验证通过   开始路线规划
        
          console.log(self.routeFrom, self.routeTo);
         
          // 设置驾车路线规划策略
          let tempOption = {
            map: self.map,
            autoFitView: true,
            panel: 'panel'
          }
          self.ruleForm.trafficType !== 'Walking' && (tempOption.policy = AMap[self.ruleForm.trafficType+'Policy'][self.ruleForm.selectedPolicy])
          self.ruleForm.trafficType === 'Transfer' && (tempOption.city = self.city)
          let trafficType = new AMap[self.ruleForm.trafficType](tempOption);
          trafficType.search(
            self.routeCoordinate.routeFrom,
            self.routeCoordinate.routeTo,
            function(status, result) {
              // 未出错时，result即是对应的路线规划方案
              console.log(status, result);
              if(status === 'error' || status === 'no_data'){
                 self.$message({
                  showClose: true,
                  message: '查不到信息，请修改起始路线',
                  type: 'error'
                });
              }else{
               self.showPanel = true
               if(self.ruleForm.trafficType === 'Transfer'){
                 // 无ruote you plan;
                  self.$nextTick(() => {
                    self.onSelectTranfer(result)
                  })
                  
               }else{
                 self.trafficTime = result.routes[0].time;
                 self.trafficDistance = result.routes[0].distance;
               }
                
              }
            }
          );
          
          
      });


      
    },
    onSelectTranfer(route){
      var self = this;
      let planTitles = document.querySelectorAll(".planTitle");
      let len = planTitles.length;
      const callback = (cur) => {
        // console.log(this)
        let  index = cur.currentTarget.getAttribute("index")
        let  selectedPlans = route.plans[index];
        self.spend = selectedPlans.cost;
        self.trafficTime = selectedPlans.time;
        self.trafficDistance = selectedPlans.transit_distance + selectedPlans.walking_distance
      }
      if(len){
        for(let i = 0; i<len;i++){
          let cur = planTitles[i];
          cur.removeEventListener("click", callback);
          cur.addEventListener("click", callback)
        }
      }
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
      if(this.showRoute) {
        self.placeSearch("routeFrom");
        self.placeSearch("routeTo");
      }
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
          self.ruleForm[key] = res.poi.name;
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
    },
   async getDrivingPlugin(trafficType){
     return new Promise((resolve, reject) => {
       this.map.plugin(`AMap.${trafficType}`, function(){
         resolve();
       })
     })
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
    aMapScript.onload = async function() {
      await self.init();
      self.loading = false;
      if(self.showRoute){
         // 初始化 规划插件
        let tempMap = self.tripTypeMap.map(x => self.getDrivingPlugin(x.value));
        Promise.all(tempMap).then(res => {
          self.policyMap = self.tripTypeMap.map(x => x.value).filter(x => x !=='Walking').reduce((o, item) => {
              let temp =  AMap[item + 'Policy'];
              let arr = []
              for(let  key in temp){
                arr.push({
                  value: key,
                  label: key
                })
              }
              o[item] = arr;
              return o
          }, {})
        })
      }
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
    top: 0px;
    z-index: 2;
    width: 100%;
    padding-bottom:20px;
    background-color:white;
    // left: 50%;
    // transform: translate(-50%);
    
    // .trafficType .el-input__suffix{
    //   width: 30%
    // }
    .reverseButton{
      display:block;
      margin-top:-16px;
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
  };
  #panelWrapper{
    position: absolute;
    bottom: 0;
    height: 50%;
    overflow-y: scroll;
    width: 100%;
    background-color: white;
    z-index: 1;
    // padding-bottom:30px;
    
  };
  .confirm{
    position: absolute;
    bottom: 0;
    left: 50%;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
    z-index: 1;
  };
  .collapse{
      // position: absolute;
      // top: 10px;
      // left: 2px;
      // width: 100%;
      margin-bottom: 11px;
      span{
        position:absolute;
        left: 2px;
      };
      button{
        position:absolute;
        right: 0;
      };
    }
  .saveConfirmDialog{
    .el-dialog__body div{
      margin-bottom: 10px
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
