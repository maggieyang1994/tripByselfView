<template>
   <div class="tripMap" >
        <y-map :tripType="tripType"  @backToTrip="handlerBackToTrip"/>
     </div>
</template>
<script>
export default {
  name: "tripMap",
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

