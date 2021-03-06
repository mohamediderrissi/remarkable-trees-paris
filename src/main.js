import Vue from 'vue'
import App from './App.vue'
import VueResource from 'vue-resource'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false
Vue.use(VueResource);
new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
