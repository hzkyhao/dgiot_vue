<template>
  <div class="department">
    <div class="search">
      <el-input :placeholder="$t('user.name')" v-model="search" clearable style="wdith:200px"></el-input>
      <el-button type="primary" icon="el-icon-search" style="margin-left:20px;">{{$t('developer.search')}}</el-button>
      <el-button type="primary" icon="el-icon-plus" @click="add()">{{$t('developer.add')}}</el-button>
    </div>
    <el-dialog :title="$t('developer.add')" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item :label="$t('user.name')">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('department.Superior')">
          <el-cascader
            style="width:100%"
            :placeholder="$t('department.text')"
            v-model="form.departmentid"
            :props="treeprops"
            :options="treeData"
            :show-all-levels="false"
            change-on-select
          ></el-cascader>

        </el-form-item>
        <el-form-item label="Level">
          <el-input v-model="form.level"></el-input>
        </el-form-item>
          <el-form-item :label="$t('department.category')">
            <el-select v-model="form.type" :placeholder="$t('department.category')" style="width:100%;">
              <el-option :label="$t('department.ProvincialElectricPower')" value="省电力公司"></el-option>
              <el-option :label="$t('department.powersupplybureau')" value="供电局"></el-option>
              <el-option :label="$t('department.concertation')" value="集中器"></el-option>
              <el-option :label="$t('department.meter')" value="电表"></el-option>
            </el-select>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{$t('developer.cancel')}}</el-button>
        <el-button type="primary" @click="standardName">{{$t('developer.determine')}}</el-button>
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
      <!-- <template slot="scope" slot-scope="{scope}">
        <el-tag>{{ scope.row.level}}</el-tag>
      </template> -->
      <template slot="operation" slot-scope="{scope}">
        <el-button size="mini" type="success" icon="el-icon-edit" @click="handleEdit(scope.row)">{{$t('developer.edit')}}</el-button>
        <el-button
          size="mini"
          type="danger"
          icon="el-icon-delete"
          @click="handleDelete(scope.row)"
        >{{$t('developer.delete')}}</el-button>
      </template>
    </tree-table>
    <!-- <el-table :data="treeData"
    style="width: 100%;margin-top: 20px;"
    :expand-row-keys="expenddata"
    border
    row-key="objectId">
    <el-table-column
      prop="name"
      label="名称"
     >
    </el-table-column>
    <el-table-column
      prop="objectId"
      label="ID"
     >
    </el-table-column>
    <el-table-column
      prop="scope"
      label="level"
     >
    </el-table-column>
    <el-table-column
      prop="createtime"
      label="创建时间"
     >
    </el-table-column>
     <el-table-column
      label="操作"
     >
     <template slot-scope="scope">
      <el-button size="mini" type="success" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
        <el-button
          size="mini"
          type="danger"
          icon="el-icon-delete"
          @click="handleDelete(scope.row)"
        >删除</el-button>
     </template>
    </el-table-column>
    </el-table> -->
    <!--部门弹窗-->
    <el-dialog :title="$t('developer.edit')" :visible.sync="departmentEdit">
      <el-form :model="departmentForm">
        <el-form-item :label="$t('user.name')" :label-width="formLabelWidth">
          <el-input v-model="departmentForm.name" autocomplete="off" style="width:300px;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="departmentEdit = false">{{$t('developer.cancel')}}</el-button>
        <el-button type="primary" @click="updatedepartment">{{$t('developer.determine')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import treeTable from "@/components/TreeTable";
import { Parse } from "parse";
import {utc2beijing} from '@/utils'
export default {
  name: "TreeTableDemo",
  components: { treeTable },
  data() {
    return {
      departmentForm: {
        name: ""
      },
      departmentid: "",
      formLabelWidth: "120px",
      departmentEdit: false,
      defaultExpandAll: true,
      showCheckbox: true,
      expenddata:[],
      key: 1,
      treeprops: {
        value: "objectId",
        label: "name"
      },
      columns: [
        {
          label: "Name",
          key: "name",
          expand: true,
          align:'left'
        },
        {
          label: "ID",
          key: "objectId",
          width: 200,
          // align: "center"
        },
        {
          label: "Created time",
          key: "createtime",
          // align: "center"
        },
        {
          label: "Operation",
          key: "operation"
        }
      ],
      data: [],
      data1: [],
      search: "",
      dialogVisible: false,
      tableData: [],
      form: {
        name: "",
        resource: "菜单",
        topname: "",
        departmentid: [],
        level: "",
        type:''
      },
      parent: "",
      current: "",
      options: [],
      departmentid: []
    };
  },
  computed: {
    treeData() {
     
      let cloneData = JSON.parse(JSON.stringify(this.data)); // 对源数据深度克隆
      return cloneData.filter(father => {
        let branchArr = cloneData.filter(
          child => father.objectId == child.ParentId
        ); //返回每一项的子级数组
        branchArr.length > 0 ? (father.children = branchArr) : "";
       //如果存在子级，则给父级添加一个children属性，并赋值
        return father.ParentId == 0; //返回第一层
      });
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
    this.getDepartment();
    // console.log(this.treeData)
  },
  methods: {
    standardName() {
      var Department = Parse.Object.extend("Department");
      var department = new Department();
      if (this.form.departmentid.length == 0) {
        department.set("ParentId", "0");
      } else {
        department.set(
          "ParentId",
          this.form.departmentid[this.form.departmentid.length - 1]
        );
      }
      department.set("name", this.form.name);
      department.set("org_type", this.form.type);
      department.set("leafnode", false);
      department.save().then(res => {
        this.$message({
          message: "新增成功",
          type: "success"
        });

        this.dialogVisible = false;
        this.getDepartment();
      });
    },
    reset() {
      ++this.key;
    },
    click(scope) {
      console.log(scope);
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
    //编辑dapartment
    handleEdit(row) {
      this.departmentid = row.objectId;
      var Department = Parse.Object.extend("Department");
      var department = new Parse.Query(Department);
      department.get(row.objectId).then(resultes => {
        // console.log(resultes);
        this.departmentEdit = true;
        this.departmentForm.name = resultes.attributes.name;
      });
    },
    handleDelete(row) {
      if (!row.children) {
        var Department = Parse.Object.extend("Department");
        var department = new Parse.Query(Department);
        department.get(row.objectId).then(resultes => {
          resultes.destroy().then(res => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getDepartment();
          });
        });
      } else {
        this.$message({
          type: "warning",
          message: "请先删除此菜单中的子部门!"
        });
      }
    },
    searchvalue() {},
    add() {
      this.dialogVisible = true;
    },
    handleClose() {
      this.dialogVisible = false;
    },

    getDepartment() {
      this.data = [];
      var Department = Parse.Object.extend("Department");
      var department = new Parse.Query(Department);
       department.equalTo('leafnode',false)
       department.limit(10000)
      department.find().then(resultes => {
        resultes.map(items => {
          var obj = {};
          items.createtime = utc2beijing(items.createdAt)
          obj.name = items.attributes.name,
          obj.ParentId = items.attributes.ParentId;
          obj.objectId = items.id;
          obj.level = items.attributes.level;
          obj.createtime = items.createtime;
          this.data.push(obj);
        });
      });
    },
    updatedepartment() {
      var Department = Parse.Object.extend("Department");
      var department = new Parse.Query(Department);
      department.get(this.departmentid).then(resultes => {
        resultes.set("name", this.departmentForm.name);
        resultes.save().then(res => {
          this.$message({
            type: "success",
            message: "更新成功"
          });
          this.departmentEdit = false;
          this.getDepartment();
        });
      });
    }
  }
};
</script>

<style scoped>
.department {
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
.department .search .el-input {
  width: 200px;
}
</style>

