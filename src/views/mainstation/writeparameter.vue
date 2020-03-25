<template>
  <div class="writeparameter">
    <div class="mainstation">
    <div>
      <el-row :gutter="32">
        <el-col :span="8">
          <div class="grid-content bg-purple" style="position:relative">
            <!-- <span
              style="margin-top:-20px;margin-left:10px;position:fixed;top:-5;left:10;background:white"
            >终端信息</span> -->
            <div class="outmain">
              <label for>终端编码：</label>
              <el-input type="text" style="display:inline-block;width:200px" v-model="msg.bianma"></el-input>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple" style="position:relative">
            <!-- <span
              style="margin-top:-20px;margin-left:10px;position:fixed;top:-5;left:10;background:white"
            ></span> -->
            <div class="outmain">
              <label for="">系统时间：</label>
              <el-input type="text" style="display:inline-block;width:300px" v-model="readtime"></el-input>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple" style="position:relative">
            <!-- <span
              style="margin-top:-20px;margin-left:10px;position:fixed;top:-5;left:10;background:white"
            ></span> -->
            <div class="outmain">
              <label for="">等待应答反馈时间/秒</label>
              <el-input type="number" style="display:inline-block;width:200px" v-model="msg.time"></el-input>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- <el-button @click="chuandi">sss</el-button> -->
  </div>
    <div class="caozuo">
      <el-form ref="form" :model="form" label-width="80px" :inline="true">
        <el-form-item label="参数类型：">
          <el-select v-model="form.region" placeholder="请选择参数类型">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="信息点标识pn：">
          <el-input type="number" v-model="msg.pn"></el-input>
        </el-form-item>
        <el-form-item label="数据标识DI：">
          <el-select v-model="form.region" placeholder="请选择参数类型">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="dingyue">下 发</el-button>
          <el-button type="info">召 读</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- <el-tabs type="border-card">
      <el-tab-pane label="通讯参数E000010F">
        <div>
          <el-checkbox v-model="checked1">通讯参数集合A(E000010F)</el-checkbox>
        </div>
        <div class="number1">
          <el-checkbox v-model="checked3">主站通讯地址</el-checkbox>
          <div style="margin-top:20px;">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
              <el-form-item label="通道类型：">
                <el-select v-model="formInline.region" placeholder="活动区域">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="主站号码：">
                <el-input v-model="formInline.user"></el-input>
              </el-form-item>
              <el-form-item label="端口：">
                <el-input v-model="formInline.user"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="通讯参数E000012F">
        <div>
          <el-checkbox v-model="checked2">通讯参数2集合E000012F</el-checkbox>
        </div>
        <div class="number2">
          <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign">
            <el-form-item label="通信工作模式：">
              <el-select v-model="formLabelAlign.region" placeholder="活动区域">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="TCP监听端口：">
              <el-input v-model="formLabelAlign.name"></el-input>
            </el-form-item>

            <el-form-item label="终端IP地址">
              <el-input v-model="formLabelAlign.type"></el-input>
            </el-form-item>

            <el-form-item label="终端子网掩码：">
              <el-input v-model="formLabelAlign.name"></el-input>
            </el-form-item>

            <el-form-item label="终端网关地址：">
              <el-input v-model="formLabelAlign.type"></el-input>
            </el-form-item>
            <el-form-item label="IP地址获取方式：">
              <el-select v-model="formLabelAlign.region" placeholder="活动区域">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>-->
    <div>
      <el-row :gutter="20">
        <!--第一个tree树-->
        <el-col :xs="24" :sm="24" :md="4" :lg="4" :xl="4">
          <el-tree
            :data="treeData"
            :props="defaultProps"
            :expand-on-click-node="false"
            :highlight-current="true"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </el-col>
        <!--第二个数据展示-->
         <el-col :xs="24" :sm="24" :md="20" :lg="10" :xl="10">
          <!-- <el-table :data="tableData" stripe style="width: 100%" border @selection-change="handleSelectionChange"  highlight-current-row
          class="tb-edit">
            <el-table-column label="DI">
               <template slot-scope="scope">
                  <el-input
                    v-if="scope.row.property.type=='string'"
                    size="small"
                    v-model="scope.row.yhmc"
                    placeholder="请输入内容"
                    @change="handleEdit(scope.row)"
                  ></el-input>
              <span>{{scope.row.yhmc}}</span>
            </template>
            </el-table-column>
            <el-table-column label="property"></el-table-column>
            <el-table-column label="当前状态"></el-table-column>
            <el-table-column label="ss">

            </el-table-column>
             <el-table-column
              type="selection"
              width="55">
            </el-table-column>
          </el-table> -->
           <el-form :model="dataformain" label-width="150px" >
            <el-form-item   v-for="(item,index) in dataformain.datasource" :label="item.name" :key="index" >
            <el-input   v-if="item.type=='string'" autocomplete="off" style="width:200px" v-model="item.default" @blur="inputchange(item)">
            </el-input>
             <el-select v-if="item.type=='combobox'" autocomplete="off" v-model="item.default" style="width:200px" @change="selectchange(item)">
                <el-option  v-for="itemchild in item.combobox" :key="itemchild.value" :label="itemchild.name" :value="itemchild.value"></el-option>
             </el-select>
         </el-form-item>
        </el-form>
        </el-col> 
       
        <!--第三个返回数据展示-->
         <el-col :xs="24" :sm="24" :md="20" :lg="10" :xl="10">
          <el-table :data="tableData1" stripe style="width: 100%" border  >
            <el-table-column label="DI">
               
            </el-table-column>
            <el-table-column label="设备编号"></el-table-column>
            <el-table-column label="当前状态"></el-table-column>
            <el-table-column label="ss">
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
// import Mainstation from "@/components/mainstation";
import Parse from 'parse'
import {Websocket,sendInfo,TOPIC_EMPTY,MSG_EMPTY,DISCONNECT_MSG} from'@/utils/wxscoket.js'
export default {
  // components: {
  //   Mainstation
  // },
  data() {
    return {
      dataformain:{
        datasource:[],
        datavalue:''
      },
      treeprops: {
        value: "objectId",
        label: "name"
      },
      tableData: [],//要修改的数据
      
      tableData1:[],//返回数据
      defaultProps: {
        children: "children",
        label: "name"
      },
      data: [],
      form: {
        region: ""
      },
      sendMsgDisabled: false,
      checked1: false,
      checked2: false,
      checked3: false,
      formInline: {
        user: "",
        region: ""
      },
      labelPosition: "left",
      formLabelAlign: {
        name: "",
        region: "",
        type: ""
      },
      multipleSelection:[],
      msg:{
        bianma:'',
        time:'',
        pn:''
      },
      readtime:'',
    };
  },
  computed: {
    treeData() {
      let cloneData = JSON.parse(JSON.stringify(this.data)); // 对源数据深度克隆
      return cloneData.filter(father => {
        let branchArr = cloneData.filter(
          child => father.objectId == child.ParentId
        ); //返回每一项的子级数组
        branchArr.length > 0 ? (father.children = branchArr) : ""; //如果存在子级，则给父级添加一个children属性，并赋值
        return father.ParentId == 0; //返回第一层
      });
    }
  },
  mounted() {
    this.getMainstation()
    this.getmess()
     this.$nextTick(function () {
            setInterval(this.nowtime, 1000);
        })
  },
  methods: {
     nowtime(){
            var timestamp3 = Date.parse(new Date());
            var date = new Date(timestamp3) 
            var Y = date.getFullYear() + '年';
            var M = (date.getMonth()+1 <= 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '月';
            var D = (date.getDate()+1 <= 10 ? '0'+(date.getDate()) : date.getDate()) + '日  ';
            var h = (date.getHours()+1 <= 10 ? '0'+(date.getHours()) : date.getHours())  + ':';
            var m = (date.getMinutes()+1 <= 10 ? '0'+(date.getMinutes()) : date.getMinutes())  + ':';
            var s = (date.getSeconds()+1 <= 10 ? '0'+(date.getSeconds()) : date.getSeconds());
            this.readtime=(Y+M+D+h+m+s); 
      },
    dingyue(){
           Websocket.sendInfo= {
            topic:"mainstation",
            qos:0,
            "from":"web",
            "type":"write_param",
            "vcaddr":this.msg.bianma,
            "timeout":this.msg.time,   //正序
            "pn":this.msg.pn,        //0-2032
            "session":"123456",
              }
              var info2={
                topic:"mainstationweb/"+this.msg.bianma,
                qos:0
              }
              console.log(Websocket.sendInfo)
          Websocket.send(Websocket.sendInfo, function(res){
            if(res.result){
               Websocket.subscribe(info2, function(res){
                if(res.result){
                    alert("订阅成功");
                }		
              });
            }		
          });
        
       },
    onSubmit() {
      console.log("submit!");
    },
    // send() {
    //   if (this.sendMsgDisabled == true) {
    //     this.sendMsgDisabled = false;
    //   } else {
    //     this.sendMsgDisabled = true;
    //   }
    // },
  
      handleNodeClick(row){
        this.dataformain.datasource=[]
       if(row.leafnode==true){
         var Dataitem = Parse.Object.extend('DataItem')
         var dataitem = new Parse.Query(Dataitem)
         dataitem.equalTo('itemType',row.objectId)
         dataitem.find().then(res=>{
           res.map(item=>{
             var obj = {}
             obj.name = item.attributes.itemName
             obj.type=item.attributes.property.type
             obj.combobox = item.attributes.property.combobox
             obj.itemCode = item.attributes.itemCode
             if(item.attributes.property.type=="string"){
               obj.default = item.attributes.property.default
             }else if(item.attributes.property.type=="combobox"){
               obj.default = item.attributes.property.default.value
             }
            this.dataformain.datasource.push(obj)
           })
         })
       }
    },
   
    inputchange(val){
      console.log(val)
    },
    selectchange(val){
      console.log(val)
    },
     handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleEdit(row) {
      console.log(row);
    },
    getMainstation(){
      this.data=[]
      var Mainstation = Parse.Object.extend('MainStationIndex')
      var mainstation = new Parse.Query(Mainstation)
      // mainstation.ascending('localAt')
      mainstation.find().then(result=>{
        result.map(items=>{
          var obj={}
          items.createtime = new Date(items.attributes.createdAt).toLocaleDateString()
          obj.name = items.attributes.name,
          obj.ParentId = items.attributes.ParentId
          obj.objectId =items.id
          obj.leafnode = items.attributes.leafnode
          obj.createtime = items.createtime
          this.data.push(obj)
        })
         
      })
    },
    	getmess(){
      Websocket.cInfo.host=location.hostname
      Websocket.cInfo.host='192.168.2.113'
      Websocket.newClient()
      Websocket.connect()
    }
  }
};
</script>
<style  scoped>
.writeparameter {
  width: 100%;
  min-height: 875px;
  padding: 20px;
  margin-top: 20px;
  box-sizing: border-box;
  background: #ffffff;
}
.caozuo {
  margin-top: 20px;
}
.number1,
.number2 {
  padding: 20px;
  box-sizing: border-box;
  background: #dddddd;
  margin-top: 10px;
}
</style>
<style>
.writeparameter .caozuo .el-form-item__label {
  width: auto !important;
}
.writeparameter .caozuo .el-input,
.writeparameter .caozuo .el-select {
  width: 200px;
}
.writeparameter .el-tabs--border-card {
  padding-bottom: 20px;
}
.number2 .el-select {
  width: 100%;
}
.number2 .el-form-item__label {
  width: auto !important;
}
.number2 .el-form-item__content {
  margin-left: 125px !important;
}
.writepa.writeparameter .tb-edit .el-input {
  display: none;
}
.writepa.writeparameter .tb-edit .current-row .el-input {
  display: block;
}
.writepa.writeparameter .tb-edit .current-row .el-input + span {
  display: none;
}
</style>

