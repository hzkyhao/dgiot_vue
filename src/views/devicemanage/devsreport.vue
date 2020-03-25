<template>
    <div class="devsreport">
        <div class="devsreporttop">
            <label for="">采集器：</label>
            <el-input v-model="devsreport" placeholder="请输入采集器地址"></el-input>
            <el-button type="primary" style="margin-left:20px;" @click="information(0)">查询</el-button>
        </div>
        <div class="devsreportsection">
            <template>
                <el-table
                    ref="multipleTable"
                    :data="tableData3"
                    tooltip-effect="dark"
                    style="width:100%;text-align:center"
                    @selection-change="handleSelectionChange"
                    v-loading="loading">
                    <el-table-column
                    label="状态"
                    align="center"
                    show-overflow-tooltip>
                     <template slot-scope="scope">
                        <div v-if="scope.row.attributes.isEnable==true" style="width:10px;height:10px;border-radius:50%;display:inline-block;background:#00cc33;margin-right:10px"></div><span v-if="scope.row.attributes.isEnable==true" style="color:#00cc33">运行中</span>
                        <div v-if="scope.row.attributes.isEnable==false" style="width:10px;height:10px;border-radius:50%;display:inline-block;background:#f00;margin-right:10px"></div><span v-if="scope.row.attributes.isEnable==false" style="color:#f00">未运行</span>
                    </template>
                    </el-table-column>
                    <el-table-column
                    label="DevEUI"
                    align="center"
                    >
                    <template slot-scope="scope">
                       <span>{{scope.row.attributes.devaddr}}</span>
                    </template>
                    </el-table-column>
                    <el-table-column
                    label="AppEUI"
                    align="center"
                    >
                    <template slot-scope="scope">
                       <span>{{scope.row.attributes.basedata.appeui}}</span>
                    </template>
                    </el-table-column>
                    
                    <el-table-column
                  
                    label="采集器地址"
                    align="center"
                    show-overflow-tooltip>
                        <template slot-scope="scope">
                           <span>{{scope.row.attributes.devaddr}}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </div>
        <div class="block" style="margin-top:30px;">
            <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[10, 25, 50, 100]"
            :page-size="length"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            >
            </el-pagination>
        </div>
    </div>
</template>
<script>
import Parse from 'parse'
export default {
   data() {
      return {
          start:0,
          length:10,
          total:0,
          draw:1,
          devsreport:'',
          tableData3: [],
          multipleSelection: [],
          loading:true
      }
   },
   mounted(){
       this.information(1)
   },
   methods:{
       handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleSizeChange(val) {
        this.length=val
        this.information(1)
       
      },
      handleCurrentChange(val) {
        this.start=(val-1)*this.length
        this.information(1)
      },
      //初始化数据
      information(index){
          if(index==0){
              this.start=0
          }
          this.loading=true
           var Devices = Parse.Object.extend('Devices')
           var devices = new Parse.Query(Devices)
           devices.equalTo('basedata.devtype','lorawan')
           devices.skip(this.start)
           devices.limit(this.length)
           if(this.devsreport!=''){
              devices.equalTo('devaddr',this.devsreport) 
           }
           devices.count().then(count=>{
               this.total = count
                devices.find().then(resultes=>{
                     this.tableData3 =resultes
                     this.loading=false
                })
           },error => {
            if (error.code == "209") {
              this.$message({
                type: "warning",
                message: "登陆权限过期，请重新登录"
              });
              this.$router.push({
                path: "/login"
              });
            } else if (error.code == 119) {
              this.$message({
                type: "error",
                message: "没有操作权限"
              });
            }
          })
      },
        //编辑
       handleEdit(index, row){

       }, 
       //查看详情
       handledetail(index,val){
           this.devsreport = val
           this.$router.push({path:'/devicemanage/devsdetail',query:{devsreport:val}})
       },
       //查询
    //    search(){
    //        getdevsreport()
    //    }
   },
}
</script>
<style scoped>
.devsreport{
    background:#ffffff;
    padding-left:20px;
    padding-top:20px;
    box-sizing: border-box;
    min-height:100%;
}
.devsreportsection{
    margin-top:30px;
}
</style>
<style>
    .devsreporttop .el-input{
        width:200px;
    }
    .devsreport .el-table th{
    background:#fafafa;
    color:#666666;
    font-weight:600;
}
</style>


