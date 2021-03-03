<template>
  <div class="equipment">
    <h3 style="margin:0;">{{ $t('equipment.equipmentstatistics') }}</h3>
    <div class="equ_header">
      <ul>
        <li>
          <p>
            <span class="svg-container">
              <svg-icon icon-class="devicelist" />
            </span>
            {{ $t('equipment.totalequipment') }}
            <el-tooltip
              :content="$t('equipment.totalequipment')"
              placement="top"
            >
              <i class="el-icon-question" />
            </el-tooltip>
          </p>
          <span>{{ devicetotal }}</span>
        </li>
        <li>
          <p>
            <span class="svg-container">
              <svg-icon icon-class="shuliang" />
            </span>
            {{ $t('equipment.activationdevice') }}
            <el-tooltip :content="$t('equipment.totalactive')" placement="top">
              <i class="el-icon-question" />
            </el-tooltip>
          </p>
          <span>{{ activeall }}</span>
        </li>
        <li>
          <p>
            <span class="svg-container">
              <svg-icon icon-class="onlinelist" />
            </span>
            {{ $t('equipment.onlinedevices') }}
            <el-tooltip :content="$t('equipment.totalonline')" placement="top">
              <i class="el-icon-question" />
            </el-tooltip>
          </p>
          <span>{{ onlineall }}</span>
        </li>
        <li>
          <div class="block">
            <el-image
              v-if="productimg"
              :src="productimg"
              style="width:250px;height:200px;position:relative;top:-55px;text-align: center;
               line-height: 200px;"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
          </div>
        </li>
      </ul>
    </div>
    <div class="equtabs">
      <!--tabs第一个标签页-->
      <div style="margin-top:20px;" class="equdevices">
        <el-select
          v-model="equvalue"
          :disabled="!productenable"
          class="selectdetail"
          size="small"
          @change="selectProductid(equvalue)"
        >
          <el-option
            v-for="(item,index) in proTableData"
            :label="item.name"
            :key="index"
            :value="item.objectId"
          />
        </el-select>
        <el-select v-model="selectdevice" class="selectdetail" size="small">
          <el-option :value="$t('equipment.devicename')" />
          <el-option :value="$t('equipment.devicenumber')" />
        </el-select>
        <el-input
          v-if="selectdevice==$t('equipment.devicename')"
          v-model="deviceinput"
          :placeholder="$t('equipment.enterproductname')"
          size="small"
          class="selectdetail"
        />
        <el-input
          v-else
          v-model="deviceinput"
          :placeholder="$t('equipment.enterdevicenumber')"
          size="small"
          class="selectdetail"
        />
        <!-- <el-input v-model="devicenumber" placeholder="请输入设备编号" style="margin:0;"></el-input> -->
        <el-button
          size="small"
          type="primary"
          class="selectdetail"
          @click="getDevices(0)"
        >{{ $t('developer.search') }}</el-button>
        <el-button
          :disabled="multipleTable.length==0"
          size="small"
          type="primary"
          class="selectdetail"
          @click="deleteDevcie"
        >{{ $t('developer.delete') }}</el-button>
        <el-button
          :disabled="multipleTable.length==0"
          size="small"
          type="primary"
          class="selectdetail"
          @click="unactiveDevice(false)"
        >{{ $t('developer.prohibit') }}</el-button>
        <el-button
          :disabled="multipleTable.length==0"
          size="small"
          type="primary"
          class="selectdetail"
          @click="unactiveDevice(true)"
        >{{ $t('developer.enable') }}</el-button>
        <el-button size="small">{{ $t('equipment.batchaddition') }}</el-button>
        <el-button
          type="primary"
          size="small"
          @click="addDeviceForm"
        >{{ $t('equipment.adddevice') }}</el-button>
      </div>
      <!--第一个表格-->
      <div class="tabstable">
        <el-table
          ref="filterTable"
          :data="tableData"
          :row-style="rowClass"
          style="width: 100%;text-align:center;margin-top:20px;"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" align="center" width="55" />
          <el-table-column
            :label="$t('equipment.devicenumber')+'/'+$t('equipment.name')"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.devaddr }}</span>
              <p style="margin:0;color:green">{{ scope.row.name }}</p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('equipment.state')" align="center">
            <template slot-scope="scope">
              <!-- <span  :class="scope.row.status" v-if="scope.row.status=='ACTIVE'">{{$t('product.active')}}</span><el-tooltip content="设备已注册" placement="top" v-if="scope.row.status=='ACTIVE'">
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                  <span class="ACTIVE">已注册</span>
                  <el-tooltip content="设备已注册" placement="top">
                    <i class="el-icon-question"></i>
                  </el-tooltip>

                   <span  :class="scope.row.status" v-if="scope.row.status=='UNACTIVE'">{{$t('product.unactive')}}</span><el-tooltip content="设备未注册" placement="top" v-if="scope.row.status=='UNACTIVE'">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                  -->
              <span
                v-if="scope.row.status=='ONLINE'"
                :class="scope.row.status"
              >{{ $t('product.online') }}</span>
              <el-tooltip
                v-if="scope.row.status=='ONLINE'"
                content="设备已经上线"
                placement="top"
              >
                <i class="el-icon-question" />
              </el-tooltip>

              <span
                v-if="scope.row.status=='OFFLINE'"
                :class="scope.row.status"
              >{{ $t('product.offline') }}</span>
              <el-tooltip
                v-if="scope.row.status=='OFFLINE'"
                content="设备已经离线"
                placement="top"
              >
                <i class="el-icon-question" />
              </el-tooltip>
              <span
                v-if="scope.row.status!='OFFLINE' && scope.row.status!='ONLINE' "
                :class="scope.row.status"
              >未注册</span>
            </template>
          </el-table-column>

          <el-table-column
            :label="$t('equipment.product')"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.product.name }}</span>
            </template>
          </el-table-column>

          <el-table-column :label="$t('equipment.nodetype')" align="center">
            <template slot-scope="scope">
              <svg-icon
                v-if="scope.row.nodeType==0"
                icon-class="iot"
                style="width:2rem;height:2rem"
              />
              <svg-icon
                v-else
                icon-class="wgicon"
                style="width:2rem;height:2rem"
              />
              <!-- <el-tag type="success" >设备</el-tag>
                  <el-tag type="success" v-else>网关</el-tag>-->
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('developer.enable')+'/'+$t('developer.prohibit')"
            align="center"
          >
            <template slot-scope="scope">
              <!-- <span
                    style="display:inline-block;width:5px;height:5px;border-radius:50%;background:#cccccc;vertical-align:middle"
                    v-if="scope.row.isEnable==false"
                  ></span>
                  <span v-if="scope.row.isEnable==false">已禁用</span>
                  <span
                    style="display:inline-block;width:5px;height:5px;border-radius:50%;background:#5eb058;vertical-align:middle"
                    v-if="scope.row.isEnable==true"
                  ></span>
                  <span v-if="scope.row.isEnable==true">已启用</span>-->
              <el-switch
                v-model="scope.row.isEnable"
                active-color="#5eb058"
                inactive-color="#cccccc"
                @change="handelUpdate($event,scope.row,scope.$index)"
              />
            </template>
          </el-table-column>

          <!-- <el-table-column :label="$t('equipment.lastonlinetime')" align="center">
                <template slot-scope="scope">
                  <span
                    v-if="scope.row.lastOnlineTime"
                  >{{timestampToTime(scope.row.lastOnlineTime)}}</span>
                  <span v-else>—</span>
                </template>
              </el-table-column>-->
          <el-table-column label="创建时间">
            <template slot-scope="scope">
              <span>{{ utc2beijing(scope.row.createdAt) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('developer.operation')"
            align="center"
          >
            <template slot-scope="scope">
              <el-link
                :underline="false"
                type="primary"
                icon="el-icon-view"
                @click="deviceToDetail(scope.row)"
              >{{ $t('equipment.see') }}</el-link>
              <el-popover
                :ref="`popover-${scope.$index}`"
                placement="top"
                width="300"
              >
                <p>确定删除这个{{ scope.row.name }}设备吗？</p>
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
                >{{ $t('developer.delete') }}</el-link>
              </el-popover>
              <el-link
                v-if="scope.row.nodeType !=0"
                :underline="false"
                type="primary"
                icon="el-icon-s-unfold"
                @click="deviceToChildren(scope.row)"
              >{{ $t('equipment.subdevice') }}</el-link>
              <el-link
                :underline="false"
                type="primary"
                icon="el-icon-edit"
                @click="editorDevice(scope.row)"
              >编辑</el-link>
              <el-link type="primary" @click="goEdit(scope.row)">视图</el-link>
            </template>
          </el-table-column>
        </el-table>
        <div class="elpagination" style="margin-top:20px;">
          <el-pagination
            :page-sizes="[10, 20, 30, 50]"
            :page-size="devicelength"
            :total="devicetotal"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="deviceSizeChange"
            @current-change="deviceCurrentChange"
          />
        </div>
      </div>
      <!--添加设备弹窗-->
      <el-dialog
        :title="'设备'+equipmentEditor"
        :visible.sync="devicedialogVisible"
        :close-on-click-modal="false"
        :before-close="handleClose"
        width="50%"
      >
        <div slot="title" class="header-title">
          <span class="title-name">
            {{ '设备'+equipmentEditor }}
            <el-tooltip
              :content="$t('equipment.text')"
              placement="top"
              style="margin-left:5px"
            >
              <i class="el-icon-question" />
            </el-tooltip>
          </span>
        </div>
        <div class="devicecontent">
          <el-form
            ref="deviceform"
            :model="deviceform"
            :rules="rules"
            label-width="150px"
          >

            <el-form-item :label="$t('equipment.devicename')" prop="name">
              <el-input v-model="deviceform.name" />
            </el-form-item>
            <el-form-item :label="$t('equipment.devicenumber')" prop="devaddr">
              <el-input v-model="deviceform.devaddr" />
            </el-form-item>
            <el-form-item :label="$t('product.productname')" prop="productName">
              <el-select
                v-model="deviceform.productName"
                :placeholder="$t('equipment.entername')"
                :disabled="!productenable||!changeproduct"
              >
                <el-option
                  v-for="(item,index) in proTableData1"
                  :label="item.name"
                  :key="index"
                  :value="item.objectId"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('equipment.assetnumber')">
              <el-input v-model="deviceform.assetNum" />
            </el-form-item>
            <el-form-item :label="$t('equipment.equipmenttype')">
              <el-input v-model="deviceform.devModel" />
            </el-form-item>
            <el-form-item :label="$t('equipment.equipmentbrand')">
              <el-input v-model="deviceform.brand" />
            </el-form-item>
            <el-form-item :label="$t('equipment.installationlocation')">
              <el-input v-model="deviceform.address" @focus="updateLocation" />
            </el-form-item>
            <el-form-item :label="$t('developer.describe')">
              <el-input
                v-model="deviceform.desc"
                :autosize="{ minRows: 4, maxRows: 4}"
                type="textarea"
              />
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button
            type="primary"
            @click="submitForm('deviceform')"
          >{{ $t('developer.determine') }}</el-button>
          <el-button @click="handleClose">{{ $t('developer.cancel') }}</el-button>
        </span>
      </el-dialog>
      <!--第二个弹窗批次添加-->
      <el-dialog
        :visible.sync="pcdialogVisible"
        :close-on-click-modal="false"
        :before-close="handleClose1"
        title="批次添加"
        width="50%"
      >
        <div class="pccontent">
          <el-form
            ref="pcformInline"
            :inline="true"
            :model="pcformInline"
            :rules="pcformrule"
            class="demo-form-inline"
          >
            <el-form-item :label="$t('equipment.batchname')" prop="pcname">
              <el-input
                v-model="pcformInline.pcname"
                :placeholder="$t('equipment.batchname')"
              />
            </el-form-item>
            <el-form-item :label="$t('equipment.createdAt')" prop="createdtime">
              <el-date-picker
                v-model="pcformInline.createdtime"
                type="datetime"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="addbatch('pcformInline')"
              >{{ $t('equipment.addbatch') }}</el-button>
            </el-form-item>
          </el-form>
          <el-table
            :data="pctableData"
            height="450"
            style="width: 100%;text-align:center"
          >
            <el-table-column
              :label="$t('equipment.serialnumber')"
              type="index"
              align="center"
              width="50"
            />
            <el-table-column :label="$t('equipment.batchname')" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.attributes.data.batch_name }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('equipment.createdAt')" align="center">
              <template slot-scope="scope">
                <span>{{ utc2beijing(scope.row.createdAt) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('developer.operation')"
              align="center"
              width="300"
            >
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  @click="updatebatch(scope.row,scope.row.objectId)"
                >{{ $t('developer.edit') }}</el-button>
                <el-button
                  type="danger"
                  size="mini"
                  @click="deletebatch(scope.row.objectId)"
                >{{ $t('developer.delete') }}</el-button>
                <el-button
                  type="success"
                  size="mini"
                  @click="selectbatch(scope.row,scope.row.objectId)"
                >选择</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-dialog>
      <el-dialog
        v-el-drag-dialog
        :visible.sync="bmapdialogVisible"
        :close-on-click-modal="false"
        :before-close="handleClosebmap"
        title="设备安装地址"
        width="50%"
      >
        <div>
          <el-form :model="bmapform" :inline="true" size="small">
            <!-- <el-form-item label="地址">
              <el-input v-model="bmapform.location" placeholder="请输入市或者县名称"></el-input>
            </el-form-item>-->
            <el-form-item label="地址名称">
              <el-input v-model="bmapform.keyword" />
            </el-form-item>
            <!-- <el-form-item>
              <el-button type="primary" @click="addressSure">搜 索</el-button>
            </el-form-item>-->
            <el-form-item label="选中地址">
              <el-input v-model="bmapform.address" readonly />
            </el-form-item>
          </el-form>
          <!-- <label>地址：<input v-model="bmapfrom.keyword"></label> -->
          <baidu-map
            :center="center"
            :zoom="zoom"
            :scroll-wheel-zoom="true"
            :map-click="false"
            style="height:300px "
            @ready="handler"
            @click="mapClick"
          >
            <!-- 必须给容器指高度，不然地图将显示在一个高度为0的容器中，看不到 -->
            <!-- <bml-marker-clusterer :averageCenter="true">
            <bm-marker :position="{lng: center.lng, lat: center.lat}"></bm-marker>
            </bml-marker-clusterer>-->
            <bm-local-search
              :keyword="bmapform.keyword"
              :auto-viewport="true"
              :location="bmapform.location"
              zoom="12.8"
              style="display:none"
            />
            <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT" />
            <bm-geolocation
              :show-address-bar="true"
              :auto-location="true"
              anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
            />
            <bm-city-list anchor="BMAP_ANCHOR_TOP_LEFT" />
            <!-- <bm-marker :position="center" style="display:none">
              <bm-info-window  @close="infoWindowClose" @open="infoWindowOpen" style="font-size: 14px">
              <p>11111</p>
              </bm-info-window>
            </bm-marker>-->
          </baidu-map>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addressSure">保 存</el-button>
          <el-button @click="bmapdialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { query_object, get_object, del_object, update_object } from "@/api/shuwa_parse"
import { Batchdelete } from '@/api/Batch'
import { Promise } from 'q'
import Cookies from 'js-cookie'
import { getProduct } from "@/api/Product/index";
import elDragDialog from '@/directive/el-dragDialog' // base on element-ui
import { BmlMarkerClusterer } from 'vue-baidu-map'
import { utc2beijing } from '@/utils'
import { returnLogin } from '@/utils/return'

var language
var pcdata
export default {
  components: {
    elDragDialog
  },
  data() {
    const CheckDevaddr = function(rule, value, callback) {
      var reg = /[0-9A-Za-z]$/
      if (value == '') {
        callback(new Error('设备地址不能为空'))
      } else {
        if (!reg.test(value)) {
          callback(new Error('设备地址必须为大小写字母数字'))
        } else {
          callback()
        }
      }
    }
    return {
      productimg: '',
      bmapdialogVisible: false,
      onlineall: '',
      activeall: '',
      userId: '',
      batchid: '',
      pcdialogVisible: false,
      devicedialogVisible: false,
      equvalue: '0',
      cities: [],
      activeName: 'first',
      selectdevice: '',
      deviceinput: '',
      devicenumber: '',
      multipleTable: [],
      selectRow: [],
      devicelength: 10,
      devicestart: 0,
      devicetotal: 0,
      visible2: false,
      deviceform: {
        name: '',
        devaddr: '',
        batchId: '',
        desc: '',
        nodeType: 0,
        devType: '',
        netType: '',
        assetNum: '',
        devModel: '',
        address: '',
        productName: '',
        status: '',
        isEnable: '',
        brand: ''
      },
      rules: {
        name: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
        devaddr: [
          { required: true, message: '请输入设备编号', trigger: 'blur' },
          { validator: CheckDevaddr }
        ],
        batchId: [
          { required: true, message: '请输入设备批次', trigger: 'blur' }
        ],
        nodeType: [
          { required: true, message: '请输入设备类型', trigger: 'blur' }
        ],
        netType: [
          { required: true, message: '请选择网络格式', trigger: 'change' }
        ],
        devType: [
          { required: true, message: '请选择设备类型', trigger: 'change' }
        ],
        productName: [
          { required: true, message: '请选择产品名称', trigger: 'change' }
        ]
      },
      pcformrule: {
        pcname: [
          { required: true, message: '请输入批次名称', trigger: 'blur' }
        ],
        createdtime: [
          {
            type: 'date',
            required: true,
            message: '请选择创建时间',
            trigger: 'change'
          }
        ]
      },
      pcformInline: {
        pcnumber: '',
        pcname: '',
        createdtime: ''
      },
      pctableData: [],
      equipmentEditor: '添加',
      tableData: [],
      options: [],
      proTableData: [],
      proTableData1: [],
      activelength: [],
      onlinelength: [],
      center: { lng: 0, lat: 0 }, // 经纬度
      zoom: 13, // 地图展示级别
      bmapform: {
        keyword: '',
        location: '',
        address: ''
      },
      deviceid: '',
      map: null,
      addresspointer: '',
      productenable: true,
      changeproduct: true,
      tagsid: '',
      productroleslist: []
    }
  },
  watch: {
    multipleTable(data) {
      this.selectRow = []
      if (data.length > 0) {
        data.forEach((item, index) => {
          this.selectRow.push(this.tableData.indexOf(item))
        })
      }
    }
  },
  mounted() {
    this.searchProduct()
    this.getDevices(0)
    this.addDeviceBatch(0)
    language = Cookies.get('language')
    this.$store.dispatch('getUserId', '111')
    if (this.$route.query.productid) {
      this.selectProductid(this.$route.query.productid)
    }
  },
  methods: {
    async rolesSelect(val) {
      console.log('val', val)
      this.productroleslist = []
      const { results } = await this.$get_object('Product', val)
    },
    goEdit(row) {
      console.log(row)
      if (this.$globalConfig.serverURL.substr(0, 1) == '/') {
        var topoUrl = window.location.origin + '/spa'
      } else {
        var topoUrl = this.$globalConfig.localTopoUrl
      }
      var url = `${topoUrl}/#?devaddr=${row.devaddr}&proudctid=${row.productid}`
      window.open(url, '__blank')
      localStorage.setItem('topoData', JSON.stringify(row.config))
      // window.open(
      //   `http://192.168.2.58:8339/#/equipment?devaddr=${row.devaddr}&productid=${row.productid}`,
      //   '_blank'
      // )
    },
    // 从产品处进来
    async selectProductid(val) {
      console.log("selectProductid", val)
      console.log(this.equvalue)
      this.productroleslist = [];
      const parsms = {};
      const { results } = await this.$query_object("Product", parsms);
      const res = results.filter(i => {
        return i.objectId == val;
      });

      for (var key in res[0].ACL) {
        if (key.includes("role")) {
          this.productroleslist.push(key.substr(5));

          console.log(key, this.productroleslist);
        }
      }
    },
    addressSure() {
      var localSearch = new BMap.LocalSearch(this.map)
      localSearch.enableAutoViewport() // 允许自动调节窗体大小
      var _this = this
      //       localSearch.setSearchCompleteCallback(function (searchResult) {
      //         console.log(searchResult)
      // 　　　　var poi = searchResult.getPoi(0);
      // 　　　　console.log(poi.point.lng + "," + poi.point.lat) //获取经度和纬度，将结果显示在文本框中
      // 　　　　_this.map.centerAndZoom(poi.point, 13);
      // 　　});
      if (this.bmapform.address == '') {
        this.deviceform.address = this.bmapform.keyword
      }
      localSearch.search(this.bmapform.keyword)
      this.bmapdialogVisible = false
    },
    handler({ BMap, map }) {
      this.center.lng = 120.2
      this.center.lat = 30.26667
      this.zoom = this.zoom
      this.map = map
    },
    mapClick(e) {
      console.log(e)
      this.center.lng = e.point.lng
      this.center.lat = e.point.lat
      this.addresspointer =
        e.point.lng.toFixed(6) + ',' + e.point.lat.toFixed(6)
      const geocoder = new BMap.Geocoder() // 创建地址解析器的实例
      //  let Marker = new BMap.Marker()
      geocoder.getLocation(e.point, rs => {
        // this.add.site = rs.address;
        //  Marker.closeInfoWindow()
        //   console.log(rs)
        this.bmapform.address = rs.address
        this.deviceform.address = rs.address
        // 地址描述(string)=
        // console.log(rs.address);    //这里打印可以看到里面的详细地址信息，可以根据需求选择想要的
        // console.log(rs.addressComponents);//结构化的地址描述(object)
        // console.log(rs.addressComponents.province); //省
        // console.log(rs.addressComponents.city); //城市
        // console.log(rs.addressComponents.district); //区县
        // console.log(rs.addressComponents.street); //街道
        // console.log(rs.addressComponents.streetNumber); //门牌号
        // console.log(rs.surroundingPois); //附近的POI点(array)
        // console.log(rs.business); //商圈字段，代表此点所属的商圈(string)
      })
    },
    // 地图更新
    updateLocation() {
      this.bmapdialogVisible = true
    },
    handleClosebmap() {
      this.bmapdialogVisible = false
    },
    // 激活设备
    async getActiveDevices() {
      var params = {
        'where': {
          'status': 'ACTIVE'
        }
      }
      if (this.deviceinput != '') {
        if (
          this.selectdevice == '设备名称' ||
          this.selectdevice == 'Device Name'
        ) {
          params.where.name = this.deviceinput
        } else {
          params.where.devaddr = this.deviceinput
        }
      }
      if (this.devicenumber != '') {
        params.where.devaddr = this.devicenumber
      }
      if (this.equvalue != 0) {
        params.where.product = this.equvalue
      }
      var devices = await this.$queryDevice(params)
      this.activeall = devices.results.length
    },
    async getOnlineDevices() {
      var params = {
        'where': {
          'status': 'ONLINE'
        }

      }

      if (this.deviceinput != '') {
        if (this.selectdevice == '设备名称') {
          params.where.name = this.deviceinput
        } else {
          params.where.devaddr = this.deviceinput
        }
      }
      if (this.devicenumber != '') {
        params.where.devaddr = this.devicenumber
      }
      if (this.equvalue != 0) {
        params.where.product = this.equvalue
      }
      var devices = await this.$queryDevice(params)
      this.onlineall = devices.results.length
    },

    // 查询产品
    async searchProduct() {
      this.proTableData = []
      this.proTableData1 = []
      const { results } = await this.$query_object('Product', {})
      this.proTableData = results
      this.proTableData.unshift({
        name: language == 'zh' ? '全部产品' : 'All Products',
        objectId: '0'
      })

      this.proTableData1 = results.filter(item => item.objectId != '0')

      if (this.$route.query.productid) {
        this.equvalue = this.$route.query.productid
        this.productenable = false
      }
      this.getDevices()
    },
    async getDevices(start) {
      this.tableData = []
      const params = {
        limit: this.devicelength,
        skip: this.devicestart,
        order: '-createdAt',
        keys: 'count(*)',
        include: 'product',
        where: {}
      }
      if (this.deviceinput != '') {
        if (this.selectdevice == '设备名称') {
          params.where.name = this.deviceinput
        } else {
          params.where.devaddr = this.deviceinput
        }
      }
      if (this.devicenumber != '') {
        params.where.devaddr = this.devicenumber
      }
      if (this.equvalue != 0) {
        params.where.product = this.equvalue
      }

      if (start == 0) {
        this.devicestart = 0
      }
      const res = await this.$queryDevice(params)
      this.tableData = res.results

      this.devicetotal = res.count

      // 查询激活设备
      this.getActiveDevices()

      // 查询在线设备
      this.getOnlineDevices()
    },

    // 状态设备编辑
    async handelUpdate(event, row, index) {
      var newData1 = {}
      var that = this
      for (var key in row) {
        newData1[key] = row[key]
      }
      newData1.isEnable = newData1.isEnable != true
      this.tableData[index] = newData1
      this.$confirm('是否修改此设备状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          // var newData2 = {}
          // for (var key in row) {
          //   newData2[key] = row[key]
          // }
          // newData2.isEnable = newData2.isEnable == true
          // this.tableData[index] = newData2
          var deviceData = await get_object("Device", row.objectId)
          var isEnable = deviceData.isEnable
          if (isEnable == undefined) {
            isEnable = false
          } else {
            isEnable = !isEnable
          }
          deviceData.isEnable = isEnable
          const { createdAt, ...data } = deviceData;
          const { updatedAt, ...data2 } = data;
          var result = await this.$update_object('Device', row.objectId, data2)
          if (result != undefined) {
            this.$message({
              type: 'success',
              message: '状态修改成功'
            })
            this.getDevices()
          } else {
            console.log('Device error', error)
            returnLogin(error)
          }
        })
        .catch(async() => {
          this.$message({
            type: 'info',
            message: '已取消修改'
          })
          const newData = row
          newData.isEnable = newData.isEnable != true
          this.tableData[index] = newData
        })
    },
    timestampToTime(timestamp) {
      var date = new Date(timestamp * 1000)
      var Y = date.getFullYear() + '-'
      var M =
        (date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1) + '-'
      var D =
        (date.getDate() + 1 <= 10 ? '0' + date.getDate() : date.getDate()) + ' '
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
    utc2beijing(utc_datetime) {
      // 转为正常的时间格式 年-月-日 时:分:秒
      var date = new Date(+new Date(utc_datetime) + 8 * 3600 * 1000)
        .toISOString()
        .replace(/T/g, ' ')
        .replace(/\.[\d]{3}Z/, '')
      return date // 2017-03-31 16:02:06
    },
    filterTag(value, row) {
      return row.tag === value
    },
    /* 设备列表选中 */
    handleSelectionChange(val) {
      this.multipleTable = val
    },

    // 批量删除设备
    async deleteDevcie(val) {
      this.multipleTable.map(async item => {
        const result = await this.$del_object('Device', item.objectId)
      })
      this.$message({
        message: '删除成功',
        type: 'success'
      })
      this.getDevices()
    },
    async editDevice() {
      const res = await this.$update_object('Device', item.objectId, params)
      if (res.updatedAt) {
        this.initQuery('设备修改成功', 'success')
      } else {
        this.$message({
          type: "error",
          message: res.error
        })
      }
    },
    // 设备多个启用和禁用
    // async unactiveDevice(val) {
    //   var fail = 0
    //   this.multipleTable.map(async item => {
    //     var params = {
    //       'objectId': item.objectId,
    //       'isEnable': false
    //     }
    //     const result = await this.$update_object('Device', item.objectId, params)
    //     if (result.code == 101) {
    //       fail++;
    //     }
    //   })

    //   if (fail == 0) {
    //     this.$message({
    //       message: '禁用成功',
    //       type: 'success'
    //     })

    //     this.getDevices()
    //   } else {
    //     this.$message({
    //       message: '禁用失败',
    //       type: 'error'
    //     })
    //   }
    // },
    // 设备多个启用和禁用
    async unactiveDevice(isEnable) {
      const idarr = []
      const requests = []
      this.multipleTable.map(item => {
        idarr.push(item.objectId)
      })
      const body = {
        "isEnable": isEnable
      }
      const res = await Batchdelete('PUT',
        'Device', idarr, body)
      // console.log(res)
      if (res) {
        // 处理不规则的返回参数
        res.forEach((li, index) => {
          li.objectId = idarr[index]
          li.sortIndex = index + 1
          if (Object.keys(res[index])[0] == 'success') {
            li.msg = `edit success`
            li.dangerouslyUseHTMLString = false
          } else {
            li.msg = `<ol>
              edit error <br>
              message: ${li.error.error} <br>
              code: ${li.error.code} <ol>`
            li.dangerouslyUseHTMLString = true
          }
          requests.push({ type: Object.keys(res[index])[0], message: li.msg, dangerouslyUseHTMLString: li.dangerouslyUseHTMLString })
        })
        // console.log(requests)
        requests.forEach((i, index) => {
          this.$baseNotify(i.message, `${idarr[index]}`, i.type, "top-right", 5000 * i.sortIndex, i.dangerouslyUseHTMLString)
        })
        this.getDevices()
      }
    },
    /* @pamras 选中高亮*/
    rowClass({ row, rowIndex }) {
      if (this.selectRow.includes(rowIndex)) {
        console.log(rowIndex)
        return { 'background-color': 'rgba(185, 221, 249, 0.3)' }
      }
    },
    /* @param deviceSizeChange 设备列表分页*/

    deviceSizeChange(val) {
      this.devicelength = val
      this.getDevices()
    },
    deviceCurrentChange(val) {
      this.devicestart = (val - 1) * this.devicelength
      this.getDevices()
    },
    /* 关闭添加设备弹窗*/
    handleClose() {
      this.deviceid = ''
      this.deviceform = {}
      this.devicedialogVisible = false
      this.equipmentEditor = '添加'
    },
    addDeviceForm() {
      this.devicedialogVisible = true
      this.equipmentEditor = '添加'
      if (this.$route.query.productid) {
        this.deviceform.productName = this.$route.query.productid
      } else {
        if (this.equvalue != 0) {
          this.changeproduct = false
          this.deviceform.productName = this.equvalue
        } else {
          this.deviceform.productName = ''
        }
      }
    },
    /* 关闭批次弹窗*/
    handleClose1() {
      this.pcdialogVisible = false
      this.batchid = ''
      this.pcformInline = {
        pcname: '',
        createdtime: ''
      }
    },
    /* el-popover点击关闭*/
    async makeSure(scope) {
      // 可以在这里执行删除数据的回调操作.......删除操作.....
      const res = await this.$del_object('Device', scope.row.objectId)
      console.log(res)
      if (res.error) {
        this.$message({
          type: 'error',
          message: '删除失败'
        })
      } else {
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.getDevices()
      }
      scope._self.$refs[`popover-${scope.$index}`].doClose()
    },
    // 增加批次
    async addDeviceBatch(isdialog) {
      if (isdialog == 0) {
        this.pcdialogVisible = false;
      } else {
        this.pcdialogVisible = true;
      }

      // var Dict = Parse.Object.extend('Dict')
      // var datas = new Parse.Query(Dict)
      // datas.equalTo('type', 'batch_number')
      // datas.ascending('-createdAt')
      // datas.find().then(
      //   resultes => {
      //     if (resultes) {
      //       this.pctableData = resultes
      //       pcdata = resultes
      //     }
      //   },
      //   error => {
      //     returnLogin(error)
      //   }
      // )
      const { results } = await this.$getBatchNumer();
      this.pctableData = results;
    },
    /* device添加表单提交*/
    async editorDevice(row) {
      // 这里再去查询tag
      // console.log(row)
      this.deviceform = {}
      this.deviceid = row.objectId
      this.devicedialogVisible = true
      this.deviceform = {
        devaddr: row.devaddr,
        name: row.name,
        assetNum: row.detail == undefined ? "" : row.detail.assetNum,
        devModel: row.detail == undefined ? "" : row.detail.devModel,
        desc: row.detail == undefined ? "" : row.detail.desc,
        productid: row.product.objectId,
        brand: row.detail == undefined ? "" : row.detail.brand,
        productName: row.product.objectId,
        status: row.status,
        isEnable: row.isEnable,
        address: row.detail == undefined ? "" : row.detail.address
      }
      this.bmapform = {
        address: row.detail == undefined ? "" : row.detail.address
      }

      this.center = {
        lat: row.latitude,
        lng: row.longitude
      }

      // row.location.latitude +  row.location.longitude
      // this.addresspointer = row.latitude + ',' + row.longitude
      this.addresspointer = row.detail == undefined ? "" : row.location == undefined ? "" : row.location.latitude + row.detail == undefined ? "" : row.location.longitude
      this.equipmentEditor = '编辑'
      // this.rolesSelect(row.productid)

      // this.deviceform.batchId = row.detail.batchId.batch_name
    },
    getBatch() {
      return new Promise((resolve, reject) => {
        if (pcdata.length > 0) {
          resolve(pcdata)
        } else {
          reject(false)
        }
      })
    },
    initQuery(msg, type) {
      this.$message({
        type: type || "info",
        message: msg
      })
      this.dialogFormVisible = false
      // this.resetProductForm()
      // this.$refs['ruleForm'].resetFields()
      this.getDevices()
    },
    async updateDevice(params) {
      const res = await this.$update_object('Device', this.deviceid, params)
      if (res.updatedAt) {
        this.initQuery('设备更新成功', 'success')
      } else {
        this.$message({
          type: "error",
          message: res.error
        })
      }
    },
    async createDevice(params) {
      const res = await this.$create_object('Device', params)

      if (res.objectId) {
        this.initQuery('设备创建成功', 'success')
      } else {
        this.$message({
          type: "error",
          message: res.error
        })
      }
    },
    async submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          var location = {
            "__type": "GeoPoint",
            "latitude": this.center.lat ? this.center.lat : 0,
            "longitude": this.center.lng ? this.center.lng : 0
          }
          var detail = {
            'assetNum': this.deviceform.assetNum,
            'devModel': this.deviceform.devModel,
            'brand': this.deviceform.brand,
            'address': this.bmapform.address,
            'desc': this.deviceform.desc
          }
          getProduct(this.deviceform.productName).then(response => {
            if (response) {
              if (this.deviceid != '') {
                // 编辑
                var devicesParmas = {
                  'status': 'OFFLINE',
                  'isEnable': false,
                  "ACL": response.ACL,
                  'name': this.deviceform.name,
                  'devaddr': this.deviceform.devaddr,
                  "objectId": this.deviceform.devaddr,
                  "lastOnlineTime": 0,
                  'product': {
                    '__type': 'Pointer',
                    'className': 'Product',
                    'objectId': response.objectId
                  },
                  'detail': detail,
                  'location': location
                }
                this.updateDevice(devicesParmas)
                this.handleClose()
                this.getDevices()
              } else {
                var params = {
                  keys: 'count(*)',
                  where: {
                    "name": { "$in": [this.deviceform.name] },
                    "devaddr": { "$in": [this.deviceform.devaddr] }
                  }
                }
                this.$query_object('Device', params).then(result => {
                  if (result.count > 0) {
                    this.$message('此设备已被创建')
                    return
                  } else {
                    var devicesParmas = {
                      'product': {
                        '__type': 'Pointer',
                        'className': 'Product',
                        'objectId': this.deviceform.productName
                      },
                      'status': 'OFFLINE',
                      'isEnable': false,
                      "ACL": response.ACL,
                      'name': this.deviceform.name,
                      'devaddr': this.deviceform.devaddr,
                      "objectId": this.deviceform.devaddr,
                      "lastOnlineTime": 0,
                      'detail': detail,
                      'location': location
                    }
                    // console.log(devicesParmas)
                    this.createDevice(devicesParmas)
                    this.deviceform = {}
                    this.handleClose()
                    this.getDevices()
                  }
                })
              }
            }
          })
        } else {
          this.$message({
            type: 'error',
            message: '请按照要求填写参数'
          })
          return false
        }
      })
    },
    /* @pamars addbatch添加批次名称 */
    addbatch(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // if (this.batchid == '') {
          //   var Dict = Parse.Object.extend('Dict')
          //   var datas = new Dict()
          //   var acl = new Parse.ACL()
          //   datas.set('data', {
          //     batch_name: this.pcformInline.pcname,
          //     createdtime: Math.ceil(this.pcformInline.createdtime / 1000)
          //   })
          //   datas.set('type', 'batch_number')
          //   acl.setReadAccess(this.userId, true)
          //   acl.setWriteAccess(this.userId, true)
          //   datas.set('ACL', acl)
          //   datas.save().then(
          //     resultes => {
          //       this.$message({
          //         message: '新增成功',
          //         type: 'success'
          //       })
          //       this.$refs[formName].resetFields()
          //       this.addDeviceBatch()
          //     },
          //     error => {
          //       returnLogin(error)
          //     }
          //   )
          // } else {
          //   var Dict = Parse.Object.extend('Dict')
          //   var datas = new Dict()
          //   datas.id = this.batchid

          //   datas.set('data', {
          //     batch_name: this.pcformInline.pcname,
          //     createdtime: Math.ceil(this.pcformInline.createdtime / 1000)
          //   })
          //   datas.save().then(
          //     resultes => {
          //       if (resultes) {
          //         this.$message({
          //           message: '修改成功',
          //           type: 'success'
          //         })
          //         this.batchid = ''
          //         this.pcformInline = {
          //           pcname: '',
          //           createdtime: ''
          //         }
          //         this.$refs[formName].resetFields()
          //         this.addDeviceBatch()
          //       }
          //     },
          //     error => {
          //       returnLogin(error)
          //     }
          //   )
          // }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 编辑批次
    updatebatch(row, id) {
      // this.pcdialogVisible=true
      this.pcformInline.pcname = row.attributes.data.batch_name
      this.pcformInline.createdtime = row.attributes.data.createdtime * 1000
      this.batchid = id
    },
    // 删除批次
    deletebatch(id) {
      // var Dict = Parse.Object.extend('Dict')
      // var datas = new Parse.Query(Dict)
      // datas.get(id).then(resultes => {
      //   resultes.destroy().then(
      //     res => {
      //       if (res) {
      //         this.$message({
      //           type: 'success',
      //           message: '删除成功'
      //         })
      //         this.addDeviceBatch()
      //       }
      //     },
      //     error => {
      //       returnLogin(error)
      //     }
      //   )
      // })
    },
    // 选择批次
    selectbatch(row, id) {
      this.batchid = id
      this.deviceform.pc = row.attributes.data.batch_name
      this.deviceform.batchId = row.attributes.data.batch_name
      this.pcdialogVisible = false
    },
    // 设备详情
    deviceToDetail(row) {
      console.log('设备数据', row)
      this.$router.push({
        path: '/roles/editdevices',
        query: {
          deviceid: row.objectId,
          nodeType: row.nodeType,
          ischildren: 'false'
        }
      })
    },
    handleClick(tab, event) {
      if (tab.name == 'second') {
        this.queryDict();
      }
    },
    async queryDict() {
      const { results } = await this.$getBatchNumer();
      this.pctableData = results;
    },
    // 前往子设备
    deviceToChildren(row) {
      console.log('设备数据', row)
      this.$router.push({
        path: '/roles/editdevices',
        query: {
          deviceid: row.objectId,
          nodeType: row.nodeType,
          ischildren: 'true'
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.equipment {
  height: 100%;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  .equ_header {
    height: 60px;
    width: 100%;
    padding-left: 40px;
    box-sizing: border-box;
    ul {
      padding-left: 20px;
      box-sizing: border-box;
      display: flex;
      li {
        width: 200px;
        list-style: none;
        height: 60px;
        text-align: center;
        border-right: 1px solid #cccccc;
        // &:first-child {
        //   width: 15%;
        //   text-align: left;
        //   line-height: 60px;
        // }
        &:last-child {
          border: 0;
          flex-grow: 2;
          text-align: right;
        }
        &:nth-child(4) {
          border: 0;
        }
        p {
          line-height: 0;
          font-size: 14px;
          color: #666666;
        }
      }
    }
  }
}
</style>
<style>
.equipment .el-tabs__item {
  font-size: 16px;
  margin-top: 20px;
  margin: 0;
  height: 50px;
  line-height: 50px;
  font-family: auto;
}
.equipment .el-tabs__header {
  margin: 0;
}
.equipment .el-tabs__content {
  background: #f4f4f4;
  padding: 20px;
  box-sizing: border-box;
}
.equipment #pane-first {
  background: #ffffff;
  padding: 10px;
  box-sizing: border-box;
}
.equipment #pane-second {
  background: #ffffff;
  padding: 10px;
  box-sizing: border-box;
}
.equipment #pane-first .equdevices .el-input {
  width: 200px;
}

.equipment .el-dialog__footer {
  border-top: 1px solid #cccccc;
}
.equipment .devicecontent .el-form {
  display: flex;
  flex-wrap: wrap;
}
.equipment .devicecontent .el-form .el-input--suffix .el-input__inner {
  padding: 0 15px;
}
.equipment .devicecontent .el-form .el-icon-plus {
  width: 40px;
  height: 40px;
  background: cornflowerblue;
  line-height: inherit;
  margin-right: -4px;
  color: white;
  cursor: pointer;
}
.equipment .devicecontent .el-form .el-form-item {
  width: 50%;
}
.equipment .devicecontent .el-form .el-form-item:last-child {
  width: 100%;
}
.equipment .devicecontent .el-form .el-select {
  width: 100%;
}
.equipment .ACTIVE,
.equipment .ONLINE {
  color: green;
}
.equipment .OFFLINE,
.equipment .UNACTIVE {
  color: red;
}
.equipment .selectdetail {
  max-width: 200px;
  margin: 10px 0;
}
/* .equipment .devicecontent .el-form .el-form-item .is-required:not(.is-no-asterisk):after{
    content: '*';
    color: #F56C6C;
    margin-right: 4px;
} */
/* .equipment .devicecontent .el-form .el-form-item__label:before{
    content:''
}
.equipment .devicecontent .el-form .el-form-item__label:after{
    content: '*';
    color: #F56C6C;
    margin-right: 4px;
} */
</style>

