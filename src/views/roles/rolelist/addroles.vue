
<template>
  <div class="app-container">
    <h2
      style="width:200px;background:DarkCyan;height:40px;text-align:center;line-height:40px;cursor:pointer"
    >添加角色</h2>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <!-- <el-form-item label="父级角色" prop="parentrole">
        <el-select v-model="ruleForm.parentrole" placeholder="选择父级角色" style="width:300px;" @change="standardName()">
           <el-option v-for="item, in " :label="item" ></el-option> 
          <el-option
                  v-for="item in parentrole"
                  :key="item.id"
                  :label="item.attributes.alias"
                  :value="item.id"
               ></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="角色名" prop="name">
        <el-input v-model="ruleForm.name" style="width:300px;"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="description">
        <el-input v-model="ruleForm.description" style="width:300px;"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="desc">
        <el-input type="textarea" v-model="ruleForm.desc" style="width:300px;"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button v-if="insert==0||insert==1" type="primary" style="margin-right:10%">取消</el-button>
        <el-button v-if="insert==0||insert==1" type="success" @click="addroles()">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { Parse } from "parse";
export default {
  data() {
    return {
      originrole:[],
      rules1: [],
      needdelarr: [],
      parentrole: [],
      userid: "",
      roleId: "",
      insert: "",
      ruleForm: {
        name: "",
        description: "",
        region: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
        data2: [],
        list: [],
        parentrole: "",
        defaultProps: {
          children: "children",
          label: "label"
        },
        rules1: []
      },
      rules: {
        name: [
          { required: true, message: "请输入角色名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        description: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          { min: 3, message: "最少三个字符", trigger: "blur" }
        ],
        parentrole: [
            { required: true, message: '请选择父级角色', trigger: 'change' }
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
      parentid:'',
      roles:[],
      
    };
  },
  methods: {
    diguiquchu(datas, arr, v, needdelarr) {
      // 递归找出半选中的数据
      arr.map(item => {
        console.log(item.key, v, "----------");
        if (item.key == v && item.children.length > 0) {
          // datas.splice(i, 1);//因为每次截取会改变原数组，所以不能这样
          needdelarr.push(v);
          this.diguiquchu(datas, item.children, v, needdelarr);
        } else if (item.key != v && item.children.length > 0) {
          this.diguiquchu(datas, item.children, v, needdelarr);
        }
      });
    },
    addroles() {
      var userid = Parse.User.current().id
      this.insert = this.$route.query.insert;
      var Roles = Parse.Object.extend("_Role");
      var role = new Roles();
      var acl2 = new Parse.ACL();
       var query = new Parse.Query(Roles);
      acl2.setRoleReadAccess(this.ruleForm.name,true);
      acl2.setRoleWriteAccess(this.ruleForm.name,true);
      acl2.setRoleReadAccess('root',true);
      acl2.setRoleWriteAccess('root',true);
      acl2.setRoleReadAccess('admin',true);
      acl2.setRoleWriteAccess('admin',true);
      acl2.setReadAccess(userid,true);
      acl2.setWriteAccess(userid,true);
      role.set("ACL", acl2);
      role.set("name", this.ruleForm.name);
      role.set("desc", this.ruleForm.desc);
      role.set("alias", this.ruleForm.description);
      role.save().then(res => {
        this.selfid = res.id
        this.originrole.push(res)
          this.$message({
            message: "新增成功",
            type: "success"
          });
          this.$router.push({
            path: "/roles/roles"
          });
        },
        error => {
          console.log(error);
        }
      );
      // var _this=this
      //  setTimeout(() => {
      //       query.get(_this.selfid).then(object=>{
      //     console.log(object)
      //   //   this.originrole.map(item=>{
      //   //   query.get(item.id).then(resultes => {
      //   //     var relation = resultes.relation("roles");
      //   //     object.set("objectId", item.id);
      //   //     relation.add(object);
      //   //     resultes.save().then(resulte => {
      //   //       this.$message({
      //   //         type: "success",
      //   //         message: "添加成功!"
      //   //       });
      //   //       // this.roleacl = false;
      //   //     });
      //   //   });
      //   // })
      //   })
      //   }, 1000);
    },
    // getMenu() {
    //   var Menu = Parse.Object.extend("Menu");
    //   var menu = new Parse.Query(Menu);
    //   menu.find().then(resultes => {
    //     this.data = [];
    //     this.orderresultes = resultes;
    //     resultes.map(item => {
    //       //  console.log(item)
    //       if (item.attributes.parentId == 0) {
    //         this.ruleForm.data2.push({
    //           id: item.attributes.orderBy,
    //           label: item.attributes.name,
    //           parentId: item.attributes.parentId,
    //           objectId: item.id,
    //           children: []
    //         });
    //       }
    //     });
    //     //  console.log(this.data)
    //     this.Menus();
    //   });
    // },
    // Menus() {
    //   // console.log(this.orderresultes)
    //   this.orderresultes.map(children => {
    //     this.ruleForm.data2.map(item => {
    //       if (children.attributes.parentId == item.objectId) {
    //         item.children.push({
    //           id: children.attributes.orderBy,
    //           label: children.attributes.name,
    //           parentId: children.attributes.parentId,
    //           objectId: children.id
    //         });
    //       }
    //     });
    //   });
    //   // console.log(this.data)
    // },
 
    nodetree() {
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
    getdetail() {
      this.insert = this.$route.query.insert;
      console.log(this.insert);
      this.roleId = this.$route.query.roleId;
      console.log(this.insert, "insert");
    }
  },
  mounted() {
    // this.getMenu();
    // this.nodetree()
  }
};
</script>
<style  scoped>
.app-container {
  width: 100%;
  min-height: 875px;
  padding: 20px;
  box-sizing: border-box;
  background: #ffffff;
}
</style>