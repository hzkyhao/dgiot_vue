<template>
  <div id="application">
    <h3>应用管理</h3>
    <el-tabs v-model="activeName">
      <el-tab-pane label="应用管理" name="app">
        <div class="form">
          <div class="search">
            <el-input v-model="name" :placeholder="$t('application.applicationname')" size="small"/>
            <el-button
              type="primary"
              size="small"
              @click="getAppMange(0)"
            >{{ $t('application.search') }}</el-button>
          </div>
        </div>
        <el-table :data="tableData" style="width:100%;">
          <!-- 应用标识 -->
          <el-table-column
            :label="$t('application.applicationidentification')"
            prop="productIdentifier"
          />
          <!-- 应用名称 -->
          <el-table-column :label="$t('application.applicationname')" prop="title"/>
          <el-table-column prop="userUnit" label="应用单位"/>
          <!-- 服务规模 -->
          <el-table-column :label="$t('application.scaleofservice')" prop="scale" sortable/>
          <!-- 所属行业 -->
          <el-table-column :label="$t('application.industrytype')" prop="category"/>

          <el-table-column :label="$t('application.createtime')" prop="creation_time"/>
          <el-table-column :label="$t('developer.operation')" prop="operation" width="350">
            <template slot-scope="scope">
              <el-popover :ref="`popover-${scope.$index}`" placement="top" width="300">
                <p>确定删除这个{{ scope.row.name }}应用吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button
                    size="mini"
                    @click="scope._self.$refs[`popover-${scope.$index}`].doClose()"
                  >{{ $t('developer.cancel') }}</el-button>
                  <el-button
                    type="primary"
                    size="mini"
                    @click="makeSure(scope)"
                  >{{ $t('developer.determine') }}</el-button>
                </div>
                <el-link
                  slot="reference"
                  :underline="false"
                  icon="el-icon-delete"
                  type="danger"
                >{{ $t('developer.delete') }}</el-link>
              </el-popover>
              <el-button
                type="text"
                size="small"
                icon="el-icon-edit"
                @click="handleClickUpdate(scope)"
              >{{ $t('developer.edit') }}</el-button>
              <el-button type="text" size="small" @click="Gotoproduct(scope)">
                <i class="el-icon-s-management"/>
                管理
              </el-button>
              <el-link
                :underline="false"
                type="primary"
                @click="applicationDeployment(scope.row)"
              >
                部署
              </el-link>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page="page.currentPage"
          :page-sizes="page.pageSizes"
          :page-size="page.pageSize"
          :total="page.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { setUpLictool } from '@/api/License/index'
export default {
  data() {
    return {
      // tab标题
      label: '我的应用',
      // 初始页
      activeName: 'app',
      // 查看模态框
      dialogVisible: false,
      // 应用名称
      name: '',
      // 分页
      page: {
        currentPage: 0,
        pageSizes: [10, 20, 30],
        pageSize: 10,
        total: 0
      },
      // 提示文本
      description: '暂无数据',
      // 表格
      tableData: [],
      // 查看展开
      isShow: false,
      arr: []
    }
  },
  created() {
    this.getAppMange()
  },
  methods: {
    // 访问
    handleClickVisit(scope) {
      const index = scope.$index
      const productIdentifier = this.tableData[index].productIdentifier
      const url =
        window.location.origin + '/iot/' + productIdentifier + '#/login'
      window.open(url, '__blank')
    },
    // 查询应用信息
    getAppMange(start) {
      if (start == 0) {
        this.page.currentPage = 0
      }
      this.tableData = []
      const where = {}
      if (this.name) {
        where.title = this.name
      }
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.getAppMange()
    },
    handleCurrentChange(val) {
      this.page.currentPage = (val - 1) * this.page.pageSize
      this.getAppMange()
    },
    // 查看
    handleClickLook(scope) {
      const index = scope.$index
      console.log(scope)
      const html = `
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
            `
      this.$alert(html, '应用详情', {
        dangerouslyUseHTMLString: true
      })
    },
    // 跳转修改
    handleClickUpdate(scope) {
      const row = scope.row
      console.log('$row', row)

      this.$router.push({
        path: '/applicationManagement/addApp',
        query: {
          actionType: 'update',
          title: '修改应用',
          name: row.name,
          scale: row.scale,
          creation_time: row.creation_time,
          end_time: row.end_time,
          category: row.category,
          productIdentifier: row.productIdentifier,
          secret: row.secret,
          objectId: row.objectId,
          logo: row.logo,
          userUnit: row.userUnit,
          dashboard: row.dashboard,
          background: row.background,
          // acl:this.$getFirstKey(row.acl),
          desc: row.desc,
          copyright: row.copyright
        }
      })
    },
    // 删除应用
    makeSure(scope) {
      // 可以在这里执行删除数据的回调操作.......删除操作.....
      var Project = Parse.Object.extend('Project')
      var project = new Project()
      project.id = scope.row.objectId
      var relation = project.relation('product')
      var query = relation.query()
      query.find().then(response => {
        if (response.length > 0) {
          this.$message('请先将应用下的产品删除')
          scope._self.$refs[`popover-${scope.$index}`].doClose()
        } else {
          project.destroy().then(
            response => {
              if (response) {
                this.$message({
                  type: 'success',
                  message: '删除成功'
                })
                scope._self.$refs[`popover-${scope.$index}`].doClose()
                this.getAppMange()
              }
            },
            error => {
              this.$message({
                type: 'error',
                message: error.message
              })
              //   })
            }
          )
        }
      })
    },
    Gotoproduct(scope) {
      var projectRoles = []
      for (var key in scope.row.acl) {
        console.log(key.substring(5))
        projectRoles.push(key.substring(5))
      }
      this.$store.dispatch('setProjectRole', projectRoles)

      this.$router.push({
        path: '/roles/product',
        query: {
          project: scope.row.objectId
        }
      })
    },
    serverlictool(row) {
      console.log(row)
      this.$router.push({
        path: '/roles/server_control',
        query: {
          appid: row.objectId,
          appsecret: row.secret
        }
      })
    },
    applicationDeployment(row) {
      if (!row.name) {
        this.$message('没有应用名')
        return
      }
      setUpLictool(row.name).then(resultes => {
        if (resultes) {
          this.$message('正在部署中')
        }
      }).catch(error => {
        this.$message(error)
      })
    }
  }
}
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
