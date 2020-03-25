<template>
  <div class="general">
    <Resource
      class="resource"
      style="width:340px;max-height:100vh;overflow:scroll;flex-shrink:0;"
      :data="data"
      @change="addUser"
      @lookdata="getDetailforUser"
      @username="getusername"
      @resetusername="resetusername"
    />
    <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
      style="min-height: 875px;background: #f6fbff;overflow-x: scroll;flex-grow:2"
    >
      <el-tab-pane label="设备列表" name="first">
        <div class="block">
          <div class="blockheader1">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
              <el-form-item label="设备状态">
                <el-select placeholder="设备状态" v-model="formInline.ol_status" style="width:150px">
                  <el-option label="全部" :value="9"></el-option>
                  <el-option label="在线" :value="1"></el-option>
                  <el-option label="离线" :value="0"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="客户名称">
                <el-select placeholder="客户名称" v-model="formInline.customer" style="width:150px">
                  <el-option
                    v-for="(item,index) in userdata"
                    :label="item.attributes.name"
                    :key="index"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="设备类型">
                <el-select placeholder="设备类型" v-model="formInline.hardwareType" style="width:150px">
                  <el-option
                    v-for="(item,index) in deviceData"
                    :key="index"
                    :label="item.name"
                    :value="item.name"
                  ></el-option>
                </el-select>
              </el-form-item>
              <!-- <el-form-item label="注册服务器">
            <el-select placeholder="注册服务器" v-model="formInline.route" style="width:150px">
              <el-option label="无线" value="tcp"></el-option>
              <el-option label="485" value="tcp1"></el-option>
              <el-option label="载波" value="tcp2"></el-option>
            </el-select>
              </el-form-item>-->
              <el-form-item label="使用情况">
                <el-select placeholder="使用情况" v-model="formInline.status" style="width:150px">
                  <el-option label="全部" :value="9"></el-option>
                  <el-option label="正常使用" :value="1"></el-option>
                  <el-option label="已废弃" :value="0"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="授权状态">
                <el-select placeholder="授权状态" v-model="formInline.auth" style="width:150px">
                  <el-option label="--" :value="9"></el-option>
                  <el-option label="已获授权" :value="1"></el-option>
                  <el-option label="未获授权" :value="0"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="设备编号">
                <el-input
                  v-model="formInline.hardware_number"
                  placeholder="设备编号"
                  style="width:200px"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="blockbutton">
            <el-button type="primary" icon="el-icon-search" size="small" @click="searchskUser(0)">查询</el-button>
            <el-button type="primary" size="small" @click="reset">重置</el-button>
            <el-button type="primary" size="small" @click="dialogFormVisible=true">客户编辑</el-button>
            <!-- <el-button type="primary" size="small">新增设备类型</el-button> -->
          </div>
          <div class="blockheader">
            <el-table
              :data="tableData"
              stripe
              style="width: 100%;text-align:center"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55" align="center"></el-table-column>
              <el-table-column label="客户名称" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.attributes.customer}}</span>
                </template>
              </el-table-column>
              <el-table-column label="设备类型" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.attributes.hardwareType}}</span>
                </template>
              </el-table-column>
              <el-table-column label="设备编号" align="center" width="250">
                <template slot-scope="scope">
                  <span>{{scope.row.attributes.hardware_number}}</span>
                </template>
              </el-table-column>
              <!-- <el-table-column prop="address" label="注册服务器" align="center"></el-table-column> -->
              <el-table-column label="服务商名称" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.attributes.yysName}}</span>
                </template>
              </el-table-column>
              <el-table-column label="在线状况" align="center" width="80">
                <template slot-scope="scope">
                  <span v-if="scope.row.attributes.ol_status==1" style="color:green">在线</span>
                  <span v-else style="color:red">离线</span>
                </template>
              </el-table-column>
              <el-table-column label="使用状况" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.attributes.status==1" style="color:green">正常使用</span>
                  <span v-else style="color:red">废弃</span>
                </template>
              </el-table-column>
              <el-table-column label="授权码" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.attributes.cardId}}</span>
                </template>
              </el-table-column>
              <el-table-column label="授权状态" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.attributes.auth==1" style="color:green">已获取授权</span>
                  <span v-else style="color:red">未获取授权</span>
                </template>
              </el-table-column>
              <el-table-column label="设备地址" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.attributes.address}}</span>
                </template>
              </el-table-column>
              <el-table-column label="注册时间" align="center">
                <template slot-scope="scope">
                  <span>{{utc2beijing(scope.row.attributes.createdAt).substring(0,10)}}</span>
                  <br />
                  <span>{{utc2beijing(scope.row.attributes.createdAt).substring(10)}}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" @click="editordevtype(scope.row)">状态修改</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="fenye">
            <el-pagination
              background
              @size-change="UserSizeChange"
              @current-change="UserCurrentChange"
              :page-sizes="[1,10, 20, 30, 50]"
              :page-size="UserPageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="UserTotal"
            ></el-pagination>
          </div>
          <el-dialog title="添加客户" :visible.sync="dialogFormVisible">
            <el-form :model="customerForm">
              <el-form-item label="客户名称">
                <el-select
                  placeholder="客户名称"
                  v-model="customerForm.customer"
                  style="width:60%"
                  @change="selsectname"
                >
                  <el-option
                    v-for="(item,index) in userdata"
                    :label="item.attributes.name"
                    :key="index"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="!isadduser">
                <el-link
                  type="primary"
                  @click="isadduser=true"
                  :underline="false"
                  style="margin-left:80px"
                >添加用户</el-link>
              </el-form-item>
              <el-form-item v-if="isadduser" label="添加客户">
                <el-input v-model="customerForm.username" autocomplete="off" style="width:60%"></el-input>
                <el-button type="primary" @click="addsukeuser">添 加</el-button>
              </el-form-item>
            </el-form>
            <el-table :data="userdata" stripe style="width: 100%;text-align:center" height="300">
              <el-table-column label="序号" align="center" type="index" width="50">
                <!-- <template slot-scope="scope">
                  <span>{{scope.row.id}}</span>
                </template>-->
              </el-table-column>
              <el-table-column label="客户名称" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.attributes.name}}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-popover placement="top" width="300" :ref="`popover-${scope.$index}`">
                    <p>确定删除这个{{scope.row.name}}用户吗？</p>
                    <div style="text-align: right; margin: 0">
                      <el-button
                        size="mini"
                        @click="scope._self.$refs[`popover-${scope.$index}`].doClose()"
                      >取消</el-button>
                      <el-button type="primary" size="mini" @click="makeSure(scope)">确定</el-button>
                    </div>
                    <el-button type="danger" size="mini" slot="reference">删除</el-button>
                  </el-popover>
                </template>
              </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="addDevTypeForUser">确 定</el-button>
            </div>
          </el-dialog>
          <!--客户编辑-->
          <el-dialog title="状态编辑" :visible.sync="userFormVisible">
            <el-form :model="userform">
              <el-form-item label="使用状态" :label-width="formLabelWidth">
                <el-select v-model="userform.name" style="width:100%">
                  <el-option label="启用" :value="1"></el-option>
                  <el-option label="废弃" :value="0"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="授权状态" :label-width="formLabelWidth">
                <el-select v-model="userform.region" style="width:100%">
                  <el-option label="已获取授权" :value="1"></el-option>
                  <el-option label="未获取授权" :value="0"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="设备地址" :label-width="formLabelWidth">
                <el-input v-model="userform.addr"></el-input>
              </el-form-item>
              <el-form-item label="服务商" :label-width="formLabelWidth">
                <el-select
                  v-model="userform.hardwareType"
                  placeholder="请选择服务商"
                  style="width:100%"
                  @change="selsectserver"
                >
                  <el-option
                    v-for="(item,index) in ispData"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="授权码" :label-width="formLabelWidth">
                <el-input v-model="userform.cardid" autocomplete="off" class="readonly" readonly>
                  <template slot="append">
                    <span class="show-pwd" @click="showPwd">
                      <svg-icon :icon-class="isopen" />
                    </span>
                  </template>
                </el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="userFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="updateusertype">确 定</el-button>
            </div>
          </el-dialog>
        </div>
      </el-tab-pane>

      <!--设备类型管理-->
      <el-tab-pane label="设备类型管理" name="third">
        <div class="sukethree">
          <el-form :inline="true" :model="formthree" class="formthree">
            <el-form-item label="设备类型编码">
              <el-input v-model="formthree.number" placeholder="硬件类型编码"></el-input>
            </el-form-item>
            <el-form-item label="设备类型名称">
              <el-input v-model="formthree.name" placeholder="硬件类型名称"></el-input>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="formthree.enable" placeholder="状态">
                <el-option label="全部" :value="9"></el-option>
                <el-option label="启用" :value="1"></el-option>
                <el-option label="废弃" :value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button
                type="success"
                size="small"
                style="height:26px;line-height:0;"
                @click="querydevtype(0)"
              >查询</el-button>
              <el-button
                type="primary"
                size="small"
                style="height:26px;line-height:0;"
                @click="resetdevtype"
              >重置</el-button>
            </el-form-item>
            <el-form-item style="float:right">
              <el-button type="primary" icon="el-icon-plus" @click="isDevice=true">发布设备类型</el-button>
            </el-form-item>
          </el-form>
          <el-table
            :data="deviceData"
            border
            style="width: 100%;margin-top:10px;text-align:center"
            height="300"
          >
            <el-table-column prop="number" label="设备类型编码" align="center"></el-table-column>
            <el-table-column prop="name" label="设备类型名称" align="center"></el-table-column>
            <el-table-column label="状态" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.enable==1" style="color:green">启用</span>
                <span v-else style="color:red">废弃</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="300">
              <template slot-scope="scope">
                <el-button type="primary" size="small" @click="edirtdevtype(scope.row)">编辑</el-button>
                <el-button
                  type="success"
                  size="small"
                  v-if="scope.row.enable==0"
                  @click="editorsuketype(scope.row)"
                >启用</el-button>
                <el-button type="danger" size="small" v-else @click="editorsuketype(scope.row)">废弃</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="fenye">
            <el-pagination
              background
              @size-change="DeviceSizeChange"
              @current-change="DeviceCurrentChange"
              :page-sizes="[1,10, 20, 30, 50]"
              :page-size="DevicePageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="DeviceTotal"
            ></el-pagination>
          </div>
          <div class="geduan" style="width:100%;height:4px;background:#cccccc;margin-top:5px"></div>
          <div class="addevice" v-show="isDevice">
            <el-form ref="Deviceform" :model="Deviceform" label-width="200px" :rules="Devicerule">
              <el-form-item label="设备类型名称" prop="name">
                <el-input v-model="Deviceform.name" placeholder="设备类型名称，1-30个字符"></el-input>
              </el-form-item>
              <el-form-item label="设备类型编码" prop="code">
                <el-input v-model="Deviceform.code" placeholder="设备类型编码，1-30个字符"></el-input>
              </el-form-item>
              <el-form-item label="备注">
                <el-input type="textarea" v-model="Deviceform.desc" :rows="5"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="addSuketype('Deviceform')">提 交</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import Resource from "@/components/resource";
import Parse from "parse";
import { addCustomer } from "@/api/customernode";
import { returnLogin } from "@/utils/return";
import {
  addSukeyys,
  searchSuketype,
  editSukeyys,
  addSukedevtype,
  editorSukedevtype,
  searchSukeuser,
  querydevinfo,
  queryyysinfo
} from "@/api/sukeserver";
import { utc2beijing } from "@/utils/index";
import ScrollPane from "@/components/ScrollPane";
import { resolve } from "url";
export default {
  components: {
    Resource
  },
  data() {
    var validCode = (rule, value, callback) => {
      let reg = /^[0-9a-zA-Z]{2}$/;
      if (!reg.test(value)) {
        callback(new Error("应用商代号，2个数字、字母组合"));
      } else {
        callback();
      }
    };
    var validName = (rule, value, callback) => {
      let reg = /^[\u4e00-\u9fa50-9a-zA-Z]{1,30}$/;
      if (!reg.test(value)) {
        callback(new Error("应用商名称，1到30个字符"));
      } else {
        callback();
      }
    };
    var validName1 = (rule, value, callback) => {
      let reg = /^[\u4e00-\u9fa50-9a-zA-Z]{1,30}$/;
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
      let reg = /^[0-9a-zA-Z]$/;
      if (!reg.test(value)) {
        callback(new Error("输入para"));
      } else {
        callback();
      }
    };
    return {
      isopen: "suo",
      pwdType: "password",
      Devicerule: {
        name: [
          {
            required: true,
            message: "设备类型，输入1到30个字符",
            trigger: "blur"
          },
          { validator: validName1, trigger: "blur" }
        ],
        code: [
          {
            required: true,
            message: "设备类型，输入1到30个字符",
            trigger: "blur"
          },
          { validator: validName1, trigger: "blur" }
        ]
      },
      isDevice: false,
      isadduser: false,
      Deviceform: {
        name: "",
        code: "",
        desc: "",
        status: 1
      },
      userFormVisible: false,
      userform: {
        name: "",
        region: "",
        addr: "",
        hardwareType: "",
        cardid: ""
      },
      DevicePageSize: 10,
      Devicestart: 0,
      DeviceTotal: 0,

      activeName: "first",
      formInline: {
        ol_status: 9,
        customer: "",
        hardwareType: "",
        status: 9,
        auth: 9,
        hardware_number: ""
      },
      customerForm: {
        customer: "",
        username: ""
      },
      UserPageSize: 10,
      Userstart: 0,
      UserTotal: 0,
      formthree: {
        number: "",
        name: "",
        enable: 9
      },
      deviceData: [],
      data: [],
      tableData: [],
      ispData: [],
      dialogFormVisible: false,
      form: {
        parentId: "",
        username: ""
      },
      formLabelWidth: "120px",
      objectId: "",
      deviceobjectId: "",
      userdata: [],
      selectdevnumber: [],
      dataforuser: "",
      sukeserver: {
        name: "",
        id: "",
        url: "",
        para: ""
      },
      datafordev: "",
      userdevid: "",
      isaddusername: true,
      timer: null
    };
  },
  mounted() {
    this.getMainstation();
    this.handleClick({ name: "first" });
    this.getTree();
    this.getsukesercver();
    this.timer = window.setInterval(() => {
      this.handleClick({ name: "first" });
    }, 60000);
  },
  methods: {
    utc2beijing(utc_datetime) {
      // 转为正常的时间格式 年-月-日 时:分:秒
      var date = new Date(utc_datetime);
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D =
        (date.getDate() + 1 <= 10 ? "0" + date.getDate() : date.getDate()) +
        " ";
      var h =
        (date.getHours() + 1 <= 10 ? "0" + date.getHours() : date.getHours()) +
        ":";
      var m =
        (date.getMinutes() + 1 <= 10
          ? "0" + date.getMinutes()
          : date.getMinutes()) + ":";
      var s =
        date.getSeconds() + 1 <= 10
          ? "0" + date.getSeconds()
          : date.getSeconds();
      return Y + M + D + h + m + s;
    },
    showPwd() {
      var readonly = document.getElementsByClassName("readonly")[0];
      if (this.isopen == "suo") {
        readonly.children[0].removeAttribute("readonly");
        this.isopen = "opensuo";
      } else {
        readonly.children[0].setAttribute("readonly", "readonly");
        this.isopen = "suo";
      }
    },
    reset() {
      this.formInline = {
        ol_status: 9,
        customer: "",
        hardwareType: "",
        status: 9,
        auth: 9,
        hardware_number: ""
      };
    },
    resetusername(val) {
      this.getTree();
    },
    getusername(val) {
      this.data = [];
      var Department = Parse.Object.extend("Department");
      var department = new Parse.Query(Department);
      department.equalTo("name", val);
      department.find().then(
        resultes => {
          if (resultes) {
            var Department1 = Parse.Object.extend("Department");
            var department1 = new Parse.Query(Department1);
            resultes.map(items => {
              var obj = {};
              items.createtime = utc2beijing(items.attributes.createdAt);
              (obj.name = items.attributes.name),
                (obj.ParentId = items.attributes.ParentId);
              obj.objectId = items.id;
              obj.createtime = items.createtime;
              obj.is_show = false;
              this.data.push(obj);
              department1.equalTo("ParentId", items.id);
              department1.find().then(response => {
                response.map(items => {
                  var obj = {};
                  items.createtime = utc2beijing(items.attributes.createdAt);
                  (obj.name = items.attributes.name),
                    (obj.ParentId = items.attributes.ParentId);
                  obj.objectId = items.id;
                  obj.createtime = items.createtime;
                  obj.is_show = false;
                  this.data.push(obj);
                });
              });
            });
          }
        },
        error => {
          returnLogin(error);
        }
      );
    },
    selsectserver(val) {
      this.ispData.map(item => {
        if (val == item.id) {
          this.datafordev = item.name;
        }
      });
    },
    selsectname(val) {
      this.userdata.map(item => {
        if (val == item.id) {
          this.dataforuser = item.attributes.name;
        }
      });
    },
    handleClick(tab) {
      if (tab.name == "third") {
        querydevinfo(
          this.formthree,
          this.Devicestart,
          this.DevicePageSize
        ).then(response => {
          this.deviceData = response.data;
          this.DeviceTotal = response.count;
        });
      } else {
        var SukeDev = Parse.Object.extend("SukeDev");
        var sukedev = new Parse.Query(SukeDev);
        if (this.formInline.status != 9) {
          sukedev.equalTo("status", this.formInline.status);
        }
        if (this.formInline.ol_status != 9) {
          sukedev.equalTo("ol_status", this.formInline.ol_status);
        }
        if (this.formInline.auth != 9) {
          sukedev.equalTo("auth", this.formInline.auth);
        }

        if (this.formInline.hardware_number != "") {
          sukedev.matches(
            "hardware_number",
            this.formInline.hardware_number,
            "i"
          );
        }
        if (this.formInline.customer != "") {
          sukedev.equalTo("customerId", this.formInline.customer);
        }
        if (this.formInline.hardwareType != "") {
          sukedev.equalTo("hardwareType", this.formInline.hardwareType);
        }
        sukedev.skip(this.Userstart);
        sukedev.limit(this.UserPageSize);
        sukedev.ascending("createdAt");
        sukedev.count().then(count => {
          this.UserTotal = count;
          sukedev.find().then(resultes => {
            this.tableData = resultes;
            // resultes.map(items=>{
            //   var obj={}
            //   obj.objectId = items.id
            //   for(var key in items.attributes){
            //     obj[key] = items.attributes[key]
            //   obj.createdAtdate = utc2beijing(items.attributes.createdAt).substring(0,10);
            //   obj.createdAttime = utc2beijing(items.attributes.createdAt).substring(10);
            //   }
            //     this.tableData.push(obj)
            // })
          });
        });
      }
    },
    getsukesercver() {
      queryyysinfo(this.sukeserver, this.ispstart, this.ispPageSize).then(
        response => {
          this.ispData = response.data;
        }
      );
    },
    //新增用户
    addsukeuser() {
      this.isaddusername = true;
      this.data.map(items => {
        if (this.customerForm.username == items.name) {
          this.$message({
            message: "客户姓名重复",
            type: "error"
          });
          this.isaddusername = false;
          return this.isaddusername;
        }
      });
      if (this.isaddusername) {
        if (this.customerForm.username != "") {
          var Department = Parse.Object.extend("Department");
          var department = new Department();
          var acl = new Parse.ACL();
          department.set("name", this.customerForm.username);
          department.set("org_type", "suke");
          department.set("ParentId", "0");
          acl.setRoleReadAccess("suke", true);
          acl.setRoleWriteAccess("suke", true);
          department.set("ACL", acl);
          department.save().then(
            object => {
              this.$message({
                message: "新增成功",
                type: "success"
              });
              this.isadduser = false;
              this.getTree();
              this.getMainstation();
            },
            error => {
              returnLogin(error);
            }
          );
        } else {
          this.$message.error("请填写客户姓名");
        }
      }
    },
    //删除用户
    makeSure(scope) {
      // 可以在这里执行删除数据的回调操作.......删除操作.....
      var Department = Parse.Object.extend("Department");
      var department = new Department();
      department.id = scope.row.id;
      department.destroy().then(
        response => {
          if (response) {
            this.$message({
              type: "success",
              message: "删除成功"
            });
            scope._self.$refs[`popover-${scope.$index}`].doClose();
            this.getMainstation();
          }
        },
        error => {
          returnLogin(error);
        }
      );
    },
    //异步操作添加用户
    userPrimise(selectdevnumber) {
      var arr = [];
      selectdevnumber.map(items => {
        arr.push(
          new Promise((resolve, reject) => {
            var Department = Parse.Object.extend("Department");
            var department1 = new Department();
            var SukeDev = Parse.Object.extend("SukeDev");
            var sukdev = new SukeDev();
            sukdev.id = items.id;
            sukdev.set("customer", this.dataforuser);
            sukdev.set("customerId", this.customerForm.customer);
            return sukdev.save().then(
              resultes => {
                department1.id = items.attributes.departmentId;
                department1.set("ParentId", this.customerForm.customer);
                department1.save().then(response => {
                  resolve(response);
                });
              },
              error => {
                returnLogin(error);
                reject(error.error);
              }
            );
          })
        );
      });
      Promise.all(arr)
        .then(data => {
          this.$message({
            message: "更新成功",
            type: "success"
          });
          if (data.length == this.selectdevnumber.length) {
            this.dialogFormVisible = false;
            this.getTree();
            this.handleClick({ name: "first" });
          }
        })
        .catch(error => {
          this.$message({
            message: error,
            type: "error"
          });
        });
    },
    addDevTypeForUser() {
      if (this.customerForm.customer != "") {
        if (this.selectdevnumber.length != 0) {
          this.userPrimise(this.selectdevnumber);
          // var Department = Parse.Object.extend("Department");
          // var department = new Parse.Query(Department);
          // var department1= new Department()
          // var SukeDev = Parse.Object.extend("SukeDev");
          // var sukdev = new SukeDev()
          // this.selectdevnumber.map(items => {
          //   setTimeout(() => {
          //     sukdev.id = items.objectId
          //       sukdev.set("customer", this.dataforuser);
          //       sukdev.set("customerId", this.customerForm.customer);
          //       sukdev.save().then(resultes => {
          //         department1.id = items.departmentId
          //           department1.set("ParentId", this.customerForm.customer);
          //           department1.save().then(response => {
          //             this.$message({
          //               message: "更新成功",
          //               type: "success"
          //             });
          //             this.dialogFormVisible = false;
          //           });
          //       },error=>{
          //         returnLogin(error)
          //       });
          //   },500);
          //    setTimeout(()=>{
          //           this.getTree();
          //           this.handleClick({ name: "first" });
          //         },1000)
          // });
        } else {
          this.$message.error("请挑选设备");
        }
      } else {
        this.$message.error("请挑选用户");
      }
    },
    editordevtype(row) {
      this.userFormVisible = true;
      this.userform.name = row.attributes.status;
      this.userform.region = row.attributes.auth;
      this.userdevid = row.id;
      this.userform.addr = row.attributes.address;
      this.userform.cardid = row.attributes.cardId;
      this.userform.hardwareType = row.attributes.yysId;
      if (row.attributes.yysName != "") {
        this.datafordev = row.attributes.yysName;
      }
    },
    updateusertype() {
      var SukeDev = Parse.Object.extend("SukeDev");
      var sukdev = new Parse.Query(SukeDev);
      sukdev.get(this.userdevid).then(object => {
        object.set("status", this.userform.name);
        object.set("auth", this.userform.region);
        object.set("address", this.userform.addr);
        object.set("yysId", this.userform.hardwareType);
        object.set("cardId", this.userform.cardid);
        object.set("yysName", this.datafordev);
        object.save().then(
          resultes => {
            this.$message({
              type: "success",
              message: "状态修改成功"
            });
            this.userFormVisible = false;
            this.querydevtype();
            this.handleClick({ name: "first" });
          },
          error => {
            returnLogin(error);
          }
        );
      });
    },
    getTree() {
      var Department = Parse.Object.extend("Department");
      var department = new Parse.Query(Department);
      department.limit(10000);
      department.equalTo("org_type", "suke");
      department.exists("ParentId");
      department.find().then(
        resultes => {
          this.data = [];
          resultes.map(items => {
            var obj = {};
            items.createtime = utc2beijing(items.attributes.createdAt);
            (obj.name = items.attributes.name),
              (obj.ParentId = items.attributes.ParentId);
            obj.objectId = items.id;
            obj.createtime = items.createtime;
            obj.is_show = false;
            this.data.push(obj);
          });
        },
        error => {
          returnLogin(error);
        }
      );
    },
    getMainstation() {
      var Department = Parse.Object.extend("Department");
      var department = new Parse.Query(Department);
      department.limit(10000);
      department.equalTo("org_type", "suke");
      department.equalTo("ParentId", "0");
      department.find().then(
        resultes => {
          this.userdata = resultes;
          this.handleClick({ name: "third" });
        },
        error => {
          returnLogin(error);
        }
      );
    },
    handleSelectionChange(val) {
      this.selectdevnumber = val;
    },
    //查询用户
    searchskUser(start) {
      if (start == 0) {
        this.Userstart = 0;
      }

      this.handleClick({ name: "first" });
    },
    getDetailforUser(data) {
      var SukeDev = Parse.Object.extend("SukeDev");
      var sukdev = new Parse.Query(SukeDev);
      sukdev.equalTo("parentId", data.objectId);
      sukdev.equalTo("type", "suke");
      sukdev.find().then(res => {});
    },
    addUser(data) {
      this.dialogFormVisible = true;
      this.form.parentId = data.objectId;
    },
    addcus() {
      addCustomer(this.form.parentId, this.form.username).then(resultes => {
        if (resultes) {
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.dialogFormVisible = false;
          this.getMainstation();
        }
      });
    },
    //设备分页
    DeviceSizeChange(val) {
      this.DevicePageSize = val;
      this.querydevtype();
    },
    DeviceCurrentChange(val) {
      this.Devicestart = (val - 1) * this.DevicePageSize;
      this.querydevtype();
    },
    //设备类型查询
    querydevtype(start) {
      if (start == 0) {
        this.Devicestart = 0;
      }
      querydevinfo(this.formthree, this.Devicestart, this.DevicePageSize).then(
        response => {
          this.deviceData = response.data;
          this.DeviceTotal = response.count;
        }
      );
    },
    UserSizeChange(val) {
      this.UserPageSize = val;
      this.searchskUser();
    },
    UserCurrentChange(val) {
      this.Userstart = (val - 1) * this.UserPageSize;
      this.searchskUser();
    },
    //设备操作
    resetdevtype() {
      this.formthree = {
        number: "",
        name: "",
        enable: 9
      };
    },
    addSuketype(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.deviceobjectId != "") {
            editorSukedevtype(
              this.deviceobjectId,
              this.Deviceform.name,
              this.Deviceform.code,
              this.Deviceform.desc,
              this.Deviceform.status
            ).then(resultes => {
              this.$message({
                message: "设备" + this.Deviceform.name + "修改成功",
                type: "success"
              });
              this.isDevice = false;
              this.handleClick({ name: "third" });
              this.deviceobjectId = "";
              this.$refs[formName].resetFields();
              this.Deviceform.desc = "";
            });
          }
          addSukedevtype(
            this.Deviceform.name,
            this.Deviceform.code,
            this.Deviceform.desc,
            this.Deviceform.status
          )
            .then(resultes => {
              if (resultes) {
                this.$message({
                  message: "设备添加成功",
                  type: "success"
                });
                this.isDevice = false;
                this.handleClick({ name: "third" });
                this.$refs[formName].resetFields();
                this.Deviceform.desc = "";
              }
            })
            .catch(error => {
              console.log(error);
            });
        }
      });
    },
    //编辑设备状态
    editorsuketype(row) {
      if (row.enable == 0) {
        editorSukedevtype(
          row.objectId,
          row.name,
          row.number,
          row.remark,
          1
        ).then(resultes => {
          this.$message({
            message: "设备" + row.name + "启用成功",
            type: "success"
          });
          this.handleClick({ name: "third" });
        });
      } else {
        editorSukedevtype(
          row.objectId,
          row.name,
          row.number,
          row.remark,
          0
        ).then(resultes => {
          this.$message({
            message: "设备" + row.name + "已废弃",
            type: "error"
          });
          this.handleClick({ name: "third" });
        });
      }
    },
    //编辑设备
    edirtdevtype(row) {
      this.isDevice = true;
      this.Deviceform.name = row.name;
      this.Deviceform.code = row.number;
      this.Deviceform.desc = row.remark;
      this.Deviceform.status = row.enable;
      this.deviceobjectId = row.objectId;
    }
  },
  beforeDestroy() {
    window.clearInterval(this.timer);
    this.timer = null;
  }
};
</script>
<style scoped>
.general {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background: #ffffff;
  display: flex;
}
.blockheader {
  width: 100%;
  height: auto;
  padding: 10px;
  box-sizing: border-box;
}
.blockbutton {
  text-align: right;
  padding-right: 10px;
  box-sizing: border-box;
}
.fenye {
  margin-top: 10px;
}
.addevice {
  margin-top: 10px;
}
</style>
<style>
.general .el-tabs {
  margin-top: 20px;
}
.general .el-tabs__header {
  padding-left: 10px;
  font-size: 16px;
}
.general .el-tabs__header .el-tabs__item {
  font-size: 16px;
}
.general .el-tabs__content {
  padding-left: 10px;
  box-sizing: border-box;
}
.general .blockheader1 .el-form-item {
  margin-bottom: 5px;
}
.general .blockheader1 .el-input--suffix .el-input__inner,
.general .blockheader1 .el-input__inner,
.general .sukethree .formthree .el-input--suffix .el-input__inner,
.general .sukethree .formthree .el-input__inner {
  height: 26px;
  border-radius: 0;
  line-height: 26px;
  width: 150px;
}
.general .sukethree .formthree.el-button--primary {
  background-color: #ffd428;
  border-color: #ffd428;
  color: #333333;
}
.general .el-table td,
.general .el-table th {
  padding: 5px 0;
}
.general .addevice .el-input__inner,
.general .addevice .el-textarea__inner {
  width: 60%;
}
.general .addevice .el-form-item__label {
  text-align: left;
}
.general .addevice .el-form-item {
  padding-bottom: 5px;
  box-sizing: border-box;
}
.general .resource {
  margin-top: 20px;
}
@media screen and (max-width: 1024px) {
  .resource {
    display: none;
  }
  .el-dialog {
    width: 100%;
  }
}
</style>
