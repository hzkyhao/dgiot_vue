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
                <el-option v-for="(item,index) in departmentlaboratory" :key="index" :label="item.attributes.name" :value="item.id"></el-option>
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
            <el-button type="primary" size="small" @click="adddevices">新增传感器</el-button>
            <el-button type="danger" size="small" @click="deleteDevices">删除</el-button>
        </div>
        <div class="tableblock">
            <el-table
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column
                type="selection"
                width="55">
                </el-table-column>
                 <el-table-column
                type="index"
                label="序号"
                align="center"
                width="50">
                </el-table-column>
                <el-table-column
                label="检测仪器名称"
                align="center"
                width="200">
                <template slot-scope="scope">{{ scope.row.attributes.name }}</template>
                </el-table-column>
                <el-table-column
              
                label="所属实验室"
                width="250"
                align="center"
                >
                <template slot-scope="scope">
                    <span>{{scope.row.attributes.basedata.laboratory}}</span>
                </template>
                </el-table-column>
                <el-table-column
                label="所属产品"
                width="200"
                align="center"
                show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.attributes.product.attributes.name}}</span>
                </template>
                </el-table-column>
                <el-table-column
                prop="name"
                label="测量指标"
                width="200"
                align="center"
                >
                </el-table-column>
                <el-table-column
                label="检测仪器编号"
                width="250"
                align="center"
                >
                <template slot-scope="scope">
                    <span>{{scope.row.attributes.devaddr}}</span>
                </template>
                </el-table-column>
                <el-table-column
               
                label="协议指标"
                align="center"
                >
                <template slot-scope="scope">
                    <span>{{scope.row.attributes.basedata.agreement}}</span>
                </template>
                </el-table-column>
                <el-table-column
               
                label="生产厂家"
                width="250"
                align="center"
                >
                <template slot-scope="scope">
                    <span>{{scope.row.attributes.basedata.factory}}</span>
                </template>
                </el-table-column>
                <el-table-column
               
                label="仪器型号"
                width="150"
                align="center"
                >
                <template slot-scope="scope">
                    <span>{{scope.row.attributes.devModel}}</span>
                </template>
                </el-table-column>
                <el-table-column
                prop="name"
                label="备注"
                width="200"
                align="center"
                show-overflow-tooltip
                >
                <template slot-scope="scope">
                   <span>{{scope.row.attributes.desc}}</span>
                </template>
                </el-table-column>
                <el-table-column
                label="检测仪器管理"
                align="center"
                width="300"
                >
                <template slot-scope="scope">
                   <el-button type="primary" icon="el-icon-edit" @click="editorDevice(scope.row.id)" size="small"></el-button>
                   <el-button type="danger" icon="el-icon-delete" @click="deleteDevice(scope.row.id)" size="small"></el-button>
                   <el-button type="success" icon="el-icon-s-operation" @click="relationDevice(scope.row)" size="small"></el-button>
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
                :total="total">
            </el-pagination>
        </div>
    </div>
    <!--新增涉设备弹窗-->
    <el-dialog
        title="检测仪器新增"
        :visible.sync="dialogVisible"
        width="60%"
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
                            <el-option v-for="(item,index) in productlist" :key="index" :value="item.id" :label="item.attributes.name"></el-option>
                           
                        </el-select>
                    </el-form-item>
                    <el-form-item label="检测仪器编号" :label-width="formLabelWidth" prop="devaddr">
                        <el-input v-model="form.devaddr" autocomplete="off" placeholder="请输入检测仪器编号"></el-input>
                    </el-form-item>
                    <el-form-item label="生产厂家" :label-width="formLabelWidth" prop="factory">
                        <el-input v-model="form.factory" autocomplete="off" placeholder="请输入设备生产厂家信息"></el-input>
                    </el-form-item>
                    <el-form-item label="实验仪器图片" :label-width="formLabelWidth" required>
                    <el-upload
                      class="avatar-uploader"
                      action="http://ci.iotn2n.com:5080/iotapi/upload"
                      :show-file-list="false"
                      :on-success="handleAvatarSuccessBusiness1"
                      :before-upload="beforeAvatarUpload1"
                    >
                      <img v-if="form.imgsrc" :src="form.imgsrc" class="avatar" />
                      <i v-else class="el-icon-plus avatar-uploader-icon" style="width:300px;height:200px"></i>
                    </el-upload>
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
                    <el-form-item label="所属测试台" :label-width="formLabelWidth">
                        <el-row>
                            <el-col :span="11">
                            <el-form-item prop="laboratory">
                            <el-select v-model="form.laboratory" placeholder="选择实验室" style="width:100%" @change="departmentChange">
                                <el-option v-for="(item,index) in departmentlaboratory" :key="index" :label="item.attributes.name" :value="item.id"></el-option>
                                
                            </el-select>
                            </el-form-item>
                            </el-col>
                            <el-col class="line" :span="2">-</el-col>
                            <el-col :span="11">
                            <el-form-item prop="testbed">
                            <el-select v-model="form.testbed" placeholder="选择测试台体" style="width:100%" @change="testBedName">
                                <el-option v-for="(item,index) in testbedlist" :key="index" :value="item.id" :label="item.attributes.name"></el-option>
                            </el-select>
                            </el-form-item>
                            </el-col>
                        </el-row>
                 </el-form-item>
                  <el-form-item label="仪器测量指标" :label-width="formLabelWidth" prop="target">
                    <el-select v-model="form.target" placeholder="请选择仪器测量指标">
                        <el-option v-for="(item,index) in properties" :label="item.name" :key="index" :value="item.identifier"></el-option>
                    </el-select>
                </el-form-item>
                 <el-form-item label="仪器协议类型" :label-width="formLabelWidth">
                    <el-input v-model="form.agreement" autocomplete="off" placeholder="请输入仪器协议类型(如：Modbus、自定义协议类型)"></el-input>
                </el-form-item>
                 <el-form-item label="检测仪器型号" :label-width="formLabelWidth">
                    <el-input v-model="form.devmodel" autocomplete="off" placeholder="请输入检测仪器型号"></el-input>
                </el-form-item>
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
        >
    
        <div class="dispose" style="display:flex;">
          <el-card class="box-card" style="width:45%;height:300px;overflow-y:scroll">
            <div slot="header" class="clearfix">
              <span>实验仪器</span>
             
            </div>
            <el-checkbox-group v-model="checkdevice" >
            
                <el-checkbox v-for="(item,index) in alldevice" :label="item.id" :key="index" style="display:block" disabled>{{item.attributes.name}}</el-checkbox>
                
            </el-checkbox-group>
          </el-card>
           <div style="margin:0 20px;text-align:center;">
            <!-- <span>关联</span> -->
             <span class="svg-container" style="line-height:300px;">
            <svg-icon icon-class="relation"  style="width:3rem;height:3rem;"/>
           </span> 
          </div>
         <el-card class="box-card" style="width:45%;height:300px;overflow-y:scroll">
            <div slot="header" class="clearfix">
              <span>测试台体</span>
              <el-button style="float: right; padding: 3px 0" type="text" @click="clearTestbed">清空</el-button>
            </div>
            <div v-for="(item,index) in alltestbed" :key="index" class="text item">
              <el-radio v-model="updatedId" :label="item.id" style="height:20px">{{item.attributes.name}}</el-radio>
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
export default {
  components: {
    Pumpdepartment
  },
  data() {
    return {
     //关联关系弹窗信息
      deviceForm:{
          name:''
      },
      disposeVisible:false,
      alldevice:[],
      updatedId:'',
      checkdevice:[],
      formLabelWidth: "120px",
      dialogVisible: false,
      departmentid: "",
      formInline: {
       laboratory:'',
       testbed:'',
       name:''
       
      },
      properties: [
        {
          name: "效率",
          dataType: {
            type: "float",
            specs: {
              max: 100,
              min: 0,
              step: 0.1,
              unit: "%"
            }
          },
          required: true,
          accessMode: "r",
          identifier: "effect"
        },
        {
          name: "转速",
          dataType: {
            type: "int",
            specs: {
              max: 10000,
              min: 0,
              step: 0.2,
              unit: "r/min"
            }
          },
          required: true,
          accessMode: "r",
          identifier: "speed"
        },
        {
          name: "扬程",
          dataType: {
            type: "float",
            specs: {
              max: 1000,
              min: 0,
              step: 0.1,
              unit: "m"
            }
          },
          required: true,
          accessMode: "r",
          identifier: "head"
        },
        {
          name: "出口压力",
          dataType: {
            type: "float",
            specs: {
              max: 10000,
              min: 0,
              step: 0.1,
              unit: "Mpa"
            }
          },
          required: true,
          accessMode: "r",
          identifier: "pressure_out"
        },
        {
          name: "进口压力",
          dataType: {
            type: "float",
            specs: {
              max: 10000,
              min: 0,
              step: 0.1,
              unit: "Mpa"
            }
          },
          required: true,
          accessMode: "r",
          identifier: "pressure_in"
        },
        {
          name: "功率因数",
          dataType: {
            type: "float",
            specs: {
              max: 1,
              min: 0,
              step: 0.1,
              unit: ""
            }
          },
          required: true,
          accessMode: "r",
          identifier: "power_factor"
        },
        {
          name: "功率",
          dataType: {
            type: "float",
            specs: {
              max: 10000,
              min: 0,
              step: 0.1,
              unit: "kW"
            }
          },
          required: true,
          accessMode: "r",
          identifier: "power"
        },
        {
          name: "电压",
          dataType: {
            type: "float",
            specs: {
              max: 380,
              min: 0,
              step: 0.1,
              unit: "V"
            }
          },
          required: true,
          accessMode: "r",
          identifier: "vol"
        },
        {
          name: "电流",
          dataType: {
            type: "float",
            specs: {
              max: 1000,
              min: 0,
              step: 0.1,
              unit: "A"
            }
          },
          required: true,
          accessMode: "r",
          identifier: "current"
        },
        {
          name: "流量",
          dataType: {
            type: "float",
            specs: {
              max: 10000,
              min: 0,
              step: 0.1,
              unit: "m³/h"
            }
          },
          required: true,
          accessMode: "r",
          identifier: "flow"
        },
        {
          name: "温度",
          dataType: {
            type: "float",
            specs: {
              max: 1000,
              min: -100,
              step: 1,
              unit: "°C"
            }
          },
          required: true,
          accessMode: "r",
          identifier: "temperature"
        }
      ],
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
      devicesid:'',
      laboratoryname:'',
      testbedname:'',
      //取证设备表格
      tableData: [],
      multipleSelection: [],
      pagesize: 10,
      start: 0,
      total: 0,
      form: {
        name: "",
        region: "",
        imgsrc:'',
        laboratory:'',
        product:'',
        testbed:'',
        factory: "",
        devaddr: "",
        devmodel: "",
        agreement: "",
        target: "",
        desc:''
      },
      //弹窗关联的三个列表
      departmentlaboratory: [],
      testbedlist: [],
      productlist: [],
      departmentid:'',
    };
  },
  mounted() {
      this.getDevices()
      this.getDepartmentLaboratory();
      this.getProductList();
      this.getAllBed()
  },
  methods: {
       getAllBed(){
       var Testbed = Parse.Object.extend("Testbed");
       var testbed = new Parse.Query(Testbed);
       testbed.limit(1000)
       testbed.find().then(response=>{
         this.alltestbed = response
       },error=>{
         returnLogin(error)
       })
    },
    getDevices(start,departmentid){
        if(start==0){
            this.start=0
        }
        var Devices = Parse.Object.extend('Devices')
        var devices = new Parse.Query(Devices)
        devices.equalTo('basedata.type','PUMP')
        if(this.formInline.laboratory!=''){
            devices.equalTo('basedata.laboratoryid',this.formInline.laboratory)
        }
        if(this.formInline.testbed!=''){
            devices.matches('basedata.testbedname',this.formInline.testbed,'i')
        }
        if(this.formInline.name!=''){
         devices.matches('name',this.formInline.name,'i')
        }
        if(departmentid){
          devices.equalTo('basedata.laboratoryid',departmentid)
        }
        devices.limit(this.pagesize)
        devices.skip(this.start)
        devices.count().then(count=>{
            this.total = count
            devices.find().then(response=>{
                this.tableData = response
            },error=>{
                returnLogin(error)
            })
        },error=>{
            returnLogin(error)
        })
    },
    resetFormInline(){
        this.formInline = {
            laboratory:'',
            testbed:'',
            name:''
        }
    },
    getPumpNode(val) {
      this.departmentid = val.objectId;
      console.log(val)
      if(val.icon=='实验室'){
        this.formInline.laboratory = val.objectId
         this.getDevices(0,this.departmentid)
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
      var Product = Parse.Object.extend("Product");
      var product = new Parse.Query(Product);
      product.find().then(
        response => {
          this.productlist = response;
        },
        error => {
          returnLogin(error);
        }
      );
    },
    getDepartmentLaboratory() {
      var Department = Parse.Object.extend("Department");
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
      this.departmentlaboratory.map(item=>{
          if(item.id==val){
              this.laboratoryname = item.attributes.name
          }
      })
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
    testBedName(val){
    this.testbedlist.map(item=>{
        if(val==item.id){
            this.testbedname = item.attributes.name
        }
    })
    },
    //增加设备弹窗
    adddevices() {
      this.dialogVisible = true;
      
    },
    //确定添加实验室仪器
    fixDevices(formName) {
       
        this.$refs[formName].validate((valid) => {
        if (valid) {
            // if(this.form.imgsrc==''){
            //   this.$message.error('请上传实验仪器照片')
            //   return  
            // }
            var objectId = Parse.User.current().id;
            var Devices = Parse.Object.extend('Devices')
            var devices = new Devices()
            var Product = Parse.Object.extend('Product')
            var product = new Product()
             var acl = new Parse.ACL();
            product.id = this.form.product
            if(this.devicesid!=''){
                devices.id = this.devicesid
            }
            acl.setReadAccess(objectId, true);
            acl.setWriteAccess(objectId, true);
            devices.set("ACL", acl);
            devices.set('name',this.form.name)
            devices.set('devaddr',this.form.devaddr)
            devices.set('devModel',this.form.devmodel)
            devices.set('desc',this.form.desc)
            devices.set('product',product)
            devices.set('basedata',{
                 laboratoryid:this.form.laboratory,
                 laboratory:this.laboratoryname,
                 agreement:this.form.agreement,
                 imgsrc:this.form.imgsrc,
                 factory:this.form.factory,
                 testbed:this.form.testbed,
                 target:this.form.target,
                 testbedname:this.testbedname,
                 type:'PUMP'
            })
            devices.save().then(response=>{
                if(response){
                    console.log(response)
                    this.devicesid=''
                    var Testbed = Parse.Object.extend('Testbed')
                    var testbed = new Testbed()
                    var Dev = Parse.Object.extend("Devices");
                    var devices = new Dev();
                    testbed.id = this.form.testbed
                    var relation = testbed.relation('devices')
                     devices.set('objectId',response.id)
                     relation.add(devices)
                     devices.save().then(resultes=>{
                         if(resultes){
                             this.$message.success('创建成功')
                              this.$refs[formName].resetFields()
                              this.dialogVisible = false
                              this.getDevices()
                         }
                     })
                }
            })
        } else {
        this.$message.error('有必填项未填写')
        return false;
        }
    });
    },
    beforeAvatarUpload1(file) {
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      var extension =
        testmsg === "jpg" ||
        testmsg === "JPG" ||
        testmsg === "png" ||
        testmsg === "PNG" ||
        testmsg === "bpm" ||
        testmsg === "BPM";
      const isLt50M = file.size / 1024 / 1024 < 10;
      if (!extension) {
        this.$message({
          message: "上传图片只能是jpg / png / bpm格式!",
          type: "error"
        });
        return false; //必须加上return false; 才能阻止
      }
      console.log(file);
      if (!isLt50M) {
        this.$message({
          message: "上传文件大小不能超过 10MB!",
          type: "error"
        });
        return false;
      }
      return extension || isLt50M;
    },
    handleAvatarSuccessBusiness1(response, file, fileList) {
      this.form.imgsrc = response.path;
      this.$message.success("上传成功");
    },
    //多个删除
    deleteDevices() {
       
      var arr = [];
      if (this.multipleSelection.length != 0) {
           this.$confirm('此操作将永久删除选中检测设备, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.multipleSelection.map(item => {
            arr.push(
                new Promise((resolve, reject) => {
                var Devices = Parse.Object.extend("Devices");
                var devices = new Devices();
                devices.id = item.id;
                return devices.destroy().then(
                    resultes => {
                    resolve(resultes);
                    },
                    error => {
                    reject(error.message);
                    }
                );
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
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
       
      } else {
        this.$message.warning("请勾选要删除的检测设备");
      }
    },
    //设备的三个操作
    editorDevice(id){
        this.devicesid = id
        this.dialogVisible = true
        var Devices = Parse.Object.extend('Devices')
        var devices = new Parse.Query(Devices)
        devices.get(id).then(response=>{
            this.form.name = response.attributes.name
            this.form.laboratory = response.attributes.basedata.laboratoryid
            this.departmentChange(response.attributes.basedata.laboratoryid)
            this.form.product = response.attributes.product.id
            this.form.devaddr = response.attributes.devaddr
            this.form.desc = response.attributes.desc
            this.form.devmodel = response.attributes.devModel
            this.form.testbed = response.attributes.basedata.testbed
            this.testBedName(response.attributes.basedata.testbed)
            this.form.agreement = response.attributes.basedata.agreement
            this.form.factory = response.attributes.basedata.factory
            this.form.target = response.attributes.basedata.target
            this.form.imgsrc = response.attributes.basedata.imgsrc
        },error=>{
            returnLogin(error)
        })
    },
    deleteDevice(id){
        this.$confirm('此操作将永久删除该检测设备, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var Devices = Parse.Object.extend("Devices");
            var devices = new Devices();
            devices.id = id;
            devices.destroy().then(
                resultes => {
                 this.$message({
                    message: "删除成功",
                    type: "success"
                });
                this.getDevices();
                },
                error => {
                returnLogin(eror)
                }
            );
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    relationDevice(row){
       this.alldevice = []
       this.alldevice.push(row)
       this.checkdevice.push(row.id)
       this.disposeVisible = true
       this.updatedId = row.attributes.basedata.testbed
    },
    clearTestbed(){
        this.updatedId = ''
    },
    //增加设备和测试台体关系
    addTestRelation(){
               var obj = {}
                obj = this.alldevice[0].attributes.basedata
                if(this.updatedId!=''){
                    var Testbed = Parse.Object.extend("Testbed");
                    var testbed = new Parse.Query(Testbed);
                    testbed.get(this.updatedId).then(response=>{
                         var Devices1 = Parse.Object.extend('Devices')
                         var devices1 = new Devices1()
                         devices1.id =this.checkdevice[0]
                         devices1.set('basedata',{
                            laboratoryid:response.attributes.department.id,
                            laboratory:response.attributes.department.attributes.name,
                            agreement:obj.agreement,
                            imgsrc:obj.imgsrc,
                            factory:obj.factory,
                            testbed:this.updatedId,
                            target:obj.target,
                            testbedname:response.attributes.name,
                            type:'PUMP' 
                         })
                         devices1.save().then(resultes=>{
                             if(resultes){
                                 //先接触relation关系
                                    var Testbed = Parse.Object.extend('Testbed')
                                    var testbed = new Testbed()
                                    var Dev = Parse.Object.extend("Devices");
                                    var devices = new Dev();
                                    testbed.id = this.alldevice[0].attributes.basedata.testbed
                                    var relation = testbed.relation('devices')
                                    devices.set('objectId',this.alldevice[0].id)
                                    relation.remove(devices)
                                    testbed.save().then(response=>{
                                          //再添加relation关系
                                        var Testbed = Parse.Object.extend('Testbed')
                                        var testbed1 = new Testbed()
                                        var Dev = Parse.Object.extend("Devices");
                                        var devices = new Dev();
                                         testbed1.id = this.updatedId
                                        var relation = testbed.relation('devices')
                                        devices.set('objectId',this.updatedId)
                                        relation.add(devices)
                                        testbed1.save().then(resultes=>{
                                            if(response){
                                                this.$message.success('关联成功')
                                                this.disposeVisible = false
                                                this.getDevices()
                                            }
                                        })
                                    })
                             }
                         })
                    })
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
