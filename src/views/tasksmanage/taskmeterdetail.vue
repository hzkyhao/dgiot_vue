<template>
  <div class="meterdetail">
    <div class="top">
      <div class="left">
        <span>总数</span>
        <p>{{total}}</p>
      </div>
      <div class="seconds">
        <span>成功</span>
        <p>{{success}}</p>
      </div>
      <div class="right">
        <span>未执行</span>
        <p>{{unexe ? unexe :0 }}</p>
      </div>
      <div class="right">
        <span>失败</span>
        <p>{{fail}}</p>
      </div>
      <div class="right">
        <span>超时</span>
        <p>0</p>
      </div>
      <div class="right">
        <span>成功率</span>
        <p>{{success_rate}}</p>
      </div>
    </div>
    <div class="quickly">
      <el-button type="primary" @click="Supplement">立即补抄</el-button>
    </div>
    <div class="devdetail">
       <ul style="padding-left:0;width:60%">
          <li style="text-align:center;width:10%">
            <input type="checkbox" id="allselect">
            <span >全选</span>
          </li>
          <li style="text-align:center;width:20%">表地址</li>
          <li style="text-align:center;width:20%">数据项名称</li>
          <li style="text-align:center;width:20%">抄表结果</li>
        </ul>
      <div class="detailtop">
       
      </div>
    </div>
  </div>
</template>
<script>
import { Taskmeterdetail, Supporttask } from "@/api/historytask";
import $ from "jquery";
var html = "";
var table = "";
var devall = "";
var count = 0;
export default {
  data() {
    return {
      di: '',
      defaultExpandAll: false,
      showCheckbox: true,
      key: 1,
      total: 0,
      success: 0,
      node: null,
      fail: 0,
      unexe:0,
      diselect: [],
      isselect: 0,
      success_rate: "",
      input: [],
      allselect: [],
      tableData5: {},
      tid:'',
      rid:'',
      starttime:'',
      freq:'',
      vcaddr:'',
      fdate:''
    };
  },
  mounted() {
    this.Getmeterdetail();
    $(document).on("click", ".dev", function(e) {
      var cls = $(e.target).attr("id");
      var IsSelect = $(this).prop("checked");
      $("." + cls).each(function(index, item) {
        $(this).prop("checked", IsSelect);
      });
    });
    $(document).on("click", "#allselect", function(e) {
      var select = $(this).prop("checked");
      $("input").each(function(index, item) {
        $(this).prop("checked", select);
      });
    });
    $(".supplementnow").click(function() {});
  },
  methods: {
    Getmeterdetail() {
    
     
      this.tid = this.$route.query.tid;
      this.rid = this.$route.query.rid;
      this.vcaddr = this.$route.query.vcaddr
      this.starttime = this.$route.query.starttime
      this.fdate = this.$route.query.fdate
      this.di=this.$route.query.di;
      this.freq = this.$route.query.freq
         html=''
      Taskmeterdetail(this.tid,this.rid,this.starttime,this.vcaddr,this.freq,this.fdate,this.di).then(
        response => {
          if(response){
            $.each(response.data, function(key, value) {
            table = "";
            response.data[key].map(item => {
              if (item.result == "fail") {
                item.result = "失败";
              } else if(item.result=="success") {
                item.result = "成功";
              }else{
                item.result = "未执行"
              }
              table +=
                '<tr class="' +
                key +
                '"><td style="width:10%;text-align:center"><input type="checkbox" class="dev meter ' +
                "dev" +
                count +
                '" addr="' +
                item.addr +
                '" di="' +
                item.di +
                '" pn="' +
                item.pn +
                '" ></td><td style="width:20%;text-align:center">' +
                item.addr +
                '</td><td style="width:20%;text-align:center">' +
                item.di +
                '</td><td style="width:20%;text-align:center">' +
                item.result +
                '</td><td style="width:30%;text-align:center">' +
                "</td></tr>";
            });
            html +=
              '<div class="panel panel-default"><div class="panel-heading" style="background:#dddddd;padding: 10px 15px;border-bottom: 1px solid transparent;border-top-left-radius: 3px;border-top-right-radius: 3px;"><input type="checkbox" id="' +
              "dev" +
              count++ +
              '" class="dev "><span style="margin-left:30px;">DevEui:' +
              key +
              '</span></div><table class="table  ' +
              key +
              '" style="background-color:white;width:60%;">' +
              table +
              "</table></div>";
            devall += response.data[key].length;
          });
          $(html).appendTo($('.detailtop'))
          this.tableData5 = response.data;
          this.total = response.all;
          this.success = response.success;
          this.fail = response.fail;
          this.unexe = response.unexe
          this.success_rate = response.success_rate + "%";
          }
          
        }
      );
    },
    Supplement() {
      var sendup = [];
      var _this=this
       var obj={
          datetime:Number(_this.starttime),
          taskid:Number(_this.id),
          vcaddr:_this.vcaddr,
          di:_this.di,
          pn:[],
          tattr:4
        }
      $("input.meter:checked").each(function(index, item) {
        obj.pn.push(
         Number(item.getAttribute("pn")), 
        );
      });
       if(obj.pn==0){
        _this.$message({
          type:'warning',
          message:'请勾选要补抄的电表'
        })
      }else{
        Supporttask(obj)
        .then(response => {
          if (response) {
            this.$message({
              message: "补抄成功",
              type: "success"
            });
            $(".detailtop").html('');
            this.Getmeterdetail()
          } 
        })
        .catch(error => {
          this.$message({
              message: "补抄失败",
              type: "warning"
            });
        });
      }
      
    }
  }
};
</script>
<style scoped>
.meterdetail {
  min-height: 800px;
  background: white;
  padding: 20px;
  box-sizing: border-box;
  overflow: scroll;
}
.top {
  width: 100%;
  height: 150px;
  margin-top: 20px;
  padding-top: 50px;
  box-sizing: border-box;
  background: #ffffff;
  border: 1px solid #cccccc;
}
.top div {
  width: 16.6%;
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
.top div:nth-child(4) {
  border-right: 1px solid #cccccc;
}
.top div:nth-child(5) {
  border-right: 1px solid #cccccc;
}
.top div span {
  color: rgba(0, 0, 0, 0.447058823529412);
}
.quickly {
  width: 100%;
  height: 50px;
  padding-top: 20px;
}
.block {
  margin-top: 30px;
}
.devdetail {
  width: 100%;
  height: auto;
  padding: 20px 0;
  box-sizing: border-box;
  margin-top: 20px;
  border: 1px solid #cccccc;
}
.devdetail .detailtop {
  width: 100%;
  height: 40px;
  line-height: 40px;
  margin-top:40px;
}
.devdetail ul li {
  float: left;
  list-style: none;
  text-align: center;
}
.detailtop ul {
  height: 40px;
}
</style>
