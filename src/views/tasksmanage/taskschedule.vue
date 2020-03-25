<template>
  <div class="taskschedule">
     <div class="top">
      <div class="left">
        <span>集中器个数</span>
        <p><el-tag type="success" >{{total}}</el-tag></p>
      </div>
      <div class="seconds">
        <span>电表总数</span>
        <p><el-tag type="success" >{{contotal}}</el-tag></p>
      </div>
      <div class="right">
        <span>成功sum</span>
        <p><el-tag type="success" >{{consuccess}}</el-tag></p>
      </div>
      <div class="right">
        <span>抄表成功率avg</span>
       <p><el-tag type="success" >{{consuc}}%</el-tag></p>
      </div>
    </div>
    <div>
      <el-form :inline="true" :model="formline" class="demo-form-inline" type="small">
         <el-form-item label="任务名称">
         <el-input  v-model="formline.name" placeholder="任务名称" readonly></el-input>
      </el-form-item>
      <el-form-item label="查询日期">
        <el-date-picker
        v-model="formline.value1"
        type="date"
        :picker-options="pickerOptions"
        @change="changeTime"
        placeholder="选择日期">
      </el-date-picker>
      </el-form-item>
      <el-form-item label="查询时间">
        <el-select v-model="formline.starttime" filterable clearable>
          <el-option v-for="(item,index) in timeselect" :label="timestampToTime(Number(item)).substr(10)" :key="index" :value="Number(item)">

          </el-option>
        </el-select>
      </el-form-item>
       <el-form-item label="采集轮次">
        <el-select v-model="formline.chs">
          <el-option v-for="(item,index) in downchannel" :label="'第'+(index+1)+'轮次'+'('+item[0]+')'" :key="index" :value="index+1">

          </el-option>
        </el-select>
      </el-form-item>
       <el-form-item label="集中器地址">
         <el-input  v-model="formline.searchvalue" placeholder="集中器地址"></el-input>
      </el-form-item>
      <el-form-item>
         <el-button type="primary" @click="Gettaskdetail">搜索</el-button>
      </el-form-item>
    </el-form>
    </div>
    <div class="block">
      <el-table :data="tableData" style="width: 100%;text-align:center" >
        <el-table-column type="index" width="100" :index="(index)=>{return (index+1) + start}" ></el-table-column>
        <el-table-column prop="vcaddr" label="集中器" align="center"></el-table-column>
        <el-table-column  label="冻结日期" align="center">
          <template slot-scope="scope">
            <span>{{timestampToTime(frozendate)}}</span>
          </template>
        </el-table-column>
        <el-table-column  label="数据项标识" align="center">
          <template slot-scope="scope">
              <span>{{dis.join(',')}}</span>
          </template>
        </el-table-column>
        <el-table-column  label="抄表成功率" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.rate.toFixed(2)+'%'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="Meterdetail(scope.row.vcaddr)">详情</el-button>
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
        :total="total"
        style="margin-top:30px;"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { Taskdetail } from "@/api/historytask";
import { timestampToTime, timetounix } from "@/api/login";
export default {
  data() {
    return {
      dis:[],
      downchannel:[],
      taskstarttime:'',
      id: "",
      node: null,
      draw: 1,
      start: 0,
      length: 10,
      contotal:0,
      consuccess:0,
      consuc:0,
      tableData: [],
      total:0,
      formline:{
        name:'',
        searchvalue:'',
        starttime:'',
        chs:1,
        value1:''
      },
      timeselect:[],
      freq:'',
      unit:'',
      loading:true,
      loadingtext:'加载中',
      pickerOptions: {
       disabledDate: time => {
          let endDateVal = this.taskstarttime*1000;
          if (endDateVal) {
            return (
              time.getTime() < new Date(endDateVal).getTime()- 8.64e7 ||
              time.getTime() > Date.now()
            );
          } else {
            return time.getTime() < Date.now()- 8.64e7 ;
          }
        }
    },
      freqstep:'',
      origintime:[],
      frozendate:''
    }
  },
  mounted() {
    
    this.originData();
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
  originData(){
      this.id = this.$route.query.id;
      this.loading=true
      this.taskstarttime = this.$route.query.starttime
      this.downchannel = JSON.parse(this.$route.query.downchannel)
      this.formline.name = this.$route.query.name
      this.dis = JSON.parse(this.$route.query.di)
      //冻结日期
      if(this.$route.query.frozendate==0){
        this.frozendate=Number(new Date(new Date(new Date().toLocaleDateString()).getTime()))/1000
      }else{
        this.frozendate = this.$route.query.frozendate
      }
      //判断轮次
      
      if(this.downchannel.length>=1){
          this.downchannel.map(items=>{
        if(items[0]==1){
          items[0] = '物理集中器'
        }else if(items[0]==2){
          items[0] = 'GPRS'
        }else if(items[0]==3){
          items[0]='LoRa'
        }else{
          items[0]='NB'
        }
      })
      }
      //判断时间采集间隔
      this.unit = this.$route.query.unit
      if(this.unit=='minute'){
        this.freq = Number(this.$route.query.freq)*60
      }else if(this.unit=='hour'){
        this.freq = Number(this.$route.query.freq)*3600
      }else if(this.unit=='day'){
        this.freq = Number(this.$route.query.freq)*3600*24
      }else if(this.unit=='month'){
        this.freq = Number(this.$route.query.freq)*3600*24*30
      }
      //判断是否有任务
      this.freqstep = Math.ceil((Number(parseInt(new Date()/1000))-this.taskstarttime)/this.freq)
      //无数据时的展示
      if(this.freqstep<= 0){
        this.loadingtext="任务尚未开始"
        setTimeout(()=>{
          this.loading = false
        },3000)
      }
      else{
        //有任务时的查询
        this.origintime=[]
        for(var i=0;i<=this.freqstep-1;i++){
           var time = Number(this.taskstarttime)+Number(this.freq*i)
           this.origintime.push(time)
        }
        var start=new Date();
        start.setHours(0);
        start.setMinutes(0);
        start.setSeconds(0);
        start.setMilliseconds(0);
        this.formline.value1=Date.parse(start)
        console.log(this.formline.value1)
        this.changeTime()
        this.Gettaskdetail() 
      }
      
  },
  changeTime(){
    
    var time = this.timestampToTime(this.formline.value1/1000).substr(0,10)
    this.timeselect=[]
    this.origintime.map(items=>{
      if(this.timestampToTime(items).indexOf(time)!=-1){
        this.timeselect.push(items)
      }
    })
     this.formline.starttime = this.timeselect[0]
  },
  //初始化任务详情接口
    Gettaskdetail() {
       Taskdetail(this.start, this.length,this.id,this.formline.chs,this.formline.starttime,this.freq,this.formline.searchvalue).then(
          response => {
            if(response){
              this.tableData = response.data
              this.total = response.recordsTotal
              this.contotal = response.all
              this.consuccess = response.success
              this.consuc = response.success_rate.toFixed(2)
              this.loading=false
            }
          }
        ).catch(error=>{
          this.$message.error(error.error)
        }); 
    },
    //分页
     handleSizeChange(val){
          this.length=val
          this.Gettaskdetail()
      },
      handleCurrentChange(val){
          this.start=(val-1)*this.length
          this.Gettaskdetail()
      },
      //跳转详情页
      Meterdetail(vcaddr) {
      this.$router.push({
        path: "/tasksmanage/taskmeterdetail",
        query: {tid:this.id,rid:this.formline.chs, starttime:this.formline.starttime,freq:this.freq,di: this.dis.join(','),fdate:this.frozendate,vcaddr: vcaddr,}
      });
    },
  }
  
};
</script>
<style scoped>
.taskschedule {
  background: #ffffff;
  padding: 20px;
  box-sizing: border-box;
  width: 100%;
  min-height: 100%;
}
.top {
  width: 100%;
  height: 120px;
  margin-top: 20px;
  padding-top: 20px;
  box-sizing: border-box;
  background: #ffffff;
  border: 1px solid #cccccc;
  margin-bottom:20px;
}
.top div {
  width: 25%;
  float: left;
  text-align: center;
  height: 50px;
}
.top div:first-child {
  border-right: 1px solid #cccccc;
}
.top div:nth-child(2) {
  border-right: 1px solid #cccccc;
}
.top div:nth-child(3) {
  border-right: 1px solid #cccccc;
}
.block {
  margin-top: 20px;
}
</style>
