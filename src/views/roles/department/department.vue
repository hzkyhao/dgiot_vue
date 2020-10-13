<template>
  <div class="department">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-table
          :data="roletempList"
          :row-class-name="tableRowClassName"
          :row-style="selectedHighlight"
          size="small"
          border
          highlight-current-row
          @row-click="getDetailmenu"
        >
          <el-table-column label="名称" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.data.name }}</span>
              <span>( {{ scope.row.key }} )</span>
            </template>
          </el-table-column>

          <el-table-column
            width="180"
            :label="$t('developer.operation')"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                size="small"
                @click.native="exportRoletemp(scope.row)"
                type="primary"
                >更新模版</el-button
              >
              <el-button
                size="small"
                @click.native="
                  handleDelete(scope.$index, scope.row, roletempList)
                "
                type="danger"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-col>

      <el-col :span="8">
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
                node-key="name"
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
                node-key="label"
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
      <el-col :span="10">
        <div class="footerleft">
          <p class="top">
            <span class="svg-container">
              <svg-icon icon-class="role_group" />
            </span>
            <span>标签信息</span>
          </p>
        </div>
        <div class="tags">
          <el-form ref="form" :rules="Rule" :model="form" label-width="120px">
            <!-- <el-form-item label="平台">
                    <el-select v-model="form.product" placeholder="请选择平台"  style="width:80%">
                      <el-option v-for="(item,index) in selectapp" :key="index" :label="item.attributes.subtitle" :value="item.id"></el-option>
                   </el-select>
              </el-form-item>-->
            <el-form-item label="访问密钥">
              <el-input v-model="form.secret" style="width:80%" readonly>
                <el-button
                  slot="append"
                  icon="el-icon-refresh-right"
                  @click="handleClickRefresh"
                />
              </el-input>
            </el-form-item>
            <el-form-item label="Token有效时间">
              <el-input
                v-model="form.expires"
                type="number"
                style="width:80%"
                placheholder="请输入应用时间"
              />
              <span style="margin-left:5px;">秒</span>
            </el-form-item>

            <el-form-item label="文件资源" prop="file">
              <el-input
                v-model="form.file"
                style="width:80%"
                placheholder="请输入url"
              />
            </el-form-item>

            <el-form-item label="组态资源" prop="topo">
              <el-input
                v-model="form.topo"
                style="width:80%"
                placheholder="请输入url"
              />
            </el-form-item>

            <el-form-item label="Graphql API" prop="graphql">
              <el-input
                v-model="form.graphql"
                style="width:80%"
                placheholder="请输入url"
              />
            </el-form-item>

            <el-form-item label="Restful API" prop="rest">
              <el-input
                v-model="form.rest"
                style="width:80%"
                placheholder="请输入url"
              />
            </el-form-item>

            <el-form-item label="home">
              <el-input
                v-model="form.home"
                style="width:80%"
                placheholder="请输入路径"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
const Base64 = require('js-base64').Base64s
import { page, UpdatedMenu, UpdatedRole } from "@/api/login";
import { Parse } from "parse";
import { eventBus } from "@/api/eventBus";
export default {
  name: "Department",
  data() {
    const validatorUrl = (rule, value, callback) => {
      var regStr = /^(((ht|f)tps?):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;
      if (value === "" || value === null) {
        callback(new Error("请输入url地址"));
      } else if (!regStr.test(value)) {
        callback(new Error("请输入正确的url地址"));
      } else {
        callback();
      }
    };
    return {
      Rule: {
        desc: [
          { required: true, message: "请输入应用名称", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (value.length === 0) {
                callback(new Error("应用名称不能为空"));
              } else {
                callback();
              }
            }
          }
        ],
        file: [{ trigger: "blur", validator: validatorUrl }],
        topo: [{ trigger: "blur", validator: validatorUrl }],
        graphql: [{ trigger: "blur", validator: validatorUrl }],
        rest: [{ trigger: "blur", validator: validatorUrl }]
      },
      form: {},
      roletempList: [],
      dataMenus: [],
      roleMenuList: [],
      dataPermissions: [],
      rolePermissonList: []
    };
  },
  computed: {
    permissionTreeData() {
      return this.dataPermissions.filter(father => {
        let branchArr = [];

        this.dataPermissions.forEach(child => {
          if (father.objectId == child.parentId) {
            branchArr.push(child);
          }
        });

        /*     let branchArr = this.dataPermissions.filter( (child) => {
            return father.objectId == child.parentId
            }
        ); */

        // 如果存在子级，则给父级添加一个children，并赋值
        if (branchArr.length > 0) {
          father.children = branchArr;
        }
        return father.parentId == 0;
      });
    },
    menuTreeData() {
      return this.dataMenus.filter(father => {
        let branchArr = this.dataMenus.filter(
          child => father.objectId == child.parentId
        );

        if (branchArr.length > 0) {
          father.children = branchArr;
        }
        return father.parentId == 0;
      });
    }
  },
  components: {},
  mounted() {
    this.gettable();
    this.getMenu();
    this.getRoleschema();

    /* eventBus.$on("dialogHide", () => {
      this.centerDialogRole = false;
    }); */
  },

  methods: {
    handleClickRefresh(){
      const ranNum = Math.ceil(Math.random() * 25)
      this.form.secret = Base64.encode(
        String.fromCharCode(65 + ranNum) +
          Math.ceil(Math.random() * 10000000) +
          Number(new Date())
      )
    },
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
    gettable(start) {
      this.$axiosWen
        .get("/classes/Dict", {
          params: {
            where: {
              type: "roletemp"
            }
          }
        })
        .then(res => {
          if (res && res.results) {
            this.roletempList = res.results;
          } else {
            this.roletempList = [];
          }
        });
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
            obj.name = items.name;
            obj.objectId = items.objectId;
            obj.parentId = items.parent.objectId;
            obj.createtime = new Date(items.createdAt).toLocaleDateString();
            this.dataPermissions.push(obj);
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
    tableRowClassName({ row, rowIndex }) {
      //把每一行的索引放进row

      row.index = rowIndex;
    },
    selectedHighlight({ row, rowIndex }) {
      if (this.currentSelectIndex === rowIndex) {
        return {
          color: "#409EFF",
          "font-weight": "bold"
        };
      }
    },
    getDetailmenu(row, column, event, cell) {
      this.form = row.data.tag.appconfig || [];
      if (column && column.label == "操作") {
        return;
      }
      this.currentSelectIndex = row.index;

      this.doSetChecked(row.data.menus, row.data.rules);
    },
    doSetChecked(allMenus, allPermissions) {
      this.roleMenuList = [];
      this.rolePermissonList = [];

      const tempMenuList = [];
      const tempPermissonList = [];

      this.menuListRes.map(items => {
        allMenus.map(mentItem => {
          if (items.name == mentItem) {
            tempMenuList.push(items.name);
          }
        });
      });

      this.roleMenuList = [...new Set(tempMenuList)];
      // set ###
      this.$refs.menusTree.setCheckedKeys(this.roleMenuList);

      this.permissionListRes.map(items => {
        allPermissions.map(mentItem => {
          if (items.name == mentItem) {
            tempPermissonList.push(items.name);
          }
        });
      });

      this.rolePermissonList = [...new Set(tempPermissonList)];

      // set ###
      this.$refs.permissionTree.setCheckedKeys(this.rolePermissonList);
    },
    // 删除模板
    handleDelete(index, row, data) {
      this.$axiosWen
        .delete("/classes/Dict/" + row.objectId)
        .then(res => {
          this.$message({
            type: "sussess",
            message: "删除成功"
          }),
            data.splice(index, 1);
        })
        .catch(e => {
          this.$message({
            type: "error",
            message: "删除失败" + e.error
          });
        });
    },
    // 保存模板
    exportRoletemp(row) {
      this.$confirm("确定要更新吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let checkrole = [];
        let checkmenu = [];
        let selectMenu = this.$refs.menusTree.getCheckedNodes();
        let selectRermission = this.$refs.permissionTree.getCheckedNodes();

        if (
          selectMenu &&
          selectRermission &&
          selectMenu.length > 0 &&
          selectRermission.length > 0
        ) {
          selectMenu.forEach(item => {
            checkmenu.push(item.label);
          });
          selectRermission.forEach(item => {
            checkrole.push(item.name);
          });
        } else {
          this.$message({ mesaage: "数据为空" });
          return;
        }

        var newData = row.data;

        newData.menus = checkmenu;
        newData.rules = checkrole;

        const loading = this.$loading({
          background: "rgba(0, 0, 0, 0.5)"
        });

        this.$axiosWen
          .put("/classes/Dict/" + row.objectId, {
            data: newData
          })
          .then(res => {
            loading.close();
            if (res) {
              this.$message({ message: "更新成功" });
            }
          })
          .catch(err => {
            loading.close();
            this.$message({ message: "更新失败" });
          });
      });
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
