<template>
   <div id="echartsWrapper">
   </div>
</template>
<script>
const echarts = require("echarts")
export default {
  name:'y-echart',
  props: {
    options: {
      type: Object,
      require: true
    },
    container: {
      type: String,
      require:true
    }
  },
  data(){
    return {
      instance: null
    }
  },
  mounted(){
    // this.instance = echarts.init(this.$el);
    // 动态生成dom；
    // 一个页面有多张图的时候  container 不能重合  
    let container = document.createElement("div");
    container.setAttribute("id", this.container);
    container.style.width = '100%';
    container.style.height= '400px'
    let wrapper = document.getElementById("echartsWrapper");
    wrapper.appendChild(container);

    this.instance = echarts.init(document.getElementById(this.container))
  },
  watch: {
    options: {
      handler: function(newV){
        this.instance && this.instance.setOption(newV)
      },
      // immediate: true,
      deep: true
    }
  }
}
</script>
<style scoped lang="scss">
 #echartsWrapper{
   width: 100%;
   height: 100%
 };
  #echartsWrapper{
   .echart1,.echart2{
      height:400px;
      width: 100%
   }
  }
</style>


