<template>
  <div class="zetatest">
    <div style="height:300px;width:300px">
      <el-steps direction="vertical">
        <el-step title="测试步骤 1" icon="el-icon-caret-bottom" description="启动测试机"></el-step>
        <el-step title="测试步骤 2" icon="el-icon-caret-bottom" description="启动服务机"></el-step>
        <el-step title="测试步骤 3" icon="el-icon-success" description="启动场景参数"></el-step>
      </el-steps>
    </div>
    <!--测试步骤-->
    <div class="active" style="width:calc(100% - 300px);">
      <!--测试步骤一-->
      <h5>启动服务机：</h5>
      <el-form ref="testform2" :model="testform2" :rules="testform2rule" label-width="120px">
        <el-form-item label="服务机IP" prop="ip">
          <!-- <el-input v-model="testform2.ip" placeholder="请输入IP"></el-input> -->
          <el-select v-model="testform2.ip" placeholder="请选择服务器IP" @change="test2Select">
            <el-option
              v-for="(items,index) in server"
              :label="items.label"
              :value="items.value"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务机端口" prop="port">
          <el-input v-model.number="testform2.port" placeholder="请输入端口"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="startServer('testform2')" size="small">启动服务机</el-button>
          <el-button type="danger" @click="stopServer('testform2')" size="small">停止服务机</el-button>
        </el-form-item>
      </el-form>
      <!--测试步骤二-->
      <h5 style="margin-top:50px;">启动测试机：</h5>
      <el-form ref="testform1" :model="testform1" :rules="testform1rule" label-width="120px">
        <el-form-item label="测试机IP" prop="ip">
          <el-select v-model="testform1.ip" placeholder="请选择服务器IP" @change="test1Select">
            <el-option
              v-for="(items,index) in benchmark"
              :lable="items.label"
              :value="items.value"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="测试机端口" prop="port">
          <el-input v-model.number="testform1.port" placeholder="请输入端口"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="startTest('testform1')" size="small">启动测试机</el-button>
          <el-button type="danger" @click="stopTest('testform1')" size="small">停止测试机</el-button>
        </el-form-item>
      </el-form>
      <!-- <div>
        <el-form label-width="120px">
            <el-form-item label="启动状态">
              <img style="vertical-align:middle" :src="loadingimg" alt="" srcset="">
            </el-form-item>
        </el-form>
      </div> -->

      <!--测试步骤三-->
      <h5 style="margin-top:50px;margin-bottom:20px;">压测场景参数：</h5>
      <el-button type="success" size="small" @click="startPlugin1">启动测试插件</el-button>
      <el-button type="info" size="small">启动压力测试</el-button>
      <el-button type="danger" size="small">停止压力测试</el-button>
      <el-button type="primary" size="small" @click="goToDashboard">查看压测展示</el-button>
      <div :class="statusBar" style="margin-top:30px;" id="statuBar">
        <el-row>
          <el-col :span="12">
            <span>测试状态:</span>
            &nbsp;&nbsp;
          </el-col>
          <el-col :span="12" v-if="statusBar=='success'">
            <span>开始时间:</span>
            &nbsp;&nbsp;
          </el-col>
        </el-row>
      </div>
      <div v-if="statusBar=='success'">
        <iframe id="gIframe" width="100%" height="520" src="http://prod.iotn2n.com:3000" frameborder="0" allowfullscreen=""></iframe>
      </div>
      <el-form
        ref="testform3"
        :model="testform3"
        :rules="testform3rule"
        label-width="120px"
        class="lastform"
        style="display:none"
      >
        <el-form-item label="TAG号段" prop="name">
          <el-input v-model="testform3.name" placeholder="请输入TAG号段"></el-input>
          <p
            style="color:gray;opacity:0.5;margin:0;position:absolute;top:25px;width:500px;"
          >(逗号隔开,与起点位置、终点位置对应)(注意:逗号为英文逗号)</p>
        </el-form-item>
        <!--线路新增类型-->
        <el-form-item label="线路新增类型" prop="roadtype">
          <el-select v-model="testform3.roadtype">
            <el-option label="自动选择" value="auto"></el-option>
            <el-option label="手动测试" value="auto1"></el-option>
          </el-select>
        </el-form-item>
        <!--线路数量-->
        <el-form-item label="线路数量" prop="roadnumber">
          <el-input v-model.number="testform3.roadnumber" placeholder="请输入线路数量"></el-input>
        </el-form-item>
        <!--是否启用-->
        <el-form-item label="是否启用" prop="isstart">
          <el-select v-model="testform3.isstart">
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <!--线路AP数量-->
        <el-form-item label="线路AP数量" prop="apamount">
          <el-input v-model.number="testform3.apamount" :min="0" placeholder="请输入AP数量"></el-input>
        </el-form-item>
        <!--频率-->
        <el-form-item label="频率" prop="freq">
          <el-input-number v-model="testform3.freq" placeholder="请输入频率" :min="0"></el-input-number>
        </el-form-item>
        <!--移动速率-->
        <el-form-item label="移动速率" prop="movingrate">
          <el-input v-model.number="testform3.movingrate" placeholder="请输入移动速率"></el-input>
        </el-form-item>
        <!--TAG数量-->
        <el-form-item label="TAG数量" prop="tagnumber">
          <el-input v-model.number="testform3.tagnumber" placeholder="请输入TAG数量"></el-input>
        </el-form-item>
        <el-form-item label="车辆数量" prop="cartotal">
          <el-input v-model.number="testform3.cartotal" placeholder="请输入车辆数量"></el-input>
        </el-form-item>
        <el-form-item label="车辆发车频率" prop="carstep">
          <el-input v-model.number="testform3.carstep" placeholder="请输入发车频率"></el-input>
        </el-form-item>
        <el-form-item label="发车时间" prop="carstarttime">
          <el-date-picker
            v-model="testform3.carstarttime"
            type="datetime"
            placeholder="选择开始时间"
            @change="carStartTime"
            :picker-options="pickerOptionsStart"
          ></el-date-picker>
        </el-form-item>

        <!--起点位置-->
        <el-form-item label="起点位置" class="lineone">
          <div class="flexg" v-for="(item, index) in testform3.start" :key="index">
            <el-form-item :label="'起点'+(index+1)" class="elformcontent" label-width="60px">
              <el-col :span="10">
                <div class="grid-content bg-purple">
                  <el-form-item
                    label="经度"
                    :prop="'start.'+index+'.lat'"
                    :rules="[{required: true, message: '需要输入经度',trigger: 'blur'}]"
                  >
                    <el-input v-model="item.lat" placeholder="请输入经度"></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="10">
                <div class="grid-content bg-purple">
                  <el-form-item
                    label="纬度"
                    :prop="'start.'+index+'.long'"
                    :rules="[{required: true, message: '需要输入纬度',trigger: 'blur'}]"
                  >
                    <el-input v-model="item.long" placeholder="请输入纬度"></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="4">
                <div class="grid-content bg-purple">
                  <el-link
                    type="primary"
                    @click.prevent="removeDomainStart(item)"
                    :underline="false"
                    icon="el-icon-minus"
                  >删除</el-link>
                </div>
              </el-col>
            </el-form-item>
          </div>
        </el-form-item>
        <!--添加起点位置-->
        <div style="width: 100%;margin-left: 50px">
          <el-link
            @click="addDomainStart"
            icon="el-icon-plus"
            type="primary"
            :underline="false"
          >添加起点</el-link>
        </div>
        <!--终点位置-->
        <el-form-item label="终点位置" class="lineone" label-width="120px">
          <div class="flexg" v-for="(items, index) in testform3.end" :key="index">
            <el-form-item :label="'终点'+(index+1)" class="elformcontent" label-width="60px">
              <el-col :span="10">
                <div class="grid-content bg-purple">
                  <el-form-item
                    label="经度"
                    :prop="'end.'+index+'.lat'"
                    :rules="[{required: true, message: '需要输入经度',trigger: 'blur'}]"
                  >
                    <el-input v-model="items.lat" placeholder="请输入经度"></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="10">
                <div class="grid-content bg-purple">
                  <el-form-item
                    label="纬度"
                    :prop="'end.'+index+'.long'"
                    :rules="[{required: true, message: '需要输入纬度',trigger: 'blur'}]"
                  >
                    <el-input v-model="items.long" placeholder="请输入纬度"></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="4">
                <div class="grid-content bg-purple">
                  <el-link
                    type="primary"
                    @click.prevent="removeDomainEnd(item)"
                    :underline="false"
                    icon="el-icon-minus"
                  >删除</el-link>
                </div>
              </el-col>
            </el-form-item>
          </div>
        </el-form-item>
        <!--添加终点位置-->
        <div style="width: 100%;margin-left: 50px">
          <el-link @click="addDomainEnd" icon="el-icon-plus" type="primary" :underline="false">添加终点</el-link>
        </div>
        <el-form-item class="lineone">
          <el-button type="success" size="small" @click="startPlugin('testform3')">启动测试插件</el-button>
          <el-button type="info" size="small">启动压力测试</el-button>
          <el-button type="danger" size="small">停止压力测试</el-button>
          <el-button type="primary" size="small" @click="goToDashboard">查看压测展示</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import Parse from "parse";
import { setInterval } from 'timers';
export default {
  data() {
    var validUrl = (rule, value, callback) => {
      let reg = /^[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/;
      if (!reg.test(value)) {
        callback(new Error("需要输入正确的ip"));
      } else {
        callback();
      }
    };
    var validPort = (rule, value, callback) => {
      let reg = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
      if (!reg.test(value)) {
        callback(new Error("需要输入正确的端口号"));
      } else {
        callback();
      }
    };
    var checkRoadnumber = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("线路数量为空"));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error("请输入数字值"));
        } else {
          callback();
        }
      }, 1000);
    };
    return {
      statusBar:'ready',
      timeinterval:null,
      // loadingimg:require('../../imgages/loading.gif'),
      active: 0,
      testform1: {
        ip: "",
        port: ""
      },
      testform2: {
        ip: "",
        port: ""
      },
      pickerOptionsStart: {
        disabledDate: time => {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      //校验1
      testform1rule: {
        ip: [
          { required: true, message: "需要选择正确的服务机ip", trigger: "change" }
          // { validator: validUrl, trigger: "change" }
        ],
        port: [
          { required: true, message: "需要输入正确的端口", trigger: "blur" },
          { validator: validPort }
        ]
      },
      //校验2
      testform2rule: {
        ip: [
          { required: true, message: "需要选择正确的测试机ip", trigger: "change" }
          // { validator: validUrl, trigger: "change" }
        ],
        port: [
          { required: true, message: "需要输入正确的端口", trigger: "blur" },
          { validator: validPort }
        ]
      },
      testform3: {
        name: "",
        roadtype: "auto", //线路类别
        isstart: true, //是否启用
        apamount: "",
        freq: "",
        roadnumber: "",
        tagnumber: "",
        movingrate: "",
        cartotal: "",
        carstep: "",
        carstarttime: "",
        start: [
          {
            lat: "",
            long: ""
          }
        ],
        end: [
          {
            lat: "",
            long: ""
          }
        ]
      },
      //校验3
      testform3rule: {
        name: [{ required: true, message: "请输入TAG号段", trigger: "blur" }],
        isstart: [
          { required: true, message: "请选择是否启动", trigger: "change" }
        ],
        roadtype: [
          { required: true, message: "请选择线路新增类型", trigger: "change" }
        ],
        roadnumber: [
          { required: true, message: "需要输入线路数量", trigger: "blur" },
          { validator: checkRoadnumber }
        ],
        apamount: [
          { required: true, message: "AP数量不能为空" },
          { type: "number", message: "AP数量必须为数字值" }
        ],
        tagnumber: [
          { required: true, message: "TAG数量不能为空" },
          { type: "number", message: "TAG数量必须为数字值" }
        ],
        freq: [
          { required: true, message: "频率不能为空" },
          { type: "number", message: "频率必须为数字值" }
        ],
        movingrate: [
          { required: true, message: "移动速率不能为空" },
          { type: "number", message: "移动速率必须为数字值" }
        ],
        cartotal: [
          { required: true, message: "车辆总数不能为空" },
          { type: "number", message: "车辆总数必须为数字值" }
        ],
        carstep: [
          { required: true, message: "车辆发车频率不能为空" },
          { type: "number", message: "车辆发车频率必须为数字值"}
        ],
        carstarttime: [
          {
            type: "date",
            required: true,
            message: "请选择发车开始时间",
            trigger: "change"
          }
        ]
      },
      server: [],
      benchmark: [],
      origindata: [],
      serverid: "",
      benchmarkid: ""
    };
  },
  mounted() {
    this.getServerSchema();
  },
  methods: {
    //初始化数据 
    getServerSchema() {
      this.server = [];
      this.benchmark = [];
      var Zetagserver = Parse.Object.extend("Zetagserver");
      var zetagserver = new Parse.Query(Zetagserver);
      zetagserver.find().then(resultes => {
        resultes.map(items => {
          if (items.attributes.server_type == "server") {
            this.server.push(
              {
                type: "server",
                label: items.attributes.property.internet_ip,
                port: items.attributes.property.port,
                value: items.attributes.property.internet_ip,
                serverid: items.id
              },
              {
                type: "server",
                label: items.attributes.property.intranet_ip,
                port: items.attributes.property.port,
                value: items.attributes.property.intranet_ip,
                serverid: items.id
              }
            );
          } else if (items.attributes.server_type == "benchmark") {
            this.benchmark.push(
              {
                type: "benchmark",
                label: items.attributes.property.internet_ip,
                port: items.attributes.property.port,
                value: items.attributes.property.internet_ip,
                benchmarkid: items.id
              },
              {
                type: "benchmark",
                label: items.attributes.property.intranet_ip,
                port: items.attributes.property.port,
                value: items.attributes.property.intranet_ip,
                benchmarkid: items.id
              }
            );
          }
        });
      });
    },
    //测试机开始
    startTest(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var Zetagserver = Parse.Object.extend("Zetagserver");
          var zetagserver = new Zetagserver();
          zetagserver.id = this.benchmarkid;
          zetagserver.set("cmd", "start");
          zetagserver.save().then(
            response => {
              if (response) {
                this.$message.success("成功启动测试机");
              }
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
              } else {
                this.$message.error(error.error);
              }
            }
          );
        } else {
        }
      });
    },
    //测试机停止
    stopTest(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var Zetagserver = Parse.Object.extend("Zetagserver");
          var zetagserver = new Zetagserver();
          zetagserver.id = this.benchmarkid;
          zetagserver.set("cmd", "stop");
          zetagserver.save().then(
            response => {
              if (response) {
                this.$message.success("成功停止测试机");
              }
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
              } else {
                this.$message.error(error.error);
              }
            }
          );
        } else {
        }
      });
    },
    //服务机开启
    startServer(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var Zetagserver = Parse.Object.extend("Zetagserver");
          var zetagserver = new Zetagserver();
          zetagserver.id = this.serverid;
          zetagserver.set("cmd", "start");
          zetagserver.save().then(
            response => {
              if (response) {
                this.$message.success("成功启动服务机");
              }
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
              } else {
                this.$message.error(error.error);
              }
            }
          );
        } else {
        }
      });
    },
    //服务机停止
    stopServer(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var Zetagserver = Parse.Object.extend("Zetagserver");
          var zetagserver = new Zetagserver();
          zetagserver.id = this.serverid;
          zetagserver.set("cmd", "stop");
          zetagserver.save().then(
            response => {
              if (response) {
                this.$message.success("成功停止服务机");
              }
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
              } else {
                this.$message.error(error.error);
              }
            }
          );
        } else {
        }
      });
    },
    //服务机筛选
    test2Select(val) {
      this.server.map(item => {
        if (val == item.label) {
          this.testform2.port = item.port;
          this.serverid = item.serverid;
        }
      });
    },
    //测试机筛选
    test1Select(val) {
      this.benchmark.map(item => {
        if (val == item.label) {
          (this.testform1.port = item.port),
            (this.benchmarkid = item.benchmarkid);
        }
      });
    },
    //发车开始时间
    carStartTime() {
      if (this.testform3.cartstarttime < Date.now() - 2000) {
        this.$message.warning("车辆开始时间要大于当前时间");
        this.testform3.cartstarttime = "";
      }
    },
    //起点位置操作
    removeDomainStart(item) {
      var index = this.testform3.start.indexOf(item);
      if (index !== -1) {
        this.testform3.start.splice(index, 1);
      }
    },
    addDomainStart() {
      this.testform3.start.push({
        lat: "",
        long: ""
      });
    },
    //终点位置操作
    removeDomainEnd(item) {
      var index = this.testform3.end.indexOf(item);
      if (index !== -1) {
        this.testform3.end.splice(index, 1);
      }
    },
    addDomainEnd() {
      this.testform3.end.push({
        lat: "",
        long: ""
      });
    },
    goToDashboard() {
      this.$router.push({
        path: "/dashboard"
      });
    },
    //startPlugin1
    startPlugin1(){
      this.timeinterval = window.setInterval(()=>{
        if(this.statusBar=='ready'){
          console.log(1)
           this.statusBar = 'success'
        }else if(this.statusBar=='success'){
          console.log(2)
        window.clearInterval(this.timeinterval)
        this.timeinterval=null
        }
        
      },1000)
    },
    //启动测试插件
    startPlugin(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //判断服务机是否填写
          this.$refs["testform2"].validate(valid => {
            if (valid) {
              var arr = this.testform3.name.split(",");
              if (
                this.testform3.start.length != arr.length ||
                this.testform3.end.length != arr.length
              ) {
                this.$message.warning("起点位置,终点位置与TAG号段不对应");
                return false;
              } else {
                var obj = {
                  ip: this.testform2.ip,
                  port: this.testform2.port,
                  car_count: this.testform3.cartotal,
                  car_freq: this.testform3.carstep,
                  car_begin: this.testform3.carstarttime,
                  routes: []
                };
                obj.ip = this.testform2.ip;
                obj.port = this.testform2.port;
                arr.map((item, index) => {
                  obj.routes.push({
                    id: item, //tag以FA开头
                    type: this.testform3.roadtype,
                    route_count: this.testform3.roadnumber, //线路数量
                    enable: this.testform3.isstart, //是否启用
                    ap_count: this.testform3.apamount, // ap数量
                    freq: this.testform3.freq, // 频率
                    speed: this.testform3.movingrate,//移动速率
                    tag_count: this.testform3.tagnumber, //tag 总数
                    points: [
                      {
                        x: this.testform3.start[index].lat,
                        y: this.testform3.start[index].long
                      },
                      {
                        x: this.testform3.end[index].lat,
                        y: this.testform3.end[index].long
                      }
                    ]
                  });
                });
                 var Zetagserver = Parse.Object.extend("Zetagserver");
                var zetagserver = new Zetagserver();
                zetagserver.id = this.serverid;
                
              }
            }
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.zetatest {
  height: 100%;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  background: #fff;
  display: flex;
  h5 {
    color: #f56c6c;
    margin: 0;
  }

  /deep/ .el-step__head.is-wait {
    color: black;
    border-color: black;
  }
  /deep/ .el-step__title.is-wait {
    color: #409eff;
  }
}
</style>
<style>
.zetatest .el-form {
  display: flex;
  flex-wrap: wrap;
}
.zetatest .el-form .lineone {
  width: 100% !important;
}
.zetatest .el-form .el-form-item {
  width: 33%;
}
/* .zetatest .lastform .el-form-item{
    width:50%;
} */
.zetatest .el-form .el-form-item .el-input {
  width: 100%;
}
.zetatest .el-form .el-form-item .el-input-number {
  width: 100%;
}
.zetatest .el-form .el-form-item .el-select {
  width: 100%;
}
/* .lineone .flexg{
   display: flex;
} */
.zetatest .bg-purple .el-form-item {
  width: 80%;
  margin-bottom: 10px;
}
.zetatest .elformcontent {
  width: 100% !important;
}
.zetatest #statuBar{
    padding: 15px;
  margin-bottom: 20px;
  border: 1px solid transparent;
  border-radius: 4px;
}
.zetatest .ready{
  background:#f5e79e;
  color: #8a6d3b;
}
.zetatest .success{
  color: #3c763d;
    background-color: #dff0d8;
}
</style>
