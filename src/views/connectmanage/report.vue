<template>
    <div class="report">
        <!-- <div class="top"> 
            <div class="left"> 
                <span>集中器个数</span>
                <p>{{total}}</p>
            </div>
            <div class="seconds">
                <span>电表总数</span>
                <p>{{metertotal}}</p>
            </div>
            <div class="right"> 
                <span>在线率</span>
                <p>{{metersuccess.toFixed(2)}}%</p>
            </div>
        </div> -->
         <div class="center">
                <div class="centertop">
                    <label for="">集中器：</label>
                    <el-input v-model="concentrator" placeholder="请输入集中器地址"></el-input>
                    <el-button type="primary" style="margin-left:50px;" @click="search">{{ $t('concentrator.search') }}</el-button>
            
                </div>
                <div class="centertables">
                     <el-table
                        :data="tableData"
                        style="width: 100%;text-align:center"
                        v-loading="loading"
                        >
                        <el-table-column type="expand"
                        align="left"
                        >
                            <template slot-scope="scope">
                                <el-form label-position="left" inline class="demo-table-expand">
                                <el-form-item label="上次同步时间:">
                                    <span>{{ timestampToTime(scope.row.time)}}</span>
                                </el-form-item>
                                <el-form-item label="同步数据:">
                                    <span>{{ scope.row.count_online_meter }}</span> 
                                </el-form-item>
                                <!-- <p v-for="(item,key,index) in scope.row.report" :key="index">
                                    <el-form-item label="数据标识:">
                                    <span>{{ key }}</span>
                                    </el-form-item>
                                    <el-form-item label="已上报电表数:">
                                        <span>{{ item.succ=200}}</span>
                                    </el-form-item>
                                    <el-form-item label="准备上报电表数:">
                                        <span>{{ item.unsend=0}}</span>
                                    </el-form-item>
                                </p>  -->
                            </el-form>
                            </template>
                        </el-table-column>
                        <el-table-column
                        label="集中器"
                        align="center"
                       >
                        <template slot-scope="scope">
                            <span :style="{'color':scope.row.online ? 'green':'red'}">{{scope.row.vcaddr}}</span>
                            <p>{{scope.row.tq}}</p>
                        </template>
                        </el-table-column>
                        <el-table-column
                        label="主站地址"
                        align="center"
                        >
                        <template slot-scope="scope">
                            <span>{{scope.row.host ? scope.row.host:'127.0.0.1'}}</span> 
                        </template>
                        </el-table-column>
                        <el-table-column
                        label="在线电表"
                        align="center"
                        >
                        <template slot-scope="scope">
                            <span>在线：{{scope.row.count_online_meter}}/{{scope.row.count_meter}}</span>
                        </template>
                        </el-table-column>
                        <el-table-column
                        prop="address"
                        label="上报成功率"
                        align="center"
                        >
                        <template slot-scope="scope">
                            <span>{{(scope.row.report_rate).toFixed(2)}}%</span>
                        </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="block">
                    <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-sizes="[10, 25, 50, 100]"
                    :page-size="length"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                    </el-pagination>
                </div>
        </div>
    </div>
</template>
<script>
import {connectlist} from '@/api/connectlist/connectlist'
import meterdetailVue from '../tasksmanage/meterdetail.vue';
import Parse from 'parse'
import smartmeterVue from '../devicemanage/smartmeter.vue';
import { QueryVcon} from "@/api/meterMonitoring"
export default {
   data() {
      return {
          concentrator:'',
          start:0,
          length:10,
          total:0,
          tableData: [],
          success:0,
          metertotal:0,
          metersuccess:0,
          loading:true,
          time:parseInt(new Date().getTime()/1000),
          departmentid:""
      }
   },
   mounted() {
       this.search()
    // this.getTree()
   },
   methods: {
       timestampToTime(timestamp) {
        var date = new Date(timestamp * 1000) 
            var Y = date.getFullYear() + '-';
            var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
            var D = (date.getDate()+1 <= 10 ? '0'+(date.getDate()) : date.getDate()) + ' ';
            var h = (date.getHours()+1 <= 10 ? '0'+(date.getHours()) : date.getHours())  + ':';
            var m = (date.getMinutes()+1 <= 10 ? '0'+(date.getMinutes()) : date.getMinutes())  + ':';
            var s = (date.getSeconds()+1 <= 10 ? '0'+(date.getSeconds()) : date.getSeconds());
            return Y+M+D+h+m+s;
        },
       search(){
           this.loading = true
           QueryVcon(this.concentrator,2,this.time,this.length,this.start).then(resultes=>{
               if(resultes){
                   this.total = resultes.count
                    this.tableData = resultes.data
                    this.loading=false
               }
              
           })
        //    this.loading=true  
        //    var Smartmeter = Parse.Object.extend('Smartmeter')
        //    var smartmeter = new Parse.Query(Smartmeter)
        //    smartmeter.equalTo('pn',0)
        //     if(this.concentrator!=''){
        //        this.start=0
        //        smartmeter.equalTo('vcaddr',this.concentrator)
        //    }
        //    smartmeter.skip(this.start)
        //    smartmeter.limit(this.length)
        //    smartmeter.count().then(count=>{
        //        this.total = count
        //        smartmeter.find().then(response=>{
        //            this.tableData = response
        //            this.loading=false
        //        })
        //    })
        //    connectlist(this.start,this.length,this.concentrator).then(response=>{
        //          response.data.map(item=>{
        //              if(Object.keys(item.report).length>=2){
        //                  if(item.dev_total==0){
        //                       item.success = 0
        //                     }else{
        //                          for(let i=0;i<Object.keys(item.report).length;i++){
        //                      this.success +=item.report[Object.keys(item.report)[i]].succ
        //                  }
        //                 item.success=this.success/(item.dev_total*Object.keys(item.report).length)*100
        //                 metersuccess=(item.success/item.dev_total)
        //                  this.metertotal+=item.dev_total
        //                 }               
        //               }else if(Object.keys(item.report).length==1){
        //                   if(item.dev_total==0){
        //                       item.success = 0
        //                   }else{
        //                       item.success=item.report[Object.keys(item.report)[0]].succ/item.dev_total*100
        //                   }
                          
        //               }else {
        //                   item.success=0;
        //               }
                     
        //          })
        //           this.tableData=response.data
        //           this.total=response.recordsFiltered
        //           this.loading=false
                  
        //     //   }
        //    }).catch(error=>{
        //        console.log(error)
        //    })
       },
       handleSizeChange(val) {
        this.length=val
        this.search()
      },
      handleCurrentChange(val) {
        this.start=(val-1)*this.length
        this.search()
      },
   }
}
</script>
<style scoped>
.report{
    background:#ffffff;
    padding-left:20px;
    padding-bottom:20px;
    box-sizing: border-box;
    min-height:100%;
}
.top{
    width:100%;
    height:150px;
    padding-top:50px;
    box-sizing: border-box;
    background:#ffffff;
}
.top div{
    width:33.3%;
    float:left;
    text-align:center;
    height:50px;
}
.top div:first-child{
    border-right:1px solid #cccccc;
}
.top div:nth-child(2){
    border-right:1px solid #cccccc;
}
.top div span{
    color:rgba(0, 0, 0, 0.447058823529412);
}
.center{
    width:100%;
    background:#ffffff;
    margin-top:20px;
    padding:20px;
    box-sizing:border-box;
}
.centertables{
    margin-top:40px;
}
.block{
    margin-top:20px;
}
.centertables p{
    margin:0;
}
</style>
<style>
.report .centertop .el-input{
    width:200px;   
}
.report .el-table th{
    background:#fafafa;
    color:#666666;
    font-weight:600;
}
.report .el-form{
    text-align:left;
}
.report .el-table__expanded-cell[class*=cell]{
    background:#dddddd;
}
.report .el-form-item{
    margin-bottom:0;
}
</style>
