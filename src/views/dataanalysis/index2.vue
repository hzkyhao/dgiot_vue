<template>
  <div class="index2">
    <div class="index2header">水泵质量比对大数据分析</div>
    <div class="index2header2">水泵质量比对大数据展示</div>
    <div
      style="position: absolute;
    top: 2px;
    right: 150px;
    height: 100px;
    color: white;
    z-index: 100;"
    >{{ this.readtime }}</div>
    <div class="index2content">
      <div class="contentheader">
        <el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini">
          <el-form-item>
            <el-select v-model="formInline.region" placeholder="全部地区">
              <el-option label="区域一" value="shanghai"/>
              <el-option label="区域二" value="beijing"/>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="formInline.region" placeholder="全部企业">
              <el-option label="区域一" value="shanghai"/>
              <el-option label="区域二" value="beijing"/>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="formInline.region" placeholder="检验批次">
              <el-option label="区域一" value="shanghai"/>
              <el-option label="区域二" value="beijing"/>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="contentchart">
        <div class="contentchartleft">
          <div class="lefttop">
            <el-row :gutter="20">
              <el-col :span="16">
                <div class="grid-content bg-purple">
                  <!--水泵扬程-->
                  <yangcheng :chart-data="yangchengdata" />
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content bg-purple"/>
                <div
                  style="width:100%;height:100%;padding:20px 0;display:flex;align-items:center;justify-content:center;"
                >
                  <div style="height:200px;width:150px;background:#094158">
                    <p style="text-align:center;height:100px;color:white;line-height:50px;">本项合格率</p>
                    <p style="text-align:center;color:yellow;font-size:20px;">98.5%</p>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="leftcenter">
            <el-row :gutter="10">
              <el-col :span="16">
                <div class="grid-content bg-purple">
                  <!--流量-->
                  <liuliang :regionpdata="regionpdata3" />
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content bg-purple">
                  <!--流量饼图-->
                  <liuliang1 />
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="leftbottom">
            <el-row :gutter="20">
              <el-col :span="16">
                <div class="grid-content bg-purple">
                  <!--效率-->
                  <xiaolv />
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content bg-purple">
                  <!--效率饼图-->
                  <xiaolv1 :businessdata="xiaolv1data" />
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <!--中间-->
        <div class="contentchartcenter">
          <div class="centerheader">
            <img src="../../imgages/pumpdata.png" alt >
          </div>
          <div class="centerbottom">
            <div style="height:50px;width:100%;display:flex;justify-content: space-between;">
              <span style="line-height: 40px;color:#1090db;">水泵质量检测合格率Top:10</span>
              <span>
                <el-button-group>
                  <el-button
                    :class="!isshowtable ? 'buttonactive':''"
                    type="primary"
                    plain
                    size="small"
                    @click="isshowtable=false"
                  >本期</el-button>
                  <el-button
                    :class="isshowtable ? 'buttonactive':''"
                    type="primary"
                    plain
                    size="small"
                    @click="isshowtable=true"
                  >上一期</el-button>
                </el-button-group>
              </span>
            </div>
            <div class="centerbottomtable">
              <el-table :data="tableData" :row-class-name="getChannelEnable" style="width: 100%;text-align:center" height="300">
                <el-table-column label="企业排名" type="index" width="100" align="center"/>
                <el-table-column prop="address" label="企业名称" align="center" width="250"/>
                <el-table-column prop="name" label="合格率" align="center"/>
                <el-table-column label="排名变化" align="center" >
                  <template slot-scope="scope">
                    <span :style="{'color':(scope.$index%2 ? 'red' :'green')}">{{ scope.row.date }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <!--最右边-->
        <div class="contentchartright">
          <div class="rightheader">
            <div class="rightheadertop">
              <ul>
                <li>
                  <p>检测数量</p>
                  <span>26000</span>
                </li>
                <li>
                  <p>合格数量</p>
                  <span>25090</span>
                </li>
                <li>
                  <p>总体合格率</p>
                  <span>96.5%</span>
                </li>
              </ul>
            </div>
            <div class="rightheaderbottom">
              <ul>
                <li>
                  <p>潜水螺杆泵</p>
                  <div class="radius">95.5%</div>
                </li>
                <li>
                  <p>离心泵</p>
                  <div class="radius">96.5%</div>
                </li>
                <li>
                  <p>小型潜水泵</p>
                  <div class="radius">97%</div>
                </li>
                <li>
                  <p>污水潜水泵</p>
                  <div class="radius">96%</div>
                </li>
                <li>
                  <p>微型泵</p>
                  <div class="radius">96.4%</div>
                </li>
              </ul>
            </div>
          </div>
          <!--右边底部-->
          <div class="rightbottom">
            <el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini">
              <el-form-item>
                <el-select v-model="formInline.region" placeholder="全部地区">
                  <el-option label="区域一" value="shanghai"/>
                  <el-option label="区域二" value="beijing"/>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-select v-model="formInline.region" placeholder="全部企业">
                  <el-option label="区域一" value="shanghai"/>
                  <el-option label="区域二" value="beijing"/>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-select v-model="formInline.region" placeholder="检验批次">
                  <el-option label="区域一" value="shanghai"/>
                  <el-option label="区域二" value="beijing"/>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
              </el-form-item>
            </el-form>
            <xingneng :regionpdata="regionpdata3" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import yangcheng from '@/components/zhiliang/yangcheng'
import liuliang from '@/components/zhiliang/liuliang'
import liuliang1 from '@/components/zhiliang/liuliang1'
import xiaolv from '@/components/zhiliang/xiaolv'
import xiaolv1 from '@/components/zhiliang/xiaolv1'

import xingneng from '@/components/zhiliang/xingneng'
export default {
  components: {
    yangcheng,
    liuliang,
    liuliang1,
    xiaolv,
    xiaolv1,
    xingneng

  },
  data() {
    return {
      formInline: {
        user: '',
        region: ''
      },
      yangchengdata: {},
      regionpdata3: {},
      xiaolv1data: {},
      readtime: '',
      isshowtable: false,
      tableData: [{
        date: '上升一位',
        name: '98.95%',
        address: '浙江东音泵业有限公司'
      }, {
        date: '下降一位',
        name: '98.92%',
        address: '新界泵业集团股份有限公司'
      }, {
        date: '上升一位',
        name: '98.75%',
        address: '浙江格凌实业有限公司'
      }, {
        date: '下降一位',
        name: '98.60%',
        address: '浙江大世纪泵业有限公司'
      },
      {
        date: '上升一位',
        name: '98.31%',
        address: '浙江远东泵业有限公司'
      },
      {
        date: '下降一位',
        name: '98.20%',
        address: '台州福蛙机电有限公司'
      },
      {
        date: '上升一位',
        name: '97.95%',
        address: '台州金步泵业有限公司'
      },
      {
        date: '下降一位',
        name: '97.65%',
        address: '浙江巨龙泵业有限公司'
      },
      {
        date: '上升一位',
        name: '97.25%',
        address: '温岭市宇森机电有限公司'
      }
      ]
    }
  },
  mounted() {
    this.yangchengdata = {
      expectedData: [1875, 200, 500, 2500, 2608, 2970],
      expectedData1: [1600, 1700, 1800, 1200, 2608, 2970],
      actualData: ['2012', '2013', '2014', '2015', '2016', '2017'],
      title: '水泵扬程分布'
    }
    this.regionpdata3 = {
      xdata: ['2019-00001', '2019-00002', '2019-00003', '2019-00004', '2019-00005', '2019-00006', '2019-00007', '2019-00008', '2019-00009', '2019-00010', '2019-00011'],
      alldata: [0.9895, 0.9892, 0.9875, 0.9860, 0.9832, 0.9820, 0.9795, 0.9765, 0.9725, 0.9720, 0.9712],
      title2: '流量',
      formatter: function(datas) {
        return `${datas[0].name}<br/>流量：${datas[0].value}<br/>`
      }
    }
    this.xiaolv1data = {
      title: '效率',
      data: [
        { value: 25, name: '001' },
        { value: 30, name: '002' },
        { value: 51, name: '003' },
        { value: 15, name: '004' }
      ]
    }

    this.$nextTick(function() {
      setInterval(this.nowtime, 1000)
    })
  },
  methods: {
    nowtime() {
      var timestamp3 = Date.parse(new Date())
      var date = new Date(timestamp3)
      var Y = date.getFullYear() + '年'
      var M =
        (date.getMonth() + 1 <= 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1) + '月'
      var D =
        (date.getDate() + 1 <= 10 ? '0' + date.getDate() : date.getDate()) +
        '日  '
      var h =
        (date.getHours() + 1 <= 10 ? '0' + date.getHours() : date.getHours()) +
        ':'
      var m =
        (date.getMinutes() + 1 <= 10
          ? '0' + date.getMinutes()
          : date.getMinutes()) + ':'
      var s =
        date.getSeconds() + 1 <= 10
          ? '0' + date.getSeconds()
          : date.getSeconds()
      var mydate = new Date()
      var myddy = mydate.getDay() // 获取存储当前日期
      var weekday = [
        '星期日',
        '星期一',
        '星期二',
        '星期三',
        '星期四',
        '星期五',
        '星期六'
      ]
      this.readtime = Y + M + D + h + m + s + '　' + weekday[myddy]
    },
    getChannelEnable(row) {
      if (row.rowIndex % 2 == 0) {
        return 'green_active'
      } else {
        return 'red_active'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.index2 {
  width: 100%;
  min-height: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  background: url("../../imgages/pumpbanner.jpg");
  background-size: cover;
  .index2header {
    height: 50px;
    width: 100%;
    text-align: center;
    color: white;
    line-height: 50px;
    font-size: 20px;
  }
  .index2header2 {
    width: 100%;
    text-align: center;
    color: #cccccc;
    font-size: 16px;
    line-height: 2;
  }
  .index2content {
    width: 100%;
    height: auto;
    padding: 20px;
    box-sizing: border-box;
    /deep/ .el-input--mini .el-input__inner {
      background: #009dca;
      color: white;
    }
    /deep/ .el-select {
      width: 150px;
    }
    .contentchart {
      width: 100%;
      height: 100%;
      display: flex;
      .contentchartleft {
        width: 33%;
        height: 100%;
        border: 1px solid red;
        .lefttop {
          width: 100%;
          height: 250px;
          //   background:red;
        }
        .leftcenter {
          width: 100%;
          height: 250px;
          margin: 10px 0;
          box-sizing: border-box;

          //   background:chartreuse
        }
        .leftbottom {
          width: 100%;
          height: 250px;
          //   background:brown;
        }
      }
      .contentchartcenter {
        width: 33%;
        height: 100%;
        border: 1px solid green;
        margin: 0 20px;
        .centerheader {
          height: 375px;
          width: 100%;
          background: white;
          margin-bottom: 20px;
          img {
            width: 100%;
            height: 375px;
          }
        }
        .centerbottom {
          height: 375px;
          width: 100%;
          padding: 20px;
          box-sizing: border-box;
          .buttonactive {
            background-color: #409eff;
            color: white;
          }
        }
      }
      .contentchartright {
        width: 33%;
        height: 100%;
        border: 1px solid yellow;
        .rightheader {
          width: 100%;
          height: 375px;
          margin-bottom: 20px;
          .rightheadertop {
            padding-top: 50px;
            box-sizing: border-box;
            ul {
              margin: 0;
              li {
                list-style: none;
                display: inline-block;
                width: 120px;
                height: 120px;
                border: 10px solid #06477c;
                border-radius: 50%;
                margin: 0 20px;
                text-align: center;
                p {
                  color: white;
                }
                span {
                  color: #63a9c5;
                }
              }
            }
          }
          .rightheaderbottom {
            ul {
              margin: 0;
              display: flex;
              justify-content: space-around;
              margin-top: 35px;
              li {
                list-style: none;
                p {
                  color: white;
                  text-align: center;
                }
                div {
                  width: 80px;
                  height: 80px;
                  border: 5px solid #01c49a;
                  border-radius: 50%;
                  text-align: center;
                  line-height: 80px;
                  color: #369852;
                  font-weight: bold;
                }
              }
            }
          }
        }
        .rightbottom {
          height: 375px;
          width: 100%;
          padding: 0 0 0 20px;
          box-sizing: border-box;
        }
      }
    }
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
    th[class*='is-leaf']{
       border:0;
    }
  }
  /deep/ td{
    border:0;
    height:25px;
  }
}
</style>
<style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
  .index2 .el-table td{
     padding:0;
  }
</style>
