<template>
  <div class="resourcechannel">
    <h3>{{$t('resource.resource')}}</h3>
    <el-tabs v-model="activeName">
      <el-tab-pane :label="$t('resource.resource')+'('+total+')'" name="first">
        <div class="firsttable">
          <el-form :inline="true" :model="channelformsearch" class="demo-form-inline" size="small">
            <el-form-item>
              <el-input v-model="channelformsearch.name" :placeholder="$t('resource.name')"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="Get_Re_Channel(0)">{{$t('developer.search')}}</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="addchanneltype">{{$t('developer.selectchannel')}}</el-button>
            </el-form-item>
          </el-form>
          <!----------------------------------------------------资源通道表格------------------>
          <el-table :data="tableData" style="width: 100%;" :row-class-name="getChannelEnable">
            <el-table-column :label="$t('developer.channelnumber')">
            <template slot-scope="scope">
              <span>{{scope.row.id}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('developer.channelname')">
            <template slot-scope="scope">
              <span>{{scope.row.attributes.name}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('developer.channeltype')">
            <template slot-scope="scope">
              <span v-if="scope.row.attributes.type==1">{{$t('developer.collectionchannel')}}</span>
              <span v-else>{{$t('developer.resourcechannel')}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('developer.servicetype')">
            <template slot-scope="scope">
              <span>{{scope.row.attributes.cType}}</span>
            </template>
          </el-table-column>

          <el-table-column :label="$t('developer.channelstatus')">
            <template slot-scope="scope">
              <span v-if="scope.row.attributes.status=='ONLINE'" style="color:green">在线</span>
              <span v-else style="color:red">离线</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('developer.channeladdr')" width="200">
            <template slot-scope="scope">
              <span>{{'channel/'+scope.row.id}}</span>
            </template>
          </el-table-column>

          <el-table-column :label="$t('developer.describe')">
            <template slot-scope="scope">
              <span>{{scope.row.attributes.desc}}</span>
            </template>
          </el-table-column>
            <el-table-column :label="$t('developer.operation')" width="200">
              <template slot-scope="scope">
                <el-button
                  type="success"
                  v-if="scope.row.attributes.isEnable==false"
                  size="mini"
                  @click="qyChannel(scope.row,'enable')"
                >{{$t('developer.enable')}}</el-button>
                <el-button type="danger" v-else size="mini" @click="qyChannel(scope.row,'disable')">{{$t('developer.prohibit')}}</el-button>
                <el-button type="primary" size="mini" @click="updateChannel(scope.row)">{{$t('developer.edit')}}</el-button>
                <el-popover placement="top" width="300" :ref="`popover-${scope.$index}`">
                  <p>确定删除这个{{scope.row.attributes.name}}通道吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button
                      size="mini"
                      @click="scope._self.$refs[`popover-${scope.$index}`].doClose()"
                    >{{$t('developer.cancel')}}</el-button>
                    <el-button type="primary" size="mini" @click="deleteChannel(scope)">{{$t('developer.determine')}}</el-button>
                  </div>
                  <el-button type="danger" size="mini" slot="reference">{{$t('developer.delete')}}</el-button>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
          <div class="elpagination" style="margin-top:20px;">
            <el-pagination
              @size-change="channelSizeChange"
              @current-change="channelCurrentChange"
              :page-sizes="[10, 20, 30, 50]"
              :page-size="length"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            ></el-pagination>
          </div>
        </div>
      </el-tab-pane>
      <!--弹窗--->
      <el-dialog
        :title="channelupdated+$t('resource.resource')"
        :visible.sync="channelForm"
        width="40%"
        top="0"
        :close-on-click-modal="false"
        :before-close="handleClose"
      >
        <el-form :model="addchannel" label-width="120px" ref="addchannel" :rules="addrules">
          <el-form-item :label="$t('resource.Servicetype')" prop="region">
            <el-select
              v-model="addchannel['region']"
              :placeholder="$t('resource.Servicetype')"
              @change="removeauto"
            >
              <el-option
                v-for="(item,index) in channelregion"
                :label="item.title.zh"
                :key="index"
                :value="item.ctype"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('developer.channelname')"  prop="name">
              <el-input v-model="addchannel.name" autocomplete="off" :placeholder="$t('developer.channelname')"></el-input>
            </el-form-item>
          <el-col :span="12" v-for="(value, key, index) in selectregion.params" :key="index">
            <el-form-item :label="selectregion.params[key].title.zh"  :required="selectregion.params[key].required" :prop="key">
              <el-input v-model="addchannel[key]" v-if="selectregion.params[key].type=='string'||selectregion.params[key].type=='integer'"></el-input>
              <el-select v-model="addchannel[key]" v-else-if="selectregion.params[key].type=='boolean'"  class="notauto" readonly>
                <el-option label="是" :value="true"></el-option>
                <el-option label="否" :value="false"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!---------------------统一的配置描述---------------------------->
          <el-form-item :label="$t('developer.describe')" >
            <el-input
              v-model="addchannel.desc"
              autocomplete="off"
              type="textarea"
              :rows="3"
              @change="inputChange"
              :placeholder="$t('developer.describe')"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleClose">{{$t('developer.cancel')}}</el-button>
          <el-button type="primary" @click="addchannelForm('addchannel')">{{$t('developer.determine')}}</el-button>
        </div>
      </el-dialog>
    </el-tabs>
  </div>
</template>
<script>
import Parse from "parse";
import { setInterval } from 'timers';
import {
  channelConnect,
  updateConnect,
  deleteConnect
} from "@/api/testchannel";
import { subupadte } from "@/api/systemmanage/system";
import {resourceTypes} from '@/api/rules'
export default {
  data() {
    return {
      isopen: "suo",
      pwdType: "password",
      tableData: [],
      channelForm: false,
      channelupdated: "新增",
      activeName: "first",
      channelId: "",
      channelformsearch: {
        name: ""
      },
      channelregion: [],
      addchannel: {
         region:'',
         desc:'',
      },
      addrules: {
         name: [{ required: true, message: "请输入通道名称", trigger: "blur" }],
        region: [
          { required: true, message: "请选择服务类型", trigger: "change" }
        ],
      },
      length: 10,
      start: 0,
      total: 0,
      selectregion:{},
      resourceid: ""
    };
  },
  mounted() {
    this.Get_Re_Channel(0);
    this.dialogType()
  },
  methods: {
    inputChange(val){
      console.log(val)
    },
    //验证
    validUrl(rule, value, callback) {
      let reg = /^[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/;
      if (!reg.test(value)) {
        callback(new Error("需要输入正确的url"));
      } else {
        callback();
      }
    },
    validPort(rule, value, callback) {
      let reg = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
      if (!reg.test(value)) {
        callback(new Error("需要输入正确的端口号"));
      } else {
        callback();
      }
    },
    //初始化数据
    Get_Re_Channel(start) {
      if (start == 0) {
        this.start = 0;
      }
      var Channel = Parse.Object.extend("Channel");
      var channel = new Parse.Query(Channel);
      channel.skip(this.start);
      channel.limit(this.length);
      channel.ascending("-updatedAt");
      if (this.channelformsearch.name != "") {
        channel.contains("name", this.channelformsearch.name);
      }
      channel.count().then(count => {
        this.total = count;
        channel.find().then(
          resultes => {
            if (resultes) {
              this.tableData = resultes;
            }
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
          }
        );
      });
    },
    //初始化弹框数据
    dialogType(){
      resourceTypes().then(resultes=>{
        this.channelregion = resultes
      })
    },
    //更新状态
    qyChannel(row,action) {
       subupadte(row.id, action)
        .then(resultes => {
          if (resultes) {
            this.$message({
              type:'success',
              message:`${action=='enable' ? '启用成功':'禁用成功'}`
            });

          }
          this.Get_Re_Channel(0)
        })
        .catch(error => {
          this.$message.error(error.error);
        });
    },
    //编辑设备
    updateChannel(row) {
      this.channelForm = true;
      this.channelupdated = "编辑";
      this.resourceid = row.id
    },
    addchannelForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var obj={}
          for(var key in this.addchannel){
             obj[key] = this.addchannel[key]
          }
          delete obj.region
          var Channel = Parse.Object.extend('Channel')
          var channel = new Channel()
           var userid = Parse.User.current().id
            var acl =new Parse.ACL()
            acl.setReadAccess(userid,true)
            acl.setWriteAccess(userid,true)
          if (this.resourceid != "") {
            channel.id = this.resourceid
           }
              channel.set('config',obj)
              channel.set('ACL',acl)
              channel.set('name',this.addchannel.name)
              channel.set('cType',this.addchannel.region)
              channel.set('desc',this.addchannel.desc)
              channel.set('isEnable',this.addchannel.isEnable)
              channel.save().then(resultes=>{
                if(resultes){
                  this.$message({
                    type:'success',
                    message:this.channelupdated=='编辑'? '编辑成功':'创建成功'
                  })
                    this.$refs['addchannel'].resetFields();
                    this.channelForm=false
                    this.Get_Re_Channel(0)
                }
              })
           }
      });
    },
    //删除通道
     deleteChannel(scope) {
      var Channel = Parse.Object.extend("Channel");
      var channel = new Channel();
      channel.id = scope.row.id;
      channel.destroy().then(
        resultes => {
          this.$message({
            type: "success",
            message: "删除成功"
          });
          scope._self.$refs[`popover-${scope.$index}`].doClose();
          this.Get_Re_Channel(0);
        },
        error => {
          this.$message({
            type: "error",
            message: error.message
          });
        }
      );
    },
    addchanneltype() {
      this.channelForm = true;
      this.channelupdated = "新增";
    },
    //关闭弹窗
    handleClose() {
      this.addchannel = {
       
      };
      this.channelForm = false;
      // this.$refs["addchannel"].resetFields();
      this.resourceid = "";
    },
    getChannelEnable(row, rowIndex) {
      if (row.row.attributes.isEnable == true) {
        return "green_active";
      } else {
        return "red_active";
      }
    },
    //分页
    channelSizeChange(val) {
      this.length = val;
    },
    channelCurrentChange(val) {
      this.start = (val - 1) * this.length;
    },
    removeauto(val) {
      var obj = {}
      var obj1={
        name: [{ required: true, message: "请输入通道名称", trigger: "blur" }],
        region: [
          { required: true, message: "请选择服务类型", trigger: "change" }
        ],
      }
      this.channelregion.map(item=>{
        if(item.ctype==val){
          this.selectregion = item
          for(var key in this.selectregion.params){
            if(this.selectregion.params[key].default){
               obj[key] = this.selectregion.params[key].default
            }else{
              obj[key] = ''
            }
            if(this.selectregion.params[key].reqiured){
              if(this.selectregion.params[key].type=='string'||this.selectregion.params[key].type=='integer'){
                obj1[key]=[{ required: true, trigger: "blur" }]
              }else{
                 obj1[key]=[{ required: true, trigger: "change" }]
              }
            }
          }
          obj.region=val
          obj.desc=''
          obj.name=''
          obj.isEnable = false
        }
      })
      this.addchannel = obj
      this.addchannel.region = val
      this.addrules = obj1
    },
    //删除设备
    // deleteChannel(scope) {
    //   deleteConnect(scope.row.id)
    //     .then(resultes => {
    //       if (resultes) {
    //         this.$message.error("删除成功");
    //         scope._self.$refs[`popover-${scope.$index}`].doClose();
    //         this.Get_Re_Channel(0);
    //       }
    //     })
    //     .catch(error => {
    //       this.$message.error(error);
    //     });
    // }
  }
};
</script>
<style lang="scss" scoped>
.resourcechannel {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  /deep/ .green_active {
    color: green;
  }
  /deep/ .red_active {
    color: red;
  }
  /deep/ .el-button + .el-button {
    margin-left: 0;
  }
  /deep/ .el-tabs__item {
    font-size: 16px;
    margin-top: 20px;
    margin: 0;
    height: 50px;
    line-height: 50px;
    font-family: auto;
  }
  /deep/ .el-dialog__header {
    border-bottom: 1px solid #cccccc;
  }
  /deep/ .el-dialog__body {
    .el-form {
      display: flex;
      flex-wrap: wrap;
      .el-form-item {
        width: 100%;
        margin-bottom:22px;
        .el-select {
          width: 100%;
        }
      }
      .el-col {
        @media screen and (max-width: 1350px) {
          width: 100%;
        }
      }
    }
  }
  /deep/ .el-button--mini {
    margin: 2px 0;
  }
  /deep/ .row-bg {
    .el-form-item__content {
      width: 100%;
    }
  }
  /deep/ .el-dialog__wrapper {
    margin-bottom: 20px;
  }
}
</style>