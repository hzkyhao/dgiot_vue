<template>
  <el-menu class="navbar" style="background:#549ce6">
    <!-- <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/> -->
    <!-- <breadcrumb  class="breadcrumb-container"/> -->
     <div class="systitle">
      <img :src="imgsrc">
      <h2>{{title}}</h2>
      <!-- <h2 v-if="type=='pump'">水泵智能检测大数据平台</h2> -->
    </div>
    <sidebar/>
    <el-tooltip :content="isscreenfull" effect="dark" placement="bottom" style="height:20px">
          <screenfull class="screenfull right-menu-item"/>
         
    </el-tooltip>
    <!-- <el-tooltip :content="isscreenfull" effect="dark" placement="bottom" style="height:20px" v-else>
            <span class="screenfull right-menu-item">
            <svg-icon icon-class="out"/>
          </span>
    </el-tooltip> -->
    <!--中英文切换-->
    <div class="language">
      <lang-select class="international right-menu-item"/>
    </div>
     <div class="username" @click="userDetail">
      <!-- <span class="user" style="color:#ffffff">欢迎您：{{roles}}</span> -->
      <img src="../../imgages/tou.png">
      <p style="height:40px">{{$t('navbar.userinfo')}}</p>
    </div>
    <div class="loginout" style="font-size:25px;color:#ffffff;cursor:pointer;" @click="logout">
       <el-tooltip class="item" effect="dark" content="注销登录" placement="top-start">
        <i class="el-icon-switch-button"></i>
      </el-tooltip>
      <p style="height:40px">{{$t('navbar.logOut')}}</p>
    </div>
    
    <!-- <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <img :src="imgsrc" class="user-avatar">
        <i class="el-icon-caret-bottom"/>
      </div>
      <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>
              {{ $t('navbar.Home') }}
            </el-dropdown-item>
          </router-link>
            <router-link to="/userinfo">
            <el-dropdown-item>
              个人中心
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">{{ $t('navbar.logOut') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown> -->
  </el-menu>
</template>
 
<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import {logoutBtn} from '@/api/login'
import Cookies from 'js-cookie'
import { Sidebar} from './components'
import LangSelect from '@/components/LangSelect'
import Screenfull from '@/components/Screenfull'
import Parse from 'parse'
// import SizeSelect from '@/components/SizeSelect'
import { eventBus } from '@/api/eventBus';
import { Websocket } from '@/utils/wxscoket.js';
export default {
  name:'Navbar',
  data(){
   return{
     imgsrc:require('../../imgages/banner.png'),
     username:'',
     roles:'',
     type:'',
     isscreenfull:'全屏',
     title:'',
     usernameid:''
   }
  },
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull,
    Sidebar,
    LangSelect
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ]),
     
  },
  created(){
   this.getTitle()
  //  var _self = this
    // this.$nextTick(function () {
    //   document.addEventListener('keyup', function (e) {
    //   //此处填写你的业务逻辑即可
    //    if (e.keyCode == 27) {
         
    //         _self.isscreenfull = '全屏'
    //         console.log(_self.isscreenfull)
    //       }
    //     })
    //   })
  },
  methods: {
    getTitle(){
     this.title=sessionStorage.getItem('product_title')
     this.imgsrc=sessionStorage.getItem('imgsrc')
     this.usernameid = Parse.User.current().id
    },
    getsccreen(){
      eventBus.$on('isshow',data=>{
        this.isscreenfull = data;
      })
    },
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
     Parse.User.logOut(this.username).then(res=>{
        this.$router.push('/login')
        sessionStorage.removeItem('username')
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('list')
        this.$store.dispatch('delAllViews')
      },(error=>{
         this.$router.push('/login')
        sessionStorage.removeItem('username')
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('list')
        this.$store.dispatch('delAllViews')
      }))
    },
    userDetail(){
      this.$router.push({
        name:'userinfo',
        params:{
          userid:this.usernameid
        }
      })
    }
  },
  mounted() {
    this.username = sessionStorage.getItem('username')
    this.type = sessionStorage.getItem('type')
    this.roles = sessionStorage.getItem('roles')
    this.getsccreen()   
  },
}
</script>
 
<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 40px;
  line-height: 40px;
  border-radius: 0px !important;
  .el-scrollbar{
    position:absolute;
    left:20%;
    width: 60%;
  }
  .language{
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 80px;
  }
  .username{
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 105px;
    bottom:0;
    cursor: pointer;
  }
  @media screen and (max-width: 1024px) {
      .username {
       display: none;
    }
      }
  .systitle{
    height: 50px;
    position: absolute;
    left:20px;
    top:-25px;
    font-size:20px;
    color:white;
    display: flex;
    img {
      height: 40px;
      width:40px;
    }
    /deep/  h2{
      width:100%;
      height:100%;
      line-height:50px;
      margin-left: 10px;
    }
  }
  .size{
     height: 50px;
    display: inline-block;
    position: absolute;
    right: 140px;
  }
  .hamburger-container {
    line-height: 58px;
    height: 80px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right:5px;
    bottom: 20px;
  }
  .loginout {
    height: 50px;
    display: inline-block;
    position: absolute;
    right:50px;
    top:-23px;
    font-size: 18px !important;
    p {
      position: absolute;
      color: #fff;
      top:6px;
      right: -36px;
      width: 70px;
      font-size: 13px;
    }
  }
}
.username {
  img {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    vertical-align: middle;
    margin-top: -102px;
    margin-right:1rem;
  }
  .user {
    margin-right: 1rem;
  }
  p {
    position: absolute;
    top: -45px;
    right:-10px;
    text-align: center;
    width:70px;
    color:#fff;
  }
}
</style>

<style lang="scss">
.topheader {
  height: 80px !important;
  font-size: 13px !important;
  .navbar {
    height: 80px;
    line-height: 80px;
    .screenfull-svg {
      width: 15px !important;
      height: 15px !important;
    }
    .systitle {
      top:0;
      font-size: 14px;
      h2 {
        margin:0;
        line-height: 50px;
      }
    }
    &.el-menu {
      background: #034A8E !important;
    }
  }
  .el-scrollbar {
    top:0;
    overflow: hidden;
    .el-menu--horizontal {
      margin-top: 2.5rem;
      height: 80px;
      display: flex;
      justify-content: space-around;
      border-radius: 40px;
      .el-submenu__title {
        font-size: 14px;
        height:40px;
        line-height: 40px;
      }
    }
    .el-submenu__title .svg-icon {
      margin-right: 0.3rem;
    }
  } 
  /deep/ .el-dropdown{
    left: -100px;
    top: -10px;
    color:#ffffff;
  }
}
.el-menu--horizontal .el-menu .el-menu-item, .el-menu--horizontal .el-menu .el-submenu__title {
  font-size: 14px;
  height:40px;
  line-height: 40px;
}
.el-scrollbar .el-scrollbar__thumb {
  height: 0 !important;
}
.tags-view-container {
  z-index:1;
}
</style>