<template>
  <div class="roles">
    <el-row :gutter="20">
      <el-col :span="5">
        <div class="leftTree">
          <el-tree
            :data="deptTreeData"
            :props="roleProps"
            :expand-on-click-node="false"
            node-key="index"
            default-expand-all
          >
            <!-- @node-click="handleNodeClick" -->
            <div slot-scope="{ node, data }" class="custom-tree-node">
              <span
                :class="{ selected: data.objectId == curDepartmentId}"
                @click="handleNodeClick(data)"
              >{{ node.label }}</span>
              <span>
                <i
                  class="el-icon-circle-plus-outline"
                  title="添加角色"
                  @click="setDialogRole(data)"
                />
              </span>
            </div>
          </el-tree>
        </div>
      </el-col>
      <el-col :span="9">
        <div class="rightTable">
          <div class="search">
            <el-input
              :placeholder="$t('user.name')"
              v-model="search"
              size="mini"
              clearable
            />
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-search"
              style="margin-left:20px;"
              @click="getRolesList(0)"
            >{{ $t("developer.search") }}</el-button>
            <!-- icon="el-icon-plus" -->
            <!--           <el-button type="primary" size="mini" @click="add">
              {{
              $t("developer.add")
              }}
            </el-button>-->
            <!-- icon="el-icon-search" -->
            <el-button type="primary" size="mini" @click="getRolesList()">所有角色</el-button>
          </div>
          <div class="tableroles" style="margin-top:20px">
            <el-table
              :data="roleList"
              :row-class-name="tableRowClassName"
              :row-style="selectedHighlight"
              style="width: 100%;text-align:center"
              size="small"
              @row-click="getDetailmenu"
            >
              <el-table-column :label="$t('user.name')" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.name }}</span>
                </template>
              </el-table-column>
              <!--         <el-table-column :label="$t('developer.describe')" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.desc }}</span>
                </template>
              </el-table-column>-->
              <el-table-column :label="$t('user.Remarks')" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.alias }}</span>
                </template>
              </el-table-column>
              <el-table-column label="ID" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.objectId }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('developer.operation')"
                align="center"
              >
                <template slot-scope="scope">
                  <!-- <el-button size="mini" type="primary" @click="handleEdit(scope.row)">分配权限</el-button> -->
                  <!-- <el-button size="mini" type="success" @click="addmenu(scope.row)">分配菜单</el-button> -->
                  <!-- <el-button size="mini" type="primary" >增加用户</el-button> -->

                  <el-dropdown
                    split-button
                    type="primary"
                    size="medium"
                    @click="exportRolerole(scope.row)"
                  >
                    <span class="el-dropdown-link">修改</span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        icon="el-icon-document"
                        @click.native="exportRoletemp(scope.row)"
                      >保存模板</el-dropdown-item>
                      <!-- <el-dropdown-item icon="el-icon-document" @click.native="handleEditrole(scope.row)" >编辑</el-dropdown-item> -->
                      <el-dropdown-item
                        icon="el-icon-delete"
                        @click.native="handleDelete(scope.row)"
                      >删除</el-dropdown-item>
                      <!-- <el-dropdown-item @click.native="taskDetail(scope.row.objectId,scope.row.test_bed.id)">详情</el-dropdown-item> -->
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>
            </el-table>
            <!--分页-->
            <div class="rightPagination">
              <el-pagination
                :total="total"
                layout="prev, pager, next"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="10">
        <!--菜单-->
        <div class="rolefooter">
          <div class="footerleft">
            <p class="top">
              <span class="svg-container">
                <svg-icon icon-class="role_group" />
              </span>
              <span>分配权限</span>
            </p>
            <div class="rolecontrol">
              <el-tree
                ref="permissionTree"
                :data="permissionTreeData"
                :default-checked-keys="rolePermissonList"
                :expand-on-click-node="false"
                show-checkbox
                node-key="objectId"
                default-props
                accordion
              >
                <span slot-scope="{ node }" class="custom-tree-node">
                  <span>{{ node.label }}</span>
                </span>
              </el-tree>
            </div>
          </div>
          <div class="footerright">
            <p class="top">
              <span class="svg-container">
                <svg-icon icon-class="menu_group" />
              </span>
              <span>菜单分配</span>
            </p>
            <div class="menucontrol" style="margin-top:30px;">
              <el-tree
                ref="menusTree"
                :data="menuTreeData"
                :default-checked-keys="roleMenuList"
                :expand-on-click-node="false"
                show-checkbox
                node-key="objectId"
                default-props
                accordion
              >
                <span slot-scope="{ node }" class="custom-tree-node">
                  <span>{{ node.label }}</span>
                </span>
              </el-tree>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-dialog
      :visible="centerDialogRole"
      title="添加角色"
      width="35%"
      center
      @close="closeDialogRole"
    >
      <addroles ref="addRoleRef" />
    </el-dialog>

    <el-dialog
      :title="$t('developer.add')"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <el-table
        ref="multipleTable"
        :data="tableDataroles"
        style="width: 100%;text-align:center"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column :label="$t('user.name')" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.attributes.name }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('user.Remarks')" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.attributes.desc }}</span>
          </template>
        </el-table-column>
        <el-table-column label="ID" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">
          {{
            $t("developer.cancel")
          }}
        </el-button>
        <el-button type="primary" @click="addacl">
          {{
            $t("developer.determine")
          }}
        </el-button>
      </span>
    </el-dialog>

    <!--编辑权限弹窗-->
    <el-dialog :title="$t('developer.edit')" :visible.sync="roleEdit">
      <el-form :model="form">
        <el-form-item :label="$t('user.name')" :label-width="formLabelWidth">
          <el-input
            v-model="form.name"
            autocomplete="off"
            style="width:300px;"
            disabled
          />
        </el-form-item>
        <el-form-item :label="$t('user.Remarks')" :label-width="formLabelWidth">
          <el-input
            v-model="form.alias"
            autocomplete="off"
            style="width:300px;"
          />
        </el-form-item>
        <el-form-item
          :label="$t('developer.describe')"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="form.desc"
            :rows="2"
            autocomplete="off"
            style="width:300px;"
            type="textarea"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleEdit = false">
          {{
            $t("developer.cancel")
          }}
        </el-button>
        <el-button type="primary" @click="updaterole">
          {{
            $t("developer.determine")
          }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import addroles from '@/views/roles/rolelist/addroles'
export default {
  name: 'Role',
  data() {
    return {
      deptTreeData: [],
      curDepartmentId: '',
      formLabelWidth: '120px',
      roleEdit: false,
      form: {
        name: '',
        alias: '',
        desc: ''
      },
      data: [],
      dialogVisible: false,
      multipleSelection: [],
      search: '',
      total: 0,
      pagesize: 10,
      start: 0,
      roleList: [],
      tableDataroles: [],
      centerDialogVisible: false,
      editroleid: '',
      currentSelectIndex: null,
      roleProps: {
        children: 'children',
        label: 'name'
      },
      checkMenus: [], // 选中菜单
      checkRoles: [], // 选中权限
      dataMenus: [],
      roleMenuList: [],
      dataPermissions: [],
      rolePermissonList: [],
      loadingService: {},
      roleItem: [],
      centerDialogRole: false
    }
  },
  computed: {
    permissionTreeData() {
      const cloneData = JSON.parse(JSON.stringify(this.dataPermissions))
      return cloneData.filter(father => {
        /* eslint-disable */
        const branchArr = cloneData.filter(
          child => father.objectId == child.parentId
        ) // 返回每一项的子级数组
        branchArr.length > 0 ? (father.children = branchArr) : '' // 如果存在子级，则给父级添加一个children属性，并赋值
        return father.parentId == 0 // 返回第一层
        /* eslint-disable */
      })
    },
    menuTreeData() {
      const cloneData = JSON.parse(JSON.stringify(this.dataMenus))
      return cloneData.filter(father => {
        /* eslint-disable */
        const branchArr = cloneData.filter(
          child => father.objectId == child.parentId
        )
        branchArr.length > 0 ? (father.children = branchArr) : ''
        return father.parentId == 0
        /* eslint-disable */
      })
    }
  },
  components: {
    addroles
  },
  mounted() {
    this.getRolesList()
    this.getMenu()
    this.getRoleschema()
    this.$baseEventBus.$on('dialogHide', () => {
      this.centerDialogRole = false
    })
  },

  methods: {
    getMenu() {
      this.data = []
      this.dataMenus = []
      this.$axiosWen
        .get('iotapi/classes/Menu')
        .then(res => {
          if (res && res.results) {
            this.menuListRes = res.results
            res.results.map(items => {
              var obj = {}
              obj.label = items.name
              obj.objectId = items.objectId
              obj.parentId = items.parent.objectId
              obj.createtime = new Date(items.createdAt).toLocaleDateString()
              this.data.push(obj)
              this.dataMenus.push(obj)
            })
          }
        })
        .catch(error => {
          console.log(error)
        })
      //查询部门
      this.$axiosWen
        .get('iotapi/roletree')
        .then(res => {
          this.deptTreeData = res.results
          this.handleNodeClick(this.deptTreeData[0])
        })
        .catch(err => {
          this.$message('部门列表获取失败')
          this.deptTreeData = []
          console.log(err)
        })
    },
    diguiquchu(datas, arr, v, needdelarr) {
      // 递归找出半选中的数据
      arr.map(item => {
        // console.log(item.key, v, "----------");
        if (item.key == v && item.children.length > 0) {
          // datas.splice(i, 1);//因为每次截取会改变原数组，所以不能这样
          needdelarr.push(v)
          this.diguiquchu(datas, item.children, v, needdelarr)
        } else if (item.key != v && item.children.length > 0) {
          this.diguiquchu(datas, item.children, v, needdelarr)
        }
      })
    },
    add() {
      this.$router.push({
        path: '/roles/editroles',
        query: {
          insert: 0
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    //给role添加acl权限
    addacl() {
      // var Role = Parse.Object.extend('_Role')
      // var role = new Parse.Query(Role)
      // role.get(this.objectId).then(object => {
      //   let acl = new Parse.ACL()
      //   this.multipleSelection.map(item => {
      //     acl.setRoleReadAccess(item.attributes.name, true)
      //     acl.setRoleWriteAccess(item.attributes.name, true)
      //     object.set('ACL', acl)
      //   })
      //   object.save().then(
      //     res => {
      //       this.$message({
      //         type: 'success',
      //         message: '添加成功!'
      //       })
      //       this.centerDialogVisible = false
      //       this.getRolesList()
      //     },
      //     error => {
      //       console.log(error)
      //     }
      //   )
      // })
    },
    //关闭菜单弹窗
    handleClose() {
      this.dialogVisible = false
    },
    //删除角色
    handleDelete(row) {
      this.$confirm('此操作将永久删除此角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$axiosWen.delete('iotapi/classes/_Role/' + row.objectId).then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getRolesList()
              this.getMenu()
            }
          })
        })
        .catch(() => {})
    },
    //增加菜单
    addmenu(row) {
      // console.log(row)
      this.rolename = row.attributes.name

      // this.dialogVisible = true;
      this.getMenu()
    },
    tableRowClassName({ row, rowIndex }) {
      //把每一行的索引放进row

      row.index = rowIndex
    },
    selectedHighlight({ row, rowIndex }) {
      if (this.currentSelectIndex === rowIndex) {
        return {
          // "background-color": "#409EFF",
          color: '#409EFF',
          'font-weight': 'bold'
          // border: "5px solid black"
        }
      }
    },
    getDetailmenu(row, column, event, cell) {
      if (column && column.label == '操作') {
        return
      }

      this.loadingService = this.$loading({
        lock: true,
        text: '数据加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.6)'
      })

      this.currentSelectIndex = row.index

      this.$axiosWen
        .get('iotapi/role?name=' + row.name)
        .then(res => {
          this.roleItem = res
          if (res && res.menus && res.rules) {
            this.checkMenus = res.menus
            this.checkRoles = res.rules
            this.doSetChecked()
          } else {
            this.$message({
              type: 'warning',
              message: '获取角色菜单失败'
            })
          }

          this.loadingService.close()
        })
        .catch(error => {
          this.loadingService.close()
          console.log(error)
        })
    },
    doSetChecked() {
      this.roleMenuList = []
      this.rolePermissonList = []

      this.menuListRes.map(items => {
        this.checkMenus.map(mentItem => {
          if (items.name == mentItem.name) {
            this.roleMenuList.push(items.objectId)
          }
        })
      })
      // set ###
      this.$refs.menusTree.setCheckedKeys(this.roleMenuList)

      this.permissionListRes.map(items => {
        this.checkRoles.map(mentItem => {
          if (items.name === mentItem.name) {
            this.rolePermissonList.push(items.objectId)
          }
        })
      })
      // set ###
      this.$refs.permissionTree.setCheckedKeys(this.rolePermissonList)
    },

    //初始化权限列表
    getRolesList(start, dataR) {
      if (start == 0) {
        this.start = 0
      }

      let where = {}

      if (dataR && dataR.name != 'admin') {
        where.objectId = dataR.objectId
      }
      const loading = this.$loading({
        background: 'rgba(0, 0, 0, 0.5)'
      })
      this.$axiosWen
        .get('iotapi/classes/_Role', {
          params: {
            skip: this.start,
            limit: this.pagesize,
            order: '-createdAt',
            where: where,
            keys: 'count(*)'
          }
        })
        .then(res => {
          loading.close()
          if (res && res.results) {
            this.roleList = res.results
            this.total = res.count
          } else {
            this.roleList = []
          }
        })
        .catch(() => {
          loading.close()
        })
    },
    handleSizeChange(val) {
      this.pagesize = val
      this.getRolesList()
    },
    handleCurrentChange(val) {
      this.start = Number(val - 1) * Number(this.pagesize)
      this.getRolesList()
    },
    handleCheckChange(data, checked) {
      console.log(data, checked)
    },
    searchvalue() {
      this.roleList = []
      // var roles = Parse.Object.extend('_Role')
      // var query = new Parse.Query(roles)
      // query.equalTo('name', this.search)
      // query.limit(this.pagesize)
      // query.count().then(count => {
      //   if (count) {
      //     this.total = count
      //     query.find().then(results => {
      //       this.roleList = results
      //     })
      //   }
      // })
    },
    // 获取权限
    getRoleschema() {
      this.dataPermissions = []
      this.$axiosWen
        .get('iotapi/classes/Permission')
        .then(res => {
          const results = res.results
          this.permissionListRes = results
          results.map(items => {
            var obj = {}
            obj.label = items.alias
            obj.alias = items.name
            obj.objectId = items.objectId
            obj.parentId = items.parent.objectId
            obj.createtime = new Date(items.createdAt).toLocaleDateString()
            this.dataPermissions.push(obj)
          })

          // this.getMenu();
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 修改角色权限
    exportRolerole(row) {
      let usersList = []
      let rolesList = []
      let checkrole = []
      let checkmenu = []
      let selectMenu = this.$refs.menusTree.getCheckedNodes()
      let selectRermission = this.$refs.permissionTree.getCheckedNodes()
      let rolesData = this.roleItem.roles
      let usersData = this.roleItem.users

      if (!usersData || !rolesData) {
        this.$message({
          message: '未选择正确的角色'
        })

        return false
      }
      usersData.forEach(item => {
        usersList.push(item.username)
      })
      rolesData.forEach(item => {
        rolesList.push(item.name)
      })
      if (selectMenu && selectRermission) {
        selectMenu.forEach(item => {
          console.log('selectMenu', item)
          checkmenu.push(item.label)
        })
        selectRermission.forEach(item => {
          console.log('selectRermission', item)
          checkrole.push(item.alias)
        })
        console.log(row, 'row', row)
        this.$axios
          .put('/role', {
            objectId: this.roleItem.objectId,
            name: row.name,
            alias: row.alias,
            desc: row.desc,
            rules: checkrole,
            menus: checkmenu,
            roles: rolesList,
            users: usersList
          })
          .then(res => {
            this.$message('角色信息更新成功')
          })
          .catch(error => {
            console.log(error)
            this.$message({
              message: '更新失败!'
            })
          })
      } else {
        this.$message('请选择菜单列表和权限列表')
      }
    },
    // 保存模板
    exportRoletemp(row) {
      this.$axiosWen
        .post(
          '/roletemp?name=' +
            row.name +
            '&tempname=' +
            row.name
        )
        .then(response => {
          console.log('response', response)
        })
    },
    updaterole() {
      this.$message('Parse 写法需改为axios写法,修改后请删除以下注释')
      // var roles = Parse.Object.extend('_Role')
      // var query = new Parse.Query(roles)
      // query.get(this.editroleid).then(resultes => {
      //   resultes.set('alias', this.form.alias)
      //   resultes.set('desc', this.form.desc)
      //   resultes.save().then(res => {
      //     this.$message({
      //       type: 'success',
      //       message: '更新成功'
      //     })
      //   })
      //   this.roleEdit = false
      //   this.getRolesList()
      // })
    },
    handleNodeClick(data) {
      this.getRolesList(0, data)

      this.curDepartmentId = data.objectId

      // 清除选中的角色

      this.currentSelectIndex = null

      //清除菜单树

      // this.dataMenus = []
    },
    // 添加子节点
    appendChildTree(data) {
      console.log(data, '添加子节点')
    },
    renderContent(h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <span>{node.label}</span>
          <span>
            <el-button
              size="mini"
              type="text"
              on-click={() => this.appendChildTree(data)}
            >
              <i class="el-icon-plus" />
            </el-button>
          </span>
        </span>
      )
    },
    // 显示弹窗
    setDialogRole(data) {
      // this.$store.commit("set_DeptObj", data);
      // eventBus.$emit("set_DeptObj", data)
      this.centerDialogRole = true

      this.$nextTick(() => {
        this.$refs['addRoleRef'].getData(data)
      })
    },
    closeDialogRole() {
      this.centerDialogRole = false
    }
  }
}
</script>
<style scoped lang="scss">
.roles {
  width: 100%;
  min-height: 875px;
  padding: 20px;
  box-sizing: border-box;
  background: #ffffff;

  .rightTable {
    .search {
      margin: 20px;
      text-align: center;
    }
    .rightPagination {
      text-align: center;
      margin: 10px;
    }
  }
}
.rolefooter {
  height: auto;
  width: 100%;
  display: flex;
  margin-top: 10px;
}
.footerleft,
.footerright {
  width: 45%;
  height: auto;
  padding: 20px;
  box-sizing: border-box;
  border: 1px solid #cccccc;
}
.footerright {
  margin-left: 5%;
}
.rolefooter .top {
  border-bottom: 1px solid #cccccc;
  height: 50px;
}
.rolefooter .top span {
  float: left;
  line-height: 50px;
}
.rolefooter .top button {
  float: right;
}
</style>
<style lang="scss">
.roles .search .el-input {
  width: 200px;
}

.leftTree {
  span.selected {
    font-weight: bold;
    color: #409eff;
  }
  .el-tree-node {
    margin-top: 5px;
  }

  .custom-tree-node .el-icon-circle-plus-outline:hover {
    color: #409eff;
  }
}
</style>
