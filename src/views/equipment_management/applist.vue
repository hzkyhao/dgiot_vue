<template>
  <div id="application">
    <h3>{{$t('application.applicationmanagement')}}</h3>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="$t('application.myapplication')" name="app">
        <div class="form">
          <div class="search">
            <el-input v-model="name" :placeholder="$t('application.applicationname')" size="small"></el-input>
            <el-button
              type="primary"
              @click="getAppMange(0)"
              size="small"
            >{{$t('application.search')}}</el-button>
          </div>
          <!-- <el-button
            type="primary"
            @click="handleClickAdd"
            size="small"
          >{{$t('application.newapplication')}}</el-button> -->
        </div>
        <el-table :data="tableData" style="width:100%;">
          <el-table-column
            prop="productIdentifier"
            :label="$t('application.applicationidentification')"
          ></el-table-column>
          <el-table-column prop="title" :label="$t('application.applicationname')"></el-table-column>
          <el-table-column prop="productIdentifier" label="应用单位"></el-table-column>
          <el-table-column prop="scale" :label="$t('application.scaleofservice')" sortable></el-table-column>
          <el-table-column prop="category" :label="$t('application.industrytype')"></el-table-column>
          <el-table-column prop="creation_time" :label="$t('application.createtime')"></el-table-column>
          <el-table-column prop="operation" :label="$t('developer.operation')" width="350">
            <template slot-scope="scope">
              <el-popover
                placement="top"
                width="300"
                :ref="`popover-${scope.$index}`"
                trigger="hover"
              >
                <p>部署工具本地运行</p>
                <el-link
                  type="primary"
                  :underline="false"
                  slot="reference"
                  
                  @click="lictool(scope.row)"
                >
                  下载
                  <i class="el-icon-download"></i>
                </el-link>
                <el-link
                  type="primary"
                  :underline="false"
                  slot="reference"
                  @click="goToLictool(scope.row)"
                >查看机器</el-link>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page.currentPage"
          :page-sizes="page.pageSizes"
          :page-size="page.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page.total"
        ></el-pagination>
      </el-tab-pane>
   
    <el-tab-pane label="机器列表" name="server">
      <div class="serverlist">
        <div class="servercontent">
          <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
            <!-- <el-form-item>
          <el-input v-model="formInline.user" placeholder="请输入用户单位"></el-input>
            </el-form-item>-->
            <el-form-item>
              <el-select v-model="formInline.region" placeholder="运行状态">
                <el-option label="全部" :value="1"></el-option>
                <el-option label="在线" :value="true"></el-option>
                <el-option label="离线" :value="false"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="formInline.app" placeholder="应用商名称">
                <el-option
                  v-for="(item,index) in applist"
                  :label="item.attributes.title"
                  :key="index"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getOrigin(0)">查询</el-button>
              <el-button type="primary">新增</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="servertable">
          <el-table :data="serverData" style="width: 100%;text-align:center">
            <el-table-column label="编号" type="index" width="50" align="center"></el-table-column>
            <el-table-column label="客户应用" align="center" width="200">
              <template slot-scope="scope">
                <span>{{ scope.row.attributes.appname}}</span>
              </template>
            </el-table-column>
            <el-table-column label="服务器IP" align="center" width="150">
              <template slot-scope="scope">
                <span>{{ scope.row.attributes.ip }}</span>
              </template>
            </el-table-column>
            <el-table-column label="服务器配置" align="center" width="150">
              <template slot-scope="scope">
                <el-popover trigger="hover" placement="top">
                  <p>IP地址: {{ scope.row.attributes.ip }}</p>
                  <p>MAC地址: {{ scope.row.attributes.mac}}</p>
                  <div slot="reference" class="name-wrapper">
                    <el-tag effect="dark">
                      <span>{{ scope.row.attributes.core+'核'+scope.row.attributes.memory+' '+scope.row.attributes.disk+'内存'}}</span>
                    </el-tag>
                  </div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="机器码" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.attributes.key }}</span>
              </template>
            </el-table-column>
            <el-table-column label="授权码" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.attributes.license }}</span>
              </template>
            </el-table-column>
            <el-table-column label="在线状态" align="center" width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.attributes.is_online==true" style="color:green">在线</span>
                <span v-else style="color:red">离线</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" align="center" width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.attributes.status=='unauthorized'" style="color:red">未授权</span>
                <span
                  v-else-if="scope.row.attributes.status=='start_install'"
                  style="color:green"
                >开始部署</span>
                <span v-else-if="scope.row.attributes.status=='installing'" style="color:green">部署中</span>
                <span v-else style="color:green">部署完成</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="200">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleDetail(scope.$index, scope.row)">详 情</el-button>
                <el-button size="mini" type="primary" @click="addserver(scope.row)">服务器部署</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="serverpagina">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
        <!--新增编辑弹窗-->
        <el-dialog title="服务部署" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="应用类型" prop="region">
              <el-select v-model="ruleForm.region" placeholder="请选择应用类型">
                <el-option label="标准版" value="standard"></el-option>
                <el-option label="企业版" value="enterprise"></el-option>
                <el-option label="旗舰版" value="ultimate"></el-option>
              </el-select>
              <p style="color:black;margin:0;position:absolute;top:30px;color:#cc6e00">标准版本为单机版</p>
            </el-form-item>
            <el-form-item label="授权码" prop="licensekey">
              <el-input v-model="ruleForm.licensekey" placeholder="请输入license授权码"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="updatedLicense('ruleForm')">部 署</el-button>
            <el-button @click="dialogFormVisible=false">取 消</el-button>
          </div>
        </el-dialog>
        <!--详情信息dialog-->

        <el-dialog title="详情" :visible.sync="dialogVisible" width="50%" :before-close="handleClose" :close-on-click-modal="false">
          <div>
            <el-input type="textarea" :rows="20" v-model="licensedetail" readonly></el-input>
          </div>
          <span slot="footer" class="dialog-footer"></span>
        </el-dialog>
      </div>
    </el-tab-pane>
     </el-tabs>
  </div>
</template>

<script>
import { getProject, handleZero, uploadLicense } from "@/api/applicationManagement";
import { utc2beijing } from "@/utils";
import Parse from "parse";
export default {
  data() {
    return {
      // tab标题
      label: "我的应用",
      // 初始页
      activeName: "app",
      // 查看模态框
      dialogVisible: false,
      // 应用名称
      name: "",
      // 分页
      page: {
        currentPage: 0,
        pageSizes: [10, 20, 30],
        pageSize: 10,
        total: 0
      },
      // 提示文本
      description: "暂无数据",
      // 表格
      tableData: [],
      // 查看展开
      isShow: false,
      arr: [],
      dialogFormVisible: false,
      dialogVisible: false,
      licensedetail: {},
      formInline: {
        user: "",
        region: 1,
        app: ""
      },
      serverData: [],
      pagesize: 10,
      total: 0,
      start: 0,
      licenseid: "",
      ruleForm: {
        name: "",
        region: "standard",
        date1: "",
        date2: "",
        appname: "",
        version: "",
        licensekey: ""
      },
      applist: [],
      rules: {
        name: [
          { required: true, message: "请输入预计设计规模" },
          { type: "number", message: "预计设计规模 必须为数字值" }
        ],
        region: [
          { required: true, message: "请选择应用类型", trigger: "change" }
        ],
        appname: [
          { required: true, message: "请选择需要应用", trigger: "change" }
        ],
        version: [
          { required: true, message: "请选择应用版本", trigger: "change" }
        ],
        licensekey: [
          { required: true, message: "license必填", trigger: "blur" }
        ],
        date1: [
          {
            type: "date",
            required: true,
            message: "请选择开始时间",
            trigger: "change"
          }
        ],
        date2: [
          {
            type: "date",
            required: true,
            message: "请选择结束时间",
            trigger: "change"
          }
        ]
      },
      pickerOptionsStart: {
        disabledDate: time => {
          let endDateVal = this.ruleForm.date2;
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
          let beginDateVal = this.ruleForm.date1;
          if (beginDateVal) {
            return time.getTime() < new Date(beginDateVal).getTime();
          } else {
            return time.getTime() < Date.now() - 8.64e7;
          }
        }
      }
    };
  },
  created() {
      this.getAppMange();
    //  this.getOrigin(0)
     this.getAppList()
  },
  methods: {
    // 访问
    handleClickVisit(scope) {
      let index = scope.$index;
      let productIdentifier = this.tableData[index].productIdentifier;
      let url =
        window.location.origin + "/iot/" + productIdentifier + "#/login";
      window.open(url, "__blank");
    },
    // 查询应用信息
    getAppMange(start) {
      if (start == 0) {
        this.page.currentPage = 0;
      }
      this.tableData = [];
      let where = {};
      if (this.name) {
        where.title = this.name;
      }
      getProject({
        limit: this.page.pageSize,
        skip: this.page.currentPage,
        keys: "count(*)",
        where
      }).then(res => {
        let r = res.results;
        this.label = `我的应用(${res.count})`;
        this.description = `获取${r.length}条数据`;
        this.page.total = res.count;
        for (let i = 0; i < r.length; i++) {
          let obj = {};
          obj.name = r[i].title;
          obj.objectId = r[i].objectId;
          obj.productIdentifier = r[i].productIdentifier;
          obj.scale = handleZero(r[i].scale);
          obj.creation_time = utc2beijing(r[i].createdAt);
          obj.end_time = utc2beijing(r[i].updatedAt);
          obj.category = r[i].category;
          obj.secret = r[i].secret;
          obj.logo = r[i].logo;
          obj.title = r[i].title;
          obj.dashboard = r[i].dashboard;
          this.tableData.push(obj);
        }
      });
    },
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.getAppMange();
    },
    handleCurrentChange(val) {
      this.page.currentPage = (val - 1) * this.page.pageSize;
      this.getAppMange();
    },
    // 查看
    handleClickLook(scope) {
      let index = scope.$index;
      console.log(scope);
      let html = `
            <table
                class="mailtable"
                style="width:100%;"
                border="0"
                cellspacing="0"
                cellpadding="0"
              >
                <tr>
                    <td style="text-align:left;
                    color: #74777a;
                    font-weight: 400;
                    background: #fafafc;
                    width:200px;
                    font-weight:bold;">App Id:</td>
                    <td>${scope.row.objectId}</td>
                </tr>
                <tr ">
                     <td style="color: #74777a;
                    font-weight: 400;
                    background: #fafafc;
                    width:200px;
                    padding-top:20px;
                    font-weight:bold;">App Secret:
                    </td>
                    <td style="padding-top:20px;">${scope.row.secret}</td>
                </tr>
                </table>
            `;
      this.$alert(html, "应用详情", {
        dangerouslyUseHTMLString: true
      });
    },
    // 跳转新增
    handleClickAdd() {
      this.$router.push({
        path: "/applicationManagement/addApp",
        query: { page: "add", title: "新增应用" }
      });
    },
    handleClick(tab,event){
      if(tab.name=='server'){
          this.getOrigin(0)
      }
    },
    // 跳转修改
    handleClickUpdate(scope) {
      let row = scope.row;
      this.$router.push({
        path: "/applicationManagement/addApp",
        query: {
          page: "update",
          title: "修改应用",
          name: row.name,
          scale: row.scale,
          creation_time: row.creation_time,
          end_time: row.end_time,
          category: row.category,
          productIdentifier: row.productIdentifier,
          secret: row.secret,
          objectId: row.objectId,
          logo: row.logo,
          dashboard: row.dashboard,
          background: row.background
        }
      });
    },
    lictool(row) {
      console.log(row);
      uploadLicense(row.objectId, row.secret)
        .then(resultes => {
          if (resultes) {
            window.open(
              window.location.origin +
                "/iotapi/lictool?appid=" +
                row.objectId +
                "&appsecret=" +
                row.secret,
              "_blank"
            );
          }
        })
        .catch(error => {
          this.$message.error(error.error);
        });
    },
    getAppList() {
      var Project = Parse.Object.extend("Project");
      var project = new Parse.Query(Project);
      project.find().then(
        response => {
          if (response) {
            this.applist = response;
          }
        },
        error => {
          returnLogin(error);
        }
      );
    },
    //初始化数
    getOrigin(isstart) {
      if (isstart == 0) {
        this.start = 0;
      }
      var License = Parse.Object.extend("License");
      var license = new Parse.Query(License);
      if (this.formInline.region != 1) {
        license.equalTo("is_online", this.formInline.region);
      }
      if (this.formInline.app != "") {
        license.equalTo("app", this.formInline.app);
      }
      license.ascending("appname");
      license.skip(this.start);
      license.limit(this.pagesize);
      license.count().then(count => {
        this.total = count;
        license.find().then(
          resultes => {
            if (resultes) {
              this.serverData = resultes;
            }
          },
          error => {
            returnLogin(error);
          }
        );
      });
    },
    //分页
    handleSizeChange(val) {
      this.pagesize = val;
      this.getOrigin(1);
    },
    handleCurrentChange(val) {
      this.start = (val - 1) * this.pagesize;
      this.getOrigin(1);
    },
    //服务器部署弹窗打开
    addserver(row) {
      this.licenseid = row.id;
      this.dialogFormVisible = true;
      if (row.attributes.license) {
        this.ruleForm.licensekey = row.attributes.license;
      } else {
        this.ruleForm.licensekey = "";
      }
    },
    //服务器部署
    updatedLicense(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var License = Parse.Object.extend("License");
          var license = new License();
          license.id = this.licenseid;
          license.set("type", this.ruleForm.region);
          license.set("license", this.ruleForm.licensekey);
          license.set("status", "start_install");
          license.save().then(
            resultes => {
              if (resultes) {
                this.$message.success("正在部署中");
                this.dialogFormVisible = false;
                this.getOrigin();
              }
            },
            error => {
              returnLogin(error);
            }
          );
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //详情查看
    handleDetail(index, row) {
      this.dialogVisible = true;
      this.licensedetail = JSON.stringify(row.attributes.product, null, 10);
    },
    //查看机器
    goToLictool(row){
        this.activeName="server"
        this.formInline.app = row.objectId
        this.getOrigin()
    }
  }
};
</script>

<style lang="scss" scoped>
#application {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  margin: 0 auto;
  /deep/ .el-tabs {
    .el-tabs__header {
      margin: 0;
      .el-tabs__item {
        font-size: 16px;
      }
    }
    .el-tabs__content {
      padding: 15px;
      background: #f4f4f4;
      .form {
        background: #fff;
        padding: 20px 15px;
        display: flex;
        justify-content: space-between;
        .search {
          display: flex;
          button {
            margin-left: 5%;
          }
        }
      }
    }
    .el-table {
      .el-divider {
        background-color: #409eff;
        width: 2px;
      }
      .el-button + .el-button {
        margin-left: 0;
      }
    }
  }
  /deep/ .serverlist {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  background: #fff;
  .servercontent {
    .el-form {
      text-align: right;
    }
  }
  .serverpagina {
    margin-top: 20px;
  }
  /deep/ .el-dialog__body{
      .el-form{
          display: flex;
          flex-wrap: wrap;
          .el-form-item{
              width:50%;
              /deep/.el-select{
                  width:100%;
              }
          }
          /deep/ .notall{
              width:100%;
              text-align: center;
          }
          /deep/ .el-col-11{
              .el-form-item{
                  width:100%;
              }
          }
          /deep/ .el-col-2{
              text-align: center;
          }
      }
  }
    @media screen and (max-width: 1350px) {
    /deep/ .el-dialog__body{
        .el-form{
            .el-form-item{
                 width: 100%;
            }
        }
    }
  }
}
}
</style>
