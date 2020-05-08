<template>
  <div class="testbedpump">
    <Pumpdepartment
      style="width:360px;height:100vh;overflow:scroll;flex-shrink:0;padding:10px;"
      @pumpDetail="getPumpNode"
    />
    <div style="width:calc(100% - 360px);padding:20px;">
      <div class="bedtop">
        <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
         
          <el-form-item label="检测台状态">
            <el-select v-model="formInline.state" placeholder="检测台状态">
              <el-option label="健康" value="healthy"></el-option>
              <el-option label="良好" value="fine"></el-option>
              <el-option label="一般" value="commonly"></el-option>
            </el-select>
          </el-form-item>
           <el-form-item label="所属实验室">
            <el-select v-model="formInline.laboratory" placeholder="所属实验室">
             <el-option v-for="(item,index) in departmentList" :label="item.attributes.name" :key="index" :value="item.id"></el-option>     
            </el-select>
          </el-form-item>
           <el-form-item label="检测台">
            <el-input v-model="formInline.name" placeholder="检测台"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getBedtable(departmentid)">查询</el-button>
            <el-button type="primary">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="addbed" style="text-align:right">
        <!-- <el-button type="success" size="small" @click="disposeTestbed">检测台配置</el-button> -->
        <el-button type="primary" @click="testBedAdd" size="small">新增检测台</el-button>
        <el-button type="danger" size="small" @click="deleteTestBed">删除检测台</el-button>
      </div>
      <div class="bedtable">
        <el-table :data="bedData" style="width: 100%;text-align:center" border ref="multipleTable" @selection-change="handleSelectionBed">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column prop="id" label="设备组编号" align="center" width="150"></el-table-column>
          <el-table-column label="检测台名称" align="center" width="200">
            <template slot-scope="scope">
              <span>{{scope.row.attributes.name}}</span>
            </template>
          </el-table-column>
          <el-table-column label="企业名称" align="center" width="150">
           
          </el-table-column>
           <el-table-column label="所属实验室" align="center" width="150">
           <template slot-scope="scope">
             <span v-if="scope.row.attributes.department">{{scope.row.attributes.department.attributes.name}}</span>
           </template>
          </el-table-column>
          <el-table-column label="检测台编号" align="center" width="150">
           <template slot-scope="scope">
             <span v-if="scope.row.attributes.number">{{scope.row.attributes.number}}</span>
             <span v-else></span>
           </template>
          </el-table-column>
          <el-table-column label="检测台型号" align="center" width="150">
            <template slot-scope="scope">
             <span v-if="scope.row.attributes.model">{{scope.row.attributes.model}}</span>
             <span v-else></span>
           </template>
          </el-table-column>
          <el-table-column label="生产厂家" align="center" width="200">
            <template slot-scope="scope">
             <span v-if="scope.row.attributes.factory">{{scope.row.attributes.factory}}</span>
             <span v-else></span>
           </template>
          </el-table-column>
          <el-table-column label="健康状况" align="center">
            <template slot-scope="scope">
             <span v-if="scope.row.attributes.state=='healthy'">健康</span>
             <span v-else-if="scope.row.attributes.state=='fine'">良好</span>
             <span v-else-if="scope.row.attributes.state=='commonly'">一般</span>
           </template>
          </el-table-column>
          <el-table-column label="关联实验仪器" align="center" width="200">
           
          </el-table-column>
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.attributes.status=='init'" style="color:green">运行中</span>
            </template>
          </el-table-column>
          <el-table-column label="编辑" align="center" width="300">
            <template slot-scope="scope">
              <!-- <el-button size="mini" type="primary" @click="handleEdit(scope.row.id)">配 置</el-button> -->
              <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">撤 销</el-button>
              <el-button size="mini" type="success" @click="devicesDetail(scope.row)">查看设备</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--分页-->
      <div class="block" style="margin-top:20px;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[1,5,10]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
      <!--新增，编辑测试台体弹窗-->
      <div class="addbeddialog">
        <el-dialog title="新增测试台体" :visible.sync="beddialog">
          <div style="margin-bottom:20px;">
            <label for>测试台名称:</label>
            <el-input style="width:200px" v-model="testbedname"></el-input>
          </div>
          <div class="devicecompany">
            <el-form :model="devicelist" :inline="true">
              <el-form-item label="检测单位:">
                <el-select v-model="devicelist.departmentid" @change="selectCompany">
                 <el-option v-for="(item,index) in departmentlist" :key="index" :label="item.attributes.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="检测单位:">
                <el-select v-model="devicelist.testbedid">
                 <el-option v-for="(item,index) in testbedlist" :key="index" :label="item.attributes.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <el-table
            :data="devicesData"
            @selection-change="handleSelectionChange"
            ref="multipleTable"
            style="width:100%;text-align:center"
            border
          >
            <el-table-column type="selection" align="center" width="100"></el-table-column>
            <el-table-column label="设备类别" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.attributes.basedata.type=='DTU'">控制器</span>
                <span v-else-if="scope.row.attributes.basedata.type=='PC'">控制台</span>
                <span v-else>摄像头</span>
              </template>
            </el-table-column>
            <el-table-column label="设备编号" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.attributes.devaddr}}</span>
              </template>
            </el-table-column>
            <el-table-column label="当前状态" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.attributes.basedata.status=='offline'" style="color:red">离线</span>
                <span v-if="scope.row.attributes.basedata.status=='ready'" style="color:green">在线</span>
              </template>
            </el-table-column>
          </el-table>
           <div class="block" style="margin-top:20px;">
            <el-pagination
              @size-change="handleDeviceSizeChange"
              @current-change="handleDeviceCurrentChange"
              :page-sizes="[10,20,50]"
              :page-size="devicepagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="devicetotal"
            ></el-pagination>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="beddialog = false">取 消</el-button>
            <el-button type="primary" @click="addtestbed(testbedid)">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
     <el-dialog :title="testbedname+'的设备'" :visible.sync="bedDevicedialog" width="80%">
          <el-card class="box-card">
            <div class="deviceheader">
              <div class="headerone">
                网关设备
              </div>
              <div class="headertwo">
                网络层级:2
              </div>
              <div class="headerthree">
                网关编号:11223334455
              </div>
              <div class="headerfourth">
               网关状态:<el-switch
                    v-model="gatewaystatus"
                    active-color="#13ce66"
                    inactive-color="#cccccc">
                  </el-switch>
              </div>
            </div>
              <el-table
                :data="bedDevicesData"
                ref="multipleTable"
                style="width:100%;text-align:center;margin-top:20px;"
                border
              >
                
                <el-table-column label="设备类别" align="center">
                  <template slot-scope="scope">
                    <span>{{scope.row.attributes.name}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="网络设备编号" align="center">
                  <template slot-scope="scope">
                    <span>{{scope.row.attributes.devaddr}}</span>
                  </template>
                </el-table-column>
                 <el-table-column label="设备厂商" align="center">
                  <template slot-scope="scope">
                    <span>{{scope.row.attributes.basedata.factory}}</span>
                  </template>
                </el-table-column>
                 <el-table-column label="通信协议" align="center">
                  <template slot-scope="scope">
                    <span>{{scope.row.attributes.basedata.agreement}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="网络层级" align="center">
                 
                </el-table-column>

                <el-table-column label="设备状态" align="center">
                  <template slot-scope="scope">
                    <span v-if="scope.row.attributes.basedata.status=='offline'" style="color:red">离线</span>
                    <span v-if="scope.row.attributes.basedata.status=='ready'" style="color:green">在线</span>
                  </template>
                </el-table-column>
                 <el-table-column label="投运时间" align="center">
                 
                </el-table-column>
                 <el-table-column label="操作" align="center">
                 
                </el-table-column>
              </el-table>
          </el-card>
           <el-card class="box-card">
            <div class="devicetwo">
              <div class="devicetwoone">
                传感器
              </div>
              <div class="devicetwotwo">
                传感器数量:6
              </div>
              <div class="devicetwothree">
                在线设备:10
              </div>
              <div class="devicetwofourth">
               故障设备:2
              </div>
            </div>
             <el-table
                :data="bedDevicesData"
                @selection-change="deviceSelect"
                ref="multipleTable1"
                style="width:100%;text-align:center;margin-top:20px;"
              >
              <el-table-column
                  type="selection"
                  width="55">
                </el-table-column>
                <el-table-column label="传感器名称" align="center">
                  <template slot-scope="scope">
                    <span>{{scope.row.attributes.name}}</span>
                    
                  </template>
                </el-table-column>
                <el-table-column label="传感器编码" align="center">
                  <template slot-scope="scope">
                    <span>{{scope.row.attributes.devaddr}}</span>
                  </template>
                </el-table-column>
                 <el-table-column label="设备厂家" align="center">
                 
                </el-table-column>
                <el-table-column label="设备型号" align="center">
                 
                </el-table-column>
                 <el-table-column label="设备协议" align="center">
                 
                </el-table-column>
                <el-table-column label="网络层级" align="center">
                 
                </el-table-column>
                <el-table-column label="内网编号" align="center">
                 
                </el-table-column>
                <el-table-column label="最新采集时间" align="center">
                 
                </el-table-column>
                <el-table-column label="当前状态" align="center">
                  <template slot-scope="scope">
                    <span v-if="scope.row.attributes.basedata.status=='offline'" style="color:red">离线</span>
                    <span v-if="scope.row.attributes.basedata.status=='ready'" style="color:green">在线</span>
                  </template>
                </el-table-column>
              </el-table>
          </el-card>
          <span slot="footer" class="dialog-footer">
            <el-button @click="bedDevicedialog = false">取 消</el-button>
            <el-button type="primary" @click="bedDevicedialog = false">确 定</el-button>
          </span>
        </el-dialog>
      <!--新增检测台体弹窗-->
      <el-dialog
        title="测试台新增"
        :visible.sync="addbeddialog1"
        width="50%"
        >
        <div>
          <el-form :model="addbedForm" :rules="addbedFormrule" ref="addbedForm" label-width="100px" class="demo-ruleForm">
            <el-row>
              <el-col :span="12">
                <div class="grid-content bg-purple">
                   <el-form-item label="测试台名称" prop="name">
                    <el-input v-model="addbedForm.name"></el-input>
                  </el-form-item>
                   <el-form-item label="测试台编号">
                    <el-input v-model="addbedForm.number"></el-input>
                  </el-form-item>
                   <el-form-item label="生产厂家">
                    <el-input v-model="addbedForm.factory"></el-input>
                  </el-form-item>
                   <el-form-item label="控制台信息" required>
                      <img v-if="addbedForm.imgsrc" :src="addbedForm.imgsrc" class="avatar" />

                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
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
                  </el-form-item>
                  
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple-light">
                   <el-form-item label="网关选择" prop="product">
                    <el-select v-model="addbedForm.product" placeholder="请选择台体所属网关">
                      <el-option v-for="(item,index) in productlist" :label="item.name" :key="index" :value="item.objectId"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="所属实验室" prop="laboratory">
                    <el-select v-model="addbedForm.laboratory" placeholder="请选择所属实验室">
                      <el-option v-for="(item,index) in departmentList" :label="item.attributes.name" :key="index" :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="测试台型号">
                    <el-input v-model="addbedForm.model"></el-input>
                  </el-form-item>
                  <el-form-item label="测试台状况" prop="state">
                    <el-select v-model="addbedForm.state" placeholder="请选择测试台状况">
                      <el-option label="健康" value="healthy"></el-option>
                      <el-option label="良好" value="fine"></el-option>
                      <el-option label="一般" value="commonly"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="备注信息">
                    <el-input type="textarea" v-model="addbedForm.desc" :rows="4"></el-input>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
             <el-divider content-position="left">计算机配置</el-divider>
           <el-row>
             <el-col :span="12">
               <el-form-item label="计算机名称">
                 <el-select v-model="addbedForm.computername" placeholder="请选择计算机名称">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                  </el-select>
               </el-form-item>
             </el-col>
             <el-col :span="12">
               <el-form-item label="计算机key">
                 <el-select v-model="addbedForm.computerkey" placeholder="请选择计算机key">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                  </el-select>
               </el-form-item>
             </el-col>
           </el-row>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addbeddialog1 = false">取 消</el-button>
          <el-button type="primary" @click="Determine('addbedForm')">确 定</el-button>
        </span>
      </el-dialog>
      <!--检测台配置-->
      <el-dialog
        title="提示"
        :visible.sync="disposeVisible"
        width="50%"
        >
         <div>
            <el-form :inline="true" :model="bedForm" class="demo-form-inline" size="small">
            <el-form-item>
              <el-input v-model="bedForm.name" placeholder="请输入测试台名称搜索"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getAllBed">搜 索</el-button>
            </el-form-item>
          </el-form>
          </div>
        <div class="dispose" style="display:flex;">
         
         <el-card class="box-card" style="width:45%;height:300px;overflow-y:scroll">
            <div slot="header" class="clearfix">
              <span>测试台体</span>
              <el-button style="float: right; padding: 3px 0" type="text" @click="clearUBed">清空</el-button>
            </div>
            <div v-for="(item,index) in alltestbed" :key="index" class="text item">
              <el-radio v-model="updatedId" :label="item.id">{{item.attributes.name}}</el-radio>
            </div>
          </el-card>
          <div style="margin:0 20px;text-align:center;">
            <!-- <span>关联</span> -->
             <span class="svg-container" style="line-height:300px;">
            <svg-icon icon-class="relation"  style="width:3rem;height:3rem;"/>
           </span>
           
          </div>
         <el-card class="box-card" style="width:45%;height:300px;overflow-y:scroll">
            <div slot="header" class="clearfix">
              <span>实验仪器</span>
              <el-button style="float: right; padding: 3px 0" type="text" @click="handleCheckAllChange">全选</el-button>
              <el-button style="float: right; padding: 3px 0" type="text" @click="clearUpDevice">清空</el-button>
            </div>
            <!-- <div v-for="(item,index) in allpumpdevice" :key="index" class="text item"> -->
              <el-checkbox-group v-model="checkdevice" @change="handleCheckedCitiesChange">
                <!-- <div> -->
                <el-checkbox v-for="(item,index) in allpumpdevice" :label="item.id" :key="index" style="display:block">{{item.attributes.devaddr}}</el-checkbox>
                <!-- </div> -->
              </el-checkbox-group>
              <!-- {{item.attributes.devaddr}} -->
            <!-- </div> -->
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
import {returnLogin} from '@/utils/return'
import Cookies from 'js-cookie';
import $ from 'jquery'
export default {
  components: {
    Pumpdepartment
  },
  data() {
    return {
      testbedSelection:[],//检测台体多选
      disposeVisible:false,
      addbedForm: {
          name: '',//名称
          state:'',//测试台状况
          laboratory: '',//所属实验室
          factory:'',//生产厂家
          number:'', //编号
          imgsrc:'',
          desc:'',
          product:'',//网关
          computername:'',//计算机名称
          computerkey:'',//计算机key
          model:''//测试台型号
        },
      addbedFormrule:{
        name: [
            { required: true, message: '请输入测试台名称', trigger: 'blur' },
          ],
        laboratory: [
          { required: true, message: '请选择所属实验室', trigger: 'change' }
        ],
        state: [
          { required: true, message: '请选择测试台状况', trigger: 'change' }
        ],
         product: [
          { required: true, message: '请选择测试台网关', trigger: 'change' }
        ],
      },
      addbeddialog1:false,
      formInline:{
        laboratory:'',
        name:'',
        state:''
      },
      gatewaystatus:false,
      bedData: [],
      devicesData: [],
      beddialog: false,
      multipleSelection: [],
      testbedname: "",
      testbedid: "",
      testbeddevices: [],
      origindevices: [],
      pagesize: 10,
      total: 0,
      start: 0,
      devicelist: {
        departmentid: "",
        testbedid:''
      },
      departmentid: "",
      devicesstart:0,
      bedDevicedialog:false,
      devicepagesize:10,
      devicestart:0,
      devicetotal:0,
      bedDevicesData:[],
      multipleTable1:[],
      departmentlist:[],
      testbedlist:[],
      departmentList:[],
      alltestbed:[],
      allpumpdevice:[],
      updatedId:'',
      checkdevice:[],//选择设备
      bedForm:{
        name:''
      },
      productlist:[]
    };
  },
  mounted() {
    this.getBedtable();
    this.getDepartmentList()
    this.getAllBed()
    this.getProduct()
  },
  methods: {
    getProduct(){
      $.ajax({
        type: 'GET',
        contentType:'application/json',
        dataType:'json',
        headers:{
          "sessionToken":Cookies.get('access_token')
        },
        url: Cookies.get('apiserver')+'/classes/Device',
        success:(response)=>{
          if(response){
           this.productlist = response.results
          }
        }
      })
    },
    getAllBed(){
       var Testbed = Parse.Object.extend("Testbed");
       var testbed = new Parse.Query(Testbed);
        testbed.ascending(['-createdAt','name'])
       testbed.limit(1000)
       if(this.bedForm.name!=''){
         testbed.matches('name',this.bedForm.name,'i')
       }
       testbed.find().then(response=>{
         this.alltestbed = response
       },error=>{
         returnLogin(error)
       })
    },
    getAllPumpDevice(){
       var PumpDevice = Parse.Object.extend("PumpDevice");
       var devices = new Parse.Query(PumpDevice);
        devices.equalTo("basedata.type", "PUMP_DTU");
        devices.ascending("createdAt");
       devices.limit(1000)
       devices.find().then(resultes=>{
         this.allpumpdevice = resultes
       },error=>{
         returnLogin(error)
       })
    },
   
    //设备选择事件
      handleCheckedCitiesChange(val){
        console.log(val)
      },
      //清空bed按钮
      clearUBed(){
        this.updatedId = ''
      },
      //全选按钮
       handleCheckAllChange(val) {
        this.allpumpdevice.map(item=>{
          this.checkdevice.push(item.id)
        })
      },
    //打开新增测试台弹窗
    testBedAdd(){
      this.addbeddialog1 = true
    },
    //清空全部选择设备
    clearUpDevice(){
      this.checkdevice=[]
    },
    //关联设备
    addTestRelation(){
       var Testbed = Parse.Object.extend("Testbed");
       var testbed = new Testbed();
       var Dev = Parse.Object.extend("PumpDevice");
       var devices = new Dev();
       if(this.updatedId!=''){
         testbed.id = this.updatedId
         var relation = testbed.relation('devices')
         this.checkdevice.map(item=>{
           devices.set('objectId',item)
           relation.add(devices)
         })
         testbed.save().then(res=>{
           if(res){
             this.$message.success('设备关联成功')
             this.disposeVisible = false
             this.checkdevice = []
             this.updatedId = ''
             this.getBedtable(this.departmentid)
           }
         },error=>{
           returnLogin(error)
         })
       }
    },
    //得到组织树
    getDepartmentList(){
      var Department = Parse.Object.extend('PumpDepartment')
      var department = new Parse.Query(Department)
      department.equalTo('org_type','实验室')
      department.find().then(response=>{
        this.departmentList = response
      },error=>{
        returnLogin(error)
      })
    },
    //添加测试台体
      Determine(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.addbedForm.imgsrc==''){
              this.$message.error('请上传测试台信息')
               return
            }
            var Testbed = Parse.Object.extend("Testbed");
            var testbed = new Testbed();
            var Department = Parse.Object.extend("PumpDepartment");
            var department = new Department();
            department.id = this.addbedForm.laboratory;
            testbed.set("department", department);
            testbed.set('status','init')
            testbed.set('name',this.addbedForm.name)
            testbed.set('model',this.addbedForm.model)
            testbed.set('number',this.addbedForm.number)
            testbed.set('factory',this.addbedForm.factory)
            testbed.set('state',this.addbedForm.state)
            testbed.set('imgsrc',this.addbedForm.imgsrc)
            testbed.set('deviceaddr',this.addbedForm.product)
            testbed.save().then(resultes=>{
              if(resultes){
                this.$message.success('测试台体新增成功')
                this.$refs[formName].resetFields();
                this.addbeddialog1 = false
                this.getBedtable(this.departmentid)
              }
            },error=>{
              returnLogin(error)
            })
            
          } else {
            this.$message.error('有必填项未填写')
            return false;
          }
        });
      },
    //测试台图片
     upload(event) {
      if (event) {
        var file = event.target.files[0]; //name: "dangqi1.png" || type: "image/png"
        var name = file.name;
        var testmsg = event.target.files[0].type;
        var type = file.type.split("/")[0];
        var extension =   testmsg === "image/jpeg" ||
        testmsg === "image/JPEG" ||
        testmsg === "image/png" ||
        testmsg === "image/PNG" ||
        testmsg === "image/bpm" ||
        testmsg === "image/BPM";
        if (!extension) {
          //将图片img转化为base64
          this.$message({
            message: "只能上传图片文件",
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
      formdata.append("output", 'json')
      formdata.append("path",Cookies.get('appids'))
       formdata.append("scene",Cookies.get('appids'))
      formdata.append("auth_token", Cookies.get('access_token')) //下面是要传递的参数
      //此处必须设置为  multipart/form-data
      let config = {
        headers: {
          "Content-Type": "multipart/form-data" //之前说的以表单传数据的格式来传递fromdata
        }
      };
      this.$http
        .post(Cookies.get('fileserver'), formdata)
        .then(res => {
          if (res) {
            this.addbedForm.imgsrc = res.body.url;
          }
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
    getPumpNode(val) {
      
      this.departmentid = val.objectId;
      this.getBedtable(this.departmentid)
    },
    devicesDetail(row){
      this.testbedid =row.id
      this.bedDevicedialog=true
      this.testbedname = row.attributes.name
      var Testbed = Parse.Object.extend("Testbed");
      var testbed = new Testbed();
      testbed.id = row.id
      var relation = testbed.relation("devices");
      var query = relation.query()
      query.find().then(resultes=>{
        console.log(resultes)
        this.bedDevicesData=resultes
      })        
    },
    // addrelation1() {
    //   var arr1 = [];
    //   var arr = this.bedData.slice(0, 5);
    //   arr.map(item => {
    //     arr1.push(
    //       new Promise((resolve, reject) => {
    //         var Testbed = Parse.Object.extend("Testbed");
    //         var testbed = new Testbed();
    //         var Department = Parse.Object.extend("Department");
    //         var department = new Department();
    //         department.id = this.departmentid;
    //         testbed.id = item.id;
    //         testbed.set("department", department);
    //         return testbed.save().then(
    //           resultes => {
    //             if (resultes) {
    //               resolve(resultes);
    //             }
    //           },
    //           error => {
    //             reject(resultes);
    //           }
    //         );
    //       })
    //     );
    //   });
    //   Promise.all(arr1)
    //     .then(data => {})
    //     .catch(error => {});
    // },
    // addrelation2() {
    //   var arr1 = [];
    //   var arr = this.bedData.slice(5, 10);
    //   arr.map(item => {
    //     arr1.push(
    //       new Promise((resolve, reject) => {
    //         var Testbed = Parse.Object.extend("Testbed");
    //         var testbed = new Testbed();
    //         var Department = Parse.Object.extend("Department");
    //         var department = new Department();
    //         department.id = this.departmentid;
    //         testbed.id = item.id;
    //         testbed.set("department", department);
    //         return testbed.save().then(
    //           resultes => {
    //             if (resultes) {
    //               resolve(resultes);
    //             }
    //           },
    //           error => {
    //             reject(resultes);
    //           }
    //         );
    //       })
    //     );
    //   });
    //   Promise.all(arr1)
    //     .then(data => {})
    //     .catch(error => {});
    // },
     disposeTestbed(){
      this.disposeVisible = true
     
    },
    //编辑测试台体
    handleEdit(id) {
      this.testbedid = id;
      // this.beddialog = true;
      this.disposeVisible = true
      var Testbed = Parse.Object.extend("Testbed");
      var query = new Parse.Query(Testbed);
      var Devices = Parse.Object.extend("PumpDevice");
      var devices = new Parse.Query(Devices);
      this.updatedId = id
      query.get(id).then(results => {
        var relation = results.relation("devices");
        var query = relation.query();
        devices.equalTo("basedata.type", "PUMP_DTU");
        devices.ascending("createdAt");
        this.devicesData = devices;
        query.find().then(beddevices => {
          beddevices.map(item=>{
            this.checkdevice.push(item.id)
          })
        })
      }),
        error => {
          console.log(error);
        };
    },
    //检测单位选择
    selectCompany(value){
      this.devicelist.testbedid = ''
       var Department = Parse.Object.extend('PumpDepartment')
       var department = new Parse.Query(Department)
       department.equalTo('ParentId',value)
       department.find().then(resultes=>{
         this.testbedlist = resultes
       })
    },
    deviceSelect(val){
      this.multipleTable1 = val
    },
    handleDeviceSizeChange(val){
      this.devicepagesize = val
      if(this.testbedid!=''){
         this.handleEdit(this.testbedid)
      }else{
        this.addTest()
      }
     
    },
    handleDeviceCurrentChange(val){
      this.devicestart=(val-1)*this.devicepagesize
       if(this.testbedid!=''){
         this.handleEdit(this.testbedid)
      }else{
        this.addTest()
      }
    },
    //删除测试台体
    handleDelete(id) {
      this.$confirm("此操作将永久删除当前测试台体, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var Testbed = Parse.Object.extend("Testbed");
          var query = new Parse.Query(Testbed);
          query.get(id).then(object => {
            object.destroy().then(response => {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getBedtable(this.departmentid);
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //初始化测试台体
    getBedtable(departmentid) {
      var Testbed = Parse.Object.extend("Testbed");
      var query = new Parse.Query(Testbed);
      query.limit(this.pagesize);
      query.skip(this.start);
      query.ascending(['-createdAt','name'])
      if(departmentid){
        query.equalTo("department",departmentid)
      }
      if(this.formInline.state!=''){
        query.equalTo('state',this.formInline.state)
      }
      if(this.formInline.name!=''){
        query.equalTo('name',this.formInline.name)
      }
      if(this.formInline.laboratory){
        query.equalTo("department",this.formInline.laboratory)
      }
      query.count().then(total => {
        this.total = total;
        query.find().then(results => {
          this.bedData = results;
        }),
          error => {
            console.log(error);
          };
      });
    },
    addTest() {
      this.testbedid = ''
      this.beddialog = true;
      var Devices= Parse.Object.extend("PumpDevice");
      var devices = new Parse.Query(Devices);
      devices.equalTo("basedat.type", "PUMP_DTU");
      devices.skip(this.devicestart)
      devices.limit(this.devicepagesize)
      devices.count().then(count=>{
        this.devicetotal = count
         devices.find().then(resultes => {
          this.devicesData = resultes;
          },
            error => {
              console.log(error);
          })
        })
        var Department = Parse.Object.extend('PumpDepartment')
        var department = new Parse.Query(Department)
        department.equalTo('org_type','泵单位')
        department.find().then(resultes=>{
          this.departmentlist = resultes
        })
    },
    //检测台体多选
     handleSelectionBed(val) {
      this.testbedSelection = val;
    },
    //删除多个测试台体
    deleteTestBed(){
       var arr = [];
      if (this.testbedSelection.length != 0) {
           this.$confirm('此操作将永久删除选中检测台体, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.testbedSelection.map(item => {
            arr.push(
                new Promise((resolve, reject) => {
                var Testbed = Parse.Object.extend("Testbed");
                var testbed = new Testbed();
                testbed.id = item.id;
                return testbed.destroy().then(
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
                if (data.length == this.testbedSelection.length) {
                    this.getBedtable(this.departmentid)
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
        this.$message.warning("请勾选要删除的检测台体");
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = [];
      val.map(items => {
        this.multipleSelection.push(items.id);
      });
    },
    addtestbed(id) {
      if (id == "") {
        var Testbed = Parse.Object.extend("Testbed");
        var testbed = new Testbed();
        testbed.set("name", this.testbedname);
        testbed.set("status", "init");
        var relation = testbed.relation("devices");
        var Dev = Parse.Object.extend("PumpDevice");
        var devices = new Dev();
        var Department = Parse.Object.extend('PumpDepartment')
        var department = new Department()
        department.id = this.devicelist.testbedid
        testbed.set('department',department)
        this.multipleSelection.map(item => {
          devices.set("objectId", item);
          relation.add(devices);
        });
        testbed.save().then(resultes => {
          this.$message({
            message: "添加成功",
            type: "success"
          });
          this.beddialog = false;
          this.getBedtable(this.departmentid);
          this.testbedname=''
        });
      } else {
        var Testbed = Parse.Object.extend("Testbed");
        var testbed = new Parse.Query(Testbed);
        testbed.get(id).then(resultes => {
          resultes.set("name", this.testbedname);
          var relation = resultes.relation("devices");
          var Dev = Parse.Object.extend("PumpDevice");
          var devices = new Dev();
           var Department = Parse.Object.extend('PumpDepartment')
        var department = new Department()
        department.id = this.devicelist.testbedid
        testbed.set('department',department)
          this.multipleSelection.map(items => {
            if (!this.testbeddevices.includes(items)) {
              devices.set("objectId", items);
              relation.add(devices);
            }
            this.testbeddevices.map(item => {
              if (!this.multipleSelection.includes(item)) {
                devices.set("objectId", item);
                relation.remove(devices);
              }
            });
            
          });
          resultes.save().then(resulte => {
            this.$message({
              message: "修改成功",
              type: "success"
            });
            this.beddialog = false;
            this.getBedtable(this.departmentid);
          });
        });
      }
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.getBedtable(this.departmentid);
    },
    handleCurrentChange(val) {
      this.start = Number(val - 1) * Number(this.pagesize);
      this.getBedtable(this.departmentid);
    }
  }
};
</script>
<style lang="scss" scoped>
.testbedpump {
  width: 100%;
  min-height: 875px;
  /* padding: 20px; */
  box-sizing: border-box;
  /* background: url("../../imgages/echartbanner1.png") no-repeat; */
  /* background-size: cover; */
  display: flex;
  /* overflow: scroll; */
      .bedtable {
      margin-top: 20px;
    }
    /deep/ .deviceheader{
       height:60px;
      width:100%;
      background:green;
      display: flex;
      padding:10px;
      div{
        height:40px;
        line-height:40px;
        text-align:center;
        margin:0 auto;
      }
      .headerone{
        width:100px;
        background:#409EFF;
        color:white;
      }
      .headertwo{
        width:100px;
        background:#909399;
      }
      .headerthree{
        width:200px;
        background:#67C23A;
      }
      .headerfourth{
        color:white;
      }
    }
    /deep/ .devicetwo{
        height:60px;
        width:100%;
        background:#0066CC;
        display: flex;
        padding:10px;
        div{
        height:40px;
        line-height:40px;
        text-align:center;
        margin:0 auto;
      }
      .devicetwoone{
        width:100px;
        background:#409EFF;
        color:white;
      }
      .devicetwotwo{
        width:100px;
        background:#67C23A;
      }
      .devicetwothree{
        width:200px;
        color:white;
      }
      .devicetwofourth{
        color:red;
      }
    }
     /deep/ .el-select {
          width: 100%;
        }
        /deep/ .el-checkbox-group{
            .el-checkbox__label{
              line-height:2
            }
          }
        
}

</style>
<style>
.testbedpump .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.testbedpump.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.testbedpump .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 250px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  border:1px dashed #cccccc;
}
.testbedpump .avatar {
  width:250px;
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
.testbedpump .text {
    font-size: 14px;
  }

 .testbedpump  .item {
    margin-bottom: 18px;
  }

  .testbedpump .clearfix:before,
  .testbedpump .clearfix:after {
    display: table;
    content: "";
  }
  .testbedpump .clearfix:after {
    clear: both
  }
.testbedpump .el-divider__text.is-left{
  font-size:16px;
}
@media screen and (max-width: 1350px) {
  .testbedpump .el-col {
  width: 100%;
  }
}
</style>
