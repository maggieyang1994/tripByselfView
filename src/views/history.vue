<template>
   <div class="historyWrapper">
     <div class="history" v-if="!isShowDetail">
       <div class="title"><h3>出行历史</h3></div>
        <ul class="list" v-if="list.length">
          <li v-for="item in list" v-bind:key="item.id"  @click ="showDetail(item)">
            <div>
              <p>{{item.tripType}}</p>
              <p>{{item.type==='traffic'? item.startPlace + "-" + item.endPlace : `行程${item.distance}公里`}}</p>
            </div>
            <div>{{item.date}}  <i class="el-icon-arrow-right"></i></div>
          </li>
        </ul>
        <div v-else>
          No data
        </div>
     </div>
     <div class="historyDetail" v-else>
       <router-view/>
     </div>
         
  </div> 
</template>
<script>

import dayjs from 'dayjs';

export default {
  name:'history',
  data(){
    return {
     isShowDetail: false
    }
  },
  computed: {
    list(){
      return this.$store.state.totalTrips.map(x => ({...x, date: dayjs(x.date).format("YYYY-MM-DD HH:mm:ss")})).sort((a,b) => dayjs(a.date).isBefore(b.date) ? 1 : -1)
    }
  },
  methods: {
   showDetail(item){
      this.isShowDetail = true
      this.$router.push({
        name: "historyDetail",
        params: {
          detail: item
        }
      })
    }
  },
  mounted(){
   this.$store.dispatch("setTrips")
  },
  beforeRouteUpdate (to,from, next){
   if(from.name === 'historyDetail'){
      this.isShowDetail = false
    };
    next();
  }
}
</script>
<style lang="scss" scoped>
  .historyWrapper{
   height: 100%;
   .history{
     height:100%;
     .title{
    text-align: left;
    // position:fixed;
    top:0;
    // height:20px;
    background-color:white
  };
  .list{
    height: 80%;
    overflow-y:scroll;
    padding-left:0;
    font-size:12px;
    // color: #ccc;
     li{
       padding: 10px;
      border-bottom: 1px solid #ccc;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-pack: justify;
      -ms-flex-pack: justify;
      align-items: middle;
      align-items: center;
      justify-content: space-between;
       div{
         text-align:left;
       }
     };
     
    };
   };
  
    .historyDetail{
      height: 100%;
    }
  }
</style>
