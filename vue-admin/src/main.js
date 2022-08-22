import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/style.css'
import './plugin/antui'
import './plugin/http'


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')