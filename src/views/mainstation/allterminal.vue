<template>
    <div class="test">
       <el-row :gutter="20">
        <!--第一个tree树-->
        <el-col :xs="24" :sm="24" :md="4" :lg="6" :xl="6">
            <el-tabs type="border-card" tab-position="left">
                    <el-tab-pane label="收藏">
                    </el-tab-pane>
                    <el-tab-pane label="主网">
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
                            default-expand-all
                            @node-click="handleNodeClick"
                        />
                    </el-tab-pane>
                    <!--用户试图-->
                    <el-tab-pane label="配网">
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
                    <el-tab-pane label="行业">定时任务补偿</el-tab-pane>
                    <el-tab-pane label="群组">定时任务补偿</el-tab-pane>
                    <el-tab-pane label="省遥测">定时任务补偿</el-tab-pane>
            </el-tabs>
        </el-col>  
        <!--第三个返回数据展示-->
         <el-col :xs="24" :sm="24" :md="20" :lg="18" :xl="18" style="min-height:875px;border-left:2px solid #156FAE;background:#f6fbff">
          <div style="width:100%;height:auto;padding:20px;box-sizing:border-box;">
            <div class="block_header" style="width:100%;height:50px;">
              <el-radio-group v-model="radio">
                <el-radio :label="3">日常综合数据召测</el-radio>
                <el-radio :label="6">抄表电表表号</el-radio>
                <el-radio :label="9">批量设置电表参数</el-radio>
              </el-radio-group>
            </div>
          <!--中间白色部分-->
            <div style="height:5px;width:100%;background:#ffffff">

            </div>
            <div class="blockcontent">
              <el-form :inline="true" :model="formInline" class="demo-form-inline">
                 <el-form-item label="数据类型:">
                  <el-select  placeholder="数据类型" v-model="formInline.user">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="起码表顺序:">
                  <el-input  placeholder="起码表顺序" v-model="formInline.user"></el-input>
                </el-form-item>
               <el-form-item label="连续数:">
                  <el-input  placeholder="连续数" type="number" v-model="formInline.user"></el-input>
                </el-form-item>
                <el-form-item label="开始日期:">
                    <el-date-picker type="date" placeholder="选择日期" style="width: 100%;" v-model="formInline.user"></el-date-picker>
                </el-form-item>
                <el-form-item label="结束日期:">
                   <el-date-picker
                    type="date"
                    placeholder="选择日期" v-model="formInline.user">
                  </el-date-picker>
                </el-form-item>
                 <el-form-item label="数据方向:">
                  <el-select  placeholder="数据方向" v-model="formInline.user">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
            <div class="blockfooter">
              <el-button type="primary">
                查询结果
              </el-button>
              <el-button type="primary">
                召测
              </el-button>
            </div>
          </div>
          <el-table :data="tableData1" stripe style="width: 100%" border 
            v-loading="loading"
            element-loading-text="正在处理,请稍等"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.5)"
           >
            <el-table-column label="用户编号"></el-table-column>
            <el-table-column label="用户名称"></el-table-column>
            <el-table-column label="表地址"></el-table-column>
            <el-table-column label="测量点号"></el-table-column>
            <el-table-column label="时间"></el-table-column>
            <el-table-column label="有用功(KWh)"></el-table-column>
            <el-table-column label="有功峰(KWli)"></el-table-column>
            <el-table-column label="有功平(KWh)"></el-table-column>
            <el-table-column label="有功谷(KWh)"></el-table-column>
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
        loading:true,
        formInline:{
          user:''
        },
          radio:3,
          data:[],
           defaultProps: {
            children: "children",
            label: "name"
        },
        tableData1:[],
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
      var Mainstation = Parse.Object.extend('MainStationIndex')
      var mainstation = new Parse.Query(Mainstation)
      // mainstation.ascending('localAt')
      mainstation.find().then(result=>{
        result.map(items=>{
          var obj={}
          items.createtime = new Date(items.attributes.createdAt).toLocaleDateString()
          obj.name = items.attributes.name,
          obj.ParentId = items.attributes.ParentId
          obj.objectId =items.id
          obj.leafnode = items.attributes.leafnode
          obj.createtime = items.createtime
          this.data.push(obj)
        })
         
      })
    },
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
.blockcontent{
  margin-top:20px;
}
.blockfooter{
  display:flex;
  justify-content: flex-end;
}
</style>
<style>
.test .el-tabs--left .el-tabs__item.is-left{
    width: 50px;
    white-space: pre-wrap;
    height: auto;
    border: 1px solid #cccccc;
    padding:20px;
}
.test .el-tabs--border-card>.el-tabs__header .el-tabs__item{
  color:white
}
.test .el-tabs--left.el-tabs--border-card .el-tabs__header.is-left{
  min-height:875px;
}
.test .el-tabs__header{
background:#156FAE;
}
.test .el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active{
  color:black!important
}
.test .el-tabs__content{
  height:875px;
  overflow-x:scroll;
  overflow-y:scroll;
}
.blockcontent .el-input__inner{
  width:120px;
}
.blockcontent .el-date-editor.el-input{
  width:120px;
}
</style>

