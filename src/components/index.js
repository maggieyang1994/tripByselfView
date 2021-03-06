import Map from './map.vue';
import Dialog from './dialog.vue'
import SvgIcon from './SvgIcons.vue'
import Echart from './Echart.vue'

const components =[
  Map,
  Dialog,
  SvgIcon,
  Echart
];

const plugins = {
  install: function(Vue){
    components.forEach(x => {
      Vue.component(x.name, x)
    })
  }
}

export default plugins