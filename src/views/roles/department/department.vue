<template>
  <div class="department">
    <el-row :gutter="20">
      <el-col :span="14">
        <el-table
          :data="roletempList"
          :row-class-name="tableRowClassName"
          :row-style="selectedHighlight" 
          size="small"
          @row-click="getDetailmenu"
        >
          <el-table-column label="名称" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.key }}</span>
            </template>
          </el-table-column>

          <el-table-column :label="$t('developer.operation')" align="center">
            <template slot-scope="scope">
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
                  <el-dropdown-item icon="el-icon-delete" @click.native="handleDelete(scope.row)">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
 
      </el-col>

      <el-col :span="10">

        <el-col :span="12">
           <!--权限 -->
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

        </el-col>

        <el-col :span="12">

         <!--菜单-->
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

        </el-col>
    
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { page, UpdatedMenu, UpdatedRole } from "@/api/login";
import { Parse } from "parse";
import { eventBus } from "@/api/eventBus";
export default {
  name: "Department",
  data() {
    return {
      roletempList: [],
      roleData: [],
      checkMenus: [], // 选中菜单
      checkRoles: [], // 选中权限
      dataMenus: [],
      roleMenuList: [],
      dataPermissions: [],
      rolePermissonList: [],
      loadingService: {},
      roleItem: []
    };
  },
  computed: {
    permissionTreeData() {
      const cloneData = JSON.parse(JSON.stringify(this.dataPermissions));
      return cloneData.filter(father => {
        /* eslint-disable */
        const branchArr = cloneData.filter(
          child => father.objectId == child.parentId
        ); // 返回每一项的子级数组
        branchArr.length > 0 ? (father.children = branchArr) : ""; // 如果存在子级，则给父级添加一个children属性，并赋值
        return father.parentId == 0; // 返回第一层
        /* eslint-disable */
      });
    },
    menuTreeData() {
      const cloneData = JSON.parse(JSON.stringify(this.dataMenus));
      return cloneData.filter(father => {
        /* eslint-disable */
        const branchArr = cloneData.filter(
          child => father.objectId == child.parentId
        );
        branchArr.length > 0 ? (father.children = branchArr) : "";
        return father.parentId == 0;
        /* eslint-disable */
      });
    }
  },
  components: {},
  mounted() {
    this.gettable();
    this.getMenu();
    this.getRoleschema();

    eventBus.$on("dialogHide", () => {
      this.centerDialogRole = false;
    });
  },

  methods: {
    getMenu() {
      this.data = [];
      this.dataMenus = [];
      this.$axiosWen
        .get("/classes/Menu")
        .then(res => {
          if (res && res.results) {
            this.menuListRes = res.results;
            res.results.map(items => {
              var obj = {};
              obj.label = items.name;
              obj.objectId = items.objectId;
              obj.parentId = items.parent.objectId;
              obj.createtime = new Date(items.createdAt).toLocaleDateString();
              this.data.push(obj);
              this.dataMenus.push(obj);
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    diguiquchu(datas, arr, v, needdelarr) {
      // 递归找出半选中的数据
      arr.map(item => {
        // console.log(item.key, v, "----------");
        if (item.key == v && item.children.length > 0) {
          // datas.splice(i, 1);//因为每次截取会改变原数组，所以不能这样
          needdelarr.push(v);
          this.diguiquchu(datas, item.children, v, needdelarr);
        } else if (item.key != v && item.children.length > 0) {
          this.diguiquchu(datas, item.children, v, needdelarr);
        }
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //给role添加acl权限
    addacl() {
      var Role = Parse.Object.extend("_Role");
      var role = new Parse.Query(Role);
      role.get(this.objectId).then(object => {
        let acl = new Parse.ACL();
        this.multipleSelection.map(item => {
          acl.setRoleReadAccess(item.name, true);
          acl.setRoleWriteAccess(item.name, true);
          object.set("ACL", acl);
        });
        object.save().then(
          res => {
            this.$message({
              type: "success",
              message: "添加成功!"
            });
            this.centerDialogVisible = false;
            this.gettable();
          },
          error => {
            console.log(error);
          }
        );
      });
    },
    //关闭菜单弹窗
    handleClose() {
      this.dialogVisible = false;
    },
    //删除角色
    handleDelete(row) {
      this.$confirm("此操作将永久删除此权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var roles = Parse.Object.extend("_Role");
          var query = new Parse.Query(roles);
          query.get(row).then(object => {
            object.destroy().then(
              response => {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.gettable();
                this.getMenu();
              },
              error => {
                console.log("error", error);
              }
            );
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //增加菜单
    addmenu(row) {
      // console.log(row)
      this.rolename = row.name;

      // this.dialogVisible = true;
      this.getMenu();
    },
    tableRowClassName({ row, rowIndex }) {
      //把每一行的索引放进row

      row.index = rowIndex;
    },
    selectedHighlight({ row, rowIndex }) {
      if (this.currentSelectIndex === rowIndex) {
        return {
          // "background-color": "#409EFF",
          color: "#409EFF",
          "font-weight": "bold"
          // border: "5px solid black"
        };
      }
    },
    getDetailmenu(row, column, event, cell) {
      if (column && column.label == "操作") {
        return;
      }

      this.loadingService = this.$loading({
        lock: true,
        text: "数据加载中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.6)"
      });
      this.currentSelectIndex = row.index;
      this.$axiosWen
        .get("/role?name=" + row.name)
        .then(res => {
          this.roleItem = res;
          if (res && res.menus && res.rules) {
            this.checkMenus = res.menus;
            this.checkRoles = res.rules;
            this.doSetChecked();
          } else {
            this.$message({
              type: "warning",
              message: "获取角色菜单失败"
            });
          }

          this.loadingService.close();
        })
        .catch(error => {
          this.loadingService.close();
          console.log(error);
        });
    },
    doSetChecked() {
      this.roleMenuList = [];
      this.rolePermissonList = [];

      this.menuListRes.map(items => {
        this.checkMenus.map(mentItem => {
          if (items.name == mentItem.name) {
            this.roleMenuList.push(items.objectId);
          }
        });
      });
      // set ###
      this.$refs.menusTree.setCheckedKeys(this.roleMenuList);

      this.permissionListRes.map(items => {
        this.checkRoles.map(mentItem => {
          if (items.name === mentItem.name) {
            this.rolePermissonList.push(items.objectId);
          }
        });
      });
      // set ###
      this.$refs.permissionTree.setCheckedKeys(this.rolePermissonList);
    },
    gettable(start) {

     this.$axiosWen
        .get('/classes/Dict', {
          params: {
            where: {
              type: 'roletemp'
            }
          }
        })
        .then(res => {
          if(res && res.results){            
          this.roletempList  = res.results

          } else {
            this.roletempList = [];

          }
        })


    },
    // 获取权限
    getRoleschema() {
      this.dataPermissions = [];
      this.$axiosWen
        .get("/classes/Permission")
        .then(res => {
          const results = res.results;
          this.permissionListRes = results;
          results.map(items => {
            var obj = {};
            obj.label = items.alias;
            obj.alias = items.name;
            obj.objectId = items.objectId;
            obj.parentId = items.parent.objectId;
            obj.createtime = new Date(items.createdAt).toLocaleDateString();
            this.dataPermissions.push(obj);
          });

          // this.getMenu();
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 修改角色权限
    exportRolerole(row) {
      let usersList = [];
      let rolesList = [];
      let checkrole = [];
      let checkmenu = [];
      let selectMenu = this.$refs.menusTree.getCheckedNodes();
      let selectRermission = this.$refs.permissionTree.getCheckedNodes();
      let rolesData = this.roleItem.roles;
      let usersData = this.roleItem.users;
      if (!usersData || !rolesData) {
        this.$message({
          message: "未选择正确的角色"
        });

        return false;
      }
      usersData.forEach(item => {
        usersList.push(item.username);
      });
      rolesData.forEach(item => {
        rolesList.push(item.name);
      });
      if (selectMenu && selectRermission) {
        selectMenu.forEach(item => {
          console.log(item);
          checkmenu.push(item.label);
        });
        selectRermission.forEach(item => {
          console.log(item);
          checkrole.push(item.alias);
        });
        this.$axios
          .put("/role", {
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
            this.$message("角色信息更新成功");
          })
          .catch(error => {
            console.log(error);
            this.$message({
              message: "更新失败!"
            });
          });
      } else {
        this.$message("请选择菜单列表和权限列表");
      }
    },
    // 保存模板
    exportRoletemp(row) {
      this.$axiosWen
        .post(
          "/roletemp?name=" +
            row.name +
            "&tempname=" +
            row.name +
            "_" +
            row.desc
        )
        .then(response => {
          console.log("response", response);
        });
    },
    //编辑权限
    handleEditrole(row) {
      this.editroleid = row.id;
      var roles = Parse.Object.extend("_Role");
      var query = new Parse.Query(roles);
      query.get(row.id).then(resultes => {
        this.roleEdit = true;
        this.form.name = resultes.name;
        this.form.desc = resultes.desc;
        this.form.alias = resultes.alias;
      });
    },
    updaterole() {
      var roles = Parse.Object.extend("_Role");
      var query = new Parse.Query(roles);
      query.get(this.editroleid).then(resultes => {
        resultes.set("alias", this.form.alias);
        resultes.set("desc", this.form.desc);
        resultes.save().then(res => {
          this.$message({
            type: "success",
            message: "更新成功"
          });
        });
        this.roleEdit = false;
        this.gettable();
      });
    },
    handleNodeClick(data) {
      this.gettable(data);

      this.curDepartmentId = data.objectId;

      // 清除选中的角色

      this.currentSelectIndex = null;

      //清除菜单树

      // this.dataMenus = []
    },
    // 添加子节点
    appendChildTree(data) {
      console.log(data, "添加子节点");
    },
    // 显示弹窗
    setDialogRole(data) {
      // this.$store.commit("set_DeptObj", data);
      // eventBus.$emit("set_DeptObj", data)
      this.centerDialogRole = true;

      this.$nextTick(() => {
        this.$refs["addRoleRef"].getData(data);
      });
    },
    closeDialogRole() {
      this.centerDialogRole = false;
    }
  }
};
</script>
<style scoped lang="scss">
.department {
  width: 90%;

  margin: 0 auto;
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
