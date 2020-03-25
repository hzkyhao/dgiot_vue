<template>
  <div class="testvue">
    <div class="testvueright">
      <div class="right1">
        <el-divider content-position="left">设备模拟</el-divider>
        <div class="right1bottom">
          <el-form  :model="formInline"  label-width="100px">
            <el-form-item label="服务类型">
              <el-select v-model="formInline.user" placeholder="服务类型">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="服务选择">
              <el-select v-model="formInline.region" placeholder="服务选择">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="服务级别">
              <el-select v-model="formInline.region1" placeholder="服务级别" style="width:33%">
                <el-option label="产品" value="1"></el-option>
                <el-option label="设备" value="2"></el-option>
              </el-select>
              <el-select v-model="formInline.region" placeholder="活动区域" style="width:33%">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
              <el-select v-model="formInline.region" placeholder="活动区域" v-if="formInline.region1=='2'" style="width:33%">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="设备组">
              <el-select v-model="formInline.user" placeholder="设备组">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="设备编号">
              <el-select v-model="formInline.region" placeholder="设备编号">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="right2">
       <el-divider content-position="left">数据标识</el-divider>
        <div class="right1bottom">
          <el-form :model="form2"   label-width="100px">
            <el-form-item
              v-for="(domain, index) in form2.event"
              :label="'事件参数' + (index+1)"
              :key="domain.key"
            >
              <el-input v-model="domain.value" >
                  <el-link type="primary" @click.prevent="removeDomain(domain)" :underline="false" slot="append">删除</el-link>
              </el-input>
              
            </el-form-item>
            <el-form-item label="数据冻结">
              <el-select v-model="form2.select" placeholder="请选择" style="width:20%;">
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="2"></el-option>
              </el-select>
              <el-date-picker v-model="form2.date" type="date" placeholder="选择冻结日期" style="width:79%;"></el-date-picker>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="right3">
       <el-divider content-position="left">数据发送策略</el-divider>
        <div class="right3bottom">
          <el-form :model="form3"  label-width="120px">
              <el-form-item label="数据任务名称">
                <el-input type="text" v-model="form3.name"></el-input>
              </el-form-item>
            <el-form-item label="开始时间">
              <el-date-picker v-model="form3.starttime" type="datetime" placeholder="选择开始时间" :picker-options="pickerOptionsStart" @change="testdata"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间">
              <el-date-picker v-model="form3.endtime" type="datetime" placeholder="选择结束时间" :picker-options="pickerOptionsEnd" @change="enddata"></el-date-picker>
            </el-form-item>
            <el-form-item label="间隔时间">
              <el-input
                type="number" v-model="form3.time" @keyup.enter.native="onlynumber" placeholder="单位：(s)" :min="1"
              ></el-input>
            </el-form-item>
            <el-form-item label="存储通道">
              <el-select v-model="form3.region" placeholder="活动区域">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <div style="margin:0 auto;text-align:center;width:100%;">
              <el-button type="primary" size="small">发送一次</el-button>
              <el-button type="info" size="small" @click="sendbutton">{{buttontext}}</el-button>
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      buttontext: "定时发送",
      istiming: true,
      formInline: {
        user: "",
        region: "",
        region1:""
      },
      form2: {
        event: [
          {
            key: 1,
            value: 1
          },
          {
            key: 1,
            value: 1
          },
          {
            key: 1,
            value: 1
          }
        ],
        date: "",
        select:''
      },
      form3: {
        name: "",
        starttime: "",
        endtime: "",
        time: 1,
        region: ""
      },
      pickerOptionsStart: {
        disabledDate: time => {
          let endDateVal = this.form3.endtime;
          if (endDateVal) {
            return (
              time.getTime() > new Date(endDateVal).getTime() ||
              time.getTime() < Date.now() - 8.64e7
            );
          } else {
            return time.getTime() < Date.now() - 8.64e7;
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: time => {
          let beginDateVal = this.form3.starttime;
          if (beginDateVal) {
            return (
              time.getTime() <
              new Date(beginDateVal).getTime() 
            );
          } else {
            return time.getTime() < Date.now() - 8.64e7;
          }
        }
      },
    };
  },
  mounted() {},
  methods: {
      onlynumber(){
        return(/[\d]/.test(String.fromCharCode(event.keyCode)))
      },
    sendbutton() {
      this.istiming = !this.istiming;
      if (this.istiming == true) {
        this.buttontext = "定时发送";
      } else {
        this.buttontext = "停止定时发送";
      }
    },
    enddata() {
      if (this.form3.endtime <= this.form3.starttime) {
        this.$message.warning("结束时间要小于开始时间");
        this.form3.endtime = "";
      }
      if (this.form3.endtime < Date.now() - 2000) {
        this.$message.warning("结束时间要大于当前时间");
        this.form3.endtime = "";
      }
    },
    testdata() {
      if (
        this.form3.endtime <= this.form3.starttime &&
        this.form3.endtime != "" &&
        this.form3.endtime != null
      ) {
        this.$message.warning("结束时间要小于开始时间");
        this.form3.starttime = "";
      }
      if (this.form3.starttime < Date.now() - 2000) {
        this.$message.warning("开始时间要大于当前时间");
        this.form3.starttime = "";
      }
    },
  }
};
</script>
<style lang="scss" scoped>
.testvue {
  height: 100%;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  .testvueright {
    height: 100%;
    width: 100%;
    padding-left: 50px;
    p {
      color: red;
    }
    .right1 {
      width: 100%;
      height: auto;
      .right1bottom {
        width: 100%;
        height: auto;
        padding-left: 40px;
      }
    }
    .right2 {
      width: 100%;
      height: auto;
      .right1bottom {
        width: 100%;
        height: auto;
        padding-left: 40px;
      }
    }
    .right3 {
      width: 100%;
      height: auto;
      .right3bottom {
        width: 100%;
        height: auto;
        padding-left: 40px;
      }
    }

    /deep/ .el-link {
      font-size: 16px;
      margin-left: 10px;
    }
    // /deep/ .el-input {
    //   width: 200px;
    // }
  }
  /deep/ .el-form{
      width:100%;
      display: flex;
      flex-wrap: wrap;
      .el-form-item{
          width:50%;
           @media screen and (max-width: 1350px) {
          width: 100%;
        }
        /deep/ .el-select{
            width:100%;
        }
        /deep/ .el-date-editor.el-input{
            width:100%;
        }
        /deep/ .el-input-group__append{
            background:#ffffff;
            border:none;
        }
      }
      
  }
  /deep/ .el-divider__text{
      color:red;
  }
}
</style>
