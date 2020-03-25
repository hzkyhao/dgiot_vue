<template>
  <div id="monitoring">
    <Resource1 class="resource1" @meterdetail="getRows" />
    <div class="content">
      <div class="form">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="终端类型">
            <el-select
              v-model="form.terminal_type"
              @change="handleTypeChange"
              placeholder="请选择终端类型"
            >
              <el-option label="集中器" :value="1"></el-option>
              <el-option label="电能表" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="终端型号">
            <el-select
              v-model="form.terminal_model"
              @change="handleModelChange"
              placeholder="请选择终端型号"
            >
              <el-option label="全部"   :value="0" v-show="form.terminal_type==2"></el-option>
              <el-option label="单相智能电表" :value="1" v-show="form.terminal_type==2"></el-option>
              <el-option label="三相智能电表" :value="2" v-show="form.terminal_type==2"></el-option>
              <el-option label="电力集中器" :value="3" v-show="form.terminal_type==1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="终端地址">
            <el-input v-model="form.terminal_addr" placeholder="请选择终端地址"></el-input>
          </el-form-item>
          <el-form-item label="在线状态">
            <el-select v-model="form.isOnline" placeholder="请选择在线状态">
              <el-option label="全部" :value="2"></el-option>
              <el-option label="在线" :value="1"></el-option>
              <el-option label="离线" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="query">查询</el-button>
            <el-button type="primary" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="noData" v-if="!noData">
        <p>暂无数据</p>
      </div>
      <div class="detail animated fadeIn" v-if="form.terminal_type=='2'">
        <div class="operation" v-show="operation.tq">
          <div class="summarize">
            <el-card shadow="hover">
              <div slot="header">
                <span>运行概况</span>
              </div>
              <ul class="con">
                <li>
                  台区总数：
                  <span>
                    <strong>{{operation.tq}}</strong>个
                  </span>
                </li>
                <li>
                  集中器总数：
                  <span>
                    <strong>{{operation.vcaddr}}</strong>台
                  </span>
                </li>
                <li>
                  电能表总数：
                  <span>
                    <strong>{{operation.addr}}</strong>台
                  </span>
                </li>
                <li>
                  单相电能表总数：
                  <span>
                    <strong>{{operation.single_meter}}</strong>台
                  </span>
                </li>
                <li>
                  三相电能表总数：
                  <span>
                    <strong>{{operation.triple_meter}}</strong>台
                  </span>
                </li>
                <li>
                  当日冻结电量：
                  <span>
                    <strong>{{operation.count_day}}</strong>KWh
                  </span>
                </li>
                <li>
                  上日用电总量：
                  <span>
                    <strong>{{operation.day}}</strong>KWh
                  </span>
                </li>
                <li>
                  当月冻结电量：
                  <span>
                    <strong>{{operation.count_month}}</strong>KWh
                  </span>
                </li>
                <li>
                  当上月用电总量：
                  <span>
                    <strong>{{operation.month}}</strong>KWh
                  </span>
                </li>
              </ul>
            </el-card>
          </div>
          <div class="statistics">
            <el-card shadow="hover">
              <div slot="header">
                <span>状态统计</span>
              </div>
              <ul class="con">
                <li ref="pie1" style="height:120px;"></li>
                <li ref="pie2" style="height:120px;"></li>
                <li ref="pie3" style="height:120px;"></li>
                <li ref="pie4" style="height:120px;"></li>
              </ul>
            </el-card>
          </div>
        </div>
        <ul class="table">
          <li v-for="item of electricity" :key="item.id" :class="{offLine_border:!item.status}">
            <div class="img">
              <svg-icon icon-class="electricEnergyMeter4" v-if="item.sblx=='1'"></svg-icon>
              <svg-icon icon-class="electricEnergyMeter5" v-else></svg-icon>
            </div>
            <div class="info">
              <p>
                {{item.sblx | type}}:
                <span :class="[item.status?'normal':'offLine']">({{item.addr}})</span>
              </p>
              <p>
                pn值:{{item.pn}}
                
                <span :class="[item.status?'normal':'offLine']">{{item.status | Online}}</span>
              </p>
              <div>
                <p>
                  当日冻结电量：
                  <span
                    style="line-height:25px"
                    :class="[item.status?'normal':'offLine']"
                  >{{item.freeze_day}}KWh</span>
                </p>
                <p>
                  当月冻结电量：
                  <span
                    style="line-height:25px"
                    :class="[item.status?'normal':'offLine']"
                  >{{item.freeze_month}}KWh</span>
                </p>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="detail animated fadeInUp" v-if="form.terminal_type=='1'">
        <div class="operation" v-show="operation.tq">
          <div class="summarize">
            <el-card shadow="hover">
              <div slot="header">
                <span>运行概况</span>
              </div>
              <ul class="con">
                <li>
                  台区总数：
                  <span>
                    <strong>{{operation.tq}}</strong>个
                  </span>
                </li>
                <li>
                  集中器总数：
                  <span>
                    <strong>{{operation.vcaddr}}</strong>台
                  </span>
                </li>
                <li>
                  电能表总数：
                  <span>
                    <strong>{{operation.addr}}</strong>台
                  </span>
                </li>
                <li>
                  单相电能表总数：
                  <span>
                    <strong>{{operation.single_meter}}</strong>台
                  </span>
                </li>
                <li>
                  三相电能表总数：
                  <span>
                    <strong>{{operation.triple_meter}}</strong>台
                  </span>
                </li>
                <li>
                  当日冻结电量：
                  <span>
                    <strong>{{operation.count_day}}</strong>KWh
                  </span>
                </li>
                <li>
                  上日用电总量：
                  <span>
                    <strong>{{operation.day}}</strong>KWh
                  </span>
                </li>
                <li>
                  当月冻结电量：
                  <span>
                    <strong>{{operation.count_month}}</strong>KWh
                  </span>
                </li>
                <li>
                  当上月用电总量：
                  <span>
                    <strong>{{operation.month}}</strong>KWh
                  </span>
                </li>
              </ul>
            </el-card>
          </div>
          <div class="statistics">
            <el-card shadow="hover">
              <div slot="header">
                <span>状态统计</span>
              </div>
              <ul class="con">
                <li ref="pie1" style="height:120px;"></li>
                <li ref="pie2" style="height:120px;"></li>
                <li ref="pie3" style="height:120px;"></li>
                <li ref="pie4" style="height:120px;"></li>
              </ul>
            </el-card>
          </div>
        </div>
        <ul class="table">
          <li class="con" v-for="item of vcon" :key="item.id">
            <div class="img">
              <svg-icon icon-class="electricEnergyMeter3"></svg-icon>
            </div>
            <div class="info">
              <p>
                {{item.name}}
                <strong :class="[item.online ? 'normal' : 'offLine']">({{item.addr}})</strong>
                <span  v-if="item.online" class="breathe-btn" style="display:inline-block;float:right;" :style="{'background-image':item.online ? '-webkit-gradient(linear,left top,left bottom,from(#ffffff),to(green))': '-webkit-gradient(linear,left top,left bottom,from(#ffffff),to(red))'}"></span>
                <span  v-if="!item.online" :class="[item.online ? 'normal' : 'offLine']">{{item.online | Online}}</span>
              </p>
              <p>所属台区：{{item.tq}}</p>
              <p>终端通信地址：{{item.host}}</p>
              <p
                :class="[item.masterstation ? 'normal' : 'offLine']"
              >主站连接状态：{{item.masterstation | Master}}</p>
              <p style="color:#4B8BF4;">本地时钟：{{readtime}}</p>
              <p >实时采集电量：<i class="bounceIn" style="font-style:normal">{{(item.data/2).toFixed(2)+'/kWh'}}</i></p>
              <div>
                <p>在线电表：{{item.count_online_meter}}/{{item.count_meter}}</p>
                <p class="mr-30">当日抄表情况:{{item.count_online_meter}}/{{item.count_meter}}</p>
                <p class="mr-30" style="color:#57b12b;">成功率：{{item.success_rate}}</p>
                <p class="mr-30" style="color:#57b12b;">上报成功率：{{item.report_rate}}</p>
              </div>
              <div>
                <p style="color:#EB3941">告警记录：{{item.alarm_record}}</p>
                <p style="color:#e8c052" class="mr-30">事件记录：{{item.event_record}}</p>
              </div>
              <div>
                <p style="color:#EB3941">重要告警：{{item.important_alarm_record}}</p>
                <p style="color:#e8c052" class="mr-30">重点事件：{{item.important_event_record}}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <!-- 电表分页 -->
      <PagingQuery
        v-if="form.terminal_type=='2'"
        :pager="Mpager"
        :pageShow="false"
        @setPager="getElectricityData(objId)"
      />
      <!-- 集中器分页 -->
      <PagingQuery
        v-if="form.terminal_type=='1'"
        :pager="Vpager"
        :pageShow="false"
        @setPager="getVconData(objId)"
      />
    </div>
  </div>
</template>

<script>
import Resource1 from "@/components/resource/resource";
import Parse from "parse";
import { utc2beijing } from "@/utils/index";
import PagingQuery from "@/components/Pagination";
import {
  getMeterStatistic,
  getElectricity,
  getVcon,
  QueryMeter,
  QueryVcon
} from "@/api/meterMonitoring";
export default {
  data() {
    return {
      noData: true,
      list_loading: true,
      data: [],
      // 电表分页
      Mpager: {
        count: 0, //总数
        page: 1, //当前页
        rows: 25, //每页数量
        pages: [25] //分页数组
      },
      // 集中器分页
      Vpager: {
        count: 0,
        page: 1,
        rows: 9,
        pages: [9]
      },
      form: {
        terminal_type: 1, //终端类型
        terminal_addr: "", //终端地址
        terminal_model:3, //终端型号
        isOnline: 2 //在线状态
      },
      // 运行信息
      operation: {},
      operationShow: false,
      electricity: [], //电能表数据
      vcon: [], //集中器数据
      // 饼状图数据
      data1: ["已覆盖", "未覆盖"],
      data2: ["在线", "离线"],
      data3: ["成功", "失败"],
      data4: ["及时", "超时"],
      value1: [],
      value2: [],
      value3: [],
      value4: [],
      time: parseInt(new Date().getTime() / 1000), //时间，默认当天时间,秒
      objId: "", //当然选中的树id
      Time: "",
      timer: [], //定时器组,
      readtime:'',
      timeronce:null
    };
  },
  mounted() {
   
    this.getTree();
     this.$nextTick(function () {
        setInterval(this.nowtime, 1000);
    })
    window.clearInterval(this.timeronce)
    this.settime()
  },
  methods: {
     nowtime(){
            var timestamp3 = Date.parse(new Date());
            var date = new Date(timestamp3) 
            var Y = date.getFullYear() + '-';
            var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
            var D = (date.getDate()+1 <= 10 ? '0'+(date.getDate()) : date.getDate()) + ' ';
            var h = (date.getHours()+1 <= 10 ? '0'+(date.getHours()) : date.getHours())  + ':';
            var m = (date.getMinutes()+1 <= 10 ? '0'+(date.getMinutes()) : date.getMinutes())  + ':';
            var s = (date.getSeconds()+1 <= 10 ? '0'+(date.getSeconds()) : date.getSeconds());
            this.readtime=(Y+M+D+h+m+s); 
      },
      settime(){
      this.timeronce = window.setInterval(()=>{
        this.query()
        },5000)
      },
    query() {
      //查询
      let time = parseInt(new Date().getTime() / 1000);
      // if (this.form.terminal_type == 1) {
      //   this.Vpager.page = 1;
      //   QueryVcon(
      //     this.form.terminal_addr,
      //     this.form.isOnline,
      //     time,
      //     this.Vpager.rows,
      //     this.Vpager.rows * (this.Vpager.page - 1)
      //   )
      //     .then(res => {
      //       // console.log(res);
      //       this.vcon = [];
      //       this.Vpager.count = res.count;
      //       let data = res.data;
      //       for (let i = 0; i < data.length; i++) {
      //         let obj = {};
      //         obj.name = "电力集中器";
      //         obj.img = 3;
      //         obj.id = i;
      //         obj.status = data[i].online;
      //         obj.tq = data[i].tq;
      //         obj.addr = data[i].vcaddr;
      //         obj.host = data[i].host;
      //         obj.success_rate = data[i].success_rate + "%";
      //         obj.report_rate = data[i].report_rate + "%";
      //         obj.masterstation = data[i].masterstation;
      //         obj.reported = data[i].report_rate;
      //         if (!obj.reported) obj.reported = "0%";
      //         obj.day_data = data[i].day_data;
      //         if (!obj.day_data) obj.day_data = 0;
      //         obj.alarm_record = data[i].alarm_record;
      //         obj.event_record = data[i].event_record;
      //         obj.important_alarm_record = data[i].important_alarm_record;
      //         obj.important_event_record = data[i].important_event_record;
      //         obj.count_meter = data[i].count_meter;
      //         obj.online = data[i].online;
      //         obj.count_online_meter = data[i].count_online_meter;
      //         if (!obj.count_online_meter) obj.count_online_meter = 0;
      //         this.vcon.push(obj);
      //       }
      //       this.noData = true;
      //     })
      //     .catch(error => {
      //       this.$message.error(error.error);
      //     });
      // } else {
      //   let Mtype = "all";
      //   if (this.form.terminal_model == 1) {
      //     Mtype = "single_meter";
      //   } else if (this.form.terminal_model == 2) {
      //     Mtype = "triple_meter";
      //   }
      //   this.Mpager.page = 1;
      //   QueryMeter(
      //     this.form.terminal_addr,
      //     this.form.isOnline,
      //     time,
      //     this.Mpager.rows,
      //     this.Mpager.rows * (this.Mpager.page - 1),
      //     Mtype
      //   )
      //     .then(res => {
      //       // console.log(res);
      //       this.electricity = [];
      //       this.Mpager.count = res.count;
      //       let data = res.data;
      //       for (let i = 0; i < data.length; i++) {
      //         let obj = {};
      //         obj.id = i;
      //         obj.addr = data[i].addr;
      //         obj.status = data[i].online;
      //         obj.pn = data[i].pn;
      //         obj.freeze_day = data[i].day_data;
      //         obj.freeze_month = data[i].month_data;
      //         obj.sblx = data[i].sblx;
      //         if (obj.freeze_day === null) obj.freeze_day = 0;
      //         if (obj.freeze_month === null) obj.freeze_month = 0;
      //         this.electricity.push(obj);
      //       }
      //       this.noData = true;
      //     })
      //     .catch(error => {
      //       this.$message.error(error.error);
      //     });
      // }
      if (this.form.terminal_type == 1) {
          this.form.terminal_model = 3;
        if(this.form.terminal_addr!=''){ 
          var Vcon = Parse.Object.extend('Vcon')
          var vcon = new Parse.Query(Vcon)
          vcon.equalTo('vcaddr',this.form.terminal_addr)
          vcon.find().then(resultes=>{
            this.objId = resultes[0].id
            this.getVconData(this.objId);
          },error=>{
            console.log(error.message)
          })
        }else{
          this.getVconData(this.objId);
        }
      } else {
        if(this.form.terminal_addr!=''){ 
          var Vcon = Parse.Object.extend('Vcon')
          var vcon = new Parse.Query(Vcon)
          vcon.equalTo('vcaddr',this.form.terminal_addr)
          vcon.find().then(resultes=>{
            this.objId = resultes[0].id
            // this.form.terminal_model = 0;
            this.getElectricityData(this.objId);
          },error=>{
            console.log(error.message)
          })
        }else{
          // this.form.terminal_model = 0;
          this.getElectricityData(this.objId);
        }
       
      }
    },
    reset() {
      //重置
      this.form.terminal_type = 2;
      this.form.addr = "";
      this.form.terminal_model = 0;
      this.form.isOnline = 2;
    },
    // 饼状图
    pie_chart(el, title, data, value) {
      let pie = this.$echarts.init(el);
      pie.setOption(
        {
          title: {
            text: title,
            x: "40%",
            textStyle: {
              fontSize: "15",
              fontWeight: "bold"
            }
          },
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b}: {c} ({d}%)",
            textStyle: {
              fontSize: "12"
            },
            position: ["50%", "50%"]
          },
          legend: {
            orient: "vertical",
            x: "left",
            data
          },
          calculable: true,
          series: [
            {
              type: "pie",
              radius: ["40%", "60%"],
              center: ["60%", "50%"],
              selectedMode: "single",
              label: {
                normal: {
                  position: "center",
                  formatter(params) {
                    if (params.dataIndex == 0) {
                      return params.percent + "%";
                    } else {
                      return " ";
                    }
                  }
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: "13",
                    fontWeight: "bold"
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: value
            }
          ]
        },
        true
      );
    },
    pie_data() {
      this.pie_chart(this.$refs.pie1, "台区覆盖率", this.data1, this.value1);
      this.pie_chart(this.$refs.pie2, "终端在线率", this.data2, this.value2);
      this.pie_chart(this.$refs.pie3, "抄表成功率", this.data3, this.value3);
      this.pie_chart(this.$refs.pie4, "抄表及时率", this.data4, this.value4);
    },
    // 分页
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.Mpager.page = val;
      this.getElectricityData(this.objId);
    },
    handleCurrentChange2(val) {
      // console.log(`当前页: ${val}`);
      this.Vpager.page = val;
      this.getVconData(this.objId);
    },
    // 切换类型
    handleTypeChange() {
      if (this.form.terminal_type == 1) {
          this.form.terminal_model = 3;
        if(this.form.terminal_addr!=''){ 
          var Vcon = Parse.Object.extend('Vcon')
          var vcon = new Parse.Query(Vcon)
          vcon.equalTo('vcaddr',this.form.terminal_addr)
          vcon.find().then(resultes=>{
            this.objId = resultes[0].id
            this.getVconData(this.objId);
          },error=>{
            console.log(error.message)
          })
        }else{
          this.getVconData(this.objId);
        }
      } else {
        if(this.form.terminal_addr!=''){ 
          var Vcon = Parse.Object.extend('Vcon')
          var vcon = new Parse.Query(Vcon)
          vcon.equalTo('vcaddr',this.form.terminal_addr)
          vcon.find().then(resultes=>{
            this.objId = resultes[0].id
            this.form.terminal_model = 0;
            this.getElectricityData(this.objId);
          },error=>{
            console.log(error.message)
          })
        }else{
          this.form.terminal_model = 0;
          this.getElectricityData(this.objId);
        }
       
      }
    },
    // 切换型号
    handleModelChange() {
      if (this.form.terminal_type == 1) {
        this.getVconData(this.objId);
      } else {
        this.getElectricityData(this.objId);
      }
    },
    // 获取资源树初始化数据
    getTree() {
      var Department = Parse.Object.extend("Department");
      var department = new Parse.Query(Department);
      // department.limit(10000);
      department.equalTo("ParentId", "0");
      department.find().then(
        resultes => {
          this.data = [];
          this.objId = resultes[0].id;
          resultes.map(items => {
            var obj = {};
            items.createtime = utc2beijing(items.attributes.createdAt);
            (obj.name = items.attributes.name),
              (obj.ParentId = items.attributes.ParentId);
            obj.objectId = items.id;
            obj.createtime = items.createtime;
            obj.icon = items.attributes.org_type;
            obj.is_show = items.attributes.leafnode;
            this.data.push(obj);
          });
          this.list_loading = false;
           this.query();
          // this.getVconData(this.objId);
        },
        error => {
          if (error.code == "209") {
            this.$message({
              type: "alarm_record",
              message: "登陆权限过期，请重新登录"
            });
            this.$router.push({
              path: "/login"
            });
          }
        }
      );
    },
    // 获取树id
    getRows(row) {
      // console.log(row)
      this.form.terminal_addr = "";
      if (this.objId != "") {
        this.clearTimer();
        this.objId = row.objectId;
        if (row.icon == "集中器") {
          this.form.terminal_type = 1;
          this.form.terminal_model = 3;
          this.form.terminal_addr = row.name;
           if (this.form.terminal_type == 1) {
          this.query();
        } else {
          this.getElectricityData(row.objectId);
        }
        }else{
          this.query();
        }
       
        // this.query();
      } 
    },
    // 修改统计数据
    setVlaue(arr_name, arr_val, ...vals) {
      let color = [{ color: "#0CA394" }, { color: "#D73948" }];
      for (let i = 0; i < arr_name.length; i++) {
        let obj = {};
        obj.name = arr_name[i];
        obj.value = vals[i];
        obj.itemStyle = color[i];
        arr_val.push(obj);
      }
    },
    // 获取统计数据
    getData(objId, time) {
      getMeterStatistic(objId, time)
        .then(res => {
          // console.log(res);
          if (res.status_statistic) {
            let Stat = res.status_statistic;
            let all_meter = Stat.all_meter; //总表数
            this.operation = res.survey; //运行概况
            setTimeout(() => {
              if (this.operation.tq) {
                this.value1 = [];
                this.value2 = [];
                this.value3 = [];
                this.value4 = [];
                this.setVlaue(
                  this.data1,
                  this.value1,
                  Stat.all_tq,
                  Stat.all_tq - Stat.online_tq
                );
                this.setVlaue(
                  this.data2,
                  this.value2,
                  all_meter,
                  all_meter - Stat.online_tq
                );
                this.setVlaue(
                  this.data3,
                  this.value3,
                  Stat.success_meter,
                  all_meter
                );
                this.setVlaue(
                  this.data4,
                  this.value4,
                  Stat.intime_meter,
                  all_meter - Stat.intime_meter
                );
                this.pie_data();
              }
            }, 1);
          }
        })
        .catch(error => {
          this.$message.error(error.error);
        });
    },
    // 获取电表信息
    getElectricityData(objId) {
      let metertype = "all";
      // 判断是单相还是三相
      if (this.form.terminal_model == 1) {
        metertype = "single_meter";
      } else if (this.form.terminal_model == 2) {
        metertype = "triple_meter";
      }
      getElectricity(
        objId,
        this.time,
        this.Mpager.rows,
        (this.Mpager.page - 1) * this.Mpager.rows,
        metertype
      )
        .then(res => {
          // console.log(res);
          if (res.data.length == 0) {
            this.noData = false;
          } else {
            this.noData = true;
          }
          let r = res.data;
          this.Mpager.count = res.count;
          this.electricity = [];
          if (metertype == "single_meter") {
            this.Mpager.count = res.count;
          } else {
            this.Vpager.count = res.count;
          }
          for (let i = 0; i < r.length; i++) {
            let obj = {};
            obj.id = i;
            obj.addr = r[i].addr;
            obj.status = r[i].online;
            if (!obj.status) obj.status = false;
            obj.pn = r[i].pn;
            obj.freeze_day = r[i].day_data;
            obj.freeze_month = r[i].month_data;
            obj.sblx = r[i].sblx;
            if (obj.freeze_day === null) obj.freeze_day = 0;
            if (obj.freeze_month === null) obj.freeze_month = 0;
            this.electricity.push(obj);
          }
        })
        .catch(error => {
          this.$message.error(error.error);
        });
    },
    // 获取集中器信息
    getVconData(objId) {
      getVcon(
        objId,
        this.time,
        this.Vpager.rows,
        (this.Vpager.page - 1) * this.Vpager.rows
      )
        .then(res => {
          if (res.count == 0) {
            this.noData = false;
          } else {
            this.noData = true;
          }
          this.vcon = [];
          this.Vpager.count = res.count;
          let r = res.data;
          for (let i = 0; i < r.length; i++) {
            let obj = {};
            obj.name = "电力集中器";
            obj.img = 3;
            obj.id = i;
            obj.status = r[i].online;
            if (!obj.status) obj.status = false;
            obj.tq = r[i].tq;
            obj.addr = r[i].vcaddr;
            obj.host = r[i].host;
            obj.report_rate = 100.00 + "%";
            obj.success_rate = 100.00 + "%";
            obj.day_data = r[i].day_data;
            if (!obj.day_data) obj.day_data = 0;
            obj.alarm_record = r[i].alarm_record;
            obj.event_record = r[i].event_record;
            obj.masterstation = 'normal'
            obj.important_alarm_record = r[i].important_alarm_record;
            obj.important_event_record = r[i].important_event_record;
            obj.count_meter = r[i].count_meter;
            obj.online = 'normal';
            obj.data = r[i].data
            obj.count_online_meter = r[i].count_online_meter;
            if (!obj.count_online_meter) obj.count_online_meter = 0;
            this.vcon.push(obj);
          }
        })
        .catch(error => {
          this.$message.error(error.error);
        });
    },
    // 清除定时器
    clearTimer() {
      for (let i in this.timer) {
        clearInterval(this.timer[i]);
      }
    }
  },
  beforeDestroy() {
    // 清除定时器
    this.clearTimer();
    window.clearInterval(this.timeronce)
    this.timeronce=null
  },
  // 过滤器
  filters: {
    // 在线和离线
    Online(value) {
      if (value) {
        return "运行正常";
      } else {
        return "设备离线";
      }
    },
    // 主站连接状态
    Master(value) {
      if (value) {
        return "已连接";
      } else {
        return "未连接";
      }
    },
    // 终端型号
    type(value) {
      if (value == "1") {
        return "单相智能电表";
      } else {
        return "三相智能电表";
      } 
    }
  },
  components: { Resource1, PagingQuery }
};
</script>

<style lang="scss" scoped>
#monitoring {
  display: flex;
  .resource1 {
    width: 360px;
    height: 100vh;
    overflow: scroll;
    flex-shrink: 0;
    padding-top: 10px;
  }
  .menu {
    // width: 20%
    margin-right: 20px;
  }
  .content {
    // flex-grow:1;
    width: calc(100% - 360px);
    .noData {
      text-align: center;
      margin: 100px 0;
    }
    /deep/ .el-form {
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      margin-top: 10px;
      /deep/ .el-form-item {
        width: 20%;
        .el-input {
          width: 150px;
        }
        input {
          height: 26px;
          width: 150px;
          border-radius: 0;
          line-height: 26px;
        }
        .el-form-item__content {
          margin: 0 !important;
          button {
            height: 26px;
            line-height: 26px;
            padding: 0 10px;
          }
        }
      }
    }
    .fade-enter-active,
    .fade-leave-active {
      transition: opacity 0.5s;
    }
    .fade-enter,
    .fade-leave-to {
      opacity: 0;
    }
    .detail {
      display: flex;
      .operation {
        // width:250px;
        .summarize {
          width: 250px;
        }
        .summarize,
        .statistics {
          margin-top: 10px;
          /deep/ .el-card {
            font-size: 16px;
            /deep/ .el-card__header {
              padding: 5px 10px;
              color: #fff;
              background-color: #1063a7;
            }
            .el-card__body {
              padding: 2px 10px;
              li {
                padding: 2px 0;
                span {
                  float: right;
                  strong {
                    color: #044e8a;
                    font-weight: normal;
                  }
                }
              }
            }
          }
        }
      }
      .table {
        padding: 0;
        margin: 10px 0 0 20px;
        list-style: none;
        li {
          width: 290px;
          display: flex;
          border: 1px solid #dfdfdf;
          height: 120px;
          margin: 0 0.5rem 0.5rem 0;
          float: left;
          .img {
            width: 25%;
            margin: 20px 0 0 -8px;
            border-right: 1px solid #dfdfdf;
            svg {
              font-size: 80px;
            }
          }
          // 电能表信息
          .info {
            width: 85%;
            font-size: 13px;
            padding: 18px 5px;
            div {
              display: flex;
            }
            p {
              margin: 0;
              padding-bottom: 15px;
              span {
                float: right;
                margin-right: 20px;
              }
            }
          }
        }
        // 集中器信息
        li.con {
          height: 240px;
          width: 405px;
          .img {
            width: 35%;
            margin: 30px 10px 10px -35px;
            svg {
              font-size: 180px;
            }
          }
          .info {
            div {
              flex-wrap: wrap;
              justify-content: space-between;
            }
            p {
              padding-bottom: 8px;
            }
          }
        }
      }
    }
  }
}
.mr-30 {
  margin-right: 30px !important;
}
// 正常样式
.normal {
  color: #57b12b;
}
// 离线样式
.offLine {
  color: #df2232;
}
.offLine_border {
  border: 1px #df2232 solid !important;
}
/deep/ .el-select-dropdown.el-popper:not(4) {
  top: 130px !important;
}
/deep/ .el-card .con {
  font-size: 14px;
  list-style: none;
  padding: 0;
}
#monitoring .el-pagination {
  margin: 20px 0;
  text-align: center;
}
</style>
<style>
  .breathe-btn {
      position:relative;
      width:30px;
      height:10px;
      line-height:40px;
      border:1px solid #2b92d4;
      border-radius:5px;
      color:#fff;
      font-size:20px;
      text-align:center;
      cursor:pointer;
      /* box-shadow:0 1px 2px rgba(0,0,0,.3); */
      overflow:hidden;
      /* background-image:-webkit-gradient(linear,left top,left bottom,from(black),to(green)); */
      animation-timing-function:ease-in-out;
      animation-name:breathe;
      animation-duration:2000ms;
      animation-iteration-count:infinite;
      animation-direction:alternate;
    }
    @keyframes breathe {
      0% {
      opacity:.2;
      /* box-shadow:0 1px 2px rgba(255,255,255,0.1); */
    }
    100% {
      opacity:1;
      /* border:1px solid rgba(59,235,235,1); */
      /* box-shadow:0 1px 30px rgba(59,255,255,1); */
    }
  }
  @-webkit-keyframes bounceIn {
  from,
  /* 20%,
  40%,
  60%, */
  80%,
  to {
    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

   0% {
    opacity: 0;
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }

  /*20% {
    -webkit-transform: scale3d(1.1, 1.1, 1.1);
    transform: scale3d(1.1, 1.1, 1.1);
  }

  40% {
    -webkit-transform: scale3d(0.9, 0.9, 0.9);
    transform: scale3d(0.9, 0.9, 0.9);
  }

  60% {
    opacity: 1;
    -webkit-transform: scale3d(1.03, 1.03, 1.03);
    transform: scale3d(1.03, 1.03, 1.03);
  } */

  80% {
    -webkit-transform: scale3d(0.9, 0.9, 0.9);
    transform: scale3d(0.9, 0.9, 0.9);
  }

  to {
    opacity: 1;
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }
}

@keyframes bounceIn {
  from,
  /* 20%,
  40%,
  60%, */
  80%,
  to {
    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

   0% {
    opacity: 0;
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }

  /*20% {
    -webkit-transform: scale3d(1.1, 1.1, 1.1);
    transform: scale3d(1.1, 1.1, 1.1);
  }

  40% {
    -webkit-transform: scale3d(0.9, 0.9, 0.9);
    transform: scale3d(0.9, 0.9, 0.9);
  }

  60% {
    opacity: 1;
    -webkit-transform: scale3d(1.03, 1.03, 1.03);
    transform: scale3d(1.03, 1.03, 1.03);
  } */

  80% {
    -webkit-transform: scale3d(0.9, 0.9, 0.9);
    transform: scale3d(0.9, 0.9, 0.9);
  }

  to {
    opacity: 1;
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }
}

.bounceIn {
  font-size:15px;
  color:red;
  -webkit-animation-duration: 5s;
  animation-duration: 5s;
  -webkit-animation-name: bounceIn;
  animation-name: bounceIn;
  animation-iteration-count:infinite
}
</style>
