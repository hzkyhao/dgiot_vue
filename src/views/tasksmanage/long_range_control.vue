<template>
  <div class="longcontrol">
    <!--第一个tree树-->
    <Resource1
      
      style="width:360px;height:100vh;overflow:scroll;flex-shrink:0;padding:10px;"
      @meterdetail="meterdetail"
    />
    <!--第三个返回数据展示-->
    <div class="second" :style="{'height':resource1}">
      <div style="width:100%;height:auto;padding:20px;box-sizing:border-box;">
        <div class="secondheader">
          <el-form
            ref="ruleform"
            :model="ruleform"
            label-width="80px"
            :inline="true"
            :rules="rules"
          >
            <el-form-item label="供电单位">
              <el-input v-model="ruleform.gddw"></el-input>
            </el-form-item>
            <el-form-item label="用户编号">
              <el-input v-model="ruleform.yhabh"></el-input>
            </el-form-item>
            <el-form-item label="用户名称">
              <el-input v-model="ruleform.yhmc"></el-input>
            </el-form-item>
            <el-form-item label="终端地址" prop="vcaddr">
              <el-input v-model="ruleform.vcaddr"></el-input>
            </el-form-item>
            <el-form-item label="电表地址" prop="meteraddr">
              <!-- <el-input v-model="ruleform.meteraddr"></el-input> -->
              <el-select
                v-model="ruleform.meteraddr"
                placeholder="请选择电表地址"
                filterable
                clear
                @change="sleslectmeter"
              >
                <el-option
                  v-for="(item,index) in smartmeterlist"
                  :label="item.attributes.addr"
                  :value="item.attributes.addr"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="数据类型" prop="datatype">
              <el-select v-model="ruleform.datatype" placeholder="请选择数据类型">
                <el-option label="测量点控制参数" value="A.17"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="规约类型" prop="protocol">
              <el-select v-model="ruleform.protocol" placeholder="请选择规约类型">
                <el-option label="南网上行通信规约" value="30"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="通道类型" prop="route">
              <el-select v-model="ruleform.route" placeholder="请选择通道类型">
                <el-option label="默认" value="tcp"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="当前状态">
              <el-input v-if="ruleform.cur_status==0" value="合闸"></el-input>
              <el-input v-else value="拉闸"></el-input>
            </el-form-item>
            <el-form-item label="测量点号">
              <el-input v-model.number="ruleform.pn" type="number" :min="1" :max="2048" :placeholder="'取值范围'+start+'~'+end" readonly></el-input>
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                size="small"
                @click="resetForm1(ruleform.icon,ruleform.meteraddr)"
              >查询</el-button>
              <el-button type="primary" size="small" @click="submitForm('ruleform','switch_off')" >拉闸</el-button>
              <el-button type="primary" size="small" @click="submitForm('ruleform','switch_on')" >合闸</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="secondcontent">
          <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%;text-align:center"
            height="650"
            border
            @selection-change="handleSelectionChange"
          >
            <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
            <el-table-column prop="gddw" label="供电单位" align="center"></el-table-column>
            <el-table-column prop="tq" label="台区名称" align="center"></el-table-column>
            <el-table-column prop="vcaddr" label="终端地址" width="150" align="center"></el-table-column>
            <el-table-column prop="yhabh" label="用户编号" align="center"></el-table-column>
            <el-table-column prop="meteraddr" label="表地址" align="center"></el-table-column>
            <el-table-column label="电表当前状态" align="center">
              <template slot-scope="scope">
                <el-tag type="danger" v-if="scope.row.cur_status=='1'">拉闸</el-tag>
                <el-tag type="primary" v-else-if="scope.row.cur_status=='0'">合闸</el-tag>
              </template>
            </el-table-column>

            <el-table-column label="操作记录" align="center">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="searchMeter(scope.row.meteraddr)">查 看</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :page-sizes="[10, 25, 50, 100]"
              :page-size="length"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              style="margin-top:20px;"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>
    <!--下发弹窗-->
    <el-dialog
      title="远程控制结果"
      :visible.sync="dialogTableVisible"
      :close-on-click-modal="false"
      :before-close="handleClose"
      width="70%"
    >
      <el-table
        ref="multipleTable"
        :data="tableData1"
        tooltip-effect="dark"
        style="width: 100%;text-align:center"
        border
        v-loading="loading1"
      >
      <el-table-column prop="round" label="轮次">
      
      </el-table-column>
        <el-table-column prop="vcaddr_web" label="终端地址" width="150" align="center"></el-table-column>
        <el-table-column prop="pn" label="测量点号" align="center"></el-table-column>
        <el-table-column prop="meteraddr" label="电表地址" width="150" align="center"></el-table-column>
        <el-table-column label="当前状态" width="100">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.cur_status=='1'">拉闸</el-tag>
            <el-tag type="primary" v-else-if="scope.row.cur_status=='0'">合闸</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="控制类型" align="center">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.opertype=='switch_off'">拉闸</el-tag>
            <el-tag type="primary" v-else-if="scope.row.opertype=='switch_on'">合闸</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="ts" label="申请时间" align="center" width="200"></el-table-column>
        <el-table-column label="指令下发状态" align="center" width="100">
          <template slot-scope="scope">
            <el-tag type="primary" v-if="scope.row.send_down==0">等待下发</el-tag>
            <el-tag type="success" v-else-if="scope.row.send_down==1">下发成功</el-tag>
            <el-tag type="danger" v-else-if="scope.row.send_down==2">失败</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作结果" align="center" width="100">
          <template slot-scope="scope">
            <el-tag type="warning" v-if="scope.row.status==2">超时</el-tag>
            <el-tag type="primary" v-else-if="scope.row.status==0">执行中</el-tag>
            <el-tag type="success" v-else-if="scope.row.status==1&&scope.row.opertype=='switch_off'">拉闸成功</el-tag>
            <el-tag type="danger" v-else-if="scope.row.status==3&&scope.row.opertype=='switch_off'">拉闸失败</el-tag>
             <el-tag type="success" v-else-if="scope.row.status==1&&scope.row.opertype=='switch_on'">合闸成功</el-tag>
            <el-tag type="danger" v-else-if="scope.row.status==3&&scope.row.opertype=='switch_on'">合闸失败</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="操作时间" align="center" width="200"></el-table-column>
      </el-table>
    </el-dialog>
    <!--操作记录弹窗-->
    <div class="dialogsearch">
      <el-dialog
        title="操作记录"
        :visible.sync="dialogTableVisible1"
        :close-on-click-modal="false"
        :before-close="handleClose1"
        width="60%"
      >
        <div class="secondheader">
          <el-form ref="ruleform" :model="ckform" label-width="80px" :inline="true">
            <el-form-item label="电表地址">
              <el-input v-model="ckform.meteraddr" disabled></el-input>
            </el-form-item>
            <el-form-item label="操作类型">
              <el-select v-model="ckform.control" placeholder="请选择操作类型">
                <el-option label="全部" value="9"></el-option>
                <el-option label="拉闸" value="switch_off"></el-option>
                <el-option label="合闸" value="switch_on"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="开始时间">
              <el-date-picker
                v-model="ckform.starttime"
                type="datetime"
                placeholder="选择开始时间"
                value-format="timestamp"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间">
              <el-date-picker
                v-model="ckform.endtime"
                type="datetime"
                placeholder="选择结束时间"
                value-format="timestamp"
              ></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="mini" @click="searchMeter(meteraddrname)">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-table
          ref="multipleTable"
          :data="tableData2"
          tooltip-effect="dark"
          height="400"
          style="width: 100%;text-align:center;"
          border
        >
          <el-table-column prop="vcaddr" label="终端地址" width="150" align="center"></el-table-column>
          <el-table-column prop="pn" label="PN值" align="center"></el-table-column>
          <el-table-column prop="meteraddr" label="表地址" width="150" align="center"></el-table-column>
          <el-table-column label="控制类型" align="center" width="100">
            <template slot-scope="scope">
              <el-tag type="danger" v-if="scope.row.opertype=='switch_off'">拉闸</el-tag>
              <el-tag type="primary" v-else-if="scope.row.opertype=='switch_on'">合闸</el-tag>
            </template>
          </el-table-column>
         
          <el-table-column label="指令下发状态" align="center" width="150">
            <template slot-scope="scope">
              <el-tag type="primary" v-if="scope.row.send_down==0">等待下发</el-tag>
              <el-tag type="success" v-else-if="scope.row.send_down==1">下发成功</el-tag>
              <el-tag type="danger" v-else-if="scope.row.send_down==2">下发失败</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="执行结果" align="center"  width="100">
            <template slot-scope="scope">
              <el-tag type="warning" v-if="scope.row.status==2">超时</el-tag>
              <el-tag type="primary" v-else-if="scope.row.status==0">执行中</el-tag>
               <el-tag type="success" v-else-if="scope.row.status==1&&scope.row.opertype=='switch_off'">拉闸成功</el-tag>
              <el-tag type="danger" v-else-if="scope.row.status==3&&scope.row.opertype=='switch_off'">拉闸失败</el-tag>
              <el-tag type="success" v-else-if="scope.row.status==1&&scope.row.opertype=='switch_on'">合闸成功</el-tag>
              <el-tag type="danger" v-else-if="scope.row.status==3&&scope.row.opertype=='switch_on'">合闸失败</el-tag>
            </template>
          </el-table-column>
           <el-table-column prop="createdAt" label="执行时间" align="center" width="200"></el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            background
            @size-change="handleSizeChange1"
            @current-change="handleCurrentChange1"
            :page-sizes="[10]"
            :page-size="length1"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total1"
            style="margin-top:20px;"
          ></el-pagination>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import Parse from "parse";
import { Getlhz } from "@/api/mainstation";
import Resource1 from "@/components/resource/resource";
import { eventBus } from "@/api/eventBus";
import { Websocket } from "@/utils/wxscoket.js";
import {utc2beijing} from '@/utils'
var operation = "";
var ranNum = "";
var icon,val
import { timestampToTime } from "@/api/login";
import { addReport } from '@/api/reportmodule/reportmodule';
export default {
  components: {
    Resource1
  },
  data() {
    var checkPn = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("pn不能为空"));
      } else {
        callback();
      }
    };
    return {
      start: 0,
      length: 10,
      total: 0,
      start1: 0,
      length1: 10,
      total1: 0,
      loading: false,
      loading1: true,
      dialogTableVisible: false,
      dialogTableVisible1: false,
      first:0,
      end:10,
      rules: {
        vcaddr: [
          { required: true, message: "请在左侧树选择", trigger: "blur" }
        ],
        meteraddr: [
          { required: true, message: "请在选择电表", trigger: "change" }
        ],
        pn: [{ validator: checkPn, trigger: "blur" }],
        datatype: [
          { required: true, message: "请选择数据类型", trigger: "change" }
        ],
        protocol: [
          { required: true, message: "请选择规约类型", trigger: "change" }
        ],
        route: [
          { required: true, message: "请选择通道类型", trigger: "change" }
        ],
        control: [
          { required: true, message: "请选择操作类型", trigger: "change" }
        ],
        pn: [
          { required: true, message: "请输入测量点号", trigger: "blur" }
        ]
      },
      operation: "",
      ruleform: {
        name: "",
        gddw: "",
        vcaddr: "",
        meteraddr: "",
        datatype: "A.17",
        protocol: "30",
        route: "tcp",
        pn: '',
        resource: "",
        starttime: "",
        endtime: "",
        icon: "",
        cur_status:'',
        nowstatus:'合闸',
        nowstatus1:'拉闸'
      },
      session: "",
      tableData: [],
      multipleSelection: "",
      devobjectId: [],
      smartmeterlist: [],
      tableData1: [],
      tableData2: [],
      meteraddrname: "",
      ckform: {
        meteraddr: "",
        starttime: "",
        endtime: "",
        control: "9"
      },
      heightforresource:false
    };
  },
  computed: {
    resource1(){
      if(this.heightforresource){
         return document.getElementsByClassName("second")[0].offsetHeight + "px";
      }
    }
  },
  mounted() {
    this.heightforresource=true
    this.session = Parse.User.current().attributes.sessionToken;
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //树取到电表数据
    meterdetail(val) {
      icon=val
     
      if ( val.icon != "集中器") {
        this.$message({
          type: "error",
          message: "请勾选集中器"
        });
      }
      // } else if (val.icon == "电表") {
      //   this.loading = true;
      //   var Smartmeter = Parse.Object.extend("Smartmeter");
      //   var smartmeter = new Parse.Query(Smartmeter);
      //   smartmeter.get(val.objectId).then(
      //     resultes => {
      //       this.ruleform = {
      //         name: "",
      //         vcaddr: "",
      //         meteraddr: "",
      //         datatype: "A.17",
      //         protocol: "30",
      //         route: "tcp",
      //         pn: 1,
      //         resource: "",
      //         starttime: "",
      //         endtime: "",
      //         icon: "电表",
      //         cur_status:val.cur_status
      //       };
      //       this.smartmeterlist = resultes;
      //       this.ruleform.pn = resultes.attributes.pn;
      //       this.ruleform.vcaddr = resultes.attributes.vcaddr_web;
      //       this.ruleform.meteraddr = resultes.attributes.addr_web;
      //       this.ruleform.yhmc = resultes.attributes.yhmc;
      //       this.ruleform.yhabh = resultes.attributes.yhabh;
      //       this.ruleform.gddw = resultes.attributes.gddw;
      //       this.loading = false;
      //       this.resetForm1(val.icon, val.name);
      //     },
      //     error => {
      //       if (error.code == "209") {
      //         this.$message({
      //           type: "warning",
      //           message: "登陆权限过期，请重新登录"
      //         });
      //         this.$router.push({
      //           path: "/login"
      //         });
      //       } else if (error.code == 119) {
      //         this.$message({
      //           type: "error",
      //           message: "没有操作权限"
      //         });
      //       }
      //     }
      //   );
      // } 
      else if (val.icon == "集中器") {
        this.devobjectId = [];
        this.loading = true;
         this.tableData=[]
        this.devobjectId.push(val.objectId);
        this.ruleform.icon='集中器'
        var Vcon = Parse.Object.extend('Vcon')
        var vcon = new Parse.Query(Vcon)
        vcon.get(val.objectId).then(response=>{
          var Smartmeter = Parse.Object.extend("Smartmeter");
          var smartmeter = new Parse.Query(Smartmeter);
          smartmeter.equalTo('vcaddr', val.alias);
          smartmeter.skip(this.start);
          smartmeter.limit(this.length);
          smartmeter.ascending('pn')
          smartmeter.count().then(
          count => {
            this.total = count;
            smartmeter.find().then(resultes => {
              this.smartmeterlist=resultes
              this.ruleform = {
                gddw:response.attributes.organization.attributes.name,
                name: "",
                vcaddr: val.name,
                meteraddr: "",
                datatype: "A.17",
                protocol: "30",
                route: "tcp",
                pn: '',
                resource: "",
                starttime: "",
                endtime: "",
                icon: "集中器",
                cur_status:''
              };
              resultes.map(item => {
                var obj = {};
                obj.tq = item.attributes.tq;
                obj.yhabh = item.attributes.yhabh;
                obj.yhbh = item.attributes.yhbh;
                obj.yhmc = item.attributes.yhmc;
                obj.gddw = item.attributes.gddw;
                obj.meteraddr = item.attributes.addr;
                obj.pn = item.attributes.pn;
                obj.vcaddr = item.attributes.vcaddr;
                if (item.attributes.jsondata.cur_status) {
                  obj.cur_status = item.attributes.jsondata.cur_status;
                } else {
                  obj.cur_status = 0;
                }

                this.tableData.push(obj);
              });
              this.first = resultes[0].attributes.pn
              this.end = resultes[resultes.length-1].attributes.pn
            });
          },error => {
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
        })
        
      }
    },
    //table 分页函数
    handleSizeChange(val) {
      this.length = val;
      
      this.resetForm1(this.ruleform.icon,this.ruleform.meteraddr);
    },
    handleCurrentChange(val) {
      this.start = (val - 1) * this.length;
      this.resetForm1(this.ruleform.icon,this.ruleform.meteraddr);
    },
    //关闭弹窗函数
     handleClose() {
      this.dialogTableVisible = false;
    },
    handleClose1() {
      this.dialogTableVisible1 = false;
    },
    //电表pn 地址 以及状态查询
    sleslectmeter(val) {
      this.smartmeterlist.map((items, index) => {
        if (items.attributes.addr == val) {
          this.ruleform.pn = items.attributes.pn;
          this.ruleform.vcaddr = items.attributes.vcaddr;
          this.ruleform.yhmc = items.attributes.yhmc;
          this.ruleform.yhabh = items.attributes.yhabh;
          this.ruleform.gddw = items.attributes.gddw;
          if (items.attributes.jsondata.cur_status) {
              this.ruleform.cur_status= items.attributes.jsondata.cur_status;
            } else {
              this.ruleform.cur_status = 0;
            }
        }
      });
    },
    //下发
    submitForm(formName,type) {
      ranNum = Math.ceil(Math.random() * 25);
      operation =
        String.fromCharCode(65 + ranNum) + Math.ceil(Math.random() * 100000);
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (Websocket.connState == false) {
            this.$message({
              type: "warning",
              message: "正在重新连接，请稍后"
            });
          } else {
            eventBus.$on(operation, data => {
              this.loading1 = false;
              data.data.map(item => {
                if(item.time){
                  item.time = timestampToTime(item.time);
                }
                item.ts = timestampToTime(item.ts);
                
              });
              this.tableData1 = data.data;
            });
            Getlhz(this.ruleform, this.session, operation,type)
              .then(resultes => {
                if(resultes){
                  this.dialogTableVisible = true;
                  this.loading1 = true;
                }
              })
              .catch(error => {
                this.$message({
                  type: "error",
                  message: error.error
                });
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //查询按钮
    resetForm1(icon, val) {
      this.tableData = [];
        var Smartmeter = Parse.Object.extend("Smartmeter");
        var smartmeter = new Parse.Query(Smartmeter);
        smartmeter.equalTo('addr', this.ruleform.meteraddr);
        smartmeter.skip(this.start);
        smartmeter.limit(this.length);
        smartmeter.count().then(
          count => {
            this.total = count;
            smartmeter.find().then(resultes => {
              resultes.map(item => {
                var obj = {};
                obj.tq = item.attributes.tq;
                obj.yhabh = item.attributes.yhabh;
                obj.yhbh = item.attributes.yhbh;
                obj.yhmc = item.attributes.yhmc;
                obj.gddw = item.attributes.gddw;
                obj.meteraddr = item.attributes.addr;
                obj.pn = item.attributes.pn;
                obj.vcaddr = item.attributes.vcaddr;
                if (item.attributes.jsondata.cur_status) {
                  obj.cur_status = item.attributes.jsondata.cur_status;
                } else {
                  obj.cur_status = 0;
                }
                this.tableData.push(obj);
              });
            });
          },
          error => {
            this.$message({
              type: "error",
              message: error.message
            });
          }
        );
      // }
    },
    searchMeter(val) {
      this.dialogTableVisible1 = true;
      this.meteraddrname = val;
      this.tableData2 = [];
      this.ckform.meteraddr = val
      var Datas = Parse.Object.extend("Datas");
      var datas = new Parse.Query(Datas);
      if(this.ckform.control!=9){
        datas.equalTo("data.opertype", this.ckform.control)
      }
      if(this.ckform.starttime!=''&&this.ckform.starttime!=0){
          var starttime=new Date(this.ckform.starttime).toISOString()
           datas.greaterThan('createdAt',starttime)
      }
      if(this.ckform.endtime!=''&&this.ckform.endtime!=0){
        var endtime=new Date(this.ckform.endtime).toISOString()
           datas.lessThan('createdAt',endtime)
      }
      datas.ascending('-createdAt')
      datas.equalTo("data.meteraddr", val);
      datas.equalTo('type','meter_ctrl')
      datas.skip(this.start1);
      datas.limit(this.length1);
      datas.count().then(
        count => {
          this.total1 = count;
          datas.find().then(resultes => {
            resultes.map(item => {
              var obj = {};
              obj.tq = item.attributes.data.tq;
              obj.status = item.attributes.data.status;
              obj.yhabh = item.attributes.data.yhabh;
              obj.yhbh = item.attributes.data.yhbh;
              obj.yhmc = item.attributes.data.yhmc;
              obj.gddw = item.attributes.data.gddw;
              obj.meteraddr = item.attributes.data.meteraddr;
              obj.opertype = item.attributes.data.opertype;
              obj.send_down = item.attributes.data.send_down;
              obj.createdAt = utc2beijing(item.createdAt)
              obj.time = item.attributes.data.time;
              obj.pn = item.attributes.data.pn;
              obj.vcaddr = item.attributes.data.vcaddr_web;
              obj.cur_status = item.attributes.data.cur_status;
              this.tableData2.push(obj);
            });
          });
        },
        error => {
          this.$message({
            type: "error",
            message: error.message
          });
        }
      );
    },
    handleSizeChange1(val) {
      this.length1 = val;
      this.searchMeter(this.meteraddrname);
    },
    handleCurrentChange1(val) {
      this.start1 = (val - 1) * this.length1;
      this.searchMeter(this.meteraddrname);
    }
  }
};
</script>
<style scoped lang="scss">
.longcontrol {
  width: 100%;
  min-height: 100%;
  box-sizing: border-box;
  background: #ffffff;
  display: flex;
  .second {
    min-height: 875px;
    border-left: 2px solid #156fae;
    background: #f6fbff;
    overflow-x: scroll;
    .secondcontent {
      margin-top: 20px;
    }
  }
}
</style>
<style>
.longcontrol .secondheader .el-form-item {
  margin-bottom: 20px;
}
.longcontrol .el-tabs--border-card {
  border: 0;
  width: 322px;
}
.longcontrol .el-tabs__item {
  line-height: 20px;
}
.longcontrol .second .secondheader .el-input__inner {
  height: 26px;
  line-height: 26px;
  width: 150px;
  border-radius: 0;
}
.longcontrol .el-dialog__body .secondheader .el-input__inner {
  height: 26px;
  line-height: 26px;
  width: 150px;
  border-radius: 0;
}
.longcontrol .el-form-item__label {
  color: #333333;
  font-family: Microsoft YaHei;
  line-height: 26px;
}

.longcontrol .second .secondheader .el-form--inline .el-form-item__content {
  line-height: 26px;
  height: 26px;
  border-radius: 0;
}
.longcontrol .secondheader .el-date-editor.el-input {
  width: 150px;
  border-radius: 0;
}
.longcontrol
  .el-dialog__body
  .secondheader
  .el-form--inline
  .el-form-item__content {
  line-height: 26px;
  height: 26px;
  border-radius: 0;
}
.longcontrol .secondheader .el-input__icon {
  line-height: 0;
}
.longcontrol .el-dialog__body .el-input__icon {
  line-height: 0;
}
.second .secondheader .el-select {
  width: 100%;
}
.secondheader .el-button {
  width: 75px;
  height: 26px;
  line-height: 0;
  border-radius: 0;
}
.secondheader .el-radio:last-child {
  margin-right: 20px;
}
.longcontrol .el-dialog{
  margin-top:42vh;
  left:120px;
}
</style>

