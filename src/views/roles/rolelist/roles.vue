<template>
  <div class="roles">
    <el-row :gutter="20">
      <el-col :span="5">
        <div class="leftTree">
          <el-tree
            :data="deptTreeData"
            :props="roleProps"
            @node-click="handleNodeClick"
            node-key="index"
            default-expand-all
            :expand-on-click-node="false"
          >
            <div class="custom-tree-node"  slot-scope="{ node, data }">
              <span  :class="{ selected: data.objectId == curDepartmentId}" >{{ node.label }}</span>
              <span>
                <i class="el-icon-circle-plus-outline" @click="setDialogRole(data)" title="添加角色"></i>
              </span>
            </div>
          </el-tree>
        </div>
      </el-col>
      <el-col :span="9">
        <div class="rightTable">
          <div class="search">
            <el-input :placeholder="$t('user.name')" size="mini" v-model="search" clearable></el-input>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-search"
              style="margin-left:20px;"
              @click="gettable(0)"
            >{{ $t("developer.search") }}</el-button>
            <!-- icon="el-icon-plus" -->
            <el-button type="primary" size="mini" @click="add">
              {{
              $t("developer.add")
              }}
            </el-button>
            <!-- icon="el-icon-search" -->
            <el-button type="primary" size="mini" @click="gettable()">所有角色</el-button>
          </div>
          <div class="tableroles" style="margin-top:20px">
            <el-table
              :data="tableData"
              style="width: 100%;text-align:center"
              @row-click="getDetailmenu"
              size="small"
              :row-class-name="tableRowClassName"
              :row-style="selectedHighlight"
            >
              <el-table-column :label="$t('user.name')" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.attributes.name }}</span>
                </template>
              </el-table-column>
              <!--         <el-table-column :label="$t('developer.describe')" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.attributes.desc }}</span>
                </template>
              </el-table-column>-->
              <el-table-column :label="$t('user.Remarks')" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.attributes.alias }}</span>
                </template>
              </el-table-column>
              <el-table-column label="ID" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.id }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('developer.operation')" align="center">
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
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-sizes="[1, 5, 10]"
                :page-size="pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                v-show="total > 2"
              ></el-pagination>
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
                show-checkbox
                node-key="objectId"
                default-props
                accordion
                :default-checked-keys="rolePermissonList"
                :expand-on-click-node="false"
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
                show-checkbox
                node-key="objectId"
                default-props
                accordion
                :default-checked-keys="roleMenuList"
                :expand-on-click-node="false"
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

    <el-dialog title="添加角色" :visible="centerDialogRole" @close="closeDialogRole" width="30%" center>
      <div style="height:420px">
        <addroles />
      </div>
      <!-- <el-button @click="centerDialogRole = false">取 消</el-button>
        <el-button
          type="primary"
          @click="centerDialogRole = false"
      >确 定</el-button>-->
    </el-dialog>
    <el-dialog :title="$t('developer.add')" :visible.sync="dialogVisible" width="50%">
      <el-table
        :data="tableDataroles"
        style="width: 100%;text-align:center"
        @selection-change="handleSelectionChange"
        ref="multipleTable"
      >
        <el-table-column type="selection" width="55"></el-table-column>
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
          <el-input v-model="form.name" autocomplete="off" style="width:300px;" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('user.Remarks')" :label-width="formLabelWidth">
          <el-input v-model="form.alias" autocomplete="off" style="width:300px;"></el-input>
        </el-form-item>
        <el-form-item :label="$t('developer.describe')" :label-width="formLabelWidth">
          <el-input
            v-model="form.desc"
            autocomplete="off"
            style="width:300px;"
            type="textarea"
            :rows="2"
          ></el-input>
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
import { page, UpdatedMenu, UpdatedRole } from "@/api/login";
import { Parse } from "parse";
import { returnLogin } from "@/utils/return";
import addroles from "@/views/roles/rolelist/addroles";
export default {
  data() {
    return {
      deptTreeData: [],
      curDepartmentId:"",
      formLabelWidth: "120px",
      roleEdit: false,
      form: {
        name: "",
        alias: "",
        desc: ""
      },
      data: [],
      dialogVisible: false,
      multipleSelection: [],
      search: "",
      total: 0,
      pagesize: 10,
      start: 0,
      tableData: [],
      update: 0,
      id: "",
      row: "",
      insert: [],
      roles1: [],
      tableDataroles: [],
      centerDialogVisible: false,
      originrole: [],
      orderresultes: [],
      depandmenu: [],
      rolemenu: [],
      rolemenuname: "",
      roleobjectid: "",
      rolecontrol: true,
      roledata: [],
      rolecontroldata: [],
      data1: [],
      editroleid: "",
      currentSelectIndex: "",
      roleProps: {
        children: "children",
        label: "name"
      },
      roleData: [],
      DialogRoleFlag: true,
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
    centerDialogRole() {
      return this.$store.getters.DialogFlag;
    },
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
  components: {
    addroles
  },
  mounted() {
    this.gettable();
    this.getMenu();
    this.getRoleschema();
  },

  methods: {
    getMenu() {
      this.data = [];
      this.dataMenus = [];
      this.$axiosWen
        .get("/classes/Menu")
        .then(res => {
          const resultes = res.results;
          this.menuListRes = resultes;
          resultes.map(items => {
            var obj = {};
            obj.label = items.name;
            obj.objectId = items.objectId;
            obj.parentId = items.parent.objectId;
            obj.createtime = new Date(items.createdAt).toLocaleDateString();
            this.data.push(obj);
            this.dataMenus.push(obj);
          });
        })
        .catch(error => {
          console.log(error);
        });
      //查询部门
      this.$axiosWen
        .get("/roletree")
        .then(res => {
          this.deptTreeData = res.results;
          this.handleNodeClick(this.deptTreeData[0]);
        })
        .catch(err => {
          this.$message("部门列表获取失败");
          this.deptTreeData = [];
          console.log(err);
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
    add() {
      this.$router.push({
        path: "/roles/editroles",
        query: {
          insert: 0
        }
      });
    },
    //给角色设置访问权限
    // handleEdit(row) {
    //   this.objectId = row.id;
    //   this.centerDialogVisible = true;
    //   this.tableDataroles = [];
    //   this.originrole = [];
    //   var Role = Parse.Object.extend("_Role");
    //   var role = new Parse.Query(Role);
    //   role.find().then(resultes => {
    //     this.tableDataroles = resultes;
    //     role.get(this.objectId).then(res => {
    //       var _this = this;
    //       var rootrole = res.attributes.ACL.permissionsById;
    //       Object.keys(rootrole).forEach(function(key) {
    //         if (key == "*") {
    //           _this.originrole.push(key);
    //         } else {
    //           _this.originrole.push(key.substring(5));
    //         }
    //       });
    //       for (let i = 0; i < this.tableDataroles.length; i++) {
    //         if (
    //           this.originrole.includes(this.tableDataroles[i].attributes.name)
    //         ) {
    //           this.$refs.multipleTable.toggleRowSelection(
    //             this.tableDataroles[i],
    //             true
    //           );
    //         }
    //       }
    //     });
    //   });
    // },
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
          acl.setRoleReadAccess(item.attributes.name, true);
          acl.setRoleWriteAccess(item.attributes.name, true);
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
                returnLogin(error);
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
      this.rolename = row.attributes.name;

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

      console.log("column", column);
      console.log("event", event);
      console.log("cell", cell);

      this.currentSelectIndex = row.index;

      this.$axiosWen
        .get("/role?name=" + row.attributes.name)
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

    // rowClick (row) {
    //     this.currentSelectIndex=row.index
    // },
    //初始化权限列表
    gettable(start) {
      if (start == 0) {
        this.start = 0;
      }
      this.loadingService = this.$loading({
        lock: true,
        text: "请等待...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.tableData = [];
      var roles = Parse.Object.extend("_Role");
      var query = new Parse.Query(roles);
      query.limit(this.pagesize);
      query.skip(this.start);
      if (this.searchvalue != "") {
        query.equalTo("name", this.searchvalue);
      }
      query.count().then(count => {
        if (count) {
          this.total = count;
        }
        query.find().then(
          res => {
            this.tableData = res;
            this.loadingService.close();
          },
          error => {
            this.loadingService.close();
            console.log(error);
            if (error.code == "209") {
              this.$message({
                type: "warning",
                message: "登陆权限过期，请重新登录"
              });
              this.$router.push({
                path: "/login"
              });
            }
          }
        );
      });
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.gettable();
    },
    handleCurrentChange(val) {
      this.start = Number(val - 1) * Number(this.pagesize);
      this.gettable();
    },
    handleCheckChange(data, checked) {
      console.log(data, checked);
    },
    searchvalue() {
      this.tableData = [];
      var roles = Parse.Object.extend("_Role");
      var query = new Parse.Query(roles);
      query.equalTo("name", this.search);
      query.limit(this.pagesize);
      query.count().then(count => {
        if (count) {
          this.total = count;
          query.find().then(results => {
            this.tableData = results;
          });
        }
      });
    },
    // checked(){

    // }
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

          this.getMenu();
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
            name: row.attributes.name,
            alias: row.attributes.alias,
            desc: row.attributes.desc,
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
            row.attributes.name +
            "&tempname=" +
            row.attributes.name +
            "_" +
            row.attributes.desc
        )
        .then(response => {
          console.log("response", response);

          /*     if(response){
                      window.open(
                        window.location.origin +
                          "/iotapi/product?name=" +
                          _this.productName,
                          "_blank"
                      );
                    } */
        });
    },
    //编辑权限
    handleEditrole(row) {
      this.editroleid = row.id;
      var roles = Parse.Object.extend("_Role");
      var query = new Parse.Query(roles);
      query.get(row.id).then(resultes => {
        this.roleEdit = true;
        this.form.name = resultes.attributes.name;
        this.form.desc = resultes.attributes.desc;
        this.form.alias = resultes.attributes.alias;
        console.log(resultes);
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
      this.gettable(data.objectId)
      console.log('data ###',data);
      
      this.curDepartmentId = data.objectId
    },
    // 添加子节点
    appendChildTree(data) {
      console.log(data, "添加子节点");
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
      );
    },
    // 添加用户
    addRoleUser(parentKey) {
      this.$store.dispatch("setDeptInfo", parentKey);
    },
    // 显示弹窗
    setDialogRole(data) {
      this.$store.commit("set_DeptObj", data);
      this.$store.dispatch("setDialogFlag", true);
    },
    closeDialogRole() {
      this.$store.dispatch("setDialogFlag", false);
    }
  },
  watch: {
    centerDialogRole: {
      deep: true,
      handler: function(val) {
        if (val == false) {
          this.getMenu();
          this.gettable();
        }
      }
    }
  }
};
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
  color:#409EFF;
    }
  .el-tree-node {

    margin-top:5px; 
  }
}

</style>
