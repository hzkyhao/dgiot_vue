<template>
  <div class="channelmanage">
    <h3>{{ $t('developer.servicechannelmanagement') }}</h3>
    <el-tabs v-model="activeName">
      <el-tab-pane :label="$t('developer.equipmentchannel')+'('+total+')'" name="first">
        <div class="firsttable">
          <el-form :inline="true" :model="channelformsearch" class="demo-form-inline" size="small">
            <el-form-item>
              <el-input v-model="channelformsearch.name" :placeholder="$t('developer.inputchannelname')"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getChannel(0)">{{ $t('developer.search') }}</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="addchanneltype">{{ $t('developer.selectchannel') }}</el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-table :data="tableData" :row-class-name="getChannelEnable" style="width: 100%;">
          <el-table-column :label="$t('developer.channelnumber')">
            <template slot-scope="scope">
              <span>{{ scope.row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('developer.channelname')">
            <template slot-scope="scope">
              <span>{{ scope.row.attributes.name }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('developer.channeltype')">
            <template slot-scope="scope">
              <span v-if="scope.row.attributes.type==1">{{ $t('developer.collectionchannel') }}</span>
              <span v-else>{{ $t('developer.resourcechannel') }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('developer.servicetype')">
            <template slot-scope="scope">
              <span>{{ scope.row.attributes.cType }}</span>
            </template>
          </el-table-column>

          <el-table-column :label="$t('developer.channelstatus')">
            <template slot-scope="scope">
              <span v-if="scope.row.attributes.status=='ONLINE'" style="color:green">在线</span>
              <span v-else style="color:red">离线</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('developer.channeladdr')" width="200">
            <!-- <template slot="header" slot-scope="scope">
              <span>
                <el-tooltip content="${productId}为对应的产品Id,${addr}为对应的设备地址" placement="top">
                  <span>
                    通道路径
                    <i class="el-icon-question"></i>
                  </span>
                </el-tooltip>
              </span>
            </template>-->
            <template slot-scope="scope">
              <span>{{ 'channel/'+scope.row.id }}</span>
            </template>
          </el-table-column>

          <el-table-column :label="$t('developer.describe')">
            <template slot-scope="scope">
              <span>{{ scope.row.attributes.desc }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('developer.operation')" width="300">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.attributes.isEnable==false"
                type="success"
                size="mini"
                @click="qyChannel(scope.row,'enable')"
              >{{ $t('developer.enable') }}</el-button>
              <el-button v-else type="danger" size="mini" @click="qyChannel(scope.row,'disable')">{{ $t('developer.prohibit') }}</el-button>
              <el-button type="primary" size="mini" @click="updateChannel(scope.row)">{{ $t('developer.edit') }}</el-button>
              <el-popover :ref="`popover-${scope.$index}`" placement="top" width="300">
                <p>确定删除这个{{ scope.row.attributes.name }}通道吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button
                    size="mini"
                    @click="scope._self.$refs[`popover-${scope.$index}`].doClose()"
                  >{{ $t('developer.cancel') }}</el-button>
                  <el-button type="primary" size="mini" @click="deleteChannel(scope)">{{ $t('developer.determine') }}</el-button>
                </div>
                <el-button slot="reference" type="danger" size="mini">{{ $t('developer.delete') }}</el-button>
              </el-popover>
              <el-button type="primary" size="mini" @click="subProTopic(scope.row)">订阅日志</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="elpagination" style="margin-top:20px;">
          <el-pagination
            :page-sizes="[10, 20, 30, 50]"
            :page-size="length"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="channelSizeChange"
            @current-change="channelCurrentChange"
          />
        </div>
        <!--通道管理弹窗---------------------------------------------------------------------------------------------->
        <el-dialog
          :title="$t('developer.servicechannelmanagement')"
          :visible.sync="channelForm"
          :close-on-click-modal="false"
          :before-close="handleClose"
          width="40%"
          top="0"
        >
          <!-- <div style="margin:20px 0;">服务通道设置</div> -->
          <el-form ref="addchannel" :model="addchannel" :rules="addrules" label-width="120px">
            <el-form-item :label="$t('developer.servicetype')" prop="region" class="lastchildren">
              <el-select
                v-model="addchannel.region"
                :placeholder="$t('developer.servicetype')"
                :disabled="channelId!=''"
                @change="removeauto"
              >
                <el-option
                  v-for="(item,index) in channelregion"
                  :label="item.name+item.channeltype"
                  :key="index"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('developer.channelname')" prop="name" class="lastchildren">
              <el-input v-model="addchannel.name" :placeholder="$t('developer.channelname')" autocomplete="off"/>
            </el-form-item>

            <el-form-item
              v-if="addchannel.region=='UDP'||addchannel.region=='TCP'|| addchannel.region=='HTTP'||addchannel.region=='TCPMRTU'"
              :label="$t('developer.port')"
              :rules="[{ required: true, message:&quot;端口不能为空&quot;,trigger: &quot;blur&quot; }, { validator: validPort }]"
              prop="port"
              class="notlastchildren"
            >
              <el-input v-model.number="addchannel.port" :placeholder="$t('developer.port')" autocomplete="off"/>
            </el-form-item>
            <el-form-item
              v-if="addchannel.region=='UDP'||addchannel.region=='TCP'|| addchannel.region=='TCPMRTU'"
              label="IP"
              class="notlastchildren"
            >
              <el-input v-model="addchannel.ip" autocomplete="off" disabled/>
            </el-form-item>
            <el-form-item
              v-if="addchannel.region=='TCP'|| addchannel.region=='TCPMRTU'"
              :label="$t('developer.cacheconstraint')"
              :rules="[
                { required: true, message: &quot;最大存储不能为空&quot;, trigger: &quot;blur&quot; },
                { type: &quot;number&quot;, message: &quot;最大存储必须为数字值&quot; }
              ]"
              prop="buff_size"
              class="notlastchildren"
            >
              <el-input v-model.number="addchannel.buff_size" :min="1" autocomplete="off">
                <template slot="append">KB</template>
              </el-input>
            </el-form-item>
            <el-form-item
              v-if="addchannel.region=='HTTP'"
              :label="$t('developer.path')"
              :rules="[
              { required: true, message: &quot;需要输入正确的url&quot;, trigger: &quot;blur&quot; }]"
              prop="path"
              class="notlastchildren"
            >
              <el-input v-model="addchannel.path" :placeholder="$t('developer.path')" autocomplete="off"/>
            </el-form-item>
            <!--Tdengine部分配置-------------------------------------------------------------------------------------->
            <el-form-item
              v-if="addchannel.region=='Tdengine'"
              :label="$t('developer.servicelink')"
              :rules="[
                { required: true, message: &quot;需要输入正确的url&quot;, trigger: &quot;blur&quot; },
                { validator: validUrl, trigger: &quot;blur&quot; }
              ]"
              prop="server"
              class="lastchildren"
            >
              <el-input v-model="addchannel.server" :placeholder="$t('developer.servicelink')" autocomplete="off">
                <template slot="prepend">http://</template>
              </el-input>
            </el-form-item>
            <el-form-item
              v-if="addchannel.region=='Tdengine'"
              :label="$t('developer.libraryname')"
              :rules="[
                { required: true, message: &quot;请输入用户名&quot;, trigger: &quot;blur&quot; }
              ]"
              prop="username"
              class="notlastchildren"
            >
              <el-input
                v-model="addchannel.username"
                :placeholder="$t('developer.libraryname')"
                autocomplete="off"
                type="text"
                class="notauto"
                readonly
              />
            </el-form-item>
            <el-form-item
              v-if="addchannel.region=='Tdengine'"
              :label="$t('developer.librarypassword')"
              :rules="[{ required: true, message: &quot;请输入密码&quot;, trigger: &quot;blur&quot; }]"
              prop="password"
              class="notlastchildren"
            >
              <el-input
                v-model="addchannel.password"
                :placeholder="$t('developer.librarypassword')"
                :type="pwdType"
                autocomplete="off"
                class="notauto"
                readonly
              >
                <template slot="append">
                  <span class="show-pwd" style="cursor:pointer" @click="showPwd">
                    <svg-icon :icon-class="pwdType=='password' ? 'eye':'zheneys'" />
                  </span>
                </template>
              </el-input>
            </el-form-item>
            <!--同步间隔提示---------------------------------------------------------------------------------->
            <el-form-item
              v-if="addchannel.region=='Tdengine'"
              :label="$t('developer.synchronousinterval')"
              :rules="[
                { required: true, message: &quot;同步间隔不能为空&quot;, trigger: &quot;blur&quot; },
                { type: &quot;number&quot;, message: &quot;同步间隔必须为数字值&quot; }
              ]"
              prop="auto_save"
              class="notlastchildren"
            >
              <el-input
                v-model.number="addchannel.auto_save"
                :min="1"
                :placeholder="$t('developer.synchronousinterval')"
                autocomplete="off"
              >
                <template slot="append">秒</template>
              </el-input>
            </el-form-item>
            <el-form-item
              v-if="addchannel.region=='Tdengine'"
              :label="$t('developer.amountdata')"
              :rules="[
                { required: true, message: &quot;最大条数不能为空&quot;, trigger: &quot;blur&quot; },
                { type: &quot;number&quot;, message: &quot;最大条数必须为数字值&quot; }
              ]"
              prop="max_size"
              class="notlastchildren"
            >
              <el-input
                v-model.number="addchannel.max_size"
                :min="1"
                :placeholder="$t('developer.amountdata')"
                autocomplete="off"
              >
                <template slot="append">条</template>
              </el-input>
            </el-form-item>
            <el-form-item
              v-if="addchannel.region=='Tdengine'"
              :label="$t('developer.cacheconstraint')"
              :rules="[
                { required: true, message: &quot;最大存储不能为空&quot;, trigger: &quot;blur&quot; },
                { type: &quot;number&quot;, message: &quot;最大存储必须为数字值&quot; }]"
              prop="max_memory"
              class="notlastchildren"
            >
              <el-input v-model.number="addchannel.max_memory" :min="1" autocomplete="off">
                <template slot="append">KB</template>
              </el-input>
            </el-form-item>
            <!----------------MQTT----------------------------------------------------------------------------------->
            <el-form-item
              v-if="addchannel.region=='MQTT'"
              class="lastchildren"
              style="margin-bottom:10px;"
            >
              <span>
                <i class="el-icon-question"/>topic或client满足下面任意条件
              </span>
            </el-form-item>
            <el-form-item v-if="addchannel.region=='MQTT'" label="Topic" class="notlastchildren">
              <el-input v-model="addchannel.topic" :placeholder="$t('developer.regularexpression')" autocomplete="off"/>
            </el-form-item>
            <el-form-item v-if="addchannel.region=='MQTT'" label="Client" class="notlastchildren">
              <el-input v-model="addchannel.client" :placeholder="$t('developer.regularexpression')" autocomplete="off"/>
            </el-form-item>
            <el-form-item :label="$t('developer.describe')" class="lastchildren">
              <el-input
                v-model="addchannel.desc"
                :rows="3"
                :placeholder="$t('developer.describe')"
                autocomplete="off"
                type="textarea"
              />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="handleClose">{{ $t('developer.cancel') }}</el-button>
            <el-button type="primary" @click="addchannelForm('addchannel')">{{ $t('developer.determine') }}</el-button>
          </div>
        </el-dialog>

      </el-tab-pane>
    </el-tabs>
    <el-dialog :title="channelname+'日志'" :visible.sync="subdialog" :before-close="handleCloseSubdialog" :close-on-click-modal="false" width="85%">
      <div style="margin-top:20px;">

        <pre id="subdialog" class="ace_editor" style="min-height:300px;width:100%">
                      <textarea class="ace_text-input" style="overflow:scroll"/>
        </pre>
      </div>
      <span slot="footer" class="dialog-footer" style="height:30px;">
        <el-switch
          v-model="value4"
          style="display: inline-block;margin-right:10px;"
          active-color="#13ce66"
          inactive-color="#ff4949"
          inactive-text="自动刷新"
          @change="stopsub"
        />
      </span>
    </el-dialog>
  </div>
</template>
<script>
/* {params}/由于一些表单的验证用v-if所以规则要写在里面*/
import Parse from 'parse'
import { channelConnect } from '@/api/Channel/index.js'
import { subupadte } from '@/api/System/index'
var subdialog
import {
  Websocket,
  sendInfo,
  TOPIC_EMPTY,
  MSG_EMPTY,
  DISCONNECT_MSG
} from '@/utils/wxscoket.js'
export default {
  data() {
    return {
      innerVisible: false,
      // 全部产品信息
      allProductData: [],
      allProductlength: 10,
      allProductstart: 0,
      allProducttotal: 0,
      productData: [],
      channelProductdialog: false,
      productstart: 0,
      productlength: 10,
      producttotal: 0,
      total: 0,
      start: 0,
      length: 10,
      tableData: [],
      activeName: 'first',
      channelregion: [
        {
          name: 'HTTP',
          value: 'HTTP',
          channeltype: '采集通道',
          channelvalue: '1'
        },
        {
          name: 'TCP',
          value: 'TCP',
          channeltype: '采集通道',
          channelvalue: '1'
        },
        {
          name: 'UDP',
          value: 'UDP',
          channeltype: '采集通道',
          channelvalue: '1'
        },
        {
          name: 'MQTT',
          value: 'MQTT',
          channeltype: '采集通道',
          channelvalue: '1'
        },
        {
          name: 'modbusTCP',
          value: 'TCPMRTU',
          channeltype: '采集通道',
          channelvalue: '1'
        }
      ],
      channelformsearch: {
        name: ''
      },
      channelForm: false,
      addchannel: {
        name: '',
        region: 'HTTP',
        topic: '',
        port: '',
        channeltype: '',
        ip: '0.0.0.0',
        path: '',
        client: '',
        desc: '',
        auto_save: 30,
        max_size: 10000,
        max_memory: 1024000,
        server: '',
        username: '',
        password: '',
        isEnable: false,
        buff_size: 1024000,
        address: '',
        clean_start: false,
        ssl: false,
        keepalive: '',
        // kafka参数
        kafkaclient: '127.0.0.1:9092',
        kafkametadata: '3s',
        kafkaduring: '3s',
        kafkakb: '1024KB',
        kafkays: '',
        kafkahc: '1024KB',
        postgresqlconnect: '',
        postgresqlhost: '',
        postgresqlusername: '',
        postgresqlpassword: '',
        postgresqlport: 5432,
        postgresqldatabase: 'postgres',
        postgresqlssl: 'disable',
        postgresqllength: '',
        postgresqlname: ''
      },
      pwdType: 'password',
      channelId: '',
      addrules: {
        name: [{ required: true, message: '请输入通道名称', trigger: 'blur' }],
        region: [
          { required: true, message: '请选择服务类型', trigger: 'change' }
        ],
        channeltype: [
          { required: true, message: '请选择通道类型', trigger: 'change' }
        ]
      },
      productIds: [],
      channelupdated: '',
      issub: false,
      subtimer: null,
      subdialog: false,
      textarea: '',
      subdialogtimer: null,
      subdialogid: '',
      subaction: 'stop',
      channelname: '',
      value4: true
    }
  },
  mounted() {
    this.getChannel()
  },
  beforeDestroy() {
    window.clearInterval(this.subtimer)
    this.subtimer = null
    window.clearInterval(this.subdialogtimer)
    this.subdialogtimer = null
  },
  methods: {
    // 验证
    validUrl(rule, value, callback) {
      const reg = /^[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/
      if (!reg.test(value)) {
        callback(new Error('需要输入正确的url'))
      } else {
        callback()
      }
    },
    validPort(rule, value, callback) {
      const reg = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/
      if (!reg.test(value)) {
        callback(new Error('需要输入正确的端口号'))
      } else {
        callback()
      }
    },
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    getChannelEnable(row, rowIndex) {
      if (row.row.attributes.isEnable == true) {
        return 'green_active'
      } else {
        return 'red_active'
      }
    },
    utc2beijing(utc_datetime) {
      // 转为正常的时间格式 年-月-日 时:分:秒
      var date = new Date(+new Date(utc_datetime) + 8 * 3600 * 1000)
        .toISOString()
        .replace(/T/g, ' ')
        .replace(/\.[\d]{3}Z/, '')
      return date // 2017-03-31 16:02:06
    },
    addchanneltype() {
      this.channelForm = true
      this.channelupdated = '新增'
    },
    removeauto() {
      // 去掉自动补全
      setTimeout(() => {
        var notautolength = document.getElementsByClassName('notauto')
        for (var i = 0; i < notautolength.length; i++) {
          notautolength[i].children[0].removeAttribute('readonly')
        }
      }, 1000)
    },
    // 初始化
    getChannel(start) {
      if (start == 0) {
        this.start = 0
      }
      var Channel = Parse.Object.extend('Channel')
      var channel = new Parse.Query(Channel)
      if (this.channelformsearch.name != '') {
        channel.equalTo('name', this.channelformsearch.name)
      }
      channel.equalTo('type', '1')
      channel.ascending('-createdAt')
      channel.skip(this.start)
      channel.limit(this.length)
      channel.count().then(
        count => {
          this.total = count
          channel.find().then(resultes => {
            if (resultes) {
              this.tableData = resultes
            }
          })
        },
        error => {
          this.$message(error.message)
        }
      )
    },
    // 分页
    channelSizeChange(val) {
      this.length = val
      this.getChannel()
    },
    channelCurrentChange(val) {
      this.start = (val - 1) * this.length
      this.getChannel()
    },
    // 通道类型选择
    // 新增服务通道
    addchannelForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var userid = Parse.User.current().id
          this.channelregion.map(item => {
            if (item.name == this.addchannel.region) {
              this.addchannel.channeltype = item.channelvalue
            }
          })
          var Channel = Parse.Object.extend('Channel')
          var searchchannel = new Parse.Query(Channel)
          searchchannel.equalTo('config.port', this.addchannel.port)
          searchchannel.find().then(resultes => {
            var channel = new Channel()
            var acl = new Parse.ACL()
            acl.setReadAccess(userid, true)
            acl.setWriteAccess(userid, true)
            if (this.channelId != '') {
              channel.id = this.channelId
            } else {
              if (resultes.length == 0) {
              } else {
                this.$message({
                  type: 'warning',
                  message: '此端口已存在'
                })
              }
            }
            channel.set('ACL', acl)
            channel.set('name', this.addchannel.name)
            channel.set('cType', this.addchannel.region)
            channel.set('type', '1')
            channel.set('desc', this.addchannel.desc)
            channel.set('isEnable', this.addchannel.isEnable)
            if (this.addchannel.region == 'UDP') {
              channel.set('config', {
                port: this.addchannel.port
              })
            } else if (this.addchannel.region == 'TCP' || this.addchannel.region == 'TCPMRTU') {
              channel.set('config', {
                port: this.addchannel.port,
                buff_size: this.addchannel.buff_size
              })
            } else if (this.addchannel.region == 'MQTT') {
              channel.set('config', {
                topic: this.addchannel.topic,
                client: this.addchannel.client
              })
            } else if (this.addchannel.region == 'HTTP') {
              channel.set('config', {
                path: this.addchannel.path,
                port: this.addchannel.port
              })
            } else if (this.addchannel.region == 'Tdengine') {
              channel.set('config', {
                auto_save: this.addchannel.auto_save,
                max_size: this.addchannel.max_size,
                max_memory: this.addchannel.max_memory,
                server: 'http://' + this.addchannel.server,
                username: this.addchannel.username,
                password: this.addchannel.password
              })
            } else if (this.addchannel.region == 'MQTTCLI') {
              channel.set('config', {
                address: this.addchannel.address,
                port: this.addchannel.port,
                username: this.addchannel.username,
                password: this.addchannel.password,
                clean_start: this.addchannel.clean_start,
                ssl: this.addchannel.ssl,
                keepalive: this.addchannel.keepalive
              })
            }
            channel.save().then(
              resultes => {
                if (resultes) {
                  this.$message({
                    type: 'success',
                    message: '成功'
                  })
                  this.addchannel = {
                    name: '',
                    region: 'HTTP',
                    topic: '',
                    port: '',
                    channeltype: '',
                    auto_save: '',
                    max_size: '',
                    max_memory: '',
                    server: '',
                    username: '',
                    password: '',
                    desc: '',
                    buff_size: '',
                    path: '',
                    isEnable: false,
                    ip: '0.0.0.0',
                    address: '',
                    clean_start: false,
                    ssl: false,
                    keepalive: ''
                  }
                  this.channelForm = false
                  this.channelId = ''
                  this.getChannel()
                }
              },
              error => {
                this.$message({
                  type: 'error',
                  message: error.message
                })
              }
            )
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 测试连接
    testConnect(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.addchannel.region == 'MongoDB' || this.addchannel.region == 'MySQL' || this.addchannel.region == 'postgresql') {
            channelConnect(this.addchannel.region.toLowerCase(), this.addchannel.postgresqlhost, this.addchannel.postgresqlport, this.addchannel.postgresqlusername, this.addchannel.postgresqlpassword, this.addchannel.postgresqldatabase, this.addchannel.postgresqllength, this.addchannel.postgresqlname, this.addchannel.postgresqlconnect, this.addchannel.postgresqlssl).then(resultes => {
              if (resultes) {
                this.$notify({
                  title: '成功',
                  message: '连接可用 ',
                  type: 'success',
                  duration: 2000
                })
              }
            }).catch(error => {
              this.$message(error.error)
            })
          }
        } else {
          this.$message('有必填项未填写')
          return false
        }
      })
    },
    // 关闭弹窗清空
    handleClose() {
      this.addchannel = {
        name: '',
        region: 'HTTP',
        topic: '',
        port: '',
        channeltype: '',
        ip: '0.0.0.0',
        path: '',
        client: '',
        auto_save: '',
        max_size: '',
        max_memory: '',
        server: '',
        username: '',
        password: '',
        desc: '',
        buff_size: '',
        isEnable: false,
        address: '',
        clean_start: false,
        ssl: false,
        keepalive: ''
      }
      this.channelForm = false
      // this.$refs["addchannel"].resetFields();
      this.channelId = ''
    },
    // 更新状态
    qyChannel(row, action) {
      subupadte(row.id, action)
        .then(resultes => {
          if (resultes) {
            this.$message({
              type: 'success',
              message: `${action == 'enable' ? '启用成功' : '禁用成功'}`
            })
          }
          this.getChannel()
        })
        .catch(error => {
          this.$message(error.error)
        })
    },
    // 编辑
    updateChannel(row) {
      this.channelForm = true
      this.channelupdated = '编辑'
      this.addchannel.name = row.attributes.name
      this.addchannel.region = row.attributes.cType
      if (row.attributes.cType == 'MQTT') {
        this.addchannel.topic = row.attributes.config.topic
        this.addchannel.client = row.attributes.config.client
      } else if (row.attributes.cType == 'HTTP') {
        this.addchannel.path = row.attributes.config.path
      } else if (row.attributes.cType == 'Tdengine') {
        this.addchannel.auto_save = row.attributes.config.auto_save
        this.addchannel.max_size = row.attributes.config.max_size
        this.addchannel.max_memory = row.attributes.config.max_memory
        //  this.addchannel.path=row.attributes.config.path
        this.addchannel.server = row.attributes.config.server.substring(7)
        this.addchannel.username = row.attributes.config.username
        this.addchannel.password = row.attributes.config.password
      } else if (row.attributes.cType == 'TCP' || this.addchannel.region == 'TCPMRTU') {
        this.addchannel.buff_size = row.attributes.config.buff_size
        // this.addchannel.port = row.attributes.config.port;
      } else if (row.attributes.cType == 'MQTTCLI') {
        this.addchannel.address = row.attributes.config.address
        this.addchannel.username = row.attributes.config.username
        this.addchannel.password = row.attributes.config.password
        this.addchannel.clean_start = row.attributes.config.clean_start
        this.addchannel.ssl = row.attributes.config.ssl
        this.addchannel.keepalive = row.attributes.config.keepalive
      }
      this.addchannel.ip = '0.0.0.0'
      this.addchannel.port = row.attributes.config.port
      this.addchannel.desc = row.attributes.desc
      this.addchannel.channeltype = row.attributes.type
      this.addchannel.isEnable = row.attributes.isEnable
      this.channelId = row.id
    },
    // 删除
    deleteChannel(scope) {
      var Channel = Parse.Object.extend('Channel')
      var channel = new Channel()
      channel.id = scope.row.id
      channel.destroy().then(
        resultes => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          scope._self.$refs[`popover-${scope.$index}`].doClose()
          this.getChannel()
        },
        error => {
          this.$message({
            type: 'error',
            message: error.message
          })
        }
      )
    },
    nowtime() {
      var timestamp3 = Date.parse(new Date())
      var date = new Date(timestamp3)
      var Y = date.getFullYear() + '年'
      var M =
        (date.getMonth() + 1 <= 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1) + '月'
      var D =
        (date.getDate() + 1 <= 10 ? '0' + date.getDate() : date.getDate()) +
        '日  '
      var h =
        (date.getHours() + 1 <= 10 ? '0' + date.getHours() : date.getHours()) +
        ':'
      var m =
        (date.getMinutes() + 1 <= 10
          ? '0' + date.getMinutes()
          : date.getMinutes()) + ':'
      var s =
        date.getSeconds() + 1 <= 10
          ? '0' + date.getSeconds()
          : date.getSeconds()
      return h + m + s + ' '
    },
    // 订阅日志
    subProTopic(row) {
      this.subdialog = true
      this.subdialogid = row.id
      this.channelname = row.id
      setTimeout(() => {
        subdialog = ace.edit('subdialog')
        subdialog.session.setMode('ace/mode/text') // 设置语言
        subdialog.setTheme('ace/theme/gob') // 设置主题
        subdialog.setReadOnly(true)
        subdialog.setOptions({
          enableBasicAutocompletion: false,
          enableSnippets: true,
          enableLiveAutocompletion: true // 设置自动提示
        })
      })
      var info = {
        topic: 'log/channel/' + row.id,
        qos: 2
      }
      var channeltopic = new RegExp('log/channel/' + row.id)
      var submessage = ''
      var _this = this
      Websocket.add_hook(channeltopic, function(Msg) {
        // 判断长度
        if (subdialog.session.getLength() >= 1000) {
          submessage = ''
        } else {
          submessage += _this.nowtime() + Msg + `\n`
        }
        subdialog.setValue(submessage)
        subdialog.gotoLine(subdialog.session.getLength())
      })
      // 订阅
      var text0 = JSON.stringify({ action: 'start_logger' })
      Websocket.subscribe(info, function(res) {
        if (res.result) {
          console.log(info)
          console.log('订阅成功')
          var sendInfo = {
            topic: 'channel/' + row.id,
            text: text0,
            retained: true,
            qos: 2
          }
          Websocket.sendMessage(sendInfo)
          _this.subdialogtimer = window.setInterval(() => {
            Websocket.sendMessage(sendInfo)
          }, 600000)
        }
      })
    },
    stopsub(value) {
      var text0
      if (value == false) {
        // this.subaction = 'start'
        text0 = JSON.stringify({ action: 'stop_logger' })
      } else {
        // this.subaction = 'stop'
        text0 = JSON.stringify({ action: 'start_logger' })
      }
      var sendInfo = {
        topic: 'channel/' + this.subdialogid,
        text: text0,
        retained: true,
        qos: 2
      }
      Websocket.sendMessage(sendInfo)
    },
    handleCloseSubdialog() {
      var text0 = JSON.stringify({ action: 'stop_logger' })
      var sendInfo = {
        topic: 'channel/' + this.subdialogid,
        text: text0,
        retained: true,
        qos: 2
      }
      Websocket.sendMessage(sendInfo)
      this.subdialog = false
      window.clearInterval(this.subdialogtimer)
      this.subdialogtimer = null
    }
  }
}
</script>
<style lang="scss" scoped>
.channelmanage {
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
  .firsttable {
    /deep/ .el-form-item:last-child {
      float: right;
    }
  }
  /deep/ .el-dialog__header {
    border-bottom: 1px solid #cccccc;
  }
  /deep/ .el-dialog__body {
    .el-form {
      display: flex;
      flex-wrap: wrap;
      .el-form-item {
        width: 50%;
        .el-select {
          width: 100%;
        }
      }
      .lastchildren {
        width: 100%;
        // .el-form-item__label{
        //   position: relative;
        //   left:20px;
        //   text-align:left;
        // }
      }
      .notlastchildren {
        @media screen and (max-width: 1350px) {
          width: 100%;
        }
      }
      /deep/ .notline {
        .el-form-item__label {
          text-align: left;
          position: relative;
          left: 100px;
          z-index: 100;
        }
        .el-form-item__content {
          margin-left: 100px !important;
        }
        @media screen and (max-width: 1350px) {
          .el-form-item__label {
            text-align: left;
            position: relative;
            left: 30px;
            z-index: 100;
          }
          .el-form-item__content {
            margin-left: 30px !important;
          }
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
