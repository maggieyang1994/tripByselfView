<template>
  <div class="myInfoWrapper">
    <div class="top">
      <el-button class="loginout" @click="loginout">退出登录</el-button>
      <el-card class="box-card">
        <img :src="avatorUrl" class="userImage" style="width: 70px;height:70px"/>
        <div style="display:inline-block;margin-left:20px">
          <p>{{userInfo.name}}</p>
          <p>账号：{{userInfo.userName}}</p>
        </div>
        <div class="flex" style="margin:20px 0;text-align:center">
          <div v-for="(item, index) in topData" :key="index" @click ="handerFansClick(item)">
             <p>{{item.count}}</p>
             <p>{{item.text}}</p>
          </div>
        </div>
      </el-card>
    </div>
     <div class="center">
      <el-card class="box-card">
        <div slot="header">
          我的信息
        </div>
        <div class="flex" style="margin:20px 0">
          <div v-for="(item, index) in mathRoutes" :key="index" @click="handlerClick(item)" >
             <div v-if="item.meta">
                <p><svg-icon :iconClass="item.meta.icon" v-if="item.meta.icon"></svg-icon></p>
                <p v-if="item.meta.text">{{item.meta.text}}</p>
             </div>
          </div>
        </div>
      </el-card>
    </div>
     <div class="bottom">
      <el-card class="box-card">
         <div slot="header">
          更多功能
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: "myinfo",
  data(){
    let arr = Array.from({length : 10}, (x, i) => ({id: i+1, name:'name' + i+ 1}));
    return {
      topData: [
        {
          text: '好友',
          count: 10
        },
        {
          text: '粉丝',
          count: 10
        },
        {
          text: '好友',
          count: 10
        },
        {
          text: '好友',
          count: 10
        }
      ],
      fansMap: arr,
      avatorUrl: null
      
    }
  },
  mounted(){
    this.avatorUrl =  this.$store.state.ngixPath + "head.jpeg"
  },
  computed: {
    ...mapState([
      'mathRoutes',
      "userInfo"
    ])
  },
  methods: {
    handlerClick(item){
      this.$router.push({name: item.name})
    },
    handerFansClick(item){
      let random = Math.floor(Math.random() * 10)
      if(item.text === '粉丝'){
        this.$router.push({
          path: `/fans/${random}`
        })
      }
    },
    loginout(){
      myAxios('/user/logout','get',{
         login_id: this.$store.state.userInfo.name
      })
      this.$router.push({
        name: "login"
      })
    }
  }
}
</script>
<style scoped lang ="scss">
.myInfoWrapper{
  text-align:left
}
.flex{
  display: flex;
  justify-content: space-between;
}
.loginout{
  position:absolute;
  right:0;
  top:10px
}
</style>

