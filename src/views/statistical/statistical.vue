<template>
    <div class="statistical">
       <div class="block">
          <label>数据类型：</label>
           <el-select v-model="history" placeholder="请选择" style="width:200px">
               <el-option
               v-for="item in cities"
               :key="item.value"
               :label="item.value"
               :value="item.label">
               <span style="float: left">{{ item.value }}</span>
               <span style="float: right; color: #8492a6; font-size: 13px">{{ item.label }}</span>
               </el-option>
            </el-select>
            <label style="margin-left:20px">数据项标识：</label>
           <el-select v-model="diselect" placeholder="请选择" style="width:200px">
                <el-option
                  v-for="item in options1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
               ></el-option>
            </el-select>
            <label for="" style="margin-left:20px;">电表地址：</label>
            <el-input placeholder="电表地址" v-model="meteraddr" style="width:200px;"></el-input>
            <label for="" style="margin-left:20px;">显示条数：</label>
            <el-select v-model="total" placeholder="请选择">
               <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
               </el-option>
            </el-select>
            <el-button type="primary" style="margin-left:20px;" @click="get_data">查 询</el-button>
       </div>
       <div class="meterhistory">
          <el-table
            :data="tableData"
            highlight-current-row
            
            style="width: 100%;">
            <el-table-column
               type="index"
               width="50"
               align="center">
            </el-table-column>
            <el-table-column
               property="hisdata"
               label="Date"
               >
            </el-table-column>
            <el-table-column
               property="time"
               label="Create Time"
               align="center"
               >
            </el-table-column>
         </el-table>
       </div>
    </div>
</template>
<script>
import {getdata} from '@/api/statistical/index'
import { Historydi } from "@/api/historytask";
export default {
   data() {
      return {
         cities: [{
          label: 'StatisticalHistory',
          value: '历史数据'
          }],
         diselect:'',
         history: '',
         meteraddr:'',
         node:null,
         tableData: [],
         options: [{
          value: '100',
          label: '100'
        }, {
          value: '10',
          label: '10'
        }, {
          value: '30',
          label: '30'
        }, {
          value: '50',
          label: '50'
        }],
        total: '',
        options1:[]
      }
   },
   mounted() {
      this.Getlist()
   },
   methods: {
      get_data(){
         getdata(this.meteraddr,this.total,this.diselect).then(response=>{
         //   if(response.result==true){
              response.data.map(item=>{
                 item.hisdata = JSON.stringify(item.hisdata)
                 item.time = item.time.substring(0,10)+' '+item.time.substring(11,19)
              })
              this.tableData = response.data
         //   }
         })
      },
       Getlist(){
       Historydi().then((res) => {
        res.data.map(item => {
          this.options1.push({
            value: item.di,
            label: item.di + "---" + item.name
          });
        });
      });
    },
   }
}
</script>
<style scoped>
.statistical{
    min-height: 875px;
  background: white;
  padding: 20px;
  box-sizing: border-box;
}
.meterhistory{
   margin-top:30px;
}
</style>
