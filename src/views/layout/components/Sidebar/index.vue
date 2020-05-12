<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      mode="horizontal"
      background-color="#1063A7"
      text-color="#ffffff"
      active-text-color="#90d91b"
    >
      <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path"/>
    </el-menu>
  </el-scrollbar>
</template>
 
<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import Cookies from 'js-cookie';
 
export default {
  components: { SidebarItem },
 
  data(){
    return{
      route:[],
      originroute:[],
      comparroute:[],
        username:'',
        token:'',
        type:'',
        dashboard:''
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      this.username=Cookies.get('username')
      this.token = Cookies.get('sessionToken')
      this.dashboard = Cookies.get('dashboard_url')
      // this.type = sessionStorage.getItem('type')
      if(!this.token||this.token==-1){
        this.$router.push('/login')
      }else{
      // this.originroute = this.$router.options.routes

       let cloneData = JSON.parse(localStorage.getItem('list'))
      // let cloneData = JSON.parse(JSON.stringify(this.routes1)); // 对源数据深度克隆

       cloneData.unshift({
          name:'首页',
          icon:'dashboard',
          url:this.dashboard ? this.dashboard :'/dashboard'
        })

     let newArr =  cloneData.filter((item,index)=>{    
        if(['实验仪器管理','取证设备列表'].includes(item.name)){
          // console.log('去除');          
            return false
        } else {
          return true
        }

      })
  
      return newArr
      
      }
    },
    isCollapse() {
      return !this.sidebar.opened
    },
   
  },
  mounted(){
  },
}
</script>
<style>
.el-menu--horizontal>div>.el-submenu {
    float: left;
}

/* 一级菜单的样式 */
.el-menu--horizontal>div>.el-menu-item {
    float: left;
    height: 60px;
    line-height: 60px;
    margin: 0;
    border-bottom: 2px solid transparent;
    color: #909399;
} 
.el-submenu__icon-arrow{
  right:0 !important;
}
.el-menu-item, .el-submenu__title{
  height:40px;
  line-height:40px;
}
</style>

