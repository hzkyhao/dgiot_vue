<template>
    <div class="log">
       
            <div class="left">
                <el-button type="primary" icon="el-icon-circle-plus-outline" @click="install" size="small">{{$t('node.join')}}</el-button>
            </div>
           
        <el-table
            :data="tableData5.slice((start-1)*length,start*length)"
            style="width: 100%;margin-top:20px;"
            border
            >
                <el-table-column
                :label="$t('node.nodename')"
                prop="name">
                </el-table-column>
                <el-table-column
                :label="'Erlang/'+$t('node.OTPversion')"
                prop="otp_release"
                >
                </el-table-column>
                <el-table-column
                >
                <template slot="header" slot-scope="scope">
                    <span>
                      {{'Erlang'+$t('node.process')}}
                    </span>
                    <p>used/avaliable</p>
                </template>
                <template slot-scope="scope">
                  <span>{{scope.row.process_used+'/'+scope.row.process_available}}</span>
                </template>
                </el-table-column>
                <el-table-column
                label="CPU"
                >
                 <template slot="header" slot-scope="scope">
                    <span>
                      CPU  
                    </span>
                    <p>1load/5load/15load</p>
                </template>
                <template slot-scope="scope">
                    <span>{{scope.row.load1+'/'+scope.row.load5+'/'+scope.row.load15}}</span>
                </template>
                </el-table-column>
                <el-table-column
                :label="$t('node.memory')"
               >
                <template slot="header" slot-scope="scope">
                    <span>
                      {{$t('node.memory')}}  
                    </span>
                    <p>used/total</p>
                </template>
               <template slot-scope="scope">
                  <span>{{scope.row.memory_used+'/'+scope.row.memory_total}}</span>
               </template>
                </el-table-column>
                <el-table-column
                :label="$t('node.Maximumnumberofhandles')"
                prop="max_fds">
                </el-table-column>
                <el-table-column
                :label="$t('node.state')"
                prop="node_status">
                </el-table-column>
                 <el-table-column
                :label="$t('node.operation')"
               >
               <template slot-scope="scope">
                  <el-button type="danger" size="small" @click="removeNode(scope.row)">{{$t('node.remove')}}</el-button>
               </template>
                </el-table-column>
        </el-table>
         <div class="block" style="margin-top:30px;">
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
        <el-dialog
            :title="$t('node.joincluster')"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose">
           <el-form model="form">
               <el-form-item :label="$t('node.nodename')">
                   <el-input v-model="form.nodename" type="text"></el-input>
               </el-form-item>
           </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">{{$t('developer.cancel')}}</el-button>
                <el-button type="primary" @click="join">{{$t('developer.determine')}}</el-button>
            </span>
            </el-dialog>
    </div>
</template>
<script>
import { getLog,joinLog } from '@/api/installation/index'
export default {
   data() {
      return {
          form:{
              nodename:''
          },
          tableData5: [],
          node:null,
          start:1,
          length:10,
          total:0,
          draw:1,
          search:'',
          dialogVisible:false,
          installtion:[],
          selsectinstall:[{
              value:'info',
              label:'info'
          },
          {
              value:'error',
              label:'error'
          },
          {
              value:'warning',
              label:'warning'
          },
          {
              value:'debug',
              label:'debug'
          },
          {
              value:'mqtt',
              label:'mqtt'
          },
          {
              value:'kafka',
              label:'kafka'
          },
          {
              value:'alert',
              label:'alert'
          },
          {
              value:'critical',
              label:'critical'
          },{
              value:'emergency',
              label:'emergency'
          },
          {
              value:'notice',
              label:'notice'
          }
          ]
      }
   },
   mounted() {
       this.Getinformation()
   },
   methods: {
       Getinformation(){
           getLog(this.start,this.lengt).then(response=>{
               if(response){
                 this.tableData5 = response.nodes
                 this.total = response.nodes.length
               }
           })
       },
        handleSizeChange(val) {
        this.length=val
        this.start=1
       
      },
      handleCurrentChange(val) {
        this.start=val
        
      },
    //   tableRowClassName({row, rowIndex}) {
    //     if(row.level=='error'){
    //          return 'error-row';
    //     }else if(row.level=='info'){
    //          return 'success-row';
    //     }else if(row.level=='debug'){
    //         return 'debug-row'
    //     }
    //     else{
    //         return 'warning-row';
    //     }
    //   },
    join(){
        joinLog('join',this.form.nodename).then(resultes=>{
            if(resultes){
                this.$message({
                    type:'success',
                    message:'加入成功'
                })
                this.dialogVisible=false
                this.Getinformation()
            }
        }).catch(error=>{
            this.$message.error(error.error)
        })
    },
    removeNode(row){
        joinLog('leave',row.node).then(resultes=>{
           if(resultes){
                this.$message({
                    type:'success',
                    message:'移除成功'
                })
                this.Getinformation()
            }
        }).catch(error=>{
            this.$message.error(error.error)
        })
    },
      install(){
          this.dialogVisible=true
      },
      handleClose(){
          this.dialogVisible=false
      }
   }
}
</script>
<style lang="scss" scoped>
.log{
  height:100%;
  background: white;
  padding:10px 20px 20px 20px;
  box-sizing: border-box;
  /deep/ .cell{
      color:black; 
      font-size:14px;
      line-height:1;
  }
}
</style>

