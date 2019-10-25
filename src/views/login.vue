<template>
  <div class="login">
    <div class="logo">
      <img src="../assets/img/logo.png"/>
    </div>
    <div class="loignMain">
      <div>
        <el-input v-model="userName" placeholder="请输入内容" class="firstInput">
         <template slot="prepend">用户名</template>
        </el-input>
      </div>
      <div>
        <el-input v-model="password" placeholder="请输入密码" type="password">
          <template slot="prepend">密码</template>
        </el-input>
      </div>
      <div class="rememberPassword">
          <el-checkbox v-model="rememberPassword">记住密码</el-checkbox>
      </div>
      <div class="loginButton">
          <el-button type="primary" @click="login"><span>登陆</span></el-button>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: "login",
  data() {
    return {
      userName: '',
      password: '',
      rememberPassword: true
    };
  },
  methods: {
    login(){
      // axios.get("https://triprecord-server.herokuapp.com/user/getUserDetail", {
      //   params: {
      //     userName: this.userName,
      //     password: this.password
      //   }
      // }).then(res => {
        myAxios("/user/getUserDetail", 'get', {params:{userName: this.userName,password: this.password}}).then(res =>{
        if(res.data.code === 400){
          // preload background img
          let img = new Image();
          img.src = '../assets/img/logo.png';
          this.$message.error(res.data.msg)
        }else{
          let tempObj = res.data.msg[0]
          this.rememberPassword && (tempObj.password = this.password);
          this.$store.commit("setUserInfo", tempObj);
          localStorage.setItem("userInfo", JSON.stringify(tempObj));
          // this.rememberPassword && localStorage.setItem("password", JSON.stringify(this.password));
          this.$router.push({name: 'trip'})
        }
      }).catch(e => {
        console.log(e)
      })
    }
  },
  watch: {
    userName(newV){
      if(this.rememberPassword) this.password = this.$store.state.userInfo.userName === newV ? this.$store.state.userInfo.password : ''
    }
  }
};
</script>
<style scoped lang="scss">
.login {
  background-image: url("../assets/img/login-bg.jpg");
  background-size: cover;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  z-index:2;
  .logo {
    margin-top:40%;
    margin-bottom:10%;
    img {
      width: 50%;
      height: 50%;
    }
  }
  .loignMain{
    div{
      padding-left: 10px;
      padding-right: 10px;
      box-sizing: border-box;
      margin-top: 10px;
    }
  }
  .loginButton{
    text-align:center;
    // position:absolute;
    // bottom:50px;
    margin-top:50px!important;
    .loginSpan{
      width:20%
    }
  }
}
</style>
