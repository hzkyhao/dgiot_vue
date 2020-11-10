
<template>
  <div class="editdevices">
    <div class="editheader">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/roles/thing' }">{{ $t('route.设备管理') }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ $t('route.设备详情') }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div>
      <el-tabs v-model="activeName" @tab-click="tabHandleClick">
        <el-tab-pane :label="$t('equipment.deviceinformation')" name="first">
          <div style="background:#ffffff;padding:10px;box-sizing:border-box;">
            <!-- <h4>设备信息</h4> -->
            <div>
              <table
                class="mailtable"
                style="width:100%;"
                border="0"
                cellspacing="0"
                cellpadding="0"
              >
                <!-- 设备编号: 所属产品: 安装位置 -->
                <tr>
                  <td class="cloumn">{{ $t('equipment.devicenumber')+':' }}</td>
                  <td>{{ devicedetail.devaddr }}</td>
                  <td class="cloumn">{{ $t('equipment.product')+':' }}</td>
                  <td>{{ devicedetail.productName }}</td>
                  <td class="cloumn">{{ $t('equipment.installationlocation') }}</td>
                  <td>{{ devicedetail.address }}</td>
                </tr>

                <tr>
                  <td class="cloumn">{{ $t('equipment.state')+':' }}</td>
                  <!-- <td  :class="devicedetail.status"  v-if="devicedetail.status=='ACTIVE'">{{$t('product.active')}}</td>
                   <td  :class="devicedetail.status" v-else-if="devicedetail.status=='UNACTIVE'">{{$t('product.unactive')}}</td>
                   <td  :class="devicedetail.status" v-else-if="devicedetail.status=='ONLINE'">{{$t('product.online')}}</td>
                  <td  :class="devicedetail.status"  v-else>{{$t('product.offline')}}</td>-->
                  <td class="ACTIVE">{{ $t('product.active') }}</td>
                  <td class="cloumn">ProductId:</td>
                  <td>{{ devicedetail.productid }}</td>

                  <td class="cloumn">{{ $t('equipment.lastonlinetime')+':' }}</td>
                  <td>{{ devicedetail.lastOnlineTime }}</td>
                </tr>
                <tr>
                  <td class="cloumn">{{ $t('equipment.ipaddress')+':' }}</td>
                  <td>{{ devicedetail.ip || '-' }}</td>
                  <td class="cloumn">
                    ProductSecret:
                    <el-tooltip
                      content="注意保密，如有泄露即使更换"
                      placement="top"
                      style="margin-left:5px;color:#cccccc"
                    >
                      <i class="el-icon-question"/>
                    </el-tooltip>
                  </td>
                  <td>{{ devicedetail.productSecret }}</td>
                  <td class="cloumn">{{ $t('equipment.createdAt')+':' }}</td>
                  <td>{{ devicedetail.createdAt }}</td>
                </tr>
                <tr>
                  <!-- <td class="cloumn">{{$t('equipment.subordinatenode')+':'}}</td>
                  <td>{{devicedetail.node}}</td>-->
                  <td class="cloumn">{{ $t('equipment.nodetype')+':' }}</td>
                  <td v-if="devicedetail.nodeType==0">{{ $t('product.equipment') }}</td>
                  <td v-else>{{ $t('product.gateway') }}</td>
                  <td class="cloumn">{{ $t('developer.describe')+":" }}</td>
                  <td>{{ devicedetail.desc }}</td>
                </tr>
              </table>
            </div>
          </div>
          <!-- <div class="jiange" style="width:100%;height:20px;background:#f4f4f4">

          </div>-->
          <div
            class="twofirsttable"
            style="background:#ffffff;padding:10px;box-sizing:border-box;margin-top:20px"
          >
            <h4>{{ $t('equipment.deviceextensioninformation') }}</h4>
            <el-input :row="10" v-model="devicedetail.shadow" :cols="5" type="textarea" readonly/>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="'Topic'+$t('product.list')" name="second">
          <div style="background:#ffffff;padding:10px;box-sizing:border-box;">
            <!-- <div>
                              <h4 style="display:inline">设备TOPIC类 <el-tooltip content="产品下的所有设备都会继承该产品的Topic类" placement="top" style="margin-left:5px;color:#cccccc">
                                <i class="el-icon-question"></i>
                                </el-tooltip></h4>
            </div>-->
            <el-table :data="topicData" style="width: 100%;text-align:center;">
              <el-table-column label="Topic" align="left">
                <template slot-scope="scope">
                  <span>{{ scope.row.topic.replace('\${ProductId}\/${DevAddr\}', devicedetail.productid+'/'+devicedetail.devaddr) }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('equipment.operationauthority')" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.type=='pub'">{{ $t('product.pub') }}</span>
                  <span v-if="scope.row.type=='sub'">{{ $t('product.sub') }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('developer.describe')" prop="desc" align="center"/>
              <el-table-column :label="$t('developer.operation')" align="center">
                <template slot-scope="scope">
                  <el-button
                    v-if="!scope.row.isdef"
                    type="primary"
                    size="mini"
                  >{{ $t('developer.edit') }}</el-button>
                  <el-button
                    v-if="!scope.row.isdef"
                    type="danger"
                    size="mini"
                  >{{ $t('developer.delete') }}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="$t('equipment.runningstate')" name="third">
          <div style="background:#ffffff;padding:10px;box-sizing:border-box;">
            <div style="text-align:right">
              <div style="float:left">
                <span>{{ $t('equipment.realtimerefresh') }}</span>
                <el-switch
                  v-model="isupdate"
                  active-color="#13ce66"
                  inactive-color="#cccccc"
                  @change="updateTrue($event)"
                />
              </div>

              <!-- 右上角(图表,表格)的按钮 -->
              <el-button-group>
                <el-button
                  :class="!isshowtable ? 'buttonactive':''"
                  type="primary"
                  plain
                  size="small"
                  @click="isshowtable=false"
                >{{ $t('equipment.chart') }}</el-button>
                <el-button
                  :class="isshowtable ? 'buttonactive':''"
                  type="primary"
                  plain
                  size="small"
                  @click="isshowtable=true"
                >{{ $t('equipment.table') }}</el-button>
              </el-button-group>
            </div>

            <div v-if="!isshowtable" class="thirdtb">
              <!--运行状态卡片-->
              <ul style="display: flex;flex-wrap: wrap">

                <li v-for="(item,index) in properties" :key="index" class="updatedtable">
                  <div style="height:70px;">
                    <span style="font-size:16px;">{{ item.name }}</span>
                    <span style="float:right;margin-right:10px;">
                      <svg-icon :icon-class="item.name"/>
                    </span>
                  </div>
                  <div v-if="item.dataType.type=='double'||item.dataType.type=='float'||item.dataType.type=='int'" :title="item.dataType.type" class="stla">
                    <span>{{ item.value | filterVal }}</span>
                    <span v-if="item.dataType.specs.unit">{{ item.dataType.specs.unit }}</span>
                  </div>

                  <div v-if="item.dataType.type=='enmu'||item.dataType.type=='bool'" :title="item.dataType.type" class="stla">
                    <span>{{ item.value | filterVal }}</span>
                    <span>{{ item.dataType.specs[item.value] }}</span>
                  </div>

                  <div v-if="item.dataType.type=='struct'" :title="item.dataType.type" class="stla">
                    <i
                      v-for="(key,index) in item.specs"
                      :key="index"
                      style="display:block;height:30px;font-style:normal"
                    >
                      <div v-if="key.dataType.type=='double'||key.dataType.type=='float'||key.dataType.type=='int'" class="stla" >
                        <span>{{ key.name+':' }}</span>
                        <span>{{ key.value }}</span>
                        <span v-if="key.dataType.specs.unit">{{ key.dataType.specs.unit }}</span>
                      </div>
                      <div v-if="key.dataType.type=='enmu'||key.dataType.type=='bool'" class="stla">
                        <span>{{ key.name+':' }}</span>
                        <span>{{ key.value }}</span>
                        <span>{{ key.dataType.specs[key.value] }}</span>
                      </div>
                    </i>
                  </div>

                  <div class="ta">
                    <span class="fontSize">{{ $t('equipment.updatetime')+':' }}</span>
                    <span v-if="item.time" class="fontSize">{{ timestampToTime(item.time) }}</span>
                  </div>
                  <div class="ta">
                    <el-link :underline="false" type="primary" @click="dataDetail(item)">查看数据</el-link>
                  </div>
                </li>
              </ul>
            </div>
            <div v-if="isshowtable" class="thirdtable">
              <el-table
                :data="thirdData.slice((thirdstart-1)*thirdlength,thirdstart*thirdlength)"
                style="width: 100%;text-align:center;margin-top:10px"
              >
                <el-table-column
                  :label="$t('equipment.serialnumber')"
                  align="center"
                  type="index"
                  width="100"
                />

                <el-table-column
                  :label="$t('equipment.value')"
                  prop="value"
                  align="center"
                  show-overflow-tooltip
                />
                <el-table-column
                  :label="$t('equipment.time')"
                  prop="time"
                  align="center"
                  width="300"
                />
              </el-table>
              <el-pagination
                :page-sizes="[10, 25, 50, 100]"
                :page-size="thirdlength"
                :total="thirdtotal"
                background
                layout="total, sizes, prev, pager, next, jumper"
                style="margin-top:20px;"
                @size-change="handleSizeChange1"
                @current-change="handleCurrentChange1"
              />
            </div>
          </div>
        </el-tab-pane>
        <!-- <el-tab-pane label="事件管理" name="fixth">事件管理</el-tab-pane>
                <el-tab-pane label="服务调用" name="sixth">服务调用</el-tab-pane>
                <el-tab-pane label="设备影子" name="seventh">设备影子</el-tab-pane>
        <el-tab-pane label="日志服务" name="eighth">日志服务</el-tab-pane>-->
        <el-tab-pane :label="$t('route.在线调试')" name="ninth"/>
        <!--子设备管理-->
        <el-tab-pane v-if="$route.query.nodeType != '0'" :label="$t('equipment.subdevice')" name="children">
          <div class="childrendevices">
            <el-form :inline="true" :model="childrendevices" class="demo-form-inline" size="small">
              <el-form-item :label="$t('equipment.devicenumber')+':'">
                <el-input
                  v-model="childrendevices.devicesname"
                  :placeholder="$t('equipment.devicenumber')"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="getDevices(0)">{{ $t('developer.search') }}</el-button>
              </el-form-item>
              <el-form-item>
                <el-button
                  :disabled="multipleTable.length==0"
                  type="primary"
                  @click="deleteDevcie"
                >{{ $t('equipment.RelievingAssociation') }}</el-button>
                <el-button
                  :disabled="multipleTable.length==0"
                  type="primary"
                  @click="unactiveDevice"
                >{{ $t('developer.prohibit') }}</el-button>
                <el-button
                  :disabled="multipleTable.length==0"
                  type="primary"
                  @click="activeDevice"
                >{{ $t('developer.enable') }}</el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="info" plain>{{ $t('equipment.Refresh') }}</el-button>
                <!-- 添加子设备按钮  -->
                <el-button
                  type="primary"
                  @click="childDialog=true"
                >{{ $t('equipment.addchilddevice') }}</el-button>
              </el-form-item>
            </el-form>
            <div class="devicetable">
              <el-table
                ref="filterTable"
                :data="devicesTableData"
                style="width: 100%;text-align:center;margin-top:20px;"
                @selection-change="DevicesSelectionChange"
              >
                <el-table-column type="selection" align="center" width="55"/>
                <el-table-column :label="$t('equipment.devicenumber')" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.devaddr }}</span>
                    <p style="margin:0;color:green">{{ scope.row.name }}</p>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('equipment.state')" align="center">
                  <template slot-scope="scope">
                    <span :class="scope.row.status">{{ scope.row.status }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="子网地址" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.route[devicedetail.devaddr] }}</span>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('equipment.product')" align="center">
                  <template slot-scope="scope">
                    <span type="success">{{ scope.row.productName }}</span>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('equipment.nodetype')" align="center">
                  <template slot-scope="scope">
                    <svg-icon
                      v-if="scope.row.nodeType==0"
                      icon-class="iot"
                      style="width:2rem;height:2rem"
                    />
                    <svg-icon v-else icon-class="wgicon" style="width:2rem;height:2rem"/>
                  </template>
                </el-table-column>
                <el-table-column
                  :label="$t('developer.prohibit')+'/'+$t('developer.enable')"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-switch
                      v-model="scope.row.isEnable"
                      active-color="#5eb058"
                      inactive-color="#cccccc"
                      @change="handelUpdate($event,scope.row,scope.$index)"
                    />
                  </template>
                </el-table-column>

                <el-table-column :label="$t('equipment.lastonlinetime')" align="center">
                  <template slot-scope="scope">
                    <span
                      v-if="scope.row.lastOnlineTime"
                    >{{ timestampToTime(scope.row.lastOnlineTime) }}</span>
                    <span v-else>—</span>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('developer.operation')" align="center">
                  <template slot-scope="scope">
                    <el-link
                      :underline="false"
                      type="primary"
                      icon="el-icon-view"
                      @click="deviceToDetail(scope.row)"
                    >{{ $t('equipment.see') }}</el-link>

                    <el-popover :ref="`popover-${scope.$index}`" placement="top" width="300">
                      <p>确定解除这个{{ scope.row.name }}设备关联吗？</p>
                      <div style="text-align: right; margin: 0">
                        <el-button
                          size="mini"
                          @click="scope._self.$refs[`popover-${scope.$index}`].doClose()"
                        >{{ $t('developer.cancel') }}</el-button>
                        <el-button
                          type="primary"
                          size="mini"
                          @click="makeSure(scope)"
                        >{{ $t('developer.determine') }}</el-button>
                      </div>
                      <el-link
                        slot="reference"
                        :underline="false"
                        icon="el-icon-delete"
                        type="danger"
                      >{{ $t('equipment.RelievingAssociation') }}</el-link>
                    </el-popover>

                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="elpagination" style="margin-top:20px;">
              <el-pagination
                :page-sizes="[10, 20, 30, 50]"
                :page-size="childrenDeviceLength"
                :total="childrenDeviceTotal"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="childrenDeviceSizeChange"
                @current-change="childrenDeviceCurrentChange"
              />
            </div>
          </div>
          <!--添加子设备弹窗-->
          <el-dialog
            :title="$t('equipment.addchilddevice')"
            :visible.sync="childDialog"
            :close-on-click-modal="false"
            width="30%"
          >
            <div class="childdialog">
              <el-form ref="childrenForm" :model="childrenForm" class="demo-form-inline">
                <el-form-item
                  :label="$t('equipment.products')"
                  :rules="[
                    { required: true, message: '选择产品', trigger: 'change' },
                  ]"
                  prop="product"
                >
                  <el-select
                    v-model="childrenForm.product"
                    :placeholder="$t('equipment.products')"
                    @change="checkProduct"
                  >
                    <el-option
                      v-for="(item,index) in allProudct"
                      :label="item.name"
                      :key="index"
                      :value="item.objectId"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item
                  :label="$t('product.equipment')"
                  :rules="[
                    { required: true, message: '选择设备', trigger: 'change' },
                  ]"
                  prop="device"
                >
                  <el-select
                    v-el-select-loadmore="loadmore"
                    v-model="childrenForm.device"
                    :placeholder="$t('product.equipment')"
                    :disabled="!ischange"
                  >
                    <el-option
                      v-for="(item,index) in productDevices"
                      :key="index"
                      :label="item.attributes.devaddr"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  :rules="[
                    { required: true, message: '请输入子网地址', trigger: 'blur' },
                  ]"
                  label="子网地址"
                  prop="route"
                >
                  <el-input v-model="childrenForm.route" placeholder="子网地址"/>
                </el-form-item>
              </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button @click="childDialog = false">{{ $t('developer.cancel') }}</el-button>
              <el-button
                type="primary"
                @click="submitDevice('childrenForm')"
              >{{ $t('developer.determine') }}</el-button>
            </span>
          </el-dialog>
        </el-tab-pane>
        <el-tab-pane v-if="isshowchild" label="设备指令" name="instruct">
          <Instruct :product-id="productid" :devices-id="deviceid" />
        </el-tab-pane>
      </el-tabs>
      <!--data数据dialog-->
      <el-dialog
        :visible.sync="datadialogVisible"
        :close-on-click-modal="false"
        title="历史数据"
        width="40%"
      >
        <div class="dialogcontent">
          <!--数据图表-->
          <el-tabs type="border-card" @tab-click="handleClick">
            <el-tab-pane>
              <span slot="label">
                <i class="el-icon-date"/> 表格
              </span>
              <el-table
                :data="datafordetail.slice((dataDeviceStart-1)*dataDeviceLength,dataDeviceStart*dataDeviceLength)"
                stripe
                height="300"
                style="width: 100%;text-align:center;"
              >
                <el-table-column prop="name" label="名称" align="center"/>
                <el-table-column prop="value" label="数值" align="center"/>
                <el-table-column label="时间" align="center">
                  <template slot-scope="scope">
                    <span>{{ timestampToTime(scope.row.time) }}</span>
                  </template>
                </el-table-column>
              </el-table>
              <div class="elpagination" style="margin-top:20px;">
                <el-pagination
                  :page-sizes="[10, 20, 30, 50]"
                  :page-size="dataDeviceLength"
                  :total="dataDeviceTotal.length"
                  layout="total, sizes, prev, pager, next, jumper"
                  @size-change="dataDeviceSizeChange"
                  @current-change="dataDeviceCurrentChange"
                />
              </div>
            </el-tab-pane>
            <el-tab-pane>
              <span slot="label">
                <i class="el-icon-tickets"/> 图表
              </span>
              <div id="echarts" style="height:auto;width:100%;">
                <line-chart :chart-data="lineChartData" />
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="datadialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="datadialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import Parse from 'parse'
import { utc2beijing } from '@/utils/index'
import { timestampToTime } from '@/api/login'
import { getDev } from '@/api/systemmanage/system'
import { clearInterval } from 'timers'
import { prototype } from 'stream'
import LineChart from '../dashboard/admin/components/LineChart'
import $ from 'jquery'
import { returnLogin } from '@/utils/return'
import Instruct from '../devicemanage/instruct_manage'
var dataobj = {}
export default {
  components: {
    LineChart,
    Instruct
  },
  filters: {
    filterVal(val) {
      if (val || val == 0) {
        return val
      } else {
        return '--'
      }
    }
  },
  directives: {
    'el-select-loadmore': {
      bind(el, binding) {
        // 获取element-ui定义好的scroll盒子
        const SELECTWRAP_DOM = el.querySelector(
          '.el-select-dropdown .el-select-dropdown__wrap'
        )
        SELECTWRAP_DOM.addEventListener('scroll', function() {
          /**
           * scrollHeight 获取元素内容高度(只读)
           * scrollTop 获取或者设置元素的偏移值,常用于, 计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
           * clientHeight 读取元素的可见高度(只读)
           * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
           * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
           */
          const condition =
            this.scrollHeight - this.scrollTop <= this.clientHeight
          if (condition) {
            binding.value()
          }
        })
      }
    }
  },
  data() {
    return {
      width: 0,
      lineChartData: '',
      datafordetail: [],
      datadialogVisible: false,
      childDialog: false,
      ninthform: {
        product: '',
        devices: ''
      },
      wmxform: {
        product: '',
        devices: ''
      },
      tableData: [],
      activeName: 'first',
      text: '1111111',
      deviceid: '',
      devicedetail: {},
      topicData: [],
      thirdstart: 1,
      thirdlength: 10,
      thirdtotal: 0,
      topic: [
        {
          topic: 'thing/${ProductId}/${DevAddr}/post',
          type: 'pub',
          desc: '设备上报',
          isdef: true
        },
        {
          topic: 'thing/${ProductId}/${DevAddr}',
          type: 'sub',
          desc: '消息下发',
          isdef: true
        }
      ],
      thirdData: [],
      isupdate: false,
      ispushdata: true,
      timer: null,
      properties: [],
      isshowtable: false,
      productProperties: [],
      // 子设备数据
      childrendevices: {
        devicesname: ''
      },
      multipleTable: [],
      devicesTableData: [],
      childrenDeviceLength: 10,
      childrenDeviceStart: 0,
      childrenDeviceTotal: 0,
      childrenForm: {
        product: '',
        device: '',
        route: ''
      },
      isshowchild: false,
      allProudct: [],
      productDevices: [],
      ischange: false,
      ischildren: false,
      productid: '',
      dataDeviceTotal: 0,
      dataDeviceLength: 10,
      dataDeviceStart: 1,
      devicedevaddr: '',
      dirstart: 1,
      dirlength: 20,
      selectproduct: ''
    }
  },
  watch: {
    properties: {
      deep: true,
      handler(val) {}
    }
  },
  mounted() {
    this.getDeviceDetail()
  },
  // 清除定时器
  destroyed() {
    window.clearInterval(this.timer)
    this.timer = null
  },
  methods: {
    tabHandleClick(tab) {
      if (tab.name == 'ninth') {
        this.$router.push({
          path: '/roles/onlinetest',
          query: {
            deviceid: this.devicedevaddr,
            productid: this.productid
          }
        })
      }
      if (tab.name == 'children') {
        this.getDevices()
      }
    },
    timestampToTime(timestamp) {
      var date = new Date(timestamp * 1000)
      var Y = date.getFullYear() + '-'
      var M =
        (date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1) + '-'
      var D =
        (date.getDate() + 1 <= 10 ? '0' + date.getDate() : date.getDate()) +
        ' '
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
      return Y + M + D + h + m + s
    },
    getDevices(start) {
      if (start == 0) {
        this.childrenDeviceStart = 0
      }
      this.devicesTableData = []
      var Devices = Parse.Object.extend('Device')
      var devices = new Parse.Query(Devices)
      devices.limit(this.childrenDeviceLength)
      devices.skip(this.childrenDeviceStart)
      devices.ascending('-updatedAt')

      if (this.childrendevices.devicesname != '') {
        devices.equalTo('devaddr', this.childrendevices.devicesname)
      }
      devices.matches(`route.${this.devicedetail.devaddr}`, '.+')

      devices.count().then(
        count => {
          this.childrenDeviceTotal = count
          devices.find().then(resultes => {
            if (resultes) {
              resultes.map(items => {
                var obj = {}
                obj.id = items.id
                obj.name = items.attributes.name
                obj.lastOnlineTime = this.$dateFormat(
                  this.$objGet(items, 'attributes.tag.attributes.lastOnlineTime')
                )
                obj.status = items.attributes.status
                obj.originstatus = items.attributes.status
                obj.nodeType = items.attributes.product.attributes.nodeType
                obj.desc = items.attributes.tag.attributes.desc
                obj.productName = items.attributes.product.attributes.name
                obj.devaddr = items.attributes.devaddr
                obj.isEnable = items.attributes.isEnable
                obj.route = items.attributes.route
                this.devicesTableData.push(obj)
              })
            }
          })
        },
        error => {
          returnLogin(error)
        }
      )
    },
    // 初始化
    getDeviceDetail() {
      var vm = this
      this.deviceid = this.$route.query.deviceid
      this.ischildren = this.$route.query.ischildren

      var Product = Parse.Object.extend('Product')
      var product = new Parse.Query(Product)

      var Devices = Parse.Object.extend('Device')
      var devices = new Parse.Query(Devices)
      devices.get(this.deviceid).then(resultes => {
        var obj = {}
        this.productid = this.$objGet(resultes, 'attributes.product.id')
        this.devicedevaddr = this.$objGet(resultes, 'attributes.devaddr')
        obj.id = resultes.id
        obj.createdAt = utc2beijing(resultes.createdAt)
        obj.productName = this.$objGet(resultes, 'attributes.product.attributes.name')
        obj.productid = this.$objGet(resultes, 'attributes.product.id')
        obj.address = this.$objGet(resultes, 'attributes.address')

        obj.lastOnlineTime = this.$timestampToTime(this.$objGet(resultes, 'attributes.lastOnlineTime'), true)

        obj.updatedAt = vm.$dateFormat('YYYY-mm-dd HH:MM', this.$objGet(resultes, 'attributes.updatedAt'))
        obj.ip = this.$objGet(resultes, 'attributes.ip')

        obj.basedata = JSON.stringify(resultes.attributes.basedata)
        obj.DeviceName = resultes.attributes.name
        obj.status = resultes.attributes.status
        obj.desc = this.$objGet(resultes, 'attributes.desc')
        obj.devaddr = this.$objGet(resultes, 'attributes.devaddr')
        obj.nodeType = this.$objGet(resultes, 'attributes.product.attributes.nodeType')
        // obj.node = resultes.attributes.tag.attributes.node
        obj.devType = this.$objGet(resultes, 'attributes.product.attributes.devType')
        obj.productSecret = this.$objGet(resultes, 'attributes.product.attributes.productSecret')

        const thingTemp = vm.$objGet(resultes, 'attributes.product.attributes.thing')

        if (thingTemp) {
          vm.properties = JSON.parse(
            JSON.stringify(
              thingTemp.properties
            )
          )

          console.log('vm.properties ', vm.properties)

          vm.properties.map(items => {
            dataobj[items['identifier']] = {
              expectedData: [],
              actualData: [],
              results: [],
              title:
                items['dataType']['type'] == 'int' ||
                items['dataType']['type'] == 'float' ||
                items['dataType']['type'] == 'double'
                  ? items['name'] +
                    '(' +
                    items['dataType']['specs']['unit'] +
                    ')'
                  : items['name'],
              data: [],
              max: 0
            }
          })
        } else {
          product.get(vm.productid).then(
            resultes => {
              vm.properties = JSON.parse(
                JSON.stringify(vm.$objGet(resultes, 'attributes.thing.properties'))
              )

              if (vm.properties) {
                vm.properties.map(items => {
                  dataobj[items['identifier']] = {
                    expectedData: [],
                    actualData: [],
                    results: [],
                    title:
                      items['dataType']['type'] == 'int' ||
                      items['dataType']['type'] == 'float' ||
                      items['dataType']['type'] == 'double'
                        ? items['name'] +
                          '(' +
                          items['dataType']['specs']['unit'] +
                          ')'
                        : items['name'],
                    data: [],
                    max: 0
                  }
                })
              } else {
                console.log('product resultes none')
              }
            },
            error => {
              returnLogin(error)
            }
          )
        }
        if (resultes.attributes.product.attributes.topics) {
          this.topicData = resultes.attributes.product.attributes.topics.concat(
            this.topic
          )
        } else {
          this.topicData = this.topic
        }

        this.devicedetail = obj
        if (this.$route.query.nodeType != 0 && this.ischildren == 'true') {
          this.activeName = 'children'
          this.isshowchild = true
          this.getDevices()

          /* product.find().then(resultes => {
            console.log('产品列表 ###');
            this.allProudct = resultes;
          }); */

          this.$axiosWen.get('/classes/Product', {
            params: {
              'where': {
                objectId: {
                  $ne: vm.productid
                }
              },
              'order': 'updatedAt' // -updatedAt  updatedAt
            }
          })
            .then(response => {
              // this.productListForReport = response.results
              this.allProudct = response.results
            })
        } else if (
          this.$route.query.nodeType !=0 &&
          this.ischildren == 'false'
        ) {
          this.isshowchild = true
        } else {
          this.isshowchild = false
        }
        // 初始化物模型数据
        this.isupdate = true
        // this.Update()
        this.updateTrue(true)
      })
    },
    // 实时刷新
    Update() {
      var vm = this

      console.log('实时刷新')

      getDev(this.devicedetail.devaddr, this.devicedetail.productid)
        .then(response => {
          if (response) {
            if (response.results && response.results.length != 0) {
              vm.thirdData.unshift({
                time: timestampToTime(Math.ceil(new Date().getTime() / 1000)),
                value: JSON.stringify(response)
              })
            }
            vm.thirdtotal = vm.$objGet(vm, 'thirdData.length')

            // 动态$set,数据更新试图也一样更新，如果只是遍历的话试图回更新过慢

            if (vm.properties && response.results) {
              vm.properties.map((item, index) => {
                response.results.map((updatedata, updatedindex) => {
                  if (item.identifier == updatedata.identifier) {
                    var obj = response.results[updatedindex]
                    vm.$set(vm.properties, index, obj)
                  }
                })
              })

              for (var key in dataobj) {
                response.results.map(items => {
                  if (key == items.identifier) {
                    dataobj[key].expectedData.push(items.value)
                    dataobj[key].actualData.push(
                      timestampToTime(items.time).substring(11)
                    )
                    if (dataobj[key].results && dataobj[key].results.length > 0) {
                      dataobj[key].results.unshift(items)
                    }
                    dataobj[key].max = this.$objGet(items, 'dataType.specs.max')
                  }
                })
              }
            }
          }
        })
        .catch(error => {
          console.log('update error 清除timer', error)
          window.clearInterval(vm.timer)
          this.isupdate = false
        })
    },
    dataDetail(item) {
      this.datadialogVisible = true
      var lineChartData = {}
      for (var key in dataobj) {
        if (item.identifier == key) {
          this.datafordetail = dataobj[key].data
          lineChartData = dataobj[key]
          this.dataDeviceTotal = dataobj[key].data
        }
      }
      console.log(lineChartData)
      this.lineChartData = lineChartData
    },
    // 定时器启动
    updateTrue(event) {
      this.ispushdata = false
      if (event == true) {
        this.timer = window.setInterval(() => {
          this.Update()
        }, 5000)
      } else {
        window.clearInterval(this.timer)
        this.timer = null
      }
    },
    // 实时数据的分页
    dataDeviceSizeChange(val) {
      this.dataDeviceStart = 1
    },
    dataDeviceCurrentChange(val) {
      this.dataDeviceStart = val
    },
    handleSizeChange1(val) {
      this.thirdstart = 1
      this.thirdlength = val
    },
    handleCurrentChange1(val) {
      this.thirdstart = val
    },
    // 子设备管理表格
    DevicesSelectionChange(val) {
      this.multipleTable = val
    },
    // 子设备分页
    childrenDeviceCurrentChange(val) {
      this.childrenDeviceStart = (val - 1) * this.childrenDeviceLength
      this.getDevices()
    },
    childrenDeviceSizeChange(val) {
      this.childrenDeviceLength = val
      this.getDevices()
    },
    checkProduct(val) {
      this.ischange = true
      this.selectproduct = val
      var Devices = Parse.Object.extend('Device')
      var devices = new Parse.Query(Devices)
      devices.equalTo('product', val)
      devices.notEqualTo('objectId', this.deviceid)
      devices.notEqualTo('parentId', this.deviceid)
      devices.skip((this.dirstart - 1) * this.dirlength)
      devices.limit(this.dirlength)
      devices.find().then(
        response => {
          if (response && response.length > 0) {
            this.productDevices = [...response]
          } else {
            this.productDevices = []
          }
          this.childrenForm.device = ''
        },
        error => {
          returnLogin(error)
        }
      )
    },
    deviceToDetail(row) {
      this.$router.push({
        path: '/roles/editdevices',
        query: {
          deviceid: row.id,
          nodeType: row.nodeType,
          ischildren: 'false'
        }
      })
    },
    loadmore() {
      this.dirstart++
      this.checkProduct(this.selectproduct)
    },
    submitDevice(formName) {
      // 添加子设备
      this.$refs[formName].validate(valid => {
        if (valid) {
          var route = {}
          route[this.devicedevaddr] = this.childrenForm.route
          var Devices = Parse.Object.extend('Device')
          var devices = new Parse.Query(Devices)
          var devices1 = new Devices()
          devices.get(this.childrenForm.device).then(
            response => {
              devices1.id = this.deviceid
              response.set('parentId', devices1)
              response.set('route', route)
              response.save().then(resultes => {
                if (resultes) {
                  this.$message({
                    type: 'success',
                    message: '添加成功'
                  })
                  this.childDialog = false
                  this.getDevices()
                  this.$refs['childrenForm'].resetFields()
                }
              })
            },
            error => {
              returnLogin(error)
            }
          )
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    deleteDevcie(val) {
      Promise.all([
        this.multipleTable.map(item => {
          var Devices = Parse.Object.extend('Device')
          // var devices = new Parse.Query(Devices);
          var devices1 = new Devices()
          devices1.id = item.id
          devices1.set('parentId', null)
          devices1.save().then(resultes => {})
        })
      ])
        .then(data => {
          if (data && data.length != 0) {
            this.$message({
              message: '解除关联成功',
              type: 'success'
            })
            this.getDevices()
          } else {
            this.$message({
              message: '解除关联失败',
              type: 'error'
            })
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 设备多个启用和禁用
    unactiveDevice(val) {
      Promise.all([
        this.multipleTable.map(item => {
          var Devices = Parse.Object.extend('Device')
          var devices = new Devices()
          devices.id = item.id
          devices.set('isEnable', false)
          devices.save().then(resultes => {})
        })
      ])
        .then(data => {
          if (data && data.length != 0) {
            this.$message({
              message: '禁用成功',
              type: 'success'
            })
            this.getDevices()
          } else {
            this.$message({
              message: '禁用失败',
              type: 'error'
            })
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    activeDevice(val) {
      Promise.all([
        this.multipleTable.map(item => {
          var Devices = Parse.Object.extend('Device')
          var devices = new Devices()
          devices.id = item.id
          devices.set('isEnable', true)
          devices.save().then(resultes => {})
        })
      ])
        .then(data => {
          if (data && data.length != 0) {
            this.$message({
              message: '启用成功',
              type: 'success'
            })
            this.getDevices()
          } else {
            this.$message({
              message: '启用失败',
              type: 'error'
            })
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    /* el-popover点击关闭*/
    makeSure(scope) {
      // 可以在这里执行删除数据的回调操作.......删除操作.....

      const objRoute = JSON.parse(JSON.stringify(scope.row.route))

      const routeKey = this.devicedevaddr
      // 删除key为上级设备地址值
      delete objRoute[routeKey]

      var Devices = Parse.Object.extend('Device')
      var devices1 = new Devices()
      devices1.id = scope.row.id
      devices1.set('parentId', null)
      devices1.set('route', objRoute)
      devices1.save().then(
        response => {
          if (response) {
            this.$message({
              type: 'success',
              message: '解除关联成功'
            })
            scope._self.$refs[`popover-${scope.$index}`].doClose()
            this.getDevices()
          }
        },
        error => {
          this.$message({
            type: 'error',
            message: error.message
          })
        }
      )
    },
    handelUpdate(event, row, index) {
      var newData1 = {}
      for (var key in row) {
        newData1[key] = row[key]
      }
      newData1.isEnable = newData1.isEnable != true
      this.devicesTableData[index] = newData1
      this.$confirm('是否修改此设备状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          var newData2 = {}
          for (var key in row) {
            newData2[key] = row[key]
          }
          newData2.isEnable = newData2.isEnable == true
          var Devices = Parse.Object.extend('Device')
          var devices = new Parse.Query(Devices)
          devices.get(row.id).then(
            object => {
              object.set('isEnable', newData2.isEnable)
              object.save().then(resultes => {
                this.$message({
                  type: 'success',
                  message: '状态修改成功'
                })
              })
              this.getDevices()
            },
            error => {
              returnLogin(error)
            }
          )
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消修改'
          })
          const newData = row
          newData.isEnable = newData.isEnable != true
          this.devicesTableData[index] = newData
        })
    },
    // 查看历史数据
    /**/

    handleClick(val) {}
  }
}
</script>
<style scoped>
.editdevices {
  height: 100%;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}
.editdevices .OFFLINE {
  color: red;
}
.editdevices .ACTIVE,
.editdevices .ONLINE {
  color: green;
}
.mailtable .cloumn {
  text-align: left;
  background: #fafafc;
  color: #74777a;

  font-weight: bold;
  border-right: 1px solid #ebecec;
  border-bottom: 1px solid #ebecec;
}
.editdevices .updatedtable {
  width: 300px;
  height: 190px;
  margin: 20px 20px 0 0;
  border: 1px solid #cccccc;
  /* text-align: center; */
  border-radius: 5px;
  font-size: 14px;
  box-shadow: 10px 10px 10px 5px grey;
  list-style: none;
  line-height: 40px;
  /* letter-spacing: 1px; */
  padding-left: 20px;
  box-sizing: border-box;
}
.editdevices .buttonactive {
  background-color: #409eff;
  color: white;
}
.mailtable td {
  padding: 15px;
  font-size: 14px;
  text-align: left;
  box-sizing: border-box;
  color: #74777a;
  border: 1px solid #ebecec;
}
.childrendevices {
  width: 100%;
  height: auto;
  padding: 10px;
  box-sizing: border-box;
  background: white;
}
</style>
<style>
.editdevices .el-tabs__item {
  font-size: 16px;
  margin-top: 20px;
  margin: 0;
  height: 50px;
  line-height: 50px;
  font-family: auto;
}
.editdevices .el-tabs__content {
  background: #f4f4f4;
  padding: 20px;
  box-sizing: border-box;
}
.editdevices .childrendevices .el-form-item:last-child {
  float: right;
}
.editdevices .childdialog .el-form-item__content {
  clear: both;
}
.editdevices .childdialog .el-form-item__content .el-select {
  width: 100%;
}
.fontSize {
  font-size: 12px;
  color: #666666;
}
.editdevices .svg-icon {
  width: 3rem;
  height: 3rem;
  margin-top: 5px;
}
.stla {
  font-size: 25px;
  color: #666666;
  font-family: fantasy;
  text-align: center;
}
.ht7 {
  height: 70px;
}
</style>

