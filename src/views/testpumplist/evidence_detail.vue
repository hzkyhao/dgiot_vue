<template>
  <div class="evidence_detail">
    <div class="evidence_left">
      <div class="left1">
        <p
          style="border-bottom:1px solid #cccccc;color:#409EFF;font-size:14px;height:40px;margin:0"
        >取证产品信息</p>
        <el-form ref="productform" :model="productform" label-width="120px" size="small">
          <el-row>
            <el-col :span="8">
              <el-form-item label="检验编号">
                <span></span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="水泵名称">
                <span></span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="水泵型号">
                <span></span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="水泵类型">
                <span></span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="检验标准">
                <span></span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="left2">
        <p
          style="border-bottom:1px solid #cccccc;color:#409EFF;font-size:14px;height:40px;margin:0"
        >取证设备信息</p>
        <el-form :model="devicesform" label-position="top">
          <div class="devices1" style="padding:10px;">
            <el-row style="border-bottom:1px solid #dddddd">
              <el-col :span="2" style="text-align:right">
                <span class="svg-container">
                  <svg-icon icon-class="carams" style="width:3rem;height:3rem;" />
                </span>
              </el-col>
              <el-col :span="3">
                <el-form-item label="摄像头">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="设备统一编号">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="取证用途">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="IP">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="MAC地址">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="生产厂家">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="投运时间">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div class="devices1" style="padding:10px;">
            <el-row style="border-bottom:1px solid #dddddd">
              <el-col :span="2" style="text-align:right">
                <span class="svg-container">
                  <svg-icon icon-class="erciyuanjian" style="width:4rem;height:4rem;" />
                </span>
              </el-col>
              <el-col :span="3">
                <el-form-item label="二次软件取证终端">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="设备统一编号">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="取证用途">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="IP">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="MAC地址">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="生产厂家">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="投运时间">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div class="devices1" style="padding:10px;">
            <el-row style="border-bottom:1px solid #dddddd">
              <el-col :span="2" style="text-align:right">
                <span class="svg-container">
                  <svg-icon icon-class="pingban" style="width:3rem;height:3rem;" />
                </span>
              </el-col>
              <el-col :span="3">
                <el-form-item label="平板取证终端">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="设备统一编号">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="取证用途">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="IP">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="MAC地址">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="生产厂家">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="投运时间">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </div>
      <div class="left3">
        <p
          style="border-bottom:1px solid #cccccc;color:#409EFF;font-size:14px;height:40px;margin:0"
        >取证设备信息</p>
        <el-form :model="evidenceform" label-position="top">
          <div class="devices1" style="padding:10px;">
            <el-row style="border-bottom:1px solid #dddddd">
              <el-col :span="2" style="text-align:right">
                <span class="svg-container">
                  <svg-icon icon-class="luxiang" style="width:3rem;height:3rem;" />
                </span>
              </el-col>
              <el-col :span="3">
                <el-form-item label="证据类型">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="设证据编号">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="证据格式">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="证据大小">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="证据来源">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="证据数量">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="存储时间">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="1">
                <el-link :underline="false" type="primary">预览</el-link>
              </el-col>
            </el-row>
          </div>
          <div class="devices1" style="padding:10px;">
            <el-row style="border-bottom:1px solid #dddddd">
              <el-col :span="2" style="text-align:right">
                <span class="svg-container">
                  <svg-icon icon-class="dianzizhengju" style="width:3rem;height:3rem;" />
                </span>
              </el-col>
              <el-col :span="3">
                <el-form-item label="证据类型">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="设证据编号">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="证据格式">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="证据大小">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="证据来源">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="证据数量">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="存储时间">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="1">
                <el-link :underline="false" type="primary">预览</el-link>
              </el-col>
            </el-row>
          </div>
          <div class="devices1" style="padding:10px;">
            <el-row style="border-bottom:1px solid #dddddd">
              <el-col :span="2" style="text-align:right">
                <span class="svg-container">
                  <svg-icon icon-class="tupian" style="width:3rem;height:3rem;" />
                </span>
              </el-col>
              <el-col :span="3">
                <el-form-item label="证据类型">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="设证据编号">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="证据格式">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="证据大小">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="证据来源">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="证据数量">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="存储时间">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="1">
                <el-link :underline="false" type="primary">预览</el-link>
              </el-col>
            </el-row>
          </div>
          <div class="devices1" style="padding:10px;">
            <el-row style="border-bottom:1px solid #dddddd">
              <el-col :span="2" style="text-align:right">
                <span class="svg-container">
                  <svg-icon icon-class="video" style="width:3rem;height:3rem;" />
                </span>
              </el-col>
              <el-col :span="3">
                <el-form-item label="证据类型">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="设证据编号">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="证据格式">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="证据大小">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="证据来源">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="证据数量">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="存储时间">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="1">
                <el-link :underline="false" type="primary">预览</el-link>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </div>
      <div class="left4">
        <p
          style="border-bottom:1px solid #cccccc;color:#409EFF;font-size:14px;height:40px;"
        >质检报告文件上传</p>
        <el-form :model="reportform" label-width="120px" size="small">
          <el-form-item label="质检报告:">
            <el-input placeholder="请输入内容" v-model="reportform.filesrc">
              <template slot="append">
                <el-upload
                  class="upload-demo"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :limit="1"
                  accept=".PDF"
                  :before-upload="beforeUpload"
                  :on-success="successUpload"
                >
                  <el-button size="small" type="primary">选  择</el-button>
                </el-upload>
              </template>
            </el-input>
          </el-form-item>
        </el-form>
        
      </div>
      <div style="text-align:center">
          <el-button type="primary" size="small">确定</el-button>
          <el-button type="primary" size="small">提交</el-button>
          <el-button type="info" size="small">取消</el-button>
      </div>
    </div>
    <div class="evidence_right">
      <el-card class="box-card">
        <div class="box_top">取证任务详情</div>
        <div class="box_content">
          <div class="content">
            <el-form
              ref="form"
              :model="form"
              label-width="100px"
              size="small"
              label-position="left"
            >
              <el-form-item label="检验编号">
                <span>{{}}</span>
              </el-form-item>
              <el-form-item label="委托方">
                <span>{{}}</span>
              </el-form-item>
              <el-form-item label="委托方联系人">
                <span>{{}}</span>
              </el-form-item>
              <el-form-item label="联系方式">
                <span>{{}}</span>
              </el-form-item>
              <el-form-item label="检测单位">
                <span>{{}}</span>
              </el-form-item>
              <el-form-item label="检测实验室">
                <span>{{}}</span>
              </el-form-item>
              <el-form-item label="检测台">
                <span>{{}}</span>
              </el-form-item>
              <el-form-item label="检测人员">
                <span>{{}}</span>
              </el-form-item>
              <el-form-item label="U盾序列号">
                <span>{{}}</span>
              </el-form-item>
              <el-form-item label="检测时间">
                <span>{{}}</span>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {},
      productform: {},
      devicesform: {},
      evidenceform: {},
      reportform: {
        filesrc: ""
      }
    };
  },
  mounted() {},
  methods: {}
};
</script>
<style lang="scss" scoped>
.evidence_detail {
  width: 100%;
  background: #ffffff;
  display: flex;
  padding: 20px;
  box-sizing: border-box;
  .evidence_right {
    width: 350px;
    box-sizing: border-box;
    .el-card {
      .el-card__body {
        padding: 0;
        .box_content {
          width: 100%;
          height: auto;
          padding: 10px;
          box-sizing: border-box;
          .content {
            width: 100%;
            height: auto;
            background: #f0e2f1;
            padding: 5px;
            box-sizing: border-box;
            /deep/ .el-form-item {
              margin-bottom: 5px;
              .el-form-item__label {
                color: black;
              }
            }
          }
        }
      }
    }

    /deep/ .box_top {
      height: 40px;
      width: 100%;
      text-align: center;
      background: #409eff;
      color: white;
      line-height: 40px;
    }
  }
  .evidence_left {
    width: calc(100% - 350px);
    box-sizing: border-box;
    .devices1{
         /deep/ .el-form-item__label {
      border: 0;
      line-height: 20px;
    }
    /deep/ .el-form-item {
      margin-bottom: 10px;
    }
    /deep/ .el-form-item__content {
      line-height: 20px;
    }
    }
   
    /deep/ .el-upload-list {
      display: none;
    }
    /deep/ .el-input-group{
        width:300px;
    }
  }
}
</style>
