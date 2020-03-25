<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="12" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="scqy" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">生产企业</div>
          <span>超</span><count-to :start-val="0" :end-val="500" :duration="2600" class="card-panel-num"/><span>家</span>
        </div>
      </div>
    </el-col>
     <el-col :xs="12" :sm="12" :lg="12" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('messages')">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="czgl" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">最新年产值</div>
          <count-to :start-val="0" :end-val="400" :duration="3000" class="card-panel-num"/><span>亿</span>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="12" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="cl" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">年产量</div>
          <span>超</span><count-to :start-val="0" :end-val="4000" :duration="2600" class="card-panel-num"/><span>万台</span>
        </div>
      </div>
    </el-col>
     <el-col :xs="12" :sm="12" :lg="12" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('messages')">
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="sczyl" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">国内市场占有率</div>
          <count-to :start-val="0" :end-val="60" :duration="3000" class="card-panel-num"/><span>%以上</span>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="12" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="sb" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">驰名商标</div>
          <count-to :start-val="0" :end-val="6" :duration="2600" class="card-panel-num"/><span>件</span>
        </div>
      </div>
    </el-col>
     <el-col :xs="12" :sm="12" :lg="12" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('messages')">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="qy" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">亿元企业</div>
          <count-to :start-val="0" :end-val="30" :duration="3000" class="card-panel-num"/><span>家</span>
        </div>
      </div>
    </el-col>
    <!--<el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="jizhongqi" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">集中器数</div>
          <count-to :start-val="0" :end-val="712" :duration="3200" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="dianbiao" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">电表总数</div>
          <count-to :start-val="0" :end-val="102520" :duration="3600" class="card-panel-num"/>
        </div>
      </div>
    </el-col> -->
  </el-row>
  
  
</template>

<script>
import CountTo from 'vue-count-to'
import ScrollPane from '@/components/ScrollPane';

export default {
  components: {
    CountTo
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  margin-top: 10px;
  .card-panel-col{
    margin-bottom: 10px;
  }
  .card-panel {
    height: 70px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #082b49;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    // &:hover {
    //   .card-panel-icon-wrapper {
    //     color: #fff;
    //   }
    //   .icon-people {
    //      background: #40c9c6;
    //   }
    //   .icon-message {
    //     background: #36a3f7;
    //   }
    //   .icon-money {
    //     background: #f4516c;
    //   }
    //   .icon-shopping {
    //     background: #34bfa3
    //   }
    // }
    // .icon-people {
    //   color: #40c9c6;
    // }
    // .icon-message {
    //   color: #36a3f7;
    // }
    // .icon-money {
    //   color: #f4516c;
    // }
    // .icon-shopping {
    //   color: #34bfa3;
    // }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 30px;
    }
    .card-panel-description {
      float: left;
      font-weight: bold;
      margin: 15px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: #f5e802;
        font-size: 12px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 16px;
      }
      /deep/ span{
        font-size:16px;
      }
    }
  }
}
</style>
