<template>
    <div class="devsdetail">
       <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="详情" name="first">
                <div class="topsearch">
                     <el-button plain>电表详情</el-button>
                     <el-button type="primary">配置任务</el-button>
                     <el-input placeholder="请输入内容" v-model="input5" style="margin-left:30px;width:300px">
                        <el-button slot="append" icon="el-icon-search" @click="searchformeter()"></el-button>
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
                    prop="deveui"
                    label="DEVEUI"
                    >
                    
                    </el-table-column>
                    <el-table-column
                    prop="appeui"
                    label="APPEUI"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="devaddr"
                    label="电表地址"
                    show-overflow-tooltip>
                    </el-table-column>
                     <el-table-column
                    prop="pn"
                    label="PN值"
                    >
                    </el-table-column>
                     <el-table-column
                    label="电表状态"
                    >
                    <template slot-scope="scope">
                        <span v-if="scope.row.is_online">运行中</span>
                        <span v-if="!scope.row.is_online">未运行</span>
                    </template>
                    </el-table-column>
                     <el-table-column
                    prop="vcaddr"
                    label="集中器"
                    >
                    </el-table-column>
                     <el-table-column
                    label="通道类型"
                    >
                    <template slot-scope="scope">
                        <span v-if="scope.row.usercase==1">载波通道</span>
                        <span v-if="scope.row.usercase!=1">虚拟通道</span>
                    </template>
                    </el-table-column>
                     <el-table-column
                    prop=""
                    label="操作"
                    >
                    <template slot-scope="scope">
                        <el-button 
                        size="mini"
                        @click='ammeterdetail(scope.row.devaddr)'
                        >
                            电表详情
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
            <el-tab-pane label="实时任务" name="second">
                 <div class="secondsearch">
                     <el-button type="primary">配置任务</el-button>
                     <el-button type="primary">立即补抄</el-button>
                     <el-input placeholder="请输入内容" v-model="input6" style="margin-left:30px;width:300px">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                     </el-input>
                </div>
                <el-table
                    ref="multipleTable1"
                    :data="tableData4"
                    tooltip-effect="dark"
                    style="width:100%;margin-top:30px;"
                    @selection-change="handleSelectionChange1">
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
                    @size-change="handleSizeChange1"
                    @current-change="handleCurrentChange1"
                    :page-sizes="[10, 25, 50, 100]"
                    :page-size="length1"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total1"
                    style="margin-top:30px;">
                    </el-pagination>
                </div>
            </el-tab-pane>
        </el-tabs>
        <!--创建电表详情弹窗-->
        <el-dialog
        title="电表详情"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose">
        <div v-for="(item,index) in meterdetail" :key="index">
            <p><span>集中器地址：</span><span>{{item.vcaddr}}</span></p>
            <p><span>信息点标识PN：</span><span>{{item.pn}}</span></p>
            <p><span>电表地址：</span><span>{{item.addr}}</span></p>
            <p><span>用户编号：</span><span>{{item.jldbh}}</span></p>
            <p><span>用户地址：</span><span>{{item.jlddz}}</span></p>
            <p><span>用户类别：</span><span>{{item.yhlb}}</span></p>
            <p><span>供电单位：</span><span>{{item.gddw}}</span></p>
            <p><span>出厂编号：</span><span>{{item.ccbh}}</span></p>
            <p><span>生产厂商：</span><span>{{item.sccj}}</span></p>
            <p><span>设备类型：</span><span>{{item.sblx}}</span></p>
            <p><span>通信规约：</span><span>{{item.txgy}}</span></p>
            <p><span>台区：</span><span>{{item.tq}}</span></p>
            <p><span>地理位置：</span><span>{{item.province+item.city}}</span></p>
            
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false" style="float:left">关 闭</el-button>
        </span>
        </el-dialog>
    </div>
</template>
<script>
import {timestampToTime,searchdevs} from '@/api/login'
export default {
   data() {
      return {
          total:0,
          length:10,
          start:0,
          start1:0,
          length1:10,
          total1:0,
          draw:1,
          activeName: 'first',
          vcaddr:'',
          input5:'',
          input6:'',
          addr:'',
          tableData3: [],
          multipleSelection: [],
          tableData4:[],
          multipleSelection1:[],
          dialogVisible:false,
          meterdetail: []
      }
   },
   mounted() {
       this.devsreport = this.$route.query.devsreport
    //    this.devsdetail()
   },
   methods:{
       handleClose(){
           this.dialogVisible=false
       },
       handleClick(event) {
       
      },
      //详情
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleSizeChange(val) {
        this.length=val
        
      },
     
      handleCurrentChange(val) {
        this.start=(val-1)*10
       
      },
       //实时任务模板
      handleSelectionChange1(val) {
        this.multipleSelection1 = val;
      },
      handleSizeChange1(val) {
        this.length1=val
        
      },
      handleCurrentChange1(val) {
        this.start1=(val-1)*10
        
      },
      //初始化数据实时任务
    devsdetail(){
        searchdevs(this.devsreport,this.start,this.length,++this.draw).then(res=>{
           if(res.result==true){
              this.tableData3 = res.data
              this.total = res.recordsFiltered
           }
        }).catch(error=>{
            console.log(error)
        })
    },
    detail(){
       
    },
    //电表详情
    ammeterdetail(val){
        
       
    },
    //电表搜索
    searchformeter(){
       searchdevs(this.input5,this.start,this.length,++this.draw).then(res=>{
           if(res.result==true){
              this.tableData3 = res.data
              this.total = res.recordsFiltered
           }
        }).catch(error=>{
            console.log(error)
        })
    },
    //实时任务补抄
    supplementarycopy(val){

    }
   }
}
</script>
<style scoped>
.devsdetail{
    background:#ffffff;
    padding-left:20px;
    padding-top:20px;
    box-sizing: border-box;
    min-height:100%;
}
.topsearch,.secondsearch{
    margin-top:30px;
}
</style>
<style>

.devsdetail .el-table th{
    background:#fafafa;
    color:#666666;
    font-weight:600;
}
.devsdetail .el-dialog__body{
    background:#f5f5f5;
}
.devsdetail.el-dialog__footer{
    padding-bottom:50px;
}
</style>

