import ScrollPane from '@/components/ScrollPane';
import { setInterval, clearInterval } from 'timers';
<template>
  <div class="license">
    <div class="licenseleft">
      <el-row>
        <el-col :span="12">
          <img :src="originimgsrc" alt srcset v-if="isend==false" />
          <img :src="originimgsrc" alt srcset v-if="isend==true" />
        </el-col>
        <el-col :span="12">
          <div v-if="isend==false" class="originupdate">
            <p>部署配置</p>
            <span>请完成配置后进行部署</span>
          </div>
        </el-col>
      </el-row>
      <!-- <el-row v-if="isend==false" style="margin-top:50px;text-align:right">
        <el-col :span="24" style="text-align:center;margin-left:40px;">
          <el-button type="primary">部署</el-button>
        </el-col>
      </el-row> -->
      <el-row style="margin-top:50px;">
        <el-col :span="12" class="originupdate">
          <p>当前时间:</p>
          <span>{{updatetime}}</span>
        </el-col>
        <el-col :span="12" class="originupdate">
          <p>服务器状态</p>
          <span v-if="isarrange==false">未部署</span>
          <span v-else>部署完成</span>
        </el-col>
      </el-row>
    </div>
    <div class="licenseright">
      <div class="righttop">
        <p style="font-size:20px;">部署进度</p>
        <el-steps :active="active" finish-status="success">
          <el-step title="基础服务部署"></el-step>
          <el-step title="数据库部署"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
      </div>
      <div class="rightcenter">
        <p style="font-size:20px;color:#67C23A">机器信息</p>
        <!-- <div class="rightcomputer">
          <el-row>
            <el-col :span="12">
              <span style="margin-right:20px;">用户名:</span>
              <span>{{configdata.hostName}}</span>
            </el-col>
            <el-col :span="12">
              <span style="margin-right:20px;">计算机信息:</span>
              <span>{{configdata.computerConfig}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <span style="margin-right:20px;">IP地址:</span>
              <span>
                 <span>{{configdata.natIP+'(私)'}}</span>
                 <span>{{configdata.wlanIp+'(公)'}}</span>
              </span>
             
            </el-col>
            <el-col :span="12">
              <span style="margin-right:20px;">服务器连接状态:</span>
              <el-switch v-model="value2" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
            </el-col>
           
          </el-row>
          <el-row>
            <el-col :span="12">
              <span style="margin-right:20px;">授权状态:</span>
              <span>{{configdata.computerAuth}}</span>
            </el-col>
            <el-col :span="12">
              <span style="margin-right:20px;">机器码:</span>
              <span style="font-size:12px;">{{configdata.computerKey}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <span style="margin-right:20px;">数据中心地址:</span>
              <el-input placeholder="请输入数据中心地址" v-model="infomation"></el-input>
            </el-col>
            <el-col :span="8" style="position:relative">
              <span style="margin-right:20px;">授权码:</span>
              <el-input placeholder="请输入授权码" v-model="authorizenumber"></el-input>
              <i
                style="color:red;margin:0;position:absolute;top:40px;font-style:normal;left:80px;"
              >请提交机器码至管理员,获取授权码</i>
            </el-col>
            <el-col :span="8">
              <span style="margin-right:20px;">服务版本:</span>
              <el-select placeholder="请输入服务版本" v-model="standard">
                <el-option label="标准版" value="standard"></el-option>
                <el-option label="企业版" value="enterprise"></el-option>
                <el-option label="旗舰版" value="ultimate"></el-option>
              </el-select>
            </el-col>
          </el-row>
          
        </div> -->
        <el-form ref="form" :model="configdata" label-width="140px">
          <el-form-item label="用户名:">
            <span>{{configdata.hostName}}</span>
          </el-form-item>
          <el-form-item label="计算机信息:">
            <span>{{configdata.computerConfig}}</span>
          </el-form-item>
          <el-form-item label="IP地址(公):">
            <span>{{configdata.wlanIp}}</span>
          </el-form-item>
          <el-form-item label="IP地址(私):">
            <span>{{configdata.natIP}}</span>
          </el-form-item>
           <el-form-item label="授权状态:">
            <span>{{configdata.computerAuth}}</span>
          </el-form-item>
          <el-form-item label="服务器连接状态:">
            <el-switch v-model="value2" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </el-form-item>
         
           <el-form-item label="数据库是否部署:">
            <span v-if="configdata.dbInstalled==true">是</span>
            <span v-else>否</span>
          </el-form-item>
          <el-form-item label="机器码:">
            <span>{{configdata.computerKey}}</span>
          </el-form-item>
          <el-form-item label="数据中心地址:">
            <el-input placeholder="请输入数据中心地址" v-model="configdata.infomation"></el-input>
          </el-form-item>
          <el-form-item label="授权码:">
            <el-input placeholder="请输入授权码" v-model="configdata.authorizenumber"></el-input>
          </el-form-item>
          <el-form-item label="服务版本:">
            <el-select placeholder="请输入服务版本" v-model="configdata.standard">
                <el-option label="标准版" value="standard"></el-option>
                <el-option label="企业版" value="enterprise"></el-option>
                <el-option label="旗舰版" value="ultimate"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="success" style="margin-right:100px;" @click="uploadHub" v-if="dbinstall">部 署</el-button>
            <el-button type="success" style="margin-right:100px;" @click="uploadDb" v-else>数据库部署</el-button>
            <el-button type="primary" @click="update">刷新</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { hardInfo,iotHub,iotApp } from "@/api/license";
import Cookies from 'js-cookie'
import axios from 'axios';
export default {
  data() {
    return {
      value2: false,
      isarrange: false,
      isend: false,
      originimgsrc: require("../imgages/license3.png"),
      successimgsrc: require("../imgages/license4.png"),
      timer: null,
      updatetime: "",
      active: 1,
      authorizenumber: "",
      dbinstall:true,
      configdata:{
          computerAuth:'',
          natIP:'',
          wlanIp:'',
          computerKey:'',
          computerConfig:'',
          hostName:'',
          infomation:'localhost',
          standard:'standard',
          authorizenumber:'',
          dbInstalled:'',
      },
      standard:'standard'
    };
  },
  mounted() {
    window.clearInterval(this.timer);
    this.timeUpdate();
    this.getHardInfo();
    if(Cookies.get('authorizenumber')){
      this.configdata.authorizenumber = Cookies.get('authorizenumber')
    }else{
      this.configdata.authorizenumber = ''
    }
  },
  methods: {
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
      this.updatetime = Y + M + D + h + m + s;
    },
    timeUpdate() {
      var _this = this;
      _this.timer = window.setInterval(() => {
        _this.nowtime();
      }, 1000);
    },
    getHardInfo() {
      hardInfo().then(resultes => {
          this.configdata.computerAuth=resultes.computerAuth
          this.configdata.natIP = resultes.natIP
          this.configdata.wlanIp =resultes.wlanIp
          this.configdata.computerKey =resultes.computerKey
          this.configdata.hostName = resultes.hostName
          this.configdata.computerConfig = resultes.computerConfig
          this.configdata.dbInstalled = resultes.dbInstalled
          this.value2 = resultes.serverHealth
      });
    },
    uploadHub(){
      if(this.configdata.infomation==''){
        this.$message.error('请填写数据中心地址')
        return
      }
      if(this.configdata.authorizenumber==''){
        this.$message.error('请填写授权码')
        return
      }
      
      iotHub(this.configdata.standard,this.configdata.authorizenumber,this.configdata.infomation).then(resultes=>{
        if(resultes.result==true){
          this.active=3
          this.$router.push('/login')
        }else{
          if(resultes.status=='license_failed'){
            this.$message.error('授权码错误，请重新填写')
            return 
          }else if(resultes.status=='server_disconnected'){
            this.$message.error('服务器未连接')
            return
          }else if(resultes.status=='database_uninstalled'){
             this.active=2
            this.$message.success('服务器部署完成，请完成下一步数据库部署')
            this.dbinstall=false
            Cookies.set('authorizenumber',this.configdata.authorizenumber)
          }
         
        }
      })
    },
    uploadDb(){
      // this.$axios.get('http://192.168.2.9:5080/iotapi/iotapp?license='+this.configdata.authorizenumber,{timeout:120000}).then(resultes=>{
      //   console.log(resultes)
      // })
      iotApp(this.configdata.authorizenumber).then(response=>{
        if(response.result==true){
          this.$message.success('数据库部署完成')
           this.active=3
          this.$router.push('/login')
        }else{
            this.$message.error('部署失败')
        }
      }).catch(error=>{
        this.$messge.error(error)
      })
    },
    update(){
      // console.log(window.location)
      window.open(`${window.location.origin}`)
    }
  },
  beforeDestroy() {
    window.clearInterval(this.timer);
    this.timer = null;
  }
};
</script>
<style lang="scss" scoped>
.license {
  min-width: 1100px!important;

  display: flex;
  .licenseleft {
    width: 400px;
  
    background: url("../imgages/license2.png");
    padding: 40px 20px;
    box-sizing: border-box;
  }
  .licenseright {
    background: url("../imgages/license1.png");
    background-size: cover;
    width: calc(100% - 400px);
    padding: 40px;
    box-sizing: border-box;
    /deep/ .is-process {
      color: white;
    }
    .rightcenter {
      margin-top: 40px;
    }
    .rightcomputer {
      padding: 0 50px;
      box-sizing: border-box;
      .el-row {
        margin: 50px 0;
        .el-col {
          //   text-align:center;
          span {
            font-size: 18px;
            font-weight: 700;
          }
        }
      }
    }
    .buttongroup {
      padding: 0 50px;
      box-sizing: border-box;
      text-align: center;
    }
  }
  /deep/ .originupdate {
    p {
      color: white;
      font-size: 18px;
    }
    span {
      color: white;
      font-size: 14px;
    }
  }
  /deep/ p {
    color: white;
    font-weight: 700;
  }
  /deep/ span {
    color: white;
    font-size:16px;
  }
  /deep/ .el-input {
    width: 200px;
  }
  /deep/ .el-col {
        @media screen and (max-width: 1350px) {
          width: 100%;
          margin-bottom: 20px 
        }
      }
  /deep/ .el-form-item__label{
    font-size:16px;
    color:#ffffff;
  }
  /deep/ .el-form-item{
    width:500px!important;
  }
}
</style>
