import axios from 'axios'
import store from '@/store'
export default {
  name: 'localmixin',
  methods: {
    showDialog(config){
      this.$store.state.commit("setDialogMap", config)
    }
  }
}