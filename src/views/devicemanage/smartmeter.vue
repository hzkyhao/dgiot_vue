<template>
  <div class="smartmeter">
    <div class="topsearch">
      <el-input placeholder="请输入电表地址" v-model="metersearch" style="width:300px">
        <el-button slot="append" icon="el-icon-search" @click="getinformation(0)"></el-button>
      </el-input>
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width:100%;margin-top:30px;text-align:center;"
      v-loading="loading"
    >
      <el-table-column label="电表地址" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.attributes.addr}}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户编号" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.attributes.yhabh}}</span>
        </template>
      </el-table-column>
      <el-table-column label="台区" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.attributes.tq}}</span>
        </template>
      </el-table-column>
      <el-table-column label="集中器地址" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.attributes.vcaddr}}</span>
        </template>
      </el-table-column>

      <el-table-column label="采集器" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.attributes.deveui}}</span>
        </template>
      </el-table-column>

      <el-table-column label="用户名称" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.attributes.yhmc}}</span>
        </template>
      </el-table-column>
      <el-table-column prop label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleClickLook(scope)">显示详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 25, 50, 100]"
        :page-size="length"
        layout="total, sizes, prev, pager, next"
        :total="total"
        style="margin-top:30px;"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { timestampToTime } from "@/api/login";
import Parse from "parse";
import NProgress from "nprogress";
import { CountAll } from "@/api/filemanage";
export default {
  data() {
    return {
      metersearch: "",
      start: 0,
      length: 10,
      total: 0,
      multipleSelection: [],
      vcaddr: "",
      draw: 1,
      addr: "",
      dialogVisible: false,
      //详细信息
      meterdetail: {
        attributes: {
          vcaddr: "",
          pn: "",
          addr: "",
          jldbh: "",
          addr: "",
          yhlb: "",
          gddw: "",
          ccbh: "",
          sccj: "",
          sblx: "",
          txgy: "",
          tq: "",
          province: "",
          city: ""
        }
      },
      node: null,
      loading: true,
      // 展开
      isShow: false,
      index: -1,
      arr:[],
    };
  },
  mounted() {
    this.getinformation();
   
  },
  methods: {
    
    //展开
    handleClickLook(scope) {
      if (this.index == scope.$index) {
        this.isShow = false;
      } else {
        this.isShow = true;
        this.index = scope.$index;
      }
      // 改变按钮文字
      let btnText = document.getElementsByClassName("el-button");
      for (let i = 1; i < btnText.length; i++) {
        btnText[i].children[0].innerHTML = "显示详情";
      }
      // 显示
      if (this.isShow) {
        // console.log(this.index+1)
        btnText[this.index + 1].children[0].innerHTML = "隐藏详情";
        this.delNewTrs();
        let row = document.getElementsByClassName("el-table__row")[this.index];
        let tr = document.createElement("tr");
        tr.setAttribute("class", "NewTr");
        let td = document.createElement("td");
        td.setAttribute("colspan", 9);
        let div = document.createElement("div");
        div.setAttribute("class", "NewDiv");
        let count = 0;
        let info = scope.row.attributes;
        var arr = [];
        if ((this.index + 1) % 2 == 0) {
          arr[this.index + 1] = {
            yhlb: "低压普通用户",
            sblx: "电子式电能表",
            txgy: "DLT645",
            yhdz: `江苏省**市***区**${this.index + 1}号`
          };
        } else {
          arr[this.index + 1] = {
            yhlb: "低压普通用户",
            sblx: "电子式电能表",
            txgy: "DLT645/2007",
            yhdz: `江苏省**市***区**${this.index + 1}号`
          };
        }
        div.innerHTML = `
                    <p><span>集中器地址:</span>${
                      info.vcaddr ? info.vcaddr : ""
                    }</p>
                    <p><span>PN:</span>${info.pn ? info.pn : ""}</p>
                    <p><span>电表地址:</span>${info.addr ? info.addr : ""}</p>
                    <p><span>用户编号:</span>${info.yhabh ? info.yhabh : ""}</p>
                    <p><span>用户地址:</span>${
                      info.yhdz ? info.yhdz : arr[this.index + 1].yhdz
                    }</p>
                    <p><span>用户类别:</span>${
                      info.yhlb ? info.yhlb : arr[this.index + 1].yhlb
                    }</p>
                    <p><span>供电单位:</span>${info.gddw ? info.gddw : ""}</p>
                    <p><span>生产厂商:</span>${info.sccs ? info.sccs : ""}</p>
                    <p><span>设备类型:</span>${
                      info.sblx ? info.sblx : arr[this.index + 1].sblx
                    }</p>
                    <p><span>通信规约:</span>${
                      info.txgy ? info.txgy : arr[this.index + 1].txgy
                    }</p>
                    <p><span>台区:</span>${info.tq ? info.tq : ""}</p>
                    <p><span>地理位置:</span>${info.yhdz ? info.yhdz : ""}</p>
                    <p><span>出厂编号:</span>${info.ccbh ? info.ccbh : ""}</p>
                `;
        td.appendChild(div);
        tr.appendChild(td);
        row.parentElement.insertBefore(tr, row.nextElementSibling);
      } else {
        this.delNewTrs();
        btnText[this.index + 1].children[0].innerHTML = "显示详情";
        this.index = -1;
      }
      this.isShow = !this.isShow;
    },
    // 删除所有展开的内容
    delNewTrs() {
      let tbody = document.getElementsByTagName("tbody")[0];
      let NewTrs = document.getElementsByClassName("NewTr");
      if (NewTrs.length > 0) {
        for (let i = 0; i < NewTrs.length; i++) {
          tbody.removeChild(document.getElementsByClassName("NewTr")[i]);
        }
      }
    },
    handleSizeChange(val) {
      this.length = val;
      this.getinformation(1);
    },
    handleCurrentChange(val) {
      this.start = (val - 1) * this.length;
      this.getinformation(1);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    getinformation(index) {
      this.loading = true;
      if (index == 0) {
        this.start = 0;
      }
      NProgress.start();
      var Smartmeter = Parse.Object.extend("Smartmeter");
      var smartmeter = new Parse.Query(Smartmeter);
      smartmeter.limit(this.length);
      smartmeter.skip(this.start);
      smartmeter.ascending(["vcaddr", "pn"]);
      if (this.metersearch != "") {
        smartmeter.equalTo("addr", this.metersearch);
      }
      smartmeter.find().then(
        resultes => {
          this.tableData = resultes;
          this.loading = false;
          NProgress.done();

          if (this.metersearch == "") {
            CountAll("Smartmeter")
              .then(resultes => {
                this.total = resultes.count;
              })
              .catch(error => {
                this.$message.error(error.error);
              });
          } else {
            smartmeter.count().then(count => {
              this.total = count;
            });
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
    },
    handleClose() {
      this.dialogVisible = false;
    }
  }
};
</script>
<style scoped>
.smartmeter {
  background: #ffffff;
  padding-left: 20px;
  padding-bottom: 20px;
  box-sizing: border-box;
  min-height: 100%;
}
.topsearch {
  margin-top: 30px;
}

.smartmeter .demo-table-expand {
  font-size: 0;
}
.smartmeter .demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.smartmeter .demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 25%;
}
</style>
<style>
/* 展开框文字颜色 */
.smartmeter .el-form-item .el-form-item__label {
  font-size: 13px;
  color: #1b88e7;
}
.smartmeter .el-form-item .el-form-item__content span {
  color: #921aff;
}
.smartmeter .el-table th {
  background: #fafafa;
  color: #666666;
  font-weight: 600;
}
.smartmeter .el-dialog__body {
  background: #f5f5f5;
}
.smartmeter .el-dialog__footer {
  padding-bottom: 50px;
}

/* 表格展开 */
.smartmeter .el-table .NewDiv {
  padding: 0 150px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.smartmeter .el-table .NewDiv p {
  width: 25%;
  text-align: left;
  color: #921aff;
}
.smartmeter .el-table .NewDiv p span {
  color: #1b88e7;
}
.smartmeter .number:last-child{
  display: none;
}
.smartmeter .el-pagination__jump {
  display: none;
}
</style>
