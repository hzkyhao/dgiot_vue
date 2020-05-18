<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <!-- or name="fade" -->
      <!-- <keep-alive> -->
         <router-view :key="key"></router-view>
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
  DISCONNECT_MSG,
} from "@/utils/wxscoket.js";
import Parse from 'parse'
import { eventBus } from '@/api/eventBus';
export default {
  name: 'AppMain',
  data(){
    return {
      session:'',
      datasource:'',
      copyright:''
    }
  },
  watch:{
    $route(to,from){
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
  mounted() {
   
    //websocket更新方法  
      if(!(window.location.pathname.indexOf('suke')!=-1)){
      if(this.$globalConfig.hostname){        
        Websocket.cInfo.host = this.$globalConfig.hostname
      } else {
        Websocket.cInfo.host = location.hostname
      }

      Websocket.subInfo = {
        topic: "web/" + this.$Cookies('sessionToken'), 
        qos: 2,
      };
      Websocket.newClient();
      Websocket.connect();
      Websocket.add_hook(/web\/.+/, function(Msg){
        this.datasource = JSON.parse(Msg)
         if(this.datasource){
          eventBus.$emit(this.datasource.type, this.datasource);
         }
      });
      // Websocket.recive = function(Msg){
      //   this.datasource = JSON.parse(Msg)
      //   console.log(Msg)
      //    if(this.datasource.type){
      //     eventBus.$emit(this.datasource.type, this.datasource);
      //    }else{

      //    }
         
      // }
    }
     
      this.getCopyright()
  },
  methods:{
     getCopyright(){
       this.copyright = sessionStorage.getItem('copyright')
   },
  },
  created(){
    
      
       
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
