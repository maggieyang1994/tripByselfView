import Map from './map.vue';
import Dialog from './dialog.vue'

const components =[
  Map,
  Dialog
];

const plugins = {
  install: function(Vue){
    components.forEach(x => {
      Vue.component(x.name, x)
    })
  }
}

export default plugins