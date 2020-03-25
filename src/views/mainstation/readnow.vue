<template>
    <div class="test">
       <el-row :gutter="20">
        <!--第一个tree树-->
        <el-col :xs="24" :sm="24" :md="4" :lg="6" :xl="6">
            <el-tabs type="border-card" tab-position="left">
                    <el-tab-pane label="供电区域">
                    </el-tab-pane>
                    <el-tab-pane label="行政区域">
                         <el-input
                            v-model="searchvalue"
                            clearable
                            placeholder="输入关键字搜索"
                            style="width: 200px;"
                            class="filter-item"
                            />
                         <el-tree
                            :data="treeData"
                            :props="defaultProps"
                            :expand-on-click-node="false"
                            :highlight-current="true"
                            @node-click="handleNodeClick"
                        />
                    </el-tab-pane>
                    <!--用户试图-->
                    <el-tab-pane label="用户试图">
                        <el-form ref="form" :model="userForm" label-width="100px" style="border-bottom:1px solid #cccccc">
                        <el-form-item label="用户类型：">
                            <el-select v-model="userForm.usertype" placeholder="请选择用户类型">
                            <el-option label="公变" value="shanghai"></el-option>
                            <el-option label="专变" value="beijing"></el-option>
                            </el-select>
                        </el-form-item>
                         <el-form-item label="查询类型：">
                            <el-select v-model="userForm.searchtype" placeholder="请选择查询类型">
                            <el-option label="用户" value="shanghai"></el-option>
                            </el-select>
                        </el-form-item>
                       <el-form-item label="户号：">
                            <el-input type="text" v-model="userForm.userhh" style="width:200px"></el-input>
                        </el-form-item>
                        <el-form-item label="户名：">
                            <el-input type="text" v-model="userForm.username" style="width:200px"></el-input>
                        </el-form-item>
                     <el-form-item label="终端局号：">
                        <el-input type="text" v-model="userForm.zdjh" style="width:200px"></el-input>
                     </el-form-item>
                     <el-form-item label="逻辑地址：" >
                        <el-input type="number" v-model="userForm.ljdz" style="width:200px"></el-input>
                        
                    </el-form-item>
                            <el-form-item size="large">
                                <el-button type="primary">查 询</el-button>
                                <el-button type="primary">高 级</el-button>
                        </el-form-item>
                      </el-form>
                    </el-tab-pane>
                    <!--终端试图-->
                    <el-tab-pane label="终端试图">
                       <el-input
                            v-model="searchvalue"
                            clearable
                            placeholder="输入关键字搜索"
                            style="width: 200px;"
                            class="filter-item"
                            />
                         <el-tree
                            :data="treeData"
                            :props="defaultProps"
                            :expand-on-click-node="false"
                            :highlight-current="true"
                            @node-click="handleNodeClick"
                        />
                    </el-tab-pane>
            </el-tabs>
        </el-col>  
        <!--第三个返回数据展示-->
         <el-col :xs="24" :sm="24" :md="20" :lg="18" :xl="18">
          <div style="width:100%;height:auto;padding:20px;box-sizing:border-box;display:flex">
              <div style="width:50%;">
                 <el-form ref="form" :model="form" label-width="120px" >
                    <el-form-item label="终端逻辑地址：">
                    <el-input type="text" v-model="form.vcaddr" style="width:200px"></el-input>
                    </el-form-item>
                    <el-form-item label="测量点号：" >
                    <el-input type="number" v-model="form.pn" style="width:200px"></el-input>
                    </el-form-item>
                    <el-form-item label="数据类型：">
                    <el-select v-model="form.region" placeholder="请选择参数类型">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                    </el-form-item>
                     <el-form-item label="数据子项：">
                    <el-select v-model="form.region" placeholder="请选择参数类型">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                     </el-form-item>
                    <el-form-item>
                    <el-button type="primary" >下 发</el-button>
                    <el-button type="primary">召 读</el-button>
                    </el-form-item>
                </el-form>
              </div>
              <!--点击的数据key-value展示-->
              <div style="width:50%;border:1px solid #cccccc">
              <el-table :data="tableData2" stripe style="width: 100%" border  >
                <el-table-column label="Key"></el-table-column>
                <el-table-column label="Value"></el-table-column>
              </el-table>
              </div>
          </div>
          <el-table :data="tableData1" stripe style="width: 100%" border  >
            <el-table-column label="DI"></el-table-column>
            <el-table-column label="设备编号"></el-table-column>
            <el-table-column label="当前状态"></el-table-column>
            <el-table-column label="ss">
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
</template>
<script>
import Parse from 'parse'
export default {
   data() {
      return {
          data:[],
           defaultProps: {
            children: "children",
            label: "name"
        },
        tableData1:[],
        tableData2:[],
        searchvalue:'',
        departmentid:'',
        form:{
            region:'',
            pn:1,
            vcaddr:''
        },
        userForm:{
           usertype:'',
           searchtype:'',
           userhh:'',
           username:'',
           zdjh:'',
           ljdz:''
        }
      }
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
       this.getMainstation()
   },
   methods: {
       handleNodeClick(row){

       },
      getMainstation(){
       this.data=[]
      var Department = Parse.Object.extend("Department");
      var department = new Parse.Query(Department);
      // var departmentid=[]
      department
        .find()
        .then(
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
        )}
   }
}
</script>
<style scoped>
.test {
  width: 100%;
  min-height: 875px;
   margin-top:20px;
  box-sizing: border-box;
  background: #ffffff;
}
</style>
<style>
.test .el-tabs--left .el-tabs__item.is-left{
    width: 50px;
    white-space: pre-wrap;
    height: auto;
    border: 1px solid #cccccc;
}
</style>

