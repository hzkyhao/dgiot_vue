<template>
    <div class="connectlist">
        <div class="top"> 
            <div class="left"> 
                <span>集中器个数</span>
                <p>{{total}}</p>
            </div>
            <div class="seconds">
                <span>在线集中器</span>
                <p>{{online}}</p>
            </div>
            <div class="right"> 
                <span>在线率</span>
                <p>{{onlinerate}}</p>
            </div>
        </div>
         <div class="center">
                <div class="centertop">
                    <label for="">集中器：</label>
                    <el-input v-model="concentrator" placeholder="请输入内容"></el-input>
                    <el-button type="primary" style="margin-left:50px;" @click="search">{{ $t('concentrator.search') }}</el-button>
            
                </div>
                <div class="centertables">
                     <el-table
                        :data="tableData"
                        style="width: 100%;text-align:center"
                        >
                        <el-table-column
                        prop="vcaddr"
                        label="集中器"
                        align="center"
                       >
                        <!-- <template slot-scope="scope">
                            <span :style="{'color':scope.row.is_online ? 'green':'red'}" style="background: #d7def7;">{{scope.row.vcaddr}}</span>
                            <p>{{scope.row.address}}</p>
                        </template> -->
                        </el-table-column>
                        <el-table-column
                        label="通讯端口"
                        align="center"
                        prop="remote_port"
                        >
                        </el-table-column>
                        <el-table-column
                        label="连接地址"
                        align="center"
                        >
                        <template slot-scope="scope">
                            <span>{{scope.row.remote_ip}}:{{scope.row.remote_port}}</span> 
                        </template>
                        </el-table-column>
                        
                        <el-table-column
                        label="状态"
                        align="center"
                        >
                        <template slot-scope="scope">
                            <div v-if="scope.row.is_online==true" style="width:10px;height:10px;border-radius:50%;display:inline-block;background:#00cc33;margin-right:10px"></div><span v-if="scope.row.is_online==true" style="color:#00cc33">在线</span>
                            <div v-if="scope.row.is_online==false" style="width:10px;height:10px;border-radius:50%;display:inline-block;background:#f00;margin-right:10px"></div><span v-if="scope.row.is_online==false" style="color:#f00">离线</span>
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
export default {
   data() {
      return {
          concentrator:'',
          start:0,
          length:10,
          total:0,
          tableData: [],
          online:0,
          onlinerate:"0.00%"
      }
   },
   mounted() {
       this.search()
   },
   methods: {
       search(){
           connectlist(this.start,this.length,this.concentrator).then(response=>{
              if(response){
                  this.tableData=response.data
                  this.total=response.recordsFiltered
                  
              }
           }).catch(error=>{
               console.log(error)
           })
       },
       handleSizeChange(val) {
        this.length=val
        this.search()
      },
      handleCurrentChange(val) {
        this.start=(val-1)*10
        this.search()
      },
   }
}
</script>
<style scoped>
.connectlist{
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
</style>
<style>
.connectlist .centertop .el-input{
    width:200px;   
}
.connectlist .el-table th{
    background:#fafafa;
    color:#666666;
    font-weight:600;
}
</style>
