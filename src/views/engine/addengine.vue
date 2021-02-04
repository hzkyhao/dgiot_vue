<template>
  <div class="addengine">
    <div class="addcontent">
      <el-card class="box-card">
        <el-form
          ref="formInline"
          :model="formInline"
          :rules="formlinerule"
          label-width="80px"
          size="medium"
        >
          <div class="form-block__title">
            {{ $t('rule.condtion') }}
            <div class="form-block__title-tips">{{ $t('rule.Processing') }}</div>
          </div>
          <el-row :gutter="20">
            <el-col :span="row1">
              <!--触发事件-->
              <el-form-item>
                <!-- <el-select v-model="formInline.region" :placeholder="$t('rule.TriggerEvent')" @change="selectRegion">
                  <el-option
                    v-for="(item,index) in originlist"
                    :key="index"
                    :label="item.title.zh+'('+item.event+')'"
                    :value="item.event">

                  </el-option>
                </el-select> -->
                <!-- <el-input v-model="formInline.region" ></el-input> -->
                <div class="show-guess">
                  <!-- <p>{{$t('rule.AvailableField')}}</p> -->
                  <!-- <div class="code">
                    <code
                      style="font-size: 12px;"
                    >{{client.join(',')}}</code>
                  </div> -->
                  <!-- <p>
                    <span class="notice" style="color:#ff6d6d">*</span>
                    {{$t('rule.UpgradeHints')}}
                  </p>
                  <div
                    class="code"
                  >当前版本取消对 payload 的自动 JSON 解码，选择 payload 中的字段请使用 json_decode 解码，如 SQL 示例。</div> -->
                  <p>{{ $t('rule.RuleSQLexample') }}</p>
                  <div class="code">
                    <code
                      style="font-size: 12px;"
                    >{{ sqlexample }}</code>
                  </div>
                </div>
              </el-form-item>
              <!--编写SQL-->
              <el-form-item :label="$t('rule.RuleSQL')" prop="enginesql">
                <pre id="editor1" class="ace_editor" style="min-height:300px"><el-input v-model="formInline.enginesql" class="ace_text-input" type="textarea"/></pre>
              </el-form-item>
              <!--备注-->
              <el-form-item :label="$t('rule.Remarks')">
                <el-input v-model="formInline.remarks" type="text"/>
              </el-form-item>
              <!--SQL测试-->
              <el-form-item :label="$t('rule.SQLtest')">
                <el-switch
                  v-model="formInline.sqltest"
                  active-color="#13ce66"
                  inactive-color="gray"
                  @change="getEditor2"
                />
                <el-popover
                  placement="top-start"
                  width="200"
                  trigger="hover"
                  content="自定义模拟数据进行 SQL 命令测试，仅用于测试功能"
                >
                  <i slot="reference" class="el-icon-question" style="color:#71737d"/>
                </el-popover>
              </el-form-item>
              <!--其他信息-->
            </el-col>
            <!--中间间隔-->
            <el-col :span="4"/>
            <el-col :span="row2" class="animated fadeInRightBig">
              <el-form-item
                v-show="formInline.sqltest==true"
                :rules="[
                { required: true, message: &quot;clientid 不能为空&quot;, trigger: &quot;blur&quot; }]"
                label="clientid"
                prop="clientid"
              >
                <el-input v-model="formInline.clientid"/>
              </el-form-item>
              <el-form-item
                v-show="formInline.sqltest==true"
                :rules="[
                { required: true, message: &quot;username 不能为空&quot;, trigger: &quot;blur&quot; }]"
                label="username"
                prop="username"
              >
                <el-input v-model="formInline.username"/>
              </el-form-item>
              <el-form-item
                v-show="formInline.sqltest==true"
                :rules="[
                { required: true, message: &quot;topic 不能为空&quot;, trigger: &quot;blur&quot; }]"
                label="topic"
                prop="topic"
              >
                <el-input v-model="formInline.topic"/>
              </el-form-item>
              <el-form-item
                v-if="formInline.sqltest==true"
                :rules="[
                { required: true, message: &quot;qos 不能为空&quot;, trigger: &quot;blur&quot; }]"
                label="qos"
                prop="qos"
              >
                <el-input v-model.number="formInline.qos"/>
              </el-form-item>
              <el-form-item
                v-show="formInline.sqltest==true"
                :rules="[
                { required: true, message: &quot;请填写payload&quot;, trigger: &quot;blur&quot; }]"
                label="payload"
                prop="payload"
              >
                <el-input v-model="formInline.payload" type="text" style="visibility:hidden"/>
                <pre id="editor2" class="ace_editor" style="min-height:300px"><el-input v-model="formInline.payload" class="ace_text-input" type="textarea"/></pre>
              </el-form-item>
              <el-form-item v-show="formInline.sqltest==true" label=" ">
                <el-button type="success" @click="testRule('formInline')">{{ $t('rule.Test') }}</el-button>
              </el-form-item>
              <el-form-item v-show="formInline.sqltest==true" :label="$t('rule.TestJie')">
                <el-input v-model="formInline.result" :rows="4" type="textarea"/>
              </el-form-item>
            </el-col>
          </el-row>
          <!--响应动作-->
          <div class="tablebottom">
            <div class="form-block__title">
              <span style="color: rgb(255, 109, 109);">*</span>
              {{ $t('rule.ResponseAction') }}
              <div class="form-block__title-tips">{{ $t('rule.Processing') }}</div>
            </div>
            <div class="bottomtable" style="padding-left:20px">
              <div class="tableaction">
                <el-table :data="actionData" style="width: 100%">
                  <el-table-column :label="$t('rule.Type')" prop="name" width="180"/>
                  <el-table-column :label="$t('rule.Parameter')">
                    <template slot-scope="scope">
                      <span
                        v-if="scope.row.params.$resource"
                      >{{ '关联资源:'+scope.row.params.$resource }}</span>
                      <span v-else/>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('developer.operation')" width="180">
                    <template slot-scope="scope">
                      <el-button type="danger" size="mini" @click="deleteOneData(scope.$index)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div>
                  <el-button
                    type="success"
                    plain
                    icon="el-icon-circle-plus-outline"
                    size="small"
                    style="margin-top:20px;"
                    @click="addresouce"
                  >{{ $t('rule.Addto') }}</el-button>
                </div>
              </div>
            </div>
            <div>
              <el-dialog
                :title="$t('rule.ResponseAction')"
                :visible.sync="dialogFormVisible"
                :close-on-click-modal="false"
                width="60%"
                top="1vh"
              >
                <!-- <el-form :model="form" :rules="formrule" ref="form">
                  <el-row style="border:0">
                    <el-col :span="20">
                      <el-form-item label="动作" prop="action">

                        <el-popover
                          placement="top-start"
                          width="200"
                          trigger="hover"
                          content="动作类型"
                        >
                          <i class="el-icon-question" slot="reference" style="color:#71737d;"></i>
                        </el-popover>

                        <el-select v-model="form.action" @change="selectaction" disabled>

                          <el-option v-for="(action,index) in actionslist" :key="index" :label="action.description.zh" :value="action.name"></el-option>

                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="2" style="margin-left:20px;min-width:100px">
                      <el-link type="primary" :underline="false" style="line-height:8" @click="openDialog">新建资源</el-link>
                    </el-col>

                  </el-row>
                  <el-row style="border:0">
                     <el-col
                      :span="20"
                      v-if="form.action!='do_nothing'"
                    >
                      <el-form-item
                        label="关联资源"
                        prop="resource"
                        :rules="
                            [{required:true,message:'请选择资源',trigger:'change'}]
                          "
                      >
                        <el-select v-model="form.resource" @change="selectResource">
                          <el-option
                            v-for="(item,index) in resourcelist"
                            :key="index"
                            :label="item.id"
                            :value="item.id"
                          ></el-option>
                        </el-select>

                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form> -->
                <el-table :data="channellist" height="400" style="width: 100%">
                  <el-table-column :label="$t('developer.channelnumber')" align="center">
                    <template slot-scope="scope">
                      <span>{{ scope.row.objectId }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('developer.channelname')" align="center">
                    <template slot-scope="scope">
                      <span>{{ scope.row.name }}</span>
                    </template>
                  </el-table-column>
                  <!-- <el-table-column :label="$t('developer.channeladdr')" width="200" align="center">
                  <template slot-scope="scope">
                    <span>{{'channel/'+scope.row.id}}</span>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('developer.channeltype')" align="center">
                  <template slot-scope="scope">
                    <span v-if="scope.row.attributes.type==1">{{$t('developer.collectionchannel')}}</span>
                    <span v-else>{{$t('developer.resourcechannel')}}</span>
                  </template>
                </el-table-column> -->
                  <el-table-column :label="$t('developer.servicetype')" align="center">
                    <template slot-scope="scope">
                      <span>{{ scope.row.cType }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('developer.operation')" align="center">
                    <template slot-scope="scope">
                      <el-button
                        size="mini"
                        type="primary"
                        @click="relationChannel(scope.row.objectId)"
                      >{{ $t('developer.add') }}</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div class="elpagination" style="margin-top:20px;">
                  <el-pagination
                    :page-sizes="[10, 20, 30, 50]"
                    :page-size="allChannellength"
                    :total="allChanneltotal"
                    layout="total, sizes, prev, pager, next, jumper"
                    @size-change="allChannelSizeChange"
                    @current-change="allChannelCurrentChange"
                  />
                </div>
                <!-- <div slot="footer" class="dialog-footer">
                  <el-button @click="dialogFormVisible = false">取 消</el-button>
                  <el-button type="primary" @click="addData">确 定</el-button>
                </div> -->
              </el-dialog>
            </div>
          </div>
          <el-form-item label-width="0">
            <el-button type="success" @click="addrules('formInline')">新建</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    <!-- <el-dialog title="Resource" :visible.sync="dialogVisible" width="40%" top="1vh">
          <el-form :model="resourceform" label-width="120px" :rules="resourcerule" ref="resourceform">
            <el-row style="border:0">
              <el-col :span="11">
            <el-form-item label="通道类别" prop="region">

              <el-select v-model="resourceform.region" placeholder="请选择通道类型" style="width:100%">
                <el-option label="资源/采集通道" value="data_resource"></el-option>
              </el-select>
            </el-form-item>
              </el-col>
              </el-row>

             <el-row style="border:0">
              <el-col :span="11">
            <el-form-item label="通道编号" prop="objectId">
             <el-select v-model="resourceform.objectId" placeholder="请选择通道编号" style="width:100%">
                <el-option v-for="(item,index) in channellist" :label="item.attributes.name" :key="index" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
            <el-col :span="11">
            <el-form-item label="通道描述" prop="desc">
             <el-input v-model="resourceform.desc" autocomplete="off"></el-input>
            </el-form-item>
            </el-col>
            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addRes('resourceform')">确 定</el-button>
          </div>
        </el-dialog> -->
  </div>
</template>
<script>
var editor1
var editor2
var editormodel
var editorcreate
var editorinsert
var editorsubtable
// import datalist from "./datalist";
import { addRule, ruleTest, getActions, getResource, postResource } from '@/api/rules'

import { returnLogin } from '@/utils/return'
export default {
  data() {
    return {
      dialogVisible: false,
      resourceform: {
        objectId: '',
        region: 'data_resource',
        desc: ''
      },
      resourcerule: {
        objectId: [
          { required: true, message: '请填写通道编号', trigger: 'blur' }
        ],
        desc: [{ required: true, message: '请填写通道描述', trigger: 'blur' }]
      },
      row1: 24,
      row2: 0,
      dialogFormVisible: false,
      title: '',
      formInline: {
        user: '',
        region: '',
        enginesql: '',
        remarks: '',
        sqltest: false,
        clientid: 'c_swqx',
        username: 'u_swqx',
        qos: 1,
        topic: 't/a',
        payload: '',

        result: ''
      },
      formlinerule: {
        region: [
          { required: true, message: '请选择触发事件', trigger: 'change' }
        ],
        enginesql: [
          { required: true, message: '请填写规则SQL', trigger: 'blur' }
        ]
      },
      actionData: [],
      form: {
        action: 'data_to_resource',
        resource: ''
      },
      formrule: {
        action: [{ required: true, message: '请选择动作', trigger: 'change' }]
      },
      productid: '',
      resourcelist: [],
      channellist: [],
      ctype: '',
      // originlist: datalist,
      client: [],
      sqlexample: `SELECT
        payload.msg as msg
      FROM
        "t/#"
      WHERE
        msg = 'hello'`,
      actionslist: [],
      allChannelstart: 0,
      allChannellength: 10,
      allChanneltotal: 0
    }
  },
  mounted() {
    this.title = this.$route.query.title
    this.productid = this.$route.query.productid
    editor1 = ace.edit('editor1')
    editor1.session.setMode('ace/mode/sql') // 设置语言
    editor1.setTheme('ace/theme/eclipse') // 设置主题
    editor1.setOptions({
      enableBasicAutocompletion: true,
      enableSnippets: true,
      enableLiveAutocompletion: true // 设置自动提示
    })
    editor1.setValue(`SELECT
        payload.msg as msg
      FROM
        "t/#"
      WHERE
        msg = 'hello'`)
    editor2 = ace.edit('editor2')
    editor2.session.setMode('ace/mode/json') // 设置语言
    editor2.setTheme('ace/theme/eclipse') // 设置主题
    editor2.setOptions({
      enableBasicAutocompletion: true,
      enableSnippets: true,
      enableLiveAutocompletion: true // 设置自动提示
    })
    editor2.setValue(`{"msg":"hello"}`)
    // this.formInline.topic = "thing/" + this.$route.query.productid;
    // this.client = this.originlist[0].columns;
    // this.sqlexample = this.originlist[0].sql_example;
  },
  methods: {
    // 规则选择
    // selectRegion(val) {
    //   this.originlist.map(item => {
    //     if (item.event == val) {
    //       this.client = item.columns;
    //       this.sqlexample = item.sql_example;
    //     }
    //   });
    // },
    // 布局调整
    getEditor2(val) {
      if (val == true) {
        this.row1 = 12
        this.row2 = 12
      } else {
        this.row1 = 24
        this.row2 = 0
      }
    },
    // 资源通道选择
    selectResource(val) {
      // this.resourcelist.map(item => {
      //   if (val == item.id) {
      //     this.ctype = item.attributes.cType;
      //   }
      // });
    },
    selectaction(val) {
      // if (val == "data_resource") {
      //   //物模型
      //   editormodel = ace.edit("editormodel");
      //   editormodel.session.setMode("ace/mode/json"); // 设置语言
      //   editormodel.setTheme("ace/theme/twilight"); // 设置主题
      //   editormodel.setOptions({
      //     enableBasicAutocompletion: true,
      //     enableSnippets: true,
      //     enableLiveAutocompletion: true // 设置自动提示
      //   });
      //   editormodel.setReadOnly(true);
      //   //物建表
      //   editorcreate = ace.edit("editorcreate");
      //   editorcreate.session.setMode("ace/mode/mysql"); // 设置语言
      //   editorcreate.setTheme("ace/theme/twilight"); // 设置主题
      //   editorcreate.setOptions({
      //     enableBasicAutocompletion: true,
      //     enableSnippets: true,
      //     enableLiveAutocompletion: true // 设置自动提示
      //   });
      //   //物存储
      //   editorinsert = ace.edit("editorinsert");
      //   editorinsert.session.setMode("ace/mode/mysql"); // 设置语言
      //   editorinsert.setTheme("ace/theme/gob"); // 设置主题
      //   editorinsert.setOptions({
      //     enableBasicAutocompletion: true,
      //     enableSnippets: true,
      //     enableLiveAutocompletion: true // 设置自动提示
      //   });
      //   //子表
      //   editorsubtable = ace.edit("editorsubtable");
      //   editorsubtable.session.setMode("ace/mode/mysql"); // 设置语言
      //   editorsubtable.setTheme("ace/theme/gob"); // 设置主题
      //   editorsubtable.setOptions({
      //     enableBasicAutocompletion: true,
      //     enableSnippets: true,
      //     enableLiveAutocompletion: true // 设置自动提示
      //   });
      //   var Product = Parse.Object.extend("Product");
      //   var product = new Parse.Query(Product);
      //   product.get(this.productid).then(resultes => {
      //     if (resultes) {
      //       editormodel.setValue(
      //         JSON.stringify(resultes.attributes.thing, null, 4)
      //       );
      //     }
      //   });
      // }
    },
    openDialog() {
      this.dialogVisible = true
    },
    addData() {
      // this.$refs[forName].validate(valid => {
      //   if (valid) {
      //     if (this.form.action == "data_to_resource") {
      //       this.actionData.push({
      //         name: this.form.action,
      //         params: {
      //           channel: this.form.resource,
      //           // type: this.ctype
      //         }
      //       });
      //     } else {
      //       this.actionData.push({
      //         name: this.form.action,
      //         params: {}
      //       });
      //     }
      // if (this.form.resource != "") {
      // this.resourcelist.map(item => {
      //   if (item.id == this.form.resource) {
      //     for (var key in item.attributes.config) {
      //       obj[key] = item.attributes.config[key];
      //     }
      //   }
      // });
      // var Channel = Parse.Object.extend("Channel");
      // var channel = new Channel();
      // obj.insert = editorinsert.getValue();
      // channel.id = this.form.resource;
      // obj.subtable = editorsubtable.getValue();
      // obj.datamodel = editorcreate.getValue();
      // channel.set("config", obj);
      // console.log(obj);
      // channel.save().then(
      //   response => {
      //     if (response) {
      //       this.$message("添加成功");
      //       this.dialogFormVisible = false;
      //     }
      //   },
      //   error => {
      //     returnLogin(error);
      //   }
      // );
      // } else {
      this.dialogFormVisible = false
      // }
      // }
      // });
    },
    relationChannel(objectId) {
      this.actionData.push({
        name: 'data_to_resource',
        params: {
          $resource: 'channel:' + objectId
          // type: this.ctype
        }
      })
    },
    allChannelSizeChange(val) {
      this.allChannellength = val
      this.showAllChannel()
    },
    allChannelCurrentChange(val) {
      this.allChannelstart = (val - 1) * this.allChannellength
      this.showAllChannel()
    },
    showAllChannel() {
      const params = {
        keys: 'count(*)',
        limit: this.allChannelstart,
        where:{}
      }
      this.$query_object('Channel', params).then(res => {
        this.allChanneltotal = res.count
        this.channellist = res.results
      })
    },
    testRule(forName) {
      this.formInline.result = ''
      this.formInline.payload = editor2.getValue()
      this.formInline.enginesql = editor1.getValue()
      this.$refs[forName].validate(valid => {
        if (valid) {
          var regex = /from[^"]+?"([^"]+)"/im
          var ctx = {
            clientid: this.formInline.clientid,
            payload: editor2.getValue(),
            qos: this.formInline.qos,
            topic: this.formInline.topic,
            username: this.formInline.username
          }
          ruleTest(
            this.actionData,
            ctx,
            this.formInline.remarks,
            editor1.getValue().match(regex)[1],
            '',
            editor1.getValue()
          )
            .then(response => {
              this.formInline.result = JSON.stringify(response, null, 4)
            })
            .catch(error => {
              this.$message(error.error)
            })
        }
      })
    },
    addrules(forName) {
      this.formInline.payload = editor2.getValue()
      this.formInline.enginesql = editor1.getValue()
      this.$refs[forName].validate(valid => {
        if (valid) {
          if (this.actionData.length == 0) {
            this.$message('动作不能为空')
            return
          }
          var ctx = {
            clientid: this.formInline.clientid,
            payload: editor2.getValue(),
            qos: this.formInline.qos,
            topic: this.formInline.topic,
            username: this.formInline.username
          }
          var regex = /from[^"]+?"([^"]+)"/im
          addRule(
            this.actionData,
            ctx,
            this.formInline.remarks,
            // editor1.getValue().match(regex)[1],
            editor1.getValue()
          )
            .then(resultes => {
              if (resultes) {
                this.$message('创建成功')
                this.$router.push({
                  path: '/rules_engine/engine'
                  // query: {
                  //   id: this.productid,
                  //   activeName: "sixeth"
                  // }
                })
              }
            })
            .catch(error => {
              this.$message(error)
            })
        } else {
          this.$message('有必填项未填写')
        }
      })
    },
    // 初始化resource通道
    addresouce() {
      this.dialogFormVisible = true
      this.showAllChannel()
    },
    addRes(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          postResource({ channel: this.resourceform.objectId }, this.resourceform.desc, '', 'data_resource').then(response => {
            if (response) {
              this.$message('创建成功')
              this.$refs[formName].resetFields()
              this.dialogVisible = false
              // getResource().then(response=>{
              //   if(response){
              //       this.resourcelist = response;
              //   }
              // }).catch(error=>{
              //   this.$message(error)
              // })
            }
          })
        } else {
          this.$message, error('error submit!!')
          return false
        }
      })
    },
    // 删除通道关联
    deleteOneData(index) {
      this.actionData.splice(index, 1)
    }
  }
}
</script>
<style lang="scss" scoped>
.addengine {
  width: 100%;
  padding: 20px;
  height: 100%;
  box-sizing: border-box;
  background-color: #f6f7fb;
  .addenheader {
    padding-bottom: 10px;
    /deep/ .el-breadcrumb {
      font-size: 20px;
    }
  }
  .addcontent {
    color: #71737d !important;
    /deep/ .form-block__title {
      margin-bottom: 30px;
      padding-left: 10px;
      border-left: 4px solid #34c388;
      .form-block__title-tips {
        font-size: 12px;
        display: inline-block;
        margin-left: 4px;
        color: #71737d;
      }
    }
    /deep/ .el-row {
      border-bottom: 1px solid #666666;
      margin-bottom: 20px;
    }
    /deep/ .tablebottom {
      padding-bottom: 20px;
      margin-bottom: 20px;
      border-bottom: 1px solid #666666;
      box-sizing: border-box;
    }
    /deep/ .el-select {
      width: 100%;
    }
    /deep/ .show-guess {
      margin-top: 4px;
      line-height: 1.4;
      p {
        font-size: 13px;
        margin-bottom: 4px;
        margin-top: 6px;
        color: #71737d;
        font-weight: 400;
      }
      .code {
        background-color: hsla(0, 0%, 87%, 0.8);
        line-height: 1.4;
        padding: 6px;
        border-radius: 4px;
        margin-bottom: 12px;
        font-size: 14px;
      }
    }
  }
  /deep/ .el-dialog__footer {
    padding-bottom: 40px;
  }
  // /deep/ .el-dialog__body{
  //   /deep/ .el-input{
  //     width:200px;
  //   }
  // }
}
</style>
