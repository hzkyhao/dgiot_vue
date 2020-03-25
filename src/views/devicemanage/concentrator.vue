<template>
  <div class="concentrator">
    <div class="top">
      <label for>{{ $t('concentrator.concentrator') }}:</label>
      <el-input v-model="vcaddr" placeholder="请输入集中器地址" style="width:200px;"></el-input>
      <el-button
        type="primary"
        style="margin-left:20px;"
        @click="getAllConcentrator"
      >{{ $t('concentrator.search') }}</el-button>
    </div>
    <div class="section">
      <el-button type="primary" icon="el-icon-plus" @click="uploadadd">{{ $t('concentrator.add') }}</el-button>
      <el-button plain @click="startdev">{{ $t('concentrator.start') }}</el-button>
      <el-button plain @click="stop">{{ $t('concentrator.end') }}</el-button>
      <el-button plain @click="checktime">{{ $t('concentrator.checktime') }}</el-button>
    </div>
    <template>
      <el-table
        ref="multipleTable"
        :data="tableData3"
        tooltip-effect="dark"
        style="width:100%;text-align:center;"
        @selection-change="handleSelectionChange"
        v-loading="loading"
      >
        <el-table-column type="selection" align="center" width="50"></el-table-column>
        <el-table-column prop :label="$t('concentrator.status')" align="center" width="100">
          <template slot-scope="scope">
            <div v-if="scope.row.attributes.jsondata.isonline">
              <p
                style="width:10px;height:10px;border-radius:50%;display:inline-block;background:#00cc33;margin-right:10px;vertical-align:middle;"
              ></p>
              <span style="color:#00cc33">{{$t('concentrator.isonline')}}</span>
            </div>
            <div v-else>
              <p
                style="width:10px;height:10px;border-radius:50%;display:inline-block;background:#f00;margin-right:10px;vertical-align:middle;"
              ></p>
              <span style="color:#f00">{{$t('concentrator.notonline')}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('concentrator.concentrator')" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.attributes.vcaddr}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('concentrator.courts')" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.attributes.jsondata.address}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('concentrator.onlinemeter')" sortable align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.attributes.others.online&&scope.row.attributes.others.total">{{scope.row.attributes.others.online+"/"+scope.row.attributes.others.total}}</span>
            <span v-else>{{"0/0"}}</span>
          </template>
        </el-table-column>
        <el-table-column prop :label="$t('concentrator.connection')" align="center" width="100">
          <template slot-scope="scope">
            <el-switch
              v-model="value6"
              active-color="#13ce66"
              v-if="scope.row.attributes.jsondata.iscon==true"
              disabled
            ></el-switch>
            <el-switch
              v-if="scope.row.attributes.jsondata.iscon!=true"
              v-model="value7"
              active-color="#cccccc"
              disabled
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column :label="$t('concentrator.time')" align="center">
          <template slot-scope="scope">
            <span>{{timestampToTime(scope.row.attributes.vctime)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop :label="$t('concentrator.operation')" align="center" width="300">
          <template slot-scope="scope">
            <el-button
              plain
              size="mini"
              @click="connect(scope.row.attributes.vcaddr)"
            >{{$t('concentrator.connect')}}</el-button>
            <el-button
              size="mini"
              @click="handleEdit(scope.$index,scope.row.attributes,scope.row.id)"
            >{{$t('concentrator.edit')}}</el-button>
            <el-button
              size="mini"
              type="primary"
              @click="handledetail(scope.$index, scope.row.attributes)"
            >{{$t('concentrator.detail')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <div class="block">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 25, 50, 100]"
        :page-size="length"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <!--弹出编辑对话框-->
    <el-dialog :title="$t('concentrator.concentratordetail')" :visible.sync="dialogVisible" width="35%" top="1vh" center>
      <el-form ref="form" :model="sizeForm">
        <el-divider content-position="left">{{$t('concentrator.basicinformation')}}</el-divider>
         <div style="display:flex">
           <!--集中器地址-->
          <el-form-item :label="$t('concentrator.concentrator')">
            <el-input v-model="sizeForm.vcaddr" readonly></el-input>
          </el-form-item>
          <!--供电单位-->
           <el-form-item :label="$t('concentrator.powersupply')" style="margin-left:30px;">
             <el-cascader
              placeholder="选择供电单位"
              v-model="sizeForm.gddw"
              :props="treeprops"
              :options="treeData"
              auto-complete="off"
              :show-all-levels="false"
              :change-on-select="false"
            ></el-cascader>
          </el-form-item>
        </div>
        <!--规约类型-->
         <div style="display:flex">
          <el-form-item label="规约类型">
            <el-select v-model="sizeForm.protocol_type" >
             <el-option label="南网计量上行通信规约" :value="1"></el-option>
              <el-option label=" 广东电网集中器上行规约" :value="2"></el-option>
              <el-option label="国网用采主站与采集终端通信协议" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="投运时间" style="margin-left:30px;">
            <el-input v-model="sizeForm.vctime" readonly></el-input>
          </el-form-item>
        </div>
        <el-divider content-position="left">通信信息</el-divider>
        <div style="display:flex">
          <!--通道工作模式-->
          <el-form-item label="通信工作模式">
            <el-select v-model="sizeForm.region">
              <el-option label="客户机模式" value="1"></el-option>
              <el-option label="混合模式" value="0"></el-option>
              <el-option label="服务器模式" value="3"></el-option>
            </el-select>
          </el-form-item>
          <!--通道类型-->
          <el-form-item label="通道类型" style="margin-left:30px;">
            <el-select v-model="sizeForm.type">
              <el-option label="GPRS/CDMA" :value="2"></el-option>
              <el-option label="PSTN" :value="3"></el-option>
              <el-option label="Ethernet" :value="4"></el-option>
              <el-option label="RS232/RS485" :value="6"></el-option>
              <el-option label="CSD" :value="7"></el-option>
              <el-option label="Radio" :value="8"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <!--终端IP地址-->
        <div style="display:flex">
          <el-form-item label="终端IP地址">
            <el-input v-model="sizeForm.ipaddress"></el-input>
          </el-form-item>
          <el-form-item label="心跳间隔" style="margin-left:30px;">
            <el-input v-model="sizeForm.hbinterval" style="padding-right:0;"></el-input>
          </el-form-item>
          <span style="line-height:45px;">秒</span>
        </div>
        <!--TCP监听端口-->
        <div style="display:flex">
          <el-form-item label="TCP监听端口">
            <el-input v-model="sizeForm.port"></el-input>
          </el-form-item>
          <el-form-item label="掉线重播间隔" style="margin-left:30px;">
            <el-input v-model="sizeForm.notonline" style="padding-right:0;"></el-input>
          </el-form-item>
          <span style="line-height:45px;">秒</span>
        </div>
        <!--终端子网掩码-->
        <div style="display:flex">
          <el-form-item label="终端子网掩码">
            <el-input v-model="sizeForm.localmask"></el-input>
          </el-form-item>
          <el-form-item label="掉线重播次数" style="margin-left:30px;">
            <el-input v-model="sizeForm.recalltimes" style="padding-right:0;"></el-input>
          </el-form-item>
        </div>
        <!--终端网关地址-->
        <div style="display:flex">
          <el-form-item label="终端网关地址">
            <el-input v-model="sizeForm.localgateway"></el-input>
          </el-form-item>
          <!--主站通达信地址-->
          <el-form-item label="主站通信地址" style="margin-left:30px;">
            <el-input v-model="sizeForm.localip" style="padding-right:0;"></el-input>
          </el-form-item>
        </div>
        <!--IP地址获取方式-->
        <div style="display:flex">
          <el-form-item label="IP地址获取方式">
            <el-select v-model="sizeForm.ipgetway">
              <el-option label="自动设置" value="1"></el-option>
              <el-option label="手动设置" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="主站端口号" style="margin-left:30px;">
            <el-input v-model="sizeForm.remoteport" style="padding-right:0;"></el-input>
          </el-form-item>
        </div>
        <!--TCP/UDP标识-->
        <div style="display:flex">
          <el-form-item label="TCP/UDP标识">
            <el-select v-model="sizeForm.tcporudp">
              <el-option label="TCP" value="0"></el-option>
              <el-option label="UDP" value="1"></el-option>
            </el-select>
          </el-form-item>
          <!--主通道类型-->
          <el-form-item label="主通道类型" style="margin-left:30px;">
            <el-select v-model="sizeForm.mainchannel">
              <el-option label="虚拟集中器通道" :value="1"></el-option>
              <el-option label="物理集中器通道" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" style="float:left">关闭</el-button>
        <el-button type="primary" @click="Makesureedit" style="float:right">确 定</el-button>
      </span>
    </el-dialog>
    <!--新建弹框-->
    <el-dialog title="新增集中器" :visible.sync="addconcentrator" width="35%" top="1vh" center>
      <el-form ref="form" :model="vcConfig">
        <el-divider content-position="left">基本信息</el-divider>
         <div style="display:flex">
          <el-form-item label="集中器地址">
            <el-input v-model="vcConfig.vcaddr"></el-input>
          </el-form-item>
            <el-form-item label="供电单位" style="margin-left:30px;">
                <el-cascader
              placeholder="选择供电单位"
              v-model="vcConfig.gddw"
              :props="treeprops"
              :options="treeData"
              :show-all-levels="false"
              :change-on-select="false"
            ></el-cascader>
          </el-form-item>
        </div>
        <!---->
         <div style="display:flex">
          <el-form-item label="投运时间">
            <el-date-picker
            v-model="vcConfig.vctime"
            type="datetime"
            placeholder="集中器时间"
            value-format="timestamp"
            :picker-options="pickerOptionsStart"
          ></el-date-picker>
          </el-form-item>
           <el-form-item label="规约类型"  style="margin-left:30px;">
            <el-select v-model="vcConfig.protocol_type" >
              <el-option label="南网计量上行通信规约" :value="1"></el-option>
              <el-option label=" 广东电网集中器上行规约" :value="2"></el-option>
              <el-option label="国网用采主站与采集终端通信协议" :value="3"></el-option>
            </el-select>
          </el-form-item>
          
        </div>
        <el-divider content-position="left">通信信息</el-divider>
        <div style="display:flex">
          <el-form-item label="通信工作模式">
            <el-select v-model="vcConfig.region">
              <el-option label="客户机模式" value="1"></el-option>
              <el-option label="混合模式" value="0"></el-option>
              <el-option label="服务器模式" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="通道类型" style="margin-left:30px;">
            <el-select v-model="vcConfig.type">
              <el-option label="GPRS/CDMA" :value="2"></el-option>
              <el-option label="PSTN" :value="3"></el-option>
              <el-option label="Ethernet" :value="4"></el-option>
              <el-option label="RS232/RS485" :value="6"></el-option>
              <el-option label="CSD" :value="7"></el-option>
              <el-option label="Radio" :value="8"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <!---->
        <div style="display:flex">
          <el-form-item label="终端IP地址">
            <el-input v-model="vcConfig.ipaddress"></el-input>
          </el-form-item>
          <el-form-item label="心跳间隔" style="margin-left:30px;">
            <el-input v-model="vcConfig.hbinterval" style="padding-right:0;"></el-input>
          </el-form-item>
          <span style="line-height:45px;">秒</span>
        </div>
        <!---->
        <div style="display:flex">
          <el-form-item label="TCP监听端口">
            <el-input v-model="vcConfig.port"></el-input>
          </el-form-item>
          <el-form-item label="掉线重播间隔" style="margin-left:30px;">
            <el-input v-model="vcConfig.notonline" style="padding-right:0;">
              
            </el-input>
          </el-form-item>
          <span style="line-height:45px;">秒</span>
        </div>
        <!---->
        <div style="display:flex">
          <el-form-item label="终端子网掩码">
            <el-input v-model="vcConfig.localmask"></el-input>
          </el-form-item>
          <el-form-item label="掉线重播次数" style="margin-left:30px;">
            <el-input v-model="vcConfig.recalltimes" style="padding-right:0;"></el-input>
          </el-form-item>
        </div>
        <!---->
        <div style="display:flex">
          <el-form-item label="终端网关地址">
            <el-input v-model="vcConfig.localgateway"></el-input>
          </el-form-item>
          <el-form-item label="主站通信地址" style="margin-left:30px;">
            <el-input v-model="vcConfig.localip" style="padding-right:0;"></el-input>
          </el-form-item>
        </div>
        <!---->
        <div style="display:flex">
          <el-form-item label="IP地址获取方式">
            <el-select v-model="vcConfig.ipgetway">
              <el-option label="自动设置" value="1"></el-option>
              <el-option label="手动设置" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="主站端口号" style="margin-left:30px;">
            <el-input v-model="vcConfig.remoteport" style="padding-right:0;"></el-input>
          </el-form-item>
        </div>
        <!---->
        <div style="display:flex">
          <el-form-item label="TCP/UDP标识">
            <el-select v-model="vcConfig.tcporudp">
              <el-option label="TCP" value="0"></el-option>
              <el-option label="UDP" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="主通道类型" style="margin-left:30px;">
            <el-select v-model="vcConfig.mainchannel">
              <el-option label="虚拟集中器通道" :value="1"></el-option>
              <el-option label="物理集中器通道" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addconcentrator= false" style="float:left">关闭</el-button>
        <el-button type="primary" @click="addconcen" style="float:right">新增</el-button>
      </span>
    </el-dialog>
    <!--校时弹框-->
    <el-dialog
      title="校时"
      :visible.sync="checktimedialog"
      width="30%"
      :before-close="Closechecktime"
    >
      <div>
        <h3>集中器地址</h3>
        <el-input disabled v-model="str"></el-input>
      </div>
      <div>
        <h3>Unix时间戳</h3>
        <el-input v-model="unixtime"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="checktimedialog = false" style="float:left">关 闭</el-button>
        <el-button type="primary" @click="submitchecktime()" style="float:right">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  timestampToTime,
  gettables,
  makesure,
  startcon,
  stopcon,
  unixtime,
  submittime,
  timetounix,
  startconnect,
  addcon,
  utc2beijing
} from "@/api/login";
import Parse from "parse";
import { prototype } from 'stream';
import {returnLogin} from '@/utils/return'
export default {
  data() {
    return {
      // value2: true,
      //  value1: true,
      pickerOptionsStart: {
        disabledDate: time => {
            return time.getTime() < Date.now() - 8.64e7
        }
        
        
      },
      treeprops: {
        value: "objectId",
        label: "name"
      },
      loading: true,
      value6: true,
      value7: false,
      start: 0,
      length: 10,
      total: 0,
      tableData3: [],
      checktimedialog: false,
      dialogVisible: false,
      multipleSelection: [],
      unixtime: "",
      vcaddrs: [],
      str: "",
      addrs: [],
      vcaddr: "",
      draw: 1,
      sizeForm: {
        vcaddr: "",
        region: "",
        type: "",
        ipaddress: "",
        hbinterval: "",
        port: "",
        notonline: "",
        localmask: "",
        recalltimes: "",
        localgateway: "",
        localip: "",
        ipgetway: "",
        remoteport: "",
        mainchannel: "",
        tcporudp: "",
        vctime:'',
        gddw:'',
        protocol_type:1
      },
      addconcentrator: false,
      vcConfig: {
        vcaddr: "",
        region: "1",
        type: 2,
        ipaddress: "127.0.0.1",
        hbinterval: 90,
        port: 9001,
        notonline: 60,
        localmask: "255.255.000.001",
        recalltimes: 3000,
        localgateway: "172.016.023.255",
        localip: "127.0.0.1",
        ipgetway: "1",
        remoteport: 16110,
        mainchannel: 1,
        tcporudp: "0",
        vctime:'',
        gddw:'',
        gylx:'',
        protocol_type:1
      },
      vcaddrid: "",
      jsondata: {},
      data:[]
    };
  },
   computed: {
    treeData() {
      let cloneData = JSON.parse(JSON.stringify(this.data)); // 对源数据深度克隆
      return cloneData.filter(father => {
        let branchArr = cloneData.filter(
          child => father.objectId == child.ParentId
        ); //返回每一项的子级数组
        branchArr.length > 0 ? (father.children = branchArr) : ""; //如果存在子级，则给父级添加一个children属性，并赋值
        return father.ParentId == 0; //返回第一层
      });
    }
  },
  mounted() {
    // this.getinformation();
    // this.vcConfig = JSON.stringify(this.vcConfig, null, 4);
    this.getAllConcentrator();
    this.getDepartment()
  },
  methods: {
    //得到所有集中器
    getAllConcentrator() {
      var Vcon = Parse.Object.extend("Vcon");
      var vcon = new Parse.Query(Vcon);

      if (this.vcaddr != "") {
        vcon.contains("vcaddr", this.vcaddr);
      }
      vcon.skip(this.start);
      vcon.limit(this.length);
      vcon.count().then(
        count => {
          this.total = count;
          vcon.find().then(resultes => {
            this.tableData3 = resultes;
            this.loading = false;
          });
          
        },
        error => {
         returnLogin(error)
        }
      );
    },
  //关闭校时
    Closechecktime() {
      this.checktimedialog = false;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    timestampToTime(timestamp) {
      var date = new Date(timestamp * 1000);
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
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
      return Y + M + D + h + m + s;
    },
    //编辑
    handleEdit(index, row, id) {
      this.vcaddrid = id;
      this.sizeForm.vcaddr = row.vcaddr;
      this.sizeForm.ipaddress = row.jsondata.local_ip;
      this.sizeForm.type = row.jsondata.remote_param.channel_type;
      this.sizeForm.hbinterval = row.jsondata.hb_interval;
      this.sizeForm.port = row.jsondata.local_port;
      this.sizeForm.notonline = row.jsondata.recall_interval;
      this.sizeForm.localmask = row.jsondata.local_mask;
      this.sizeForm.recalltimes = row.jsondata.recall_times;
      this.sizeForm.localgateway = row.jsondata.local_gateway;
      this.sizeForm.localip = row.jsondata.remote_param.remote_ip;
      this.sizeForm.ipgetway = String(row.jsondata.get_ip_mod);
      this.sizeForm.remoteport = row.jsondata.remote_param.remote_port;
      this.sizeForm.tcporudp = String(row.jsondata.tcp_or_udp);
      this.sizeForm.region = String(row.jsondata.channel_mod);
      this.sizeForm.mainchannel = Number(row.jsondata.master_channel);
      this.sizeForm.vctime = utc2beijing(row.createdAt)
      this.sizeForm.gddw = this.getParent(this.data,row.organization.id,[])
      if(row.jsondata.protocol_type){
         this.sizeForm.protocol_type = Number(row.jsondata.protocol_type)
      }else{
        this.sizeForm.protocol_type = ''
      }
      this.dialogVisible = true;
      for (var key in row.jsondata) {
        this.jsondata[key] = row.jsondata[key];
      }
    },
    handledetail(index, row) {
      this.$router.push({
        path: "/devicemanage/condetail",
        query: { vcaddr: row.vcaddr }
      });
    },
    handleSizeChange(val) {
      this.length = val;
      this.getAllConcentrator();
    },
    handleCurrentChange(val) {
      this.start = (val - 1) * this.length;
      this.getAllConcentrator();
    },
    //编辑
    Makesureedit() {
      (this.jsondata.vcaddr = this.sizeForm.vcaddr),
        (this.jsondata.local_ip = this.sizeForm.ipaddress),
        (this.jsondata.remote_param.channel_type = this.sizeForm.type),
        (this.jsondata.hb_interval = this.sizeForm.hbinterval),
        (this.jsondata.local_port = this.sizeForm.port),
        (this.jsondata.recall_interval = this.sizeForm.notonline),
        (this.jsondata.local_mask = this.sizeForm.localmask),
        (this.jsondata.recall_times = this.sizeForm.recalltimes),
        (this.jsondata.local_gateway = this.sizeForm.localgateway),
        (this.jsondata.remote_param.remote_ip = this.sizeForm.localip),
        (this.jsondata.get_ip_mod = this.sizeForm.ipgetway),
        (this.jsondata.remote_param.remote_port = this.sizeForm.remoteport),
        (this.jsondata.tcp_or_udp = this.sizeForm.tcporudp),
        (this.jsondata.channel_mod = this.sizeForm.region),
        (this.jsondata.master_channel = this.sizeForm.mainchannel);
        this.jsondata.protocol_type = this.sizeForm.protocol_type
      var Vcon = Parse.Object.extend("Vcon");
      var vcon = new Vcon();
      vcon.id = this.vcaddrid;
      vcon.set("jsondata", this.jsondata);
      vcon.save().then(
        resultes => {
          if (resultes) {
            this.$message({
              type: "success",
              message: "编辑成功"
            });
            this.dialogVisible = false;
            this.getAllConcentrator();
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
    },
    //搜索
    search() {
      this.start = 0;
      this.length = 10;
      this.draw++;
      this.getAllConcentrator();
    },
    //启动
    startdev() {
      this.addrs = [];
      this.multipleSelection.map(item => {
        this.addrs.push(item.attributes.vcaddr);
      });
      if (this.addrs.length == 0) {
        this.$message({
          message: "请勾选您要启动的集中器",
          type: "warning"
        });
      } else {
        startcon(this.addrs)
          .then(res => {
            if (res) {
              this.$message({
                message: "成功启动",
                type: "success"
              });
              this.getAllConcentrator();
            }
          })
          .catch(error => {
            this.$message({
              message: error.error,
              type: "error"
            });
          });
      }
    },
    //停止
    stop() {
      this.addrs = [];
      this.multipleSelection.map(item => {
        this.addrs.push(item.attributes.vcaddr);
      });
      if (this.addrs.length == 0) {
        this.$message({
          message: "请勾选您要启动的集中器",
          type: "warning"
        });
      } else {
        stopcon(this.addrs)
          .then(res => {
            if (res) {
              this.$message({
                message: "成功关闭",
                type: "success"
              });
              this.getAllConcentrator();
            }
          })
          .catch(error => {
            this.$message({
              message: error.error,
              type: "error"
            });
          });
      }
    },
    //校时
    checktime() {
      this.vcaddrs = [];
      this.unixtime = unixtime();
      if (this.multipleSelection.length == 0) {
        this.str = "当前节点所有的集中器";
      } else {
        this.str = "";
        this.multipleSelection.map(item => {
          this.str += item.attributes.vcaddr + ",";
          this.vcaddrs.push(item.attributes.vcaddr);
        });
        this.str = String(this.str).substring(0, this.str.length - 1);
      }
      this.checktimedialog = true;
    },
    //连主站
    connect(val) {
      // this.vcaddr = val;
      startconnect(val)
        .then(res => {
          if (res) {
            this.$message({
              message: "主站连接成功",
              type: "success"
            });
           
            this.getAllConcentrator();
          }
        })
        .catch(error => {
          this.$message({
            message: error.error,
            type: "error"
          });
        });
    },
    //提交
    submitchecktime() {
      if (this.vcaddrs.length > 0) {
        submittime(timetounix(this.unixtime), this.vcaddrs)
          .then(res => {
            if (res) {
              this.$message({
                message: "校时成功",
                type: "success"
              });
              this.getAllConcentrator();
            }
          })
          .catch(error => {
            this.$message({
              message: error.error,
              type: "error"
            });
          });
      } else {
        submittime(timetounix(this.unixtime))
          .then(res => {
            if (res) {
              this.$message({
                message: "校时成功",
                type: "success"
              });
              this.getAllConcentrator();
            }
          })
          .catch(error => {
            this.$message({
              message: error.error,
              type: "error"
            });
          });
      }
      this.checktimedialog = false;
    },
    uploadadd() {
      this.addconcentrator = true;
    },
    addconcen() {
      var departmentalias=''
      var departmentId = this.vcConfig.gddw[this.vcConfig.gddw.length-1]
      var Department = Parse.Object.extend("Department");
      var department = new Parse.Query(Department);
      var department1 = new Department()
      department1.id = departmentId
       department1.set('leafnode',true)
        department1.save().then(response=>{
          
        })
      department.get(departmentId).then(resultes=>{
       
        departmentalias= resultes.attributes.alias
        var Vcon = Parse.Object.extend('Vcon')
        var vcon = new Vcon()
        vcon.set('department',departmentalias)
        vcon.set('organization',department1)
        vcon.set('vctime',Math.floor(this.vcConfig.vctime/1000))
        vcon.set('others',{})
        vcon.set('jsondata',{
              address: "for_test",
              cbxx: {pns: "", msdiff: 0, vcaddr: "", channel: ""},
              channel_mod: Number(this.vcConfig.region),
              get_ip_mod: Number(this.vcConfig.ipgetway),
              hb_interval:this.vcConfig.hbinterval,
              local_gateway: this.vcConfig.localgateway,
              local_ip: this.vcConfig.localip,
              local_mask: this.vcConfig.localmask,
              local_port: Number(this.vcConfig.port),
              master_channel: Number(this.vcConfig.mainchannel),
              nodename: "shuwa_dba@172.27.0.8",
              recall_interval: Number(this.vcConfig.notonline),
              recall_times: Number(this.vcConfig.recalltimes),
              register: false,
              remote_param: {remote_ip: this.vcConfig.ipaddress, remote_port: Number(this.vcConfig.remoteport), channel_type: this.vcConfig.type},
              tcp_or_udp: Number(this.vcConfig.tcporudp),
              protocol_type:this.vcConfig.protocol_type
        })
        vcon.set('vcaddr',this.vcConfig.vcaddr)
        vcon.save().then(resultes=>{
          if(resultes){
            this.$message.success('创建成功')
           this.addconcentrator=false
            this.getAllConcentrator()
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
              } else {
                this.$message.error(error.error);
              }
            })
      })
    },
    //原数组data2 nodeId2点击树元素的parentId，arrRes新的数组
     getParent(data2, nodeId2, arrRes) {
      data2.map(items => {
        if (items.objectId == nodeId2) {
          arrRes.push(items.objectId);
          this.getParent(data2, items.ParentId, arrRes);
        } else if (items.ParentId == 0 && items.objectId == nodeId2) {
          arrRes.push(items.objectId);
        }
      });
      return arrRes.reverse();
    },
    //初始化供电单位
    getDepartment() {
      var Department = Parse.Object.extend("Department");
      var department = new Parse.Query(Department);
      department.limit(10000)
      department.find().then(
        resultes => {
          // console.log(resultes)
          resultes.map(items => {
            var obj = {};
            items.createtime = new Date(
              items.attributes.createdAt
            ).toLocaleDateString();
            (obj.name = items.attributes.name),
              (obj.ParentId = items.attributes.ParentId);
            obj.objectId = items.id;
            obj.level = items.attributes.level;
            obj.createtime = items.createtime;
            this.data.push(obj);
          });
        },
        error => {
          this.$message({
            type: "error",
            message: error.error
          });
        }
      );
    }
  }
};
</script>
<style scoped>
.concentrator {
  background: #ffffff;
  padding-left: 20px;
  padding-top: 20px;
  box-sizing: border-box;
  min-height: 100%;
}
.top {
  margin-top: 10px;
}
.section {
  margin-top: 20px;
}
</style>
<style>
.concentrator .el-pagination {
  margin-top: 20px;
}
.concentrator .el-date-editor.el-input, .concentrator .el-date-editor.el-input__inner{
  width:100%;
}
.concentrator .el-table {
  margin-top: 20px;
}
.concentrator .el-form-item__label {
  text-align: left;
  float: none;
  display: inline-block;
  width: 120px;
}
.concentrator .el-form-item__content {
  margin-left: 0 !important;
  display: inline-block;
}
.concentrator .el-form-item {
  margin-bottom: 5px;
  display: flex;
}
.concentrator .el-input--suffix,
.el-input__inner {
  padding-right: 0 !important;
}
.concentrator .el-select {
  padding-right: 0 !important;
  box-sizing: border-box;
  text-align: center;
}
.concentrator .el-dialog__footer {
  padding-bottom: 50px;
}
.concentrator .el-dialog__body {
  border-bottom: 1px solid #dddddd;
}
.concentrator .el-table th {
  background: #fafafa;
  color: #666666;
  font-weight: 600;
}
.concentrator .el-input--prefix .el-input__inner{
  padding-left:20px;
}
</style>
