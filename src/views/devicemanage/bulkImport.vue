<template>
  <div id="bulkImport">
    <div class="content">
      <!-- 顶部表单 -->
      <div>
        <el-form
          :inline="true"
          size="small "
          :model="form"
          class="demo-form-inline"
          @submit.native.prevent
        >
          <div>
            <el-form-item>
              <el-button type="primary" @click="derive_tmp">模板下载</el-button>
            </el-form-item>
            <el-form-item label="供电单位">
              <el-select v-model="form.gddw" placeholder="请选择供电单位">
                <el-option
                  v-for="item in form.gddws"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <input type="file" ref="file" v-show="false" @change="handleFileChange($event)" />
            <el-form-item label="上传表格">
              <el-input
                placeholder="请选择需要上传的表格"
                v-model="form.upload"
                prefix-icon="el-icon-upload"
                clearable
                readonly
              >
                <el-button slot="append" @click="getFile">选择文件</el-button>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="upload(file)">本地上传</el-button>
            </el-form-item>
            <el-form-item>
              <el-button :disabled="isGetInfo" type="success" @click="handleClickVerify">数据校验</el-button>
            </el-form-item>
            <el-form-item>
              <el-button :disabled="isVerify" type="primary" @click="handleClickImport">确认导入</el-button>
            </el-form-item>
          </div>
          <div class="operation">
            <el-form-item label="当前状态">
              <el-input v-model="state" readonly></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="warning" @click="handleClickRoll">数据回滚</el-button>
            </el-form-item>
            <el-form-item>
              <el-button :disabled="isGetInfo" type="danger" @click="handleClickDel">批量删除</el-button>
            </el-form-item>
            <el-form-item>
              <el-button :disabled="isGetInfo" type="primary" @click="handleClickBackups">数据备份</el-button>
            </el-form-item>
            <el-form-item>
              <el-checkbox
                :disabled="isGetInfo"
                v-model="form.iserr"
                @change="handleChangeUnusual"
              >仅显示异常</el-checkbox>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <!-- 表格 -->
      <div class="table">
        <el-table
          :data="tableData"
          stripe
          style="width: 100%"
          max-height="450"
          height="450"
          v-loading="tableloading"
          element-loading-text="正在加载...."
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="40"></el-table-column>
          <el-table-column prop="num" label="序号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="gddw" label="供电单位" show-overflow-tooltip></el-table-column>
          <!-- for生成 -->
          <el-table-column
            v-for="item in headArr"
            :key="item.en"
            :prop="item.en"
            :label="item.ch"
            width="200"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column fixed="right" label="操作" width="160">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="setRow(scope.$index,tableData)"
                type="warning"
                size="small"
              >修改</el-button>
              <el-button
                @click.native.prevent="deleteRow(scope.$index,tableData)"
                type="danger"
                size="small"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <p class="result" v-show="isInfo">当前成功导入{{sum}}条，请校验</p>
        <p class="result" v-show="!isInfo">共{{sum}}条，其中{{abnormal}}条存在异常</p>
      </div>
      <!-- 操作说明 -->
      <div class="OI">
        <div class="btns">
          <el-button size="small" type="primary" :disabled="isGetInfo">刷新</el-button>
          <el-button size="small" type="warning" :disabled="isGetInfo" @click="clear">清屏</el-button>
          <el-button
            size="small"
            type="primary"
            :disabled="isGetInfo"
            @click="handleClickRecord"
          >导出操作记录</el-button>
        </div>
        <el-table
          :data="OIData"
          border
          style="width: 100%;margin-top:10px;"
          max-height="150"
          height="150"
          v-loading="OIloading"
          element-loading-text="拼命加载中"
        >
          <el-table-column show-overflow-tooltip prop="num" label="编号"></el-table-column>
          <el-table-column show-overflow-tooltip prop="oper" label="操作"></el-table-column>
          <el-table-column show-overflow-tooltip prop="errRow" label="异常行数"></el-table-column>
          <el-table-column show-overflow-tooltip prop="errCell" label="异常单元格"></el-table-column>
          <el-table-column prop="OI" label="操作说明"></el-table-column>
          <el-table-column show-overflow-tooltip prop="handlers" label="操作者"></el-table-column>
          <el-table-column show-overflow-tooltip prop="time" label="操作时间"></el-table-column>
        </el-table>
      </div>
      <!-- 修改模态框 -->
      <el-dialog title="修改信息" :visible.sync="dialogFormVisible">
        <el-form :model="setForm">
          <el-divider content-position="left">抄表档案</el-divider>
          <el-form-item label="供电单位" :label-width="formLabelWidth">
            <el-input v-model="setForm.gddw" autocomplete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="用户编号" :label-width="formLabelWidth">
            <el-input v-model="setForm.yhabh" autocomplete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="用户名称" :label-width="formLabelWidth">
            <el-input v-model="setForm.yhmc" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="用户类别" :label-width="formLabelWidth">
            <el-select v-model="setForm.yhlb" clearable placeholder="请选择用户类别">
              <el-option
                v-for="item of setForm.yhlb_arr"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="台区名称" :label-width="formLabelWidth">
            <el-input v-model="setForm.tq" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="集中器地址" :label-width="formLabelWidth">
            <el-input v-model="setForm.vcaddr_web" autocomplete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="电能表地址" :label-width="formLabelWidth">
            <el-input v-model="setForm.addr_web" autocomplete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="PN值" :label-width="formLabelWidth">
            <el-input v-model="setForm.pn" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="抄表类型" :label-width="formLabelWidth">
            <el-select v-model="setForm.cblx" disabled clearable placeholder="请选择抄表类型">
              <el-option
                v-for="item of setForm.cblx_arr"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="采集器编号" :label-width="formLabelWidth">
            <el-input v-model="setForm.deveui" autocomplete="off" placeholder="请输入采集器编号"></el-input>
          </el-form-item>
          <el-form-item label="应用编号" :label-width="formLabelWidth">
            <el-input v-model="setForm.appeui" autocomplete="off" placeholder="请输入应用编号"></el-input>
          </el-form-item>
          <el-form-item label="用户地址" :label-width="formLabelWidth">
            <el-cascader
              size="large"
              :options="options"
              v-model="setForm.addr"
              @change="handleModChange"
            ></el-cascader>
            <el-input
              type="textarea"
              :rows="2"
              v-model="setForm.yhdz"
              autocomplete="off"
              placeholder="详细地址"
            ></el-input>
          </el-form-item>

          <!-- 电表信息 -->
          <el-divider></el-divider>
          <div
            style="display:flex;justify-content:space-between;width:100%;padding:0 10%;line-height:0;"
          >
            <p style="font-size:20px;font-weight:500;">电表信息(选填)</p>
            <el-button
              type="info"
              style="padding:10px;"
              @click="handleClickUpdateShow"
            >{{updateShow?'隐藏':'显示'}}</el-button>
          </div>
          <div
            v-show="updateShow"
            style="display:flex;flex-wrap: wrap;justify-content: space-around;"
          >
            <el-form-item label="资产编号" :label-width="formLabelWidth">
              <el-input v-model="setForm.zcbh" autocomplete="off" placeholder="请输入资产标号编号"></el-input>
            </el-form-item>
            <el-form-item label="出厂编号" :label-width="formLabelWidth">
              <el-input v-model="setForm.ccbh" autocomplete="off" placeholder="请输入出厂编号"></el-input>
            </el-form-item>
            <el-form-item label="远程控制密码" :label-width="formLabelWidth">
              <el-input
                show-password
                v-model="setForm.dbmm"
                autocomplete="off"
                placeholder="请输入远程控制密码"
              ></el-input>
            </el-form-item>
            <el-form-item label="采集器编号" :label-width="formLabelWidth">
              <el-input v-model="setForm.deveui" autocomplete="off" placeholder="请输入采集编号"></el-input>
            </el-form-item>
            <el-form-item label="注册应用号" :label-width="formLabelWidth">
              <el-input v-model="setForm.appeui" autocomplete="off" placeholder="请输入注册应用号"></el-input>
            </el-form-item>
            <el-form-item label="计量点编号" :label-width="formLabelWidth">
              <el-input v-model="setForm.jldbh" autocomplete="off" placeholder="请输入计量点编号"></el-input>
            </el-form-item>
            <el-form-item label="投运时间" :label-width="formLabelWidth">
              <el-date-picker v-model="setForm.tysj" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="上次检验日期" :label-width="formLabelWidth">
              <el-date-picker v-model="setForm.scjyrq" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="到货批次号" :label-width="formLabelWidth">
              <el-input v-model="setForm.dhpc" autocomplete="off" placeholder="请输入到货批次号"></el-input>
            </el-form-item>
            <el-form-item label="综合倍率" :label-width="formLabelWidth">
              <el-input v-model="setForm.zhbl" autocomplete="off" placeholder="请输入综合倍率"></el-input>
            </el-form-item>
            <el-form-item label="抄表区段" :label-width="formLabelWidth">
              <el-input v-model="setForm.cbqd" autocomplete="off" placeholder="请输入抄表区段"></el-input>
            </el-form-item>
            <el-form-item label="线路" :label-width="formLabelWidth">
              <el-input v-model="setForm.xl" autocomplete="off" placeholder="请输入线路"></el-input>
            </el-form-item>
            <el-form-item label="厂站" :label-width="formLabelWidth">
              <el-input v-model="setForm.cz" autocomplete="off" placeholder="请输入厂站"></el-input>
            </el-form-item>
            <el-form-item label="额定电压" :label-width="formLabelWidth">
              <el-input v-model="setForm.eddy" autocomplete="off" placeholder="请输入额定电压"></el-input>
            </el-form-item>
            <el-form-item label="标定电流" :label-width="formLabelWidth">
              <el-input v-model="setForm.bddl" autocomplete="off" placeholder="请输入标定电流"></el-input>
            </el-form-item>
            <el-form-item label="准确率" :label-width="formLabelWidth">
              <el-input v-model="setForm.zqd" autocomplete="off" placeholder="请输入准确率"></el-input>
            </el-form-item>
            <el-form-item label="生产厂家" :label-width="formLabelWidth">
              <el-input v-model="setForm.sccj" autocomplete="off" placeholder="请输入生产厂家"></el-input>
            </el-form-item>
            <el-form-item label="主副表标志" :label-width="formLabelWidth">
              <el-input v-model="setForm.zfbbz" autocomplete="off" placeholder="请输入主副表标志"></el-input>
            </el-form-item>
            <el-form-item label="计量点位置" :label-width="formLabelWidth">
              <el-input v-model="setForm.jldwz" autocomplete="off" placeholder="请输入计量点位置"></el-input>
            </el-form-item>
            <el-form-item label="计量点地址" :label-width="formLabelWidth">
              <el-input v-model="setForm.jlddz" autocomplete="off" placeholder="请输入计量点地址"></el-input>
            </el-form-item>
            <el-form-item label="通信规约" :label-width="formLabelWidth">
              <el-input v-model="setForm.txgw" autocomplete="off" placeholder="请输入通信规约"></el-input>
            </el-form-item>
            <el-form-item label="逻辑地址" :label-width="formLabelWidth">
              <el-input v-model="setForm.ljdz" autocomplete="off" placeholder="请输入逻辑地址"></el-input>
            </el-form-item>
            <el-form-item label="波特率" :label-width="formLabelWidth">
              <el-input v-model="setForm.btl" autocomplete="off" placeholder="请输入波特率"></el-input>
            </el-form-item>
            <el-form-item label="计量表箱(柜)" :label-width="formLabelWidth">
              <el-input v-model="setForm.jlbx" autocomplete="off" placeholder="请输入计量表箱(柜)"></el-input>
            </el-form-item>
            <el-form-item label="箱(柜)位置号" :label-width="formLabelWidth">
              <el-input v-model="setForm.xgwzh" autocomplete="off" placeholder="请输入箱(柜)位置号"></el-input>
            </el-form-item>
            <el-form-item label="计量装置分类" :label-width="formLabelWidth">
              <el-select v-model="setForm.jlzzfl" clearable placeholder="请选择计量装置分类">
                <el-option
                  v-for="item of setForm.jlzzfl_arr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="通信方式" :label-width="formLabelWidth">
              <el-select v-model="setForm.txfs" clearable placeholder="请选择通信方式">
                <el-option
                  v-for="item of setForm.txfs_arr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="计量方式" :label-width="formLabelWidth">
              <el-select v-model="setForm.jlfs" clearable placeholder="请选择计量方式">
                <el-option
                  v-for="item of setForm.jlfs_arr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="设备类别" :label-width="formLabelWidth">
              <el-select v-model="setForm.sblx" clearable placeholder="请选择设备类别">
                <el-option
                  v-for="item of setForm.sblx_arr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="设备类型" :label-width="formLabelWidth">
              <el-select v-model="setForm.sblx" clearable placeholder="请选择设备类型">
                <el-option
                  v-for="item of setForm.sblx_arr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleClickSet">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
// 引入element-china-area-data地址三级联动
import { regionData, CodeToText } from "element-china-area-data";
import Parse from "parse";
import XLSX from "xlsx";
import { Upload, RollBack, Verify, State, Import } from "@/api/bulkImport";
export default {
  // 批量导入
  name: "bulkImport",
  data() {
    return {
      isGetInfo: true, // 获取信息状态
      isVerify: true, // 验证完毕状态
      isInfo: true, // 信息显示
      user: "", //操作用户
      // 当前状态
      state: "无状态",
      // 编号
      num: 1,
      // 上传文件信息
      file: [],
      headArr: [
        { en: "tq", ch: "台区名称", ex: "广东南利嘉投资有限公司（小区1）" },
        {
          en: "yhabh",
          ch: "用户编号",
          ex: "0305420166778469,用户编号不能相同"
        },
        { en: "yhmc", ch: "用户名称", ex: "南澳县南利嘉物业管理有限公司" },
        {
          en: "vcaddr_web",
          ch: "集中器地址",
          ex: "集中器地址为12位,集中器地址不能相同"
        },
        {
          en: "addr_web",
          ch: "电能表地址",
          ex: "电表地址为12位,电表地址不能相同"
        },
        { en: "pn", ch: "PN值", ex: "0-2000,同一个集中器pn不能相同" },
        {
          en: "yhlb",
          ch: "用户类别",
          ex: "[公变普通用户][公变大客户][专变用户]"
        },
        { en: "cblx", ch: "通道类型", ex: "[虚拟通道][物理通道]" },
        { en: "deveui", ch: "采集器编号", ex: "c4c13b8fc4a39b0c" },
        { en: "appeui", ch: "应用编号", ex: "c4cd82096a4837c1" },
        {
          en: "yhdz",
          ch: "用户地址",
          ex: "广东省汕头市南澳县云澳镇南利嘉银都华轩商铺"
        },
        { en: "zcbh", ch: "资产编号", ex: "03001SF00000271700107078" },
        { en: "sb", ch: "设备类别", ex: "电能表" },
        {
          en: "sblx",
          ch: "设备类型",
          ex: "[单相电子式电能表][三相电子式电能表]"
        },
        { en: "sccj", ch: "生产厂家", ex: "生产厂家" },
        { en: "ccbh", ch: "出厂编号", ex: "03001SF00000251700249151" },
        { en: "txfs", ch: "通信方式", ex: "通信方式" },
        { en: "txgw", ch: "通信规约", ex: "DL/T645" },
        { en: "ljdz", ch: "逻辑地址", ex: "逻辑地址" },
        { en: "dbmm", ch: "远程控制密码", ex: "远程控制密码" },
        { en: "btl", ch: "波特率", ex: "2" },
        { en: "zhbl", ch: "综合倍率", ex: "综合倍率" },
        { en: "eddy", ch: "额定电压", ex: "额定电压" },
        { en: "bddy", ch: "标定电压", ex: "标定电压" },
        { en: "zqd", ch: "准确度", ex: "准确度" },
        { en: "bddl", ch: "到货批次号", ex: "标定电流" },
        { en: "tysj", ch: "投运时间", ex: "投运时间" },
        { en: "cbqd", ch: "抄表区段", ex: "抄表区段" },
        { en: "xl", ch: "线路", ex: "线路" },
        { en: "cz", ch: "厂站", ex: "厂站" },
        { en: "jlzzfl", ch: "计量装置分类", ex: "计量装置分类" },
        { en: "jlfs", ch: "计量方式", ex: "低供低计" },
        { en: "zfbbz", ch: "主副表标志", ex: "主副表标志" },
        { en: "jldbh", ch: "计量点编号", ex: "1111111129145564" },
        { en: "jldwz", ch: "计量点位置", ex: "用户测试" },
        { en: "jlddz", ch: "计量点地址", ex: "计量点地址" },
        { en: "scjyrq", ch: "上次检验日期", ex: "上次检验日期" },
        { en: "jlbx", ch: "计量表箱(柜)", ex: "计量表箱(柜)" },
        { en: "xgwzh", ch: "箱(柜)位置号", ex: "箱(柜)位置号" },
        { en: "zzjg", ch: "组织架构", ex: "组织架构" }
      ],
      sum: 0, //总数据
      abnormal: 0, //异常数据
      // 表单
      form: {
        gddw: "",
        gddws: [], //供电单位组
        upload: "",
        iserr: false //是否仅显示异常
      },
      // 导入表格
      tableData: [],
      // 操作表格
      OIData: [],
      // 加载
      tableloading: false,
      OIloading: false,
      multipleSelection: [],
      // 修改模态框
      formLabelWidth: "120px",
      dialogFormVisible: false,
      updateShow: false, //修改隐藏
      setForm: {
        yhabh: "",
        vcaddr_web: "",
        deveui: "",
        tq: "",
        yhmc: "",
        pn: "",
        addr_web: "",
        yhdz: "",
        cblx: "",
        cblx_arr: [
          { label: "虚拟通道", value: 1 },
          { label: "物理通道", value: 2 }
        ],
        addr: [],
        provinces: "", //地址
        gddw: "",
        yhlb: "", //用户类别
        yhlb_arr: [{ label: "公变客户", value: 1 }],
        zcbh: "", //资产编号
        jldbh: "", //计量点编号
        sblb: "", //设备类别
        sblb_arr: [{ label: "电能表", value: 1 }],
        sblx: "", //设备类型
        sblx_arr: [{ label: "单相电子式电能表", value: 1 }],
        ccbh: "", //出厂编号
        tysj: new Date().getTime(), //投运时间
        dhpc: "", //到货批次号
        zhbl: "", //综合倍率
        cbqd: "", //抄表区段
        xl: "", //线路
        cz: "", //厂站
        eddy: "", //额定电压
        bddl: "", //标定电流
        zqd: "", //准确率
        sccj: "", //生产厂家
        jlzzfl: "", //计量装置分类
        jlfs: "", //计量方式
        zfbbz: "", //祝福表标志
        jldwz: "", //计量点位置
        jlddz: "", //计量点地址
        scjyrq: new Date().getTime(), //上次验证日期
        txfs: "", //通信方式
        txfs_arr: [{ label: "低供低计", value: 1 }],
        txgw: "", //通信规约
        ljdz: "", //逻辑地址
        btl: "", //波特率
        jlbx: "", //计量表箱
        xgwzh: "", //箱位置号
        dbmm: "", //电表密码
        deveui: "", //采集器编号
        appeui: "" //注册应用号
      },
      // 地址三级联动
      options: regionData
    };
  },
  created() {
    this.getGddw();
    this.getState();
  },
  methods: {
    // parse
    Parse() {
      let Tmp = Parse.Object.extend("tmp_csv");
      let query = new Parse.Query(Tmp);
      return query;
    },
    // 表格多选改变时
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 导出模板
    derive_tmp() {
      let arr = [];
      let arr_content = [];
      for (let i = 0; i < this.headArr.length; i++) {
        arr.push(this.headArr[i].ch);
      }
      arr.push("组织架构");
      for (let i = 0; i < this.headArr.length; i++) {
        arr_content.push(this.headArr[i].ex);
      }
      arr_content.push("示例：南澳后宅供电所");
      const ws = XLSX.utils.aoa_to_sheet([arr, arr_content]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      XLSX.writeFile(wb, "模板.xlsx");
    },
    // 获取供电单位
    getGddw() {
      let Department = Parse.Object.extend("Department");
      let query = new Parse.Query(Department);
      query.notEqualTo("org_type", "集中器");
      query.select("name");
      query.find().then(res => {
        // console.log(res);
        for (let i = 0; i < res.length; i++) {
          let headArr = {};
          headArr.value = res[i].id;
          headArr.label = res[i].attributes.name;
          this.form.gddws.push(headArr);
        }
      });
    },
    // 清屏
    clear() {
      this.OIData = [];
    },
    // 选择文件
    getFile() {
      this.$refs.file.click();
    },
    // 改变文件
    handleFileChange(e) {
      // 文件信息
      this.file = e.target.files[0];
      this.form.upload = this.file.name;
      // 处理文件后缀
      let suf = this.file.name.lastIndexOf(".");
      let suffix = this.file.name.substr(suf);
      if (!(suffix == ".xls" || suffix == ".xlsx" || suffix == ".csv")) {
        this.$message.error("只支持xls、xlsx、csv后缀名的文件，请重新选择文件");
        this.form.upload = "";
      }
    },
    // 上传文件
    upload(file) {
      let wb,
        rABS = false;

      this.importf(file, rABS, wb);
    },
    importf(file, rABS, wb) {
      if (this.form.upload == "") {
        this.$message({
          message: "请选择要上传的文件",
          type: "warning"
        });
        return;
      }
      if (this.form.gddw == "") {
        this.$message({
          message: "请选择供电单位",
          type: "warning"
        });
        return;
      }
      this.tableloading = true;
      this.tableData = [];
      this.sum = 0;
      let f = file;
      let reader = new FileReader();
      reader.onload = e => {
        let data = e.target.result;
        if (rABS) {
          wb = XLSX.read(btoa(this.fixdata(data)), {
            //手动转化
            type: "base64"
          });
        } else {
          wb = XLSX.read(data, {
            type: "binary"
          });
        }
        //wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
        // //wb.Sheets[Sheet名]获取第一个Sheet的数据
        // 解析json
        let json = JSON.parse(
          JSON.stringify(
            XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {
              blankrows: true,
              defval: ""
            })
          )
        );
        // console.log(json);
        for (let i = 0; i < json.length; i++) {
          // 拼接为api需要的json
          let obj = {};
          obj.others = {};
          let count = 0;
          for (let j = 0; j < this.form.gddws.length; j++) {
            if (this.form.gddws[j].value == this.form.gddw) {
              obj.organization = this.form.gddws[j].label;
            }
          }
          for (let key in json[i]) {
            let en = this.headArr[count].en;
            if (
              en == "addr_web" ||
              en == "vcaddr_web" ||
              en == "deveui" ||
              en == "appeui" ||
              en == "pn" ||
              en == "yhabh"
            ) {
              obj[en] = String(json[i][key]);
            } else {
              obj.others[en] = String(json[i][key]);
            }
            count++;
          }
          // console.log(obj);
          // console.log(this.form.gddws)
          // 上传到临时库
          Upload(obj)
            .then(res => {
              if (res.code == 0) {
                this.$message({
                  message: "上传成功！",
                  type: "success"
                });
                if (i == json.length - 1) {
                  this.getTmpData();
                  this.getState();
                }
              }
            })
            .catch(res => {
              this.$message.error("上传失败，请确认当前状态！");
            });
        }
      };
      if (rABS) {
        reader.readAsArrayBuffer(f);
      } else {
        reader.readAsBinaryString(f);
      }
    },
    fixdata(data) {
      let o = "",
        l = 0,
        w = 10240;
      for (; l < data.byteLength / w; ++l)
        o += String.fromCharCode.apply(
          null,
          new Uint8Array(data.slice(l * w, l * w + w))
        );
      o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
      return o;
    },
    // 获取临时库数据，并渲染
    getTmpData() {
      let query = this.Parse();
      query.ascending("-createdAt");
      query.find().then(res => {
        // console.log(res);
        for (let i = 0; i < res.length; i++) {
          let obj = {};
          let r = res[i].attributes;
          obj.gddw = r.organization;
          obj.num = i + 1;
          obj.addr_web = r.addr;
          obj.vcaddr_web = r.vcaddr;
          obj.appeui = r.appeui;
          obj.deveui = r.deveui;
          obj.pn = r.pn;
          obj.yhabh = r.yhabh;
          for (let key in r.others) {
            obj[key] = r.others[key];
          }
          this.tableData.push(obj);
          this.sum++;
        }
        this.tableloading = false;
        this.isGetInfo = false;
      });
    },
    // 数据回滚
    handleClickRoll() {
      RollBack()
        .then(res => {
          // console.log(res);
          if (res.code == 0) {
            this.$message({
              message: "数据回滚成功，数据已改变，回到初始状态！",
              type: "success"
            });
            this.tableData = [];
            this.OIData = [];
            this.isGetInfo = true;
            this.isInfo = true;
            this.num = 1;
            this.sum = 0;
            this.getState();
          }
        })
        .catch(res => {
          this.$message.error("回滚失败，请重试！");
        });
    },
    // 公共删除查库
    /**删除单个的方法，
            where 查询条件
            value 查询内容
            isDel 是否删完重新取库渲染
        */
    delete(where, value, isDel) {
      let query = this.Parse();
      query.equalTo(where, value);
      query.find().then(res => {
        // console.log(res);
        let id = res[0].id;
        query.get(id).then(gRes => {
          gRes
            .destroy()
            .then(dRes => {
              this.$message({
                message: "删除成功！",
                type: "success"
              });
              if (isDel) {
                this.tableData = [];
                this.getTmpData();
              }
            })
            .catch(dRes => {
              this.$message.error("删除失败！");
            });
        });
      });
    },
    // 删除
    deleteRow(index, rows) {
      this.delete("addr", rows[index].addr_web, true);
      this.form.iserr = false;
    },
    // 批量删除
    handleClickDel() {
      let rows = this.multipleSelection;
      let isDel = false;
      if (rows) {
        for (let i = 0; i < rows.length; i++) {
          if (i == rows.length - 1) {
            isDel = true;
          }
          this.delete("addr", rows[i].addr_web, isDel);
        }
        this.form.iserr = false;
      }
    },
    // 获取原有数据填入表单中
    setRow(index, rows) {
      // console.log(index, rows);
      for (let key in rows[index]) {
        this.setForm[key] = rows[index][key];
      }
      this.dialogFormVisible = true;
    },
    // 修改隐藏
    handleClickUpdateShow() {
      this.updateShow = !this.updateShow;
    },
    // 确认修改
    handleClickSet() {
      let query = this.Parse();
      query.find().then(res => {
        // 根据电表地址找到需要修改的数据
        console.log(res);
        for (let i = 0; i < res.length; i++) {
          if (this.setForm.addr_web == res[i].attributes.addr) {
            // console.log(res[i]);
            let others = res[i].attributes.others;
            let new_others = {};
            for (let key in others) {
              new_others[key] = this.setForm[key];
            }
            new_others.yhdz = this.setForm.provinces + this.setForm.yhdz;
            res[i].set("appeui", this.setForm.appeui);
            res[i].set("deveui", this.setForm.deveui);
            res[i].set("pn", this.setForm.pn);
            res[i].set("others", new_others);
            res[i]
              .save()
              .then(result => {
                // console.log(result);
                this.$message({
                  message: "修改成功！",
                  type: "success"
                });
                this.dialogFormVisible = false;
                this.tableData = [];
                this.getTmpData();
              })
              .catch(result => {
                this.$message.error("修改出错,请重新操作！");
              });
          }
        }
      });
    },
    // 地址联动
    handleModChange(value) {
      // 修改
      let data =
        CodeToText[value[0]] +
        ", " +
        CodeToText[value[1]] +
        ", " +
        CodeToText[value[2]];
      this.setForm.provinces = data.split(",").join("");
    },
    // 校验
    handleClickVerify() {
      this.abnormal = 0;
      this.OIData = [];
      // 恢复颜色
      let arr = document.querySelectorAll(
        ".table .el-table__body-wrapper .el-table__row .el-tooltip"
      );
      for (let i = 0; i < arr.length; i++) {
        arr[i].style.color = "#606266";
      }
      Verify()
        .then(result => {
          if (result.code == 0) {
            this.$message({
              message: "校验中！",
              type: "success"
            });
            this.getState();
            // 定时器定时查看状态
            let time = setInterval(() => {
              // console.log(this.state);
              if (this.state == "校验失败") {
                this.$message.error("校验失败！");
                clearInterval(time);
                // 验证完毕，查库查看错误
                this.isInfo = false;
                let query = this.Parse();
                query.select("error");
                query.ascending("-createdAt");
                query.find().then(res => {
                  // console.log(res);
                  this.OIData.push({
                    num: this.num,
                    oper: "数据上传",
                    errRow: "",
                    errCell: "",
                    OI: `上传${this.sum}条`,
                    handlers: this.user,
                    time: new Date().toLocaleString()
                  });
                  for (let i = 0; i < res.length; i++) {
                    let str = JSON.stringify(res[i].attributes.error);
                    // 当错误对象不是空时
                    if (str != "{}") {
                      this.abnormal++;
                      let err = res[i].attributes.error;
                      // 遍历错误，逐行打印
                      for (let key in err) {
                        let cell = 0;
                        this.num++;
                        // 判断错误在某个单元格
                        for (let j = 0; j < this.headArr.length; j++) {
                          // console.log(this.headArr[j].en,key);
                          if (
                            this.headArr[j].en == key ||
                            this.headArr[j].en == key + "_web"
                          ) {
                            cell = j;
                            //异常颜色
                            // console.log(i);
                            arr[i * 42 + j + 2].style.color = "#f00";
                          }
                        }
                        this.OIData.push({
                          num: this.num,
                          oper: "数据校验",
                          errRow: `第${i + 1}行`,
                          errCell: `${i + 1}:${cell + 1}`,
                          OI: `${key}:${err[key]}`,
                          handlers: this.user,
                          time: new Date().toLocaleString()
                        });
                      }
                    }
                    if (i == res.length - 1) {
                      this.num++;
                      this.OIData.push({
                        num: this.num,
                        oper: "数据验证(汇总)",
                        errRow: "",
                        errCell: "",
                        OI: `校验完成${this.sum}条,${this.abnormal}条存在异常`,
                        handlers: this.user,
                        time: new Date().toLocaleString()
                      });
                    }
                  }
                });
              } else if (this.state == "校验成功") {
                clearInterval(time);
                this.isVerify = false;
                this.$message({
                  message: "校验成功！",
                  type: "success"
                });
              }
              this.getState();
            }, 1000);
          }
        })
        .catch(res => {
          this.$message.error("校验发送错误！");
        });
    },
    // 确认导入
    handleClickImport() {
      Import()
        .then(res => {
          if (res.code == 0) {
            this.$message({
              message: "导入成功！",
              type: "success"
            });
            this.isVerify = true;
            this.isGetInfo = true;
          }
        })
        .catch(res => {
          this.$message.error("导入出错！");
        });
    },
    // 查看当前状态
    getState() {
      State().then(res => {
        this.user = res.user;
        if (res.state == "idle") {
          this.state = "空闲";
        } else if (res.state == "load") {
          this.state = "加载";
        } else if (res.state == "checking") {
          this.state = "校验中";
        } else if (res.state == "check_fail") {
          this.state = "校验失败";
        } else if (res.state == "check_success") {
          this.state = "校验成功";
        } else {
          this.state = "提交成功";
        }
      });
    },
    // 改变仅显示异常
    handleChangeUnusual() {
      if (this.form.iserr) {
        // 左边内容
        let con_arr = document.querySelectorAll(
          ".table .el-table__body-wrapper .el-table__row .el-tooltip"
        );
        // 右边删除按钮
        let btn_arr = document.querySelectorAll(
          ".table .el-table__fixed-right .el-table__row"
        );
        console.log(btn_arr);
        let count = 0;
        for (let i = 0; i < con_arr.length; i++) {
          if (
            con_arr[i].getAttribute("style") ==
            "width: 79px; color: rgb(96, 98, 102);"
          ) {
            count++;
            // 连续41次都是正常颜色，那么就隐藏他
            if (count == 41) {
              // 总数除以count获取按钮的位置
              let x = parseInt((i + 1) / count - 1);
              // console.log(con_arr[i].parentNode.parentNode)
              con_arr[i].parentNode.parentNode.style.display = "none";
              btn_arr[x].style.display = "none";
              count = 0;
            }
          } else {
            count = 0;
          }
        }
      } else {
        this.tableData = [];
        this.getTmpData();
      }
    },
    // 数据备份
    handleClickBackups() {
      let query = this.Parse();
      query.find().then(res => {
        let json = JSON.parse(JSON.stringify(res));
        // 拿出others
        for (let i = 0; i < json.length; i++) {
          console.log(json[i].others);
          for (let key in json[i].others) {
            json[i][key] = json[i].others[key];
          }
        }
        let config = {
          yhabh: "用户编号",
          yhmc: "用户名称",
          vcaddr_web: "集中器地址",
          addr_web: "电能表地址",
          pn: "PN值",
          yhlb: "用户类别",
          cblx: "通道类型",
          deveui: "采集器编号",
          appeui: "应用编号",
          yhdz: "用户地址",
          zcbh: "资产编号",
          sb: "设备类别",
          sblx: "设备类型",
          sccj: "生产厂家",
          ccbh: "出厂编号",
          txfs: "通信方式",
          txgw: "通信规约",
          ljdz: "逻辑地址",
          dbmm: "远程控制密码",
          btl: "波特率",
          zhbl: "综合倍率",
          eddy: "额定电压",
          bddl: "标定电流",
          zqd: "准确度",
          dhpc: "到货批次号",
          tysj: "投运时间",
          cbqd: "抄表区段",
          xl: "线路",
          cz: "厂站",
          jlzzfl: "计量装置分类",
          jlfs: "计量方式",
          zfbbz: "主副表标志",
          jldbh: "计量点编号",
          jldwz: "计量点位置",
          jlddz: "计量点地址",
          scjyrq: "上次检验日期",
          jlbx: "计量表箱(柜)",
          xgwzh: "箱(柜)位置号"
        };
        this.derive(json, config, "数据备份");
      });
    },
    // 导出操作记录
    handleClickRecord() {
      let config = {
        num: "编号",
        oper: "操作",
        errRow: "异常行数",
        errCell: "异常单元格",
        OI: "操作说明",
        handlers: "操作者",
        time: "操作时间"
      };
      this.derive(this.OIData, config, "操作记录");
    },
    // 导出
    derive(json, obj, name) {
      console.log(json);
      // console.log(obj);
      let table = [[]];
      // 获取头部
      let s = 0;
      for (let i in obj) {
        table[0][s] = obj[i];
        s++;
      }
      s = null;
      // 拼接json
      for (let i of json) {
        // console.log(i);
        let line = [];
        for (let j in obj) {
          line.push(i[j]);
        }
        table.push(line);
      }
      const ws = XLSX.utils.json_to_sheet(table, { skipHeader: true });
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      XLSX.writeFile(wb, name + ".xlsx");
    }
  }
};
</script>

<style lang="scss" scoped>
#bulkImport {
  padding: 20px 0 0 20px;
  .content {
    .operation {
      .el-checkbox {
        float: right;
      }
    }
    // 表格上下间距
    /deep/ .el-table {
      th,
      td {
        padding: 5px 0;
        text-align: center;
      }
    }
    // 表头设置
    /deep/ .has-gutter {
      th {
        background: #f2f2f2;
        color: #343434;
      }
    }
    .table {
      .result {
        margin-bottom: 0;
      }
    }
    .OI {
      .btns {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        margin-right: 20px;
      }
    }
  }
  /deep/ .el-table__fixed-right {
    .is-leaf {
      background: #f2f2f2;
      color: #343434;
    }
  }
  /deep/ .el-dialog {
    height: 450px;
    overflow: scroll;
    input,
    .el-date-editor {
      width: 150px;
    }
    .el-cascader {
      .el-input__inner,
      .el-cascader__label {
        font-size: 12px;
        height: 25px;
        width: 270px !important;
      }
    }
    .el-dialog__body {
      padding: 10px;
      .el-form {
        padding-bottom: 10px;
        display: flex;
        flex-wrap: wrap;
      }
    }
    .el-form-item {
      margin: 5px 0;
    }
  }
}
</style>