<template>
    <div class="userinfo">
       <div class="userdetail">
          <h3>个人信息</h3>
          <ul>
             <li>用户姓名:<span>{{userinfo.name}}</span></li>
             <li>用户ID:<span>{{userinfo.id}}</span></li>
             <li>用户描述:<span>{{userinfo.nick}}</span></li>
             <li>操作权限:<span>{{roles.join(',')}}</span></li>
          </ul>
       </div>
    </div>
</template>
<script>
var editor
import Parse from 'parse'
import ScrollPane from '@/components/ScrollPane';
// import gql from "graphql-tag";
// import {GameScores} from'@/api/search.graphql'
export default {
   name:'userinfo', 
   data() {
      return {
         userid:'',
         userinfo:{
            name:'',
            nick:'',
            id:'',
            roles:'',
         },
         roles:[],
         // graphql:''
      }
   },
//    apollo:{
//     query:{
//       query() {
//         return gql`query Health {
//                 health
//                }`
//       },
//     }
//   },
   mounted() {
      this.userid = this.$route.params.userid
      this.userinfo.name = Parse.User.current().attributes.username
      this.userinfo.nick = Parse.User.current().attributes.nick
      this.userinfo.id = Parse.User.current().id
      this.userinfo.roles = Parse.User.current().attributes.roles
      this.userinfo.roles.map(items=>{
         this.roles.push(items.alias)
      })
      //  editor = ace.edit('editor')
      // editor.session.setMode('ace/mode/graphqlschema') // 设置语言
      // editor.setTheme('ace/theme/monokai')// 设置主题
      // // enable autocompletion and snippets
      // editor.setOptions({
      //    enableBasicAutocompletion: true,
      //    enableSnippets: true,
      //    enableLiveAutocompletion: true// 设置自动提示
      // })
   },
   methods: {
      // testgraphql(){
      //    this.$apollo.query({
      //       query:gql`${editor.getValue()}`
      //    }).then(resultes=>{
      //       console.log(resultes)
      //    }).catch(error=>{
      //       console.log(error)
      //    })
     
   // }
}
}
</script>
<style  lang="scss" scoped>
.userinfo{
  height: 100%;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  background: #fff;
  .userdetail{
     height:500px;
     width:1000px;
     background: #f9fafc;
     margin:0 auto;
     padding:20px;
     box-sizing: border-box;
     box-shadow: 4px 4px 8px  rgba(0,0,0,0.5);
     h3{
        text-align:center;
     }
     ul{
        li{
           list-style: none;
           margin-top:50px;
           color:666;
           span{
              margin-left:20px;
              color: #666;
           }
        }
     }

  }
}
</style>
