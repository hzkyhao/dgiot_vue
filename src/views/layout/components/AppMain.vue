<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <!-- or name="fade" -->
      <!-- <keep-alive> -->
      <router-view :key="key"/>
      <!-- </keep-alive> -->

      <!-- <router-view/> -->
    </transition>
    <!-- <div class="copyright" style="text-align:center;margin:0 auto;color:#999999;font-size:12px;padding:20px 0;" v-html="copyright">

    </div> -->
  </section>
</template>

<script>
import {
  Websocket,
  sendInfo,
  TOPIC_EMPTY,
  MSG_EMPTY,
  DISCONNECT_MSG
} from '@/utils/wxscoket.js'
export default {
  name: 'AppMain',
  data() {
    return {
      session: '',
      datasource: '',
      copyright: ''
    }
  },
  computed: {
    //  cachedViews() {
    //   return this.$store.state.tagsView.cachedViews
    // },
    key() {
      return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    }
  },
  watch: {
    $route(to, from) {
    }
  },
  mounted() {
    // websocket更新方法
    if (!(window.location.pathname.indexOf('suke') != -1)) {
      if (this.$globalConfig.hostname) {
        Websocket.cInfo.host = this.$globalConfig.hostname
      } else {
        Websocket.cInfo.host = location.hostname
      }

      Websocket.subInfo = {
        topic: 'web/' + this.$Cookies('sessionToken'),
        qos: 2
      }
      Websocket.newClient()
      Websocket.connect()
      Websocket.add_hook(/web\/.+/, function(Msg) {
        this.datasource = JSON.parse(Msg)
        if (this.datasource) {
          this.$baseEventBus .$emit(this.datasource.type, this.datasource)
        }
      })
    }

    this.getCopyright()
  },
  created() {

  },
  methods: {
    getCopyright() {
      this.copyright = sessionStorage.getItem('copyright')
    }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  /* min-height: calc(100vh - 50px); */
  position: relative;
  overflow: hidden;
  top:80px;
  padding-bottom:40px;
  box-sizing: border-box;
  background:#ffffff;
}
</style>
