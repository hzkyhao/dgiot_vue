<template>
  <div class="searchmeter">
    <!-- <Resource1
      style="width:360px;height:100vh;overflow:scroll;flex-shrink:0;padding:10px;float:left;"
      @meterdetail="meterdetail"
    /> -->
    <div class="meterright">
      <div class="meterheader" style="width:100%">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="供电单位">
            <el-input v-model="formInline.department" placeholder="请选择供电单位"></el-input>
          </el-form-item>
          <el-form-item label="终端类型">
            <el-select v-model="formInline.dtutype" placeholder="请选择下发通道">
              <el-option label="DTU网关" value="DTU_GPRS"></el-option>
              <el-option label="物理集中器" value="物理集中器"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="终端地址">
             <el-select v-model="formInline.vcaddr" placeholder="请选择终端地址">
              <el-option v-for="(item,index) in dtudata" :label="item.attributes.deveui" :value="item.attributes.deveui" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="搜表类型">
            <el-select v-model="formInline.search_meter_type" placeholder="请选择搜表类型">
              <el-option label="手动搜表" value="search_meter"></el-option>
            </el-select>
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="onSubmit" size="mini">读取档案</el-button>
            <!-- <el-button type="primary" size="mini">手动搜表</el-button> -->
            <el-button type="primary" size="mini" @click="searchresult">手动搜表</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="headertable" style="width:100%">
        <!--历史档案-->
        <div class="firsttable">
          <div
            style="width:100%;height:40px;background:#f5f7fa;line-height:40px;color:#606266;border-radius:2px;padding-left:20px;box-sizing:border-box"
          >历史档案</div>
          <div class="historytable" style="width:100%">
            <el-table :data="tableData" style="width: 100%;text-align:center" height="300" border  v-loading="loading"
            element-loading-text="暂无档案，请先完成搜表"
            element-loading-spinner="el-icon-loading"
            :element-loading-fullscreen="false"
            element-loading-background="rgba(255, 255, 255, 0.8)">
              <el-table-column
              label="序号"
              type="index"
              align="center"
              width="50">
            </el-table-column>
              <el-table-column prop="devaddr" label="终端地址" align="center">
              </el-table-column>
              <el-table-column  label="pn值" align="center" class="animated fadeInUp" v-if="formInline.dtutype=='物理集中器'"></el-table-column>
              <el-table-column  prop="addr" label="电能表地址" align="center"></el-table-column>
              <!-- <el-table-column  label="异常判断" align="center">
                <template slot-scope="scope">
                 <span v-if="scope.row.status==1" style="color:green">正常</span>
                 <span v-if="scope.row.status==0" style="color:#3a88fd">新增未授权</span>
                 <span v-if="scope.row.status==2" style="color:#f56c6c">失联</span>
                 <span v-if="scope.row.status==3" style="color:#e6a23c">迁出</span>
                </template>
              </el-table-column> -->
            </el-table>
          </div>
        </div>
        <!--搜表结果-->
        <div class="secondtable">
          <div
            style="width:100%;height:40px;background:#f5f7fa;line-height:40px;color:#606266;border-radius:2px;padding-left:20px;box-sizing:border-box"
          >搜表结果</div>
          <div class="searchtable">
            <el-table :data="tableData1" style="width: 100%;text-align:center" height="300" border>
              <el-table-column
              label="序号"
              type="index"
              align="center"
              width="50">
            </el-table-column>
              <el-table-column prop="devaddr" label="终端地址" align="center"></el-table-column>
              <el-table-column  label="pn值" align="center" class="animated fadeInUp" v-if="formInline.dtutype=='物理集中器'"></el-table-column>
              <el-table-column  prop="addr" label="电能表地址" align="center"></el-table-column>
              <el-table-column  label="异常判断" align="center">
                 <template slot-scope="scope">
                 <span v-if="scope.row.status==1" style="color:green">正常</span>
                 <span v-if="scope.row.status==0" style="color:#3a88fd">新增未授权</span>
                 <span v-if="scope.row.status==2" style="color:#f56c6c">失联</span>
                 <span v-if="scope.row.status==3" style="color:#e6a23c">迁出</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="dangan">
        <div class="danganheader">
          <el-form :inline="true" :model="meterForm" class="demo-form-inline">
            <el-form-item label="状态">
              <el-select v-model="meterForm.status" placeholder>
                <el-option label="全部" :value="9"></el-option>
                <el-option label="新增" :value="0"></el-option>
                <el-option label="正常" :value="1"></el-option>
                <el-option label="失联" :value="2"></el-option>
              </el-select>
            </el-form-item>
             <el-form-item label="授权状态">
              <el-select v-model="meterForm.auth" placeholder>
                <el-option label="全部" :value="9"></el-option>
                <el-option label="已授权" :value="1"></el-option>
                <el-option label="未授权" :value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="mini" @click="searchmeter">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="dangantable">
          <div
            style="width:100%;height:40px;background:#f5f7fa;line-height:40px;color:#606266;border-radius:2px;padding-left:20px;box-sizing:border-box"
          >搜表异常记录</div>
          <el-table :data="tableData2" style="width: 100%;text-align:center" height="350" @selection-change="handleSelectionChange" border>
            <el-table-column
              label="序号"
              type="index"
              align="center"
              :index='(index)=>{
                return Number(index+1) + Number((page-1)*pagesize)}' 
              width="50">
            </el-table-column>
            <el-table-column  prop="addr" label="电表地址" align="center"></el-table-column>
            <el-table-column  label="档案pn值" align="center" v-if="formInline.dtutype=='物理集中器'"></el-table-column>
            <el-table-column  label="原终端地址" align="center"></el-table-column>
            <el-table-column  label="当前pn值" align="center" v-if="formInline.dtutype=='物理集中器'"></el-table-column>
            <el-table-column  prop="devaddr" label="当前终端地址" align="center"></el-table-column>
            <el-table-column  label="搜表结果分析" align="center">
              <template slot-scope="scope">
               <span v-if="scope.row.status==0">新增</span>
               <span v-else-if="scope.row.status==1">正常</span>
               <span v-else-if="scope.row.status==2">失联</span>
              </template>
            </el-table-column>
            <el-table-column  label="授权状态" align="center">
                <template slot-scope="scope">
               <span v-if="scope.row.auth==0" style="color:red">未授权</span>
               <span v-else-if="scope.row.auth==1" style="color:green">已授权</span>
              </template>
            </el-table-column>
            <el-table-column prop="ts" label="操作时间" align="center"></el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :page-sizes="[10, 20, 30, 50]"
              :page-size="pagesize"
              background
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Resource1 from "@/components/resource/resource";
import Parse from 'parse'
import {utc2beijing} from '@/utils/index'
import {SearchMeter} from '@/api/searchMeter'
import { eventBus } from '@/api/eventBus';
import {timestampToTime} from '@/api/login'
import {Websocket} from "@/utils/wxscoket.js";
import { setTimeout } from 'timers';
export default {
  components: {
    Resource1
  },
  data() {
    return {
      loading:false,
      start:0,
      page:1,
      pagesize:10,
      total:0,
      formInline: {
        deparement:'',
        vcaddr: "",
        search_meter_type: "search_meter",
        dtutype:'DTU_GPRS'
      },
      meterForm:{
        status:9,
        auth:9,
      },
      //历史档案data
      tableData: [],
      //搜表结果data
      tableData1: [],
      //档案变更管理data
      tableData2: [],
      objectId:'',
      session:'',
      dtudata:[]
    };
  },
  mounted() {
     this.session = Parse.User.current().attributes.sessionToken
     this.getDtu()
  },
  methods: {
    //初始化数据
    getDtu(){
      var Dtu = Parse.Object.extend("Dtu");
      var dtu = new Parse.Query(Dtu);
       dtu.find().then(resultes=>{
         this.dtudata = resultes
       })
    },
    onSubmit() {
      this.tableData = []
      var Dtu = Parse.Object.extend("Dtu");
      var dtu = new Parse.Query(Dtu);
      dtu.equalTo('deveui',this.formInline.vcaddr)
      dtu.equalTo('devtype',this.formInline.dtutype)
      dtu.find().then(resultes=>{
        if(resultes.length==0){
          this.loading=true
          setTimeout(()=>{
            this.loading=false
          },3000)
        }else{
          resultes.map(items=>{
          if(items.attributes.OldHisdata){
            for(var key in items.attributes.OldHisdata){
               var obj ={}
                obj.addr = key
                obj.status = items.attributes.OldHisdata[key]
                obj.devaddr = items.attributes.devaddr
                this.tableData.push(obj)
            }
          }
        })
        this.loading=false
        }
        
        // console.log(this.tableData)
      },error=>{
        if(error.code==119){
          this.$message({
            type:'error',
            message:'没有操作权限'
          })
        }
      }
      )
    },
    //档案变更历史查询
    searchmeter(){
      this.tableData2=[]
      var Smartdevhistory = Parse.Object.extend("Smartdevhistory");
      var smartdevhistory = new Parse.Query(Smartdevhistory);
      smartdevhistory.equalTo('devtype',this.formInline.dtutype)
      smartdevhistory.ascending('-ts')
      if(this.meterForm.status!=9){
         smartdevhistory.equalTo('hisdata.status',this.meterForm.status)
      }
      if(this.meterForm.auth!=9){
        smartdevhistory.equalTo('hisdata.auth',this.meterForm.auth)
      }  
      smartdevhistory.limit(this.pagesize)
      smartdevhistory.skip(this.start)
      smartdevhistory.count().then(count=>{
       this.total = count
      smartdevhistory.find().then(response=>{
        response.map(item=>{
          var obj={}
          obj.addr = item.attributes.hisdata.addr
          obj.status = item.attributes.hisdata.status
          obj.auth = item.attributes.hisdata.auth
          obj.devaddr = item.attributes.devaddr
          obj.objectId = item.id
          obj.ts = timestampToTime(item.attributes.ts)
          this.tableData2.push(obj)
        })
        
        
      },error=>{
        if(error.code==119){
          this.$message({
            type:'error',
            message:'没有操作权限'
          })
        }
      })
    })
    },
    handleSelectionChange(val){

    },
    searchresult(){
      if(Websocket.connState==false){
        this.$message({
            type: "warning",
            message: "正在重新连接，请稍后"
        })
        
      }else{
        var _this = this
        var ranNum = Math.ceil(Math.random() * 25)
        var operation = String.fromCharCode(65+ranNum)+Math.ceil(Math.random()*100000)
        eventBus.$on(operation, data => {
          _this.tableData1=[]
          for(var key in data.data){
               var obj ={}
                obj.addr = key
                obj.status = data.data[key]
                obj.devaddr = data.devaddr
                _this.tableData1.push(obj)
           }
          });
        SearchMeter(_this.formInline.vcaddr,_this.formInline.dtutype,_this.session,operation).then(res=>{
          
        }).catch(error=>{
          if(error.error=='searching'){
              this.$message({
              type:'error',
              message:'正在搜表中'
            })
          }else if(error.code==202){
            this.$message({
            type:'error',
            message:'设备未上线'
          })
          }
          
        })
      }
      
    },
    //分页
    handleSizeChange(val) {
     this.pagesize = val
     this.searchmeter()
    },
    handleCurrentChange(val) {
      this.page = val
      this.start=(val-1)*this.pagesize
      this.searchmeter()
    }
  }
};
</script>
<style  lang="scss" scoped>
.searchmeter {
  padding-bottom: 20px;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  .meterright {
    background: #ffffff;
    border-left: 2px solid rgb(21, 111, 174);
    padding: 10px;
    box-sizing:border-box;
    .headertable {
      width: 100%;
      display: flex;
      margin-top: 20px;
      justify-content: space-around;
      border-bottom: 1px solid #cccccc;
      box-sizing: border-box;
      .firsttable {
        width: 40%;
      }
      .secondtable {
        width: 40%;
      }
    }
    .dangan {
      width: 100%;
      margin-top: 10px;
      .danganheader {
       text-align:right;
      };
      .dangantable{
          .pagination{
              margin-top:10px;
          }
      }
    }
  }
}
</style>
<style>
.searchmeter .meterheader .el-input--suffix .el-input__inner,
.searchmeter .meterheader .el-input__inner,.searchmeter .danganheader .el-input--suffix .el-input__inner,
.searchmeter .danganheader .el-input__inner
 {
  height: 26px;
  border-radius: 0;
  line-height: 26px;
  width: 200px;
}
.searchmeter .el-form-item {
  margin-bottom: 0;
}
</style>

