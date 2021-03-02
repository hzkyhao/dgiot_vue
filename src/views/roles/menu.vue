<template>
  <div class="menu">
    <div class="search">
      <el-input :placeholder="$t('user.name')" v-model="search" clearable />
      <el-button
        type="primary"
        icon="el-icon-search"
        style="margin-left:20px;"
      >{{ $t("developer.search") }}</el-button
      >
      <el-button
        type="primary"
        @click="centerUploadBox"
      >导入菜单<i
        class="el-icon-upload el-icon--right"
      /></el-button>
      <input
        v-show="false"
        id="fileExport"
        ref="inputer"
        value="上传菜单"
        type="file"
        @change="handleFileChange"
      >

      <!-- <el-button type="primary" icon="el-icon-plus" @click="dialogVisible=true">新增一级菜单</el-button> -->
    </div>
    <el-dialog
      :title="$t('developer.add')"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      :close-on-click-modal="false"
      width="50%"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item :label="$t('menu.menuname')">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item :label="$t('menu.menupath')">
          <el-select
            v-model="form.menuroad"
            :placeholder="$t('menu.menupath')"
            style="width:100%"
          >
            <el-option
              v-for="(item, index) in originmenuurl"
              :label="item.path + '--------(描述)' + item.name"
              :key="index"
              :value="item.path"
            />
          </el-select>
          <!-- <el-input v-model="form.menuroad"></el-input> -->
        </el-form-item>
        <el-form-item :label="$t('menu.sort')">
          <el-input v-model="form.number" type="number" />
        </el-form-item>
        <el-form-item :label="$t('menu.icon')">
          <el-input v-model="form.iconfont" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{
          $t("developer.cancel")
        }}</el-button>
        <el-button type="primary" @click="standardName">{{
          $t("developer.determine")
        }}</el-button>
      </span>
    </el-dialog>
    <tree-table
      :key="key"
      :default-expand-all="defaultExpandAll"
      :data="treeData"
      :columns="columns"
      border
      style="margin-top:20px;"
    >
      <template slot="number" slot-scope="{ scope }">
        <span>{{ scope.row.number }}</span>
      </template>
      <template slot="showtopmenu" slot-scope="{ scope }">
        <span>{{ scope.row.showtopmenu }}</span>
      </template>
      <template slot="icon" slot-scope="{ scope }">
        <span v-if="scope.row.icon" class="svg-container">
          <svg-icon :icon-class="scope.row.icon" />
        </span>
      </template>
      <template slot="operation" slot-scope="{ scope }">
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="addmenus(scope.row)"
        >{{ $t("menu.childrenmenu") }}</el-button
        >
        <el-button
          v-if="scope.row.objectId != 0"
          size="mini"
          type="success"
          icon="el-icon-edit"
          @click="handleEdit(scope.row)"
        >{{ $t("developer.edit") }}</el-button
        >
        <el-button
          v-if="scope.row.objectId != 0"
          size="mini"
          type="danger"
          icon="el-icon-delete"
          @click="handleDelete(scope.row)"
        >{{ $t("developer.delete") }}</el-button
        >
      </template>
    </tree-table>
    <!--编辑菜单-->
    <el-dialog
      :title="$t('developer.edit')"
      :visible.sync="MenuEdit"
      :close-on-click-modal="false"
    >
      <el-form :model="MenuForm">
        <el-form-item
          :label="$t('menu.menuname')"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="MenuForm.name"
            autocomplete="off"
            style="width:300px;"
          />
        </el-form-item>
        <el-form-item
          :label="$t('menu.menupath')"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="MenuForm.url"
            autocomplete="off"
            style="width:300px;"
            disabled
          />
        </el-form-item>
        <el-form-item
          :label="$t('menu.parentmenu')"
          :label-width="formLabelWidth"
        >
          <el-cascader
            v-model="MenuForm.fathername"
            :options="treeData"
            :props="props"
            :show-all-levels="false"
            clearable
            change-on-select
            style="wdith:300px"
          />
        </el-form-item>
        <el-form-item :label="$t('menu.sort')" :label-width="formLabelWidth">
          <el-input
            v-model="MenuForm.number"
            autocomplete="off"
            style="width:300px;"
            type="number"
          />
        </el-form-item>
        <!-- <el-form-item
          :label="$t('menu.Navigation')"
          :label-width="formLabelWidth"
        >
          <el-select
            v-model="MenuForm.roles"
            :placeholder="$t('menu.text')"
            multiple
            style="width:300px;"
            @change="SelectTopmenu"
            @remove-tag="removerole"
          >
            <el-option
              v-for="item in options"
              :key="item.name"
              :label="item.alias"
              :value="item.objectId"
            />
          </el-select>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="MenuEdit = false">{{
          $t("developer.cancel")
        }}</el-button>
        <el-button type="primary" @click="updatemenu">{{
          $t("developer.determine")
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import treeTable from "@/components/TreeTable";
import data from "./data";
import { utc2beijing } from "@/utils";
import { queryMenu } from "@/api/Menu/index";
export default {
  name: "TreeTableDemo",
  components: { treeTable },
  data() {
    return {
      MenuForm: {
        name: "",
        url: "",
        // switch:false,
        roles: [],
        number: "",
        fathername: []
      },
      props: {
        value: "objectId",
        label: "name",
        children: "children"
      },
      options: [],
      formLabelWidth: "120px",
      MenuEdit: false,
      defaultExpandAll: true,
      showCheckbox: true,
      key: 1,
      columns: [
        {
          label: "Menu name",
          key: "name",
          expand: true,
          align: "left"
        },
        {
          label: "Menu path",
          key: "url",
          width: 200,
          expand: true,
          align: "center"
        },
        {
          label: "Navigation",
          key: "showtopmenu",
          expand: true,
          align: "center"
        },
        {
          label: "Index",
          key: "number",
          expand: true,
          width: 100
        },
        {
          label: "Icon",
          key: "icon",
          expand: true,
          width: 100
        },
        {
          label: "Created time",
          key: "createtime",
          align: "center"
        },
        {
          label: "Operation",
          key: "operation",
          width: 400
        }
      ],
      data: [],
      search: "",
      dialogVisible: false,
      tableData: [],
      form: {
        name: "",
        resource: "菜单",
        topname: "",
        menuroad: "",
        iconfont: "",
        number: ""
      },
      parent: "",
      current: "",
      parentmenu: [
        {
          id: "0",
          attributes: {
            name: "顶级菜单"
          }
        }
      ],
      originacl: [],
      menuid: "",
      originmenuurl: [],
      isaddmenu: true,
      file: "",
      inputDOM: "",
      size: "",
      formData: ""
    };
  },
  computed: {
    treeData() {
      const cloneData = JSON.parse(JSON.stringify(this.data));
      var Tree = []; // 对源数据深度克隆
      Tree = cloneData.filter(father => {
        const branchArr = cloneData.filter(
          child => father.objectId == child.parent
        ); // 返回每一项的子级数组
        branchArr.length > 0 ? (father.children = branchArr) : ""; // 如果存在子级，则给父级添加一个children属性，并赋值
        father.parent == 0 ? (father.parent = "0") : "";
        return father.parent == 0; // 返回第一层
      });
      return [
        {
          name: "一级菜单",
          objectId: "0",
          children: Tree
        }
      ];
    }
  },
  watch: {
    showCheckbox(val) {
      if (val) {
        this.columns.unshift({
          label: "Checkbox",
          checkbox: true
        });
      } else {
        this.columns.shift();
      }
      this.reset();
    }
  },
  mounted() {
    this.getMenu();
    this.originmenuurl = [];
    this.getoriginmenu(this.$router.options.routes);
    this.getRole();
  },
  methods: {
    getRole() {
      queryMenu({}).then(res => {
        res.results.map(item => {
          var obj = {};
          obj.objectId = item.objectId;
          obj.alias = item.alias;
          obj.name = item.name;
          this.options.push(obj);
        });
      });
    },
    SelectTopmenu(val) {
      console.log(val);
    },
    getoriginmenu(menu) {
      menu.map(items => {
        if (!items.hidden && items.path) {
          if (items.path != "/") {
            var obj = {};
            obj.path = items.path;
            obj.name = items.name;
            this.originmenuurl.push(obj);
          }
          if (items.children) {
            this.getoriginmenu(items.children);
          }
        }
      });
    },
    // 调用input file
    centerUploadBox() {
      this.$refs.inputer.click();
    },
    // 真正的文件上传
    handleFileChange(e) {
      this.inputDOM = this.$refs.inputer;
      console.log(this.inputDOM.files[0]);
      if (!/[.](zip)$/.menu(this.inputDOM.files[0].name)) {
        this.$message({
          type: "warning",
          message: "仅支持zip文件"
        });
        return false;
      } else {
        this.file = this.inputDOM.files[0]; // 通过DOM取文件数据
        this.size = Math.floor(this.file.size / 1024); // 计算文件的大小
        this.formData = new FormData(); // new一个formData事件
        this.formData.append("file", this.file); // 将file属性添加到formData里
        this.$axios
          .post("iotapi/menu", this.formData)
          .then(res => {
            this.$message({
              type: "success",
              message: "菜单导入成功"
            });
            setTimeout(() => {
              this.file = "";
              this.inputDOM = "";
              this.size = "";
              this.formData = "";
              this.getMenu();
            }, 1500);
          })
          .catch(e => {
            console.log(e);
            this.$message({
              type: "error",
              message: "菜单导入失败"
            });
          });
      }
    },
    updatemenu() {
      const params = {
        name: this.MenuForm.name,
        parent: { objectId: this.MenuForm.fathername[this.MenuForm.fathername.length - 1], __type: "Pointer", className: "Menu" },
        orderBy: Number(this.MenuForm.number)
      }
      this.$update_object('Menu', this.menuid, params).then(data => {
        this.$message({
          message: "修改成功",
          type: "success"
        });
        this.MenuEdit = false;
        this.menuid = "";
        this.getMenu();
      });
    },
    standardName() {
      this.isaddmenu = true;
      this.data.map(item => {
        if (item.url == this.form.menuroad) {
          this.$message({
            message: "此菜单路径已被选择",
            type: "error"
          });
          this.isaddmenu = false;
          return this.isaddmenu;
        }
      });

      if (this.menuid == "" && this.isaddmenu) {
        const aclKey = '*'
        const aclKey1 = 'role:admin'
        const setAcl = {}
        setAcl[aclKey] = {
          read: true
        }
        setAcl[aclKey1] = {
          read: true,
          write: true
        }
        const params = {
          ACL: setAcl,
          name: this.form.name,
          parent: { objectId: '0', __type: "Pointer", className: "Menu" },
          url: this.form.menuroad,
          icon: this.form.iconfont,
          orderBy: Number(this.form.number)
        }
        this.$create_object('Menu', params).then(object => {
          this.$message({
            message: "新增成功",
            type: "success"
          });

          this.dialogVisible = false;
          this.menuid = "";
          this.getMenu();
        })
      } else if (this.menuid != "" && this.isaddmenu) {
        const aclKey = '*'
        const aclKey1 = 'role:admin'
        const setAcl = {}
        setAcl[aclKey] = {
          read: true
        }
        setAcl[aclKey1] = {
          read: true,
          write: true
        }
        const params = {
          ACL: setAcl,
          name: this.form.name,
          parent: { objectId: this.menuid, __type: "Pointer", className: "Menu" },
          url: this.form.menuroad,
          icon: this.form.iconfont,
          orderBy: Number(this.form.number)
        }
        // console.log('params', params)
        this.$create_object('Menu', params).then(res => {
          if (res.error) {
            this.$message({
              type: "error",
              message: "新增失败!"
            });
          } else {
            this.$message({
              message: "新增成功",
              type: "success"
            });
            this.dialogVisible = false;
            this.getMenu();
          }
        })
      }
      // this.parentid=obj.id;
      // this.originrole.push(obj)
    },
    reset() {
      ++this.key;
    },
    click(scope) {
      const row = scope.row;
      const message = Object.keys(row)
        .map(i => {
          return `<p>${i}: ${row[i]}</p>`;
        })
        .join("");
      this.$notify({
        title: "Success",
        dangerouslyUseHTMLString: true,
        message: message,
        type: "success"
      });
    },
    getParent(data2, nodeId2, arrRes) {
      data2.map(items => {
        if (items.objectId == nodeId2) {
          arrRes.push(items.objectId);
          this.getParent(data2, items.parent, arrRes);
        } else if (items.parent == 0 && items.objectId == nodeId2) {
          arrRes.push(items.objectId);
        }
      });
      if (arrRes.length >= 1 && arrRes[0] != 0) {
        arrRes.unshift("0");
      }
      //  console.log(arrRes)
      return arrRes;
    },
    // 编辑菜单点击
    handleEdit(row) {
      var arr1 = [];
      this.menuid = row.objectId;
      this.objectId = row.objectId;
      this.$get_object('Menu', row.objectId).then(resultes => {
        console.log('sssss', resultes,row);
        this.MenuEdit = true;
        this.MenuForm.name = resultes.name;
        this.MenuForm.url = resultes.url;
        this.MenuForm.number = resultes.orderBy;
        this.MenuForm.fathername = this.getParent(this.data, row.parent, arr1);
        this.MenuForm.roles = row.showobjectId;
      });
    },
    // 删除菜单
    handleDelete(row) {
      if (!row.children) {
        this.$del_object('Menu', row.objectId).then(res => {
          if (res.error) {
            this.$message({
              type: "error",
              message: "删除失败!"
            });
          } else {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getMenu();
          }
        });
      } else {
        this.$message({
          type: "warning",
          message: "请先删除此菜单中的子菜单!"
        });
      }
    },
    searchvalue() {},
    handleClose() {
      this.dialogVisible = false;
    },
    addmenus(row) {
      this.dialogVisible = true;
      this.menuid = row.objectId;
    },
    getMenu() {
      this.data = [
        {
          name: "顶级菜单",
          objectId: "0",
          parent: "111"
        }
      ];
      const params = {}
      queryMenu(params).then(res => {
        res.results.map(items => {
          var obj = {};
          obj.name = items.name;
          obj.objectId = items.objectId;
          obj.icon = items.icon;
          obj.parent = items.parent.objectId;
          obj.createtime = utc2beijing(items.createdAt);
          obj.number = items.orderBy;
          obj.url = items.url;
          obj.isshowtop = [];
          obj.showobjectId = [];
          obj.showtopmenu = "";
          if (items.navShow) {
            items.navShow.map(navshow => {
              var roleobj = {};
              roleobj.name = navshow.alias;
              roleobj.value = navshow.roleId;
              obj.isshowtop.push(navshow.alias);
              obj.showobjectId.push(navshow.roleId);
            });
            obj.showtopmenu = obj.isshowtop.join(",");

            this.data.push(obj);
          } else {
            this.data.push(obj);
          }
        });
      }).catch(e => {
        console.log("queryMenu error", e.error)
      });
    }
  }
};
</script>

<style scoped>
.menu {
  width: 100%;
  min-height: 875px;
  padding: 20px;
  box-sizing: border-box;
  background: #ffffff;
}
.option-item {
  display: inline-block;
  margin-right: 15px;
}
</style>
<style>
.menu .search .el-input {
  width: 200px;
}
.menu .el-cascader .el-input {
  width: 300px;
}
</style>
