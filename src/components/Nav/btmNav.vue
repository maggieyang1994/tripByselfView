<template>
  <div>
  
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      @select = "handleSelect">
          <div v-for="(item, index) in routes" :key="index">
              <y-navItem :route="item"></y-navItem>
          </div>
    </el-menu>

  </div>
</template>
<script>

import navItem from './NavIitem.vue'
export default {
  components: {
    "y-navItem": navItem
  },
  props: {
    routes: {
      type: Array,
      require: true
    }
  },
  methods: {
    handleSelect(key, keyPath){
      console.log(key, keyPath);
      this.$router.push({
        name: key
      })
    }
  }
}
</script>
