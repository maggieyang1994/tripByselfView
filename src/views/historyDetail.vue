<template>
  <div class="history">
    <y-map ref="map"></y-map>
  </div>
</template>
<script>
export default {
  name: 'historyDetail',
  data () {
    return {
      
    }
  },
  props: {
    detail: {
      type: Object,
      require: true
    }
  },
  mounted () {
    this.$nextTick(() => {
      console.log(this.$refs.map)
    })
  },
  methods: {
   
  }
}
</script>

<style lang="scss" scoped>

</style>

