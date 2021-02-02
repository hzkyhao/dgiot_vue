<!--
 * @Author: your name
 * @Date: 2021-01-11 11:38:52
 * @LastEditTime: 2021-02-02 20:55:09
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \platform\src\App.vue
-->
<template>
  <div id="app">
    <router-view v-if="isRouterAlive" />
  </div>
</template>

<script>
export default {
  name: 'App',
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      username: '',
      token: '',
      isRouterAlive: true
    }
  },
  mounted() {

    if (this.$Cookies.get('roles')) {
      this.$store.dispatch('setRoles', this.$Cookies.get('roles'))
    }
    this.appShow()
  },
  methods: {
    reload() {
      this.isRouterAlive = false
      this.$nextTick(function() {
        this.isRouterAlive = true
      })
    },
    appShow() {
      const { PAGE_START_TIME } = window
      const END_TIME = new Date().getTime() // 结束时间
      const diffTime = END_TIME - PAGE_START_TIME
      const timer = setTimeout(
        () => {
          clearTimeout(timer)
          document.querySelector('.app-loading').className +=
            ' app-loading-hide'
        },
        diffTime > 2000 ? 0 : 2000 - diffTime
      )
    }
  }
}
</script>
<style>
section {
  background: #f0f2f5;
}
#nprogress .bar {
  background: #67c23a !important;
}
</style>
