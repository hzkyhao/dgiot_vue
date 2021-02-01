const Vue = require("vue");
import "normalize.css/normalize.css"; // A modern alternative to CSS resets
import "@/styles/index.scss"; // global css
import App from "./App";
import router from "./router";
import store from "./store";
import "@/utils/shuwa_message.js"
import globalConfig from "@/config";
import service from "@/utils/request.js";
import utilwen from "./utils/utilwen.js";
import i18n from "./common/language";
import echarts from "echarts";
import VueResource from "vue-resource";
import "@/icons"; // icon
import "@/api/batch"
import "@/permission"; // permission control
import "./assets/iconfont/iconfont.css";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import Cookies from "js-cookie";
import BaiduMap from "vue-baidu-map";
import "echarts-liquidfill";
import VueCodemirror from "vue-codemirror";

import "codemirror/lib/codemirror.css";

Vue.use(VueCodemirror);
Vue.use(BaiduMap, {
  ak: "fnc5Z92jC7CwfBGz8Dk66E9sXEIYZ6TG" // 官方提供的ak秘钥
});

Vue.use(utilwen);

if (process.env.NODE_ENV === "development") {
  Vue.config.devtools = true;
} else {
  Vue.config.devtools = false;
}
Vue.prototype.$echarts = echarts;
Vue.prototype.$axios = service;
// Vue.prototype.$api = api
Vue.prototype.$NProgress = NProgress;
Vue.prototype.$globalConfig = globalConfig;
Vue.prototype.$Cookies = Cookies;
Vue.use(VueResource);
Vue.config.productionTip = false;
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  NProgress.start();
  next();
});

router.afterEach(transition => {
  NProgress.done();
});

new Vue({
  el: "#app",
  router,
  store,
  i18n,
  render: h => h(App)
});
