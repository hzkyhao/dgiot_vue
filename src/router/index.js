/* import Vue from 'vue'
import Router from 'vue-router' */

// const Vue = require('vue')
const Router = require("vue-router");

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

// Vue.use(Router)

/* Layout */
import Layout from "../views/layout/Layout";

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true
  },
  {
    path: "/resetpassword",
    component: () => import("@/views/login/resetpassword"),
    hidden: true
  },
  {
    path: "/register",
    component: () => import("@/views/register/register"),
    hidden: true
  },
  {
    path: "/phonelogin",
    component: () => import("@/views/login/phonesms"),
    hidden: true
  },
  {
    path: "/license",
    component: () => import("@/views/license"),
    hidden: true
  },
  { path: "/404", component: () => import("@/views/404"), hidden: true },
  {
    path: "/userinfo",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "/userinfo/:userid",
        name: "userinfo",
        component: () => import("@/views/user/userinfo"),
        hidden: true,
        meta: { title: "个人中心" }
      }
    ]
  },
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard/platform",
    name: "首页",
    children: [
      {
        path: "/dashboard",
        name: "首页",
        component: () => import("@/views/equipment_management/group"),
        redirect: "/dashboard/platform",
        meta: { title: "首页", icon: "platform" },
        children: [
          {
            path: "platform",
            meta: { title: "首页" },
            component: resolve =>
              require([
                "@/views/equipment_management/platform_overview"
              ], resolve)
          },
          {
            path: "devproduct",
            meta: { title: "分组" },
            component: resolve =>
              require(["@/views/equipment_management/home_group"], resolve)
          },
          {
            path: "devicelist",
            meta: { title: "设备" },
            component: resolve =>
              require(["@/views/equipment_management/home_index"], resolve)
          },
          {
            path: "productlist",
            meta: { title: "产品" },
            component: resolve =>
              require(["@/views/equipment_management/home_group2"], resolve)
          },
          {
            path: "resourcechannel",
            meta: { title: "通道" },
            component: resolve =>
              require(["@/views/engine/home_resourcechannel"], resolve)
          },
          {
            path: "dict",
            meta: { title: "字典" },
            component: resolve =>
              require(["@/views/engine/dict"], resolve)
          },
          {
            path: "engine",
            meta: { title: "规则" },
            component: resolve =>
              require(["@/views/engine/rulesengine"], resolve)
          },
          {
            path: "appmanage",
            meta: { title: "解码管理" },
            component: () => import("@/views/systemmanage/appmarage")
          },
          {
            path: "expandprogram",
            meta: { title: "拓展编程" },
            component: () => import("@/views/systemmanage/expandprogram")
          },
          {
            path: "product",
            name: "产品管理",
            component: () => import("@/views/equipment_management/devproduct"),
            meta: { title: "产品管理", icon: "product" }
          }
        ]
      }
    ]
  },
  {
    path: "/roles",
    component: Layout,
    redirect: "/roles",
    name: "系统管理",
    meta: { title: "系统管理", icon: "rolemanage" },
    children: [
      {
        path: "/roles/structure",
        name: "用户管理",
        component: () => import("@/views/roles/structure"),
        meta: { title: "用户管理", icon: "usermanage" }
      },
      {
        path: "/roles/roles",
        name: "角色管理",
        component: () => import("@/views/roles/rolelist/roles"),
        meta: { title: "角色管理", icon: "adminmanage" }
      },
      {
        path: "/roles/rolescontrol",
        name: "权限管理",
        component: () => import("@/views/roles/rolelist/rolescontrol"),
        meta: { title: "权限管理", icon: "rolescontrol" }
      },
      {
        path: "/roles/editroles",
        name: "添加角色",
        meta: { title: "添加角色" },
        hidden: true,
        component: () => import("@/views/roles/rolelist/addroles")
      },
      {
        path: "/roles/applicationManagement",
        name: "访问钥匙",
        component: () =>
          import("@/views/equipment_management/appOperate/application"),
        meta: { title: "访问钥匙", icon: "application" }
      },
      {
        path: "/roles/edituser",
        name: "编辑用户",
        meta: { title: "编辑用户" },
        hidden: true,
        component: () => import("@/views/roles/adduser/edituser")
      },
      {
        path: "/roles/menu",
        name: "菜单管理",
        component: () => import("@/views/roles/menu"),
        meta: { title: "菜单管理", icon: "menu" }
      },
      {
        path: "/roles/department",
        name: "部门管理",
        component: () => import("@/views/roles/department/department"),
        meta: { title: "部门管理", icon: "department" }
      },
      {
        path: "/applicationManagement/addApp",
        name: "新增应用",
        component: () =>
          import("@/views/equipment_management/appOperate/addApp"),
        hidden: true,
        meta: { title: "新增应用", icon: "department" }
      },
      {
        path: "/roles/projectManagement",
        name: "工程管理",
        component: () =>
          import("@/views/equipment_management/appOperate/applicationManagement"),
        meta: { title: "工程管理", icon: "project" }
      },
      {
        path: "/roles/appmanage",
        name: "插件管理",
        component: () => import("@/views/systemmanage/appmarage"),
        meta: { title: "插件管理", icon: "appmanage" }
      },
      {
        path: "/roles/thing",
        name: "设备管理",
        component: () => import("@/views/equipment_management/index"),
        meta: { title: "设备管理", icon: "device" }
      },
      {
        path: "/roles/group",
        name: "设备管理",
        component: () => import("@/views/equipment_management/group"),
        meta: { title: "设备分组", icon: "group" }
      },
      {
        path: "/performance_monitoring",
        component: () => import("@/views/dashboard/index"),
        name: "性能监控",
        meta: { title: "性能监控", icon: "platform" }
      },
      {
        path: "/modules",
        meta: { title: "物模型管理" },
        component: () => import("@/views/systemmanage/modules")
      },
      {
        path: "/roles/product",
        name: "产品管理",
        component: () => import("@/views/equipment_management/devproduct"),
        meta: { title: "产品管理", icon: "product" }
      },
      {
        path: "/roles/detailproduct",
        name: "产品详情",
        component: () => import("@/views/equipment_management/proddetail"),
        meta: { title: "产品详情" },
        hidden: true
      },
      {
        path: "/roles/thingsParse",
        name: "物解析",
        component: () => import("@/views/equipment_management/thingsParse"),
        meta: { title: "物解析" },
        hidden: true
      },
      {
        path: "/roles/editdevices",
        name: "设备详情",
        component: () => import("@/views/equipment_management/editdevices"),
        meta: { title: "设备详情" },
        hidden: true
      },
      {
        path: "/roles/onlinetest",
        name: "在线调试",
        component: () => import("@/views/equipment_management/onlinetest"),
        meta: { title: "在线调试", icon: "onlinetest" }
      },
      {
        path: "/roles/nodes",
        name: "节点管理",
        component: () => import("@/views/installation/log"),
        meta: { title: "节点管理", icon: "nodemgr" }
      },

      {
        path: "/roles/server_control",
        name: "部署管理",
        component: () => import("@/views/equipment_management/server_control"),
        meta: { title: "部署管理", icon: "platform" }
      }
    ]
  },
  {
    path: "/rules_engine",
    component: Layout,
    redirect: "/rules_engine/engine",
    name: "规则引擎",
    meta: { title: "规则引擎", icon: "engine" },
    children: [
      {
        path: "/rules_engine/engine",
        name: "规则管理",
        component: () => import("@/views/engine/rulesengine"),
        meta: { title: "规则管理", icon: "rulesengine" }
      },
      {
        path: "/rules_engine/channel",
        name: "通道管理",
        component: () => import("@/views/engine/resourcechannel"),
        meta: { title: "通道管理", icon: "channelmanage" }
      },
      {
        path: "/rules_engine/addengine",
        name: "新增规则",
        component: () => import("@/views/engine/addengine"),
        meta: { title: "新增规则" },
        hidden: true
      },
      {
        path: "/rules_engine/checkengine",
        name: "查看规则",
        component: () => import("@/views/engine/checkengine"),
        meta: { title: "查看规则" },
        hidden: true
      }
    ]
  },
  {
    path: "/app",
    component: Layout,
    redirect: "/app",
    name: "应用（项目）服务",
    meta: { title: "应用（项目）服务", icon: "engine" }
  },
  {
    path: "/pro",
    component: Layout,
    redirect: "/pro",
    name: "产品管理",
    meta: { title: "产品管理", icon: "product" }
  },
  {
    path: "/help",
    component: Layout,
    redirect: "/help",
    name: "帮助中心",
    meta: { title: "帮助中心", icon: "help" }
  },
  { path: "*", redirect: "/404", hidden: true }
];

export default new Router({
  // mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});
