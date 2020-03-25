<template>
  <div class="edituser">
    <div class="admin" style="margin-bottom:20px">编辑用户</div>
    <el-form
      :model="ruleForm2"
      status-icon
      ref="ruleForm2"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="账号" prop="account">
        <el-input v-model="ruleForm2.account" placeholder="请输入账号"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model.number="ruleForm2.phone" placeholder="请输入手机号" :maxlength="11"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="ruleForm2.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="username">
        <el-input v-model="ruleForm2.username" placeholder="2-5个文字" :maxlength="5"></el-input>
      </el-form-item>
       <el-form-item label="密码" prop="password">
        <el-input v-model="ruleForm2.password" :maxlength="5"></el-input>
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
        <el-button type="primary" @click="editoruser(ruleForm2)">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import{ Parse } from 'parse'
export default {
  data() {
    return {
      data:[],
       treeprops:{
        value:'objectId',
        label:'name'
      },
      ruleForm2: {
        account: "",
        phone: "",
        username: "",
        password: "",
        email: "",
        checkPass: "",
        departmentid:[],
        password:''
      },
      id: "",
       treeprops:{
        value:'objectId',
        label:'name'
      },
    };
  },
  computed:{
        treeData(){
          let cloneData = JSON.parse(JSON.stringify(this.data))    // 对源数据深度克隆
          return cloneData.filter(father=>{               
            let branchArr = cloneData.filter(child=>father.objectId == child.ParentId)    //返回每一项的子级数组
            branchArr.length>0 ? father.children = branchArr : ''   //如果存在子级，则给父级添加一个children属性，并赋值
            return father.ParentId==0;      //返回第一层
          });
        },
  },
  mounted() {
        this.editUser()
        
  },
  methods: {
      editUser(){
        var userid = this.$route.query.id
        var  User = new Parse.User()
        var  user= new Parse.Query(User);
        user.get(userid).then(resultes=>{
          this.ruleForm2.username = resultes.attributes.nick
          this.ruleForm2.phone = resultes.attributes.phone
          this.ruleForm2.account = resultes.attributes.username
          this.ruleForm2.email = resultes.attributes.email
          this.ruleForm2.password = resultes.attributes.password
          // this.ruleForm2.departmentid.push(resultes.attributes.department.id)
          this.getDepartment()
        })
        
      },
    editoruser(formName) {
          var User = new Parse.User();
          var user= new Parse.Query(User);
          user.get(this.$route.query.id).then(res=>{
            if(this.ruleForm2.departmentid.length==0){
            }else{
            var Department = Parse.Object.extend("Department");
            var department = new Department();
            department.set('objectId',this.ruleForm2.departmentid[this.ruleForm2.departmentid.length-1])
            res.set('department',department)
            }
          res.set("username", this.ruleForm2.account);
          res.set("nick", this.ruleForm2.username);
          res.set("phone", this.ruleForm2.phone);
          res.set("email", this.ruleForm2.email);
          if(this.ruleForm2.password!=''){
             res.set("password", this.ruleForm2.password);
          }
          res.save().then(resultes => {
              this.$message({
                message: "更改成功",
                type: "success"
              });
              this.$router.push({
                  path:'/roles/structure'
              })
            })
            .catch(error=>{
              this.$message({
                type:'error',
                message:error.message
              })
            });
          })
          
    },
    getDepartment() {
      var Department = Parse.Object.extend("Department");
      var department = new Parse.Query(Department);
      department.limit(10000)
      department.find().then(resultes => {
        
        resultes.map(items=>{
          var obj={}
          items.createtime = new Date(items.attributes.createdAt).toLocaleDateString()
          obj.name = items.attributes.name,
          obj.ParentId = items.attributes.ParentId
          obj.objectId =items.id
          obj.level = items.attributes.level
          obj.createtime = items.createtime
          this.data.push(obj)
        })
      });
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