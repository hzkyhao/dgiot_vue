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
    path: "/pdf/download",
    component: () => import("@/views/pdf/download"),
    hidden: true
  },
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
        meta: { title: "首页", icon: "platform" },
        children: [
          {
            path: "platform",
            component: resolve =>
              require([
                "@/views/equipment_management/platform_overview"
              ], resolve)
          },
          {
            path: "devproduct",
            component: resolve =>
              require(["@/views/equipment_management/home_group"], resolve)
          },
          {
            path: "devicelist",
            component: resolve =>
              require(["@/views/equipment_management/home_index"], resolve)
          },
          {
            path: "productlist",
            component: resolve =>
              require(["@/views/equipment_management/home_group2"], resolve)
          },
          {
            path: "resourcechannel",
            component: resolve =>
              require(["@/views/engine/home_resourcechannel"], resolve)
          },
          {
            path: "engine",
            component: resolve =>
              require(["@/views/engine/rulesengine"], resolve)
          },
          {
            path: "/product",
            name: "产品管理",
            component: () => import("@/views/equipment_management/devproduct"),
            meta: { title: "产品管理", icon: "product" }
          },
        ]
      }
    ]
  },
  // 档案管理
  {
    path: "/filemanage",
    component: Layout,
    redirect: "/filemanage/index",
    name: "档案管理",
    meta: { title: "档案管理", icon: "file" },
    alwaysShow: true,
    children: [
      // {
      //   path: 'index',
      //   name: '户表关系导入',
      //   component: () => import('@/views/filemanage/index'),
      //   meta: { title: '户表关系导入', icon: 'hubiao' }
      // },
      {
        path: "/filemanage/metersearch",
        name: "档案维护",
        component: () => import("@/views/devicemanage/metersearch"),
        meta: { title: "档案维护", icon: "meter" }
      }
    ]
  },
  // {
  //   path: '/installation',
  //   component: Layout,
  //   redirect: '/installation/',
  //   name:'终端管理',
  //   meta: { title: '终端管理', icon: 'test' },
  //   children: [
  //     // {
  //     //   path: 'log',
  //     //   name: '日志查询',
  //     //   component: () => import('@/views/installation/log'),
  //     //   meta: { title: '日志查询', icon: 'log' }
  //     // },
  //     {
  //       path: 'lora',
  //       name: '通讯模块控制',
  //       component: () => import('@/views/installation/lora'),
  //       meta: { title: '通讯模块控制', icon: 'lora' }
  //     }
  //   ]
  // },

  {
    path: "/readmeter",
    component: Layout,
    redirect: "/readmeter",
    name: "集抄集收查询",
    meta: { title: "集抄集收查询", icon: "devicemanage" },
    alwaysShow: true,
    children: [
      {
        path: "/readmeter/historystatistical",
        name: "抄表数据查询",
        component: () => import("@/views/statistical/statistical"),
        meta: { title: "抄表数据查询", icon: "statisticalhistory" }
      }
    ]
  },
  {
    path: "/connectmanage",
    component: Layout,
    redirect: "/connectmanage/report",
    name: "主站交互",
    alwaysShow: true,
    meta: { title: "主站交互", icon: "connect" },

    children: [
      {
        path: "/connectmanage/report",
        name: "主站连接监测",
        component: () => import("@/views/connectmanage/report"),
        meta: { title: "主站连接监测", icon: "report" }
      },
      {
        path: "/connectmanage/testbaidu",
        name: "测试",
        component: () => import("@/views/connectmanage/baidumap"),
        meta: { title: "测试", icon: "report" }
      }
    ]
  },
  {
    path: "/monitoring",
    component: Layout,
    name: "监控分析",
    redirect: "/monitoring",
    meta: { title: "监控分析", icon: "tasks" },
    children: [
      {
        path: "/monitoring/meterReading",
        name: "抄表结果",
        component: () => import("@/views/monitoring/meterReading"),
        meta: { title: "抄表结果", icon: "piliang" }
      },
      {
        path: "/monitoring/meterMonitoring",
        name: "运行监控",
        component: () => import("@/views/monitoring/meterMonitoring"),
        meta: { title: "运行监控", icon: "piliang" }
      }
    ]
  },

  // {
  //   path: '/flat',
  //   component: Layout,
  //   redirect: '/flat/index',
  //   name: '设备搜寻',
  //   meta: { title: '设备搜寻', icon: 'zhuzhan' },
  //   children: [
  //     {
  //       path: 'index',
  //       name: '搜寻设备',
  //       component: () => import('@/views/flat/index'),
  //       meta: { title: '搜寻设备', icon: 'dushuju' },
  //     },

  //   ]
  // },
  // {
  //   path: '/sysmanage',
  //   component: Layout,
  //   redirect: '/sysmanage/',
  //   name:'系统管理',
  //   meta: { title: '系统管理', icon: 'system' },
  //   children: [
  //     {
  //       path: 'webscoket',
  //       name: 'webscoket',
  //       component: () => import('@/views/systemmanage/websocket'),
  //       meta: { title: 'Webscoket', icon: 'websocket' }
  //     },
  //     {
  //       path: 'lora',
  //       name: 'lora',
  //       component: () => import('@/views/installation/lora'),
  //       meta: { title: 'lora', icon: 'websocket' }
  //     },
  //     {
  //       path: 'appmanage',
  //       name: '插件管理',
  //       component: () => import('@/views/systemmanage/appmarage'),
  //       meta: { title: '插件管理', icon: 'appmanage' }
  //     },
  //     {
  //       path: 'nodelist',
  //       name: '节点列表',
  //       component: () => import('@/views/systemmanage/nodelist'),
  //       meta: { title: '节点列表', icon: 'nodelist' }
  //     }
  //   ]
  // },
  {
    path: "/dataanalysis",
    component: Layout,
    redirect: "/dataanalysis/index1",
    name: "大数据看板",
    alwaysShow: true,
    meta: {
      title: "大数据看板",
      icon: "dataany"
    },
    children: [
      {
        path: "/dataanalysis/index1",
        component: () => import("@/views/dataanalysis/index1"),
        name: "行业分析",
        meta: { title: "行业分析", icon: "hangyefenxi" }
      },
      {
        path: "/dataanalysis/index2",
        component: () => import("@/views/dataanalysis/index2"),
        name: "质量比对",
        meta: { title: "质量比对", icon: "zhiliang" }
      },
      {
        path: "/dataanalysis/index3",
        component: () => import("@/views/dataanalysis/index3"),
        name: "远程检测",
        meta: { title: "远程检测", icon: "link" }
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
        component: () => import("@/views/roles/test"),
        meta: { title: "菜单管理", icon: "menu" }
      },
      {
        path: "/roles/department",
        name: "部门管理",
        component: () => import("@/views/roles/department/department"),
        meta: { title: "部门管理", icon: "department" }
      },
      {
        path: "/roles/protocol",
        name: "协议管理",
        component: () => import("@/views/roles/protrol"),
        meta: { title: "协议管理", icon: "department" }
      },
      {
        path: "/roles/projectManagement",
        name: "工程管理",
        component: () =>
          import("@/views/equipment_management/appOperate/applicationManagement"),
        meta: { title: "工程管理", icon: "project" }
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
        path: "/roles/appmanage",
        name: "插件管理",
        component: () => import("@/views/systemmanage/appmarage"),
        meta: { title: "插件管理", icon: "appmanage" }
      },
      {
        path: "/roles/tasklistmanage",
        name: "任务管理",
        component: () => import("@/views/equipment_management/tasklistmanage"),
        meta: { title: "任务管理", icon: "tasklistmanage" }
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
        path: "/roles/product",
        name: "产品管理",
        component: () => import("@/views/equipment_management/devproduct"),
        meta: { title: "产品管理", icon: "product" }
      },
      {
        path: "/roles/taskcollection",
        name: "任务采集",
        component: () =>
          import("@/views/equipment_management/task_collection1"),
        meta: { title: "任务采集", icon: "taskcollection" }
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
      },
      {
        path: "/roles/tdengine",
        name: "数据库管理",
        component: () => import("@/views/equipment_management/tdengine"),
        meta: { title: "数据库管理", icon: "platform" }
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
  // {
  //   path: 'external-link',
  //   component: Layout,
  //   name: '开发者平台',
  //   meta: { title: '开发者平台', icon: 'department' },
  //   children: [
  //     {
  //       path: 'http://ci.iotn2n.com:18083',
  //       name: '数蛙iot平台',
  //       // component: () => import('@/views/developer/developer'),
  //       meta: { title: '数蛙iot平台', icon: 'report' }
  //     },
  //     {
  //       path: 'http://prod.iotn2n.com:5080/swagger/',
  //       name: '文档中心',
  //       // component: () => import('@/views/developer/developer'),
  //       meta: { title: '文档中心', icon: 'report' }
  //     }
  //   ]
  // },
  { path: "*", redirect: "/404", hidden: true }
];

export default new Router({
  // mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});
