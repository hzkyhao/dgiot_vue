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
        routes1:[],
        routes2:[],
        routes3:[],
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
       
      let cloneData = JSON.parse(JSON.stringify(this.routes1)); // 对源数据深度克隆
      if(this.dashboard!=''&&this.dashboard){
        cloneData.unshift({
          name:'首页',
          icon:'dashboard',
          url:this.dashboard
        })
      }else{
         cloneData.unshift({
          name:'首页',
          icon:'dashboard',
          url:'/dashboard'
        })
      }
       
      // cloneData.map(items=>{
      //   if(items.url=='/swagger/'){
      //     items.url='http://'+location.host+'/swagger/'
      //   }
      //     if(items.name=='基础服务'){
      //       items.children.map(value=>{
      //         if(value.name=='帮助中心'){
      //            value.children.map(child=>{
      //           if(child.url=='/swagger/'){
      //               child.url='http://'+location.host+'/swagger/'
      //           }
            
      //           })
      //        }
      //       })
            
           
          
               
            
      //     }
      // })
      return cloneData
      // return cloneData.filter(father => {
      //   let branchArr = cloneData.filter(
      //     child => father.objectId == child.parentId
      //   ); //返回每一项的子级数组
      //   branchArr.length > 0 ? (father.children = branchArr) : ""; //如果存在子级，则给父级添加一个children属性，并赋值
      //   return father.parentId == 0; //返回第一层
      // });
  
      
      // this.routes1= JSON.parse(sessionStorage.getItem('list'))
      //   this.originroute.map(item=>{
      //    this.routes1.map(sideitem=>{
      //      if(item.name===sideitem.name){
      //         item.children.map(sonitem=>{
      //           sonitem.hidden=true
      //           this.routes1.map(sideitem=>{
      //         if(sideitem.name===sonitem.name){
      //             sonitem.hidden=false
      //             return sonitem   
      //         }
      //         })
      //         return item
      //       })
      //       this.routes2.push(item)
      //      }
           
      //    })
         
      //   })
      // return this.routes2
      
      // return this.$router.options.routes
      
      }
    },
    isCollapse() {
      return !this.sidebar.opened
    },
   
  },
  mounted(){
   this.routes1= JSON.parse(localStorage.getItem('list'))
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

