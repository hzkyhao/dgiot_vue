<template>
  <div class="lora" id=websocket_box>
    <div class="loratop">
      <div class="header">
        <h3>LORA模块控制</h3>
      </div>
      <div class="lorasection">
        <div>
          <label for style="display:inline-block">Ⅱ采地址：</label>
          <div class="el-input" style="width:300px;">
            <input v-model="devs" style="width:200px;" class="el-input__inner">
          </div>
          <el-button type="primary" @click="GetAppeui">搜 索</el-button>
        </div>
        <div class="appeui">
          <label for>Appeui:</label>
          <el-input v-model="appeui" style="border:none;width:200px;"></el-input>
          <el-button type="primary" v-if="appeui!=''" @click="dingyue">订阅</el-button>
          <el-button type="danger" v-if="appeui!=''" @click="quxiao">取消订阅</el-button>
        </div>
        <div>
          <label for>操作：</label>
          <el-radio-group v-model="radio">
            <el-radio :label="'0000'">LORA模块重启</el-radio>
            <el-radio :label="'0001'">LORA自动搜表</el-radio>
            <el-radio :label="'0002'">删注册信息并重启搜表</el-radio>
            <el-radio :label="'0003'">读LORA模块信息</el-radio>
            <el-radio :label="'00'">计划停电
              <el-input placeholder="停电时间/小时" v-model="stoptime"></el-input>
            </el-radio>
          </el-radio-group>
        </div>
        <el-button type="success">执 行</el-button>
      </div>
    </div>
    <div class="loracenter">
      <div class="header">
        <h3>结果输出</h3>
      </div>
      <div class="center">
        <label for>搜 索：</label>
        <el-input style="width:200px"></el-input>
        <el-button type="primary" @click="empty">清 空</el-button>
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
  </div>
</template>
<script>
import {Getdeveui} from '@/api/installation/index'
// import '@/utils/mqttws31.js'
import {Websocket,sendInfo,TOPIC_EMPTY,MSG_EMPTY,DISCONNECT_MSG} from'@/utils/wxscoket.js'
export default {
   data() {
      return {
          devs:'',
          radio:'0000',
          stoptime:'',
          node:null,
          appeui:'',
          tableData: [],
      }
   },
   watch:{
   },
   created() {
        
   },
   mounted() {
    this.getmess()
     
   },
   methods: {
       empty(){
        //  this.tableData =[]
       },
       GetAppeui(){
           if(this.devs==''){
               this.$message({
                message: '请输入Ⅱ采地址',
                type: 'warning'
                });
           }else{
               Getdeveui(this.node,this.devs).then(response=>{
               if(response.result==true){
                   this.appeui=response.info.appeui
               }
           })
           }
           
       },
       dingyue(){
          var info = {
            topic:"vmsc/send/r:d6a94e6144b8303ac2d5776e015a2245",
            qos:0
          }
          var info2 = {
            topic:"ni/tx/"+this.appeui,
            qos:0
          }
          Websocket.subscribe(info, function(res){
            if(res.result){
              console.log('订阅成功')
              // Websocket.subscribe(info2, function(res){
              //   if(res.result){
              //     alert("订阅成功");
              //   }	
              //   // this.tableData = Websocket.tablelist
              // });
            }		
          });
        
       },
		quxiao(){
        var info = {
            topic:"ni/rx/"+this.appeui,
            qos:0
          }
          var info2 = {
            topic:"ni/tx/"+this.appeui,
            qos:0
          }
          Websocket.unsubscribe(info, function(res){
            if(res.result){
             Websocket.unsubscribe(info2, function(res){
                if(res.result){
                  alert("取消订阅");
              // this.tableData = Websocket.tablelist
                }		
              });
            }		
          });
        },
		getmess(){
      Websocket.cInfo.host='148.70.107.74'
      Websocket.newClient()
      Websocket.connect()
      this.tableData = Websocket.tablelist
    }
   }
}
</script>
<style scoped>
.lora {
  min-height: 875px;
  background: white;
  padding: 20px;
  box-sizing: border-box;
  margin-top:20px;
}
.loratop {
  width: 100%;
  height: 450px;
  border: 1px solid #cccccc;
  border-radius: 5px;
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
.lorasection {
  width: 100%;
  height: auto;
  padding: 20px;
  box-sizing: border-box;
}
.lorasection div {
  margin: 10px 0;
}
.loracenter {
  margin-top: 20px;
  border: 1px solid #cccccc;
}
.center {
  margin-top: 20px;
  padding: 0 20px;
  box-sizing: border-box;
}
.stable {
  margin-top: 20px;
}
</style>
<style >
.lora .el-table th {
  color: #00a65a;
  font-weight: 600;
}
.lora .el-table .cell {
  color: #00a65a;
}
.appeui .el-input__inner {
  border: 0 !important;
}
</style>
