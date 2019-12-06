<template>
  <div class="history">
    <y-map ref="map"  v-bind:isInit.sync="isInit"></y-map>


    <!-- 上面遮罩層 -->
    <div class="detailWrapper">
      <div style="display: flex;justify-content: space-between">
        <span>{{detail.tripType}}</span>
         <span>{{detail.date.substring(0, 10)}}</span>
      </div>
      <div style="text-align:center">
        <h2>{{detail.distance / 1000}}公里</h2>
      </div>
      <div style="display: flex;justify-content: space-around">
          <p>
            <span>{{ formatSecond(detail.time)}}</span><br/>
            <span>总计时间</span>
          </p>
          <p>
            <span>{{detail.speed}}</span><br/>
            <span>平均配速(km/h)</span>
          </p>
          <p>
            <span>{{detail.Calorie}}</span><br/>
            <span>消耗能量(k)</span>
          </p>
      </div>
      <div class="remark">
        备注：{{detail.mark}}
      </div>
   
    </div> 
  </div>
</template>
<script>

export default {
  name: 'historyDetail',
  data () {
    return {
      isInit: true
    }
  },
  props: {
    detail: {
      type: Object,
      require: true
    }
  },
 methods: {
   formatSecond(result){
    const h = Math.floor((result / 3600) % 24) + ''
    const m = Math.floor((result / 60) % 60)+ '';
    const s = Math.floor(result % 60)+ '';
    result = s + "秒";
    return `${h.padStart(2, "0")}:${m.padStart(2, "0")}:${s.padStart(2, "0")}`
   }
},
watch: {
  isInit(newV, oldV){
    console.log(newV);
    if(!newV){
      // 画轨迹图
      this.$refs.map.drawPolyline(this.detail.trajectory ? JSON.parse(this.detail.trajectory): [[this.detail.startCode],[this.detail.endCode]])
      // 瞄点
      this.detail.endCode && this.$refs.map.drawMarker(...this.detail.endCode.split(","))
    }
  }
}
}
</script>

<style lang="scss" scoped>
   .detailWrapper{
      padding:14px;
      box-sizing:border-box;
      z-index: 2;
      width: 100%;
      height: 40%;
      background-color: white;
      position: absolute;
      top: 0;
      opacity: 0.9;
      .remark{

        margin-top:20px;
        text-align:left
      }
   }
   .history .amap-touch-toolbar .amap-zoomcontrol{
     bottom: -29px
   }
</style>


