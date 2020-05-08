<template>
  <div class="checkdevies">
    <Pumpdepartment
      style="width:360px;height:100vh;overflow:scroll;flex-shrink:0;padding:10px;"
      @pumpDetail="getPumpNode"
    />
    <div style="width:calc(100% - 360px);padding:20px;" class="devicesright">
      <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
        <el-form-item label="所属实验室">
          <el-select v-model="formInline.laboratory" placeholder="所属实验室">
            <el-option
              v-for="(item,index) in departmentlaboratory"
              :key="index"
              :label="item.attributes.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="检测台">
          <el-input v-model="formInline.testbed" placeholder="请输入检测台名称"></el-input>
        </el-form-item>
        <el-form-item label="传感器">
          <el-input v-model="formInline.name" placeholder="请输入传感器名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getDevices(0)">查询</el-button>
          <el-button type="primary" @click="resetFormInline">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="adddevices">
        <!-- <el-button type="primary" size="small" @click="adddevices">新增传感器</el-button> -->
        <el-button type="danger" size="small" @click="deleteDevices">删除</el-button>
      </div>
      <div class="tableblock">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
          <el-table-column label="检测仪器名称" prop="name" align="center" width="200">           
          </el-table-column>
          <el-table-column label="所属实验室" width="250" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.basedata">{{scope.row.basedata.testbedname}}</span>
              <span v-else></span>
            </template>
          </el-table-column>
          <el-table-column label="检测仪器编号" prop="devType" width="250" align="center">
           <template slot-scope="scope">
              <span >{{scope.row.devaddr}}</span>
            </template>
          </el-table-column>
          <el-table-column label="协议指标" align="center" width="150">
           <template slot-scope="scope">
              <span v-if="scope.row.basedata">{{scope.row.basedata.agreement}}</span>
              <span v-else></span>
            </template>
          </el-table-column>
          <el-table-column label="生产厂家" width="250" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.basedata">{{scope.row.basedata.factory}}</span>
              <span v-else></span>
            </template>
          </el-table-column>      
          <el-table-column label="取证设备状态" width="150" align="center">
            <template slot="header">
              <span class="ACTIVE">设备状态</span>
              <el-tooltip content="ACTIVE设备已注册,UNACTIVE设备未注册" placement="top">
                <i class="el-icon-question"></i>
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              <span :style="{'color':scope.row.status=='ACTIVE'?'green':'red'}">{{scope.row.status}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="备注" width="200" align="center" show-overflow-tooltip>
         
          </el-table-column>
          <el-table-column label="检测仪器管理" align="center" width="300">
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                @click="editorDevice(scope.row.objectId)"
                size="small"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                @click="deleteDevice(scope.row.objectId)"
                size="small"
              ></el-button>
              <el-button
                type="success"
                icon="el-icon-s-operation"
                @click="relationDevice(scope.row)"
                size="small"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pageblock">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <!--新增涉设备弹窗-->
    <el-dialog
      title="检测仪器新增"
      :visible.sync="dialogVisible"
      width="60%"
      :close-on-click-modal="false"
    >
      <div class="addContent">
        <el-form :model="form" ref="devform" :rules="formrules">
          <el-row>
            <el-col :span="12">
              <el-form-item label="检测仪器名称" :label-width="formLabelWidth" prop="name">
                <el-input v-model="form.name" autocomplete="off" placeholder="请输入检测仪器名称"></el-input>
              </el-form-item>
              <el-form-item label="所属产品" :label-width="formLabelWidth" prop="product">
                <el-select v-model="form.product" placeholder="请选择产品">
                  <el-option
                    v-for="(item,index) in productlist"
                    :key="index"
                    :value="item.objectId"
                    :label="item.name"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="检测仪器编号" :label-width="formLabelWidth" prop="devaddr">
                <el-input v-model="form.devaddr" autocomplete="off" placeholder="请输入检测仪器编号"></el-input>
              </el-form-item>

              <el-form-item label="实验仪器图片" :label-width="formLabelWidth" required>
                <img v-if="form.imgsrc" :src="form.imgsrc" class="avatar" />
                <i
                  v-else
                  class="el-icon-plus avatar-uploader-icon"
                  style="width:300px;height:200px"
                  v-loading="loading"
                ></i>
                <form
                  method="POST"
                  enctype="multipart/form-data"
                  ref="uploadform"
                  style="position: absolute"
                >
                  <input
                    type="file"
                    @change="upload($event)"
                    style="position:relative;top:-200px; opacity:0;z-index:5;height:200px;width:200px;cursor:pointer"
                  />
                </form>

                <el-button
                  size="small"
                  type="danger"
                  style="position: absolute;left: 200px;top:150px;margin-left:0"
                  v-show="form.imgsrc!=''"
                  @click="form.imgsrc=''"
                >删除</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所属测试台" :label-width="formLabelWidth" required>
                <el-row>
                  <el-col :span="11">
                    <el-form-item prop="laboratory">
                      <el-select
                        v-model="form.laboratory"
                        placeholder="选择实验室"
                        style="width:100%"
                        @change="departmentChange"
                      >
                        <el-option
                          v-for="(item,index) in departmentlaboratory"
                          :key="index"
                          :label="item.attributes.name"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col class="line" :span="2">-</el-col>
                  <el-col :span="11">
                    <el-form-item prop="testbed">
                      <el-select
                        v-model="form.testbed"
                        placeholder="选择测试台体"
                        style="width:100%"
                        @change="testBedName"
                      >
                        <el-option
                          v-for="(item,index) in testbedlist"
                          :key="index"
                          :value="item.id"
                          :label="item.attributes.name"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="生产厂家" :label-width="formLabelWidth" prop="factory">
                <el-input v-model="form.factory" autocomplete="off" placeholder="请输入设备生产厂家信息"></el-input>
              </el-form-item>
              <!-- <el-form-item label="仪器测量指标" :label-width="formLabelWidth" prop="target">
                    <el-select v-model="form.target" placeholder="请选择仪器测量指标">
                        <el-option v-for="(item,index) in properties" :label="item.name" :key="index" :value="item.identifier"></el-option>
                    </el-select>
              </el-form-item>-->
              <el-form-item label="仪器协议类型" :label-width="formLabelWidth">
                <el-input
                  v-model="form.agreement"
                  autocomplete="off"
                  placeholder="请输入仪器协议类型(如：Modbus、自定义协议类型)"
                ></el-input>
              </el-form-item>
              <!-- <el-form-item label="检测仪器型号" :label-width="formLabelWidth">
                    <el-input v-model="form.devmodel" autocomplete="off" placeholder="请输入检测仪器型号"></el-input>
              </el-form-item>-->
              <el-form-item label="备注信息" :label-width="formLabelWidth">
                <el-input type="textarea" v-model="form.desc" :rows="8" placeholder="请输入检测仪器备注信息"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="fixDevices('devform')">确 定</el-button>
      </span>
    </el-dialog>
    <!--关联弹窗-->
    <el-dialog
      title="仪器关联"
      :visible.sync="disposeVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <div class="dispose" style="display:flex;">
        <el-card class="box-card" style="width:45%;height:300px;overflow-y:scroll">
          <div slot="header" class="clearfix">
            <span>实验仪器</span>
          </div>
          <el-checkbox-group v-model="checkdevice">
            <el-checkbox
              v-for="(item,index) in alldevice"
              :label="item.objectId"
              :key="index"
              style="display:block"
              disabled
            >{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-card>
        <div style="margin:0 20px;text-align:center;">
          <!-- <span>关联</span> -->
          <span class="svg-container" style="line-height:300px;">
            <svg-icon icon-class="relation" style="width:3rem;height:3rem;" />
          </span>
        </div>
        <el-card class="box-card" style="width:45%;height:300px;overflow-y:scroll">
          <div slot="header" class="clearfix">
            <span>测试台体</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="clearTestbed">清空</el-button>
          </div>
          <div v-for="(item,index) in alltestbed" :key="index" class="text item">
            <el-radio
              v-model="updatedId"
              :label="item.id"
              style="height:20px"
            >{{item.attributes.name}}</el-radio>
          </div>
        </el-card>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="disposeVisible = false">取 消</el-button>
        <el-button type="primary" @click="addTestRelation">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Parse from "parse";
import Pumpdepartment from "@/components/resource/pumpdepartment";
import { returnLogin } from "@/utils/return";
import Cookies from "js-cookie";
import { error } from "util";
import $ from "jquery";
export default {
  components: {
    Pumpdepartment
  },
  data() {
    return {
      //关联关系弹窗信息
      loading: false,
      deviceForm: {
        name: ""
      },
      disposeVisible: false,
      alldevice: [],
      updatedId: "",
      checkdevice: [],
      formLabelWidth: "120px",
      dialogVisible: false,
      departmentid: "",
      formInline: {
        laboratory: "",
        testbed: "",
        name: ""
      },
      formrules: {
        name: [{ required: true, message: "请输入设备名称", trigger: "blur" }],
        devaddr: [
          { required: true, message: "请输入设备编号", trigger: "blur" }
        ],
        factory: [
          { required: true, message: "请输入设备生产厂家", trigger: "blur" }
        ],
        product: [
          { required: true, message: "请选择设备所属产品", trigger: "change" }
        ],
        laboratory: [
          { required: true, message: "请选择设备所属实验室", trigger: "change" }
        ],
        testbed: [
          {
            required: true,
            message: "请选择设备所属测试台体",
            trigger: "change"
          }
        ],
        target: [
          { required: true, message: "请选择仪器检测指标", trigger: "change" }
        ],
        region: [
          { required: true, message: "请选择活动区域", trigger: "change" }
        ]
      },
      //点编辑时的devices
      devicesid: "",
      laboratoryname: "",
      testbedname: "",
      //取证设备表格
      tableData: [],
      multipleSelection: [],
      pagesize: 10,
      start: 0,
      total: 0,
      form: {
        name: "",
        region: "",
        imgsrc: "",
        laboratory: "",
        product: "",
        testbed: "",
        factory: "",
        devaddr: "",
        devmodel: "",
        agreement: "",
        target: "",
        desc: "",
        status: ""
      },
      //弹窗关联的三个列表
      departmentlaboratory: [],
      testbedlist: [],
      productlist: [],
      departmentid: "",
      alltestbed: []
    };
  },
  mounted() {
    this.getDevices();
    this.getDepartmentLaboratory();
    this.getProductList();
    this.getAllBed();
  },
  methods: {
    //测量指标
    returnTarget(val) {
      var string = "";
      this.properties.map(item => {
        if (item.identifier == val) {
          string = item.name;
        }
      });
      return string;
    },
    getAllBed() {
      var Testbed = Parse.Object.extend("Testbed");
      var testbed = new Parse.Query(Testbed);
      testbed.limit(1000);
      testbed.find().then(
        response => {
          this.alltestbed = response;
        },
        error => {
          returnLogin(error);
        }
      );
    },
    /*
    getDevices(start, departmentid) {
      
      if (start == 0) {
        this.start = 0;
      }
      
      var whereProduct = {
        devType: "devType-instrument11"
      };
      $.ajax({
        type: "GET",
        dataType: "json",
        contentType: "application/json",
        headers: {
          sessionToken: Cookies.get("access_token")
        },
        data: {
          where: JSON.stringify(whereProduct)
        },
        url: Cookies.get("apiserver") + "/classes/Product",
        success: response => {
          console.log(response)
          if (response) {
           
            $.ajax({
              type: "GET",
              dataType: "json",
              contentType: "application/json",
              headers: {
                sessionToken: Cookies.get("access_token")
              },
              data: {
                skip: this.start,
                limit: this.pagesize,
                keys: "count(*)",
                where: JSON.stringify(where)
              },
              url: Cookies.get("apiserver") + "/classes/Device",
              success: result => {
                if (result) {
                  this.total = result.count;
                  this.tableData = result.results;
                }
              },
              fail: error => {
                this.$message.error(error);
              }
            });
          }
        },
        fail: error => {
          this.$message.error(error);
        }
      });


    },
     */
    getDevices(start, departmentId){
      if (start == 0) {
        this.start = 0;
      }
      var vm = this;

      vm.$axiosWen.get('/classes/Product',{
      params:{
            limit: 200,
            order: "-createdAt",
            where: {devType: "pump_dtu"},
            keys: "count(*)",
          }}
          )
        .then(function (response) {
          if(response && response.results){  
             var where = {
              product:response.results[0].objectId
            };
            if (vm.formInline.laboratory != "") {
              where["basedata.laboratoryid"] = vm.formInline.laboratory;
            }
            if (vm.formInline.testbed != "") {
              where["basedata.testbedname"] = vm.formInline.testbed;
            }
            if (vm.departmentid) {
              where["basedata.laboratoryid"] = vm.departmentid;
            }    
            var productlistTemp = response.results;
            vm.$axiosWen.get('/classes/Device',{
            params:{
                  skip: vm.start,
                  limit: vm.pagesize,
                  order: "-createdAt",
                  where: where,
                  keys: "count(*)",
                }}
                )
              .then(function (response) {
                if(response && response.results){ 
                  console.log(response.results)
                    vm.total = response.results.count;
                    vm.tableData = response.results;
                 }                 
              })
              .catch(function (error) {
                console.log('Device err',error);
              })
          }
    
        })
        .catch(function (error) {
          console.log('Product err',error);
        })

    },
    resetFormInline() {
      this.formInline = {
        laboratory: "",
        testbed: "",
        name: ""
      };
    },
    getPumpNode(val) {
      this.departmentid = val.objectId;
      console.log(val);
      if (val.icon == "实验室") {
        this.formInline.laboratory = val.objectId;
        this.getDevices(0, this.departmentid);
      }
    },
    //表格多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //分页操作
    handleSizeChange(val) {
      this.pagesize = val;
    },
    handleCurrentChange(val) {
      this.start = (val - 1) * this.pagesize;
    },
    getProductList() {
      $.ajax({
        type: "GET",
        contentType: "application/json",
        dataType: "json",
        headers: {
          sessionToken: Cookies.get("access_token")
        },
        data: {},
        url: Cookies.get("apiserver") + "/classes/Product",
        success: response => {
          if (response) {
            this.productlist = response.results;
          }
        }
      });
      // var Product = Parse.Object.extend("Product");
      // var product = new Parse.Query(Product);
      // product.find().then(
      //   response => {
      //     this.productlist = response;
      //   },
      //   error => {
      //     returnLogin(error);
      //   }
      // );
    },
    getDepartmentLaboratory() {
      var Department = Parse.Object.extend("PumpDepartment");
      var department = new Parse.Query(Department);
      department.equalTo("org_type", "实验室");
      department.find().then(
        resultes => {
          this.departmentlaboratory = resultes;
        },
        error => {
          returnLogin(error);
        }
      );
    },
    departmentChange(val) {
      this.departmentlaboratory.map(item => {
        if (item.id == val) {
          this.laboratoryname = item.attributes.name;
        }
      });
      var Testbed = Parse.Object.extend("Testbed");
      var testbed = new Parse.Query(Testbed);
      testbed.equalTo("department", val);
      testbed.find().then(
        resultes => {
          this.testbedlist = resultes;
        },
        error => {
          returnLogin(error);
        }
      );
    },
    testBedName(val) {
      this.testbedlist.map(item => {
        if (val == item.id) {
          this.testbedname = item.attributes.name;
        }
      });
    },
    //增加设备弹窗
    adddevices() {
      this.dialogVisible = true;
    },
    //确定添加实验室仪器
    fixDevices(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.form.imgsrc == "") {
            this.$message.error("请上传实验仪器照片");
            return;
          }
          if (this.devicesid == "") {
            var _this = this;
            var appid = Cookies.get("appids");
            var ACL = {
              key: {}
            };
            for (var key in ACL) {
              key = "role:" + Cookies.get("appids");
              ACL[key] = {
                read: true,
                write: true
              };
            }
            delete ACL.key;

            $.ajax({
              type: "POST",
              dataType: "json",
              contentType: "application/json",
              headers: {
                sessionToken: Cookies.get("access_token")
              },
              data: JSON.stringify({
                ACL: ACL,
                product: {
                  __type: "Pointer",
                  className: "Product",
                  objectId: _this.form.product
                },
                basedata: {
                  laboratoryid: _this.form.laboratory,
                  laboratory: _this.laboratoryname,
                  agreement: _this.form.agreement,
                  imgsrc: _this.form.imgsrc,
                  factory: _this.form.factory,
                  testbed: _this.form.testbed,
                  testbedname: _this.testbedname,
                  type: "PUMP_DTU"
                },
                status: "UNACTIVE",
                devaddr: _this.form.devaddr,
                name: _this.form.name
              }),
              url: Cookies.get("apiserver") + "/classes/Device",
              success: result => {
                if (result) {
                  this.$refs[formName].resetFields();
                  this.dialogVisible = false;
                  this.getDevices();
                  this.$message.success("创建成功");
                }
              },
              fail: error => {
                this.$message.error(error);
              }
            });
          } else {
            var _this = this;
            var appid = Cookies.get("appids");
            var ACL = {
              key: {}
            };
            for (var key in ACL) {
              key = "role:" + Cookies.get("appids");
              ACL[key] = {
                read: true,
                write: true
              };
            }
            delete ACL.key;

            $.ajax({
              type: "PUT",
              dataType: "json",
              contentType: "application/json",
              headers: {
                sessionToken: Cookies.get("access_token")
              },
              data: JSON.stringify({
                ACL: ACL,
                product: {
                  __type: "Pointer",
                  className: "Product",
                  objectId: _this.form.product
                },
                basedata: {
                  laboratoryid: _this.form.laboratory,
                  laboratory: _this.laboratoryname,
                  agreement: _this.form.agreement,
                  imgsrc: _this.form.imgsrc,
                  factory: _this.form.factory,
                  testbed: _this.form.testbed,
                  testbedname: _this.testbedname,
                  desc:_this.form.desc,
                  type: "PUMP_DTU"
                },
                status: _this.form.status,
                devaddr: _this.form.devaddr,
                name: _this.form.name
              }),
              url:
                Cookies.get("apiserver") + "/classes/Device/" + _this.devicesid,
              success: result => {
                if (result) {
                  this.$refs[formName].resetFields();
                  this.form.imgsrc=''
                  this.dialogVisible = false;
                  this.getDevices();
                  this.$message.success("编辑成功");
                }
              },
              fail: error => {
                this.$message.error(error);
              }
            });
          }
        } else {
          this.$message.error("有必填项未填写");
          return false;
        }
      });
    },
    upload(event) {
      this.loading = true;
      if (event) {
        var file = event.target.files[0]; //name: "dangqi1.png" || type: "image/png"
        var name = file.name;
        var testmsg = event.target.files[0].type;
        var type = file.type.split("/")[0];
        var extension =
          testmsg === "image/jpeg" ||
          testmsg === "image/JPEG" ||
          testmsg === "image/png" ||
          testmsg === "image/PNG" ||
          testmsg === "image/bpm" ||
          testmsg === "image/BPM";
        if (!extension) {
          //将图片img转化为base64
          this.$message({
            message: "请上传图片",
            type: "error"
          });
          return false; //必须加上return false; 才能阻止
        } else {
          var reader = new FileReader();
          reader.readAsDataURL(file);
          var that = this;
          reader.onloadend = function() {
            var dataURL = reader.result;
            var blob = that.dataURItoBlob(dataURL);
            that.uploadFile(blob, name); //执行上传接口
          };
        }
      }
    },
    dataURItoBlob(dataURI) {
      // base64 解码
      var byteString = atob(dataURI.split(",")[1]);
      var mimeString = dataURI
        .split(",")[0]
        .split(":")[1]
        .split(";")[0];
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], { type: mimeString });
    },
    uploadFile(imgUrl, name) {
      var formdata = new FormData();
      formdata.append("file", imgUrl, name);
      formdata.append("output", "json");
      formdata.append("path", Cookies.get("appids"));
      formdata.append("scene", Cookies.get("appids"));
      formdata.append("auth_token", Cookies.get("access_token")); //下面是要传递的参数
      //此处必须设置为  multipart/form-data
      let config = {
        headers: {
          "Content-Type": "multipart/form-data" //之前说的以表单传数据的格式来传递fromdata
        }
      };
      this.$http
        .post(Cookies.get("fileserver"), formdata)
        .then(res => {
          if (res) {
            this.form.imgsrc = res.body.url;
            this.loading = false;
          }
        })
        .catch(error => {
          this.$message.error(error);
          this.loading = false;
        });
    },
    //多个删除
    deleteDevices() {
      var arr = [];
      if (this.multipleSelection.length != 0) {
        this.$confirm("此操作将永久删除选中检测设备, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            console.log(this.multipleSelection);
            this.multipleSelection.map(item => {
              arr.push(
                new Promise((resolve, reject) => {
                  return $.ajax({
                    type: "DELETE",
                    contentType: "application/json",
                    dataType: "json",
                    headers: {
                      sessionToken: Cookies.get("access_token")
                    },
                    url:
                      Cookies.get("apiserver") +
                      "/classes/Device/" +
                      item.objectId,
                    success: response => {
                      if (response) {
                        resolve(response);
                      }
                    },
                    fail: error => {
                      reject(error);
                    }
                  });
                })
              );
              Promise.all(arr)
                .then(data => {
                  this.$message({
                    message: "删除成功",
                    type: "success"
                  });
                  if (data.length == this.multipleSelection.length) {
                    this.getDevices();
                  }
                })
                .catch(error => {
                  this.$message({
                    message: error,
                    type: "error"
                  });
                });
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      } else {
        this.$message.warning("请勾选要删除的检测设备");
      }
    },
    //设备的三个操作
    editorDevice(id) {
      this.devicesid = id;
      this.dialogVisible = true;
      $.ajax({
        type: "GET",
        dataType: "json",
        contentType: "application/json",
        headers: {
          sessionToken: Cookies.get("access_token")
        },
        url: Cookies.get("apiserver") + "/classes/Device/" + id,
        success: response => {
          if (response) {
            this.form.name = response.name;
            if(response.basedata){
            this.form.laboratory = response.basedata.laboratoryid;
            this.departmentChange(response.basedata.laboratoryid);
            this.form.agreement = response.basedata.agreement;
            this.form.factory = response.basedata.factory;
            this.form.target = response.basedata.target;
            this.form.imgsrc = response.basedata.imgsrc;
            this.form.testbed = response.basedata.testbed;
            this.testBedName(response.basedata.testbed);
            }
            this.form.product = response.product.objectId;
            this.form.devaddr = response.devaddr;
            this.form.desc = response.desc;
            this.form.status = response.status;
          }
        },
        fail: error => {
          this.$message.error(error);
        }
      });
    },
    deleteDevice(id) {
      this.$confirm("此操作将永久删除该检测设备, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          $.ajax({
            type: "DELETE",
            contentType: "application/json",
            dataType: "json",
            headers: {
              sessionToken: Cookies.get("access_token")
            },
            url: Cookies.get("apiserver") + "/classes/Device/" + id,
            success: response => {
              if (response) {
                this.$message.success("删除成功");
                this.getDevices();
              }
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    relationDevice(row) {
      this.alldevice = [];
      this.alldevice.push(row);
      this.checkdevice.push(row.objectId);
      this.disposeVisible = true;
      this.updatedId = row.basedata.testbed;
    },
    clearTestbed() {
      this.updatedId = "";
    },
    //增加设备和测试台体关系
    addTestRelation() {
      var obj = {};
      obj = this.alldevice[0].basedata;
      if (this.updatedId != "") {
        var Testbed = Parse.Object.extend("Testbed");
        var testbed = new Parse.Query(Testbed);
        testbed.get(this.updatedId).then(response => {
          $.ajax({
            type: "PUT",
            dataType: "json",
            contentType: "application/json",
            headers: {
              sessionToken: Cookies.get("access_token")
            },
            data: JSON.stringify({
              basedata: {
                laboratoryid: response.attributes.department.id,
                laboratory: response.attributes.department.attributes.name,
                agreement: obj.agreement,
                imgsrc: obj.imgsrc,
                factory: obj.factory,
                testbed: this.updatedId,
                target: obj.target,
                testbedname: response.attributes.name,
                type: "PUMP_DTU"
              }
            }),
            url:
              Cookies.get("apiserver") +
              "/classes/Device/" +
              this.checkdevice[0],
            success: result => {
              if (result) {
                this.$message.success("关联成功");
                this.disposeVisible = false;
                this.getDevices();
              }
            },
            fail: error => {
              this.$message.error(error);
            }
          });
          //              devices1.save().then(resultes=>{
          //                  if(resultes){
          //                      //先接触relation关系
          //                         var Testbed = Parse.Object.extend('Testbed')
          //                         var testbed = new Testbed()
          //                         var Dev = Parse.Object.extend("Devices");
          //                         var devices = new Dev();
          //                         testbed.id = this.alldevice[0].attributes.basedata.testbed
          //                         var relation = testbed.relation('pumpdevice')
          //                         devices.set('objectId',this.alldevice[0].id)
          //                         relation.remove(devices)
          //                         testbed.save().then(response=>{
          //                               //再添加relation关系
          //                             var Testbed = Parse.Object.extend('Testbed')
          //                             var testbed1 = new Testbed()
          //                             var Dev = Parse.Object.extend("Devices");
          //                             var devices = new Dev();
          //                              testbed1.id = this.updatedId
          //                             var relation = testbed.relation('devices')
          //                             devices.set('objectId',this.updatedId)
          //                             relation.add(devices)
          //                             testbed1.save().then(resultes=>{
          //                                 if(response){
          //                                     this.$message.success('关联成功')
          //                                     this.disposeVisible = false
          //                                     this.getDevices()
          //                                 }
          //                             })
          //                         })
          //                  }
          //              })
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.checkdevies {
  width: 100%;
  min-height: 875px;
  /* padding: 20px; */
  box-sizing: border-box;
  /* background: url("../../imgages/echartbanner1.png") no-repeat; */
  /* background-size: cover; */
  display: flex;
  /* overflow: scroll; */
  .devicesright {
    .tableblock {
      margin-top: 20px;
    }
  }
  .pageblock {
    margin-top: 20px;
  }
  /deep/ .el-dialog__body {
    /deep/ .el-select {
      width: 100%;
    }
    /deep/ .el-col {
      @media screen and(max-width: 1350px) {
        width: 100%;
      }
    }
  }
}
</style>
<style>
.checkdevies .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.checkdevies.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.checkdevies .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 250px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  border: 1px dashed #cccccc;
}
.checkdevies .avatar {
  width: 250px;
  height: 178px;
  display: block;
}
.image-slot {
  font-size: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 250px;
  height: 250px;
  background: #f5f7fa;
  color: #909399;
}
.checkdevies .el-tabs__header {
  margin-top: 20px;
}
</style>
