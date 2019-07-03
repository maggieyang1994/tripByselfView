<template>
  <div>
     <el-submenu :index="route.name" v-if="hasChild">
        <template slot="title">
          <span><svg-icon :iconClass="route.meta.icon" v-if="route.meta.icon"></svg-icon>{{route.meta.text}}</span>
       </template>
       <!--  组件递归   自己使用自己   children嵌套多成时可以多层嵌套-->
       <y-navItem v-for="item in route.children" :route="item" :key="item.name"></y-navItem>
       
      </el-submenu>
      <el-menu-item :index="route.name" v-else>
         <span slot="title"><svg-icon :iconClass="route.meta.icon" v-if="route.meta.icon"></svg-icon>{{route.meta.text}}</span>
      </el-menu-item>
  </div>
</template>
<script>
export default {
  // 组件递归 必须要有name属性
  name: 'y-navItem',
  props: {
    route: {
      type: Object,
      require: true
    }
  },
  data(){
    return {
      activeName: ''
    }
  },
  computed: {
    hasChild(){
      return this.route.children && this.route.children.length
    }
  }
}
</script>
