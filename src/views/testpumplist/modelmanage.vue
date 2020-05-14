<template>
  <div class="modelmanamge">
    <div class="mdoeltop">
      <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
        <el-form-item label="质检项目">
          <el-input v-model="formInline.name" placeholder="请输入项目名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">查询</el-button>
          <el-button type="primary">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="adddevices">
        <el-button type="primary" size="small" @click="addStandard">新增质检项目</el-button>
      </div>
    </div>
    <!--表格-->
    <div class="tableblock">
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%">
        <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
        <el-table-column label="检验项目ID" align="center" width="200">
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column label="检验项目名称" align="center">
          <template slot-scope="scope">{{ scope.row.attributes.name }}</template>
        </el-table-column>
        <!-- <el-table-column label="标准类型" width="250" align="center">
          <template slot-scope="scope">{{ scope.row.attributes.model }}</template>
        </el-table-column>-->
        <el-table-column label="适用产品" align="center" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.attributes.client }}</template>
        </el-table-column>
        <!-- <el-table-column label="检测类别" width="200" align="center">
          <template slot-scope="scope">{{ getBz(scope.row.attributes.standard) }}</template>
        </el-table-column>
        <el-table-column label="标准发行单位" width="250" align="center">
          <template slot-scope="scope">{{ scope.row.attributes.client }}</template>
        </el-table-column>
        <el-table-column label="标准发行时间" align="center" width="200">
          <template slot-scope="scope">{{ timestampToTime(scope.row.attributes.start_time) }}</template>
        </el-table-column>-->
        <el-table-column label="检测标准管理" align="center" width="300">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="addReportChildren(scope.row)">新增模版</el-button>
            <el-button type="danger" size="small" @click="deleteReport(scope.row.id)">删 除</el-button>
            <el-button type="primary" size="small" @click="detailReportChildren(scope.row)">模版管理</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pageblock">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <el-dialog title="检验质检项目" :visible.sync="dialogVisible" width="60%">
      <div class="addContent">
        <el-form :model="form">
          <el-row>
            <el-col :span="12">
              <el-form-item label="质检项目名称" :label-width="formLabelWidth">
                <el-input v-model="form.name" autocomplete="off" placeholder="质检项目名称"></el-input>
              </el-form-item>

              <!-- <el-form-item label="标准类型" :label-width="formLabelWidth">
                <el-select v-model="form.model" placeholder="选择标准类型">
                  <el-option label="性能检测" value="性能检测"></el-option>
                </el-select>
              </el-form-item>-->
            </el-col>
            <el-col :span="12">
              <el-form-item label="适用产品" :label-width="formLabelWidth">
                <el-select v-model="form.product" placeholder="选择适用产品">
                  <el-option
                    v-for="(item,index) in pumpmodel"
                    :label="item"
                    :value="item"
                    :key="index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <!-- <el-form-item label="检测标准文号" :label-width="formLabelWidth">
                <el-input
                  v-model="form.inspection_number"
                  autocomplete="off"
                  placeholder="请输入检测标准文号"
                ></el-input>
              </el-form-item>
              <el-form-item label="标准类别" :label-width="formLabelWidth">
                <el-select v-model="form.standard" placeholder="选择标准类别">
                  <el-option
                    v-for="(item,index) in standard"
                    :key="index"
                    :value="item.value"
                    :label="item.label"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="标准发行单位" :label-width="formLabelWidth">
                <el-input v-model="form.client" autocomplete="off" placeholder="请输入标准发行单位"></el-input>
              </el-form-item>
              <el-form-item label="标准发行时间" :label-width="formLabelWidth">
                <el-date-picker
                  v-model="form.start_time"
                  type="date"
                  value-format="timestamp"
                  placeholder="选择日期"
                ></el-date-picker>
              </el-form-item>-->
              <!-- <el-form-item label="备注信息" :label-width="formLabelWidth">
                <el-input type="textarea" v-model="form.desc" :rows="4" placeholder="请输入标准备注信息"></el-input>
              </el-form-item>-->
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addReport">确 定</el-button>
      </span>
    </el-dialog>
    <!--标准模版添加-->
    <el-dialog title="新增标准模版" :visible.sync="dialogForm" width="30%">
      <el-form :model="childrenform">
        <el-form-item label="模版名称" :label-width="formLabelWidth">
          <el-input v-model="childrenform.name" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="模版模型" :label-width="formLabelWidth">
          <img v-if="childrenform.imageUrl" :src="childrenform.imageUrl" class="avatar" />

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
              style="position:relative;top:-100px; opacity:0;z-index:5;height:100px;width:100px;cursor:pointer"
            />
          </form>
          <!-- <el-button type="primary" size="mini" @click="submitUpload">上传到服务器</el-button> -->
          <!-- <el-button
            type="danger"
            @click="deleteImgsrc"
            size="mini"
            style="vertical-align:text-bottom"
            v-if="childrenform.imageUrl"
          >删除</el-button>-->
        </el-form-item>
        <el-form-item label="排序" :label-width="formLabelWidth">
          <el-input-number v-model="childrenform.index" autocomplete="off" :min="1"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogForm = false">取 消</el-button>
        <el-button type="primary" @click="addStandardChildren">确 定</el-button>
      </div>
    </el-dialog>
    <!--模版管理-->
    <el-dialog title="模版" :visible.sync="dialogTableVisible" top="5vh">
      <el-table :data="producttable" style="width:100%;text-align:center">
        <el-table-column label="序号" type="index" align="center" width="100"></el-table-column>
        <el-table-column label="名称" align="center" width="100">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="类容" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.icon" alt class="el-upload-list__item-thumbnail" />
          </template>
        </el-table-column>
        <el-table-column label="模版管理" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="productView(scope.row.objectId)">绘图</el-button>
            <el-button type="删除" size="small" @click="deleteProduct(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pageblock">
        <el-pagination
          @size-change="handleProductSize"
          @current-change="handleProductChange"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="productpagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="producttotal"
        ></el-pagination>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Parse from "parse";
import { returnLogin } from "@/utils/return";
import { error } from "util";
import { timestampToTime } from "@/api/login";
import Cookies from "js-cookie";
import ajax from "@/utils/$ajax";
import $ from "jquery";
export default {
  data() {
    return {
      action: "http://file.iotn2n.com/shapes/upload",
      pumpmodel: [
        "离心泵",
        "潜水泵",
        "混流泵",
        "螺杆泵",
        "轴流泵",
        "旋涡泵",
        "电动泵",
        "蒸汽泵",
        "齿轮泵",
        "罗茨泵",
        "滑片泵",
        "喷射泵",
        "升液泵",
        "电磁泵"
      ],
      standard: [
        { label: "国际标准", value: "ITBZ" },
        { label: "国家标准", value: "GJBZ" },
        { label: "行业标准", value: "HYBZ" },
        { label: "企业标准", value: "QYBZ" },
        { label: "地方标准", value: "DFBZ" },
        { label: "其他标准", value: "OTHER" }
      ],
      ipaddr: "",
      formLabelWidth: "120px",
      dialogVisible: false,
      formInline: {
        name: ""
      },
      pagesize: 10,
      start: 0,
      total: 0,
      //检验项目模板
      tableData: [],
      form: {
        name: "",
        product: "",
        inspection_number: "",
        standard: "",
        start_time: "",
        model: ""
      },
      childrenform: {
        name: "",
        imageUrl: "",
        index: 1
      },
      reportid: "",
      dialogForm: false,
      defaultconfig: {
        name: "图层",
        layer: {
          width: 800,
          height: 600,
          backColor: "#eee",
          backgroundImage: "",
          widthHeightRatio: ""
        },
        deviceid: "",
        components: [],
        index: 1
      },
      //模版管理
      dialogTableVisible: false,
      producttable: [],
      productpagesize: 10,
      producttotal: 0,
      productstart: 0,
      file: "",
      productlist: [],
      productrow: {}
    };
  },
  mounted() {
    this.getReport();
  },
  methods: {
    timestampToTime(datetime) {
      // 转为正常的时间格式 年-月-日 时:分:秒
      var date = new Date(datetime);
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
      return Y + M + D;
    },
    getReport() {
      var Report = Parse.Object.extend("Report");
      var report = new Parse.Query(Report);
      report.skip(this.start);
      report.limit(this.pagesize);
      report.count().then(
        count => {
          this.total = count;
          report.find().then(resultes => {
            this.tableData = resultes;
          });
        },
        error => {
          returnLogin(error);
        }
      );
    },
    getBz(val) {
      var string = "";
      this.standard.map(item => {
        if (item.value == val) {
          string = item.label;
        }
      });
      return string;
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.getReport();
    },
    handleCurrentChange(val) {
      this.start = (val - 1) * this.pagesize;
      this.getReport();
    },
    handleProductSize(val) {
      this.productpagesize = val;
      this.detailReportChildren(this.productrow);
    },
    handleProductChange(val) {
      this.start = (val - 1) * this.pagesize;
      this.detailReportChildren(this.productrow);
    },
    //增加设备弹窗
    addStandard() {
      this.dialogVisible = true;
    },
    addReport() {
      var Report = Parse.Object.extend("Report");
      var report = new Report();
      report.set("name", this.form.name);
      report.set("client", this.form.product);
      report.set("product", []);
      report.save().then(
        response => {
          if (response) {
            this.$message("创建成功");
            this.dialogVisible = false;
            this.getReport();
          }
        },
        error => {
          returnLogin(error);
        }
      );
    },
    //图片上传
    upload(event) {
      if (event) {
        var file = event.target.files[0]; //name: "dangqi1.png" || type: "image/png"
        var name = file.name;
        var testmsg = event.target.files[0].type;
        var type = file.type.split("/")[0];
        var extension =
          testmsg === "image/jpeg" ||
          testmsg === "image/JPEG" ||
          testmsg === "image/png" ||
          testmsg === "image/PNG" ||
          testmsg === "image/bpm" ||
          testmsg === "image/BPM";
        if (!extension) {
          //将图片img转化为base64
          this.$message({
            message: "请上传图片",
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
      formdata.append("output", "json");
      formdata.append("path", Cookies.get("appids"));
      formdata.append("scene", Cookies.get("appids"));
      formdata.append("auth_token", Cookies.get("access_token")); //下面是要传递的参数
      //此处必须设置为  multipart/form-data
      let config = {
        headers: {
          "Content-Type": "multipart/form-data" //之前说的以表单传数据的格式来传递fromdata
        }
      };
      this.$http.post(Cookies.get("fileserver"), formdata).then(res => {
        if (res) {
          this.childrenform.imageUrl = res.body.url;
        }
      });
    },
    addReportChildren(row) {
      this.productlist = [];
      this.reportid = row.id;
      this.productlist = this.productlist.concat(row.attributes.product);
      this.dialogForm = true;
    },
    deleteReport(id) {
      this.$confirm("此操作将永久删除该检测标准, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var Report = Parse.Object.extend("Report");
          var report = new Report();
          report.id = id;

          report.destroy().then(
            response => {
              if (response) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.getReport();
              }
            },
            error => {
              returnLogin(error);
            }
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    detailReportChildren(row) {
      this.productrow = row;
      var where = {
        objectId: { $in: row.attributes.product }
      };
      var datas = {
        limit: this.productpagesize,
        skip: this.productstart,
        keys: "count(*)",
        where: JSON.stringify(where)
      };
      ajax("/classes/Product", "GET", datas)
        .then(response => {
          this.dialogTableVisible = true;
          this.producttable = response.results;
          this.producttotal = response.count;
        })
        .catch(error => {
          this.$message(error)
        });
    },
    //增加产品以及设备
    addStandardChildren() {
      if (this.childrenform.imageUrl == "") {
        this.$message("请上传模版图片");
        return;
      }
      var appid = Cookies.get("appids");
      var ACL = {
        key: {}
      };
      for (var key in ACL) {
        key = "role:" + Cookies.get("appids");
        ACL[key] = {
          read: true,
          write: true
        };
      }
      delete ACL.key;
      $.ajax({
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        headers: {
          sessionToken: Cookies.get("access_token")
        },
        data: JSON.stringify({
          ACL: ACL,
          config: {
            name: "图层",
            layer: {
              width: 800,
              height: 600,
              backColor: "#eee",
              backgroundImage: this.childrenform.imageUrl,
              widthHeightRatio: ""
            },
            deviceid: "",
            components: [],
            index: this.childrenform.index
          },
          icon: this.childrenform.imageUrl,
          nodeType: 1,
          devType: "report",
          name: this.childrenform.name
        }),
        url: Cookies.get("apiserver") + "/classes/Product",
        success: response => {
          var _this = this;
          var Report = Parse.Object.extend("Report");
          var report = new Report();
          report.id = _this.reportid;
          var product = _this.productlist.concat([response.objectId]);
          report.set("product", product);
          report.save().then(
            res => {
              _this.$message("创建成功");
              _this.childrenform.name = "";
              _this.childrenform.imageUrl = "";
              _this.childrenform.index++;
              _this.dialogForm = false;
            },
            error => {
              returnLogin(error);
            }
          );
        }
      });
    },
    deleteImgsrc() {
      event.stopPropagation();
      this.childrenform.imageUrl = "";
    },
    productView(id) {
      var url = `${window.location.origin}/spa/?proudctid=${id}`;
      window.open(url, "__blank");
    },
    // 删除产品
    deleteProduct(row){
       var arr =this.productrow.attributes.product
            arr.map((item,index)=>{
              if(item==row.objectId){
                console.log(index)
                arr.splice(index,1)
              }
            })
      $.ajax({
        type: 'DELETE',
        contentType:'application/json',
        dataType:'json',
        headers:{
          "sessionToken":Cookies.get('access_token')
        },
        url: Cookies.get('apiserver')+'/classes/Product/'+row.objectId,
        success:(response)=>{
          if(response){
            var Report = Parse.Object.extend('Report')
            var report = new Report()
            report.id = this.productrow.id
            report.set('product',arr)
            report.save().then(response=>{
              this.$message('删除成功')
              this.detailReportChildren(this.productrow)
            },error=>{
              returnLogin(error)
            })          
           
          }
        }
      })
    }
  }
};
</script>
<style lang="scss" scoped>
.modelmanamge {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  background: #ffffff;
  /deep/ .el-select {
    width: 100%;
  }
  /deep/ .el-date-editor {
    width: 100%;
  }
  /deep/ .el-input-number {
    width: 100%;
  }
  .tableblock {
    margin-top: 20px;
  }
  .pageblock {
    margin-top: 20px;
  }
}
</style>
<style>
.avatar-uploader {
  display: inline-block;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 150px;
  height: 150px;
  line-height: 150px;
  text-align: center;
  border: 1px dashed #cccccc;
}
.avatar {
  width: 150px;
  height: 150px;
  display: block;
}
.el-upload-list__item-thumbnail {
  vertical-align: middle;
  display: inline-block;
  width: 70px;
  height: 70px;
  position: relative;
  z-index: 1;
  margin-left: -80px;
  background-color: #fff;
}
@media screen and (max-width: 1350px) {
  .modelmanamge .el-col {
    width: 100%;
  }
}
</style>
