<template>
    <div class="gateway">
        <div class="gatewayheader">
          <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small" label-width="120px">
            <el-form-item :label="$t('zetadevices.terminaltype')">
              <el-select v-model="formInline.gatetype" :placeholder="$t('zetadevices.terminaltype')">
                <el-option :label="$t('product.gateway')" value="net"></el-option>
              </el-select>
              <el-form-item :label="$t('zetadevices.terminalmodel')">
                <el-select v-model="formInline.gate" :placeholder="$t('zetadevices.terminalmodel')">
                  <el-option label="APZ1ZT" value="APZ1ZT"></el-option>
                  <!-- <el-option label="ZETAG C1" value="C1"></el-option>
                  <el-option label="ZETAG C2" value="C2"></el-option>
                  <el-option label="ZETAG P1" value="P1"></el-option> -->
                </el-select>
              </el-form-item>
            </el-form-item>
            <el-form-item :label="$t('zetadevices.terminaladdress')">
              <el-input v-model="formInline.address" :placeholder="$t('zetadevices.terminaladdress')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('zetadevices.onlinestate')">
              <el-select v-model="formInline.status" :placeholder="$t('zetadevices.onlinestate')">
                <el-option :label="$t('zetadevices.all')" :value="9"></el-option>
                <el-option :label="$t('zetadevices.online')" value="ACTIVE"></el-option>
                <el-option :label="$t('zetadevices.offline')" value="OFFLINE"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getZetaGateway(1)">{{$t('developer.search')}}</el-button>
              <el-button type="primary" @click="resetForm">{{$t('zetadevices.reset')}}</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="gatecontent">
          <div class="gatedevices" v-for="(item,index) in gatedata" :key="index">
              <div class="imgurl">
                <img :src="gatewayurl" alt="">
              </div>
              <div class="content">
                <!--ZETA网关-->
                <p><span>{{'ZETA'+$t('product.gateway')+":"}}<span style="color:green">{{'('+item.attributes.devaddr+')'}}</span></span>
                <span v-if="breathe==true" class="breathe-btn" style="display:inline-block;float:right;" :style="{'background-image':item.attributes.status=='ACTIVE' ? '-webkit-gradient(linear,left top,left bottom,from(#ffffff),to(green))': '-webkit-gradient(linear,left top,left bottom,from(#ffffff),to(red))'}"></span>
                <span  v-else  class="animated fadeInDown" style="float:right" :style="{'color':item.attributes.status ==  'ACTIVE' ? 'green':'red'}">{{item.attributes.status=='ACTIVE' ?  $t('zetadevices.inoperation'):$t('zetadevices.notruning')}}</span>
                </p>
                <p>{{$t('zetadevices.model')+':'}}<span style="color:#409EFF">{{'APA1ZT'}}</span><span style="float:right;display:inline-block;width:50%;">{{$t('zetadevices.terminaladdress')+':'}}<span style="color:#409EFF">{{item.attributes.ip}}</span></span></p>
                <p>{{$t('zetadevices.networkenvironment')}}:<span style="color:#409EFF">{{item.attributes.rssi==-255 ? (item.attributes.rssi==-99 ? $t('zetadevices.nosignal'): $t('zetadevices.Reticle') ): $t('zetadevices.wirelessnetwork')}}</span><span style="float:right;display:inline-block;width:50%;">{{$t('zetadevices.networkformat')}}:<span style="color:#409EFF">{{item.attributes.basedata.WCDMA}}</span></span></p>
                <!--SIM卡号-->
                <p><span>SIM卡号:</span><span style="color:#409EFF">{{item.attributes.basedata.tel}}</span></p>
                <!--ICCID-->
                 <p><span>ICCID:{{item.attributes.basedata.ICCID}}</span></p>
                <!--服务器连接状态-->
                <p><span>{{$t('zetadevices.serverconnection')+':'}}</span><span style="float:right;display:inline-block;width:50%;">{{$t('zetadevices.localclock')}}</span></p>
                <p><span :style="{'color':item.attributes.status=='ACTIVE' ? 'green':'red'}">{{item.attributes.status=='ACTIVE' ? $t('zetadevices.Connected'):$t('zetadevices.Unconnected')}}</span><span style="float:right;color:rgb(75, 139, 244);display:inline-block;width:50%;">{{readtime}}</span></p>
                <!--RSSI-->
                <p><span>{{$t('zetadevices.newest')+' RSSI:'}}<span style="color:#666">{{item.attributes.basedata.rssi+'dbm'}}</span></span>
                <span style="float:right;width:50%;">{{$t('zetadevices.datapacket')}}<span></span></span>
                </p>
                 <!--当前位置-->
                <p><span>{{$t('zetadevices.Position')+':'}}</span><span>N：-22.123456</span><span style="margin-left:10px">E：-11.002233</span></p>
                <p></p>
              </div>
          </div>
        </div>
        <!--分页-->
       <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[12]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
      </div>
    </div>
</template>
<script>
import Parse from 'parse'
import { getApp } from '@/api/applicationManagement';
import { setInterval } from 'timers';

export default {
   data() {
      return {
          breathe:true,
          formInline:{
              gatetype:'net',
              gate:'APZ1ZT',
              address:'',
              status:9
          },
          gatewayurl:require('../../imgages/zetag.png'),
          readtime:'',
          start:0,
          pagesize:12,
          total:0,
          gatedata:[],
          productid:'',
          time1:null,
          time2:null,
      }
   },
   mounted() {
     //自动刷新
     this.$nextTick(function () {
            this.time1 = window.setInterval(this.nowtime, 1000);
            this.time2 = window.setInterval(()=>{
              this.getGateway()
              this.breathe=true
              setTimeout(()=>{
                  this.breathe=false
              },3000)
            },60000)
        })
        this.getGateway()
        setTimeout(()=>{
          this.breathe=false
        },3000)
   },
   methods: {
     //本地时钟
     nowtime(){
            var timestamp3 = Date.parse(new Date());
            var date = new Date(timestamp3) 
            var Y = date.getFullYear() + '-';
            var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
            var D = (date.getDate()+1 <= 10 ? '0'+(date.getDate()) : date.getDate()) + ' ';
            var h = (date.getHours()+1 <= 10 ? '0'+(date.getHours()) : date.getHours())  + ':';
            var m = (date.getMinutes()+1 <= 10 ? '0'+(date.getMinutes()) : date.getMinutes())  + ':';
            var s = (date.getSeconds()+1 <= 10 ? '0'+(date.getSeconds()) : date.getSeconds());
            this.readtime=(Y+M+D+h+m+s); 
      },
      //获取AP
      getGateway(){
        var Proudct = Parse.Object.extend('Product')
        var product = new Parse.Query(Proudct)
        product.equalTo('devType','zeta')
        product.find().then(resultes=>{
          if(resultes.length!=0){
             this.productid = resultes[0].id
             this.getZetaGateway()
          }else{
            this.$message.warning('暂无数据')
          }
        },error => {
            if (error.code == "209") {
              this.$message({
                type: "warning",
                message: "登陆权限过期，请重新登录"
              });
              this.$router.push({
                path: "/login"
              });
            } else if (error.code == 119) {
              this.$message({
                type: "error",
                message: "没有操作权限"
              });
            }
          })
      },
      getZetaGateway(index){
        var Devices = Parse.Object.extend('Devices')
        var devices = new Parse.Query(Devices)
        if(this.formInline.address!=''){
          devices.equalTo('devaddr',this.formInline.address)
        }
        if(this.formInline.status=='ACTIVE'){
          devices.equalTo('status',this.formInline.status)
        }else if(this.formInline.status=='OFFLINE'){
          devices.notEqualTo('status','ACTIVE')
        }
        if(index==1){
          this.start=0
        }
        devices.equalTo('product',this.productid)
         devices.ascending('-createdAt')
        devices.exists('basedata')
        devices.skip(this.start)
        devices.limit(this.pagesize)
        devices.count().then(count=>{
          this.total = count
          devices.find().then(response=>{
            this.gatedata = response
          })
        },
      error => {
            if (error.code == "209") {
              this.$message({
                type: "warning",
                message: "登陆权限过期，请重新登录"
              });
              this.$router.push({
                path: "/login"
              });
            } else if (error.code == 119) {
              this.$message({
                type: "error",
                message: "没有操作权限"
              });
            }
          })
      },
      //分页
      handleSizeChange(val) {
       this.pagesize = val
       this.getZetaGateway()
      },
      handleCurrentChange(val) {
       this.start = (val-1)*this.pagesize
       this.getZetaGateway()
      },
   },
   beforeDestroy() {
     window.clearInterval(this.time1)
     this.time1 = null
     window.clearInterval(this.time2)
     this.time2 = null
   },
}
</script>
<style lang="scss" scoped>
.gateway{
    height:100%;
    width:100%;
    padding:20px 0 0 0;
    box-sizing: border-box;
    background:#fff;
    .gatecontent{
      display:flex;
      flex-wrap: wrap;
      .gatedevices{
        display:flex;
        width:430px;
        height:220px;
        border:1px solid #cccccc;
        border-radius: 4px;
        margin-left:20px;
        margin-bottom:10px;
        .imgurl{
          line-height:220px;
          img{
            display: inline-block;
            vertical-align: middle;
            border-right:1px solid #cccccc;
            width:100px;
          }
        }
        .content{
          width:330px;
          padding:0 5px;
          margin-left:5px;
          box-sizing: border-box;
           p{
            margin:6px 0;
            font-size:14px;
          }
        }
       
      }
    }
    .block{
      margin-top:10px;
    }
}
</style>
<style>
  .breathe-btn {
      position:relative;
      width:30px;
      height:10px;
      line-height:40px;
      border:1px solid #2b92d4;
      border-radius:5px;
      color:#fff;
      font-size:20px;
      text-align:center;
      cursor:pointer;
      /* box-shadow:0 1px 2px rgba(0,0,0,.3); */
      overflow:hidden;
      /* background-image:-webkit-gradient(linear,left top,left bottom,from(black),to(green)); */
      animation-timing-function:ease-in-out;
      animation-name:breathe;
      animation-duration:2000ms;
      animation-iteration-count:infinite;
      animation-direction:alternate;
    }
    @keyframes breathe {
      0% {
      opacity:.2;
      /* box-shadow:0 1px 2px rgba(255,255,255,0.1); */
    }
    100% {
      opacity:1;
      /* border:1px solid rgba(59,235,235,1); */
      /* box-shadow:0 1px 30px rgba(59,255,255,1); */
    }
  }
</style>