<template>
  <div class="tripStartWrapper">
    
  </div>
 
</template>
<script>
import axios from "axios"
export default {
  name: "tripStart",
  data() {
    return {
      
    };
  },
  methods: {
     watchPosition() {
      var self = this;
      navigator.geolocation.watchPosition(function (position) {
        console.log(position);
        self.path.push(new AMap.LngLat(position.coords.longitude, position.coords.latitude));
        self.latitude = position.coords.latitude,
          self.longitude = position.coords.longitude,
          self.accuracy = position.coords.accuracy,
          self.timestamp = position.timestamp;
        // 计算距离
        if (self.lastLat && self.lastLong) {
          self.currDist = self.distance(self.latitude, self.longitude, self.lastLat, self.lastLong);
        };
        self.lastLat = self.latitude;
        self.lastLong = self.longitude;

        // // 瞄点
        // self.DrawMarker();

        // // 画路线图
        // self.drawPolyline()


      }, function (err) {
        console.log(err)
      }, {
          timeout: 10000
      });
      },
  },
  mounted(){
    this.watchPosition()
  }
};
</script>
<style scoped lang="scss">

</style>
