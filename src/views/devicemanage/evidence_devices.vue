<template>
  <div class="evidencedevices">
    <Pumpdepartment
      style="width:360px;height:100vh;overflow:scroll;flex-shrink:0;padding:10px;"
      @pumpDetail="getPumpNode"
    />
    <div style="width:calc(100% - 360px);padding:20px;" class="devicesright">
        <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
            <el-form-item label="取证设备分类">
                <el-select v-model="formInline.evidencetype" placeholder="取证设备分类">
                    <el-option label="摄像头" value="camera"></el-option>
                    <el-option label="取证软件" value="evidence"></el-option>
                    <el-option label="平板电脑" value="monotonous"></el-option>
                    <el-option lab el="便携检测箱" value="detection_box"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="应用实验室">
                <el-select v-model="formInline.laboratory" placeholder="应用实验室">
                    <el-option v-for="(item,index) in departmentlaboratory" :key="index" :label="item.attributes.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="取证设备名称">
                <el-input v-model="formInline.name" placeholder="请输入取证设备名称"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getPumpDevices(0)">查询</el-button>
                <el-button type="primary" >重置</el-button>
            </el-form-item>
        </el-form>
        <div class="adddevices">
            <el-button type="primary" size="small" @click="adddevices">新增取证设备</el-button>
            <el-button type="danger" size="small" @click="deleteDevices                                                                                                                                                                                                              ">删除</el-button>
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
                label="取证设备名称"
                align="center"
                width="200">
                <template slot-scope="scope">{{ scope.row.attributes.name}}</template>
                </el-table-column>
                <el-table-column
               
                label="取证设备编号"
                width="250"
                align="center"
                >
                <template slot-scope="scope">{{ scope.row.attributes.devaddr}}</template>
                </el-table-column>
                <el-table-column
               
                label="取证设备分类"
                width="200"
                align="center"
                
                show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-if="scope.row.attributes.basedata.evidencetype=='camera'">摄像头</span>
                  <span v-else-if="scope.row.attributes.basedata.evidencetype=='evidence'">取证软件</span>
                  <span v-else-if="scope.row.attributes.basedata.evidencetype=='monotonous'">平板电脑</span>
                  <span v-else-if="scope.row.attributes.basedata.evidencetype=='detection_box'">便携检测箱</span>
                </template>
                </el-table-column>
                <el-table-column
                label="应用实验室"
                width="200"
                align="center"
                >
                 <template slot-scope="scope">
                    <span>{{scope.row.attributes.basedata.laboratory}}</span>
                </template>
                </el-table-column>
                <el-table-column
                label="是否动态IP"
                width="100"
                align="center"
                >
                 <template slot-scope="scope">
                    <el-tag type="success" v-if="scope.row.attributes.basedata.trendsip==true">是</el-tag>
                    <el-tag type="danger" v-else>否</el-tag>
                </template>
                </el-table-column>
                <el-table-column
                label="设备IP"
                align="center"
                width="200"
                >
                <template slot-scope="scope">
                    <span>{{scope.row.attributes.ip}}</span>
                </template>
                </el-table-column>
                <el-table-column
                label="设备MAC地址"
                width="250"
                align="center"
                >
                <template slot-scope="scope">
                    <span>{{scope.row.attributes.basedata.mac}}</span>
                </template>
                </el-table-column>
                <el-table-column
                label="取证设备用途"
                width="150"
                align="center"
                >
                <template slot-scope="scope">
                    <span>{{scope.row.attributes.basedata.evidenceuse}}</span>
                </template>
                </el-table-column>
                <el-table-column
                label="生产厂家"
                width="150"
                align="center"
                >
                <template slot-scope="scope">
                    <span>{{scope.row.attributes.basedata.factory}}</span>
                </template>
                </el-table-column>
                <el-table-column
                label="取证设备状态"
                width="150"
                align="center"
                >
                <template slot-scope="scope">
                    <span>{{scope.row.attributes.isEnable}}</span>
                </template>
                </el-table-column>
                <el-table-column
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
                label="取证设备管理"
                align="center"
                width="300"
                >
                  <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" @click="editorDevice(scope.row.id)" size="small"></el-button>
                    <el-button type="danger" icon="el-icon-delete" @click="deleteDevice(scope.row.id)" size="small"></el-button>
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
           <el-form :model="form" ref="evidenceform" :rules="formrules">
             <el-row>
                <el-col :span="12">
                    <el-form-item label="取证设备名称" :label-width="formLabelWidth" prop="name">
                        <el-input v-model="form.name" autocomplete="off" placeholder="取证设备名称"></el-input>
                    </el-form-item>
                     <el-form-item label="取证设备编号" :label-width="formLabelWidth" prop="devaddr">
                        <el-input v-model="form.devaddr" autocomplete="off" placeholder="请输入取证设备编号"></el-input>
                    </el-form-item>
                    <el-form-item label="所属产品" :label-width="formLabelWidth" prop="product">
                        <el-select v-model="form.product" placeholder="请选择产品">
                            <el-option v-for="(item,index) in productlist" :key="index" :value="item.id" :label="item.attributes.name"></el-option>
                           
                        </el-select>
                    </el-form-item>
                    <el-form-item label="设备IP地址" :label-width="formLabelWidth" prop="ip">
                        <el-input v-model="form.ip" autocomplete="off" placeholder="请输入设备IP地址"></el-input>
                    </el-form-item>
                    <el-form-item label="生产厂家" :label-width="formLabelWidth">
                        <el-input v-model="form.factory" autocomplete="off" placeholder="请输入设备生产厂家信息"></el-input>
                    </el-form-item>
                    <el-form-item label="取证用途" :label-width="formLabelWidth">
                        <el-input v-model="form.evidenceuse" autocomplete="off" placeholder="请输入取证用途"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="取证设备分类" :label-width="formLabelWidth" prop="evidencetype">
                        <el-select v-model="form.evidencetype" placeholder="选择取证设备分类">
                            <el-option label="摄像头" value="camera"></el-option>
                            <el-option label="取证软件" value="evidence"></el-option>
                            <el-option label="平板电脑" value="monotonous"></el-option>
                            <el-option label="便携检测箱" value="detection_box"></el-option>
                        </el-select>       
                   </el-form-item>
                  <el-form-item label="应用实验室" :label-width="formLabelWidth" prop="laboratory">
                    <el-select v-model="form.laboratory" placeholder="选择应用实验室" style="width:100%" @change="departmentChange">
                            <el-option v-for="(item,index) in departmentlaboratory" :key="index" :label="item.attributes.name" :value="item.id"></el-option>
                        </el-select> 
                </el-form-item>
                <el-form-item label="仪器测量指标" :label-width="formLabelWidth" prop="target">
                    <el-select v-model="form.target" placeholder="请选择仪器测量指标">
                        <el-option v-for="(item,index) in properties" :label="item.name" :key="index" :value="item.identifier"></el-option>
                    </el-select>
                </el-form-item>
                 <el-form-item label="是否动态IP" :label-width="formLabelWidth">
                        <el-select v-model="form.trendsip" placeholder="选择是否动态IP">
                            <el-option label="是" :value="true"></el-option>
                            <el-option label="否" :value="false"></el-option>
                        </el-select>       
                   </el-form-item>
                 <el-form-item label="设备MAC地址" :label-width="formLabelWidth">
                    <el-input v-model="form.mac" autocomplete="off" placeholder="请输入设备MAC地址"></el-input>
                     <p style="color:red;margin:0;position:absolute;top:25px">请填写取证设备MAC地址</p>
                </el-form-item>
                <el-form-item label="备注信息" :label-width="formLabelWidth">
                    <el-input type="textarea" v-model="form.desc"  placeholder="请输入取证设备备注信息"></el-input>
                </el-form-item>
                </el-col>
             </el-row>
         </el-form>
       </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addEvidenceDevice('evidenceform')">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
import Parse from "parse";
import Pumpdepartment from "@/components/resource/pumpdepartment";
import {returnLogin} from '@/utils/return'
export default {
  components: {
    Pumpdepartment
  },
  data() {
    const IPvalid=((rule, value, callback)=>{
      let reg =  /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
        if (!reg.test(value)) {
          callback(new Error("需要输入正确的IP地址"));
        } else {
          callback();
        }
      }) 
    return {
        formLabelWidth:'120px',
        dialogVisible:false,
        departmentid:'',
        formInline: {
          name:'',
          laboratory:'',
          evidencetype:''
        },
        //取证设备表格
         tableData: [],
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
        multipleSelection: [],
        pagesize:10,
        start:0,
        total:0,
        form: {
          name: '',
          devaddr:'',
          ip:'',
          mac:'',
          factory:'',
          trendsip:'',
          region: '',
          evidencetype:'',
          laboratory:'',
          product:'',
          target:'',
          evidenceuse:''
        },
        formrules: {
        name: [{ required: true, message: "请输入取证设备名称", trigger: "blur" }],
        devaddr: [
          { required: true, message: "请输入设备编号", trigger: "blur" }
        ],
        factory: [
          { required: true, message: "请输入设备生产厂家", trigger: "blur" }
        ],
        product: [
          { required: true, message: "请选择设备所属产品", trigger: "change" }
        ],
        trendsip: [
          { required: true, message: "请选择是否动态启用IP", trigger: "change" }
        ],
        evidencetype: [
          { required: true, message: "请选择设备分类", trigger: "change" }
        ],
        laboratory: [
          { required: true, message: "请选择设备所属实验室", trigger: "change" }
        ],
        target: [
          { required: true, message: "请选择仪器检测指标", trigger: "change" }
        ],
        ip: [
          { required: true, message: "请输入IP地址", trigger: "blur" },
          { validator: IPvalid, trigger: "blur" }
        ]
      },
        //弹窗关联的三个列表
        departmentlaboratory:[],
        testbedlist:[],
        productlist:[],
        devicesid:'',
        laboratoryname:''//实验室名称
    };
  },
  mounted() {
    this.getPumpDevices()
    this.getDepartmentLaboratory()
    this.getProductList()
  },
  methods: {
    getPumpDevices(start,department){
      if(start==0){
        this.start=0
      }
      var Devices = Parse.Object.extend('Devices')
        var devices = new Parse.Query(Devices)
        devices.equalTo('basedata.type','PUMP_EVIDENCE')
        if(this.formInline.laboratory!=''){
            devices.equalTo('basedata.laboratoryid',this.formInline.laboratory)
        }
        if(this.formInline.evidencetype!=''){
            devices.matches('basedata.evidencetype',this.formInline.evidencetype,'i')
        }
        if(this.formInline.name!=''){
         devices.matches('name',this.formInline.name,'i')
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
    getPumpNode(val) {
      console.log(val)
      this.departmentid = val.objectId;
      if(val.icon=='实验室'){
        this.formInline.laboratory = val.objectId
        this.getPumpDevices(0,this.departmentid)
      }
      
    },
    //表格多选
    handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //分页操作
    handleSizeChange(val) {
    this.pagesize=val
    this.getPumpDevices(1,this.departmentid)
    },
    handleCurrentChange(val) {
    this.start = (val-1)*this.pagesize
    this.getPumpDevices(1,this.departmentid)
    },
    getProductList(){
        var Product = Parse.Object.extend('Product')
        var product = new Parse.Query(Product)
        product.find().then(response=>{
            this.productlist = response
        },error=>{
            returnLogin(error)
        })
    },
    getDepartmentLaboratory(){
        var Department = Parse.Object.extend('Department')
        var department = new Parse.Query(Department)
        department.equalTo('org_type','实验室')
        department.find().then(resultes=>{
            this.departmentlaboratory = resultes
        },error=>{
            returnLogin(error)
        })
    },
    departmentChange(val) {
      this.departmentlaboratory.map(item=>{
          if(item.id==val){
              this.laboratoryname = item.attributes.name
          }
      })
    },
    //增加设备弹窗
    adddevices(){
        this.dialogVisible = true
        this.devicesid=''
       
    },
    //新增取证设备
    addEvidenceDevice(formName){
       this.$refs[formName].validate((valid) => {
        if (valid) {
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
            devices.set('desc',this.form.desc)
            devices.set('product',product)
            devices.set('ip',this.form.ip)
            devices.set('basedata',{
                 laboratoryid:this.form.laboratory,
                 laboratory:this.laboratoryname,
                 mac:this.form.mac,
                 target:this.form.target,
                 factory:this.form.factory,
                 trendsip:this.form.trendsip,
                 evidenceuse:this.form.evidenceuse,
                 evidencetype:this.form.evidencetype,
                 type:'PUMP_EVIDENCE'
            })
            devices.save().then(response=>{
                if(response){
                    console.log(response)
                    this.devicesid=''
                    this.$message.success('创建成功')
                    this.$refs[formName].resetFields()
                    this.dialogVisible = false
                    this.getPumpDevices(1,this.departmentid)
              }
                     
            })
        } else {
        this.$message.error('有必填项未填写')
        return false;
        }
    });
    },
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
            this.form.ip = response.attributes.ip
            this.form.trendsip = response.attributes.basedata.trendsip,
            this.form.mac = response.attributes.basedata.mac
            this.form.evidenceuse = response.attributes.basedata.evidenceuse
            this.form.evidencetype = response.attributes.basedata.evidencetype
            this.form.factory = response.attributes.basedata.factory
            this.form.target = response.attributes.basedata.target
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
    //多个设备删除
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
  }
};
</script>
<style lang="scss" scoped>
.evidencedevices {
  width: 100%;
  min-height: 875px;
  /* padding: 20px; */
  box-sizing: border-box;
  /* background: url("../../imgages/echartbanner1.png") no-repeat; */
  /* background-size: cover; */
  display: flex;
  /* overflow: scroll; */
  .devicesright{
      .tableblock{
          margin-top:20px;
      }
  }
  .pageblock{
      margin-top:20px;
  }
  /deep/ .el-dialog__body{
      /deep/ .el-select{
          width:100%;
      }
  }
  
    
}

</style>
<style>

</style>
