import Vue from 'vue'
import App from './App.vue'
import './index.css' //ここを追記

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
