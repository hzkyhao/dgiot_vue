<template>
  <div class="condetail">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="详情" name="first">
        <div class="topsearch">
          <el-input placeholder="请输入电表地址" v-model="input5" style="margin-left:30px;width:300px">
            <el-button slot="append" icon="el-icon-search" @click="searchformeter()"></el-button>
          </el-input>
        </div>
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width:100%;margin-top:30px;text-align:center"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" align="center"></el-table-column>
          <el-table-column align="center" label="集中器">
            <template slot-scope="scope">
              <span>{{scope.row.attributes.vcaddr}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="电表地址" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row.attributes.addr}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="DEVEUI">
            <template slot-scope="scope">
              <span>{{scope.row.attributes.deveui}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="APPEUI">
            <template slot-scope="scope">
              <span>{{scope.row.attributes.appeui}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="PN值">
            <template slot-scope="scope">
              <span>{{scope.row.attributes.pn}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="通道类型">
            <template slot-scope="scope">
              <span v-if="scope.row.attributes.channel.chs==1">主站</span>
              <span v-if="scope.row.attributes.channel.chs==2">postgres</span>
              <span v-if="scope.row.attributes.channel.chs==3">tdengine</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="电表状态">
            <template slot-scope="scope">
              <div
                style="width:10px;height:10px;border-radius:50%;display:inline-block;background:#00cc33;margin-right:10px"
              ></div>
              <span style="color:#00cc33">运行中</span>
              <!-- <div v-if="scope.row.is_online==false" style="width:10px;height:10px;border-radius:50%;display:inline-block;background:#f00;margin-right:10px"></div><span v-if="scope.row.is_online==false" style="color:#f00">未运行</span> -->
            </template>
          </el-table-column>
          <el-table-column prop align="center" label="操作">
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
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            style="margin-top:30px;"
          ></el-pagination>
        </div>
      </el-tab-pane>
      <!-- <el-tab-pane label="实时任务" name="second">
                 <div class="secondsearch">
                     <el-input placeholder="请输入内容" v-model="input6" style="margin-left:30px;width:300px">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                     </el-input>
                </div>
                <el-table
                    ref="multipleTable1"
                    :data="tableData4"
                    tooltip-effect="dark"
                    style="width:100%;margin-top:30px;"
                    @selection-change="handleSelectionChange1">
                    <el-table-column
                    type="selection"
                   >
                    </el-table-column>
                    <el-table-column
                    prop="cbname"
                    label="任务模板名称"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="date"
                    label="冻结日期"
                    >
                    </el-table-column>
                    <el-table-column
                    label="预抄表数"
                    >
                    <template slot-scope="scope">
                        <span>{{scope.row.success+scope.row.fail+scope.row.retry}}</span>
                    </template>
                    </el-table-column>
                     <el-table-column
                    prop="success"
                    label="成功数"
                    >
                    </el-table-column>
                     <el-table-column
                    prop="fail"
                    label="失败数"
                    >
                    </el-table-column>
                     <el-table-column
                    label="成功率"
                    >
                    <template slot-scope="scope">
                        <span>{{((scope.row.success+scope.row.retry)/(scope.row.success+scope.row.fail+scope.row.retry)*100).toFixed(2)+'%'}}</span>
                    </template>
                     </el-table-column>
                     <el-table-column
                    label="操作"
                    >
                    <template slot-scope="scope">
                        <el-button 
                        size="mini"
                        @click='supplementarycopy(scope.$index)'
                        >
                        立即补抄
                        </el-button>
                    </template>
                    </el-table-column>
                </el-table>
                <div class="block">
                    <el-pagination
                    background
                    @size-change="handleSizeChange1"
                    @current-change="handleCurrentChange1"
                    :page-sizes="[10, 25, 50, 100]"
                    :page-size="length1"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total1"
                    style="margin-top:30px;">
                    </el-pagination>
                </div>
      </el-tab-pane>-->
    </el-tabs>
  </div>
</template>
<script>
import {
  getcondetail,
  timestampToTime,
  detailforcon,
  getmeterinfo,
  gettables1
} from "@/api/login";
import { Parse } from "parse";
import { SearchMeter } from "@/api/searchMeter";
export default {
  data() {
    return {
      total: 0,
      length: 10,
      start: 0,
      start1: 0,
      length1: 10,
      total1: 0,
      draw: 1,
      activeName: "first",
      vcaddr: "",
      input5: "",
      input6: "",
      addr: "",
      tableData: [],
      multipleSelection: [],
      tableData4: [],
      multipleSelection1: [],
      isShow: false, //是否展开信息
      index: -1 //当前选中的电表
    };
  },
  mounted() {
    this.vcaddr = this.$route.query.vcaddr;
    this.detail();
  },
  methods: {
    //电表详情
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
        btnText[this.index + 1].children[0].innerHTML = "隐藏详情";
        // 显示的时候，先隐藏之前所有
        this.delNewTrs();
        // 获取当前电表地址
        this.addr = scope.row.attributes.addr;
        var Smartmeter = Parse.Object.extend("Smartmeter");
        var smartmeter = new Parse.Query(Smartmeter);
        smartmeter.equalTo("addr", this.addr);
        smartmeter.equalTo("vcaddr", this.vcaddr);
        smartmeter.find().then(
          resultes => {
            let info = resultes[0].attributes;
            // 对象解构，取出需要的属性
            let {
              vcaddr = "",
              pn = "",
              addr = "",
              jldbh = "",
              jlddz = "",
              yhlb = "",
              gddw = "",
              ccbh = "",
              sccj = "",
              sblx = "",
              txgy = "",
              tq = "",
              yhdz = ""
            } = info;
            let row = document.getElementsByClassName("el-table__row")[
              this.index
            ];
            let tr = document.createElement("tr");
            tr.setAttribute("class", "NewTr");
            let td = document.createElement("td");
            td.setAttribute("colspan", 9);
            let div = document.createElement("div");
            div.setAttribute("class", "NewDiv");
            // 对应放个容器中
            div.innerHTML = `
                    <p>集中器地址:<sapn>${vcaddr}</span></p>
                    <p>信息点标识PN:<span>${pn}</span></p>
                    <p>电表地址:<span>${addr}</span></p>
                    <p>用户编号:<span>${jldbh}</span></p>
                    <p>用户地址:<span>${jlddz}</span></p>
                    <p>用户类别:<span>${yhlb}</span></p>
                    <p>供电单位:<span>${gddw}</span></p>
                    <p>出厂编号:<span>${ccbh}</span></p>
                    <p>生产厂商:<span>${sccj}</span></p>
                    <p>设备类型:<span>${sblx}</span></p>
                    <p>通信规约:<span>${txgy}</span></p>
                    <p>台区:<span>${tq}</sapn></p>
                    <p>地理位置:<span>${yhdz}</span></p>
                `;
            td.appendChild(div);
            tr.appendChild(td);
            row.parentElement.insertBefore(tr, row.nextElementSibling);
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
      } else {
        this.delNewTrs();
        btnText[this.index + 1].children[0].innerHTML = "显示详情";
        this.index = -1;
      }
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
    handleClick(event) {
      console.log(event);
    },
    //详情
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSizeChange(val) {
      this.length = val;
      this.detail();
      this.delNewTrs();
    },
    handleCurrentChange(val) {
      this.start = (val - 1) * this.length;
      this.detail();
      this.delNewTrs();
    },
    //实时任务模板
    handleSelectionChange1(val) {
      this.multipleSelection1 = val;
    },
    handleSizeChange1(val) {
      this.length1 = val;
    },
    handleCurrentChange1(val) {
      this.start1 = (val - 1) * this.length;
      this.detail();
    },
    detail() {
      var Smartmeter = Parse.Object.extend("Smartmeter");
      var smartmeter = new Parse.Query(Smartmeter);
      smartmeter.equalTo("vcaddr", this.vcaddr);
      if (this.input5 != "") {
        smartmeter.equalTo("addr", this.input5);
      }
      smartmeter.skip(this.start);
      smartmeter.limit(this.length);
      smartmeter.count().then(
        count => {
          this.total = count;
          smartmeter.find().then(resultes => {
            this.tableData = resultes;
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

      // detailforcon(this.start,this.length,this.vcaddr, ++this.draw).then(res=>{
      //    if(res){
      //        this.tableData = res.data
      //        this.total=res.recordsFiltered
      //    }
      // }).catch(err=>{
      //     console.log(err)
      // })
    },
    //电表详情
    getMeterInfo(val) {},
    //电表搜索
    searchformeter() {
      this.start = 0;
      this.length = 10;
      this.detail();
    },
    //实时任务补抄
    supplementarycopy(val) {}
  }
};
</script>
<style scoped>
.topsearch,
.secondsearch {
  margin-top: 30px;
}
</style>
<style>
.condetail {
  background: #ffffff;
  padding-left: 20px;
  padding-top: 20px;
  box-sizing: border-box;
  min-height: 100%;
}
.condetail .el-table th {
  background: #fafafa;
  color: #666666;
  font-weight: 600;
}
.condetail .el-dialog__body {
  background: #f5f5f5;
}
.condetail .el-dialog__footer {
  padding-bottom: 50px;
}
/* 展开表格div样式 */
.condetail .el-table .NewDiv {
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  color: #1b88e7;
}
.condetail .el-table .NewDiv p {
  width: 25%;
  text-align: left;
}
.condetail .el-table .NewDiv p span {
  color: #921aff;
}
</style>