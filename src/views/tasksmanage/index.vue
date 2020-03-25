<template>
  <div class="historytask">
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
    <div class="historydi">
      <label for>数据项标识：</label>
      <el-select v-model="diselect" placeholder="请选择" style="width:400px;">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <label for style="margin-left:30px;">冻结日期：</label>
      <el-date-picker v-model="datetime" type="date" placeholder="选择日期时间" :picker-options="pickerOptions0"></el-date-picker>
      <el-button type="primary" @click="search()" style="margin-left:30px;">查 询</el-button>
      <!--表格-->
      <div class="block">
        <el-table
          ref="singleTable"
          :data="tableData"
          highlight-current-row
          style="width: 100%;text-align:center"
          v-loading="loading"
        >
          <el-table-column type="index" width="50" align="center"></el-table-column>
          <el-table-column property="vcaddr" label="集中器" align="center"></el-table-column>
          <el-table-column property="datetime" label="冻结日期" align="center"></el-table-column>
          <el-table-column property="di" label="数据项名称" align="center"></el-table-column>
          <el-table-column property="all" label="总数" align="center"></el-table-column>
          <el-table-column property="success" label="成功" align="center"></el-table-column>
          <el-table-column label="抄表成功率" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.success_rate+'%'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="Meterdetail(scope.row.di,scope.row.datetime,scope.row.vcaddr)"
              >详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 25, 50, 100]"
          :page-size="length"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          style="margin-top:20px;"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { HistoryTask, Historydi } from "@/api/historytask";
import { timestampToTime, timetounix } from "@/api/login";
export default {
  data() {
    return {
      page: 0,
      length: 10,
      total: 0,
      tableData: [],
      currentRow: null,
      options: [],
      diselect: "05060101",
      datetime: "",
      time: "",
      firsttime: "",
      contotal:0,
      consuccess:0,
      consuc:0,
      allsuc:0,
      searchvalue:'',
      loading:true,
      pickerOptions0: { 
         disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6;//如果没有后面的-8.64e7就是不可以选择今天的 
         }
      }
    };
  },
  created() {
    this.firsttime = new Date(
      new Date(new Date().toLocaleDateString()).getTime()
    );
    this.firsttime = Number(this.firsttime) / 1000;
    this.Getlist()
  },
  mounted() {
    
    this.search()
  },
  methods: {
     Getlist(){
       Historydi().then((res) => {
         if(res){
            res.data.map(item => {
          this.options.push({
            value: item.di,
            label: item.di + "---" + item.name
          });
        });
         }
       
      });
    },
    search() {
      this.loading=true
      if (this.datetime == "") {
        this.time = this.firsttime;
      } else {
        var nowTime = this.datetime;
        console.log(this.datetime)
        var date = new Date(nowTime); //时间对象
        this.time = date.getTime(); //转换成时间戳
        this.time = this.time / 1000;
      }
      HistoryTask(this.page, this.length, this.diselect, this.time,this.searchvalue)
        .then((res) => {
          this.loading=false
          if (res) {
            res.data.map(item => {
              item.datetime = timestampToTime(item.datetime);
              // this.contotal +=item.all
              // this.consuccess+=item.success
              // this.allsuc+=item.allsuc
            });
            this.consuc=res.total_success_rate
            this.tableData = res.data;
            this.total = res.recordsTotal;
            this.contotal = res.total_meter
            this.consuccess = res.total_success_meter
            this.consuc = res.total_success_rate
          }
        })
        .catch(error => {});
    },
    Meterdetail(di, datetime, vcaddr) {
      datetime = timetounix(datetime);
      this.$router.push({
        path: "/tasksmanage/meterdetail",
        query: { di: di, datetime: datetime, vcaddr: vcaddr }
      });
    },
    handleSizeChange(val) {
      // console.log(val)
      this.length = val;
      this.search();
    },
    handleCurrentChange(val) {
      // console.log(val)
      this.page = (val - 1) * this.length;
      this.search();
    },
    
  }
};
</script>
<style scoped>
.historytask {
  background: #ffffff;
  padding: 20px;
  box-sizing: border-box;
  width: 100%;
  min-height: 100%;
  margin-bottom: 2rem;
}
.block {
  margin-top: 30px;
}
.top {
  width: 100%;
  height: 150px;
  margin-top: 20px;
  padding-top: 50px;
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
</style>