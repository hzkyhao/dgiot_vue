<template>
  <div class="serverlist">
    <div class="servercontent">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:20px;">
        <el-breadcrumb-item :to="{ path: '/roles/applicationManagement' }">返回应用管理</el-breadcrumb-item>
        <el-breadcrumb-item>部署服务</el-breadcrumb-item>
      </el-breadcrumb>
      <h3>服务器部署</h3>
      <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
        <el-form-item style="float:left">
          <el-button type="success" v-show="appid&&appsecret" @click="lictool">
            下载引导脚本
            <i class="el-icon-download"></i>
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-input v-model="formInline.user" placeholder="请输入用户名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="formInline.region" placeholder="运行状态">
            <el-option label="全部" :value="1"></el-option>
            <el-option label="在线" :value="true"></el-option>
            <el-option label="离线" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="formInline.app" placeholder="应用商名称">
            <el-option
              v-for="(item,index) in applist"
              :label="item.attributes.name"
              :key="index"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="formInline.version" placeholder="请选择应用类型">
            <el-option label="标准版" value="standard"></el-option>
            <el-option label="企业版" value="enterprise"></el-option>
            <el-option label="旗舰版" value="ultimate"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getOrigin(0)">查询</el-button>
          <el-button type="primary" @click="addServer">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="servertable">
      <el-table :data="tableData" style="width: 100%;text-align:center">
        <el-table-column label="编号" type="index" width="50" align="center"></el-table-column>
        <el-table-column label="客户名称" align="center" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.attributes.customer_name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="客户应用" align="center" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.attributes.appname}}</span>
          </template>
        </el-table-column>
        <el-table-column label="版本" align="center" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.attributes.product">{{ scope.row.attributes.product.shuwa_iot_software}}</span>
          </template>
        </el-table-column>
        <el-table-column label="服务器IP" align="center" width="150">
          <template slot-scope="scope">
            <p>{{ scope.row.attributes.private_ip+ '(私)' }}</p>
            <p>{{scope.row.attributes.public_ip+ '(公)'}}</p>
          </template>
        </el-table-column>
        <el-table-column label="服务器配置" align="center" width="150">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>IP地址: {{ scope.row.attributes.private_ip }}</p>
              <p>MAC地址: {{ scope.row.attributes.mac}}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag effect="dark">
                  <span>{{ scope.row.attributes.core+'核'+scope.row.attributes.memory+' '+scope.row.attributes.disk+'内存'}}</span>
                </el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>

        <el-table-column label="机器码" align="center" show-overflow-tooltip width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.attributes.key }}</span>
          </template>
        </el-table-column>
        <el-table-column label="授权码" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.attributes.license }}</span>
          </template>
        </el-table-column>
        <el-table-column label="连接状态" align="center" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.attributes.is_online==true" style="color:green">在线</span>
            <span v-else style="color:red">离线</span>
          </template>
        </el-table-column>
        <el-table-column label="部署情况" align="center" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.attributes.status=='unauthorized'" style="color:red">未授权</span>
            <span v-else-if="scope.row.attributes.status=='start_install'" style="color:green">开始部署</span>
            <span v-else-if="scope.row.attributes.status=='installing'" style="color:green">部署中</span>
            <span v-else style="color:green">部署完成</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="500">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleDetail(scope.$index, scope.row)" >详 情</el-button>
            <el-button size="mini" type="primary" @click="addserver(scope.row)" icon="el-icon-s-operation">在线安装</el-button>
            <el-button size="mini" type="success" @click="uploadLicense1(scope.row)">离线安装</el-button>
             <el-button size="mini" type="primary" @click="onlineLictool(scope.row)">在线升级</el-button>
            <el-button size="mini" type="success" @click="offlineLictool(scope.row)">离线升级</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="serverpagina">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <!--新增编辑弹窗-->
    <el-dialog title="服务部署" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <!-- <el-form-item label="设备规模" prop="name">
          <el-input v-model.number="ruleForm.name">
               <template slot="append">台</template>
          </el-input>
        </el-form-item>-->
        <el-form-item label="应用类型" prop="region">
          <el-select v-model="ruleForm.region" placeholder="请选择应用类型">
            <el-option label="标准版" value="standard"></el-option>
            <el-option label="企业版" value="enterprise"></el-option>
            <el-option label="旗舰版" value="ultimate"></el-option>
          </el-select>
          <p style="color:black;margin:0;position:absolute;top:30px;color:#cc6e00">标准版本为单机版</p>
        </el-form-item>
        <!-- <el-form-item label="应用名称" prop="appname">
          <el-select v-model="ruleForm.appname" placeholder="请选择需要应用">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item label="授权码" prop="licensekey">
          <el-input v-model="ruleForm.licensekey" placeholder="请输入license授权码"></el-input>
        </el-form-item>
        <el-form-item label="客户名称" prop="username">
          <el-input v-model="ruleForm.username" placeholder="请输入客户名称"></el-input>
          <!-- <el-select v-model="" placeholder="请选择应用版本">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>-->
        </el-form-item>
          <el-form-item label="软件版本" prop="version">
          <el-input v-model="ruleForm.version" placeholder="请输入服务版本"></el-input>
          <!-- <el-select v-model="" placeholder="请选择应用版本">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>-->
        </el-form-item>
        <!-- <el-form-item label="许可有效期" required>
          <el-col :span="11">
            <el-form-item prop="date1">
              <el-date-picker
                type="datetime"
                placeholder="选择开始时间"
                v-model="ruleForm.date1"
                style="width: 100%;"
                :picker-options="pickerOptionsStart"
                 @change="startDate"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item prop="date2">
              <el-date-picker  type="datetime" placeholder="选择结束时间" v-model="ruleForm.date2" style="width: 100%;"  :picker-options="pickerOptionsEnd" @change="endDate"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>-->
        <!-- <el-form-item class="notall">
          <el-button type="primary" @click="submitForm('ruleForm')">部 署</el-button>
          <el-button @click="resetForm('ruleForm')">取 消</el-button>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updatedLicense('ruleForm')">部 署</el-button>
        <el-button @click="dialogFormVisible=false">取 消</el-button>
      </div>
    </el-dialog>
    <!--详情信息dialog-->

    <el-dialog title="详情" :visible.sync="dialogVisible" width="50%" :close-on-click-modal="false">
      <div>
        <el-input type="textarea" :rows="20" v-model="licensedetail" readonly></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>-->
      </span>
    </el-dialog>
    <!--新增dialog-->

    <el-dialog
      title="服务器配置"
      :visible.sync="serverdialogVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <el-form
        :model="serverForm"
        :rules="serverrules"
        ref="serverForm"
        label-width="100px"
        class="demo-serverForm"
      >
        <el-form-item label="用户名称" prop="customer_name">
          <el-input v-model="serverForm.customer_name"></el-input>
        </el-form-item>
        <el-form-item label="应用名称" prop="app">
          <el-select v-model="serverForm.app" placeholder="应用商名称">
            <el-option
              v-for="(item,index) in applist"
              :key="index"              
              :label="item.attributes.desc"
              :value="item.attributes.desc"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务器IP(私)" prop="serverip">
          <el-input v-model="serverForm.serverip"></el-input>
        </el-form-item>
        <el-form-item label="服务器IP(公)" prop="publicip">
          <el-input v-model="serverForm.publicip"></el-input>
        </el-form-item>
        <el-form-item label="MAC地址" prop="mac">
          <el-input v-model="serverForm.mac"></el-input>
        </el-form-item>
        <el-form-item label="服务器配置" required>
          <el-col :span="11">
            <el-form-item prop="serverhe">
              <el-input v-model="serverForm.serverhe">
                <template slot="append">核</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item prop="serverg">
              <el-input v-model.number="serverForm.serverg">
                <template slot="append">G</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="内存" prop="disk">
          <el-input v-model.number="serverForm.disk">
            <template slot="append">G</template>
          </el-input>
        </el-form-item>
        <el-form-item label="机器码" prop="serverkey">
          <el-input v-model="serverForm.serverkey" placeholder="请输入机器码"></el-input>
        </el-form-item>
        <el-form-item label="授权码">
          <el-input v-model="serverForm.licence" placeholder="请输入授权码(未授权可为空)"></el-input>
        </el-form-item>
        <el-form-item label="服务器状态" prop="status">
          <el-select v-model="serverForm.status" placeholder="应用商名称">
            <el-option label="未授权" value="unauthorized"></el-option>
            <el-option label="开始部署" value="start_install"></el-option>
            <el-option label="部署中" value="installing"></el-option>
            <el-option label="部署完成" value="installed"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="在线状态" prop="online">
          <span v-if="serverForm.online" style="color:#13ce66">在线</span>
          <span v-else style="color:#ff4949">离线</span>
          <el-switch v-model="serverForm.online" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="serverdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="serverOption('serverForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!--在线升级弹窗-->
    <el-dialog title="在线升级" :visible.sync="dialogOnline">
          <el-form :model="onlineform" :rules="onlineformrule" ref="onlineform">
            <el-form-item label="版本号" label-width="120px" prop="name">
              <el-input v-model="onlineform.name" placeholder="请输入版本号" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogOnline = false">取 消</el-button>
            <el-button type="primary" @click="updateLictool('onlineform')">确 定</el-button>
          </div>
        </el-dialog>
  </div>
</template>
<script>
import Parse from "parse";
import { returnLogin } from "@/utils/return";
import { uploadServer, uploadLicense,offlineServer } from "@/api/applicationManagement";
var product={}
export default {
  data() {
    const validUrl = (rule, value, callback) => {
      let reg = /^[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/;
      if (!reg.test(value)) {
        callback(new Error("需要输入正确的服务器IP"));
      } else {
        callback();
      }
    };
    const validKey = (rule, value, callback) => {
      let reg = /^[A-Za-z0-9]{32}$/;
      if (!reg.test(value)) {
        callback(new Error("需要输入正确32位机器码"));
      } else {
        callback();
      }
    };
    var valiNumberPass1 = (rule, value, callback) => {
      //包含小数的数字
      let reg = /^[+]?(0|([1-9]\d*))(\.\d+)?$/g;
      if (value === "") {
        callback(new Error("请输入正数"));
      } else if (!reg.test(value)) {
        callback(new Error("请输入数字"));
      } else {
        callback();
      }
    };
    return {
      serverdialogVisible: false,
      dialogFormVisible: false,
      dialogVisible: false,
      dialogOnline:false,
      //在线升级弹窗
      onlineform:{
        name:''
      },
      onlineformrule:{
        name:[
          {required:true,message:'请输入要更新的版本号',trigger:'blur'}
        ]
      },
      licensedetail: {},
      formInline: {
        user: "",
        region: 1,
        app: "",
        version: ""
      },
      tableData: [],
      pagesize: 10,
      total: 0,
      start: 0,
      licenseid: "",
      ruleForm: {
        name: "",
        region: "standard",
        date1: "",
        date2: "",
        appname: "",
        version: "",
        licensekey: "",
        username: "",
        version:''
      },
      serverForm: {
        app: "",
        serverip: "",
        serverhe: "",
        serverg: "",
        serverkey: "",
        license: "",
        online: false,
        customer_name: "",
        disk: Number("50G".replace(/G/g, "")),
        status: "unauthorized",
        publicip: "",
        mac: ""
      },
      applist: [],
      rules: {
        name: [
          { required: true, message: "请输入预计设计规模" },
          { type: "number", message: "预计设计规模 必须为数字值" }
        ],
        region: [
          { required: true, message: "请选择应用类型", trigger: "change" }
        ],
        appname: [
          { required: true, message: "请选择需要应用", trigger: "change" }
        ],
        version: [
          { required: true, message: "请选择应用版本", trigger: "change" }
        ],
        licensekey: [
          { required: true, message: "license必填", trigger: "blur" }
        ],
        username: [
          { required: true, message: "客户名称必填", trigger: "blur" }
        ],
         version: [
          { required: true, message: "应用版本必填", trigger: "blur" }
        ],
        date1: [
          {
            type: "date",
            required: true,
            message: "请选择开始时间",
            trigger: "change"
          }
        ],
        date2: [
          {
            type: "date",
            required: true,
            message: "请选择结束时间",
            trigger: "change"
          }
        ]
      },
      serverrules: {
        app: [{ required: true, message: "请选择客户名称", trigger: "change" }],
        serverip: [
          { required: true, message: "请输入服务器私网IP", trigger: "blur" },
          {
            validator: validUrl
          }
        ],
        publicip: [
          { required: true, message: "请输入服务器公网IP", trigger: "blur" },
          {
            validator: validUrl
          }
        ],
        mac: [
          { required: true, message: "请输入服务器MAC地址", trigger: "blur" }
        ],
        serverhe: [
          { required: true, message: "请输入服务器配置" },
          {
            validator: valiNumberPass1,
            type: "number",
            message: "服务器配置必须为数字值"
          }
        ],
        serverg: [
          { required: true, message: "请输入服务器配置" },
          { type: "number", message: "服务器配置必须为数字值" }
        ],
        serverkey: [
          { required: true, message: "请输入机器码", trigger: "blur" },
          { validator: validKey }
        ],
        customer_name: [
          { required: true, message: "请输入用户名称", trigger: "blur" }
        ],
        disk: [
          { required: true, message: "请输入服务器内存" },
          { type: "number", message: "服务器内存必须为数字值" }
        ],
        stauts: [
          { required: true, message: "请选择服务器状态", trigger: "change" }
        ]
      },
      pickerOptionsStart: {
        disabledDate: time => {
          let endDateVal = this.ruleForm.date2;
          if (endDateVal) {
            return (
              time.getTime() > new Date(endDateVal).getTime() ||
              time.getTime() < Date.now() - 8.64e7
            );
          } else {
            return time.getTime() < Date.now() - 8.64e7;
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: time => {
          let beginDateVal = this.ruleForm.date1;
          if (beginDateVal) {
            return time.getTime() < new Date(beginDateVal).getTime();
          } else {
            return time.getTime() < Date.now() - 8.64e7;
          }
        }
      },
      appid: "",
      appsecret: "",
      isupdatedserver: "",
      licenseObj:{
        id:''
      }
    };
  },
  mounted() {
    // var iParse = Parse;
    // iParse.initialize("asdhwu648vx");
    // iParse.serverURL = 'http://139.155.115.215:1337/parse';
    // let query = new iParse.Query('Lic');
    // let subscription = query.subscribe();
    // query.equalTo('lic','hhhhdd')
    // subscription.on('create', (object) => {
    // console.log('object created');
    // console.log(object);
    // });
    // subscription.on('update', (object) => {
    // console.log('object updated');
    // console.log(object);
    // });
    this.getApp();
    if (this.$route.query.appid) {
      this.formInline.app = this.$route.query.appid;
    }

    this.getOrigin(0);
    this.appid = this.$route.query.appid;
    this.appsecret = this.$route.query.appsecret;
    // console.log(this.appid,this.appsecret)
  },
  methods: {
    addServer() {
      this.serverdialogVisible = true;
    },
    serverOption(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var License = Parse.Object.extend("License");
          var license = new License();
          var APP = Parse.Object.extend("App");
          var app = new APP();
          var acl = new Parse.ACL();
          app.id = this.serverForm.app;
          // var userId = Parse.User.current().id;

          acl.setRoleReadAccess(this.serverForm.app, true);
          acl.setRoleWriteAccess(this.serverForm.app, true);

          license.set("key", this.serverForm.serverkey);
          license.set("private_ip", this.serverForm.serverip);
          license.set("is_online", this.serverForm.online);
          license.set("customer_name", this.serverForm.customer_name);
          license.set("public_ip", this.serverForm.publicip);
          license.set("disk", this.serverForm.disk + "G");
          license.set("core", this.serverForm.serverhe);
          license.set("memory", this.serverForm.serverg + "G");
          license.set("mac", this.serverForm.mac);
          license.set("license", this.serverForm.license);
          license.set("app", app);
          license.set("ACL", acl);
          license.save().then(
            resultes => {
              if (resultes) {
                this.$message.success("添加成功");
                this.$refs[formName].resetFields();
                this.getOrigin(0);
                this.serverdialogVisible = false;
              }
            },
            error => {
              returnLogin(error);
            }
          );
        } else {
          console.log("error.submit");
        }
      });
    },
    //初始化应用data
    getApp() {
      var APP = Parse.Object.extend("App");
      var app = new Parse.Query(APP);
      app.find().then(
        response => {
          if (response) {
            this.applist = response;
          }
        },
        error => {
          returnLogin(error);
        }
      );
    },
    //初始化数
    getOrigin(isstart) {
      if (isstart == 0) {
        this.start = 0;
      }
      var License = Parse.Object.extend("License");
      var license = new Parse.Query(License);
      if (this.formInline.region != 1) {
        license.equalTo("is_online", this.formInline.region);
      }
      if (this.formInline.app != "") {
        license.equalTo("app", this.formInline.app);
      }
      if (this.formInline.user != "") {
        license.matches("customer_name", this.formInline.user, "i");
      }
      if (this.formInline.version != "") {
        license.equalTo("type", this.formInline.version);
      }
      license.ascending("-updatedAt");
      license.skip(this.start);
      license.limit(this.pagesize);
      license.count().then(count => {
        this.total = count;
        license.find().then(
          resultes => {
            if (resultes) {
              this.tableData = resultes;
            }
          },
          error => {
            returnLogin(error);
          }
        );
      });
    },
    //分页
    handleSizeChange(val) {
      this.pagesize = val;
      this.getOrigin(1);
    },
    handleCurrentChange(val) {
      this.start = (val - 1) * this.pagesize;
      this.getOrigin(1);
    },
    //服务器部署弹窗打开
    addserver(row) {
      this.licenseid = row.id;
      this.ruleForm.version = row.attributes.software
      if (row.attributes.license) {
        this.ruleForm.licensekey = row.attributes.license;
      } else {
        this.ruleForm.licensekey = "";
      }
      this.ruleForm.username = row.attributes.customer_name;
      if(row.attributes.product){
        for(var key in row.attributes.product){
          product[key] = row.attributes.product[key]
        }
        
      }
      if (
        row.attributes.status == "installed" ||
        row.attributes.status == "start_install" ||
        row.attributes.status == "installing"
      ) {
        this.$confirm(
          `${
            row.attributes.status == "installed"
              ? "是否重新部署服务器, 是否继续?"
              : "服务器正在部署中，是否重新部署"
          }`,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            this.dialogFormVisible = true;
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消重新部署"
            });
          });
        // }
        // else if(){
        //   this.$notify({
        //     title: '正在部署中',
        //     dangerouslyUseHTMLString: true,
        //     message: '正在部署中，请稍后<i class="el-icon-loading" style="color:green"></i>',
        //     type: 'success'
        //   });
      } else {
        this.dialogFormVisible = true;
      }
    },
    //服务器部署 installed
    updatedLicense(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var License = Parse.Object.extend("License");
          var license = new License();
          license.id = this.licenseid;
          license.set("type", this.ruleForm.region);
          license.set("license", this.ruleForm.licensekey);
          license.set("status", "start_install");
          license.set("customer_name", this.ruleForm.username);
          license.set('software',this.ruleForm.version)
          license.save().then(
            resultes => {
              if (resultes) {
                this.$message.success("正在部署中");
                this.dialogFormVisible = false;
                this.getOrigin(1);
              }
            },
            error => {
              returnLogin(error);
            }
          );
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //详情查看
    handleDetail(index, row) {
      this.dialogVisible = true;
      this.licensedetail = JSON.stringify(row.attributes.product, null, 10);
    },
    startDate() {
      if (
        this.ruleForm.date2 <= this.ruleForm.date1 &&
        this.ruleForm.date2 != "" &&
        this.ruleForm.date2 != null
      ) {
        this.$message.warning("采集结束时间要小于开始时间");
        this.ruleForm.date1 = "";
      }
      if (this.ruleForm.date1 < Date.now() - 2000) {
        this.$message.warning("采集开始时间要大于当前时间");
        this.ruleForm.date1 = "";
      }
    },
    endDate() {
      if (this.ruleForm.date2 <= this.ruleForm.date1) {
        this.$message.warning("采集结束时间要小于开始时间");
        this.ruleForm.date2 = "";
      }
      if (this.ruleForm.date2 < Date.now() - 2000) {
        this.$message.warning("采集结束时间要大于当前时间");
        this.ruleForm.date2 = "";
      }
    },
    //下载服务器配置
    uploadLicense1(row) {
      uploadServer(row.attributes.license).then(resultes => {
        window.open(
          window.location.origin +
            "/iotapi/licsetup?license=" +
            row.attributes.license,
          "_blank"
        );
      });
    },
    //在线升级
    onlineLictool(row){
    this.licenseObj.id = row.id
      for(var key in row.attributes.product){
        this.licenseObj[key] = row.attributes.product[key]
      }
      this.dialogOnline = true
    },
    updateLictool(formName){
       this.$refs[formName].validate(valid => {
         if(valid){
          //  this.licenseObj.shuwa_iot_software=this.onlineform.name
            var License = Parse.Object.extend('License')
            var license = new License()
            license.id = this.licenseObj.id
            license.set('status','start_update')
            license.set('software',this.onlineform.name)
            license.save().then(resultes=>{
              if(resultes){
                this.dialogOnline = false
                this.$message.success('正在升级中')
              }
            },error=>{
              returnLogin(error)
            })
         }
      
      })
    },
    //离线升级
    offlineLictool(row){
      offlineServer(row.attributes.license).then(resultes=>{
         window.open(
          window.location.origin +
            "/iotapi/licsetup?license=" +
            row.attributes.license,
          "_blank"
         )
      })
    },
    //通用配置下载
    lictool() {
      uploadLicense(this.appid, this.appsecret)
        .then(resultes => {
          if (resultes) {
            window.open(
              window.location.origin +
                "/iotapi/lictool?appid=" +
                this.appid +
                "&appsecret=" +
                this.appsecret,
              "_blank"
            );
          }
        })
        .catch(error => {
          this.$message.error(error.error);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.serverlist {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  background: #fff;
  .servercontent {
    .el-form {
      text-align: right;
    }
  }
  .serverpagina {
    margin-top: 20px;
  }
  /deep/ .el-dialog__body {
    .el-form {
      display: flex;
      flex-wrap: wrap;
      .el-form-item {
        width: 50%;
        /deep/.el-select {
          width: 100%;
        }
      }
      /deep/ .notall {
        width: 100%;
        text-align: center;
      }
      /deep/ .el-col-11 {
        .el-form-item {
          width: 100%;
        }
      }
      /deep/ .el-col-2 {
        text-align: center;
      }
    }
  }
  @media screen and (max-width: 1350px) {
    /deep/ .el-dialog__body {
      .el-form {
        .el-form-item {
          width: 100%;
        }
      }
    }
  }
}
</style>
