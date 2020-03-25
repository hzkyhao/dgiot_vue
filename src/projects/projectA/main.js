import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import Axios from 'axios'
import api from './api/index.js'
import App from './App'
import router from './router'
import service from '@/utils/request.js'
import VueResource from 'vue-resource'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// import './mock'


// Install the vue plugin


Vue.prototype.$axios = service
Vue.prototype.$api = api
Vue.prototype.$NProgress = NProgress



Vue.use(VueResource)

Vue.use(ElementUI)

Vue.config.productionTip = false
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
      document.title = to.meta.title
  }
  NProgress.start();
  next()
});

router.afterEach(transition => {
NProgress.done();
});
new Vue({
  el: '#app1',
  router,
  render: h => h(App)
})
