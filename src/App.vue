<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    
    <router-view/>
    <div class="btmNav">
      <el-tabs v-model="activeName" @tab-click="handleClick" :stretch="true">
        <el-tab-pane  :name="item.name" v-for="item in routerList" :key="item.text">
          <div slot="label">
            <!-- <div class="lableP"><svg-icon :iconClass="item.icon" :iconColor = "item.name===activeName? '#409EFF': 'black'"></svg-icon></div> -->
             <span slot="label"><svg-icon :iconClass="item.icon" :iconColor = "item.name===activeName? '#409EFF': 'black'"></svg-icon>{{item.text}}</span>
            <!-- <div class="lableP" :style="{color: item.name===activeName? '#409EFF': 'black'}">{{item.text}}</div> -->
          </div>
        
        </el-tab-pane>
      </el-tabs>
    </div>
    

  </div>
</template>
<script>

export default {
  data(){
    return {
      routerList: [
      {
        text: '出行',
        name: 'trip',
        icon: 'home',
      },{
        text: '交通',
        name: 'traffic',
        icon: 'location'
      },{
        text: '历史',
        name: 'history',
        icon: 'historychoose'
      },{
        text: '我的',
        name: 'myinfo',
        icon: 'people'
      }
    ],
    activeName:'trip'
    }
  },
  methods: {
    handleClick(tab){
      this.$router.push({name: tab.name});
      this.activeName = tab.name;

    }
  },
  mounted(){
    let href = location.href.split("/");
    if(href.length) this.activeName = href[href.length - 1]
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
   