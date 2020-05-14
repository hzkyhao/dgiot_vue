<template>
  <div id="application">
    <h3>应用管理</h3>
    <el-tabs v-model="activeName">
      <el-tab-pane label="应用管理" name="app">
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
          <!-- 应用标识 -->
          <el-table-column
            prop="productIdentifier"
            :label="$t('application.applicationidentification')"
          ></el-table-column>
          <!-- 应用名称 -->
          <el-table-column prop="title" :label="$t('application.applicationname')"></el-table-column>
          <el-table-column prop="userUnit" label="应用单位"></el-table-column>
          <!-- 服务规模 -->
          <el-table-column prop="scale" :label="$t('application.scaleofservice')" sortable></el-table-column>
          <!-- 所属行业 -->
          <el-table-column prop="category" :label="$t('application.industrytype')"></el-table-column>

          <el-table-column prop="creation_time" :label="$t('application.createtime')"></el-table-column>
          <el-table-column prop="operation" :label="$t('developer.operation')" width="350">
            <template slot-scope="scope">
              <el-popover placement="top" width="300" :ref="`popover-${scope.$index}`">
                <p>确定删除这个{{scope.row.name}}应用吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button
                    size="mini"
                    @click="scope._self.$refs[`popover-${scope.$index}`].doClose()"
                  >{{$t('developer.cancel')}}</el-button>
                  <el-button
                    type="primary"
                    size="mini"
                    @click="makeSure(scope)"
                  >{{$t('developer.determine')}}</el-button>
                </div>
                <el-link
                  slot="reference"
                  :underline="false"
                  icon="el-icon-delete"
                  type="danger"
                >{{$t('developer.delete')}}</el-link>
              </el-popover>
              <el-button
                @click="handleClickUpdate(scope)"
                type="text"
                size="small"
                icon="el-icon-edit"
              >{{$t('developer.edit')}}</el-button>
              <!-- <el-button
                @click="handleClickLook(scope)"
                type="text"
                size="small"
                icon="el-icon-key"
              >{{$t('application.secretkey')}}</el-button>
              <el-button type="text" size="small" @click="handleClickVisit(scope)">
                {{$t('application.visit')}}
                <i class="el-icon-arrow-right"></i>
              </el-button>
               -->
              <el-button type="text" size="small" @click="Gotoproduct(scope)">
                <i class="el-icon-s-management"></i>
                管理
              </el-button>
              <!-- <el-popover
                placement="top"
                width="300"
                :ref="`popover-${scope.$index}`"
                trigger="hover"
              >
                <p>部署工具本地运行</p>
                <<a   :href="'/lictool?appid='+scope.row.objectId+'&appsecret='+scope.row.secret" slot="reference" 
                >下载<i class="el-icon-download"></i></a>
                <el-link
                  type="primary"
                  :underline="false"
                  slot="reference"
                  @click="lictool(scope.row)"
                >
                  下载
                  <i class="el-icon-download"></i>
                </el-link>
              </el-popover> -->
               <el-link
                  type="primary"
                  :underline="false"
                  @click="applicationDeployment(scope.row)"
                >
                 部署
                </el-link>
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
    </el-tabs>
  </div>
</template>

<script>
import { getProject, handleZero, uploadLicense,setUpLictool } from "@/api/applicationManagement";
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
      arr: []
    };
  },
  created() {
    this.getAppMange();
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
          obj.userUnit = r[i].userUnit
          obj.dashboard = r[i].dashboard;
          obj.background=r[i].background;
          obj.acl= r[i].ACL;
          obj.desc = r[i].desc;
          obj.copyright = r[i].copyright;

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
    // 跳转修改
    handleClickUpdate(scope) {
    
      let row = scope.row;
        console.log('$row',row)
    
      this.$router.push({
        path: "/applicationManagement/addApp",
        query: {
          actionType: "update",
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
          userUnit:row.userUnit,
          dashboard: row.dashboard,
          background: row.background,
          // acl:this.$getFirstKey(row.acl),
          desc:row.desc,
          copyright:row.copyright
        }
      });
    },
    // 查询
    handleClickQuery() {
      let where = {};
      if (this.name) {
        where.title = this.name;
      }
      getProject({ limit: 100, where })
        .then(res => {
          // // 查询结束清空
          this.tableData = res.results;
          this.handleClickReset();
        })
        .catch(res => {
          if (res.code == 1) {
            this.$message("字段不存在");
          }
        });
    },
    //删除应用
    makeSure(scope) {
      // 可以在这里执行删除数据的回调操作.......删除操作.....
      var Project = Parse.Object.extend("Project");
      var project = new Project();
      project.id = scope.row.objectId;
     var relation = project.relation('product')
     var query = relation.query()
     query.find().then(response=>{
       if(response.length>0){
         this.$message('请先将应用下的产品删除')
          scope._self.$refs[`popover-${scope.$index}`].doClose();
       }else{
         project.destroy().then(
            response => {
              if (response) {
                this.$message({
                  type: "success",
                  message: "删除成功"
                });
                scope._self.$refs[`popover-${scope.$index}`].doClose();
                this.getAppMange();
              }
            },
            error => {
              this.$message({
                type: "error",
                message: error.message
              });
              //   })
            }
          );
       }
     })
      
    },
    Gotoproduct(scope) {
    
      var projectRoles =[]
      for(var key in scope.row.acl){
        console.log(key.substring(5))
        projectRoles.push(key.substring(5))
      }
      this.$store.dispatch('setProjectRole',projectRoles)

      this.$router.push({
        path: "/roles/product",
        query: {
          project: scope.row.objectId 
        }
      });
    },
    serverlictool(row){
        console.log(row)
        this.$router.push({
            path:'/roles/server_control',
            query:{
                appid:row.objectId,
                appsecret:row.secret,
            }
        })
    },
    applicationDeployment(row){
      if(!row.name){
        this.$message('没有应用名')
        return
      }
      setUpLictool(row.name).then(resultes=>{
        if(resultes){
          this.$message('正在部署中')
        }
      }).catch(error=>{
        this.$message(error)
      })
      //this is /roles/projectManagement
      // console.log('row.name',row.name);
      
        // this.$router.push({
        //     path:'/roles/applicationManagement', //@/views/equipment_management/appOperate/application
        //     query:{
        //       projectName:row.name,
        //       projectId:row.objectId
        //     }
        // })
        
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
}
</style>
