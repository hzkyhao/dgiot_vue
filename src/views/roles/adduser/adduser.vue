<template>
  <div class="edituser">
    <div class="admin" style="margin-bottom:20px">新增用户</div>
    <el-form
      :model="ruleForm2"
      status-icon
      :rules="rules2"
      ref="ruleForm2"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="账号" prop="account">
        <el-input v-model="ruleForm2.account" placeholder="请输入账号" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model.number="ruleForm2.phone"
          placeholder="请输入手机号"
          :maxlength="11"
          auto-complete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="ruleForm2.email" placeholder="请输入邮箱" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="username">
        <el-input
          v-model="ruleForm2.username"
          placeholder="2-5个文字"
          :maxlength="5"
          auto-complete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          type="password"
          v-model="ruleForm2.password"
          auto-complete="off"
          placeholder="请输入6-10位数字字母组合"
          :maxlength="10"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input
          type="password"
          v-model="ruleForm2.checkPass"
          auto-complete="off"
          placeholder="请再次输入密码"
          :maxlength="10"
        ></el-input>
      </el-form-item>
      <el-form-item label="部门选择">
        <el-cascader
          style="width:600px"
          placeholder="请选择部门"
          v-model="ruleForm2.departmentid"
          :props="treeprops"
          :options="treeData"
          auto-complete="off"
          :show-all-levels="false"
          change-on-select
        ></el-cascader>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm2')">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { Parse } from "parse";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (!/^\w{6,10}$/.test(value)) {
          callback(new Error("密码格式不正确"));
        }
        callback();
      }
    };
    var validatecheckPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm2.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      data: [],
      treeprops: {
        value: "objectId",
        label: "name"
      },
      nowuserid: "",
      ruleForm2: {
        account: "",
        phone: "",
        username: "",
        password: "",
        email: "",
        checkPass: "",
        departmentid: []
      },
      id: "",
      rules2: {
        account: [
          { required: true, message: "请输入账号", trigger: "blur" },
        ],
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
        username: [
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
      }
    };
  },
  computed: {
    treeData() {
      let cloneData = JSON.parse(JSON.stringify(this.data)); // 对源数据深度克隆
      return cloneData.filter(father => {
        let branchArr = cloneData.filter(
          child => father.objectId == child.ParentId
        ); //返回每一项的子级数组
        branchArr.length > 0 ? (father.children = branchArr) : ""; //如果存在子级，则给父级添加一个children属性，并赋值
        return father.ParentId == 0; //返回第一层
      });
    }
  },
  mounted() {
    this.getDepartment();
    this.nowuserid = Parse.User.current().id;
    console.log(this.$store.state.user.roles)
  },
  methods: {
    submitForm(formName) {
      console.log(this.ruleForm2.departmentid);
      this.$refs[formName].validate(valid => {
        if (valid) {
          var User = Parse.Object.extend("_User");
          var user = new User();
          if (this.ruleForm2.departmentid.length == 0) {
          } else {
            //   var pointer = user.pointer('department')
            //  pointer.set('objectId',this.ruleForm2.departmentid[this.ruleForm2.departmentid.length-1])
            //  user.add(pointer)
            var Department = Parse.Object.extend("Department");
            var department = new Department();
            department.set(
              "objectId",
              this.ruleForm2.departmentid[
                this.ruleForm2.departmentid.length - 1
              ]
            );
            user.set("department", department);
          }
          user.set("username", this.ruleForm2.account);
          user.set("nick", this.ruleForm2.username);
          user.set("password", this.ruleForm2.password);
          user.set("phone", this.ruleForm2.phone.toString());
          user.set("email", this.ruleForm2.email);
          var acl = new Parse.ACL()
          // this.$store.state.user.roles.map(item=>{
          //   acl.setRoleReadAccess(item.name,true)
          //   acl.setRoleWriteAccess(item.name,true)
          // })
          acl.setReadAccess(this.nowuserid, true);
          acl.setWriteAccess(this.nowuserid, true);
          user.set("ACL", acl);
          user.save().then(
            resultes => {
              this.$message({
                message: "新增成功",
                type: "success"
              });
              this.$router.push({
                path: "/roles/structure"
              });
            },
            error => {
              this.$message({
                type: "error",
                message: error.message
              });
            }
          );
        } else {
          this.$message({
            message: "信息错误",
            type: "danger"
          });
          return false;
        }
      });
    },
    getDepartment() {
      var Department = Parse.Object.extend("Department");
      var department = new Parse.Query(Department);
      department.limit(10000)
      department.find().then(
        resultes => {
          resultes.map(items => {
            var obj = {};
            items.createtime = new Date(
              items.attributes.createdAt
            ).toLocaleDateString();
            (obj.name = items.attributes.name),
              (obj.ParentId = items.attributes.ParentId);
            obj.objectId = items.id;
            obj.level = items.attributes.level;
            obj.createtime = items.createtime;
            this.data.push(obj);
          });
        },
        error => {
          this.$message({
            type: "error",
            message: error.error
          });
        }
      );
    }
  }
};
</script>
<style scoped>
.edituser {
  width: 100%;
  min-height: 875px;
  padding: 20px;
  box-sizing: border-box;
  background: #ffffff;
}
.admin {
  font-size: 24px;
  margin: 20px 0 10px 20px;
}
.admin .des {
  padding-left: 5px;
  font-size: 15px;
  color: #777;
}
.goodslist {
  margin-left: 20px;
  margin-bottom: 10px;
}
.el-input {
  width: 600px;
}
.el-form {
  margin-left: 20px;
}
</style>