<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    
    <router-view/>
     <div class="btmNav">
      <el-tabs v-model="activeName" @tab-click="handleClick" :stretch="true">
        <el-tab-pane  :name="item.name" v-for="item in routes" :key="item.name">
          <div slot="label">
           <span slot="label" v-if="item.meta"><svg-icon :iconClass="item.meta.icon" :iconColor = "item.name===activeName? '#409EFF': 'black'"></svg-icon>{{item.meta.text}}</span>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div> 
    <!-- <div style="display:flex;">
        <div style="width: 200px">
          <y-nav :routes="routes"></y-nav>
        </div>
        <div style="flex:1">
          <router-view/>
        </div>
    </div> -->
  
  </div>
</template>
<script>
// import Nav from "./components/Nav/btmNav.vue"
export default {
  data(){
    return {
      activeName:'trip'
    }
  },
  // components: {
  //   'y-nav':Nav
  // },
  methods: {
    handleClick(tab){
      this.$router.push({name: tab.name});
      this.activeName = tab.name;
    }
  },
  computed: {
    routes(){
      return this.$store.state.routes.filter(x => x.meta)
    }
  },
  mounted(){
    let href = location.href.split("/");
    if(href.length) this.activeName = href[href.length - 1];
  },
  watch: {
    $route(to, from){
      this.activeName = to.name
    }
  }
}
</script>

<style lang="scss">
html, body{
  height: 100%
}
ul li{
  list-style:none
};
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
 }
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
body,div,p{
  margin:0;
  padding: 0
}
.btmNav{
  position:fixed;
  bottom: 1px;
  width: 100%;
  background-color: white;
  z-index: 0;
  div.lableP{
    height: 20px;
  };
  .el-tabs__header{
    margin: 0
  };
};
#tab-trip{
  height:56px
}
.el-tabs__item.is-active{
  color: none!important;
}
</style>
   