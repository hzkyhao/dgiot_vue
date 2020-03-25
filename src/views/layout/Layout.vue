<template>
  <div :class="classObj" class="app-wrapper">
    <div class="topheader">
      <Navbar/>
    </div>
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"/>
    <!-- <div class="centent">
      <h2>adfasfdafasf</h2>
    </div> -->
    <!-- <sidebar class="sidebar-container" style="background:#004998;text-align:center"/> -->
    <div class="main-container">
     
      <app-main/>
      <TagsView/>
    </div>
    
  </div>
</template>

<script>
import { Sidebar, AppMain,TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import Navbar from './Navbar'
export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        // mobile: this.device === 'mobile'
      }
    }
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
</style>
