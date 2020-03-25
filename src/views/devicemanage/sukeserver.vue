<template>
  <div class="sukeserver">
    <el-tabs v-model="activeName">
      <el-tab-pane label="推送记录" name="first">
        <div class="firstheader">
          <el-form ref="zlForm" :model="zlForm" :inline="true" >
              <el-form-item label="设备类型">
                <el-select v-model="zlForm.hardwareType" placeholder="请选择设备类型">
                  <el-option
                    v-for="(item,index) in deviceData"
                    :key="index"
                    :label="item.name"
                    :value="item.name"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="指令状态">
                <el-select v-model="zlForm.status" placeholder="请选择指令状态">
                  <el-option label="发送成功" value="SEND_SUCCESS"></el-option>
                  <el-option label="发送失败设备不在线" value="SEND_FAIL_OFFLINE"></el-option>
                  <el-option label="发送失败授权码不正确" value="SEND_FAIL_DISALLOW"></el-option>
                  <el-option label="等待发送" value="WAIT_SEND"></el-option>
                </el-select>
              </el-form-item>
               <el-form-item label="设备编号">
                 <el-input type="text" v-model="zlForm.hardware_number"></el-input>
              </el-form-item>
               <el-form-item>
              <el-button type="primary" size="mini" @click="getServerlist(0)">查询</el-button>
              <el-button type="primary" size="mini" @click="resetserver">重置</el-button>
            </el-form-item>
           
          </el-form>
        </div>
         <div class="firsttable" style="margin-top:10px">
          <el-table :data="zlData" style="width: 100%;text-align:center;">
            <el-table-column  label="设备类型" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.attributes.hardwareType}}</span>
              </template>
            </el-table-column>
            <el-table-column  label="设备编号" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.attributes.hardware_number}}</span>
              </template>
            </el-table-column>
            <el-table-column  label="应用商" align="center">
               <template slot-scope="scope">
                <span>{{scope.row.attributes.instruct_id}}</span>
              </template>
            </el-table-column>
            <el-table-column  label="指令" align="center">
              <template slot-scope="scope">
                <span >{{scope.row.attributes.paras}}</span>
              </template>
            </el-table-column>
            <el-table-column  label="推送时间" align="center">
              <template slot-scope="scope">
                <span>{{utc2beijing(scope.row.createdAt)}}</span>
              </template>
            </el-table-column>
            <el-table-column  label="发送状态" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.attributes.status=='SEND_SUCCESS'" style="color:green">发送成功</span>
                <span v-else-if="scope.row.attributes.status=='WAIT_SEND'" style="color:#e6a23c">等待发送</span>
                <span v-else style="color:red">发送失败</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="fenye">
          <el-pagination
            background
            @size-change="zlSizeChange"
            :pager-count="5"
            @current-change="zlCurrentChange"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="zlPageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="zlTotal"
          ></el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="服务商管理" name="second">
        <div>
        <div class="sukeserverheader">
        <el-form ref="sukeserver" :model="sukeserver" :inline="true">
            <el-form-item label="应用商名称">
            <!-- <el-input v-model="sukeserver.name" placeholder="应用商名称"></el-input> -->
             <el-select v-model="sukeserver.name" placeholder="请选择应用商名称">
                  <el-option
                    v-for="(item,index) in serverdata"
                    :key="index"
                    :label="item.name"
                    :value="item.name"
                  ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="应用商代号">
             <el-select v-model="sukeserver.id" placeholder="请选择应用商代号">
                  <el-option
                    v-for="(item,index) in serverdata"
                    :key="index"
                    :label="item.id"
                    :value="item.id"
                  ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="应用商接口地址">
            <el-select v-model="sukeserver.url" placeholder="请选择应用商接口地址">
                  <el-option
                    v-for="(item,index) in serverdata"
                    :key="index"
                    :label="item.url"
                    :value="item.url"
                  ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="应用商接口para">
            <el-input v-model.number="sukeserver.para" placeholder="应用商接口para"  :min="0"></el-input>
            </el-form-item>
            <el-form-item>
            <el-button type="primary"  size="mini" @click="queryyys">查 询</el-button>
            <el-button type="primary"  size="mini" @click="resetyyys">重置</el-button>
            </el-form-item>
      </el-form>
    </div>
      
      <el-button type="primary" icon="el-icon-plus" style="float:right;margin-bottom:10px" @click="editorupdatesuke">添加应用商</el-button>
      <el-button type="primary"  @click="editorSuke" style="float:right;margin-bottom:10px;margin-right:10px">编辑</el-button>
    </div>
    <div class="sukesecond">
      <el-table :data="ispData" style="width:100%;text-align:center" height="300">
        <el-table-column label="#" width="65" align="center">
        <template slot-scope="scope" >
            <el-radio :label="scope.row.objectId" v-model="templateRadio" @change.native="getTemplateRow(scope.$index,scope.row)">{{'   '}}</el-radio>
        </template>
        </el-table-column>
        <el-table-column prop="name" label="应用商名称" align="center"></el-table-column>
        <el-table-column prop="id" label="应用商代号" align="center"></el-table-column>
        <el-table-column prop="url" label="应用商接口地址" align="center" width="400"></el-table-column>
        <el-table-column prop="para" label="应用商接口PARA" align="center"></el-table-column>
        <el-table-column  label="默认应用商" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.default==true">是</span>
            <span v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="success"  @click="TsSuke(scope.row)" size="mini">推送</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="fenye">
      <el-pagination
        background
        @size-change="IspSizeChange"
        @current-change="IspCurrentChange"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="ispPageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="ispTotal"
      ></el-pagination>
    </div>
    <div class="geduan" style="width:100%;height:4px;background:#cccccc;margin-top:5px"></div>
    <div class="addisp" v-show="isIsp">
      <el-form ref="Ispform" :model="Ispform" label-width="200px" :rules="Isprules">
        <el-form-item label="应用商名称" prop="name">
          <el-input v-model="Ispform.name" placeholder="应用商名称，1-30个字符"></el-input>
        </el-form-item>
        <el-form-item label="应用商代号" prop="code">
          <el-input v-model="Ispform.code" placeholder="应用商代号，2个数字、字母组合"></el-input>
        </el-form-item>
        <el-form-item label="应用商接口地址" prop="url">
          <el-input v-model="Ispform.url" placeholder="应用商接口地址，需包含http://"></el-input>
        </el-form-item>
        <el-form-item label="应用商接口para" prop="para">
          <el-input v-model="Ispform.para" placeholder="应用商接口para"></el-input>
        </el-form-item>
        <el-form-item label="应用商设备状态接口地址">
          <el-input v-model="Ispform.status" placeholder="应用商设备状态接口地址,需包含http://"></el-input>
        </el-form-item>
        <el-form-item label="应用商设备状态接口para">
          <el-input v-model.number="Ispform.statuspara" placeholder="应用商设备状态接口para" ></el-input>
        </el-form-item>
        <el-form-item label="默认应用商" prop="default">
          <el-radio-group v-model="Ispform.default">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addSkyys('Ispform')">提 交</el-button>
        </el-form-item>
      </el-form>
    </div>
      </el-tab-pane>
    </el-tabs>
    
  </div>
</template>
<script>
import {addSukeyys,searchSuketype,editSukeyys,queryyysinfo,querydevinfo} from '@/api/sukeserver'
import Parse from 'parse'
import {returnLogin} from '@/utils/return'
import { utc2beijing } from '@/utils/index';
export default {
  data() {
    var validCode = (rule, value, callback) => {
      let reg = /[0-9a-zA-Z]{1,2}/;
      if (!reg.test(value)) {
        callback(new Error("应用商代号，2个数字、字母组合"));
      } else {
        callback();
      }
    };
    var validName = (rule, value, callback) => {
      let reg = /^[(\u4e00-\u9fa5)|(0-9a-zA-Z)]{1,30}/;
      if (!reg.test(value)) {
        callback(new Error("应用商名称，1到30个字符"));
      } else {
        callback();
      }
    };
    var validName1 = (rule, value, callback) => {
      let reg = /^$|^\w{1,30}$/;
      if (!reg.test(value)) {
        callback(new Error("设备类型，1到30个字符"));
      } else {
        callback();
      }
    };
    var validUrl = (rule, value, callback) => {
      let reg = /^((https|http|ftp|rtsp|mms)?:\/\/)+[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/;

      if (!reg.test(value)) {
        callback(new Error("需要输入正确的url"));
      } else {
        callback();
      }
    };
    var validpara = (rule, value, callback) => {
      let reg = /[0-9a-zA-Z]/;
      if (!reg.test(value)) {
        callback(new Error("输入para"));
      } else {
        callback();
      }
    };
    return {
      zlForm: {
        hardwareType: "",
        status: "",
        hardware_number:''
      },
      activeName:'first',
      deviceData:[],
      Isprules: {
        code: [
          {
            required: true,
            message: "应用商代号，2个数字、字母组合",
            trigger: "blur"
          },
          { validator: validCode, trigger: "blur" }
        ],
        name: [
          { required: true, message: "应用商称，1到30个字符", trigger: "blur" },
          { validator: validName, trigger: "blur" }
        ],
        url: [
          { required: true, message: "需要输入正确的url", trigger: "blur" },
          { validator: validUrl, trigger: "blur" }
        ],
        para: [
          { required: true, message: "输入para", trigger: "blur" },
          { validator: validpara, trigger: "blur" }
        ],
        default: [
            { required: true, message: '是否为默认应用商', trigger: 'change' }
          ],
      },
      sukeserver:{
          name:'',
          id:'',
          url:'',
          para:'',
      },
      Ispform: {
        name: "",
        code: "",
        url: "",
        status: "",
        statuspara: "",
        para: "",
        default:false,
      },
      isIsp: false,
      ispPageSize: 10,
      ispstart: 0,
      ispTotal: 0,
      objectId:'',
      zlData:[],
      zlPageSize: 10,
      zlTotal: 0,
      zlStart: 0,
      templateRadio:{},
      servervalue:'',
      serverdata:[],
      ispData:[],
      sukeStart:0,
      sukePageSize:10,
    };
  },
  mounted() {
      this.getSukeserver()
  },
  methods: {
    resetserver(){
      this.zlForm={
         hardwareType: "",
         status: "",
         hardware_number:''
      }
    },
    timestampToTime(timestamp) {
      var date = new Date(timestamp * 1000) 
      var Y = date.getFullYear() + '-';
      var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
      var D = (date.getDate()+1 <= 10 ? '0'+(date.getDate()) : date.getDate()) + ' ';
      var h = (date.getHours()+1 <= 10 ? '0'+(date.getHours()) : date.getHours())  + ':';
      var m = (date.getMinutes()+1 <= 10 ? '0'+(date.getMinutes()) : date.getMinutes())  + ':';
      var s = (date.getSeconds()+1 <= 10 ? '0'+(date.getSeconds()) : date.getSeconds());
      return Y+M+D+h+m+s;
    },
     utc2beijing(utc_datetime) {
	// 转为正常的时间格式 年-月-日 时:分:秒
    var date = new Date(utc_datetime);  
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = (date.getDate()+1 <= 10 ? '0'+(date.getDate()) : date.getDate()) + ' ';
    var h = (date.getHours()+1 <= 10 ? '0'+(date.getHours()) : date.getHours())  + ':';
    var m = (date.getMinutes()+1 <= 10 ? '0'+(date.getMinutes()) : date.getMinutes())  + ':';
    var s = (date.getSeconds()+1 <= 10 ? '0'+(date.getSeconds()) : date.getSeconds());
    return Y+M+D+h+m+s; 
  } ,
    //初始化数据
    getAllserver(){
      queryyysinfo({}).then(response=>{
            this.serverdata = response.data;
            
        })
    },
    getSukeserver() {
      queryyysinfo(this.sukeserver,this.ispstart,this.ispPageSize).then(response=>{
        if(response){
             this.ispData = response.data;
             this.ispTotal = response.count;
        }
        }),
       querydevinfo({},this.sukeStart,this.sukePageSize).then(response=>{
         if(response){
           this.deviceData=response.data
         }
         
       })
       this.getServerlist()
       this.getAllserver()
    },
    IspSizeChange(val) {
      this.ispPageSize = val;
      this.getSukeserver();
    },
    IspCurrentChange(val) {
      this.ispstart = (val - 1) * this.ispPageSize;
      this.getSukeserver();
    },
    queryyys(){
        queryyysinfo(this.sukeserver,this.ispstart,this.ispPageSize).then(res=>{
            if(res){
                this.ispData = res.data;
                this.ispTotal = res.count;
                 this.$forceUpdate()
            }  
        })
    },
    getTemplateRow(index,row){
         this.servervalue=row
        
    },
    //推送
    TsSuke(row){
      console.log(row)
    },
    //重置
    resetyyys(){
      this.sukeserver={
         name:'',
          id:'',
          url:'',
          para:'',
      }
    },
    editorupdatesuke(){
      this.isIsp = true
      this.objectId=''
    },
    //增加suke服务商
    addSkyys(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.objectId != "") {
            editSukeyys(
              this.objectId,
              this.Ispform.name,
              this.Ispform.code,
              this.Ispform.url,
              this.Ispform.para,
              this.Ispform.status,
              this.Ispform.statuspara,
              this.Ispform.default
            )
              .then(resultes => {
                if (!resultes.error) {
                  this.$message({
                    message: "服务商" + this.Ispform.name + "修改成功",
                    type: "success"
                  });
                  this.isIsp = false;
                  this.objectId = "";
                  this.getSukeserver();
                  this.$refs[formName].resetFields()
                  this.Ispform.status=''
                  this.Ispform.statuspara=''
                }
              })
              .catch(error => {
                this.$message.error(error.error)
              });
          } else {
            addSukeyys(
              this.Ispform.name,
              this.Ispform.code,
              this.Ispform.url,
              this.Ispform.para,
              this.Ispform.status,
              this.Ispform.statuspara,
              this.Ispform.default
            )
              .then(resultes => {
                if(resultes){
                  this.$message({
                  message: "服务商添加成功",
                  type: "success"
                });
                this.isIsp = false;
                this.getSukeserver();
                this.$refs[formName].resetFields()
                this.Ispform.status=''
                this.Ispform.statuspara=''
                }
                
              })
              .catch(error => {
                this.$message.error(error.error)
              });
          }
        }
      });
    },
    editorSuke(row) {
      console.log(this.servervalue)
      if(this.servervalue==''){
        this.$message({
          message: "请选择服务商",
          type: "warning"
        });
      }else{
      this.objectId = this.servervalue.objectId;
      this.isIsp = true;
      this.Ispform.name = this.servervalue.name;
      this.Ispform.code = this.servervalue.id;
      this.Ispform.url = this.servervalue.url;
      this.Ispform.para = this.servervalue.para;
      this.Ispform.status = this.servervalue.status_url;
      this.Ispform.statuspara = this.servervalue.status_para;
      this.Ispform.default = this.servervalue.default
      }
     
    },
    //记录查询
    getServerlist(start){
      if(start==0){
        this.zlStart=0
      }
      var Sukelog = Parse.Object.extend('SukeLog')
         var sukelog = new Parse.Query(Sukelog)
         if(this.zlForm.hardwareType!=""){
           sukelog.equalTo('hardwareType',this.zlForm.hardwareType)
         }
         if(this.zlForm.status!=''){
           sukelog.equalTo('status',this.zlForm.status)
         }
         if(this.zlForm.hardware_number!=''){
           sukelog.matches('hardware_number',this.zlForm.hardware_number,'i')
         }
          sukelog.limit(this.zlPageSize)
          sukelog.skip(this.zlStart)
          sukelog.ascending('-createdAt')
          sukelog.count().then(count=>{
         this.zlTotal =count
         sukelog.find().then(results=>{
           this.zlData = results
         },error=>{
           returnLogin(error)
         })
        })
    },
     zlSizeChange(val) {
      this.zlPageSize = val;
      this.getServerlist()
    },
    zlCurrentChange(val) {
      this.zlStart = (val - 1) * this.zlPageSize;
      this.getServerlist()
    },
  }
};
</script>
<style scoped>
.sukeserver {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  background: #ffffff;
}
.sukesecond{
    margin-top:10px;
}
.fenye{
    margin-top:10px;
}
.addisp{
    margin-top:10px;
}
</style>
<style>
.addisp .el-form-item__label{
    text-align:left;
}
.addisp .el-input__inner,.general .addisp .el-textarea__inner{
    width:60%;
}
.sukeserver .el-table td,.sukeserver .el-table th{
    padding:5px 0;
}

.sukeserver .sukeserverheader .el-input--suffix .el-input__inner,
.sukeserver .sukeserverheader .el-input__inner,.sukeserver .firstheader .el-input--suffix .el-input__inner,
.sukeserver .firstheader .el-input__inner {
  height: 26px;
  border-radius: 0;
  line-height: 26px;
  width: 200px;
}
.sukeserver .el-tabs__item{
  font-size:16px;
}
</style>
