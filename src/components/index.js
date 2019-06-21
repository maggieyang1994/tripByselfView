import Map from './map.vue';

const components =[
  Map
];

const plugins = {
  install: function(Vue){
    components.forEach(x => {
      Vue.component(x.name, x)
    })
  }
}

export default plugins