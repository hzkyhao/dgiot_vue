<template>
  <div class="mainstations">
    <!--第一个tree树-->
    <Resource1
      style="width:360px;height:100vh;overflow:scroll;flex-shrink:0;padding:10px;"
      @meterdetail="meterdetail"
    />
    <!--第三个返回数据展示-->
    <div
      class="secondcard"
      style="min-height:875px;border-left:2px solid #156FAE;background:#f6fbff"
      v-if="activeName=='second'"
    >
      <div style="width:100%;height:auto;padding:20px;box-sizing:border-box;">
        <!--中间白色部分-->
        <div class="blockcontent">
          <el-form :inline="true" :model="formInline" class="demo-form-inline" label-width="120px">
            <el-form-item label="操作类型:">
              <el-select
                placeholder="操作类型"
                v-model="formInline.operation"
                @change="firstchange"
                style="width:150px"
              >
                <el-option
                  v-for="(item,index) in operatetype"
                  :label="item.attributes.webtype"
                  :key="index"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="数据类型:">
              <el-select
                placeholder="数据类型"
                v-model="formInline.datatype"
                @change="dataselect"
                style="width:150px"
              >
                <el-option
                  v-for="(item,index) in datatype"
                  :label="item.label"
                  :key="index"
                  :value="item.key"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="终端逻辑地址:">
              <el-input placeholder="终端逻辑地址" v-model="formInline.vcaddr" style="width:150px"></el-input>
            </el-form-item>
            <el-form-item label="规约名称:">
              <el-select
                placeholder="规约类型"
                v-model="formInline.protocol"
                style="width:150px"
                @change="protocolChange"
              >
                <el-option label="南网上行通信规约" value="30"></el-option>
                <el-option label="国网通信规约" value="20"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="通道类型:">
              <el-select placeholder="数据类型" v-model="formInline.route" style="width:150px">
                <el-option label="默认" value="tcp"></el-option>
                <el-option label="无线" value="tcp1"></el-option>
                <el-option label="载波" value="tcp2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="开始测量点号:">
              <el-input
                placeholder="开始测量点号"
                type="number"
                v-model="formInline.start"
                :min="1"
                :max="2048"
                style="width:150px"
              ></el-input>
            </el-form-item>
            <el-form-item label="结束测量点号:">
              <el-input
                placeholder="结束测量点号"
                type="number"
                v-model="formInline.end"
                :min="1"
                :max="2048"
                style="width:150px"
              ></el-input>
            </el-form-item>
            <el-form-item label="开始时间:">
              <el-date-picker
                v-model="formInline.starttime"
                :type="datatimetype"
                placeholder="选择开始时间"
                value-format="timestamp"
                :picker-options="pickerBeginDateBefore"
                style="width:150px"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间:">
              <el-date-picker
                v-model="formInline.endtime"
                :type="datatimetype"
                placeholder="选择结束时间"
                value-format="timestamp"
                :picker-options="pickerBeginDateAfter"
                style="width:150px"
              ></el-date-picker>
              <!-- <el-form-item label="日期" v-show="formInline.protocol==20&&formInline.operation=='历史月数据'"> 
                  <el-date-picker
                    v-model="value1"
                    type="monthrange"
                    range-separator="至"
                    start-placeholder="开始月份"
                    end-placeholder="结束月份"
                    value-format="timestamp">
                  </el-date-picker>
              </el-form-item>-->
            </el-form-item>
          </el-form>
        </div>
        <div class="blockfooter">
          <el-button type="primary" @click="getValue">召测</el-button>
          <el-button type="primary" @click="test">重置</el-button>
        </div>
        <div style="height:8px;width:100%;background:#ffffff"></div>
        <div class="blockall" style="text-align:center;height:auto">
          <el-transfer
            style="text-align: left; display: inline-block;margin-top:20px"
            v-model="value"
            :render-content="renderFunc"
            :titles="['数据标识DI', '选定查询数据项']"
            :button-texts="['删除', '添加']"
            :format="{
                        noChecked: '${total}',
                        hasChecked: '${checked}/${total}'
                    }"
            @change="handleChange"
            :data="data1"
          ></el-transfer>
        </div>
      </div>
    </div>
    <el-dialog
      title="召测数据"
      :visible.sync="dialogTableVisible"
      :close-on-click-modal="false"
      :before-close="handleClose"
      width="82%"
    >
      <el-table
        :data="gridData1.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        style="width:100%;margin-top:10px;"
        height="400"
      >
        <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
        <el-table-column property="vcaddr" label="终端逻辑地址" width="120" align="center"></el-table-column>
        <el-table-column property="pn" label="测量点号" width="100" align="center"></el-table-column>
        <el-table-column property="meteraddr" label="电表地址" align="center"></el-table-column>
        <el-table-column property="diname" label="数据项标识" width="250" align="center"></el-table-column>
        <el-table-column property="value" label="数据" align="center"></el-table-column>
        <el-table-column label="冻结日期" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.time">
               <span
              v-if="scope.row.time.length==8"
            >{{scope.row.time.toString().substring(0,4)+'-'+scope.row.time.toString().substring(4,6)+'-'+scope.row.time.toString().substring(6,8)}}</span>
            <span v-else>{{scope.row.time.toString().substring(0,4)+'-'+scope.row.time.toString().substring(4,6)}}</span>
            </span>
            <span v-else></span>
          </template>
        </el-table-column>

        <el-table-column property="ts" label="时间" width="200" align="center"></el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <span style="color:green" v-if="scope.row.status==1">完成</span>
            <span style="color:green" v-else-if="scope.row.status==0">召测中</span>
            <span style="color:red" v-else-if="scope.row.status==3">无档案</span>
            <span style="color:red" v-else>超时</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="margin-top:15px;">
        <el-pagination
          align="center"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[1,5,10,20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="gridData1.length"
        ></el-pagination>
      </div>
    </el-dialog>
  </div>
</template>
<style>
.transfer-footer {
  margin-left: 20px;
  padding: 6px 5px;
}
</style>
<script>
import Parse from "parse";
import { Mainstationvalue } from "@/api/mainstation";
import Mainstation from "@/components/mainstation";
import Resource1 from "@/components/resource/resource";
import { Websocket, didata } from "@/utils/wxscoket.js";
import { eventBus } from "@/api/eventBus";
import { timestampToTime } from "@/api/login";
import { resolve } from "q";
import Cookies from "js-cookie";
export default {
  components: {
    Resource1
  },
  data() {
    return {
      value1: "",
      datatimetype: "datetime",
      operatetype: [],
      isSelecttime: true,
      isCollapse: true,
      data1: [],
      value: [],
      // loading:true,
      renderFunc(h, option) {
        return <span>{option.label}</span>;
      },
      currentPage: 1, // 当前页码
      total: 20, // 总条数
      pageSize: 10, // 每页的数据条数
      activeName: "second",
      formInline: {
        protocol: "30",
        user: "",
        vcaddr: "",
        datatype: "",
        operation: "",
        start: "1",
        end: "1",
        jiange: "",
        starttime: "",
        endtime: "",
        route: "tcp"
      },
      pickerBeginDateBefore: {
        disabledDate: time => {
          if (this.formInline.endtime) {
            return time.getTime() > new Date(this.formInline.endtime).getTime();
          } else {
            return time.getTime() > Date.now() - 8.64e6;
          }
        }
      },
      pickerBeginDateAfter: {
        disabledDate: time => {
          if (this.formInline.starttime) {
            return (
              time.getTime() > Date.now() ||
              time.getTime() < new Date(this.formInline.starttime).getTime()
            );
          } else {
            return time.getTime() > Date.now() - 8.64e6;
          }
        }
      },
      operation: "",
      datatype: [],
      dialogTableVisible: false,
      radio: 3,
      data: [],
      defaultProps: {
        children: "children",
        label: "name",
        isLeaf: "leaf"
      },
      tableData1: [],
      searchvalue: "",
      departmentid: "",
      userForm: {
        usertype: "",
        searchtype: "",
        userhh: "",
        username: "",
        zdjh: "",
        ljdz: ""
      },
      selectdata: [],
      session: "",
      data2: {},
      originrecivedata: [],
      gridData1: []
    };
  },
  computed: {
    treeData() {
      let cloneData = JSON.parse(JSON.stringify(this.data)); // 对源数据深度克隆
      return cloneData.filter(father => {
        let branchArr = cloneData.filter(
          child => father.objectId == child.ParentId
        ); //返回每一项的子级数组
        branchArr.length > 0 ? (father.children = branchArr) : ""; //如果存在子级，则给父级添加一个children属性，并赋值
        branchArr.length > 0 ? (father.leaf = true) : false;
        return father.ParentId == 0; //返回第一层
      });
    }
  },

  mounted() {
    this.getOperate();
    this.session = sessionStorage.getItem("token");
    console.log(this.datatype);
  },
  methods: {
    //规约类型选择
    protocolChange(val) {
      if (val == 20 && this.formInline.operation != this.operatetype[3].id) {
        this.datatimetype = "date";
        this.formInline.operation = this.operatetype[2].id;
        this.firstchange(this.operatetype[2].id);
      } else if (
        val == 20 &&
        this.formInline.operation == this.operatetype[3].id
      ) {
        this.datatimetype = "month";
        this.formInline.starttime = new Date() - 30 * 86400000;
        this.firstchange(this.operatetype[3].id)
      } else {
        this.datatimetype = "datetime";
        this.formInline.operation = this.operatetype[1].id;
        this.firstchange(this.operatetype[1].id);
      }
    },
    //获取操作类型
    getOperate() {
      var Mainstation = Parse.Object.extend("MainStationIndex");
      var mainstation = new Parse.Query(Mainstation);
      mainstation.startsWith("name", "C.");
      mainstation.ascending("name");
      mainstation.find().then(resultes => {
        this.operatetype = resultes;
        this.formInline.operation = resultes[1].id;
        this.firstchange(resultes[1].id);
      });
    },
    handleClick() {},
    handleClose() {
      this.dialogTableVisible = false;
    },
    //获取数据类型
    firstchange(val) {
      this.formInline.datatype = "";
      this.datatype = [];
      var Mainstation = Parse.Object.extend("MainStationIndex");
      var mainstation = new Parse.Query(Mainstation);
      mainstation.equalTo("objectId", val);
      mainstation.find().then(resultes => {
        resultes.map(items => {
          items.attributes.leafs.map(child => {
            var obj = {
              label: child,
              modelindex: items.attributes.sendtype,
              key: child
            };
            this.datatype.push(obj);
          });
          this.formInline.datatype = this.datatype[0].key;
          this.dataselect(this.datatype[0].key);
        });
      });
      if (
        this.formInline.protocol == 20 &&
        this.formInline.operation != this.operatetype[3].id
      ) {
        this.datatimetype = "date";
      } else if (
        this.formInline.protocol == 20 &&
        this.formInline.operation == this.operatetype[3].id
      ) {
        this.datatimetype = "month";
        this.formInline.starttime = new Date() - 30 * 86400000;
      } else {
        this.datatimetype = "datetime";
      }
    },
    getcheck(data, node) {
      this.getMainstation(data.objectId);
    },
    test() {
      this.formInline = {
        protocol: "30",
        user: "",
        vcaddr: "",
        datatype: "",
        operation: "",
        start: "1",
        end: "1",
        jiange: "",
        starttime: new Date(),
        endtime: new Date(),
        route: "tcp"
      };
      this.getOperate();
    },
    //数据推送得到value
    getValue() {
      console.log(this.value1);
      this.gridData1.length = 0;
      if (this.selectdata.length == 0) {
        this.$message({
          type: "warning",
          message: "请选择数据项标识"
        });
      } else if (Websocket.connState == false) {
        this.$message({
          type: "warning",
          message: "正在重新连接，请稍后"
        });
      } else if (this.formInline.vcaddr == "") {
        this.$message({
          type: "warning",
          message: "请挑选集中器或电表"
        });
      } else {
        var _this = this;
        Websocket.originrecivedata = [];
        var ranNum = Math.ceil(Math.random() * 25);
        var operation =
          String.fromCharCode(65 + ranNum) + Math.ceil(Math.random() * 100000);
        //eventBus事件分发
        eventBus.$on(operation, data => {
          _this.gridData1 = [];
          data.data.map(items => {
            didata.map(child => {
              if (items.di == child.key) {
                _this.gridData1.unshift({
                  di: items.di,
                  pn: items.pn,
                  value: JSON.stringify(items.value),
                  vcaddr: data.vcaddr,
                  ts: timestampToTime(items.ts),
                  meteraddr: items.meteraddr,
                  diname: child.label,
                  time: items.time,
                  status: items.status
                });
              }
            });
          });
          console.log(_this.gridData1)
        });
        this.formInline.route = "tcp";
        Mainstationvalue(
          this.formInline.vcaddr,
          this.session,
          operation,
          this.operation,
          this.formInline.start,
          this.formInline.end,
          Math.ceil(this.formInline.starttime / 1000),
          Math.ceil(this.formInline.endtime / 1000),
          this.formInline.route,
          this.formInline.protocol,
          this.selectdata
        )
          .then(resultes => {
            if (resultes) {
              this.dialogTableVisible = true;
            }
          })
          .catch(error => {
            this.$message({
              type: "error",
              message: error.error
            });
          });
      }
    },
    handleChange(value) {
      this.selectdata = value;
    },
    //树形控件点击事件
    meterdetail(row) {
      if (row.icon != "集中器" && row.icon != "电表") {
        this.$message({
          type: "warning",
          message: "请挑选集中器或电表"
        });
      } else if (row.icon == "集中器") {
        this.formInline.vcaddr = row.alias;
        this.formInline.start = 1;
        this.formInline.end = 1;
      } else if (row.icon == "电表") {
        var Smartmeter = Parse.Object.extend("Smartmeter");
        var smartmeter = new Parse.Query(Smartmeter);
        smartmeter.get(row.objectId).then(
          resultes => {
            this.formInline.vcaddr = resultes.attributes.vcaddr_web;
            this.formInline.start = resultes.attributes.pn;
            this.formInline.end = resultes.attributes.pn;
          },
          error => {
            this.$message({
              type: "error",
              message: error.error
            });
          }
        );
      }
    },
    //分页
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    //根据点击的树去department挑选
    getMainstation(objectId) {
      // this.data = [];
      this.session = Parse.User.current().attributes.sessionToken;
      var Department = Parse.Object.extend("Department");
      var department = new Parse.Query(Department);
      department.equalTo("ParentId", objectId);
      department.limit(10000);
      department.find().then(
        resultes => {
          resultes.map(items => {
            var obj = {};
            items.createtime = new Date(
              items.attributes.createdAt
            ).toLocaleDateString();
            (obj.name = items.attributes.name),
              (obj.ParentId = items.attributes.ParentId);
            obj.objectId = items.id;
            obj.level = items.attributes.level;
            obj.createtime = items.createtime;
            obj.alias = items.attributes.alias;
            obj.leaf = items.attributes.leafnode;
            obj.icon = items.attributes.org_type;
            this.data.push(obj);
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
          } else {
            this.$message.error(error.message);
          }
        }
      );
    },
    //数据标识选择
    dataselect(val) {
      didata.length = 0;
      this.value = [];
      this.data1 = [];
      this.datatype.map(items => {
        if (val == items.label) {
          this.operation = items.modelindex;
        }
      });
      if (this.formInline.protocol == 30) {
        var DataItem = Parse.Object.extend("DataItem");
        var dataitem = new Parse.Query(DataItem);
        dataitem.equalTo("leafname", val);
        dataitem.limit(1000);
        dataitem.ascending("itemCode");
        dataitem.find().then(res => {
          res.map(items => {
            var obj = {
              label: items.attributes.itemName,
              key: items.attributes.itemCode
            };
            this.data1.push(obj);
            didata.push(obj);
          });
        });
      } else {
        var DataItemGw = Parse.Object.extend("DataItemGW");
        var dataitemgw = new Parse.Query(DataItemGw);
        dataitemgw.equalTo("leafname", val);
        dataitemgw.limit(1000);
        dataitemgw.ascending("itemCode");
        dataitemgw.find().then(res => {
          res.map(items => {
            var obj = {
              label: items.attributes.itemName,
              key: items.attributes.itemCode
            };
            this.data1.push(obj);
            didata.push(obj);
          });
        });
      }

      if (this.operation == "c.3" || this.operation == "c.4") {
        this.isSelecttime = false;
        this.formInline.starttime = new Date(
          new Date().setHours(0, 0, 0, 0) - 24 * 60 * 60 * 1000
        );
        this.formInline.endtime = new Date();
      } else if (this.operation == "c.2") {
        this.isSelecttime = true;
        this.formInline.endtime = new Date().getTime();
        this.formInline.starttime = this.formInline.endtime - 3 * 84600000;
      }
    }
  }
};
</script>
<style scoped>
.mainstations {
  width: 100%;
  height: 100%;
  padding-bottom: 20px;
  box-sizing: border-box;
  background: #ffffff;
  display: flex;
  overflow: scroll;
}
.blockcontent {
  height: auto;
}
.blockfooter {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 8px;
}
</style>
<style>
.mainstations .el-tabs--left .el-tabs__item.is-left {
  width: 38px;
  white-space: pre-wrap;
  height: auto;
  border: 1px solid #cccccc;
  padding: 20px 10px;
}
.mainstations .el-tabs--border-card > .el-tabs__header .el-tabs__item {
  color: white;
  font-family: Microsoft YaHei;
  font-size: 18px;
}
.mainstations .el-tabs--left.el-tabs--border-card .el-tabs__header.is-left {
  min-height: 100%;
}
.mainstations .el-tabs__header {
  background: #1579bf;
}
.mainstations
  .el-tabs--border-card
  > .el-tabs__header
  .el-tabs__item.is-active {
  color: #333333 !important;
  font-family: Microsoft YaHei;
  font-size: 18px;
  background-color: #3f93cf;
}
.mainstations .el-tabs__content {
  height: 875px;
  overflow-x: scroll;
  overflow-y: scroll;
}
.mainstations .el-tabs--border-card > .el-tabs__content {
  padding: 0;
  padding-top: 10px;
}
.mainstations .el-transfer-panel__list {
  height: 100%;
}
.mainstations .el-transfer-panel {
  min-height: 400px;
  width: 350px;
}
.mainstations .el-transfer-panel__body {
  height: 400px;
}
.mainstations .demo-form-inline .el-input__inner {
  border-radius: 0;
  height: 26px;
  line-height: 26px;
}
.mainstations .demo-form-inline .el-input__icon {
  line-height: 0;
}
.mainstations .el-dialog {
  position: absolute !important;
  right: 0 !important;
  left: auto;
  background: #f6fbff;
}
.mainstations .el-dialog__body {
  padding: 10px 20px;
}
.mianstations .el-dialog__header .el-dialog__title {
  font-size: 16px;
}
.mainstations .el-form-item {
  margin-bottom: 0;
}
.mainstations .el-tabs--border-card {
  border: 0;
  width: 340px;
}
.mainstations .el-tabs__item {
  line-height: 20px;
}
.mainstations .el-transfer__button:nth-child(2) {
  margin: 0 auto;
}
.mainstations .el-transfer__buttons {
  width: 200px;
}
.mainstations .el-form-item__label {
  color: #333333;
  font-family: Microsoft YaHei;
}
.mainstations .el-transfer-panel__item.el-checkbox .el-checkbox__label {
  font-family: Microsoft YaHei;
  color: #333333;
}
.mainstations .blockfooter .el-button {
  width: 75px;
  height: 32px;
  line-height: 0;
  border-radius: 0;
}
.el-transfer__buttons .el-button {
  padding: 0;
  width: 144px;
  height: 25px;
}
.zwheader .el-input__inner {
  height: 26px;
  width: 174px;
  border-radius: 0;
}
.mainstations .el-transfer__button:nth-child(2) {
  position: relative;
  top: -80px;
}
@media screen and (max-width: 1450px) {
  /*当屏幕尺寸小于750px时，应用下面的CSS样式*/
  .mainstations .el-transfer__buttons {
    width: 200px;
  }
  .mainstations .el-transfer-panel {
    width: 300px;
  }
}
@media screen and (max-width: 1100px) {
  .mainstations .el-transfer__buttons {
    width: 50px;
  }
  .mainstations .el-transfer-panel__item.el-checkbox .el-checkbox__label {
    font-size: 10px;
  }
  .el-transfer__buttons .el-button {
    width: 50px;
  }
  .mainstations .el-transfer__buttons {
    width: 170px;
  }
  .mainstations .el-transfer-panel {
    width: 200px;
  }
}
</style>

