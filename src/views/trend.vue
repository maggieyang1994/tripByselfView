<template>
   <div class="trendWrapper">
     <div class="title">
       <h2>出行趋势</h2>
       <p class="colorBlue">最近七天内，2种行程，8种出行方式的里程趋势折线图</p>
     </div>

    <div>
        <!-- 公共交通 -->
      <y-echart :options = "trafficOptions" container="echart2"></y-echart>
     <!-- 私人出行 -->
      <y-echart :options = "tripOptions" container="echart1"></y-echart>
    </div>
     
   </div>
</template>
<script>
import dayjs from "dayjs"
export default {
  name:'trend',
  data(){
    return {
      tripOptions: {},
      trafficOptions: {}
    }
  },
  watch:{
    'list': {
      handler: function(newV){
        if(newV.length){
           this.tripOptions = this.getOptions(newV, 'trip', '私人出行');
           this.trafficOptions = this.getOptions(newV, 'traffic', '公共交通');
        }
      },
      immediate: true
    }
  },
  computed: {
    list(){
      return this.$store.state.totalTrips 
    }
  },
  
    methods: {
      getXAxis(){
         let arr = [];
         for(let i = 1; i<=7; i++){
           arr.unshift(dayjs().subtract(i, "d").format("MM-DD"))
         };
         return arr;
         
      },
   
    getLegend(type){
      return [...new Set(this.list.filter(x => x.type === type).map(x => x.tripType))]
    },
    getSeries(list, type, dateArr, legend){
     return legend.reduce((o1,item1) => {
        let sameLengend = list.filter(cur => cur.type === type && cur.tripType === item1);
        let data = dateArr.reduce((o2,item2)=> {
          let sameDate = sameLengend.filter(x => dayjs(x.date).format("MM-DD") === item2);
          o2.push(sameDate.reduce((o,item) => o = o+item.distance * 1, 0));
          return o2
        }, [])
       o1.push({
          name: item1,
          type: 'line',
          stack:'总量',
          data
        })
        return o1
     },[])
    },
    getOptions(list, type, title){
      let xAxis = this.getXAxis();
      let Legend = this.getLegend(type);
      let series = this.getSeries(list, type, xAxis, Legend);
      return {
        title: {
          text: title
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: Legend,
          top:40
        },
        xAxis: {
          type: 'category',
          data: xAxis
        },
        yAxis: {
          type: 'value'
        },
        series,
        toolbox: {
          feature: {
              saveAsImage: {}
          }
      },
        
      }
    }
   },
  mounted(){
   this.$store.dispatch("setTrips")
  }
}
</script>
<style scoped>
.title{
  text-align:center;
}
 .colorBlue{
   color: blue
 }
</style>

 