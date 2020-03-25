<template>
    <div class="webscoket">
       <div>
          <el-button type="info" @click="shezhi">设置</el-button>
          <el-button type="success" @click="connect" v-if="getconnect">连接</el-button>
          <el-button type="danger"  v-if="!getconnect" @click="duankai">断开</el-button>
          <el-button type="info" v-if="!getconnect" @click="dingyue" >订阅</el-button>
       </div>
       <div class="center">
          <div class="header">
            <h3>LORA模块控制</h3>
         </div>
          <div style="padding:20px;box-sizing:border-box">
             <el-input
               type="textarea"
               placeholder="请输入内容"
               v-model="input10"
               :rows="5"
               style="overflow-y:scroll">
               </el-input>
          </div>
          <div style="padding:20px;box-sizing:border-box;text-align:right" >
             <el-button type="success" @click="send">发送</el-button>
          </div>
       </div>
       <div class="loracenter">
      <div class="header">
        <h3>结果输出</h3>
      </div>
      <div class="center1">
        <label for>搜 索：</label>
        <el-input style="width:200px"></el-input>
        <el-button type="primary" >清 空</el-button>
      </div>
      <div class="stable">
        <el-table
          :data="tableData"
          style="width: 100%"
          :default-sort="{prop: 'date', order: 'descending'}"
        >
          <el-table-column prop="date" label="时间" sortable width="180"></el-table-column>
          <el-table-column prop="content" label="内容" sortable></el-table-column>
        </el-table>
      </div>
    </div>
     <el-dialog title="连接" :visible.sync="webscoket" width="30%" >
      <el-form ref="form" :model="webscoketForm">
       <div class="block">
          <div>
             <label for="">主机地址</label>
            <el-input style="width:100%" v-model="webscoketForm.host"></el-input>
          </div>
          <div>
             <label for="">端口</label>
            <el-input style="width:100%" v-model="webscoketForm.port"></el-input>
          </div>
          <div>
           <label for="">客户端ID</label>
           <el-input style="width:100%" v-model="webscoketForm.clientId"></el-input>
          </div>
          <div>
             <label for="">用户名</label>
            <el-input style="width:100%" v-model="webscoketForm.userName"></el-input>
          </div>
          <div>
             <label for="">密码</label>
            <el-input style="width:100%" v-model="webscoketForm.password" type="password"></el-input>
          </div>
          <div>
           <label for="">心跳间隔</label>
           <el-input style="width:100%" placeholder="KeepAlive" v-model="webscoketForm.keepAlive"></el-input>
          </div>
          <p>
              <el-checkbox v-model="checked" >清除会话</el-checkbox>
          </p>
         <p>
            <el-checkbox v-model="checked1">SSL</el-checkbox>
         </p>
          <h4>当前状态</h4>
       </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="connect" style="float:right">连接</el-button>
      </span>
    </el-dialog>
    <!--订阅窗口-->
    <el-dialog title="连接" :visible.sync="dingyuedialog" width="40%" >
     <div class="block1">
        <label for="">Topic:</label>
        <el-input style="width:200px" v-model="topic"></el-input>
        <el-button type="success" style="margin-left:30px;" @click="startdingyue">开始订阅</el-button>
        <el-button type="danger" @click="qxdingyue">取消订阅</el-button>
     </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="dingyuedialog = false" style="float:right">关 闭</el-button>
      </span>
    </el-dialog>
    </div>
</template>
<script>
import {Websocket,sendInfo,TOPIC_EMPTY,MSG_EMPTY,DISCONNECT_MSG} from'@/utils/wxscoket.js'
export default {
   data() {
      return {
         input10:'',
         tableData:[],
         webscoket:false,
         dingyuedialog:false,
         topic:'/vc/recv',
         webscoketForm:{
            host:'',
            port:'',
            clientId:'',
            userName:'',
            password:'',
            keepAlive:''
         },
         checked:true,
         checked1:false,
         getconnect:true,
         dataSet:[
            ["/vc/logger", 0, "日志TOPIC", false],
            ["/vc/recv", 0, "集中器发送", false]
         ]
      }
   },
   mounted() {
      this.getmess()
   },
   methods: {
      getmess(){
      Websocket.cInfo.host=location.hostname
      Websocket.newClient()
      Websocket.connect()
      this.tableData = Websocket.tablelist
      this.webscoketForm =  Websocket.cInfo
      this.input10 = JSON.stringify(sendInfo,null,4)
      },
      connect(){
         Websocket.cInfo.host =this.webscoketForm.host
         Websocket.cInfo.port =this.webscoketForm.port
         Websocket.cInfo.clientId =this.webscoketForm.clientId
         Websocket.cInfo.userName =this.webscoketForm.userName
         Websocket.cInfo.password =this.webscoketForm.password
         Websocket.cInfo.keepAlive =this.webscoketForm.keepAlive
         Websocket.newClient()
         Websocket.connect()
         this.tableData = Websocket.tablelist
         console.log(Websocket.connState)
         if(Websocket.connState==true){
            this.getconnect=false
            this.webscoket = false
         }
         
      },
      shezhi(){
         this.webscoket=true
      },
      duankai(){
         this.getconnect=true
         Websocket.disconnect()
         this.tableData = Websocket.tablelist
      },
      dingyue(){
         this.dingyuedialog = true
      },
      startdingyue(){
         var info = {
			topic:this.topic,
			qos:0
		}
		 Websocket.subscribe(info, function(res){
      if(res.result){
				alert("订阅成功");
			}		
      });
      },
       qxdingyue(){
         var info = {
			topic:this.topic,
			qos:0
		}
		 Websocket.unsubscribe(info, function(res){
         if(res.result){
               alert("取消订阅");
            }		
         });
      },
      send(){
         Websocket.sendInfo = this.input10
         Websocket.send()
      }
   }
}
</script>
<style scoped>
.webscoket{
  background: #ffffff;
  padding-left: 10px;
  margin-top: 20px;
  box-sizing: border-box;
  width: 100%;
  min-height: 875px;
}
.center{
   border:1px solid #cccccc;
   margin-top:20px;
}
.header {
  background: #f5f5f5;
  padding: 0 20px;
  box-sizing: border-box;
}
.header h3 {
  margin: 0;
  height: 50px;
  line-height: 50px;
}
.loracenter {
  margin-top: 20px;
  border: 1px solid #cccccc;
}
.center1 {
  margin-top: 20px;
  padding: 0 20px;
  box-sizing: border-box;
}
.stable {
  margin-top: 20px;
}
</style>
<style>
.webscoket .el-dialog__footer {
  padding-bottom: 50px;
}
.webscoket .el-dialog__body {
  border-bottom: 1px solid #dddddd;
  height:300px;
}
.block div{
   width:30%;
   float:left;
   margin-right:3%;
   margin-bottom:10px;
}
.block div label{
   display:block;
}
</style>

