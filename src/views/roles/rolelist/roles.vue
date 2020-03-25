<template>
  <div class="roles">
    <div class="search">
      <el-input :placeholder="$t('user.name')" v-model="search" clearable></el-input>
      <el-button
        type="primary"
        icon="el-icon-search"
        style="margin-left:20px;"
        @click="searchvalue"
      >{{$t('developer.search')}}</el-button>
      <el-button type="primary" icon="el-icon-plus" @click="add">{{$t('developer.add')}}</el-button>
    </div>
    <div class="tableroles" style="margin-top:20px">
      <el-table
        :data="tableData"
        style="width: 100%;text-align:center"
        @row-click="getDetailmenu"
        highlight-current-row
      >
        <el-table-column :label="$t('user.name')" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.attributes.name}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('developer.describe')" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.attributes.desc}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('user.Remarks')" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.attributes.alias}}</span>
          </template>
        </el-table-column>
        <el-table-column label="ID" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('developer.operation')" align="center">
          <template slot-scope="scope">
            <!-- <el-button size="mini" type="primary" @click="handleEdit(scope.row)">分配权限</el-button> -->
            <!-- <el-button size="mini" type="success" @click="addmenu(scope.row)">分配菜单</el-button> -->
            <!-- <el-button size="mini" type="primary" >增加用户</el-button> -->
            <el-button
              size="mini"
              type="success"
              icon="el-icon-edit"
              @click="handleEditrole(scope.row)"
            >{{$t('developer.edit')}}</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
            >{{$t('developer.delete')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <div class="block" style="margin-top:20px;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[1,5,10]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <el-dialog :title="$t('developer.add')" :visible.sync="centerDialogVisible" width="50%">
      <el-table
        :data="tableDataroles"
        style="width: 100%;text-align:center"
        @selection-change="handleSelectionChange"
        ref="multipleTable"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column :label="$t('user.name')" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.attributes.name}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('user.Remarks')" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.attributes.desc}}</span>
          </template>
        </el-table-column>
        <el-table-column label="ID" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible=false">{{$t('developer.cancel')}}</el-button>
        <el-button type="primary" @click="addacl">{{$t('developer.determine')}}</el-button>
      </span>
    </el-dialog>
    <!--菜单-->
    <div class="rolefooter">
      <div class="footerleft">
        <p class="top">
         <span class="svg-container">
          <svg-icon icon-class="role_group" />
         </span> <span>{{$t('user.assignroles1')}}</span>
          <el-button
            type="primary"
            icon="el-icon-success"
            :disabled="rolecontrol"
            @click="controlroles"
          >{{$t('product.preservation')}}</el-button>
        </p>
        <div class="rolecontrol">
          <el-tree
            :data="treeData"
            show-checkbox
            node-key="objectId"
            defaultProps
            ref="tree1"
            accordion
            :default-checked-keys="rolecontroldata"
            :expand-on-click-node="false"
          >
            <span class="custom-tree-node" slot-scope="{ node }">
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
           <span>{{$t('user.assignmenu')}}</span>
          <el-button
            type="primary"
            icon="el-icon-success"
            @click="getCheckedKeys"
            :disabled="rolecontrol"
          >{{$t('product.preservation')}}</el-button>
        </p>
        <div class="menucontrol" style="margin-top:30px;">
          <el-tree
            :data="menudata"
            show-checkbox
            node-key="objectId"
            defaultProps
            ref="tree"
            accordion
            :default-checked-keys="rolemenu"
            :expand-on-click-node="false"
          >
            <span class="custom-tree-node" slot-scope="{ node }">
              <span>{{ node.label }}</span>
            </span>
          </el-tree>
        </div>
      </div>
    </div>
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
        <el-button @click="roleEdit = false">{{$t('developer.cancel')}}</el-button>
        <el-button type="primary" @click="updaterole">{{$t('developer.determine')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { page,UpdatedMenu,UpdatedRole } from "@/api/login";
import { Parse } from "parse";
export default {
  data() {
    return {
      formLabelWidth: "120px",
      roleEdit: false,
      form: {
        name: "",
        alias: "",
        desc: ""
      },
      data:[],
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
      editroleid: ""
    };
  },
  computed: {
    treeData() {
      let cloneData = JSON.parse(JSON.stringify(this.data1)); // 对源数据深度克隆
      return cloneData.filter(father => {
        let branchArr = cloneData.filter(
          child => father.objectId == child.parent
        ); //返回每一项的子级数组
        branchArr.length > 0 ? (father.children = branchArr) : ""; //如果存在子级，则给父级添加一个children属性，并赋值
        return father.parent == 0; //返回第一层
      });
    },
    menudata(){
      let cloneData = JSON.parse(JSON.stringify(this.data)); // 对源数据深度克隆
      return cloneData.filter(father => {
        let branchArr = cloneData.filter(
          child => father.objectId == child.parent
        ); //返回每一项的子级数组
        branchArr.length > 0 ? (father.children = branchArr) : ""; //如果存在子级，则给父级添加一个children属性，并赋值
        return father.parent == 0; //返回第一层
      });
    }
  },
  mounted() {
    this.gettable(this.pagesize, this.start);
    this.getMenu();
    this.getRoleschema();
  },

  methods: {
    getMenu(){
        this.data=[]
         var Menu = Parse.Object.extend("Menu");
         var menu = new Parse.Query(Menu)
         menu.find().then(resultes=>{
            resultes.map(items=>{
            var obj ={}
            obj.label = items.attributes.name 
            obj.objectId = items.id
            obj.parent = items.attributes.parent.id
            obj.createtime = new Date(items.attributes.createdAt).toLocaleDateString()
            this.data.push(obj)
            }) 
         },
         (error=>{
           if(error.code=='209'){
             this.$message({
            type: "warning",
            message: "登陆权限过期，请重新登录"
            });
            this.$router.push({
              path:'/login'
            })
           }
         }))
          
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
            this.gettable(this.pagesize, this.start);
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
      var roles = Parse.Object.extend("_Role");
      var query = new Parse.Query(roles);
      query.get(row).then(object => {
        object.destroy().then(
          response => {
            this.gettable(this.pagesize, this.start);
          },
          error => {
            console.error("Error while deleting User", error);
          }
        );
      });
    },
    //增加菜单
    addmenu(row) {
      // console.log(row)
      this.rolename = row.attributes.name;

      // this.dialogVisible = true;
      this.getMenu();
    },
    getDetailmenu(row) {
      this.rolecontrol = false;
      this.rolemenuname = row.attributes.name;
      this.rolemenu = [];
      this.roleobjectid = row.id;
      this.rolecontroldata = [];
      var Menu = Parse.Object.extend("Menu");
      var menu = new Parse.Query(Menu);
      menu.ascending('createdAt')
      menu.find().then(resultes => {
        // this.getMenu();
        resultes.map(items => {
          if(items.attributes.parentId!=0){
          
             if (items.attributes.ACL.permissionsById['role:'+this.rolemenuname]) {
               
              this.rolemenu.push(items.id);
          }
        }
          // console.log(items.attributes.ACL.permissionsById)
         
        });
        this.$refs.tree.setCheckedKeys(this.rolemenu);
      });
      var Permission = Parse.Object.extend("Permission");
      var permission = new Parse.Query(Permission);
      permission.ascending('createdAt')
      permission.limit(1000)
      permission.find().then(resultes => {
        var _this = this
        resultes.map(items => {
          // if(items.attributes.ACL.permissionsById['role:'+_this.rolemenuname]){
          //   // console.log(items)
          // }
          if(items.attributes.parent.id!=0&&items.attributes.ACL.permissionsById['role:'+_this.rolemenuname]){
            // console.log(items.attributes.parent.id)
              // if () {
              _this.rolecontroldata.push(items.id);
          // } 
        }
          _this.$refs.tree1.setCheckedKeys(_this.rolecontroldata);
        });
      });
    },
    getCheckedKeys() {
     
      // var Menu = Parse.Object.extend("Menu");
      // var menu = new Parse.Query(Menu);
      // this.$refs.tree.getCheckedKeys().map(items => {
      //   let acl = new Parse.ACL();
      //   setTimeout(() => {
      //     menu.get(items).then(resultes => {
      //       var query = resultes.relation("roles");
      //       acl.setRoleReadAccess(this.rolemenuname, true);
      //       acl.setRoleWriteAccess(this.rolemenuname, true);
      //       resultes.set("ACL", acl);
      //       resultes.save().then(res => {});
      //     });
      //   });
      // }, 100);
     
     var checkmenu = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys())
        UpdatedMenu(this.rolemenuname,checkmenu).then(resultes=>{
          if(resultes){
             this.$message({
              type: "success",
              message: "添加成功!"
            });
          }
           
        })
    

      // this.getMenu()
    },
    //权限分配
    controlroles() {
      var checkrole= this.$refs.tree1.getCheckedKeys().concat(this.$refs.tree1.getHalfCheckedKeys())
      UpdatedRole(this.rolemenuname,checkrole).then(resultes=>{
        if(resultes){
           this.$message({
              type: "success",
              message: "添加成功!"
            });
        }
          
      })  
      // var roles = Parse.Object.extend("_Role");
      // var query = new Parse.Query(roles);
      // var Permission = Parse.Object.extend("Permission");
      // var permission = new Permission();
      // query.get(this.roleobjectid).then(resultes => {
      //   var relation = resultes.relation("rules");
      //   arr.map(item => {
      //     permission.set("objectId", item);
      //     relation.add(permission);
      //   });
      //   resultes.save().then(res => {
      //     this.$message({
      //       type: "success",
      //       message: "添加成功!"
      //     });
      //   });
      // });
    },
    //初始化权限列表
    gettable(pagesize, start) {
      this.tableData = [];
      var roles = Parse.Object.extend("_Role");
      var query = new Parse.Query(roles);
      query.limit(pagesize);
      query.skip(start);
      query.count().then(count => {
        if (count) {
          this.total = count;
        }
        query.find().then(
          res => {
            this.tableData = res;
          },
          error => {
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
      this.gettable(this.pagesize, this.start);
    },
    handleCurrentChange(val) {
      this.start = Number(val - 1) * Number(this.pagesize);
      this.gettable(this.pagesize, this.start);
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
    getRoleschema() {
      var Permission = Parse.Object.extend("Permission");
      var permission = new Parse.Query(Permission);
      permission.limit(1000);
      permission.find().then(res => {
        res.map(items => {
          var obj = {};
          obj.label = items.attributes.alias;
          obj.alias = items.attributes.name;
          obj.objectId = items.id;
          obj.parent = items.attributes.parent.id;
          obj.createtime = new Date(
            items.attributes.createdAt
          ).toLocaleDateString();
          this.data1.push(obj);
        });
        // console.log(this.treeData)
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
        this.gettable(this.pagesize, this.start);
      });
    }
  }
};
</script>
<style scoped>
.roles {
  width: 100%;
  min-height: 875px;
  padding: 20px;
  box-sizing: border-box;
  background: #ffffff;
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
<style >
.roles .search .el-input {
  width: 200px;
}
</style>
