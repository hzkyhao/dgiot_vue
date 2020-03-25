<template>
  <div class="user">
    <div class="search">
      <el-input placeholder="请输入内容" v-model="search" clearable></el-input>
      <el-button type="primary" icon="el-icon-search" style="margin-left:20px;">{{$t('developer.search')}}</el-button>
      <el-button
        type="primary"
        icon="el-icon-plus"
        style="margin-left:20px;"
        class="adduser"
        @click="adduser"
      >新增用户</el-button>
    </div>
    <div class="tableuser">
      <div class="tableroles" style="margin-top:20px">
        <el-table :data="tableData" style="width: 100%;text-align:center">
          <el-table-column :label="$t('user.username')" prop="username" align="center"></el-table-column>
          <el-table-column :label="$t('user.phonenumber')" prop="phone" align="center"></el-table-column>
          <el-table-column label="ID" prop="id" align="center">
            <template slot-scope="scope">
              <el-tag type="success">{{scope.row.id}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="$t('developer.operation')" align="center">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.row.id)">详情</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">{{$t('developer.delete')}}</el-button>
              <el-button size="mini" type="primary" @click="editorrole(scope.row.id)">分配角色</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
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
    <el-dialog title="分配角色" :visible.sync="roleacl" :close-on-click-modal="false">
      <el-table :data="rolelist" @selection-change="handleSelectionChange" ref="multipleTable">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="名称" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.attributes.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="描述" align="center">
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
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleacl = false">取 消</el-button>
        <el-button type="primary" @click="adduseracl">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { Parse } from "parse";
export default {
  data() {
    return {
      roleacl: false,
      rolelist: [],
      multipleSelection: [],
      search: "",
      tableData: [],
      pagesize: 10,
      total: 0,
      objectId: "",
      userrolelist: [],
      start:0,
    };
  },
  mounted() {
    this.getUserlist(this.pagesize,this.start);
  },
  methods: {
    getUserlist(pagesize,start) {
      this.tableData = [];
      var roles = Parse.Object.extend("_User");
      var query = new Parse.Query(roles);
      query.limit(pagesize);
      query.skip(start);
      query.count().then(count => {
        if (count) {
          this.total = count;
          query.find().then(results => {
            results.map(item => {
              var object = {
                id: item.id
              };
              Object.keys(item.attributes).forEach(function(key) {
                object[key] = item.attributes[key];
              });
              this.tableData.push(object);
            });
          },
          (error=>{
           console.log(error)
           if(error.code=='209'){
             this.$message({
            type: "warning",
            message: "登陆权限过期，请重新登录"
            });
            this.$router.push({
              path:'/login'
            })
           }
         }));
        }
      });
    },

    handleEdit(id) {
      this.$router.push({
        path: "/roles/edituser",
        query: { id: id }
      });
    },
    editorrole(id) {
      this.userrolelist = [];
      this.objectId = id;
      this.roleacl = true;
      var User = Parse.Object.extend("_User");
      var user = new Parse.Query(User);
      user.find(this.objectId).then(resultes => {
        var Role = Parse.Object.extend("_Role");
        var query = new Parse.Query(Role);
        var user = new User();
        query.addAscending("createdAt");
        query.find().then(resultes => {
          this.rolelist = resultes;
          user.set("objectId", this.objectId);
          query.equalTo("users", user);
          query.find().then(result => {
            console.log(result);
            result.map(item=>{
              resultes.map((roleitem,index)=>{
                if(item.id==roleitem.id){
                  this.$refs.multipleTable.toggleRowSelection(this.rolelist[index],true)
                }
              }) 
            })   
          });
        });
      });
    },
    adduseracl() {
      var roles = Parse.Object.extend("_Role");
      var query = new Parse.Query(roles);
      var User = Parse.Object.extend("_User");
      var user = new Parse.Query(User);
      user.get(this.objectId).then(object => {
        this.multipleSelection.map(item => {
          query.get(item).then(resultes => {
            var relation = resultes.relation("users");
            object.set("objectId", this.objectId);
            relation.add(object);
            resultes.save().then(resulte => {
              this.$message({
                type: "success",
                message: "添加成功!"
              });
              this.roleacl = false;
            });
          });
        });
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleDelete(id) {
      this.$confirm("此操作将永久删除此用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var User = Parse.Object.extend("_User");
          var user = new Parse.Query(User);
          user.get(id).then(object => {
            object.destroy().then(
              response => {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.getUserlist();
              },
              error => {
                console.log(error);
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
    handleSizeChange(val) {
      this.pagesize = val
      this.getUserlist(this.pagesize,this.start);  
    },
    handleCurrentChange(val) {
       this.start = Number(val - 1) * Number(this.pagesize);
       this.getUserlist(this.pagesize,this.start);
    },
    adduser() {
      this.$router.push({
        path: "/roles/adduser"
      });
    }
  }
};
</script>
<style scoped>
.user {
  width: 100%;
  min-height: 875px;
  padding: 20px;
  box-sizing: border-box;
  background: #ffffff;
}
</style>
<style>
.user .search .el-input {
  width: 200px;
}
</style>
