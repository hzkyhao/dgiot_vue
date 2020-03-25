<template>
  <div class="tasklist">
    <div class="top">
      <div class="left">
        <el-button type="primary" @click="dialogVisible = true">配置任务</el-button>
        <el-button type="primary" style="margin-left:30px" @click="deletetask">删 除</el-button>
      </div>
      <div class="right">
        <el-input
          type="text"
          style="width:200px;margin-left:30px;"
          placeholder="请输入任务名称"
          v-model="valueforsearch"
        ></el-input>
        <el-button type="primary" @click="search">搜 索</el-button>
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
        <el-table-column label="任务名称">
          <template slot-scope="scope">
            <span>{{scope.row.attributes.name}}</span>
          </template>
        </el-table-column>

        <el-table-column label="采集开始时间">
          <template slot-scope="scope">
            <span>{{timestampToTime(scope.row.attributes.args.starttime)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="数据项名称">
          <template slot-scope="scope">
            <span>{{scope.row.attributes.args.dis.join(',')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="周期单位">
          <template slot-scope="scope">
            <span>{{scope.row.attributes.args.freq}}</span>
            <span v-if="scope.row.attributes.args.unit=='day'">天</span>
            <span v-else-if="scope.row.attributes.args.unit=='minute'">分</span>
            <span v-else-if="scope.row.attributes.args.unit=='hour'">时</span>
          </template>
        </el-table-column>
        <el-table-column label="下发通道">
          <template slot-scope="scope">
            <span v-if="scope.row.attributes.args.downchannel=='1'">虚拟集中器</span>
            <span v-else>物理集中器</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="editcrond(scope.row.id)">编 辑</el-button>
            <el-button size="mini" type="primary" @click="Meterdetail(scope.row)">详 情</el-button>
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
      title="配置任务"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
      top="5vh"
    >
      <div class="dialog">
        <el-form ref="taskform" :model="taskform" label-width="120px" :rules="taskformrules">
       
        <el-form-item label="任务名称" prop="name">
          <el-input type="text" v-model="taskform.name" placeholder="请输入任务名称"></el-input>
        </el-form-item>
        <el-form-item label="终端类型" prop="ftype">
        <el-select v-model="taskform.ftype" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <!--采集开始时间-->
      <el-form-item label="采集开始时间" prop="starttime">
           <el-date-picker
            v-model="taskform.starttime"
            type="datetime"
            placeholder="选择开始时间"
            @change="testdata"
            :picker-options="pickerOptionsStart"
          ></el-date-picker>
      </el-form-item>
      <!--终端地址-->
        <el-form-item label="终端逻辑地址" prop="meteraddress">
           <el-input
            type="text"
            v-model="taskform.meteraddress"
            placeholder="A终端逻辑地址,B终端逻辑地址"
          ></el-input>
          <p style="color:black;margin:0;position:absolute;top:25px">(all代表全部)(注意:逗号为英文逗号)</p>
        </el-form-item>
      <!--采集结束时间-->
      <el-form-item label="采集结束时间" prop="endtime">
          <el-date-picker
            v-model="taskform.endtime"
            type="datetime"
            placeholder="选择结束时间"
            @change="enddata"
            :picker-options="pickerOptionsEnd"
          ></el-date-picker>
      </el-form-item>
      <!--冻结日期-->
      <el-form-item label="冻结日期">
        <el-date-picker
            v-model="taskform.frozendate"
            type="date"
            placeholder="当天"
            value-format="timestamp"
          ></el-date-picker>
      </el-form-item>
      <!--采集间隔时间-->
      <el-form-item label="采集间隔时间" required>
          <el-col :span="11">
              <el-form-item prop="unit">
                <el-select v-model="taskform.unit" placeholder="请选择" @change="selectchange">
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
                <el-select v-model="taskform.freq" placeholder="请选择">
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
      <!--上报通道-->
      <el-form-item label="上报通道" prop="upchannel">
          <el-select v-model="taskform.upchannel" placeholder="上报通道可多选" multiple>
            <el-option label="计量主站(南网)" :value="1"></el-option>
            <el-option label="配置库" :value="2"></el-option>
            <el-option label="时序库" :value="3"></el-option>
            <el-option label="计量主站(广东)" :value="4"></el-option>
            <el-option label="用采主站(国网)" :value="5"></el-option>
          </el-select>
      </el-form-item>
      <!--采集策略-->
      <el-form-item label="采集策略" class="lineone" label-width="100px">
            <div class="flexg" v-for="(item, index) in taskform.downchannel" :key="index">
              <el-form-item
                :label="'轮次'+(index+1)"
                class="elformcontent"
                label-width="60px"
                :prop="'downchannel.'+index+'.type'"
                :rules="[{required: true, message: '选择通道类型',trigger: 'change'}]"
              >
                <el-select v-model="item.type" placeholder="请选择通道类型">
                  <el-option
                    v-for="item in channel"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
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
                <el-select v-model="item.unit" placeholder="选择单位">
                  <el-option label="时" value="hours"></el-option>
                  <el-option label="分" value="minutes"></el-option>
                  <el-option label="秒" value="seconds"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-link
                  type="primary"
                  @click.prevent="removeDomain1(item)"
                  :underline="false"
                  icon="el-icon-minus"
                >删除</el-link>
              </el-form-item>
            </div>
          </el-form-item>
          <div style="width: 100%;
    margin-left: 50px">
            <el-link @click="addDomain1" icon="el-icon-plus" type="primary" :underline="false">添加采集策略</el-link>
          </div>
      </el-form>
      
      </div>
      
        <div class="di" style="width:100%;">
          <label for>数据项标识：</label>
          <el-transfer
            v-model="diselect"
            :data="data"
            :titles="['数据项标识', '数据项标识']"
            :button-texts="['删除', '添加']"
            filterable
            filter-placeholder="请输入搜索内容"
          >
           <el-select class="transfer-footer" slot="left-footer" size="small" @change="selectDi" v-model="selectdata">
             <el-option
              v-for="(item,index) in options1"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
           </el-select>
          </el-transfer>
        </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose" style="float:left">关 闭</el-button>
        <el-button @click="convartion('taskform')" style="float:right" type="primary">保 存</el-button>
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
import $ from "jquery";
import Parse from "parse";
var taskid = "";
export default {
  data() {
    // const generateData = _ => {
    //   const data = [];
    //   var Mainstation = Parse.Object.extend("MainStationIndex");
    //   var mainstation = new Parse.Query(Mainstation);
    //   mainstation.startsWith("name", "C.2");
    //   mainstation.exists("leafs");
    //   mainstation.ascending("name");
    //   mainstation.find().then(resultes => {
    //     var arr = [];
    //     resultes.map(items => {
    //       items.attributes.leafs.map(children => {
    //         arr.push(children);
    //       });
    //     });
    //     var DataItem = Parse.Object.extend("DataItem");
    //     var dataitem = new Parse.Query(DataItem);
    //     dataitem.containedIn("leafname", arr);
    //     dataitem.limit(1000);
    //     dataitem.ascending("itemCode");
    //     dataitem.find().then(res => {
    //       res.map(item => {
    //         data.push({
    //           key: item.attributes.itemCode,
    //           label: `${item.attributes.itemCode +
    //             "--" +
    //             item.attributes.itemName}`
    //         });
    //       });
    //     });
    //   });
    //   return data;
    // };
    
    return {
      selectdata:'',
      options1:[],
      taskform: {
        name: "",
        ftype: "vcaddr",
        downchannel: [
          {
            type: 1,
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
        frozendate:''
      },
      taskformrules: {
        name: [{ required: true, message: "请输入任务名称", trigger: "blur" }],
         ftype: [
          { required: true, message: "请选择终端类型", trigger: "change" }
        ],
        starttime:[
           { type: 'date', required: true, message: '请选择开始时间', trigger: 'change' }
        ],
        endtime:[
           { type: 'date', required: true, message: '请选择结束时间', trigger: 'change' }
        ],
        meteraddress:[{ required: true, message: "请输入终端逻辑地址", trigger: "blur" }],
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
          value: "vcaddr",
          label: "集中器"
        },
        {
          value: "meter",
          label: "电表"
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

      channel: [
        {
          label: "LTE通道",
          value: 1
        },
        {
          label: "GPRS/CMDA通道",
          value: 2
        },
        {
          label: "LoRa通道",
          value: 3
        },
        {
          label: "微功率通道",
          value: 4
        },
        {
          label: "RS232/RS485通道",
          value: 5
        },
        {
          label: "红外通道",
          value: 6
        },
        {
          label: "NB-IOT通道",
          value: 7
        },
        {
          label: "载波通道",
          value: 8
        },
        {
          label: "ZETA通道",
          value: 9
        },
        {
          label: "ZigBee通道",
          value: 10
        },
        {
          label: "光纤通道",
          value: 11
        },
        {
          label: "网线连接",
          value: 12
        },
        {
          label: "5G通道",
          value: 13
        },
        {
          label: "WIFI通道",
          value: 14
        },
        {
          label: "RS422通道",
          value: 15
        },
        {
          label: "NFC通道",
          value: 16
        },{
          label: "Bluetooth通道",
          value: 17
        },{
          label: "集中器(国网1367.1)",
          value: 18
        },{
          label: "集中器(南网上行公约)",
          value: 19
        },{
           label: "集中器(南网1003公约)",
           value: 20
        }
      ],
      today: "today",
      idselete: [],
      lunci: "",
      loading: true,
      taskobjectid: ""
    };
  },
  mounted() {
    this.search();
    this.getMain()
  },
  methods: {
    getMain(){
        this.options1=[]
        var Mainstation = Parse.Object.extend("MainStationIndex");
        var mainstation = new Parse.Query(Mainstation);
        mainstation.startsWith("name", "C.");
        mainstation.exists("leafs");
        mainstation.ascending("name");
        mainstation.find().then(resultes=>{
          resultes.map(items=>{
           this.options1.push({
              label:items.attributes.name,
              value:items.attributes.leafs
            })
          })
           this.selectdata=this.options1[0].label
       this.selectDi(this.options1[0].value)
        })
      
    },
    selectDi(val){
      this.data=[]
        var DataItem = Parse.Object.extend("DataItem");
        var dataitem = new Parse.Query(DataItem);
        dataitem.containedIn("leafname", val);
        dataitem.limit(1000);
        dataitem.ascending("itemCode");
        dataitem.find().then(res => {
          res.map(item => {
            this.data.push({
              key: item.attributes.itemCode,
              label: `${item.attributes.itemCode +
                "--" +
                item.attributes.itemName}`
            });
          });
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
      this.$refs['taskform'].resetFields();
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
    search() {
      this.loading = true;
      var Crond = Parse.Object.extend("Crond");
      var querycround = new Parse.Query(Crond);
      if (this.valueforsearch != "") {
        querycround.equalTo("name", this.valueforsearch);
      }
      querycround.equalTo("type", 4);
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
          this.taskform.meteraddress = response.attributes.args.pns;
        } else {
          this.taskform.meteraddress = response.attributes.args.pns.join(",");
        }
        this.taskform.freq = response.attributes.args.freq;
        this.taskform.starttime = response.attributes.args.starttime * 1000;
        this.taskform.endtime = response.attributes.args.endtime * 1000;
        this.taskform.downchannel = response.attributes.args.downchannel;
        this.diselect = response.attributes.args.dis;
        this.taskform.upchannel = response.attributes.args.upchannel;
        if(response.attributes.args.frozendate){
           this.taskform.frozendate = response.attributes.args.frozendate * 1000;
        }else{
           this.taskform.frozendate = ''
        }
       
        this.taskobjectid = response.id;
        taskid = response.attributes.tid;
        this.selectchange();
      });
    },
    selectchange() {
      if (this.taskform.unit == "month" || this.taskform.unit == "day") {
        this.spacing = [
          {
            value: "1",
            label: "1"
          }
        ];
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
    enddata() {
      if (this.taskform.endtime <= this.taskform.starttime) {
        this.$message.warning("采集结束时间要小于开始时间");
        this.taskform.endtime = "";
      }
      if (this.taskform.endtime < Date.now() - 2000) {
        this.$message.warning("采集结束时间要大于当前时间");
        this.taskform.endtime = "";
      }
    },
    testdata() {
      if (
        this.taskform.endtime <= this.taskform.starttime &&
        this.taskform.endtime != "" &&
        this.taskform.endtime != null
      ) {
        this.$message.warning("采集结束时间要小于开始时间");
        this.taskform.starttime = "";
      }
      if (this.taskform.starttime < Date.now() - 2000) {
        this.$message.warning("采集开始时间要大于当前时间");
        this.taskform.starttime = "";
      }
    },
    Meterdetail(row) {
      this.$router.push({
        path: "/tasksmanage/schedule",
        query: {
          name: row.attributes.name,
          id: row.attributes.tid,
          starttime: row.attributes.args.starttime,
          freq: row.attributes.args.freq,
          unit: row.attributes.args.unit,
          downchannel: JSON.stringify(row.attributes.args.chs),
          di: JSON.stringify(row.attributes.args.dis),
          frozendate: row.attributes.args.frozendate
        }
      });
    },
    //编辑和新增
    convartion(formName) {
      this.$refs[formName].validate((valid) => {
          if (valid) {
           if(this.diselect.length==0){
             this.$message.error('请选择数据项标识')
           }else{
              var meter = [];
      var vcaddr = "";
      taskid = Math.floor(Math.random() * 128 + 1);
      if (this.taskform.meteraddress.indexOf("all") != -1) {
        vcaddr = "all";
      } else {
        vcaddr = this.taskform.meteraddress.split(",");
      }
      var arr = [];
      var unit = "";
      if (this.taskform.unit == "day") {
        unit = 2;
      } else if (this.taskform.unit == "hour") {
        unit = 1;
      } else if (this.taskform.unit == "minute") {
        unit = 0;
      } else {
        unit = "";
      }

      this.taskform.downchannel.map(items => {
        arr.push([items.type, items.interval]);
      });
      var Crond = Parse.Object.extend("Crond");
      var crond = new Crond();
      var querycround = new Parse.Query(Crond);
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
          fdate: this.taskform.frozendate / 1000
        });
      } else {
        crond.set("task", {
          di: this.diselect,
          chs: arr,
          pns: vcaddr,
          res: this.taskform.upchannel
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
        starttime: timetounix(this.taskform.starttime)
      });
      crond.set("active", 1);
      crond.set("type", 4);
      crond.set("name", this.taskform.name);
      crond.set("crond", {
        end_time: timetounix(this.taskform.endtime),
        freq: Number(this.taskform.freq),
        unit: unit,
        start_time: timetounix(this.taskform.starttime)
      });
      crond.set("tid", taskid);
      crond.set("typedesc", "周期任务");

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
            console.log('error submit!!');
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
        this.$message.warning("请勾选要删除的任务");
      }
    }
  }
};
</script>
<style scoped>
.tasklist {
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
.tasklist .el-dialog__footer {
  padding-bottom: 50px;
}
.tasklist .el-dialog {
  bottom: 40px;
}
.tasklist .dialog .children,
.dialog .starttime {
  margin-top: 20px;
  width: 50%;
}
.tasklist .dialog .notchildren {
  margin-top: 20px;
  width: 100%;
}
.tasklist .dialog .children label,
.tasklist .dialog .notchildren label:not(.notfloat),
.tasklist .dialog .starttime label {
  margin-top: 10px;
  width: 120px;
  text-align: right;
  float: left;
}
.tasklist .children .el-input--suffix {
  width: 200px;
}
.tasklist .starttime .el-input--suffix {
  width: 100px;
}
.tasklist .el-transfer {
  display: flex;
  align-items: center;
  justify-content: center;
}
.tasklist .el-transfer-panel {
  width: 300px;
}
.tasklist .el-transfer__button:first-child {
  position: relative;
  top: 50px;
}
.tasklist .el-transfer__button:nth-child(2) {
  position: relative;
  top: -50px;
}
.tasklist .el-picker-panel__sidebar + .el-picker-panel__body {
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
.dialog .el-col-11 .el-form-item{
  width:100%;
}
.lineone .flexg{
   display: flex;
  margin-top: 20px;
}
.lineone .elformcontent .el-input__inner {
  width: 200px;
}
.tasklist .el-transfer-panel .el-transfer-panel__footer{
  top:40px;
  text-align:center;
  height:50px;
}
.tasklist .el-transfer-panel__filter{
  visibility: hidden;
}
.tasklist .el-transfer-panel .el-transfer-panel__footer .el-select{
  width:80%;
}
.tasklist .el-transfer-panel .el-transfer-panel__footer .el-select>.el-input{
  margin-top:15px;
}
.tasklist .el-transfer-panel .el-transfer-panel__footer .el-input--small .el-input__inner{
  border-radius:16px;
}
</style>

