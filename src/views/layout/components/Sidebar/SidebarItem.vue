<template>
  <div v-if="!item.hidden" class="menu-wrapper" style="height:40px;">
    <!--根据取回来菜单生成-->
     <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&(!item.children)" >
      <app-link v-if="onlyOneChild.name" :to="resolvePath(onlyOneChild.url)" >
        <el-menu-item :index="resolvePath(onlyOneChild.url)" :class="{'submenu-title-noDropdown':!isNest}" @click.native="reloadnow(onlyOneChild.url,onlyOneChild.name)">
          <item :icon="onlyOneChild.icon||(item.name&&item.icon)" :title="generateTitle(onlyOneChild.name)"/>
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else ref="subMenu" :index="resolvePath(item.url)" :key="item.id" popper-append-to-body>
      <template slot="title">
        <item v-if="item.name" :icon="item.name && item.icon" :title="generateTitle(item.name)" />
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.id"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.url)"
        class="nest-menu"
        @click.native="reloadnow(child.url,child.name)"
      />
    </el-submenu>
   <!--根据和路由比较生成-->
    <!-- <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&(!item.children)">
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">
          <item :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" :title="generateTitle(onlyOneChild.meta.title)" style="background-color:white"/>
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <template slot="title">
        <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="generateTitle(item.meta.title)" style="background-color:white"/>
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu> -->

  </div>
</template>

<script>
import path from 'path'
import { generateTitle } from '@/utils/i18n'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  inject:['reload'],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    // TODO: refactor with render function
    this.onlyOneChild = null
    return {}
  },
  methods: {
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item  
          return true
        }
      })
      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      return path.resolve(this.basePath, routePath)
    },
    reloadnow(url,name){
        if(url.indexOf('http')==-1){
          this.$router.push({
          path:url,
          query:{
            reload:true
          }
        })
      }
    },
    generateTitle
  }
}
</script>
<style>
.nest-menu .svg-icon{
  margin-right:16px;
}
.el-submenu__title *{
  box-sizing:border-box;
  /* color:#ffffff; */
}
</style>
