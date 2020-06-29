<template>
  <div class="structure">
    <div class="adduserDiadlog">
      <el-dialog title="新增用户" :visible.sync="adduserDiadlog" width="600px">
        <div>
          <el-form
            :model="userInfoForm"
            status-icon
            :rules="userFormRules"
            ref="userInfoFormRef"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="账号" prop="account">
              <el-input v-model="userInfoForm.account" placeholder="请输入账号" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
              <el-input
                v-model="userInfoForm.phone"
                placeholder="请输入手机号"
                :maxlength="11"
                auto-complete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="userInfoForm.email" placeholder="请输入邮箱" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="nick">
              <el-input
                v-model="userInfoForm.nick"
                placeholder="2-5个文字"
                :maxlength="5"
                auto-complete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input
                type="password"
                v-model="userInfoForm.password"
                auto-complete="off"
                placeholder="请输入6-10位数字字母组合"
                :maxlength="10"
              ></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass">
              <el-input
                type="password"
                v-model="userInfoForm.checkPass"
                auto-complete="off"
                placeholder="请再次输入密码"
                :maxlength="10"
              ></el-input>
            </el-form-item>
            <el-form-item label="部门选择" prop="departmentid">
              <!-- <el-cascader
                style="width:460px"
                placeholder="请选择部门"
                v-model="userInfoForm.departmentid"
                :props="treeprops"
                :options="treeData"
                auto-complete="off"
                :show-all-levels="false"
                change-on-select
              ></el-cascader>-->
              <el-select v-model="userInfoForm.departmentid" placeholder="请选择部门">
                <el-option
                  v-for="item in deptOption"
                  :key="item.objectId"
                  :value="item.objectId"
                  :label="item.name + ':' + item.desc"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer">
          <el-button @click="adduserDiadlog = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <!--表格渲染-->
        <div class="tabContent">
          <el-row :gutter="24">
            <el-col :span="7">
              <div class="elTree">
                <el-input
                  v-model="query.value"
                  clearable
                  :placeholder="$t('user.name')"
                  style="width: 200px;"
                  class="filter-item"
                  size="small"
                />
                <el-button
                  class="filter-item"
                  type="primary"
                  icon="el-icon-search"
                  @click="userFordepartment(0)"
                  size="small"
                >{{ $t("developer.search") }}</el-button>
                <el-button
                  class="filter-item"
                  type="primary"
                  icon="el-icon-circle-plus"
                  @click="adduser"
                  size="small"
                >{{ $t("user.newusers") }}</el-button>
                <el-button
                  class="filter-item"
                  type="primary"
                  @click="userFordepartment()"
                  size="small"
                >所有用户</el-button>
                <!-- <el-tree
              :data="treeData"
              :props="elTreedefaultProps"
              @node-click="handleNodeClick"
                ></el-tree>-->
                <div class="leftTree">
                  <el-tree
                    :data="deptTreeData"
                    :props="elTreedefaultProps"
                    node-key="id"
                    default-expand-all
                    :expand-on-click-node="false"
                  >
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                      <span @click="handleNodeClick(data)">
                        {{
                        node.label
                        }}
                      </span>
                      <span>
                        <!-- <el-button
                          type="text"
                          size="mini"
                          @click="() => appendChildTree(data)"
                          title="添加子节点"
                        >
                          <i class="el-icon-plus"></i>
                        </el-button>-->
                        <i class="el-icon-circle-plus-outline" @click="addItemUser(data)" title="添加用户"></i>
                      </span>
                    </span>
                  </el-tree>
                </div>
              </div>
            </el-col>
            <el-col :span="17">
              <div class="elTable">
                <el-table
                  v-loading="loading"
                  :data="tableFilterData"
                  size="small"
                  style="width: 90%;margin-top:20px"
                >
                  <el-table-column label="用户名">
                    <template slot-scope="scope">
                      <div>{{ scope.row.username }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column label="电话">
                    <template slot-scope="scope">
                      <div>{{ scope.row.phone }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column :show-overflow-tooltip="true" label="邮箱">
                    <template slot-scope="scope">
                      <div>{{ scope.row.email }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column label="部门">
                    <template slot-scope="scope">
                      <div>{{ scope.row.departmentname || departmentname }}</div>
                    </template>
                  </el-table-column>

                  <el-table-column :show-overflow-tooltip="true" label="创建时间">
                    <template slot-scope="scope">
                      <span>
                        {{
                        new Date(scope.row.createdAt).toLocaleDateString()
                        }}
                      </span>
                    </template>
                  </el-table-column>
                  <!-- <el-table-column label="是否启用">
            <template slot-scope="scope">
               <el-switch
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-text="scope.row.attributes.emailVerified==true? '启用':''"
              :inactive-text="scope.row.attributes.emailVerified==false? '禁用':''"
              v-model="scope.row.attributes.emailVerified"
              @change=changerole(scope.$index,scope.row)
              />
            </template>
                  </el-table-column>-->
                  <el-table-column :label="$t('developer.operation')" align="center" width="400">
                    <template slot-scope="scope">
                      <!-- <el-button
                type="info"
                size="small"
                @click="changerole(scope.$index,scope.row)"
                v-if="scope.row.attributes.emailVerified==true"
              >
                <div
                  style="width:10px;height:10px;border-radius:50%;display:inline-block;background:#a94442;margin-right:10px"
                ></div>{{$t('developer.prohibit')}}
              </el-button>
              <el-button
                type="success"
                size="small"
                @click="changerole(scope.$index,scope.row)"
                v-else
              >
                <div
                  style="width:10px;height:10px;border-radius:50%;display:inline-block;background:#00cc33;margin-right:10px"
                ></div>{{$t('developer.enable')}}
                      </el-button>-->

                      <el-button
                        type="success"
                        size="small"
                        @click="handleEditor(scope.row)"
                      >{{ $t("developer.edit") }}</el-button>
                      <el-button
                        type="danger"
                        size="small"
                        @click="handleDetele(scope.row)"
                      >{{ $t("developer.delete") }}</el-button>
                      <el-button
                        size="mini"
                        type="primary"
                        @click="editorrole(scope.row.objectId)"
                      >{{ $t("user.assignroles") }}</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <!--分页组件-->
                <el-pagination
                  :total="total"
                  v-show="total > 2"
                  style="margin-top: 8px;"
                  layout="total, prev, pager, next, sizes"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :page-sizes="[1, 5, 10]"
                  :page-size="pagesize"
                  class="total_pagination"
                />
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <!--分配角色-->
      <el-dialog
        :title="$t('user.assignroles')"
        :visible.sync="roleacl"
        :close-on-click-modal="false"
      >
        <el-table :data="rolelist" @selection-change="handleSelectionChange" ref="multipleTable">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column :label="$t('user.name')" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.attributes.alias }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('developer.describe')" align="center">
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
        <div slot="footer" class="dialog-footer">
          <el-button @click="roleacl = false">
            {{
            $t("developer.cancel")
            }}
          </el-button>
          <el-button type="primary" @click="adduseracl">
            {{
            $t("developer.determine")
            }}
          </el-button>
        </div>
      </el-dialog>
    </el-row>
  </div>
</template>
<script>
import Parse from "parse";
import { Promise } from "q";
import { setTimeout } from "timers";
import $ from "jquery";
var arr = [];
var arr1 = [];
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (!/^\w{6,10}$/.test(value)) {
          // if (!/^([\w]|[.]){6,10}$/.test(value)) {
          callback(new Error("密码格式不正确"));
        }
        callback();
      }
    };
    var validatecheckPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.userInfoForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      departmentname: "",
      curDepartmentId:"",
      deptTreeData: [],
      deptOption: [],
      departmentidFlag: "false",
      height: document.documentElement.clientHeight - 180 + "px;",
      delLoading: false,
      sup_this: this,
      loading: false,
      deptName: "",
      depts: [],
      deptId: null,
      structure: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      data: [],
      elTreedefaultProps: {
        children: "children",
        label: "name"
      },
      dataforuser: [],
      total: 0,
      query: {
        value: "",
        type: "",
        enabled: ""
      },
      tableData: [],
      pagesize: 10,
      start: 0,
      departmentid: [],
      userlist: [],
      rolelist: [],
      objectId: "",
      roleacl: false,
      multipleSelection: [],
      userrolelist: [],
      tempData: [],
      roleData: [],
      adduserDiadlog: false,
      userInfoForm: {
        account: "",
        phone: "",
        nick: "",
        password: "",
        email: "",
        checkPass: "",
        departmentid: []
      },
      userFormRules: {
        account: [{ required: true, message: "请输入账号名", trigger: "blur" }],
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            validator: function(rule, value, callback) {
              var MobileRegex = /^1[34578]\d{9}$/;
              if (!MobileRegex.test(value)) {
                callback(new Error("手机号码格式不正确！"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        password: [
          { validator: validatePass, trigger: "blur", required: true }
        ],
        checkPass: [
          { validator: validatecheckPass, trigger: "blur", required: true }
        ],
        departmentid: [
          { required: true, message: "请选择部门", trigger: "blur" }
        ],
        nick: [
          { required: true, message: "请输入昵称", trigger: "blur" },
          { min: 2, max: 5, message: "昵称格式不正确", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ]
      },
      treeprops: {
        value: "objectId",
        label: "name"
      }
    };
  },
  computed: {
    tableFilterData() {
      return this.tempData;
    }
  },
  mounted() {
    this.userFordepartment();
    this.searchAllOption();
  },
  methods: {
    // addItemUser
    addItemUser(item) {
      this.deptOption = [];
      console.log(item);
      this.deptOption.push(item);
      this.adduserDiadlog = true;
      this.userInfoForm.departmentid = item.objectId;
    },
    // 添加用户
    addUser() {
      this.$refs["userInfoFormRef"].validate(valid => {
        if (!valid) {
          this.$message({
            message: "用户信息不完整",
            type: "danger"
          });
          return false;
        }

        // if (this.userInfoForm.departmentid) {
        //   var departmentStr = this.userInfoForm.departmentid[
        //     this.userInfoForm.departmentid.length - 1
        //   ];
        // } else {
        //   var departmentStr = "";
        // }

        this.$axiosWen
          .post("/user", {
            username: this.userInfoForm.account,
            nick: this.userInfoForm.nick,
            password: this.userInfoForm.password,
            phone: this.userInfoForm.phone,
            email: this.userInfoForm.email,
            department: this.userInfoForm.departmentid
            // aclId:this.aclId
          })
          .then(response => {
            if (response) {
              this.$message({
                message: "用户添加成功！",
                type: "success"
              });
              this.adduserDiadlog = false;
            } else {
              this.$message("添加失败");
            }
          })
          .catch(error => {
            this.$message(error);
          });
      });
    },
    editorrole(id) {
      this.rolelist = [];
      this.userrolelist = [];
      this.objectId = id;
      this.roleacl = true;
      var User = Parse.Object.extend("_User");
      var user = new Parse.Query(User);
      user
        .get(this.objectId)
        .then(resultes => {
          var Role = Parse.Object.extend("_Role");
          var query = new Parse.Query(Role);
          var user = new User();
          query.addAscending("createdAt");
          query.find().then(resultes => {
            this.rolelist = resultes;
            user.set("objectId", this.objectId);
            query.equalTo("users", user);
            query.find().then(result => {
              result.map(item => {
                resultes.map((roleitem, index) => {
                  if (item.id == roleitem.id) {
                    this.$refs.multipleTable.toggleRowSelection(
                      this.rolelist[index],
                      true
                    );
                    this.userrolelist.push(roleitem.id);
                  }
                });
              });
            });
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
    seleItem(arr1, arr2, arr3) {
      arr1.map(items => {
        if (!arr2.includes(items)) {
          arr3.push(items);
        }
      });
      arr2.map(disitem => {
        if (!arr1.includes(disitem)) {
          arr3.push(disitem);
        }
      });
      this.userRolereset(arr3);
    },

    userRolereset(disroles) {
      Promise.all([
        disroles.map(nowitems => {
          this.testroles(nowitems);
        })
      ]).then(data => {
        if (data.length != 0) {
          this.$message({
            type: "success",
            message: "分配成功"
          });
          this.roleacl = false;
        }
      });
    },
    testroles(id) {
      console.log(id);
      var Roles = Parse.Object.extend("_Role");
      var roles = new Roles();
      var User = Parse.Object.extend("_User");
      var userrelation = new User();

      roles.id = id;
      if (this.multipleSelection.includes(id)) {
        var relation = roles.relation("users");
        userrelation.set("objectId", this.objectId);
        relation.add(userrelation);
        roles.save().then(resultes => {});
      } else {
        var relation = roles.relation("users");
        userrelation.set("objectId", this.objectId);
        relation.remove(userrelation);
        roles.save().then(resultes => {});
      }
    },
    adduseracl() {
      this.seleItem(this.userrolelist, this.multipleSelection, []);
      // this.userRolereset(this.userrolelist, this.multipleSelection);
      // var roles = Parse.Object.extend("_Role");
      // var query = new Parse.Query(roles);
      // var User = Parse.Object.extend("_User");
      // var user = new Parse.Query(User);
      // var userrelation = new User()
      // user.get(this.objectId).then(object => {
      //   this.multipleSelection.map(items => {
      //     query.get(items).then(resultes => {
      //       var relation = resultes.relation("users");
      //       if (!this.userrolelist.includes(items)) {
      //         userrelation.set("objectId", this.objectId);
      //         relation.add(userrelation);
      //       }
      //       this.userrolelist.map(items => {
      //         if (!this.multipleSelection.includes(items)) {
      //           userrelation.set("objectId", this.objectId);
      //           relation.remove(userrelation);
      //         }
      //       });
      //       resultes.save().then(resulte => {
      //         this.$message({
      //           type: "success",
      //           message: "成功!"
      //         });
      //         this.roleacl = false;
      //       });
      //     });
      //   });
      // });
    },
    handleSelectionChange(val) {
      this.multipleSelection = [];

      val.map(items => {
        this.multipleSelection.push(items.id);
      });
    },
    //编辑
    handleEditor(row) {
      console.log(row);
      this.$router.push({
        path: "/roles/edituser",
        query: {
          id: row.objectId
        }
      });
    },
    //删除
    handleDetele(row) {
      if (!this.curDepartmentId) {
        this.$message({
          type: "error",
          message: "请先选择部门"
        });
        return
      }
       
      this.$confirm("此操作将永久删除此用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {

        this.$axiosWen
          .delete("/user", {
            params: {
              department: this.curDepartmentId,
              username: row.username
            }
          })
          .then(res => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.handleNodeClick({ name: this.departmentname });
          });

        // this.departmentname
        // row.username

        /*           var User = Parse.Object.extend("_User");
          var user = new Parse.Query(User);
          user.get(row.id).then(object => {
            object.destroy().then(
              response => {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.userFordepartment();
              },
              error => {
                this.$message(error.message);
              }
            );
          }); */
      });
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.userFordepartment();
    },
    handleCurrentChange(val) {
      this.start = Number(val - 1) * Number(this.pagesize);
      this.userFordepartment();
    },
    //初始化用户
    userFordepartment(start) {
      if (start == 0) {
        this.start = 0;
      }
      // var User = Parse.Object.extend("_User");
      // var query = new Parse.Query(User);
      // if (this.query.value != "") {
      //   query.matches("username", this.query.value, "i");
      //   this.pagesize = 10;
      //   this.start = 0;
      // }
      // query.limit(this.pagesize);
      // query.skip(this.start);
      // query.count().then(count => {
      //   if (count) {
      //     this.total = count;
      //     query.find().then(results => {
      //       results.map(item => {
      //         var obj = {
      //           attributes: {}
      //         };
      //         obj.attributes.username = item.attributes.username;
      //         obj.attributes.phone = item.attributes.phone;
      //         obj.attributes.email = item.attributes.email;
      //         obj.attributes.departmentname = item.attributes.departmentname;
      //         obj.attributes.emailVerified = item.attributes.emailVerified;
      //         obj.createdAt = item.createdAt;
      //         obj.id = item.id;
      //         obj.departmentid = item.attributes.department
      //           ? item.attributes.department.id
      //           : "";
      //         this.tableData.push(obj);
      //         this.tempData = this.tableData;
      //       });
      //     });
      //   } else {
      //     this.dataforuser = [];
      //     this.total = 0;
      //   }
      // });
    },
    adduser() {
      this.adduserDiadlog = true;
      // this.$router.push({
      //   path: "/roles/adduser"
      // });
    },
    changerole(index, row) {
      var emailrole = "";
      var emailtype = "";
      var isemail = true;
      if (row.emailVerified == true) {
        emailrole = "禁用";
        isemail = false;
        emailtype = "warning";
      } else {
        emailrole = "启用";
        emailtype = "success";
        isemail = true;
      }
      this.$confirm("是否" + emailrole + "", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: emailtype
      })
        .then(() => {
          var User = Parse.Object.extend("_User");
          var user = new Parse.Query(User);
          user.get(row.id).then(resultes => {
            resultes.set("emailVerified", isemail);
            resultes.save().then(
              res => {
                if (res) {
                  this.$message({
                    type: "success",
                    message: "已" + emailrole + ""
                  });
                }
                this.getDepartment();
              },
              error => {
                console.log(error);
                if (error.code == 119) {
                  this.$message({
                    type: "error",
                    message: error.message
                  });
                }
              }
            );
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    handleNodeClick(data) {
      this.departmentname = data.name;
      this.curDepartmentId = data.objectId;
      const loading = this.$loading({
        lock: true,
        text: "加载中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.tempData = [];
      this.$axiosWen
        .get("/role?name=" + data.name)
        .then(res => {
          let users = res.users;
          this.tempData = users.filter(item => {
            return item.username.indexOf("user_for_") == -1;
          });
          setTimeout(() => {
            loading.close();
          }, 1200);
        })
        .catch(err => {
          setTimeout(() => {
            loading.close();
          }, 1200);
          console.log(err);
          this.total = 0;
        });
    },
    // 查询部门
    searchAllOption() {
      // 获取部门tree树
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
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.elTable /deep/ .el-table th > .cell,
.elTable /deep/ .el-table--enable-row-transition .el-table__body td {
  text-align: center;
}
.structure {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  background: #ffffff;
  .tabContent {
    .elTree {
      margin-top: 30px;
      margin-left: 20px;
      float: left;
    }
    .elTable {
      .total_pagination {
        text-align: center;
        width: 90%;
        margin-top: 20px;
      }
    }
  }
}
</style>
<style>
.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: #cccccc;
}
.structure .el-switch__label--left {
  color: #ff4949 !important;
}
.structure .el-switch__label--right {
  color: rgb(19, 206, 102) !important;
}
</style>
