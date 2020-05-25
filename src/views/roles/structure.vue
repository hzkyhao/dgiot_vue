<template>
  <div class="structure">
    <el-row :gutter="20">
      <el-col
        :xs="24"
        :sm="24"
        :md="24"
        :lg="24"
        :xl="24"
      >
        <!--表格渲染-->
        <div class="tabContent">
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
            >{{$t('developer.search')}}</el-button>
            <el-button
              class="filter-item"
              type="primary"
              icon="el-icon-circle-plus"
              @click="adduser"
              size="small"
            >{{$t('user.newusers')}}</el-button>
            <el-button
              class="filter-item"
              type="primary"
              @click="userFordepartment()"
              size="small"
            >所有用户</el-button>
            <el-tree
              :data="treeData"
              :props="elTreedefaultProps"
              @node-click="handleNodeClick"
            ></el-tree>

          </div>
          <div class="elTable">
            <el-table
              v-loading="loading"
              :data="tableFilterData"
              size="small"
              style="width: 90%;margin-top:20px"
            >
              <el-table-column label="用户名">
                <template slot-scope="scope">
                  <div>{{scope.row.attributes.username}}</div>
                </template>
              </el-table-column>
              <el-table-column label="电话">
                <template slot-scope="scope">
                  <div>{{scope.row.attributes.phone}}</div>
                </template>
              </el-table-column>
              <el-table-column
                :show-overflow-tooltip="true"
                label="邮箱"
              >
                <template slot-scope="scope">
                  <div>{{scope.row.attributes.email}}</div>
                </template>
              </el-table-column>
              <el-table-column label="部门">
                <template slot-scope="scope">
                  <div>{{ scope.row.departmentname}}</div>
                </template>
              </el-table-column>

              <el-table-column
                :show-overflow-tooltip="true"
                label="创建时间"
              >
                <template slot-scope="scope">
                  <span>{{new Date(scope.row.createdAt).toLocaleDateString()}}</span>
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
              <el-table-column
                :label="$t('developer.operation')"
                align="center"
                width="400"
              >
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
              </el-button> -->

                  <el-button
                    type="success"
                    size="small"
                    @click="handleEditor(scope.row)"
                  >{{$t('developer.edit')}}</el-button>
                  <el-button
                    type="danger"
                    size="small"
                    @click="handleDetele(scope.row)"
                  >{{$t('developer.delete')}}</el-button>
                  <el-button
                    size="mini"
                    type="primary"
                    @click="editorrole(scope.row.id)"
                  >{{$t('user.assignroles')}}</el-button>
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
              :page-sizes="[1,5,10]"
              :page-size="pagesize"
              class="total_pagination"
            />
          </div>
        </div>
      </el-col>
      <!--分配角色-->
      <el-dialog
        :title="$t('user.assignroles')"
        :visible.sync="roleacl"
        :close-on-click-modal="false"
      >
        <el-table
          :data="rolelist"
          @selection-change="handleSelectionChange"
          ref="multipleTable"
        >
          <el-table-column
            type="selection"
            width="55"
          ></el-table-column>
          <el-table-column
            :label="$t('user.name')"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{scope.row.attributes.name}}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('developer.describe')"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{scope.row.attributes.desc}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="ID"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{scope.row.id}}</span>
            </template>
          </el-table-column>
        </el-table>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="roleacl = false">{{$t('developer.cancel')}}</el-button>
          <el-button
            type="primary"
            @click="adduseracl"
          >{{$t('developer.determine')}}</el-button>
        </div>
      </el-dialog>
    </el-row>
  </div>
</template>
<script>
import Parse from "parse";
import { Promise } from "q";
import { setTimeout } from "timers";
var arr = [];
var arr1 = [];
export default {
  data () {
    return {
      deptOption: [],
      departmentidFlag: 'false',
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
        children: 'children',
        label: 'name'
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
      tempData: []
    };
  },
  computed: {
    treeData () {
      let cloneData = JSON.parse(JSON.stringify(this.deptOption));
      return cloneData.filter(father => {
        let branchArr = cloneData.filter(
          child => father.objectId == child.ParentId
        );
        branchArr.length > 0 ? (father.children = branchArr) : "";
        return father.ParentId == 0;
      });
    },
    tableFilterData () {
      return this.tempData
    }
  },
  mounted () {
    this.userFordepartment();
    this.searchAllOption();
  },
  methods: {
    editorrole (id) {
      this.userrolelist = [];
      this.objectId = id;
      this.roleacl = true;
      var User = Parse.Object.extend("_User");
      var user = new Parse.Query(User);
      user.get(this.objectId).then(resultes => {
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
      });
    },
    seleItem (arr1, arr2, arr3) {
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

    userRolereset (disroles) {
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
    testroles (id) {
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
        roles.save().then(resultes => { });
      } else {
        var relation = roles.relation("users");
        userrelation.set("objectId", this.objectId);
        relation.remove(userrelation);
        roles.save().then(resultes => { });
      }
    },
    adduseracl () {
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
    handleSelectionChange (val) {
      this.multipleSelection = [];

      val.map(items => {
        this.multipleSelection.push(items.id);
      });
    },
    //编辑
    handleEditor (row) {
      this.$router.push({
        path: '/roles/edituser',
        query: {
          id: row.id
        }
      })
    },
    //删除
    handleDetele (row) {
      console.log(row);
      this.$confirm("此操作将永久删除此用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var User = Parse.Object.extend("_User");
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
                this.$message(error.message)
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
    handleSizeChange (val) {
      this.pagesize = val;
      this.userFordepartment();
    },
    handleCurrentChange (val) {
      this.start = Number(val - 1) * Number(this.pagesize);
      this.userFordepartment();
    },
    //初始化用户
    userFordepartment (start) {
      if (start == 0) {
        this.start = 0
      }
      this.tableData = []
      var User = Parse.Object.extend("_User");
      var query = new Parse.Query(User);
      if (this.query.value != "") {
        query.matches("username", this.query.value, 'i');
        this.pagesize = 10;
        this.start = 0;
      }
      query.limit(this.pagesize);
      query.skip(this.start);

      query.count().then(count => {
        if (count) {
          this.total = count;
          query.find().then(results => {
            results.map(item => {
              var obj = {
                attributes: {}
              };
              obj.attributes.username = item.attributes.username;
              obj.attributes.phone = item.attributes.phone;
              obj.attributes.email = item.attributes.email;
              obj.attributes.departmentname = item.attributes.departmentname;
              obj.attributes.emailVerified = item.attributes.emailVerified;
              obj.createdAt = item.createdAt;
              obj.id = item.id;
              obj.departmentid = item.attributes.department ? item.attributes.department.id : ''
              this.tableData.push(obj);
              this.tempData = this.tableData
            });
          });
        } else {
          this.dataforuser = [];
          this.total = 0;
        }
      });
    },
    adduser () {
      this.$router.push({
        path: "/roles/adduser"
      });
    },
    changerole (index, row) {
      var emailrole = "";
      var emailtype = "";
      var isemail = true;
      if (row.attributes.emailVerified == true) {
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
    handleNodeClick (data) {
      this.tableData.forEach(value => {
        if (data.objectId == value.departmentid) {
          this.tempData = this.tableData.filter(item => item.departmentid == value.departmentid)
          this.total = this.tempData.length
        }
      })
    },
    // 查询部门
    searchAllOption () {
      this.$axiosWen.get("/classes/Department").then(res => {
        const results = res.results
        console.log(res.results)
        results.forEach((key, val) => {
          var obj = {};
          obj.ParentId = key.ParentId;
          obj.name = key.name;
          obj.objectId = key.objectId;
          obj.org_type = key.org_type;
          obj.createdAt = key.createdAt;
          this.data.push(obj);
        })
        if (res.results) {
          this.deptOption = res.results
        } else {
          this.$message('部门列表获取失败')
          this.deptOption = []
        }
      })
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
      width: 30%;
      float: left;
    }
    .elTable {
      width: 60%;
      float: right;
      margin-right: 5%;
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

