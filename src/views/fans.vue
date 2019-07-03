<template>
   <div>this is fans{{id}}</div>
</template>
<script>
export default {
  name: "fans",
  props: {
    id: {
      type: [Number, String],
      require: true
    }
  }
}
</script>
