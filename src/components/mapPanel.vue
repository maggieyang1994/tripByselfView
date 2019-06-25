<template>
  <div class="mapPanel">
    <el-popover
      placement="bottom"
      title="当前城市"
      width="200"
      :content="address">
      <span slot="reference" class="reference">{{district || '未知'}}</span>
    </el-popover>
    <el-divider direction="vertical"></el-divider>
    <el-popover
      v-model="colorVisible"
      placement="bottom"
      width="200">
      <el-radio-group v-model="mapColor">
        <el-radio  v-for="item in colorMap" :label="item.value" :key="item.value">{{item.type}}</el-radio>
      </el-radio-group>
      
      <span slot="reference" class="reference">地图</span>
    </el-popover>
    <el-divider direction="vertical"></el-divider>
    <span @click="handerClick" class="reference">定位</span>
  </div>
</template>
<script>
export default {
  name:'y-mapPanel',
  data(){
    return {
      colorVisible: false,
      colorMap: [
        {
          type: "标准",
          value: "normal"
        },
        {
          type: "幻影黑",
          value: "dark"
        },
        {
          type: "月光银",
          value: "light"
        },
        {
          type: "远山黛",
          value: "whitesmoke"
        },
        {
          type: "雅士灰",
          value: "grey"
        },
        {
          type: "马卡龙",
          value: "macaron"
        },
        {
          type: "靛青蓝",
          value: "blue"
        },
        {
          type: "极夜蓝",
          value: "darkblue"
        }
      ],
      
    }
  },
  computed: {
    mapColor: {
      get: function(){
         return this.$store.state.mapColor
      },
      set: function(value){
        this.$store.commit("setMapColor", value);
        localStorage.setItem("mapColor", this.mapColor);
        this.$emit("changeMapColor", value)
        this.colorVisible = false;
      }
    }
  },
  methods: {
    handerClick(){
     this.$parent.getPosition();
    }
  },
  props: {
    address: {
      type: String,
      require: true
    },
    district: {
      type: String,
      require: true
    }
  }
}
</script>
<style lang="scss" scoped>
.mapPanel {
    position: fixed;
    top: 36px;
    z-index: 2;
    background-color: white;
    left: 9%;
    span.reference {
      padding: 7px 26px;
      outline: none;
      display: inline-block;
      cursor: pointer;
    }
  }
</style>
