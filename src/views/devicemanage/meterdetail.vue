<template>
    <div class="meterdetail">
         <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="实时任务" name="first">
                <div class="secondsearch">
                     <el-button type="primary">配置任务</el-button>
                     <el-button type="primary">立即补抄</el-button>
                     <el-input placeholder="请输入内容" v-model="input6" style="margin-left:30px;width:300px">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                     </el-input>
                </div>
                <el-table
                    ref="multipleTable"
                    :data="tableData3"
                    tooltip-effect="dark"
                    style="width:100%;margin-top:30px;"
                    @selection-change="handleSelectionChange">
                    <el-table-column
                    type="selection"
                   >
                    </el-table-column>
                    <el-table-column
                    prop="cbname"
                    label="任务模板名称"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="date"
                    label="冻结日期"
                    >
                    </el-table-column>
                    <el-table-column
                    label="预抄表数"
                    >
                    <template slot-scope="scope">
                        <span>{{scope.row.success+scope.row.fail}}</span>
                    </template>
                    </el-table-column>
                     <el-table-column
                    prop="success"
                    label="成功数"
                    >
                    </el-table-column>
                     <el-table-column
                    prop="fail"
                    label="失败数"
                    >
                    </el-table-column>
                     <el-table-column
                    label="成功率"
                    >
                    <template slot-scope="scope">
                        <span>{{((scope.row.success+scope.row.retry)/(scope.row.success+scope.row.fail)).toFixed(2)+'%'}}</span>
                    </template>
                     </el-table-column>
                     <el-table-column
                    label="操作"
                    >
                    <template slot-scope="scope">
                        <el-button 
                        size="mini"
                        @click='supplementarycopy(scope.$index)'
                        >
                        立即补抄
                        </el-button>
                    </template>
                    </el-table-column>
                </el-table>
                <div class="block">
                    <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-sizes="[10, 25, 50, 100]"
                    :page-size="length"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                    style="margin-top:30px;">
                    </el-pagination>
                </div>
                </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
export default {
   data() {
      return {
        start:0,
        length:10,
        total:0,
        tableData3: [],
        multipleSelection: [],
        input6:'',
        activeName:'first'
      }
   },
   mounted(){

   },
   methods:{
       handleSizeChange(val){
          this.length=val
          
      },
      handleCurrentChange(val){
          this.start=(val-1)*10
      },
      handleSelectionChange(val){
        this.multipleSelection=val
      },
      supplementarycopy(val){

    },
     handleClick(event) {
        
      },
    }
}
</script>
<style scoped>
.meterdetail{
    background:#ffffff;
    padding-left:20px;
    padding-top:20px;
    box-sizing: border-box;
    min-height:100%;
}
.secondsearch{
    margin-top:30px;
}
</style>
<style>

.meterdetail .el-table th{
    background:#fafafa;
    color:#666666;
    font-weight:600;
}
.meterdetail .el-dialog__body{
    background:#f5f5f5;
}
.meterdetail .el-dialog__footer{
    padding-bottom:50px;
}