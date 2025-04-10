import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

// Import Bootstrap and BootstrapVue CSS files
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Install BootstrapVue
Vue.use(BootstrapVue)
// Install BootstrapVue icon components
Vue.use(IconsPlugin)

// 注册全局过滤器
Vue.filter('currency', function(value) {
  if (!value) return 'Rs. 0'
  return `Rs. ${value.toLocaleString()}`
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
