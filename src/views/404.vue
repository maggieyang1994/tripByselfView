<template>
  <div  class="error">
    <div>你访问的请求错误</div>
    {{errorMessages || this.$route.params.errorMessages}}
  </div>
</template>
<script>
export default {
  name : 'error',
  props: {
    errorMessages: {
      type: String
    }
  }
}
</script>
<style scoped>
 .error{
   font-size:20px;
   height: 100%;
   width: 100%;
 
 }
</style>

