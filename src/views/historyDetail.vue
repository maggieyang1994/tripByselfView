<template>
  <div class="history">
    <y-map ref="map"></y-map>


    <!-- 上面遮罩層 -->
    <div class="detailWrapper">
      <div style="display: flex;justify-content: space-between">
        <span>{{detail.tripType}}</span>
         <span>{{detail.date.substring(0, 10)}}</span>
      </div>
      <div style="text-align:center">
        <h2>{{detail.distance}}公里</h2>
      </div>
      <div style="display: flex;justify-content: space-around">
          <p>
            <span>{{detail.time}}</span><br/>
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
      
    }
  },
  props: {
    detail: {
      type: Object,
      require: true
    }
  },
 methods: {
   
  }
}
</script>

<style lang="scss" scoped>
   .detailWrapper{
      padding:14px;
      box-sizing:border-box;
      z-index: 2;
      width: 100%;
      height: 32%;
      background-color: white;
      position: absolute;
      top: 0;
      opacity: 0.9;
      .remark{

        margin-top:20px;
        text-align:left
      }
   }
</style>


