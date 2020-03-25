<template>
  <div id="meter_reading">
      <Resource1
        @meterdetail="getRows"
      />
    <div class="content">
      <el-form ref="form" :model="form" label-width="100px" size="mini" :inline="true">
        <el-form-item label="集中器地址">
          <el-input v-model="form.vcaddr_web"></el-input>
        </el-form-item>
        <el-form-item label="pn值">
          <el-input v-model.number="form.addr_web"></el-input>
        </el-form-item>
        <!-- <el-form-item label="任务模板">
          <el-select v-model="form.task_value" @change="handleTaskChange" placeholder="请选择任务模板">
            <el-option
              v-for="item in form.task"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="数据类型">
          <el-select
            v-model="form.data_type_value"
            placeholder="请选择数据类型"
            @change="handleDateChange"
          >
            <el-option
              v-for="item in form.data_type"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="抄表结果">
          <el-select v-model="form.res" placeholder="请选择">
          <el-option label="全部" value="all"></el-option>
          <el-option label="成功" value="success"></el-option>
          <el-option label="失败" value="fail"></el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="采集时间">
          <el-date-picker
            v-model="form.day_time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            v-if="form.data_type_value=='050601FF'||form.data_type_value=='050601EE'"
            :picker-options="form.pickerDisabled"
          ></el-date-picker>
          <el-date-picker
            v-model="form.month_time"
            type="monthrange"
            range-separator="至"
            start-placeholder="开始月份"
            end-placeholder="结束月份"
            v-else-if="form.data_type_value=='0001FF01'||form.data_type_value=='0001EE01'"
            :picker-options="form.pickerDisabled"
          ></el-date-picker>
        </el-form-item>
      <!-- <el-form-item label="选择库">
        <el-radio-group v-model="form.resource">
          <el-radio label="PG"></el-radio>
          <el-radio label="TD"></el-radio>
        </el-radio-group>
      </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="query(0)" size="mini">查询</el-button>
          <el-button type="primary" @click="reset" size="mini">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table 
        :data="table" 
        height="750" 
        border 
        style="width: 100%">
        <el-table-column prop="freeze_time" label="冻结时间" width="150"></el-table-column>
        <el-table-column prop="vcaddr_web" label="集中器地址" width="150"></el-table-column>
         <el-table-column prop="pn" label="pn" width="150"></el-table-column>
        <el-table-column prop="tasktype" label="任务模板" ></el-table-column>
        <el-table-column prop="data_type" label="数据类型" width="180"></el-table-column>
        <!-- <el-table-column prop="" label="上一日用电量" width="120"></el-table-column> -->
        <el-table-column prop="forward_power_total" label="正向有功电能总" width="120"></el-table-column>
        <el-table-column prop="forward_work_rate_1" label="正向有功费率1(尖)" width="120"></el-table-column>
        <el-table-column prop="forward_work_rate_2" label="正向有功费率2(峰)" width="120"></el-table-column>
        <el-table-column prop="forward_work_rate_3" label="正向有功费率3(平)" width="120"></el-table-column>
        <el-table-column prop="forward_work_rate_4" label="正向有功费率4(谷)" width="120"></el-table-column>
        <el-table-column prop="rid" label="任务轮次" width="120"></el-table-column>
        <el-table-column prop="gather_time" label="采集时间" width="190"></el-table-column>
      </el-table>
      <PagingQuery
        :pager="pager"
        @setPager="getinformation"
        @setPagerCount="getCount"
        @query="setup"
        @now_drive="setup2"
        @alldrive="getdeive"
      />
    </div>
  </div>
</template>
 
<script>
import { getMeterDate, getMeterListDate,getMeterListDate1 } from "@/api/meterReading";
import Resource1 from "@/components/resource/resource";
import Parse from "parse";
import { utc2beijing } from "@/utils/index";
import PagingQuery from "@/components/Pagination";
import { gettables, timestampToTime } from '@/api/login';
import { eventBus } from '@/api/eventBus';

export default {
  components: { Resource1,PagingQuery },
  data() {
    return {
      loading:true,
      pager: {
        count: 0,
        page: 1,
        rows: 25,
        name:"抄表结果展示",
        pages:[25,50,100],
        rest:0//至少还有几页
      },
      draw:1,
      data: [],
      vcaddr:'',
      objId:"",
      obj:{//对应字段
        frozendate:(value,line)=>{
          if(value=='header'){
            return ["冻结时间"]
          }else{
            line.push(this.dateFtt("yyyy-MM-dd",value));
          }
        },
        addr:"电能表地址",
        vcaddr:"集中器地址",
        task:"任务模板",
        datatype:"数据类型",
        data(value,line){
          // console.log(value,line)
          if(value=='header'){
            return ["正向有功电能总","正向有功费率1(尖)","正向有功费率1(峰)","正向有功费率1(平)","正向有功费率1(谷)"]
          }else{
            line.push(value.count);
            line.push(value.rate1);
            line.push(value.rate2);
            line.push(value.rate3);
            line.push(value.rate4);
            return line;
          }
        },
        date:(value,line)=>{
          if(value=='header'){
            return ["采集时间"]
          }else{
            line.push(this.dateFtt("yyyy-MM-dd hh:mm:ss",value));
          }
        }
      },
      // 表格加载
      form: {
        vcaddr_web: "", //集中器地址
        addr_web: "", //电能表地址
        task: [
          //任务模板
          { value: "050601FF", label: "日冻结抄表任务" },
          { value: "0001FF01", label: "月冻结抄表任务" },
        ],
        task_value: "050601FF",
        data_type: [
          //数据类型
          { value: "050601FF", label: "历史日数据" },
          { value: "050601EE", label: "日用量" },
          { value: "0001FF01", label: "历史月数据" },
          { value: "0001EE01", label: "月用量" },
        ],
        data_type_value: "050601EE",
        day_time: [
          new Date(new Date().getTime()-86400000*1).toLocaleDateString() ,//开始时间
          new Date(new Date().getTime()).toLocaleDateString()//结束时间
        ], //日时间
        month_time: [
          new Date(new Date().getTime()-86400000*30).toLocaleDateString(), 
          new Date(new Date().getTime()).toLocaleDateString()
        ], //月时间
        res:"",//抄表结果
        startTime:"",//开始时间
        endTime:"",//结束时间
        pickerDisabled:{
          disabledDate(time) {
            return time.getTime() > Date.now();//如果没有后面的-8.64e6就是不可以选择今天的
          }
        },
        // 导出条件,是否查询过
        deriveWhere:false,
        resource:'TD'
      },
      // 表格
      table: [],
      search_res:[],
      // 选中电表（后续有特殊处理，接口查询不一样）
      isMeter:false,
      freeze:"050601FF",//数据冻结
      isshowround:true
    };
  },
  methods: {
    // 时间戳
    dateFtt(fmt,value){
      var date = new Date(value*1000);
      var o = {   
        "M+" : date.getMonth()+1,                 //月份   
        "d+" : date.getDate(),                    //日   
        "h+" : date.getHours(),                   //小时   
        "m+" : date.getMinutes(),                 //分   
        "s+" : date.getSeconds(),                 //秒   
        "q+" : Math.floor((date.getMonth()+3)/3), //季度   
        "S"  : date.getMilliseconds()             //毫秒   
      };   
      if(/(y+)/.test(fmt))   
        fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));   
      for(var k in o)   
        if(new RegExp("("+ k +")").test(fmt))   
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
      return fmt;   
    },
    // 获取采集时间
    collTime(){
      let type=this.form.data_type_value;
     
      let start,end;
      // console.log(this.form.day_time)
      if (type=='050601FF'||type=='050601EE'){
          start=this.StartTime(this.form.day_time);
          end=this.EndTime(this.form.day_time);
      }else {
          start=this.StartTime(this.form.month_time);
          end=this.EndTime(this.form.month_time);
      }
      this.form.endTime=parseInt(end/1000);
      this.form.startTime=parseInt(start/1000);
    },
    // 查询
    query(index) {
      this.collTime(); 
      this.isshowround = false
      if(this.form.resource=='PG'){
        if(index==0){
         this.pager.page=1
         this.pager.count=0
      }
        getMeterDate((this.pager.page-1)*this.pager.rows, this.pager.rows,this.form.vcaddr_web,this.form.addr_web,this.form.startTime, this.form.endTime,this.freeze,this.form.resource).then(res => {
        if(res){
            this.search_res=res.results;
            this.getForDate(res); 
            this.incPage(res.rest,res.results.length)
            this.loading=false;
        }
      
      }).catch(error=>{
        this.$message.error(error.error)
      });
      }else{
        if(this.form.addr_web!=''){
           getMeterListDate((this.pager.page-1)*this.pager.rows, this.pager.rows,this.form.vcaddr_web,this.form.addr_web,this.form.startTime, this.form.endTime,this.form.res,this.form.data_type_value).then(res=>{
          if(res){
             this.search_res=res.results;
              this.getForDate(res); 
             this.pager.count = res.count
               this.loading=false;
          }
        }).catch(error=>{
        this.$message.error(error.error)
      });
        }else{
           getMeterListDate1((this.pager.page-1)*this.pager.rows, this.pager.rows,this.form.vcaddr_web,this.form.startTime, this.form.endTime,this.form.res,this.form.data_type_value).then(res=>{
          if(res){
             this.search_res=res.results;
              this.getForDate(res); 
             this.pager.count = res.count
               this.loading=false;
          }
        }).catch(error=>{
        this.$message.error(error.error)
      });
        }
       
      }
      
    },
    // 获取开始时间
    StartTime(time) {
      let start = new Date(time[0]).getTime();
      return start;
    },
    // 获取结束时间
    EndTime(time) {
      
      let end = new Date(time[1]).getTime()+24*60*60*1000-1;
      return end;
    },
    // 重置
    reset() {
      this.form.vcaddr_web = "";
      this.form.addr_web = "";
      this.form.task_value = "050601FF";
      this.form.data_type_value = "050601FF";
      this.form.month_time = [
        new Date(new Date().getTime()-86400000*30).toLocaleDateString(), 
          new Date(new Date().getTime()).toLocaleDateString()
      ];
      this.form.day_time = [
        new Date(new Date().getTime()-86400000*3).toLocaleDateString() ,//开始时间
          new Date(new Date().getTime()).toLocaleDateString()//结束时间
      ];
      this.form.month_time = "";
      this.form.res="all"
    },
    // 数据和任务关联
    handleDateChange() {
      this.form.task_value = this.form.data_type_value;
      this.freeze=this.form.task_value;
    },
    handleTaskChange(){
      this.form.data_type_value = this.form.task_value;
      this.freeze=this.form.data_type_value;
    },
    // 获取资源树
    getTree() {
      var Department = Parse.Object.extend("Department");
      var department = new Parse.Query(Department);
      department.equalTo('ParentId',"0");
      department.find().then(
        resultes => {
          this.objId=resultes[0].id;
          this.getinformation()
        },
        error => {
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
      );
    },
    // 获取树id
    getRows(row) {
      this.isshowround=true
        this.pager.count=0,
        this.pager.page=1,
        this.pager.rows= 25,
        this.pager.name="抄表结果展示",
        this.pager.pages=[25,50,100],
        this.pager.rest=0//至少还有几页
      this.loading=true;
      this.objId=row.objectId;
      this.collTime();
      this.form.addr_web="";
      this.form.vcaddr_web="";
      if (row.icon=="集中器"){
        this.form.vcaddr_web=row.name;
        this.form.addr_web="";
      }else if (row.icon=="电表"){
        this.form.addr_web=row.name;
        this.form.vcaddr_web="";
      }
      if(this.form.resource=='PG'){
           getMeterDate1((this.pager.page-1)*this.pager.rows, this.pager.rows,this.form.vcaddr_web,this.form.startTime, this.form.endTime+85399999,this.freeze,this.form.resource).then(res => {
        if(res){
            this.search_res=res.results;
            this.getForDate(res); 
            this.incPage(res.rest,res.results.length)
            this.loading=false;
        }
      }).catch(error=>{
        this.$message.error(error.error)
      });
      }else{
        
       if(this.form.addr_web!=''){
           getMeterListDate((this.pager.page-1)*this.pager.rows, this.pager.rows,this.form.vcaddr_web,this.form.addr_web,this.form.startTime, this.form.endTime,this.form.res,this.form.data_type_value).then(res=>{
          if(res){
             this.search_res=res.results;
              this.getForDate(res); 
             this.pager.count = res.count
               this.loading=false;
          }
        }).catch(error=>{
        this.$message.error(error.error)
      });
        }else{
           getMeterListDate1((this.pager.page-1)*this.pager.rows, this.pager.rows,this.form.vcaddr_web,this.form.startTime, this.form.endTime,this.form.res,this.form.data_type_value).then(res=>{
          if(res){
             this.search_res=res.results;
              this.getForDate(res); 
             this.pager.count = res.count
               this.loading=false;
          }
        }).catch(error=>{
        this.$message.error(error.error)
      });
        }
      }
     
    },
    // 循环每个字段添加
    getForDate(res){
      let r=res.results;
      // console.log(r);
      this.table=[];
      for (let i = 0; i < r.length; i++) {
        let obj = {};
        obj.addr_web = r[i].addr;
        obj.pn = r[i].pn;
        obj.vcaddr_web = r[i].vcaddr;
        obj.data_type = r[i].datatype;
        obj.forward_power_total = r[i].data.count;
        obj.forward_work_rate_1 = r[i].data.rate1;
        obj.forward_work_rate_2 = r[i].data.rate2;
        obj.forward_work_rate_3 = r[i].data.rate3;
        obj.forward_work_rate_4 = r[i].data.rate4;
        obj.freeze_time = timestampToTime(r[i].frozendate);
        obj.gather_time = timestampToTime(r[i].date);
        obj.inversion_power_total = r[i].data.NotCount;
        obj.task_value = r[i].task;
        obj.tasktype = r[i].tasktype
        obj.rid = r[i].rid
        // 是否为空，是的话显示-
        obj.inversion_power_total = this.isNot(obj.inversion_power_total);
        obj.gather_time = this.isNot(obj.gather_time);
        obj.addr_web = this.isNot(obj.addr_web);
        obj.vcaddr_web = this.isNot(obj.vcaddr_web);
        obj.forward_power_total = this.isNot(obj.forward_power_total);
        obj.forward_work_rate_1 = this.isNot(obj.forward_work_rate_1);
        obj.forward_work_rate_2 = this.isNot(obj.forward_work_rate_2);
        obj.forward_work_rate_3 = this.isNot(obj.forward_work_rate_3);
        obj.forward_work_rate_4 = this.isNot(obj.forward_work_rate_4);
        obj.task = this.isNot(obj.task);
        obj.tasktype = this.isNot(obj.tasktype)
        obj.rid = this.isNot(obj.rid)
        this.table.push(obj);
      }
    },
    // 判断是否为空
    isNot(value) {
      if (value == undefined) {
        return "-";
      } else {
        return value;
      }
    },
    // 分页
    setup(item) {
      this.getinformation(item);
    },
    getCount(item){
  
      this.pager.rest=0
      this.getinformation(item)
    },
    // 获取数据
    getinformation(item) {
     

      this.loading=true;
      this.query(1)
  //     this.collTime();
  //     getMeterDate((this.pager.page-1)*this.pager.rows, this.pager.rows,this.form.vcaddr_web,this.form.addr_web,this.form.startTime, this.form.endTime+85399999,this.form.res,this.freeze).then(res => {
  //   if(res){
  //       this.search_res=res.results;
  //       this.getForDate(res); 
  //       this.incPage(res.rest)
  //       this.loading=false;
  //   }
  
  // }).catch(error => {
  //       console.log(error);
  //     });
    },
    setup2(item) {
      this.get_now(item);
    },
    // 导出当前
    get_now(data){
      this.collTime();
      getMeterDate((this.pager.page-1)*this.pager.rows, this.pager.rows,this.form.vcaddr_web,this.form.addr_web,this.form.startTime, this.form.endTime+85399999,this.freeze,this.form.resource)
        .then(res => {
          if(res){
             if (this.search_res){
            eventBus.$emit('drive',{json:this.search_res,obj:this.obj,name:this.pager.name});
          }else {
            eventBus.$emit('drive',{json:res.results,obj:this.obj,name:this.pager.name});
          }
          }
         
        })
        .catch(error=>{
        this.$message.error(error.error)
      });
    },
    // 分页导出
    getdeive(data){
      this.collTime();
     getMeterDate((this.pager.page-1)*this.pager.rows, this.pager.rows,this.form.vcaddr_web,this.form.addr_web,this.form.startTime, this.form.endTime+85399999,this.freeze,this.form.resource).then(res => {
       if(res){
            if (this.search_res){
            eventBus.$emit('drive',{json:this.search_res,obj:this.obj,name:this.pager.name});
          }else {
            eventBus.$emit('drive',{json:res.results,obj:this.obj,name:this.pager.name});
          }
          }
          
        }).catch(error=>{
        this.$message.error(error.error)
      });
    },
    // 分页懒加载
    pageLoading(rest){
      // console.log(rest)
      // 判断当前总数据/当前每页显示数量===当前页，如果一样代表最后一页，查看是否还有后续页数
      if (this.pager.count/this.pager.rows==this.pager.page){
        this.pager.rest+=rest;
        this.pager.count=this.pager.rest*this.pager.rows;
      }else if(this.pager.count/this.pager.rows>this.pager.page){

      }
    },
    // 初始页码
    incPage(rest,length){
       if (this.pager.count/this.pager.rows==this.pager.page){
        this.pager.rest+=rest;
        this.pager.count=this.pager.rest*this.pager.rows;
      }else if(this.pager.count/this.pager.rows>this.pager.page){

      }else if(rest>0){
         this.pager.rest=rest;
         this.pager.count=this.pager.rows*this.pager.rest;
      }else if(rest<0){
         this.pager.rest=0
         this.pager.cunt=0
      }else if(rest==0){
        this.pager.reset=0
        this.pager.count = this.pager.count+length

      }
     
    },
    //隐藏总页数
    totalHide(){
      let total=document.getElementsByClassName("el-pagination__total")[0];
      total.style.display="none";
    }
  },
  mounted() {
    // this.totalHide();
    this.getTree();
    // this.getinformation();
  }
};
</script>
 
<style lang="scss" scoped>
#meter_reading {
  background: #fff;
  display: flex;
  justify-content: space-between;
  .resource1 {
    width:360px;
    height: 100vh;
    flex-shrink:0;
    overflow:scroll;
    padding-top: 10px;
  }
  .content {
    width:calc(100% - 360px);
    padding:20px 0 0 20px;
    /deep/ .el-form {
      // display: flex;
      // justify-content: space-between;
      // flex-wrap: wrap;
      .el-form-item {
        // display: flex;
        // flex-wrap: wrap;
        // width: 20%;
        &:nth-child(6) {
          width: 40%;
        }
        /deep/ input {
          height: 26px;
          width: 150px;
          border-radius:0;
          line-height: 26px;
        }
        /deep/ .el-date-editor {
          width: 400px;
          height: 26px;
          line-height: 26px;
          .el-range-input {
            margin-left: 2%;
          }
          i,
          span {
            line-height: 20px;
          }
          input {
            height: 24px;
          }
        }
      }
    }
    /deep/ .el-table {
      th,
      td {
        text-align: center;
        height: 35px;
        font-size: 12px;
        padding: 0;
      }
    }
  }
}
</style>