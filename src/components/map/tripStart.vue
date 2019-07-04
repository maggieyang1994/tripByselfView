<template>
  <div class="tripStartWrapper" :class="quitClass">
    <h1>{{distance || 0}}公里</h1>
    <div class="detail" >
      <div>
        <p>{{sec | timerFilter}}</p>
        <p>总计时间</p>
      </div>
      <div>
        <p>{{speed}}</p>
        <p>平均配速(km/h)</p>
      </div>
      <div>
        <p>{{Calories}}  45</p>
        <p>消耗能量(k)</p>
      </div>
    </div>
    <div class="remarks">
      <span>备注</span>
      <el-input
        type="textarea"
        placeholder="请输入内容"
        v-model="remarks"
        maxlength="40"
        show-word-limit
      />
    </div>


<!-- dialog -->
    <el-dialog
      title="保存失败"
      :visible="!!errorMessage"
      width="85%"
      >
      <span>{{errorMessage}}</span>
      <span slot="footer" class="dialog-footer">
      
        <el-button type="primary" @click="errorMessage=''">确 定</el-button>
      </span>
    </el-dialog>
  </div>
 
</template>
<script>
import axios from "axios";
import dayjs from "dayjs";
export default {
  name: "tripStart",
  props: {
    map:{
      require: true
    },
    tripType: {
      type: String,
      require: true
    }
  },
  data() {
    return {
      watchId: null,
      path: [],
      latitude:'',
      longitude: '',
      lastLat:'',
      lastLong: '',
      distance: '',
      timer: null,
      sec: 0,
      remarks: '',
      isQuit: false,
      polyline: null,
      errorMessage: ''
    };
  },
  methods: {
    watchPosition() {
      var self = this;
      self.watchId = navigator.geolocation.watchPosition(
       async function(position) {
          console.log(position);
          let tempCor = await self.toGaodeCor([position.coords.longitude, position.coords.latitude])
          self.path.push(tempCor);
          (self.latitude = position.coords.latitude),
            (self.longitude = position.coords.longitude);
          // 计算距离
          if (self.lastLat && self.lastLong) {
            self.distance = self.getDistance(
              self.latitude,
              self.longitude,
              self.lastLat,
              self.lastLong
            );
          }
          self.lastLat = self.latitude;
          self.lastLong = self.longitude;
        },
        function(err) {
          console.log(err);
        },
        {
          timeout: 10000
        }
      );
    },
    getDistance(latitude1, longitude1, latitude2, longitude2) {
      var R = 6371;
      var deltaLatitude = this.toRadians(latitude2 - latitude1);
      var deltaLongitude = this.toRadians(longitude2 - longitude1);
      (latitude1 = this.toRadians(latitude1)),
        (latitude2 = this.toRadians(latitude2));
      var a =
        Math.sin(deltaLatitude / 2) * Math.sin(deltaLatitude / 2) +
        Math.cos(latitude1) *
          Math.cos(latitude2) *
          Math.sin(deltaLongitude / 2) *
          Math.sin(deltaLongitude / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c;
      return d.toFixed(4) || 0;
    },
    toRadians(value) {
      return (value * Math.PI) / 180;
    },
    startTimer(){
      this.timer = setInterval(() => {
        this.sec++
      }, 1000)
    },
    tripEnd(that){
      clearInterval(this.timer);
      navigator.geolocation.clearWatch(this.watchId)
      this.timer = null;
      this.isQuit = true
      // // 瞄点
      let tempMarker = this.path[this.path.length - 1]
      that.drawMarker(tempMarker.Q, tempMarker.P);

      // // 画路线图
      this.$emit("drawPolyline", this.path)

      // 存到数据库
      let params = {
        userId: this.$store.state.userInfo[0].userId,
        type: 'trip',
        tripType: this.tripType,
        distance: this.distance,
        time: this.sec,
        date: dayjs().format("YYYY-MM-DD"),
        trajectory: JSON.stringify(this.path),
        Calorie: this.Calories,
        speed: this.speed,
        mark: this.remarks

      };
      axios.post("/trip/saveTrip", params).then(res => {
        console.log(res);
        if(res.data.code){
           this.$message({
            showClose: true,
            message:'保存成功,此次记录已经上传',
            type:  'success'
          })
        } else {
        //   this.$alert(`<span style="color:red">${res.data.error}</span>`, '保存失败', {
        //   dangerouslyUseHTMLString: true
        // });
          this.errorMessage = res.data.error
        }
       
      }).catch(err => {
        console.log(err)
      })

    },
    toGaodeCor(gps) {
      return new Promise((resolve, reject) => {
        AMap.convertFrom(gps, "gps", function(status, result) {
          if (result.info === "ok") {
            resolve(result.locations[0]); // Array.<LngLat>
          } else {
            reject("err");
          }
        });
      });
    }
    
  },
  filters: {
    timerFilter(val){
      const pad = (val) => val.toString().padStart(2, 0);
      let sec = val % 60;
      let min = Math.floor(val / 60);
      let hour = Math.floor(min / 60);
      return `${pad(hour)}:${pad(min)}:${pad(sec)}`;
    }
  },
  computed: {
     // 计算配速
    speed () {
      let tmpTimer = this.sec / 3600
      let speed = (this.distance / tmpTimer).toFixed(2)
      if (isNaN(speed) || speed > 1000000) {
        speed = 0
      }
      return `${speed}`
    },
    // 消耗卡路里
    Calories () {
      return (this.distance * 95.2).toFixed(1)
    },
    quitClass () {
       return this.isQuit ? 'quitClass' : ''
    }
  },
  mounted() {
    this.watchPosition();
    this.startTimer()  ;
  }
};
</script>
<style scoped lang="scss">
.tripStartWrapper {
  padding-top:40px;
  box-sizing:border-box;
  z-index: 2;
  width: 100%;
  height: 100%;
  background-color: white;
  position: absolute;
  top: 0;
  opacity: 0.9;
  .detail{
    display: flex;
    justify-content: space-around;
    margin-bottom: 80px;
  }
  .remarks{
    text-align: left
  };
  .end{
    text-align: center;
    position:absolute;
    bottom: 20%;
    left:50%;
    transform: translateX(-50%)
  }
}

.quitClass {
  height: 50%
}
div.el-message-box {
  width: 100%!important;
  word-break: break-all;
  word-wrap: break-word;
}
</style>
