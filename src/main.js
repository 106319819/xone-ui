// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import api from './api'
import store from './store'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/styles/iconfont.css'
import '@/assets/styles/main.scss'
// import '@/assets/styles/form.scss'
Vue.config.productionTip = false
Vue.use(ElementUI,{size: 'mini'})
Vue.use(api)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})
