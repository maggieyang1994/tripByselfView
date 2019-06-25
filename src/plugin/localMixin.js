export default {
  name: 'localmixin',
  methods: {
    showDialog(config){
      this.$store.state.commit("setDialogMap", config)
    }
  }
}