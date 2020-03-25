<template>
  <div class="zetadevices">
     <!-- <ResourceZeta
      style="width:360px;height:100vh;overflow:scroll;flex-shrink:0;padding:10px;"
    /> -->
    <!-- <div style="width:calc(100% - 360px);padding-left:10px;"> -->
      <div class="zetaheader">
      <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
        <el-form-item :label="$t('zetadevices.terminaltype')">
          <el-select v-model="formInline.zetagtype" :placeholder="$t('zetadevices.terminaltype')">
            <el-option label="ZETAGLabel" value="ZETAG"></el-option>
          </el-select>
          <el-form-item :label="$t('zetadevices.terminalmodel')">
            <el-select v-model="formInline.zetag">
              <el-option label="ZETAG AP" value="AP" disabled></el-option>
              <el-option label="ZETAG C1" value="C1" disabled></el-option>
              <el-option label="ZETAG C2" value="C2"></el-option>
              <el-option label="ZETAG P1" value="P1" disabled></el-option>
            </el-select>
          </el-form-item>
        </el-form-item>
        <el-form-item :label="$t('zetadevices.labelnumber')">
          <el-input v-model="formInline.number" :placeholder="$t('zetadevices.labelnumber')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('zetadevices.devicestatus')">
          <el-select v-model="formInline.status" :placeholder="$t('zetadevices.devicestatus')">
            <el-option :label="$t('zetadevices.open')" :value="1"></el-option>
            <el-option :label="$t('zetadevices.close')" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getZeTag(formInline.number)">{{$t('developer.search')}}</el-button>
          <el-button type="primary" @click="resetForm">{{$t('zetadevices.reset')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--中间tag标签展示-->
    <div class="zetacontent">
      <div class="zetag" v-for="(items,index) in nowdata" :key="index">
        <div class="zetagleft">
          <img :src="zetagurl" alt />
        </div>
        <div class="zetagright">
          <p>
            {{'ZETAG'+$t('zetadevices.label')}}
            <span style="color:green">{{'('+items.zetagid+')'}}</span>
            <span
              style="float:right;"
              :style="{'color': items.status!=1 ? 'green' : 'red'}"
            >{{items.status!=1 ? $t('zetadevices.open') : $t('zetadevices.close')}}</span>
          </p>
          <p>
            <span>{{$t('zetadevices.model')+':C2'}}</span>
            <span style="float:right;">{{$t('zetadevices.sendingtimes')+':'+items.times}}</span>
          </p>
          <p>
           {{$t('zetadevices.lastreportingtime')}}
            <span style="color:#84f">{{timestampToTime(items.timestamp)}}</span>
          </p>
          <p>
            <span style="vertical-align:sub">{{$t('zetadevices.latestlocation')+':'}}</span>
            <span style="float:right">
              <el-button
                type="primary"
                size="mini"
                @click="locusSearch(items.zetagid,items.timestamp)"
              >{{$t('zetadevices.trackquery')}}</el-button>
            </span>
          </p>
          <p>
            <span>N：{{(items.lat).toFixed(6)}}</span>
            <span style="margin-left:5px;">E：{{(items.long).toFixed(6)}}</span>
          </p>
        </div>
      </div>
    </div>
    <!--分页-->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[20,40,60,80]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <!--轨迹dialog-->
    <el-dialog :title="$t('zetadevices.trackquery')" :visible.sync="dialogTableVisible">
      <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
        <el-tab-pane :label="$t('equipment.chart')" name="first">
          <div ref="map" class="map" id="map" style="height:600px;width:100%"></div>
        </el-tab-pane>
        <el-tab-pane :label="$t('equipment.table')" name="second">
          <el-table
            :data="tableData.slice((start1-1)*pagesize1,start1*pagesize1)"
            style="width:100%;text-align:center"
          >
            <el-table-column
              :label="$t('equipment.serialnumber')"
              type="index"
              align="center"
              width="100"
              :index="(index)=>{return (index+1) + (start1-1)*pagesize1}"
            ></el-table-column>
            <el-table-column property="zetagid" :label="$t('equipment.devicenumber')" align="center"></el-table-column>
            <el-table-column :label="$t('zetadevices.positioninformation')" align="center" width="250">
              <template slot-scope="scope">
                <span>N：{{Number(scope.row.lat).toFixed(6)}}</span>
                <span style="margin-left:5px;">E：{{Number(scope.row.long).toFixed(6)}}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column label="信号强度" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.rssi+'dBm'}}</span>
              </template>
            </el-table-column> -->
            <el-table-column :label="$t('zetadevices.reportingtime')" align="center" width="250">
              <template slot-scope="scope">
                <span>{{timestampToTime(scope.row.timestamp)}}</span>
              </template>
            </el-table-column>
          </el-table>
          <div class="block">
            <el-pagination
              @size-change="handleSizeChange1"
              @current-change="handleCurrentChange1"
              :page-sizes="[5, 20, 30, 40]"
              :page-size="pagesize1"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total1"
            ></el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">{{$t('devloper.cancel')}}</el-button>
        <el-button type="primary" @click="dialogTableVisible = false">{{$t('devloper.determine')}}</el-button>
      </div>
    </el-dialog>
    
  </div>
</template>
<script>
// import ResourceZeta  from "@/components/resource/zetaindex";
import "echarts/extension/bmap/bmap";
import { ZetaEtag, ZetaEtagHistroy, ZetaEtagTopn } from "@/api/zeta";
import { generateTitle } from '@/utils/i18n'
import Cookies from 'js-cookie';
export default {
  // components:{
  //   ResourceZeta
  // },
  data() {
    return {
      dialogTableVisible: false,
      activeName: "first",
      tableData: [],
      bmapdata: [],
      formInline: {
        zetag: "C2",
        zetagtype: "ZETAG",
        number: "",
        status: 1
      },
      start: 0,
      pagesize: 20,
      total: 0,
      zetagurl: require("../../imgages/zetag1.png"),
      readtime: "",
      nowdata: [
        // {"apuid":"1008930D","lat":0.1231456,"long":0.1751851,"moduid":"10058526","rssi":-255.0,"status":1,
        // "times":65535,"timestamp":1569055328,"version":"V1.1","zetagid":"10081BDF"},
        //  {"apuid":"1008930D","lat":0.807802,"long":0.752107,"moduid":"10058526","rssi":-255.0,"status":1,
        // "times":65535,"timestamp":1569055328,"version":"V1.1","zetagid":"10082BDF"},
        //  {"apuid":"1008930D","lat":0.106807,"long":0.275107,"moduid":"10058526","rssi":-255.0,"status":1,
        // "times":65535,"timestamp":1569055328,"version":"V1.1","zetagid":"10083BDF"},
        //  {"apuid":"1008930D","lat":0.108080,"long":0.755207,"moduid":"10058526","rssi":-255.0,"status":1,
        // "times":65535,"timestamp":1569055328,"version":"V1.1","zetagid":"10084BDF"},
        //  {"apuid":"1008930D","lat":0.106807802,"long":0.755217,"moduid":"10058526","rssi":-255.0,"status":1,
        // "times":65535,"timestamp":1569055328,"version":"V1.1","zetagid":"10085BDF"},
      ],
      // obj:{"trace":[{"apuid":"1008930D","lat":0.106807802,"long":0.275752107,"moduid":"10058526","rssi":-60.0,"status":1,"times":65535,"timestamp":1569054446},{"apuid":"1008930D","lat":0.106807802,"long":0.275752107,"moduid":"10058526","rssi":-50.0,"status":1,"times":65535,"timestamp":1569054142},{"apuid":"1008930D","lat":0.106807802,"long":0.275752107,"moduid":"10058526","rssi":-40.0,"status":1,"times":65535,"timestamp":1569052847},{"apuid":"1008930D","lat":0.106807802,"long":0.275752107,"moduid":"10058526","rssi":-80.0,"status":1,"times":65535,"timestamp":1569044318},{"apuid":"1008930D","lat":0.106807802,"long":0.275752107,"moduid":"10058526","rssi":-90.0,"status":1,"times":65535,"timestamp":1569044203},{"apuid":"1008930D","lat":0.106807802,"long":0.275752107,"moduid":"10058526","rssi":-85.0,"status":1,"times":65535,"timestamp":1569041798},{"apuid":"1008930D","lat":0.106807802,"long":0.275752107,"moduid":"10058526","rssi":-86.0,"status":1,"times":65535,"timestamp":1568980456},{"apuid":"1008930D","lat":0.106807802,"long":0.275752107,"moduid":"10058526","rssi":-76.0,"status":1,"times":65535,"timestamp":1568979355},{"apuid":"1008930D","lat":0.106807802,"long":0.275752107,"moduid":"10058526","rssi":-75.0,"status":1,"times":65535,"timestamp":1568975229}],
      // "version":"V1.1","zetagid":"10081BDF"},
      start1: 1,
      pagesize1: 5,
      total1: 0,
      // isshow:false
      chart: this.$echarts.ECharts,
      bmap: {},
      mapZoom: 6,
      plainPath: `path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z`,
      trainIcon: `path://M30.9,53.2C16.8,53.2,5.3,41.7,5.3,27.6S16.8,2,30.9,2C45,2,56.4,13.5,56.4,27.6S45,53.2,30.9,53.2z M30.9,3.5C17.6,3.5,6.8,14.4,6.8,27.6c0,13.3,10.8,24.1,24.101,24.1C44.2,51.7,55,40.9,55,27.6C54.9,14.4,44.1,3.5,30.9,3.5z M36.9,35.8c0,0.601-0.4,1-0.9,1h-1.3c-0.5,0-0.9-0.399-0.9-1V19.5c0-0.6,0.4-1,0.9-1H36c0.5,0,0.9,0.4,0.9,1V35.8z M27.8,35.8 c0,0.601-0.4,1-0.9,1h-1.3c-0.5,0-0.9-0.399-0.9-1V19.5c0-0.6,0.4-1,0.9-1H27c0.5,0,0.9,0.4,0.9,1L27.8,35.8L27.8,35.8z`
    };
  },
  mounted() {
    this.getCurrentData();
    this.$nextTick(function() {
      setInterval(this.nowtime, 1000);
    });
  },
  methods: {
    //地图操作
    initMap(origindata, centerdata) {
      // echarts配置
      this.getLineSeries(origindata);
      this.getScatterSeries(origindata);
      origindata.length == 0 ? (this.effectScatterSeries = []) : this.getEffectScatterSeries(origindata);
      this.chart = this.$echarts.init(this.$refs.map);
      this.chart.setOption({
        animation: false,
        legend: {
          orient: "vertical",
          top: 30,
          left: 30,
          data: origindata.map(v => v.name),
          textStyle: {
            color: "#222222"
          },
          selectedMode: "multiple"
        },
        bmap: {
          // 加载 bmap 组件
          center: centerdata,
          zoom: 12, // 地图当前的缩放比例
          roam: true, // 开启鼠标缩放和平移漫游
          scaleLimit: { min: 6, max: 12 } // echarts设置地图最小最大缩放比例的接口不起作用，要使用百度地图的接口设置
        },
        series: [
          ...this.linesSeries, // 带有起点和终点信息的线数据的绘制
          ...this.scatterSeries, // 散点（气泡）图
          ...this.effectScatterSeries // 带有涟漪特效动画的散点（气泡）图
        ]
      });
      // 获取百度地图实例，使用百度地图自带的控件
      this.bmap = this.chart
        .getModel()
        .getComponent("bmap")
        .getBMap();
      this.bmap.setMinZoom(6); // 设置地图最小缩放比例
      this.bmap.setMaxZoom(24); // 设置地图最大缩放比例
      // this.bmap.addControl(new BMap.MapTypeControl({ mapTypes: [] })) // 不显示地图右上方的控件
      this.bmap.addControl(
        new BMap.ScaleControl({ anchor: BMAP_ANCHOR_BOTTOM_LEFT })
      ); // 在左下角显示比例尺控件
      const _this = this;
      // 监听地图比例缩放， 可以根据缩放等级控制某些图标的显示
      this.bmap.addEventListener("zoomend", function() {
        _this.mapZoom = _this.bmap.getZoom();
      });
      // this.bmap.setMapStyleV2({
      //   styleId: '7b93b720528698c2c2cfe0294dd45eed'
      //   });
    },
  
    //地图直线
    getLineSeries(data) {
      let series = [];
      data.forEach(line => {
        series.push({
          name: line.name,
          type: "lines",
          coordinateSystem: "bmap", // 使用百度地图的坐标系
          silent: true, // 图形不响应和触发鼠标事件
          polyline: true,
          lineStyle: { color: line.primaryColor },
          effect: {
            show: true,
            period: 15, //箭头指向速度，值越小速度越快
            trailLength: 0.02, //特效尾迹长度[0,1]值越大，尾迹越长重
            symbol: this.plainPath, //箭头图标
            symbolSize: 20, //图标大小
            color:'blue',
          },
          lineStyle: {
            color: "green",
            normal: {
              width: 1, //尾迹线条宽度
              opacity: 1, //尾迹线条透明度
              curveness: 0.3 //尾迹线条曲直度
            }
          },
          z: 3,
          data: [
            {
              // 浅色底线
              coords: [
                data[0].stations[0].value,
                data[0].stations[data[0].stations.length - 1].value
              ],
              // coords:line.stations.map((v,index) => v.value),
              lineStyle: {
                // 单个数据（单条线）的样式设置。
                normal: {
                  type: "dashed",
                  color: "#ff4400",
                  width: 4,
                  opacity: 0.6
                }
              }
            }
          ]
        });
      });

      this.linesSeries = series;
    },
    getScatterSeries(data) {
      let series = [];
      data.forEach(line => {
        series.push({
          name: line.name,
          type: "scatter",
          coordinateSystem: "bmap",
          symbol: "circle",
          // symbol: this.trainIcon, // 使用自定义的SVG图标
          symbolSize: 6,
          z: 2,
          label: {
            normal: {
              formatter: "{b}",
              // position: 'right',
              color: "green",
              show: true
            },
            emphasis: {
              show: true
            }
          },
          itemStyle: {
            normal: {
              color: "white",
              borderColor: "black",
              borderWidth: 1
            }
          },
          data: line.stations
        });
      });

      this.scatterSeries = series;
    },
    //当前位置涟漪图
    getEffectScatterSeries(data) {
      let series = [];
      const lange = Cookies.get('language')
      const points = [data[0].stations[data[0].stations.length - 1]];
      const lengdata = points.map(train => {
      const formatter = `{p3|\n ${lange=='zh'?'当前位置':'Latest location'}}
                           {p4|\n${lange=='zh'?'经度':'longitude'} ${train.value[0].toFixed(6)}},${lange=='zh'?'纬度':'latitude'}${train.value[1].toFixed(6)}`
        return {
          name: train.zetagid,
          itemStyle: {
            normal: {
              color: "red"
            },
            emphasis: {
              color: "red"
            }
          },
          label: {
            normal: {
              formatter,
              rich: {
                img: {
                  backgroundColor: {
                    image: train.screenshot
                  }
                }
              }
            }
          },
          value: train.value
        };
      });
      series.push({
        name: "路径",
        type: "effectScatter", // 带有涟漪特效动画的散点（气泡）图
        coordinateSystem: "bmap",
        symbol: this.trainIcon, // 使用自定义的SVG图标
        symbolSize: [10, 10],
        legendHoverLink: true,
        z: 20,
        effectType: "ripple",
        rippleEffect: {
          period: 2, // 涟漪特效的动画周期
          scale: 5, // 涟漪特效动画中波纹的最大缩放比例
          brushType: "fill" // 涟漪特效的波纹绘制方式
        },
        label: {
          // 鼠标浮动到特效点上时会显示标签
          normal: {
            show: true, //是否直接显示在地图上
            position: ["500%", "100%"],
            distance: 20,
            color: "#222222",
            align: "left",
            backgroundColor: "#FFFFFF",
            borderRadius: 5,
            padding: 10,
            shadowColor: "rgba(0,0,0,0.16)",
            shadowBlur: 6,
            shadowOffsetX: 0,
            shadowOffsetY: 3,
            width: 250,
            rich: {
              // 富文本标签样式
              // p2: {
              //   fontSize: 16,
              //   color: "#222222",
              //   fontWeight: "bolder",
              //   lineHeight: 40
              // },
              p3: {
                fontSize: 14,
                color: "#222222",
                lineHeight: 18
              },
              p3: {
                fontSize: 14,
                color: "#222222",
                lineHeight: 18
              }
            }
          },
          emphasis: {
            show: true
          }
        },
        data: lengdata
      });
      // }
      //   })
      this.effectScatterSeries = series;
    },
    timestampToTime(timestamp) {
      var date = new Date(timestamp * 1000);
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D =
        (date.getDate() + 1 <= 10 ? "0" + date.getDate() : date.getDate()) +
        " ";
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
      return Y + M + D + h + m + s;
    },
    //经纬度装换位度 分 秒
    cacuLonLat(a) {
      var degree = parseInt(a);
      var min = parseInt((a - degree) * 60);
      var sec = parseInt((a - degree) * 3600 - min * 60);
      // var msec = Math.abs(parseInt((a-degree)*360000-sec*1000)).toString().substr(0,2)
      return degree + "°" + min + "′" + sec + "″";
    },
    //本地时钟
    nowtime() {
      var timestamp3 = Date.parse(new Date());
      var date = new Date(timestamp3);
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 <= 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D =
        (date.getDate() + 1 <= 10 ? "0" + date.getDate() : date.getDate()) +
        " ";
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
    },
    //查询条件
    onSubmit() {},
    //分页
    handleSizeChange(val) {
      this.pagesize = val;
      this.getCurrentData();
    },
    handleCurrentChange(val) {
      this.start = (val - 1) * this.pagesize;
      this.getCurrentData();
    },
    getCurrentData() {
      ZetaEtagTopn(this.pagesize, this.start,this.formInline.status)
        .then(response => {
          this.nowdata = response.trace;
          this.total = response.count;
        })
        .catch(error => {
          this.$message.error(error.error);
        });
    },
    //查询tag标签
    getZeTag(tag) {
      if (tag == "") {
        this.getCurrentData();
      } else {
        this.nowdata = [];
        ZetaEtag(tag,this.formInline.status)
          .then(response => {
            //请求成功
            if (response) {
              this.nowdata.push(response);
              this.total = this.nowdata.length;
            }
          })
          .catch(error => {
            //接口数据错误时的返回
            this.$message.error(error.msg);
          });
      }
    },
        unique(arr){            
            for(var i=0; i<arr.length; i++){
                for(var j=i+1; j<arr.length; j++){
                    if(arr[i].lat==arr[j].lat&&arr[i].long==arr[j].long){         //第一个等同于第二个，splice方法删除第二个
                        arr.splice(j,1);
                        j--;
                    }
                    // if(arr[i].timestamp==arr[j].timestamp){
                    //     arr.splice(j,1)
                    //      j--
                    // }
                }
            }
            
          return arr;
    },
    objSort(prop){
        return function (obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];
        if (val1 < val2) {
            return -1;
        } else if (val1 > val2) {
            return 1;
        } else {
            return 0;
        }           
    }
},
    //历史数据tag标签
    getZetTagHistroy(tag, limit, timestamp) {
      this.start1 = 1;
      this.pagesize1 = 5;
      this.tableData = [];
      this.bmapdata = [];
      ZetaEtagHistroy(tag, limit, timestamp + 1800)
        .then(response => {
          //请求成功
         
          if (response) {
            var obj = {
              name: "",
              stations: [],
              primaryColor: "#A56743",
              bgColor: "#EDE1D9"
            };
            var x = 0;
            var y = 0;
            var arr= this.unique(response.trace)
            arr=arr.sort(this.objSort('timestamp'));
            obj.name = tag;
            arr.map(items=>{
                        obj.stations.push({
                          value: [items.lat, items.long],
                          name: items.apuid,
                        });
                        //取中心位置
                        x += items.lat;
                        y += items.long;
              }) 
              response.trace.map((items,index) => {
              items.zetagid = tag;
              this.tableData.push(items)
            });
           this.tableData = this.tableData.reverse()
            var centerx = (x / response.trace.length).toFixed(6);
            var centery = (y / response.trace.length).toFixed(6);
            this.bmapdata.push(obj);
            this.total1 = response.trace.length;
            this.initMap(this.bmapdata, [centerx, centery]);
          }
        })
        .catch(error => {
          //接口数据错误时的返回
          this.$message.error(error.msg)
        });
    },
    /*params{}object重置查询条件 */
    resetForm() {},
    /* 查询zeta便签历史*/
    locusSearch(zetagId, timestamp) {
      this.dialogTableVisible = true;
      this.getZetTagHistroy(zetagId, 50, timestamp);
    },
    //dialog分页
    handleSizeChange1(val) {
      this.start1 = 1;
      this.pagesize1 = val;
    },
    handleCurrentChange1(val) {
      this.start1 = val;
    }
  }
};
</script>
<style lang="scss" scoped>
.zetadevices {
  height: 100%;
  width: 100%;
  padding: 20px 0 20px 0 ;
  box-sizing: border-box;
  background: #fff;
  // display: flex;
  .zetacontent {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    .zetag {
      height: 140px;
      width: auto;
      border: 1px solid #000;
      display: flex;
      margin-right: 20px;
      margin-bottom: 20px;
      padding:0 10px;
      .zetagleft {
        img {
          height: 138px;
        }
      }
      .zetagright {
        margin-left: 5px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        p {
          margin: 5px 0;
          font-size: 14px;
        }
      }
    }
  }
  .block {
    margin-top: 20px;
  }
  /deep/ .el-dialog {
    width: 1000px;
     .number:last-child{
      display: inline-block;
    }
  }
  /deep/ .number:last-child{
  display: none;
  }
}
</style>
