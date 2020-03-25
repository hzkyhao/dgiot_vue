<template>
  <div class="rolescontrol">
    <div class="search">
      <el-input placeholder="请输入内容" v-model="search" style="width:200px" clearable></el-input>
      <el-button type="primary" icon="el-icon-search" style="margin-left:20px;" >{{$t('developer.search')}}</el-button>
      <el-button type="primary" icon="el-icon-plus" @click="addcontrol">{{$t('developer.add')}}</el-button>
    </div>
    <tree-table
      :key="key"
      :default-expand-all="defaultExpandAll"
      :data="treeData"
      :columns="columns"
      style="margin-top:20px;"
      row-key="objectId"
    >
      <template slot="scope" slot-scope="{scope}">
        <el-tag>{{scope.row.createtime}}</el-tag>
      </template>
      <template slot="operation" slot-scope="{scope}">
        <el-button size="mini" type="success" icon="el-icon-edit" @click="handleEdit(scope.row)">{{$t('developer.edit')}}</el-button>
        <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)" disabled>{{$t('developer.delete')}}</el-button>
      </template>
    </tree-table>
     <!--编辑权限弹窗-->
    <el-dialog :title="$t('developer.edit')" :visible.sync="roleEdit">
      <el-form :model="form">
        <el-form-item :label="$t('user.name')" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" style="width:300px;" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('user.Reamrks')" :label-width="formLabelWidth">
          <el-input v-model="form.alias" autocomplete="off" style="width:300px;"></el-input>
        </el-form-item>
        <el-form-item :label="$t('developer.describe')" :label-width="formLabelWidth">
          <el-input
            v-model="form.description"
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
import treeTable from "@/components/TreeTable";
import {getcontrol} from '@/api/getrole'
import Parse from 'parse'
import {utc2beijing} from '@/utils'
export default {
    components: { treeTable },
  data() {  
    return {
      formLabelWidth:'120px',
      roleEdit:false,
       form: {
        name: "",
        alias: "",
        description: ""
      },
      search: "",
      defaultExpandAll: false,
      key: 1,
      permissionid:'',
      columns: [
        {
          label: "Name",
          key: "alias",
          expand: true,
          align:'left',
        },
        {
          label: "Alias",
          key: "name",
          width: 200,
          align: "center"
        },
        {
          label: "Created time",
          key: "scope"
        },
        {
          label: "Operation",
          key: "operation"
        }
      ],
      data: []
    };
  },
  computed:{
    treeData(){
          let cloneData = JSON.parse(JSON.stringify(this.data))    // 对源数据深度克隆
          return cloneData.filter(father=>{               
            let branchArr = cloneData.filter(child=>father.objectId == child.parent)    //返回每一项的子级数组
            branchArr.length>0 ? father.children = branchArr : ''   //如果存在子级，则给父级添加一个children属性，并赋值
            return father.parent==0;      //返回第一层
          });
        },
  },
  mounted() {
      this.getcontrolrole()
  },
  methods: {
      handleEdit(row){
        this.permissionid = row.objectId
         var Permission = Parse.Object.extend('Permission')
          var permission = new Parse.Query(Permission)
          permission.get(row.objectId).then(resultes=>{
             this.form.name = resultes.attributes.name;
            this.form.description = resultes.attributes.description;
            this.form.alias = resultes.attributes.alias;
            
            this.roleEdit = true
          })
      },
      handleDelete(row){

      },
      addcontrol(){

      },
      getcontrolrole(){
        this.data=[]
        var Permission = Parse.Object.extend('Permission')
        var permission = new Parse.Query(Permission)
        permission.limit(1000)
        permission.find().then(res=>{
          res.map(items=>{
            var obj ={}
            obj.name = items.attributes.name
            obj.alias = items.attributes.alias
            obj.objectId = items.id
            obj.parent = items.attributes.parent.id
            obj.createtime = utc2beijing(items.attributes.createdAt)
            this.data.push(obj)
          })
        })
      },
      updaterole(){
          var Permission = Parse.Object.extend('Permission')
          var permission = new Parse.Query(Permission)
          permission.get(this.permissionid).then(resultes=>{
             resultes.set("alias", this.form.alias);
            resultes.set("description", this.form.description);
            resultes.save().then(res => {
              this.$message({
                type: "success",
                message: "更新成功"
              });
            });
            this.roleEdit = false;
             this.getcontrolrole()
          })
      }
  }
};
</script>
<style scoped>
.rolescontrol {
  width: 100%;
  min-height: 875px;
  padding: 20px;
  box-sizing: border-box;
  background: #ffffff;
}
</style>
