<template>
  <div id="app">
    <router-view v-if="isRouterAlive" />
  </div>
</template>

<script>
import Cookies from "js-cookie";
import { Parse } from "parse";
import { license } from "@/api/license";
import { prototype } from "stream";
import deepClone from "@/utils/deepClone";
export default {
  name: "App",
  provide() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      username: "",
      token: "",
      isRouterAlive: true
    };
  },
  mounted() {
    Parse.initialize("shuwa", "webapi", "HZlora2017");
    // Parse.serverURL = "http://148.70.107.251:5080/iotapi";
    // Parse.serverURL = "http://ci.iotn2n.com:5080/iotapi";
    // Parse.serverURL = "http://192.168.2.13:5080/iotapi";//莫易的库
    // Parse.serverURL = "http://132.232.121.164:5080/iotapi";//伟星的库
    // Parse.serverURL = "http://148.70.50.192:5080/iotapi"
    // Parse.serverURL = "http://prod.iotn2n.com/iotapi";//线上环境
    // Parse.serverURL = "http://license.iotn2n.com:5080/iotapi";//建辉环境
    // Parse.serverURL = "http://192.168.2.26:5080/iotapi"
    // Parse.serverURL="http://cad.iotn2n.com:5080/iotapi"
    Parse.serverURL = this.$globalConfig.serverURL;

    if (Cookies.get("roles")) {
      this.$store.dispatch("setRoles", Cookies.get("roles"));
    }
    // console.log(Parse)
    this.appShow();
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function() {
        this.isRouterAlive = true;
      });
    },
    appShow() {
      const { PAGE_START_TIME } = window;
      const END_TIME = new Date().getTime(); // 结束时间
      const diffTime = END_TIME - PAGE_START_TIME;
      const timer = setTimeout(
        () => {
          clearTimeout(timer);
          document.querySelector(".app-loading").className +=
            " app-loading-hide";
        },
        diffTime > 2000 ? 0 : 2000 - diffTime
      );
    }
  }
};
</script>
<style>
section {
  background: #f0f2f5;
}
#nprogress .bar {
  background: #67c23a !important;
}
</style>
