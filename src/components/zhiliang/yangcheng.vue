<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'
import { format } from 'path'

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '250px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true,
      default: () => {
        return {
          expectedData: [],
          expectedData1: [],
          actualData: [],
          title: '1'
        }
      }
    }
  },
  data() {
    return {
      chart: null,
      sidebarElm: null
    }
  },
  // 不需要watch,watch会影响首次（如果在tabs中）渲染
  // watch: {
  //   chartData: {
  //     deep: true,
  //     handler(val) {
  //        this.setOptions(val)
  //     }
  //   },
  // },
  mounted() {
    this.initChart()
    if (this.autoResize) {
      this.__resizeHandler = debounce(() => {
        if (this.chart) {
          this.chart.resize()
        }
      }, 100)
      window.addEventListener('resize', this.__resizeHandler)
    }
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    if (this.autoResize) {
      window.removeEventListener('resize', this.__resizeHandler)
    }

    this.sidebarElm && this.sidebarElm.removeEventListener('transitionend', this.sidebarResizeHandler)

    this.chart.dispose()
    this.chart = null
  },
  methods: {
    sidebarResizeHandler(e) {
      if (e.propertyName === 'width') {
        this.__resizeHandler()
      }
    },
    setOptions({ expectedData, expectedData1, actualData, title } = {}) {
      this.chart.setOption({
        xAxis: {
          data: ['2019-00001', '2019-00002', '2019-00003', '2019-00004', '2019-00005', '2019-00006', '2019-00007', '2019-00008', '2019-00009', '2019-00010', '2019-00011'],
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          containLabel: true
        },
        title: {
          text: title,
          textStyle: {
            color: 'white'
          }
        },
        legend: {
          data: ['扬程'],
          textStyle: {
            color: '#ffffff',
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10],
          formatter: '{a} <br/>{b} : {c}%'
        },
        yAxis: {
          type: 'value',
          // min:0,
          // max:100,
          // interval:20,
          axisTick: {
            show: false
          },
          axisLabel: {
            formatter: '{value}%',
            textStyle: {
              color: '#fff' // 坐标值得具体的颜色
            },
            nameTextStyle: {
              color: '#ffffff',
              padding: 10,
              fontSize: 14
            }
          }

        },
        //        visualMap: {//区间内控制显示颜色 折线点的颜色变化
        // 　　　　show: false,
        // 　　　　dimension: 1,
        // 　　　　pieces: [{
        //         gte: 0, lte: 50, color: 'green' //表示0-36.9之间的数值，是这个#7EF57C颜色，大于这个140，则#ff0000颜色。
        //         }],
        // 　　　　　outOfRange: {
        // 　　　　　　color: 'red'
        // 　　　　}
        // 　　  },
        series: [{
          name: '扬程',
          //  symbol: 'circle',
          symbolSize: 4,
          itemStyle: {
            normal: {
              color: '#e67070',
              lineStyle: {
                color: '#FF005A',
                width: 2
              },
              areaStyle: {
                color: '#006666'
              }
            }
          },
          markLine: {
            symbol: 'none', // 去掉箭头
            silent: false,
            data: [{
              name: '告警线',
              yAxis: 50,
              label: {
                show: false,
                position: 'middle'
              },
              lineStyle: {
                type: 'solid',
                color: 'green'
              }
            },
            {
              name: '111',
              yAxis: 46,
              label: {
                show: false,
                position: 'middle'
              },
              lineStyle: {
                type: 'dashed',
                color: 'green'
              }
            },
            {
              name: '111',
              yAxis: 54,
              label: {
                show: false,
                position: 'middle'
              },
              lineStyle: {
                type: 'dashed',
                color: 'green'
              }
            }]
          },
          smooth: true,
          type: 'line',
          data: [46.95, 46.95, 53.2, 48.0, 52.5, 47.8, 47.8, 47.8, 45.6, 47.55, 49.5],
          tooltip: true,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        }
        // {
        //   name: '数据1',
        //   symbol: 'circle',
        //   symbolSize: 4,
        //   itemStyle: {
        //     normal: {
        //       color: '#FF005A',
        //       lineStyle: {
        //         color: 'red',
        //         width: 2
        //       },
        //       areaStyle: {
        //         color: '#FF005A'
        //       }
        //     }
        //   },
        //   smooth: true,
        //   type: 'line',
        //   data: expectedData1,
        //   animationDuration: 2800,
        // //   animationEasing: 'cubicInOut'
        // }
        ]
      })
    },
    initChart() {
      setTimeout(() => {
        this.chart = echarts.init(this.$el, 'macarons')
        this.setOptions(this.chartData)
      }, 1000)
    }
  }
}
</script>
