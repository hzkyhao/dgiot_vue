
<template>
  <div class="analysis">
    <div class="title1">
      <p style="padding:0;margin:0">
        温岭水泵行业可视化大数据
       
        <span style="float:right;font-size:20px;">
            <!-- <span>{{list.city}}</span><br/>
            <span>当前温度：{{list.wendu}}</span><br/> -->
           {{readtime}}</span>
      </p>
    </div>
    <!--数据一-->
    <div class="analysisheader">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="title">
            <span>销售增长</span>
          </div>
          <div class="grid-content bg-purple">
            <bar-chart :barchartdata="barchartdata" />
          </div>
        </el-col>
        <el-col :span="12">
          <!-- <el-col :span="12"> -->
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="title">水泵年产量</div>
              <div class="grid-content bg-purple">
                <div class="bmpchart" style="width:100%;">
                  <PanelGroup />
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="title">水泵年产量</div>
              <div class="grid-content bg-purple">
                <LineChart1 :chart-data="lineChartData" />
              </div>
            </el-col>
          </el-row>
          <!-- </el-col> -->
        </el-col>
        <el-col :span="6">
          <div class="title">产品内销比重</div>
          <div class="grid-content bg-purple">
            <LineChart2 :chart-data="lineChartData1" />
          </div>
        </el-col>
      </el-row>
    </div>
    <!--数据二-->
    <div class="analysisheader">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="title">水泵规模以上企业数量</div>
          <div class="grid-content bg-purple">
            <bar-chart2 :persondata="persondata" />
          </div>
        </el-col>
        <el-col :span="12">
          <!-- <div class="grid-content bg-purple"> -->
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="title">年平均从业人员</div>
              <div class="grid-content bg-purple">
                <bar-chart1 :regionpdata="regionpdata1" />
              </div>
            </el-col>
            <el-col :span="12">
              <div class="title">新产品产值率</div>
              <div class="grid-content bg-purple">
                <bar-chart1 :regionpdata="regionpdata2" />
              </div>
            </el-col>
          </el-row>
          <!-- </div> -->
        </el-col>
        <el-col :span="6">
          <div class="title">科技投入占比</div>
          <div class="grid-content bg-purple">
            <PieChart />
          </div>
        </el-col>
      </el-row>
    </div>
    <!--数据三-->
    <div class="analysisheader">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="title">重点企业在职人数/本科学历人数</div>
          <div class="grid-content bg-purple">
            <bar-chart3 :regionpdata="regionpdata3" />
          </div>
        </el-col>
        <el-col :span="12">
          <!-- <div class="grid-content bg-purple"> -->
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="title">从业人员分布_利欧泵业(5429人)</div>
              <div class="grid-content bg-purple">
                <PieChart1 :businessdata="lioudata" />
              </div>
            </el-col>
            <el-col :span="12">
              <div class="title">从业人员分布_大元泵业(1581人)</div>
              <div class="grid-content bg-purple">
                <PieChart1 :businessdata="dayuandata" />
              </div>
            </el-col>
          </el-row>
          <!--饼图第二块-->
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="title">从业人员分布_新界泵业(2426人)</div>
              <div class="grid-content bg-purple">
                <PieChart1 :businessdata="xinjiedata" />
              </div>
            </el-col>
            <el-col :span="12">
              <div class="title">从业人员分布_东音(1406人)</div>
              <div class="grid-content bg-purple">
                <PieChart1 :businessdata="dongyindata" />
              </div>
            </el-col>
          </el-row>
          <!-- </div> -->
        </el-col>
        <el-col :span="6">
          <div class="title">单位专利数量</div>
          <div class="grid-content bg-purple" style="height:425px;overflow:hidden">
            <el-table
              :data="table"
              border
              style="width: 100%;text-align:center"
              :row-class-name="getChannelEnable"
            >
              <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
              <el-table-column prop="name" label="单位名称" align="center"></el-table-column>
              <el-table-column prop="value" label="专利数量" align="center"></el-table-column>
            </el-table>
            <p style="color:#ffffff">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;温岭市水泵产业集群被国家质检总局评为全国首批、省内唯一的“全国知名品牌创建示范区”，集群内拥有4家上市企业、6个中国驰名商标、20个省级名牌产品（著名商标），是省内品牌集聚度最高的县域产业集群。
              <br />
              <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;目前，规上泵企采用国际标准比率达80%，其中利欧、新界、大元3家企业主导制定的智能热水循环泵产品的能效指标优于欧洲标准13%。
            </p>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import BarChart from "../dashboard/admin/components/BarChart";
import PanelGroup from "../dashboard/admin/components/PanelGroup";
import LineChart1 from "../dashboard/admin/components/linechart1";
import LineChart2 from "../dashboard/admin/components/linechart2";
import BarChart1 from "../dashboard/admin/components/BarChart1";
import BarChart2 from "../dashboard/admin/components/BarChart2";
import BarChart3 from "../dashboard/admin/components/BarChart3";
import PieChart from "../dashboard/admin/components/PieChart";
import PieChart1 from "../dashboard/admin/components/PieChart1";
import { regionData } from "element-china-area-data";
import $ from "jquery";
const lineChartData = {
  newVisitis: {
    expectedData: [1875, 1913, 2102, 2264, 2608, 2970],
    actualData: ["2012年", "2013年", "2014年", "2015年", "2016年", "2017年"]
  },
  messages: {
    expectedData: [32.3, 35.9, 39.8, 44.2, 49, 52],
    expectedData1: [37.2, 38.1, 38.9, 39.9, 41.9, 43.7],
    actualData: ["2012年", "2013年", "2014年", "2015年", "2016年", "2017年"]
  },
  persondata: {
    data: [60, 64, 69, 74, 79, 86]
  },
  barchartdata: {
    data: [2, 9.9, 7.7, -3.8, 15.2, 23.5]
  },
  regionpdata1: {
    xdata: ["2012年", "2013年", "2014年", "2015年", "2016年", "2017年"],
    data: [1.34, 1.39, 1.43, 1.48, 1.54, 1.59],
    title: "年平均从业人员",
    formatter: "{a} <br/>{b} : {c}万人",
    name: "年平均从业人员(万人)",
    color: "#4169E1"
  },
  regionpdata2: {
    xdata: ["2012年", "2013年", "2014年", "2015年", "2016年", "2017年"],
    data: [32.3, 35.9, 39.8, 44.2, 49, 52],
    title: "新产品产值率",
    formatter: "{a} <br/>{b} : {c}%",
    name: "新产品产值率(%)",
    color: "#3CB371"
  },
  regionpdata3: {
    xdata: ["利欧泵业", "大元泵业", "新界泵业", "东音泵业"],
    alldata: [5429, 1581, 2426, 1406],
    data: [1596, 222, 311, 328],
    title1: "职工数量本科",
    title2: "总员工数",
    formatter: function(datas) {
      return `${datas[0].name}<br/>总员工：${datas[1].value}<br/>本科数量：${
        datas[0].value
      }<br/>占比：${((datas[1].value / datas[0].value) * 100).toFixed(3)}%`;
    }
  },
  lioudata: {
    title: "利欧集团",
    data: [
      { value: 2513, name: "生产人员数量" },
      { value: 1111, name: "销售人员数量" },
      { value: 517, name: "技术人员数量" },
      { value: 152, name: "财务人员数量" },
      { value: 570, name: "行政人员数量" },
      { value: 285, name: "创意人员数量" },
      { value: 281, name: "管理人员数量" }
    ]
  },
  dayuandata: {
    title: "大元集团",
    data: [
      { value: 991, name: "生产人员数量" },
      { value: 82, name: "销售人员数量" },
      { value: 175, name: "技术人员数量" },
      { value: 19, name: "财务人员数量" },
      { value: 314, name: "行政人员数量" },
      { value: 0, name: "创意人员数量" },
      { value: 0, name: "管理人员数量" }
    ]
  },
  xinjiedata: {
    title: "新界集团",
    data: [
      { value: 1560, name: "生产人员数量" },
      { value: 245, name: "销售人员数量" },
      { value: 350, name: "技术人员数量" },
      { value: 51, name: "财务人员数量" },
      { value: 220, name: "行政人员数量" },
      { value: 0, name: "创意人员数量" },
      { value: 0, name: "管理人员数量" }
    ]
  },
  dongyindata: {
    title: "东音集团",
    data: [
      { value: 987, name: "生产人员数量" },
      { value: 81, name: "销售人员数量" },
      { value: 141, name: "技术人员数量" },
      { value: 15, name: "财务人员数量" },
      { value: 180, name: "行政人员数量" },
      { value: 0, name: "创意人员数量" },
      { value: 0, name: "管理人员数量" }
    ]
  }
};
export default {
  components: {
    BarChart,
    LineChart1,
    LineChart2,
    BarChart1,
    PieChart,
    BarChart2,
    BarChart3,
    PieChart1,
    PanelGroup
  },
  data() {
    return {
      lineChartData: "",
      table: [
        {
          name: "利欧泵业",
          value: 333
        },
        {
          name: "大元泵业",
          value: 171
        },
        {
          name: "新界泵业",
          value: 166
        },
        {
          name: "东音泵业",
          value: 59
        }
      ],
      barchartdata: {
        data: []
      },
      lineChartData1: {},
      persondata: {},
      regionpdata1: {},
      regionpdata2: {},
      regionpdata3: {},
      lioudata: {},
      dayuandata: {},
      xinjiedata: {},
      dongyindata: {},
      center: { lng: 0, lat: 0 }, //经纬度
      zoom: 13, //地图展示级别
      readtime: "",
      list:{}
    };
  },
  mounted() {
    this.lineChartData = lineChartData.newVisitis;
    this.lineChartData1 = lineChartData.messages;
    this.barchartdata = lineChartData.barchartdata;
    this.persondata = lineChartData.persondata;
    this.regionpdata1 = lineChartData.regionpdata1;
    this.regionpdata2 = lineChartData.regionpdata2;
    (this.regionpdata3 = lineChartData.regionpdata3),
      (this.lioudata = lineChartData.lioudata);
    this.dayuandata = lineChartData.dayuandata;
    this.xinjiedata = lineChartData.xinjiedata;
    this.dongyindata = lineChartData.dongyindata;
    this.$nextTick(function() {
      setInterval(this.nowtime, 1000);
    });
    // this.search()
  },
  methods: {
    getChannelEnable(row) {
      if (row.rowIndex % 2 == 0) {
        return "green_active";
      } else {
        return "red_active";
      }
    },
    // search() {
      //发送ajax请求
    //   $.ajax({
    //     type: "get",
    //     url: "http://wthrcdn.etouch.cn/weather_mini",
    //     data: {
    //       // msg在vue实例对象中 所以要用this点出来
    //       city: '杭州'
    //     },
    //     //因为返回的是json格式的字符串 可以通过dataType转js对象
    //     dataType: "json",
    //     success: backData => {
    //       console.log(backData);
    //       //通过打印的结果 可以通过数组渲染到页面上
    //       this.list = backData.data;
    //     }
    //   });
    // },
    nowtime() {
      var timestamp3 = Date.parse(new Date());
      var date = new Date(timestamp3);
      var Y = date.getFullYear() + "年";
      var M =
        (date.getMonth() + 1 <= 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "月";
      var D =
        (date.getDate() + 1 <= 10 ? "0" + date.getDate() : date.getDate()) +
        "日  ";
      var h =
        (date.getHours() + 1 <= 10 ? "0" + date.getHours() : date.getHours()) +
        ":";
      var m =
        (date.getMinutes() + 1 <= 10
          ? "0" + date.getMinutes()
          : date.getMinutes()) + ":";
      var s =
        date.getSeconds() + 1 <= 10
          ? "0" + date.getSeconds()
          : date.getSeconds();
      this.readtime = Y + M + D + h + m + s;
    }
  }
};
</script>
<style lang="scss" scoped>
.analysis {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  background: url("../../imgages/echartbanner1.png") no-repeat;
  background-size: cover;
  .title {
    width: 100%;
    font-size: 16px;
    color: #ffffff;
  }
  .title1 {
    width: 100%;
    height: 40px;
    font-size: 28px;
    text-align: center;
    color: #ffffff;
  }
  .analysisheader {
    width: 100%;
    margin-top: 10px;
    /deep/ .grid-content {
      border: 2px solid #07a7ff;
    }
  }
  /deep/ .bmpchart {
    height: 100%;
    width: 100%;
    //   display: flex;
    //   flex-wrap: wrap;
    // div{
    //    width:223px;
    //    height:135px;
    //    border:2px solid red;
    //    border-radius:10px;
    // }
    //  background: url("../../imgages/bmpbanner.png") no-repeat;
    //   background-size: cover;
  }
  /deep/ .green_active {
    background: #171b3d;
    color: #409ab5;
  }
  /deep/ .red_active {
    color: #409ab5;
    background: #1c0c64;
    border-radius: 5px;
  }
  /deep/ th {
    background: #171b3d;
    color: #409ab5;
  }
  /deep/ .el-table {
    background: #171b3d;
  }
}
</style>
<style >
</style>
