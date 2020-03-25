<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import { debounce } from "@/utils";
import { regionData } from "element-china-area-data";

const animationDuration = 6000;

export default {
  props: {
    className: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "250px"
    },
    regionpdata: {
      type: Object,
      default: () => {
        return {
          xdata: [],
          data: [],
          alldata: [],
          title1: "",
          title2: ""
        };
      }
    }
  },
  data() {
    return {
      chart: null
    };
  },
  watch: {
    regionpdata: {
      deep: true,
      handler(val) {
        this.initChart(val);
      }
    }
  },
  mounted() {
    this.initChart(this.regionpdata);
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize();
      }
    }, 100);
    window.addEventListener("resize", this.__resizeHandler);
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    window.removeEventListener("resize", this.__resizeHandler);
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart(regionpdata) {
      this.chart = echarts.init(this.$el, "macarons");
      this.chart.setOption({
        // color: ["#8EC9EB"],
        legend: {
          data: ["水泵效率η分布"],
           textStyle:{
              color:'white'
          }
        },
        tooltip: {
          trigger: "axis",
          formatter: "效率η : <br/>{b} : {c}",
         
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "value",
          splitLine: {
            show: false
          },
          axisLabel: {
            formatter: "{value} "
          }
        },
        yAxis: {
          type: "category",
          axisLine: { onZero: false },
          axisLabel: {
            formatter: "{value}"
          },
          boundaryGap: true,
          data: ['2019-00001', '2019-00002', '2019-00003', '2019-00004', '2019-00005', '2019-00006', '2019-00007', '2019-00008', '2019-00009', '2019-00010', '2019-00011']
        },
        series: [
          {
            name: "水泵效率η分布",
            type: "bar",
            smooth: true,
            barCategoryGap: 25,
             barWidth: '60%',
            lineStyle: {
              normal: {
                width: 10,
                shadowColor: "white",
                shadowBlur: 10,
                shadowOffsetY: 10
              }
            },
            data: [21.903, 20.181, 19.635, 20.076, 22.113, 21.336, 20.37, 22.281, 22.113, 20.286, 22.092],
            markLine: {
                symbol:'none',//去掉箭头
                silent: false,
                data: [{
                    name:'告警线',
                    yAxis: 21,
                    label:{
                      show:false,
                      position:'end',
                    },
                    lineStyle:{
                      type:'solid',
                      color:'green'
                    }
                },
                {
                    name:'111',
                    yAxis: 19.74,
                    label:{
                      show:true,
                      position:'middle',
                      
                    },
                     lineStyle:{
                      type:'dashed',
                      color:'green'
                    }
                }]
            },
          }
        ]
      });
    }
  }
};
</script>
