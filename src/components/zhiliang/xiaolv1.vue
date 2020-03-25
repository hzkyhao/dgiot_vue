<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'

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
     businessdata:{
         type:Object,
         default:()=>{
             return {
                 data:[],
                 title:''
             }
         }
     }
  },
  data() {
    return {
      chart: null
    }
  },
  watch:{
      businessdata:{
          deep:true,
          handler(val){
              this.initChart(val)
          }
      }
  },
  mounted() {
    this.initChart(this.businessdata)
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHandler)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart(businessdata) {
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
        //   orient: 'bottom',
        //   x: 'left',
          bottom: '0',
        //   data: businessdata.data.name,
           textStyle:{
            color:'#ffffff'
          }
        },
        // calculable: true,
        color:['#3399FF','#bbe2e8','#6cacde','#C71585','#6A5ACD','#F0F8FF','#98FB98'],
         grid: {
          top:100,
          left: '2%',
          right: '2%',
          bottom: 100,
          containLabel: true
        },
        series: [
          {
            name: businessdata.title,
            type: 'pie',
            // roseType: 'radius',//饼图形状扇形
            radius: '60%',
            center: ['50%', '50%'],
            // label: {
            //     normal: {
            //         formatter: '{b|{b}：}{c}人\n{hr|}',
            //         borderWidth: 1,
            //         borderRadius: 4,
            //         fontSize:12,
            //         rich: {
            //             a: {
            //                 color: '#999',
            //                 lineHeight: 22,
            //                 align: 'center',
            //                 fontSize:12,
            //             },
            //             hr: {
            //                 borderColor: '#aaa',
            //                 width: '100%',
            //                 borderWidth: 0.5,
            //                 height: 0,
            //             },
            //             b: {
            //                 fontSize: 12,
            //                 lineHeight: 20,  
            //             },
            //             per: {
            //                 color: '#eee',
            //                 backgroundColor: '#334455',
            //                 padding: [2, 4],
            //                 borderRadius: 2,
            //                  borderColor: '#aaa',
            //                 borderWidth: 1,
            //             }
            //         }
            //     },
            // },
            data: businessdata.data,
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    }
  }
}
</script>
