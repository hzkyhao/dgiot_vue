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
        meta: { title: "????????????" }
      }
    ]
  },
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard/platform",
    name: "??????",
    children: [
      {
        path: "/dashboard",
        name: "??????",
        component: () => import("@/views/equipment_management/group"),
        redirect: "/dashboard/platform",
        meta: { title: "??????", icon: "platform" },
        children: [
          {
            path: "platform",
            meta: { title: "??????" },
            component: resolve =>
              require([
                "@/views/equipment_management/platform_overview"
              ], resolve)
          },
          {
            path: "devproduct",
            meta: { title: "??????" },
            component: resolve =>
              require(["@/views/equipment_management/home_group"], resolve)
          },
          {
            path: "devicelist",
            meta: { title: "??????" },
            component: resolve =>
              require(["@/views/equipment_management/home_index"], resolve)
          },
          {
            path: "productlist",
            meta: { title: "??????" },
            component: resolve =>
              require(["@/views/equipment_management/home_group2"], resolve)
          },
          {
            path: "resourcechannel",
            meta: { title: "??????" },
            component: resolve =>
              require(["@/views/engine/home_resourcechannel"], resolve)
          },
          {
            path: "dict",
            meta: { title: "??????" },
            component: resolve =>
              require(["@/views/engine/dict"], resolve)
          },
          {
            path: "engine",
            meta: { title: "??????" },
            component: resolve =>
              require(["@/views/engine/rulesengine"], resolve)
          },
          {
            path: "appmanage",
            meta: { title: "????????????" },
            component: () => import("@/views/systemmanage/appmarage")
          },
          {
            path: "expandprogram",
            meta: { title: "????????????" },
            component: () => import("@/views/systemmanage/expandprogram")
          },
          {
            path: "product",
            name: "????????????",
            component: () => import("@/views/equipment_management/devproduct"),
            meta: { title: "????????????", icon: "product" }
          }
        ]
      }
    ]
  },
  {
    path: "/roles",
    component: Layout,
    redirect: "/roles",
    name: "????????????",
    meta: { title: "????????????", icon: "rolemanage" },
    children: [
      {
        path: "/roles/structure",
        name: "????????????",
        component: () => import("@/views/roles/structure"),
        meta: { title: "????????????", icon: "usermanage" }
      },
      {
        path: "/roles/roles",
        name: "????????????",
        component: () => import("@/views/roles/rolelist/roles"),
        meta: { title: "????????????", icon: "adminmanage" }
      },
      {
        path: "/roles/rolescontrol",
        name: "????????????",
        component: () => import("@/views/roles/rolelist/rolescontrol"),
        meta: { title: "????????????", icon: "rolescontrol" }
      },
      {
        path: "/roles/editroles",
        name: "????????????",
        meta: { title: "????????????" },
        hidden: true,
        component: () => import("@/views/roles/rolelist/addroles")
      },
      {
        path: "/roles/applicationManagement",
        name: "????????????",
        component: () =>
          import("@/views/equipment_management/appOperate/application"),
        meta: { title: "????????????", icon: "application" }
      },
      {
        path: "/roles/edituser",
        name: "????????????",
        meta: { title: "????????????" },
        hidden: true,
        component: () => import("@/views/roles/adduser/edituser")
      },
      {
        path: "/roles/menu",
        name: "????????????",
        component: () => import("@/views/roles/menu"),
        meta: { title: "????????????", icon: "menu" }
      },
      {
        path: "/roles/department",
        name: "????????????",
        component: () => import("@/views/roles/department/department"),
        meta: { title: "????????????", icon: "department" }
      },
      {
        path: "/applicationManagement/addApp",
        name: "????????????",
        component: () =>
          import("@/views/equipment_management/appOperate/addApp"),
        hidden: true,
        meta: { title: "????????????", icon: "department" }
      },
      {
        path: "/roles/projectManagement",
        name: "????????????",
        component: () =>
          import("@/views/equipment_management/appOperate/applicationManagement"),
        meta: { title: "????????????", icon: "project" }
      },
      {
        path: "/roles/appmanage",
        name: "????????????",
        component: () => import("@/views/systemmanage/appmarage"),
        meta: { title: "????????????", icon: "appmanage" }
      },
      {
        path: "/roles/thing",
        name: "????????????",
        component: () => import("@/views/equipment_management/index"),
        meta: { title: "????????????", icon: "device" }
      },
      {
        path: "/roles/group",
        name: "????????????",
        component: () => import("@/views/equipment_management/group"),
        meta: { title: "????????????", icon: "group" }
      },
      {
        path: "/performance_monitoring",
        component: () => import("@/views/dashboard/index"),
        name: "????????????",
        meta: { title: "????????????", icon: "platform" }
      },
      {
        path: "/modules",
        meta: { title: "???????????????" },
        component: () => import("@/views/systemmanage/modules")
      },
      {
        path: "/roles/product",
        name: "????????????",
        component: () => import("@/views/equipment_management/devproduct"),
        meta: { title: "????????????", icon: "product" }
      },
      {
        path: "/roles/detailproduct",
        name: "????????????",
        component: () => import("@/views/equipment_management/proddetail"),
        meta: { title: "????????????" },
        hidden: true
      },
      {
        path: "/roles/thingsParse",
        name: "?????????",
        component: () => import("@/views/equipment_management/thingsParse"),
        meta: { title: "?????????" },
        hidden: true
      },
      {
        path: "/roles/editdevices",
        name: "????????????",
        component: () => import("@/views/equipment_management/editdevices"),
        meta: { title: "????????????" },
        hidden: true
      },
      {
        path: "/roles/onlinetest",
        name: "????????????",
        component: () => import("@/views/equipment_management/onlinetest"),
        meta: { title: "????????????", icon: "onlinetest" }
      },
      {
        path: "/roles/nodes",
        name: "????????????",
        component: () => import("@/views/installation/log"),
        meta: { title: "????????????", icon: "nodemgr" }
      },

      {
        path: "/roles/server_control",
        name: "????????????",
        component: () => import("@/views/equipment_management/server_control"),
        meta: { title: "????????????", icon: "platform" }
      }
    ]
  },
  {
    path: "/rules_engine",
    component: Layout,
    redirect: "/rules_engine/engine",
    name: "????????????",
    meta: { title: "????????????", icon: "engine" },
    children: [
      {
        path: "/rules_engine/engine",
        name: "????????????",
        component: () => import("@/views/engine/rulesengine"),
        meta: { title: "????????????", icon: "rulesengine" }
      },
      {
        path: "/rules_engine/channel",
        name: "????????????",
        component: () => import("@/views/engine/resourcechannel"),
        meta: { title: "????????????", icon: "channelmanage" }
      },
      {
        path: "/rules_engine/addengine",
        name: "????????????",
        component: () => import("@/views/engine/addengine"),
        meta: { title: "????????????" },
        hidden: true
      },
      {
        path: "/rules_engine/checkengine",
        name: "????????????",
        component: () => import("@/views/engine/checkengine"),
        meta: { title: "????????????" },
        hidden: true
      }
    ]
  },
  {
    path: "/app",
    component: Layout,
    redirect: "/app",
    name: "????????????????????????",
    meta: { title: "????????????????????????", icon: "engine" }
  },
  {
    path: "/pro",
    component: Layout,
    redirect: "/pro",
    name: "????????????",
    meta: { title: "????????????", icon: "product" }
  },
  {
    path: "/help",
    component: Layout,
    redirect: "/help",
    name: "????????????",
    meta: { title: "????????????", icon: "help" }
  },
  { path: "*", redirect: "/404", hidden: true }
];

export default new Router({
  // mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});
