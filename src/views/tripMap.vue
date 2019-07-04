<template>
   <div class="tripMap" >
        <y-map :tripType="tripType"  @backToTrip="handlerBackToTrip" ref="map">
          <!-- 头部panel -->
          <template v-slot:headerPanel="slotProps">
           <y-mapPanel  :address="slotProps.address"  :district="slotProps.district"/>
          </template>
          

          <!-- 底部开始 -->
          <template v-slot:bottom="slotProps">
              <el-button  type="primary" class="beginTripSelf" @click="$refs.map.$emit('handerButtonClick')" :disabled = 'slotProps.positioning'>{{slotProps.buttonText}}</el-button>
          </template>
        </y-map>
     </div>
</template>
<script>
import MapPanel from "../components/map/mapPanel.vue";
export default {
  name: "tripMap",
  components: {
    "y-mapPanel": MapPanel
  },
  props: {
    tripType: {
      type: String,
      default: "徒步出行"
    }
  },
  methods: {
    handlerBackToTrip(distance){
      this.$router.push({name: "trip",  params: {distance, showMap: false}})
    }
  }
}
</script>
<style scoped lang="scss">
  .tripMap{
     .beginTripSelf{
        position: fixed;
        bottom: 80px;
        width: 40%;
        left: 50%;
        transform: translate(-50%);
        z-index: 4;
    };
  }
</style>

