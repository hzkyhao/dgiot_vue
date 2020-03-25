<template>
  <div class="enrollment">
    <div class="enrollment_header">
      <el-form :inline="true" :model="formInline" class="demo-form-inline" label-width="80px">
        <el-form-item label="供电单位">
          <el-input placeholder="请输入供电单位"></el-input>
        </el-form-item>
        <el-form-item label="授权状态">
          <el-select v-model="formInline.auth" placeholder @change="authSelect">
            <el-option label="全部" :value="9"></el-option>
            <el-option label="已授权" :value="1"></el-option>
            <el-option label="未授权" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="注册状态">
          <el-select v-model="formInline.reg" placeholder>
            <el-option label="全部" :value="9"></el-option>
            <el-option label="未注册" :value="0"></el-option>
            <el-option label="已注册" :value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="终端地址">
          <el-input v-model="formInline.deveui"></el-input>
          <!-- <el-select v-model="formInline.devaddr" placeholder="请选择终端地址" @change="devSelect">
            <el-option
              v-for="(item,index) in dtudata"
              :label="item.attributes.deveui"
              :value="item.attributes.deveui"
              :key="index"
            ></el-option>
          </el-select>-->
        </el-form-item>
        <el-form-item label="设备编号">
          <el-input v-model="formInline.addr"></el-input>
        </el-form-item>
        <el-form-item label="操作时间">
          <el-date-picker
            v-model="formInline.datetime"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width:300px"
          ></el-date-picker>
          <!-- <el-date-picker  type="datetime" placeholder="选择日期时间"></el-date-picker> -->
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="searchEnrollment">查询</el-button>
          <el-button type="primary" size="mini" @click="authQr">授权接入</el-button>
          <el-button type="danger" size="mini" @click="deleteMeter">删除记录</el-button>
        </el-form-item>
      </el-form>
      <div class="alldelete" style="padding:2px;background-color:#dbf0ff;font-size:14px;">
        <p>
          <i class="el-icon-info" style="color:#409eff;margin-right:5px"></i>已选择
          <span style="margin:0 10px;color:#409eff">{{meterselectdata.length}}</span>项
          <el-link type="primary" @click="deleteall" :underline="false">清空</el-link>
        </p>
      </div>
      <div class="table_enrollment">
        <el-table
          :data="tableData"
          style="width: 100%;text-align:center"
          border
          ref="articleTable"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" :selectable="selectInit"></el-table-column>
          <el-table-column
            label="序号"
            type="index"
            align="center"
            :index="(index)=>{
                        return Number(index+1) + Number((page-1)*pagesize)}"
            width="50"
          ></el-table-column>
          <el-table-column prop="date" label="供电单位" align="center"></el-table-column>
          <el-table-column label="设备编号" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.attributes.addr}}</span>
            </template>
          </el-table-column>
          <el-table-column label="关联终端" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.attributes.deveui}}</span>
            </template>
          </el-table-column>
          <el-table-column label="授权状态" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.attributes.auth==0" type="warning" effect="dark">未授权</el-tag>
              <el-tag v-else-if="scope.row.attributes.auth==1" type="success" effect="dark">已授权</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="注册状态" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.attributes.reg==0" type="warning" effect="dark">未注册</el-tag>
              <el-tag v-else-if="scope.row.attributes.reg==1" type="success" effect="dark">已注册</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-link
                type="primary"
                :disabled="scope.row.attributes.reg==1"
                @click="regMeter(scope.row,1)"
                :underline="false"
                icon="el-icon-edit"
                style="border-right:1px solid #cccccc;padding-right:5px"
              >注册</el-link>
              <!-- <el-button type="primary" size="small"  >注册</el-button> -->
              <!-- <el-button type="primary" size="small" @click="regMeter(scope.row,0)">查看</el-button> -->
              <el-link
                type="primary"
                @click="regMeter(scope.row,0)"
                icon="el-icon-view"
                :underline="false"
              >查看</el-link>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="pag_enrollment">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <!--新增表-->
    <div>
      <el-dialog title="新增" :visible.sync="dialogFormVisibleAdd">
        <el-form :model="mod_form">
          <el-form-item label="供电单位" :label-width="formLabelWidth">
            <el-input v-model="mod_form.gddw" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="用户编号" :label-width="formLabelWidth">
            <el-input v-model="mod_form.yhabh" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="用户名称" :label-width="formLabelWidth">
            <el-input v-model="mod_form.yhmc" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="台区名称" :label-width="formLabelWidth">
            <el-input v-model="mod_form.tq" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="集中器地址" prop="addr" :label-width="formLabelWidth">
            <el-input v-model="mod_form.vcaddr_web" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="电能表地址" prop="addr" :label-width="formLabelWidth">
            <el-input v-model="mod_form.addr_web" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="PN值" :label-width="formLabelWidth">
            <el-input v-model="mod_form.pn" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="抄表类型" :label-width="formLabelWidth">
            <el-select v-model="mod_form.cblx" clearable placeholder="请选择抄表类型">
              <el-option
                v-for="item of mod_form.cblx_arr"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="费控类型" :label-width="formLabelWidth">
            <el-select v-model="mod_form.fklx" clearable placeholder="请选择费控类型">
              <el-option
                v-for="item of mod_form.fklx_arr"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="费控额度" :label-width="formLabelWidth">
            <el-input v-model="mod_form.fked" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="用户地址" :label-width="formLabelWidth">
            <el-cascader
              size="large"
              :options="options"
              v-model="mod_form.addr"
              @change="handleAddChange"
            ></el-cascader>
            <el-input
              type="textarea"
              :rows="2"
              v-model="mod_form.yhdz"
              autocomplete="off"
              placeholder="详细地址"
              style="margin-top:10px"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" v-if="isshowmeter==1">
          <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
          <el-button type="primary" @click="sure">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { regionData, CodeToText } from "element-china-area-data";
import { addMeter } from "@/api/metersearch";
import { AuthMeter } from "@/api/searchMeter";
import Parse from "parse";
import { Promise } from "q";
export default {
  data() {
    return {
      page: 1,
      start: 0,
      pagesize: 10,
      total: 0,
      formInline: {
        auth: 9,
        reg: 9,
        deveui: "",
        addr: "",
        datetime: []
      },
      meterselectdata: [],
      tableData: [],
      dtudata: [],
      dialogFormVisibleAdd: false,
      formLabelWidth: "120px",
      options: regionData,
      mod_form: {
        gsmc: "", //公司名称
        ccbh: "", //出厂编号
        yhabh: "",
        vcaddr_web: "",
        deveui: "",
        tq: "",
        yhmc: "",
        pn: "",
        addr_web: "",
        yhdz: "",
        cblx: "",
        cblx_arr: [],
        fklx: "",
        fklx_arr: [{ label: "Xa0OFOrox2", value: 1 }],
        fked: "",
        addr: [], //三级地址
        provinces: "", //省市区
        gddw: "" //供电单位
      },
      meterIds: [],
      meterobjectId: "",
      authmeterId: "",
      isshowmeter: 1
    };
  },
  mounted() {
    // this.getDtu();
  },
  methods: {
    // getDtu() {
    //   var Dtu = Parse.Object.extend("Dtu");
    //   var dtu = new Parse.Query(Dtu);
    //   dtu.equalTo('devtype','DLT645')
    //   dtu.find().then(resultes => {
    //     this.dtudata = resultes;
    //     this.formInline.devaddr = resultes[0].attributes.deveui;
    //     this.formInline.number = resultes[0].attributes.devaddr;
    //   });
    // },
    // devSelect(val) {
    //   this.dtudata.map(items => {
    //     if (items.attributes.deveui == val) {
    //       this.formInline.number = items.attributes.devaddr;
    //     }
    //   });
    // },
    deleteall() {
      this.$refs.articleTable.clearSelection();
    },
    //表格多选不能选择
    selectInit(row, index) {
      if (row.attributes.auth == 1) {
        return false;
      } else {
        return true;
      }
    },
    clearSelect() {},
    //删除电表
    deleteMeter() {
      this.$confirm("是否删除已选中未授权电表", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          Promise.all([this.meterIds.map(item => this.getMeterId(item))])
            .then(data => {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              setTimeout(() => {
                this.searchEnrollment();
              }, 1000);
            })
            .catch(error => {
              this.$message({
                message: error,
                type: "error"
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
    //获取Meterid
    getMeterId(objectId) {
      var Dtu = Parse.Object.extend("Dtu");
      var dtu = new Parse.Query(Dtu);
      dtu.get(objectId).then(object => {
        object.destroy().then(response => {});
      });
    },
    authSelect(val) {
      console.log(val);
      if (val == 0) {
        this.formInline.reg = 0;
      }
    },
    //查询
    searchEnrollment() {
      var Dtu = Parse.Object.extend("Dtu");
      var dtu = new Parse.Query(Dtu);
      if (this.formInline.datetime.length != 0) {
        var starttime = Math.ceil(this.formInline.datetime[0].getTime() / 1000);
        var endtime = Math.ceil(this.formInline.datetime[1].getTime() / 1000);
        dtu.greaterThan("ts", starttime);
        dtu.lessThan("ts", endtime);
      }
      dtu.equalTo("devtype", "DLT645");
      //  dtu.equalTo('deveui',this.formInline.devaddr)
      if (this.formInline.deveui != "") {
        dtu.equalTo("deveui", this.formInline.deveui);
      }
      if (this.formInline.addr != "") {
        dtu.equalTo("addr", this.formInline.addr);
      }
      if (this.formInline.reg != 9) {
        dtu.equalTo("reg", this.formInline.reg);
      }
      if (this.formInline.auth != 9) {
        dtu.equalTo("auth", this.formInline.auth);
      }
      dtu.skip(this.start);
      dtu.limit(this.pagesize);
      dtu.count().then(
        count => {
          this.total = count;
          dtu.find().then(resultes => {
            this.tableData = resultes;
          });
        },
        error => {
          if (error.code == 119) {
            this.$message({
              type: "error",
              message: "没有操作权限"
            });
          }
        }
      );
    },
    //电表授权
    authQr() {
      this.$confirm("是否注册已选中电表", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "success"
      })
        .then(() => {
          AuthMeter(this.meterselectdata, 1)
            .then(resultes => {
              if (resultes) {
                this.$message({
                  type: "success",
                  message: "已成功注册"
                });
                this.searchEnrollment();
              }
            })
            .catch(error => {
              this.$message({
                type: "error",
                message: error.error
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消授权"
          });
        });
    },
    regMeter(row, number) {
      this.isshowmeter = number;
      if (row.attributes.auth == 0) {
        this.$message({
          type: "error",
          message: "此表未授权无法注册或查看"
        });
      } else {
        this.dialogFormVisibleAdd = true;
        var Smartmeter = Parse.Object.extend("Smartmeter");
        var smartmeter = new Parse.Query(Smartmeter);
        smartmeter.equalTo("addr_web", row.attributes.addr);
        smartmeter.find().then(resultes => {
          this.mod_form.addr_web = resultes[0].attributes.addr_web;
          this.meterobjectId = resultes[0].id;
          this.authmeterId = row.id;
          this.mod_form.yhabh = resultes[0].attributes.yhabh;
          this.mod_form.vcaddr_web = resultes[0].attributes.vcaddr_web;
          this.mod_form.deveui = resultes[0].attributes.deveui;
          this.mod_form.tq = resultes[0].attributes.tq;
          this.mod_form.yhmc = resultes[0].attributes.yhmc;
          this.mod_form.pn = resultes[0].attributes.pn;
          this.mod_form.addr_web = resultes[0].attributes.addr_web;
          this.mod_form.yhdz = resultes[0].attributes.yhdz;
          this.mod_form.gddw = resultes[0].attributes.gddw;
        });
      }
    },
    //分页
    handleSizeChange(val) {
      this.pagesize = val;
      this.searchEnrollment();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.start = (val - 1) * this.pagesize;
      this.searchEnrollment();
    },
    handleSelectionChange(val) {
      this.meterselectdata = [];
      this.meterIds = [];
      val.map(item => {
        this.meterselectdata.push(item.attributes.addr);
        this.meterIds.push(item.id);
      });
    },
    sure() {
      this.$confirm("是否注册当前电表?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "success"
      })
        .then(() => {
          var Yhmx = Parse.Object.extend("Smartmeter");
          var query = new Parse.Query(Yhmx);
          if (!/^[0-9A-Z]{8,12}$/.test(this.mod_form.vcaddr_web)) {
            this.$message.error("请输入正确的集中器地址8-12位");
            return;
          } else if (!/^[0-9]{12}$/.test(this.mod_form.addr_web)) {
            this.$message.error("请输入正确的12位电能表地址");
            return;
          } else if (!/^[0-9]+$/.test(this.mod_form.yhabh)) {
            this.$message.error("请输入正确的用户编号");
            return;
          } else if (this.mod_form.pn < 0 || this.mod_form.pn > 2032) {
            this.$message.error("请输入正确的pn值(0-2032之间)");
            return;
          }
          query.get(this.meterobjectId).then(object => {
            object.set("yhabh", this.mod_form.yhabh);
            object.set("vcaddr_web", this.mod_form.vcaddr_web);
            object.set("deveui", this.mod_form.deveui);
            object.set("tq", this.mod_form.tq);
            object.set("yhmc", this.mod_form.yhmc);
            object.set("pn", parseInt(this.mod_form.pn));
            object.set("addr_web", this.mod_form.addr_web);
            object.set("yhdz", this.mod_form.provinces + this.mod_form.yhdz);
            object.set("gddw", this.mod_form.gddw);
            object.save().then(
              resultes => {
                var Dtu = Parse.Object.extend("Dtu");
                var dtu = new Parse.Query(Dtu);
                dtu.get(this.authmeterId).then(res => {
                  res.set("reg", 1);
                  res.save().then(response => {
                    this.$message({
                      type: "success",
                      message: "注册成功"
                    });
                    this.dialogFormVisibleAdd = false;
                    this.searchEnrollment();
                    this.mod_form.addr_web = "";
                    this.mod_form.ccbh = "";
                    this.mod_form.provinces = "";
                    this.mod_form.yhdz = "";
                    this.gsmc = "";
                    this.mod_form.pn = "";
                    this.mod_form.vcaddr_web = "";
                    this.mod_form.gddw = "";
                    this.mod_form.tq = "";
                    this.mod_form.yhmc = "";
                    this.mod_form.yhabh = "";
                  });
                });
              },
              error => {
                if (error.code == 119) {
                  this.$message({
                    type: "error",
                    message: "没有操作权限"
                  });
                }
              }
            );
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消注册"
          });
        });
    },

    handleAddChange(value) {
      //新增
      let data =
        CodeToText[value[0]] +
        ", " +
        CodeToText[value[1]] +
        ", " +
        CodeToText[value[2]];
      this.mod_form.provinces = data.split(",").join("");
    }
  }
};
</script>
<style scoped>
.enrollment {
  padding: 20px;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
}
.table_enrollment,
.pag_enrollment {
  margin-top: 20px;
}
</style>
<style>
.enrollment .enrollment_header .el-input--suffix .el-input__inner,
.enrollment .enrollment_header .el-input__inner,
.enrollment .enrollment_header .el-date-editor.el-input {
  height: 26px;
  border-radius: 0;
  width: 160px;
}
.enrollment .el-form-item {
  margin-bottom: 10px;
}
.enrollment .el-dialog .el-dialog__body {
  padding: 10px;
}
.enrollment .el-dialog .el-dialog__body .el-form {
  display: flex;
  flex-wrap: wrap;
}
.enrollment .el-dialog .el-dialog__footer {
  padding-bottom: 10px;
}
.enrollment .el-dialog .el-input--suffix .el-input__inner {
  padding: 0 15px;
}
.enrollment .el-table th {
  background: #fafafa;
}
.enrollment .el-date-editor .el-range-separator {
  line-height: initial;
}
.enrollment .el-date-editor .el-range__icon {
  line-height: 0;
}
</style>

