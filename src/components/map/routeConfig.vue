<template>
 <div class="routeWrapper">
  <div class="route"  @click="clickOutSide">
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

  <!-- panel -->
  <div   id="panelWrapper" :style="{height: isPanelCollapse ? '50%': '4%'}" v-show="showPanel">
    <div  class="collapse">
      <span>请选择合适路线</span>
      <span></span>
      <svg-icon :iconClass="isPanelCollapse? 'ico-two-down-arrow': 'ico-two-up-arrow'" @click="isPanelCollapse=!isPanelCollapse"></svg-icon>
      <el-button @click="dialogVisible=true" type ="primary" size="mini">确定</el-button>
    </div>
    <div>
      <div id ="panel"></div>
    </div>
  </div>


  <!-- dialog -->
  <div  class="saveConfirmDialog">
     <el-dialog
        title="本次出行"
        :visible.sync="dialogVisible"
        width="87%">
        <div style="display:flex;justify-content: space-between">
          <span>交通方式</span>
          <span>{{tripTypeMap.find(x => x.value === ruleForm.trafficType).label}}</span>
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
          <el-input-number v-model="panelMessage.spend"  :min="0"></el-input-number>
        </div>
        <div style="display:flex;justify-content: space-between">
          <span>日期</span>
          <span>{{panelMessage.curDate}}</span>
        </div>
        <div style="display:flex;justify-content: space-between">
          <span style="width: 12%">备注</span>
          <el-input v-model="panelMessage.remarks"></el-input>
        </div>

   
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

import dayjs from 'dayjs';
import axios from 'axios';
export default {
  props: {
    map: {
      type: Object,
      require: true
    },
    city: {
      type: String,
      require: true
    }
  },
  data(){
    const tripTypeMap = JSON.parse('[{"value":"Walking","label":"步行"},{"value":"Transfer","label":"公交/地铁"},{"value":"Riding","label":"骑行"},{"value":"Driving","label":"自驾"}]');
    return {
      routeCoordinate: {},
      policyMap: {},
      currentPolicyOption: [],
      tripTypeMap,
      ruleForm: {
        routeFrom: '',
        routeTo: '',
        trafficType: 'Walking',
        selectedPolicy: 'Default'
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
      },


      // panel
      
      showPanel: false,
      dialogVisible: false,
      saveErrorMessage:"",
      isPanelCollapse: true,
      
      panelMessage: {
        remarks:'',
        curDate: '',
        trafficTime: "",
        trafficDistance: '',
        spend: 0
      }
    }
  },
  methods: {
    clickOutSide(e){
      // document.querySelector("#panel") && (document.querySelector("#panel").innerHTML = '')
      // this.showPanel && (this.showPanel = false)
    },
    reverseRoute() {
      [this.ruleForm.routeFrom, this.ruleForm.routeTo] = [this.ruleForm.routeTo, this.ruleForm.routeFrom];
      let temp = JSON.parse(JSON.stringify(this.routeCoordinate));
      this.routeCoordinate.routeFrom = temp.routeTo;
      this.routeCoordinate.routeTo = temp.routeFrom;
    },
    async getDrivingPlugin(trafficType){
     var self = this;
     return new Promise((resolve, reject) => {
       AMap.plugin(`AMap.${trafficType}`, function(){
         resolve();
       })
     })
   },
    placeSearch(key) {
      var self = this;
      AMap.plugin("AMap.Autocomplete", function() {
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
    beginRoute(formName) {
      // 开始验证
      var self = this;
      this.$refs[formName].validate((valid) => {
         if(!valid) return false;
         // 验证通过   开始路线规划
         // 设置驾车路线规划策略
         // 先将之前的清空
         document.querySelector("#panel") && (document.querySelector("#panel").innerHTML = '')
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
               self.showPanel = true;
               self.isPanelCollapse = true;
               if(self.ruleForm.trafficType === 'Transfer'){
                 // 无ruote you plan;
                  self.$nextTick(() => {
                    self.onSelectTranfer(result)
                  })
                  
               }else{
                 self.panelMessage.trafficTime = result.routes[0].time;
                 self.panelMessage.trafficDistance = result.routes[0].distance;
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
        self.panelMessage.spend = selectedPlans.cost;
        self.panelMessage.trafficTime = selectedPlans.time;
        self.panelMessage.trafficDistance = selectedPlans.transit_distance + selectedPlans.walking_distance
      }
      if(len){
        for(let i = 0; i<len;i++){
          let cur = planTitles[i];
          cur.removeEventListener("click", callback);
          cur.addEventListener("click", callback)
        }
      }
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
          this.spend = 0;
          this.remarks = '';
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
  },
  watch: {
   'ruleForm.trafficType': {
     handler: function(newV){
       this.ruleForm.selectedPolicy = newV ===  'Walking' ? 'Default': '';
       this.policyMap[newV] && this.policyMap[newV].length && (this.currentPolicyOption = this.policyMap[newV]);
      //  this.computeRules = newV === 'Walking' ? {routeFrom: this.rules.routeFrom,routeTo: this.rules.routeTo}: this.rules;
      //  console.log(this.computeRules)
     }, 
     // 代表在wacth里声明了这个方法之后立即先去执行handler方法
    // immediate: true
   }
  },
  mounted(){
      
      // 初始化 规划插件
    var self = this;
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
    });

    // 路线提示
  this.placeSearch("routeFrom");
  this.placeSearch("routeTo");
  }
}
</script>
<style scoped lang="scss">
.route {
    position: fixed;
    top: 0px;
    z-index: 2;
    width: 100%;
    padding-bottom:20px;
    background-color:white;
    .reverseButton{
      display:block;
      margin-top:-16px;
    }
    
  };

#panelWrapper{
    position: absolute;
    bottom: 57px;
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
  </style>

