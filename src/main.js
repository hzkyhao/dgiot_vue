// import Vue from 'vue'
// import ElementUI from 'element-ui'

const Vue = require('vue')
const ElementUI = require('element-ui')

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
// import 'element-ui/lib/theme-chalk/index.css'

// import Axios from 'axios'
import '@/styles/index.scss' // global css
// import api from './api/index.js'
import App from './App'
import router from './router'
import store from './store'

import globalConfig from '@/config'

import service from '@/utils/request.js'
import utilwen from './utils/utilwen.js'
import i18n from './common/language'
import echarts from 'echarts'
import VueResource from 'vue-resource'
import '@/icons' // icon
import '@/permission' // permission control
import './assets/iconfont/iconfont.css'
// 引入Animate.css
// import animate from "animate.css"
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import Cookies from 'js-cookie'
// import lang from '@/common/lang' // 中英文翻译
import BaiduMap from 'vue-baidu-map'
import 'echarts-liquidfill'
import VueCodemirror from 'vue-codemirror'

import 'codemirror/lib/codemirror.css'

Vue.use(VueCodemirror)
Vue.use(BaiduMap, {
  ak: 'fnc5Z92jC7CwfBGz8Dk66E9sXEIYZ6TG' // 官方提供的ak秘钥
})
// import './mock'

import { ApolloClient } from 'apollo-client'

import { HttpLink } from 'apollo-link-http'
// 帮助1-3经验年前端开发人员，提升技术，思维
import { InMemoryCache } from 'apollo-cache-inmemory'
// import {ApolloLink} from 'apollo-link'

import VueApollo from 'vue-apollo'

const httpLink = new HttpLink({

  // You should use an absolute URL here

  // config.js 代理设置

  // '/graphql': {

  // target: "http://45.40.201.220:5080/iotapi/graphql",

  // changeOrigin: true,

  // pathRewrite: {

  // '^/graphql': '/graphql'

  // }

  // },

  uri: '/iotapi/graphql'// 访问地址,在这里使用代理

})
// const middlewareLink = new ApolloLink((operation, forward) => {

//   operation.setContext({
//     headers: {
//        "Content-Security-Policy": "default-src 'none'",
//     }
//   })
//   return forward(operation)
// })

// Create the apollo client

const apolloClient = new ApolloClient({

  link: httpLink,

  cache: new InMemoryCache(),

  connectToDevTools: true

})

// Install the vue plugin

Vue.use(utilwen)

Vue.use(VueApollo)

// 若是没有开启Devtools工具，在开发环境中开启，在生产环境中关闭
if (process.env.NODE_ENV == 'development') {
  Vue.config.devtools = true
} else {
  Vue.config.devtools = false
}

const apolloProvider = new VueApollo({

  defaultClient: apolloClient

})
Vue.prototype.$echarts = echarts
Vue.prototype.$axios = service
// Vue.prototype.$api = api
Vue.prototype.$NProgress = NProgress
Vue.prototype.$globalConfig = globalConfig
Vue.prototype.$Cookies = Cookies

// 全局重写 element 的$message 弹框事件
Vue.prototype.$message = function(msg) {
  if (!msg) {
    return
  }
  if (typeof msg === 'object') {
    if (!msg.message) {
      var jsonString = JSON.stringify(msg)
    }
    var param = {
      type: msg.type ? msg.type : 'warn',
      message: msg.message ? msg.message : jsonString,
      duration: msg.duration ? msg.duration : 800,
      showClose: msg.showClose ? msg.showClose : true
    }
  } else {
    var param = {
      message: msg,
      duration: 800,
      showClose: true
    }
  }
  ElementUI.Message(param)
}

Vue.use(VueResource)

/* Vue.use(ElementUI,{
  // locale,
  animate,
  i18n: (key, value) => i18n.t(key, value)
})
 */
Vue.config.productionTip = false
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  NProgress.start()
  next()
})

router.afterEach(transition => {
  NProgress.done()
})

// 2020 04.15 hughwang 修改 provide: apolloProvider.provide(), <ApolloProvider>.provide() is deprecated. Use the 'apolloProvider' option instead
new Vue({
  el: '#app',
  router,
  apolloProvider,
  store,
  i18n,
  render: h => h(App)
})
