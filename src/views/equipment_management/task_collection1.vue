<template>
  <div class="task_collection">
    <div class="top">
      <div class="left">
        <el-button type="primary" @click="dialogVisible = true">{{$t('task.Configurationtask')}}</el-button>
        <el-button type="primary" style="margin-left:30px" @click="deletetask">{{$t('developer.delete')}}</el-button>
      </div>
      <div class="right">
        <el-input
          type="text"
          style="width:200px;margin-left:30px;"
          :placeholder="$t('task.pleaseentertaskname')"
          v-model="valueforsearch"
          clearable
        ></el-input>
        <el-button type="primary" @click="search">{{$t('developer.search')}}</el-button>
      </div>
    </div>
    <div class="center">
      <el-table
        ref="multipleTable"
        :data="tableData3"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        v-loading="loading"
      >
        <el-table-column type="selection" width="55"></el-table-column>
       <el-table-column :label="$t('task.Taskname')">
          <template slot-scope="scope">
            <span>{{scope.row.attributes.name}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('task.Starttime')">
          <template slot-scope="scope">
            <span>{{timestampToTime(scope.row.attributes.args.starttime)}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('task.DataID')">
          <template slot-scope="scope">
            <span>{{scope.row.attributes.args.dis.join(',')}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('task.Cycleunit')">
          <template slot-scope="scope">
            <span>{{scope.row.attributes.args.freq}}</span>
            <span v-if="scope.row.attributes.args.unit=='day'">{{$t('task.Day')}}</span>
            <span v-else-if="scope.row.attributes.args.unit=='minute'">{{$t('task.Minute')}}</span>
            <span v-else-if="scope.row.attributes.args.unit=='hour'">{{$t('task.Hour')}}</span>
            <span v-else-if="scope.row.attributes.args.unit=='month'">{{$t('task.month')}}</span>
          </template>
        </el-table-column>
          <el-table-column label="上报通道">
          <template slot-scope="scope">
            <span >{{channelResorceMap(scope.row.attributes.args.upchannel)}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('task.Sendchannel')">
          <template slot-scope="scope">
            <span >{{channelMap(scope.row.attributes.args.downchannel)}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('task.Operation')">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="editcrond(scope.row.id)">{{$t('task.Edit')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 25, 50, 100]"
        :page-size="length"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        style="margin-top:30px;"
      ></el-pagination>
    </div>
    <!--弹窗-->
    <el-dialog
      :title="$t('task.Configuretask')"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
      :close-on-click-modal="false"
      top="5vh"
    >
      <div class="dialog">
        <el-form ref="taskform" :model="taskform" label-width="120px" :rules="taskformrules">
          <el-form-item label="工程名称" prop="project">
            <el-select v-model="taskform.project" placeholder="请选择工程" @change="projectSelect">
              <el-option
                v-for="item in projectlist"
                :key="item.id"
                :label="item.attributes.title"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('task.productname')" prop="product">
            <el-select v-model="taskform.product" :placeholder="$t('task.Select')" @change="getProduct">
              <el-option
                v-for="item in productlist"
                :key="item.id"
                :label="item.attributes.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('task.Taskname')" prop="name">
            <el-input type="text" v-model="taskform.name" :placeholder="$t('task.pleaseentertaskname')"></el-input>
          </el-form-item>
          <!--采集开始时间-->
          <el-form-item :label="$t('task.Starttime')" prop="starttime">
            <el-date-picker
              v-model="taskform.starttime"
              type="datetime"
              :placeholder="$t('task.Selectstarttime')"
              @change="testdata"
              :picker-options="pickerOptionsStart"
            ></el-date-picker>
          </el-form-item>
          <!--采集间隔时间-->
          <el-form-item :label="$t('task.Collectioninterval')" required>
            <el-col :span="11">
              <el-form-item prop="unit">
                <el-select v-model="taskform.unit" :placeholder="$t('task.Select')" @change="selectchange">
                  <el-option
                    v-for="item in date"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-form-item prop="freq">
                <el-select v-model="taskform.freq" :placeholder="$t('task.Select')">
                  <el-option
                    v-for="item in spacing"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option> 
                </el-select>
              </el-form-item>
            </el-col>
          </el-form-item>
           <el-form-item :label="$t('task.Endtime')" prop="endtime">
            <el-date-picker
              v-model="taskform.endtime"
              type="datetime"
              :placeholder="$t('task.Selectendtime')"
              @change="enddata"
              :picker-options="pickerOptionsEnd"
            ></el-date-picker>
          </el-form-item>
          <!--冻结日期-->
          <el-form-item :label="$t('task.Frozendate')">
            <el-date-picker
              v-model="taskform.frozendate"
              type="date"
              :placeholder="$t('task.Currentday')"
              value-format="timestamp"
            ></el-date-picker>
          </el-form-item>
          <!--上报通道-->
          <el-form-item :label="$t('task.Reportchannel')" prop="upchannel">
            <el-select v-model="taskform.upchannel" :placeholder="$t('task.Multiplereportingchannelsareallowed')" multiple>
                <el-option v-for="(item,index) in resourcechannelData" :key="index" :label="item.attributes.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <!--采集策略-->
          <el-form-item :label="$t('task.Collectionpolicy')" class="lineone" label-width="100px">
            <div class="flexg" v-for="(item, index) in taskform.downchannel" :key="index">
              <el-form-item
                :label="$t('task.Rotation')+(index+1)"
                class="elformcontent"
                label-width="60px"
                :prop="'downchannel.'+index+'.type'"
                :rules="[{required: true, message: '选择通道类型',trigger: 'change'}]"
              >
                <el-select v-model="item.type" :placeholder="$t('task.Selectchannel')">
                  <el-option
                    v-for="item in channelData"
                    :key="item.id"
                    :label="item.attributes.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                :prop="'downchannel.'+index+'.interval'"
                :rules="[{required: true, message: '输入时长',type:'number'}]"
              >
                <el-input v-model.number="item.interval" type="number" :min="1" placeholder="本轮时长"></el-input>
              </el-form-item>
              <el-form-item>
                <el-select v-model="item.unit" >
                  <el-option :label="$t('task.Hour')" value="hours"></el-option>
                  <el-option :label="$t('task.Minute')" value="minutes"></el-option>
                  <el-option :label="$t('task.Seconds')" value="seconds"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-link
                  type="primary"
                  @click.prevent="removeDomain1(item)"
                  :underline="false"
                  icon="el-icon-minus"
                >{{$t('developer.delete')}}</el-link>
              </el-form-item>
            </div>
          </el-form-item>
          <div style="width: 100%;margin-left: 50px">
            <el-link
              @click="addDomain1"
              icon="el-icon-plus"
              type="primary"
              :underline="false"
            >{{$t('task.Add')}}</el-link>
          </div>
           <el-form-item class="lineone"  label-width="20px" required>
             <div class="flexg">
                <el-form-item label="设备总数" prop="meteraddress" label-width="100px">
                <el-input type="text" v-model="taskform.meteraddress" placeholder="all代表全部,数字代表数据大小" @change="inputChange"></el-input>
                <p style="color:black;margin:0;position:absolute;top:25px">(all代表全部)</p>
                    </el-form-item>
                    <el-form-item label="起始页码" label-width="80px" v-if="taskform.meteraddress!='all'"
                     prop="pageindex"
                    :rules="[{required:true,message:'请输入长度',tigger:'blur',type:'number'}]"
                    >
                     <el-input type="text" v-model.number="taskform.pageindex"></el-input>
                      
                    </el-form-item>
                    <el-form-item label="每页设备数" label-width="100px" v-if="taskform.meteraddress!='all'"
                     prop="pagesize"
                    :rules="[{required:true,message:'请输入页数大小',tigger:'blur',type:'number'}]"
                    >
                        <el-input type="text" v-model.number="taskform.pagesize"></el-input>
                    </el-form-item>
                    </div>
                </el-form-item>
                <el-form-item label="操作指令" prop="operation">
                   <el-input type="text" v-model="taskform.operation"></el-input>
                </el-form-item>
        </el-form>
      </div>
       
      <div class="di" style="width:100%;">
        <label for>{{$t('task.DataitemID')}}</label>
        <el-transfer
          v-model="diselect"
          :data="data"
          :titles="['物模型','物模型']"
          :button-texts="[$t('task.Delete'), $t('developer.add')]"
        >
          <!-- <el-select
            class="transfer-footer"
            slot="left-footer"
            size="small"
            @change="selectDi"
            v-model="selectdata"
          >
            <el-option
              v-for="(item,index) in options1"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select> -->
        </el-transfer>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose" style="float:left">{{$t('developer.cancel')}}</el-button>
        <el-button @click="convartion('taskform')" style="float:right" type="primary">{{$t('task.Submission')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  Diselect,
  Alltasks,
  Addtasks,
  Removetask,
  Taskdetail
} from "@/api/historytask";
import { timestampToTime, timetounix } from "@/api/login";
import { getProject} from "@/api/applicationManagement";
import $ from "jquery";
import Parse from "parse";
import { returnLogin } from '@/utils/return';
var taskid = "";
export default {
  name:'TaskCollection1',
  props:{
      productId:{
          type:String,
          default:''
      },
      isreload:{
        type:Number,
        default:0
      }
  },
  data() {
    return {
      selectdata: "",
      options1: [],
      applist: [],
      productlist: [],
      taskform: {
        name: "",
        ftype: 0,
        downchannel: [
          {
            type: '',
            interval: 20,
            unit: "seconds"
          }
        ],
        upchannel: [],
        starttime: "",
        endtime: "",
        unit: "",
        freq: "",
        meteraddress: "all",
        frozendate: "",
        project: "",
        product: "",
        pagesize:10,
        pageindex:1,
        operation:'read'
      },
      taskformrules: {
        name: [{ required: true, message: "请输入任务名称", trigger: "blur" }],
        ftype: [
          { required: true, message: "请选择终端类型", trigger: "change" }
        ],
        project: [{ required: true, message: "请选择工程", trigger: "change" }],
        product: [{ required: true, message: "请选择产品", trigger: "change" }],
        starttime: [
          {
            type: "date",
            required: true,
            message: "请选择开始时间",
            trigger: "change"
          }
        ],
        endtime: [
          {
            type: "date",
            required: true,
            message: "请选择结束时间",
            trigger: "change"
          }
        ],
        meteraddress: [
          { required: true, message: "请输入终端逻辑地址", trigger: "blur" }
        ],
        operation: [
          { required: true, message: "请输入操作指令", trigger: "blur" }
        ],
        unit: [
          { required: true, message: "请选择间隔类型", trigger: "change" }
        ],
        freq: [
          { required: true, message: "请选择间隔时长", trigger: "change" }
        ],
        upchannel: [
          { required: true, message: "请选择上报通道", trigger: "change" }
        ]
      },
      node: null,
      total: 0,
      start: 0,
      length: 10,
      draw: 1,
      tableData3: [],
      multipleSelection: [],
      data: [],
      diselect: [],
      dialogVisible: false,
      valueforsearch: "",
      pickerOptionsStart: {
        disabledDate: time => {
          let endDateVal = this.taskform.endtime;
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
          let beginDateVal = this.taskform.starttime;
          if (beginDateVal) {
            return (
              time.getTime() <
              new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
            );
          } else {
            return time.getTime() < Date.now() - 8.64e7;
          }
        }
      },
      options: [
        {
          value: 0,
          label: "设备"
        },
        {
          value: 1,
          label: "网关"
        }
      ],
      date: [
        {
          value: "day",
          label: "日"
        },
        {
          value: "month",
          label: "月"
        },
        {
          value: "hour",
          label: "时"
        },
        {
          value: "minute",
          label: "分"
        },
         {
          value: "seconds",
          label: "秒"
        }
      ],
      spacing: [],
      sendup: [
        {
          value: 0,
          label: "物理通道"
        },
        {
          value: 1,
          label: "虚拟通道"
        }
      ],
      senddown: [
        {
          value: 0,
          label: "物理通道"
        },
        {
          value: 1,
          label: "虚拟通道"
        }
      ],
      downchannel: [
        {
          type: 1,
          interval: 20,
          unit: "seconds"
        }
      ],
      today: "today",
      idselete: [],
      lunci: "",
      loading: true,
      taskobjectid: "",
      resourcechannelData:[],
      channelData:[],
      projectlist:[],
      productlist:[]
    };
  },
  watch:{
      productId:{
          deep:true,
          handler(val){
              // this.getProduct()
              // this.search()
              // this.getProductChannel()
              // this.getResourceChannel()
          }
      },
      isreload:{
        deep:true,
        handler(val){
          this.getResourceChannel()
        }
      }
  },
  mounted() {
    this.search()
    this.Project()
  },
  methods: {
      Project(){
        var Project = Parse.Object.extend('Project')
        var project = new Parse.Query(Project)
        project.find().then(response=>{
          this.projectlist = response
        },error=>{
          returnLogin(error)
        })
      },
      inputChange(val){
          console.log(val)
      },
      projectSelect(val){
          var Project = Parse.Object.extend('Project')
          var project = new Project()
          project.id = val
          var relation = project.relation('product')
          var query = relation.query()
          query.find().then(resproduct=>{
            this.productlist = resproduct
          },error=>{
            returnLogin(error)
          })
      },
      getProduct(val){
          var Product = Parse.Object.extend('Product')
          var product = new Parse.Query(Product)
          product.get(val).then(resultes=>{
              if(resultes.attributes.thing.properties){
                  resultes.attributes.thing.properties.map(item=>{
                      this.data.push({
                        key: item.identifier,
                        label: `${item.name +
                        "--" +
                        item.identifier}`
                    });
                  })
              }
              this.taskform.ftype = resultes.attributes.nodeType
              this.getProductChannel(val)
              this.getResourceChannel(val)
          })
      },
      getProductChannel(productid) {
      var Channel = Parse.Object.extend("Channel");
      var query = new Parse.Query(Channel);
      var Product = Parse.Object.extend("Product");
      var product = new Product();
      product.id = productid;
      query.equalTo("product", product);
      query.equalTo("type", "1");
      query.ascending("-updatedAt");
      query.find().then(res => {
            this.channelData = res;
        });
    },
    getResourceChannel(productid) {
      var Channel = Parse.Object.extend("Channel");
      var query = new Parse.Query(Channel);
      var Product = Parse.Object.extend("Product");
      var product = new Product();
      product.id = productid;
      query.equalTo("product", product);
      query.equalTo("type", "2");
      query.ascending("-updatedAt")
        query.find().then(res => {
          this.resourcechannelData = res;
        });
    },
    timestampToTime(timestamp) {
      var date = new Date(timestamp * 1000);
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
    //取到dilist

    removeDomain1(item) {
      var index = this.taskform.downchannel.indexOf(item);
      if (index !== -1) {
        this.taskform.downchannel.splice(index, 1);
      }
    },
    addDomain1() {
      this.taskform.downchannel.push({
        type: "",
        interval: "",
        unit: "seconds"
      });
    },
    //删除采集轮次
    removeDomain(item) {
      var index = this.downchannel.indexOf(item);

      if (index !== -1) {
        this.downchannel.splice(index, 1);
      }
    },
    //增加采集轮次
    addDownChannel() {
      this.downchannel.push({
        type: "",
        interval: "",
        unit: "seconds"
      });
    },
    handleClose() {
      this.$refs["taskform"].resetFields();
      this.dialogVisible = false;
      this.taskform.name = "";
      this.taskform.frozendate = "";
      this.taskform.starttime = "";
      this.taskform.endtime = "";
      this.taskform.freq = "";
      this.taskform.unit = "";
      taskid = Math.floor(Math.random() * 128 + 1);
      this.taskobjectid = "";
      this.taskform.downchannel = [
        {
          type: 1,
          interval: 20,
          unit: "seconds"
        }
      ];
      this.diselect = [];
      this.taskform.upchannel = [];
    },
    //搜索和初始化
    search() {
      this.loading = true;
      var Crond = Parse.Object.extend("Crond");
      var querycround = new Parse.Query(Crond);
      if (this.valueforsearch != "") {
        querycround.matches("name", this.valueforsearch,'i');
      }
      if(this.productId!=''){
           querycround.equalTo('product',this.productId)
      }
      querycround.doesNotExist('app')
      querycround.ascending("-updatedAt");
      querycround.skip(this.start);
      querycround.limit(this.length);
      querycround.count().then(
        count => {
          if (count) {
            this.total = count;
          }
          querycround.find().then(res => {
            if (res) {
              this.tableData3 = res;
              this.loading = false;
            }
          });
        },
        error => {
          if (error.code == "209") {
            this.$message({
              type: "warning",
              message: "登陆权限过期，请重新登录"
            });
            this.$router.push({
              path: "/login"
            });
          } else if (error.code == 119) {
            this.$message({
              type: "error",
              message: "没有操作权限"
            });
          }
        }
      );
    },
    //编辑操作
    editcrond(id) {
      var Crond = Parse.Object.extend("Crond");
      var querycround = new Parse.Query(Crond);
      querycround.get(id).then(response => {
        this.dialogVisible = true;
        this.taskform.name = response.attributes.name;
        this.taskform.unit = response.attributes.args.unit;
        if (typeof response.attributes.args.pns == "string") {
          this.type = response.attributes.args.pns;
        } else {
        //   this.type = response.attributes.args.pns.join(",");
          this.taskform.meteraddress = response.attributes.args.pns.total
          this.taskform.pagesize =response.attributes.args.pns.page_size
          this.taskform.pageindex = response.attributes.args.pns.page_index
        }
        this.taskform.freq = response.attributes.args.freq;
        this.taskform.starttime = response.attributes.args.starttime * 1000;
        this.taskform.endtime = response.attributes.args.endtime * 1000;
        this.taskform.downchannel = response.attributes.args.downchannel;
        this.diselect = response.attributes.args.dis;
        this.taskform.upchannel = response.attributes.args.upchannel;
        if (response.attributes.args.frozendate) {
          this.taskform.frozendate = response.attributes.args.frozendate * 1000;
        } else {
          this.taskform.frozendate = "";
        }
        this.taskobjectid = response.id;
        this.selectchange();
      });
    },
    //采集策略遍历显示
    channelMap(downchannel){
        var arr=[]
        downchannel.map(value=>{
            this.channelData.map(items=>{
            if(items.id==value.type){
              arr.push(items.attributes.name)
            }
        })
    })
        return arr.join(',')
    },
    channelResorceMap(updatechannel){
        var arr=[]
        updatechannel.map(item=>{
            this.resourcechannelData.map(child=>{
                if(item==child.id){
                    arr.push(child.attributes.name)
                }
            })
        })
        return arr.join(',')
    },
    //日期选择
    selectchange() {
      if (this.taskform.unit == "month" || this.taskform.unit == "day") {
        this.spacing = [
          {
            value: "1",
            label: "1"
          }
        ];
      }else if(this.taskform.unit=='seconds'){
        this.spacing=[
           { value: "1", label: "1" },
          { value: "5", label: "5" },
          { value: "10", label: "10" },
          { value: "15", label: "15" },
          { value: "20", label: "20" },
          { value: "25", label: "25" },
          { value: "30", label: "30" },
           { value: "35", label: "35" },
          { value: "40", label: "40" },
          { value: "45", label: "45" },
          { value: "50", label: "50" },
          { value: "55", label: "55" },
          { value: "59", label: "59" }
        ]
      } else if (this.taskform.unit == "hour") {
        this.spacing = [
          { value: "1", label: "1" },
          { value: "2", label: "2" },
          { value: "3", label: "3" },
          { value: "4", label: "4" },
          { value: "6", label: "6" },
          { value: "8", label: "8" },
          { value: "12", label: "12" }
        ];
      } else {
        this.spacing = [
          { value: "10", label: "10" },
          { value: "20", label: "20" },
          { value: "30", label: "30" },
          { value: "1", label: "1" }
        ];
      }
    },
    //分页
    handleSelectionChange(val) {
      this.idselete = [];
      this.multipleSelection = val;
    },
    handleSizeChange(val) {
      this.length = val;
      this.search();
    },
    handleCurrentChange(val) {
      this.start = (val - 1) * this.length;
      this.search();
    },
    //结束时间判断
    enddata() {
      if (this.taskform.endtime <= this.taskform.starttime) {
        this.$message("采集结束时间要小于开始时间");
        this.taskform.endtime = "";
      }
      if (this.taskform.endtime < Date.now() - 2000) {
        this.$message("采集结束时间要大于当前时间");
        this.taskform.endtime = "";
      }
    },
    //开始时间判断
    testdata() {
      if (
        this.taskform.endtime <= this.taskform.starttime &&
        this.taskform.endtime != "" &&
        this.taskform.endtime != null
      ) {
        this.$message("采集结束时间要小于开始时间");
        this.taskform.starttime = "";
      }
      if (this.taskform.starttime < Date.now() - 2000) {
        this.$message("采集开始时间要大于当前时间");
        this.taskform.starttime = "";
      }
    },
    //修改和新增提交
    convartion(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.diselect.length == 0) {
            this.$message("请选择数据项标识");
          } else {
            var meter = [];
            var vcaddr = "";
            taskid = Math.floor(Math.random() * 128 + 1);
            if (this.taskform.meteraddress.indexOf("all") != -1) {
              vcaddr = "all";
            } else {
              vcaddr = {
                  total:this.taskform.meteraddress,
                  page_size:this.taskform.pagesize,
                  page_index:this.taskform.pageindex
              };
            }
            var arr = [];
            var unit = "";
            if (this.taskform.unit == "day") {
              unit = 2;
            } else if (this.taskform.unit == "hour") {
              unit = 1;
            } else if (this.taskform.unit == "minute") {
              unit = 0;
            }
            else if(this.taskform.unit=='seconds'){
              unit=3
            } else {
              unit = "";
            }

            this.taskform.downchannel.map(items => {
              arr.push([items.type, items.interval]);
            });
            var Crond = Parse.Object.extend("Crond");
            var crond = new Crond();
            var querycround = new Parse.Query(Crond);
            var Product = Parse.Object.extend("Product");
            var product = new Product();
            if (this.taskobjectid != "") {
              crond.id = this.taskobjectid;
            }
            if (this.taskform.frozendate != "") {
              crond.set("task", {
                di: this.diselect,
                chs: arr,
                res: this.taskform.upchannel,
                pns: vcaddr,
                tertype: this.taskform.ftype,
                fdate: this.taskform.frozendate / 1000,
                operation:this.taskform.operation
              });
            } else {
              crond.set("task", {
                di: this.diselect,
                chs: arr,
                pns: vcaddr,
                res: this.taskform.upchannel,
                operation:this.taskform.operation
              });
            }
            crond.set("args", {
              frozendate: this.taskform.frozendate / 1000,
              chs: arr,
              freq: Number(this.taskform.freq),
              pns: vcaddr,
              unit: this.taskform.unit,
              cycle: this.taskform.unit,
              dis: this.diselect,
              tertype: this.taskform.ftype,
              upchannel: this.taskform.upchannel,
              downchannel: this.taskform.downchannel,
              endtime: timetounix(this.taskform.endtime),
              starttime: timetounix(this.taskform.starttime),
              operation:this.taskform.operation
            });
            crond.set("active", 1);
            crond.set("name", this.taskform.name);
            crond.set("crond", {
              end_time: timetounix(this.taskform.endtime),
              freq: Number(this.taskform.freq),
              unit: unit,
              start_time: timetounix(this.taskform.starttime)
            });
            crond.set("tid", taskid);
            //和产品以及应用做pointer关联
           
            product.id = this.productId
            crond.set('product',product)
            //查询任务id是否重复
            if (this.taskobjectid == "") {
              querycround.equalTo("tid", taskid);
              querycround.find().then(response => {
                if (response.length != 0) {
                  this.$message({
                    message: "任务id重复",
                    type: "error"
                  });
                  return;
                } else {
                  crond.save().then(
                    resultes => {
                      if (resultes) {
                        this.$message({
                          message: "添加成功",
                          type: "success"
                        });
                        this.$refs[formName].resetFields();
                        this.dialogVisible = false;
                        this.taskform.name = "";
                        this.taskform.frozendate = "";
                        this.taskform.starttime = "";
                        this.taskform.endtime = "";
                        this.taskform.freq = "";
                        this.taskform.unit = "";
                        this.taskform.downchannel = [
                          {
                            type: 1,
                            interval: 20,
                            unit: "seconds"
                          }
                        ];
                      }
                      (this.taskform.frozendate = ""), (this.diselect = []);
                      this.taskform.upchannel = [];
                      this.search();
                    },
                    error => {
                      if (error.code == "209") {
                        this.$message({
                          type: "warning",
                          message: "登陆权限过期，请重新登录"
                        });
                        this.$router.push({
                          path: "/login"
                        });
                      } else if (error.code == 119) {
                        this.$message({
                          type: "error",
                          message: "没有操作权限"
                        });
                      }
                    }
                  );
                }
              });
            } else {
              crond.save().then(
                resultes => {
                  if (resultes) {
                    this.$message({
                      message: "编辑成功",
                      type: "success"
                    });
                    this.$refs[formName].resetFields();
                    this.dialogVisible = false;
                    this.taskform.name = "";
                    this.taskform.frozendate = "";
                    this.taskform.starttime = "";
                    this.taskform.endtime = "";
                    this.taskform.freq = "";
                    this.taskform.unit = "";
                    taskid = Math.floor(Math.random() * 128 + 1);
                    this.taskobjectid = "";
                    this.taskform.downchannel = [
                      {
                        type: 1,
                        interval: 20,
                        unit: "seconds"
                      }
                    ];
                  }
                  this.diselect = [];
                  this.taskform.upchannel = [];
                  this.search();
                },
                error => {
                  if (error.code == "209") {
                    this.$message({
                      type: "warning",
                      message: "登陆权限过期，请重新登录"
                    });
                    this.$router.push({
                      path: "/login"
                    });
                  } else if (error.code == 119) {
                    this.$message({
                      type: "error",
                      message: "没有操作权限"
                    });
                  }
                }
              );
            }
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getfrozen() {},
    selectTime(val) {
      if (val == "other") {
        this.getfrozen();
      }
    },
    //异步处理删除多个任务
    deletetask() {
      var arr = [];
      if (this.multipleSelection.length != 0) {
        this.multipleSelection.map(items => {
          arr.push(
            new Promise((resolve, reject) => {
              var Crond = Parse.Object.extend("Crond");
              var crond = new Crond();
              crond.id = items.id;
              return crond.destroy().then(
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
              console.log(data)
              if (data.length == this.multipleSelection.length) {
                this.search();
              }
            })
            .catch(error => {
              this.$message({
                message: error,
                type: "error"
              });
            });
        });
      } else {
        this.$message("请勾选要删除的任务");
      }
    }
  }
};
</script>
<style scoped>
.task_collection {
  min-height: 100%;
  background: white;
  padding: 20px;
  box-sizing: border-box;
}
.top {
  width: 100%;
  height: 50px;
}
.left {
  width: 50%;
  float: left;
}
.right {
  width: 50%;
  float: right;
  text-align: right;
}
.center {
  margin-top: 30px;
}
</style>
<style>
.task_collection .el-dialog__footer {
  padding-bottom: 50px;
}
.task_collection .el-dialog {
  bottom: 40px;
}
.task_collection .dialog .children,
.dialog .starttime {
  margin-top: 20px;
  width: 50%;
}
.task_collection .dialog .notchildren {
  margin-top: 20px;
  width: 100%;
}
.task_collection .dialog .children label,
.task_collection .dialog .notchildren label:not(.notfloat),
.task_collection .dialog .starttime label {
  margin-top: 10px;
  width: 120px;
  text-align: right;
  float: left;
}
.task_collection .children .el-input--suffix {
  width: 200px;
}
.task_collection .starttime .el-input--suffix {
  width: 100px;
}
.task_collection .el-transfer {
  display: flex;
  align-items: center;
  justify-content: center;
}
.task_collection .el-transfer-panel {
  width: 300px;
}
.task_collection .el-transfer__button:first-child {
  position: relative;
  top: 50px;
}
.task_collection .el-transfer__button:nth-child(2) {
  position: relative;
  top: -50px;
}
.task_collection .el-picker-panel__sidebar + .el-picker-panel__body {
  visibility: hidden;
}
.dialog .el-form {
  display: flex;
  flex-wrap: wrap;
}
.dialog .el-form .lineone {
  width: 100% !important;
}

.dialog .el-form .el-form-item {
  width: 50%;
}
.dialog .el-form .el-form-item .el-input {
  width: 100%;
}
.dialog .el-form .el-form-item .el-select {
  width: 100%;
}
@media screen and (max-width: 1350px) {
  .dialog .el-form .el-form-item {
    width: 100%;
  }
  /* .dialog .el-form .lineone .el-form-item__content{
    margin-left:20px!important;
  } */
}
.dialog .el-col-11 .el-form-item {
  width: 100%;
}
.lineone .flexg {
  display: flex;
  margin-top: 20px;
}
.lineone .elformcontent .el-input__inner {
  width: 200px;
}
.task_collection .el-transfer-panel .el-transfer-panel__footer {
  top: 40px;
  text-align: center;
  height: 50px;
}
.task_collection .el-transfer-panel__filter {
  visibility: hidden;
}
.task_collection .el-transfer-panel .el-transfer-panel__footer .el-select {
  width: 80%;
}
.task_collection
  .el-transfer-panel
  .el-transfer-panel__footer
  .el-select
  > .el-input {
  margin-top: 15px;
}
.task_collection
  .el-transfer-panel
  .el-transfer-panel__footer
  .el-input--small
  .el-input__inner {
  border-radius: 16px;
}
.task_collection .el-col-2{
  text-align: center;
}
</style>

