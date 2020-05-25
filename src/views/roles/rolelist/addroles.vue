<template>
  <div class="app-container">
    <h2>添加角色</h2>
    <div class="from">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item
          label="角色名"
          prop="name"
        >
          <el-input
            v-model="ruleForm.name"
            style="width:200px;"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="部门"
          prop="departmentid"
        >
          <el-cascader
            v-model="treeModu"
            placeholder="请选择部门"
            :props="treeprops"
            clearable
            :options="treeData"
            :show-all-levels="false"
            ref="cascaderAddr"
            @change="changeOption('tree')"
          ></el-cascader>
        </el-form-item>

        <el-form-item
          label="角色"
          prop="role"
        >
          <el-select
            v-model="Option.dictvalue"
            placeholder="请选择角色"
            style="width:200px;"
            :clearable="clearFlag"
          >
            <el-option
              v-for="(item,index) in Option.dictOption"
              :key="index"
              :value="item.key"
              change="changeOption('dict',item.name)"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="备注"
          prop="description"
        >
          <el-input
            placeholder="备注项为必填项"
            type="textarea"
            v-model="ruleForm.description"
            style="width:500px;"
          ></el-input>
        </el-form-item>
        <el-form-item class="el_btn">
          <el-form-item
            label="操作"
            prop="desc"
          >
          </el-form-item>
          <el-button
            type="warning"
            @click="resetFrom()"
          >重置</el-button>
          <el-button
            v-if="insert==0||insert==1"
            type="primary"
            style="margin:0 7%"
          >取消</el-button>
          <el-button
            v-if="insert==0||insert==1"
            type="success"
            @click="addroles()"
          >确定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { Parse } from "parse";
export default {
  computed: {
    treeData () {
      let cloneData = JSON.parse(JSON.stringify(this.data));
      return cloneData.filter(father => {
        let branchArr = cloneData.filter(
          child => father.objectId == child.ParentId
        );
        branchArr.length > 0 ? (father.children = branchArr) : "";
        return father.ParentId == 0;
        console.log(father, "104father.ParentId")
      });
    }
  },
  data () {
    return {
      treeModu: [],
      data: [],
      treeprops: {
        value: "name",
        label: "name"
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      originrole: [],
      needdelarr: [],
      parentrole: [],
      userid: "",
      roleId: "",
      insert: "",
      Option: {
        deptvalue: '',
        deptOption: [],
        dictvalue: '',
        dictOption: [],
        objectId: 0,
        ParentId: 0
      },
      clearFlag: true,
      ruleForm: {
        name: "",
        phoneNum: "",
        mail: "",
        department: "",
        duty: "",
        gender: "男",
        role: "",
        description: "",
        region: "",
        delivery: false,
        type: [],
        resource: "",
        data2: [],
        list: [],
        parentrole: "",
        defaultProps: {
          children: "children",
          label: "label"
        },
      },
      rules: {
        name: [
          { required: true, message: "请输入角色名", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" }
        ],
        description: [
          { required: true, message: "请输入权限描述", trigger: "blur" },
          { min: 3, message: "最少三个字符", trigger: "blur" }
        ],
        type: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个权限",
            trigger: "change"
          }
        ],
        roledetail: [
          { required: true, message: "请输入角色描述", trigger: "blur" }
        ]
      },
      orderresultes: [],
      parentid: '',
      roles: [],
    };
  },
  methods: {
    changeOption (key, val) {
      switch (key) {
        case 'tree':
          this.Option.deptvalue = this.$refs['cascaderAddr'].currentLabels[1];
          let fatheOptions = this.$refs['cascaderAddr'].options
          console.log(this.Option.deptvalue, fatheOptions)
          fatheOptions.forEach(val => {
            if (this.$refs['cascaderAddr'].currentLabels[0] === val.name)
              this.Option.objectId = val.children[0].objectId
            this.Option.ParentId = val.objectId
          })
          break;
        case 'dict':
          this.Option.dictvalue = val;
          break;
      }
    },
    //查询部门  角色
    searchAllOption () {
      this.$axiosWen.get('/classes/Dict', {
        params: {
          "where": {
            type: "roletemp"
          },
        }
      })
        .then(res => {
          this.Option.dictOption = res.results
        });
      this.$axiosWen.get("/classes/Department").then(res => {
        const results = res.results
        console.log(results)
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
          this.Option.deptOption = res.results
        } else {
          this.$message('部门列表获取失败')
          this.Option.deptOption = []
        }
      })
    },
    // 重置
    resetFrom () {
      this.ruleForm = {
        name: "",
        phoneNum: "",
        mail: "",
        department: "",
        duty: "",
        gender: "男",
        role: "",
        description: "",
        alias: "",
      },
        this.Option.deptvalue = ''
      this.Option.dictvalue = ''
      this.Option.objectId = 0
      this.Option.ParentId = 0
      this.data = []
      this.treeModu = []
      setTimeout(() => {
        this.searchAllOption()
      }, 1000);
    },
    diguiquchu (datas, arr, v, needdelarr) {
      // 递归找出半选中的数据
      arr.map(item => {
        if (item.key == v && item.children.length > 0) {
          // datas.splice(i, 1);//因为每次截取会改变原数组，所以不能这样
          needdelarr.push(v);
          this.diguiquchu(datas, item.children, v, needdelarr);
        } else if (item.key != v && item.children.length > 0) {
          this.diguiquchu(datas, item.children, v, needdelarr);
        }
      });
    },
    addroles () {
      let params = {
        "name": this.ruleForm.name,
        "desc": this.ruleForm.description,
        "depid": this.Option.objectId,
        "alias": this.Option.deptvalue,
        "parent": this.Option.ParentId,
        "tempname": this.Option.dictvalue
      }
      this.$axiosWen.post("/role", params).then(res => {
        console.log(res)
        this.$message({
          message: "新增成功",
          type: "success"
        });
        this.$router.push({
          path: "/roles/roles"
        });
      }).catch(error => {
        console.log(error)
      })
    },
    nodetree () {
      this.userid = Parse.User.current().id;
      var User = Parse.Object.extend("_User");
      var user = new Parse.Query(User);
      user.find(this.userid).then(resultes => {
        var Role = Parse.Object.extend("_Role");
        var query = new Parse.Query(Role);
        var user = new User();
        query.addAscending("createdAt");
        query.find().then(resultes => {
          user.set("objectId", this.userid);
          query.equalTo("users", user);
          query.find().then(result => {
            console.log(result);
            this.parentrole = result
          });
        });
      });
    },
    getdetail () {
      this.insert = this.$route.query.insert;
      console.log(this.insert);
      this.roleId = this.$route.query.roleId;
      console.log(this.insert, "insert");
    }
  },
  mounted () {
    // this.getMenu();
    // this.nodetree()
    this.searchAllOption()
  }
};
</script>
<style  scoped   lang="scss">
.from /deep/ .el-form-item {
  float: left;
}
.from /deep/ .el-form-item:last-child .el-form-item__content {
  margin-left: 0 !important;
}
// .from /deep/ .el-form-item:nth-child(7) .el-form-item__label {
//   width: 58px !important;
// }
// .from /deep/ .el-form-item:nth-child(7) .el-form-item__content {
//   margin-left: 60px !important;
// }
.app-container {
  width: 100%;
  min-height: 875px;
  padding: 20px;
  box-sizing: border-box;
  background: #ffffff;
  h2 {
    width: 200px;
    // background: DarkCyan;
    height: 40px;
    margin: 20px auto;
    line-height: 40px;
    cursor: pointer;
  }
  .from {
    width: 80%;
    margin: 0 auto;
    .el_btn {
      width: 500px;
      margin-left: 0;
    }
  }
}
</style>