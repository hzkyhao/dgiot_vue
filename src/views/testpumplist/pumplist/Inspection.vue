<template>
  <div class="inspection">
    <el-tabs type="border-card">
      <el-tab-pane :label="'进行中('+total+')'">
        <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
          <div style="display:flex;justify-content: space-between">
            <el-form-item label="检验单位">
              <el-select v-model="formInline.department" placeholder="检验单位">
                <el-option
                  v-for="(item,index) in departmentpump"
                  :key="index"
                  :value="item.attributes.name"
                  :label="item.attributes.name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="检验标准">
              <el-select v-model="formInline.standard" placeholder="检验标准">
                <el-option
                  v-for="(item,key) in form.standard"
                  :label="item.attributes.name"
                  :value="item.id"
                  :key="key"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="委托单位">
              <el-input v-model="formInline.factory" placeholder="请输入委托单位"></el-input>
            </el-form-item>
            <!-- <el-form-item label="检测人员">
              <el-select v-model="formInline.region" placeholder="检测人员">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>-->
            <el-form-item label="检测任务编号">
              <el-input v-model="formInline.name" placeholder="检测任务编号"></el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="检测时间">
              <el-col :span="11">
                <el-form-item>
                  <el-date-picker
                    v-model="formInline.starttime"
                    type="datetime"
                    placeholder="选择开始时间"
                    @change="testdata"
                    :picker-options="pickerOptionsStart"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="11">
                <el-form-item prop="freq">
                  <el-date-picker
                    v-model="formInline.endtime"
                    type="datetime"
                    placeholder="选择结束时间"
                    @change="enddata"
                    :picker-options="pickerOptionsEnd1"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getTasktable(0)">查询</el-button>
              <el-button type="primary" @click="resetForm">重置</el-button>
              <el-button type="primary" @click="addtask()">新增任务</el-button>
            </el-form-item>
          </div>
        </el-form>
 
        <div class="tasklist">
          <el-table :data="taskData" stripe border style="width:100%;text-align:center">
            <el-table-column type="index" label="id"></el-table-column>
            <el-table-column label="检验编号" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.attributes.pump_id}}</span>
              </template>
            </el-table-column>
            <el-table-column label="委托方" align="center" width="200">
              <template slot-scope="scope">
                <span>{{scope.row.attributes.factory}}</span>
              </template>
            </el-table-column>
            <el-table-column label="所属地区" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.attributes.province}}</span>
              </template>
            </el-table-column>
            <el-table-column label="委托人联系方式" align="center" width="200">
              <template slot-scope="scope">
                <span>{{scope.row.attributes.entrust_phone.toString().substring(0,4)+'xxxxx'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="水泵类型" align="center" width="150">
              <template slot-scope="scope">
                <span>{{scope.row.attributes.pump_use}}</span>
              </template>
            </el-table-column>
            <el-table-column label="水泵型号" align="center" width="150">
              <template slot-scope="scope">
                <span>{{scope.row.attributes.pump_model}}</span>
              </template>
            </el-table-column>
            <el-table-column label="检验单位" align="center" width="200">
              <template slot-scope="scope">
                <span>{{scope.row.attributes.detection_unit}}</span>
              </template>
            </el-table-column>
            <el-table-column label="检验标准" align="center" width="200">
              <template slot-scope="scope">
                <span>{{scope.row.attributes.datas.name}}</span>
              </template>
            </el-table-column>
            <el-table-column label="检验实验室" align="center" width="200">
              <template slot-scope="scope">
                <span>{{scope.row.attributes.lab}}</span>
              </template>
            </el-table-column>
            <el-table-column label="测试台体" align="center" width="200">
              <template slot-scope="scope">
                <span>{{scope.row.attributes.internal_num}}</span>
              </template>
            </el-table-column>
 
            <el-table-column label="创建日期" align="center" width="150">
              <template slot-scope="scope">
                <span>{{new Date(scope.row.createdAt).toLocaleDateString()}}</span>
              </template>
            </el-table-column>
            <el-table-column label="计划完成时间" align="center" width="200">
              <template slot-scope="scope">
                <span>{{timestampToTime(scope.row.attributes.test_time)}}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column label="检测人员" align="center" width="100">
              <template slot-scope="scope"></template>
            </el-table-column>
            <el-table-column label="任务状态" align="center" width="100">
              <template slot-scope="scope"></template>
            </el-table-column>
            <el-table-column label="审核状态" align="center" width="100">
              <template slot-scope="scope"></template>
            </el-table-column> -->
            <el-table-column width="300" label="查看" align="center">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editorClient(scope.row.id)"
                ></el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteClient(scope.row.id)"
                ></el-button>
                <el-button
                  type="primary"
                  @click="taskDetail(scope.row.id,scope.row.attributes.test_bed.id)"
                  size="mini"
                >详情</el-button>
                <el-button type="primary" size="mini" @click="clientView(scope.row,scope.$index)">取证</el-button>
                <el-button type="primary" size="mini" @click="evidenceView(scope.row)">查证</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top:20px">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            ></el-pagination>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="'已结束('+total1+')'">
        <el-form :inline="true" :model="formInline1" class="demo-form-inline" size="small">
          <div style="display:flex;justify-content: space-between">
            <el-form-item label="检验单位">
              <el-select v-model="formInline1.department" placeholder="检验单位">
                <el-option
                  v-for="(item,index) in departmentpump"
                  :key="index"
                  :value="item.attributes.name"
                  :label="item.attributes.name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="检验标准">
              <el-select v-model="formInline1.standard" placeholder="检验标准">
                <!-- <el-option
                  v-for="(item,key) in form.standard"
                  :label="item.data.inspection_standard"
                  :value="item.data.inspection_standard"
                  :key="key"
                ></el-option>-->
                <el-option
                  v-for="(item,key) in form.standard"
                  :label="item.attributes.name"
                  :value="item.id"
                  :key="key"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="委托单位">
              <el-input v-model="formInline1.factory" placeholder="请输入委托单位"></el-input>
            </el-form-item>
            <el-form-item label="检测人员">
              <el-select v-model="formInline1.region" placeholder="检测人员">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="检测任务编号">
              <el-input v-model="formInline1.name" placeholder="检测任务编号"></el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="检测时间">
              <el-col :span="11">
                <el-form-item>
                  <el-date-picker
                    v-model="formInline1.starttime"
                    type="datetime"
                    placeholder="选择开始时间"
                    @change="testdata"
                    :picker-options="pickerOptionsStart"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="11">
                <el-form-item prop="freq">
                  <el-date-picker
                    v-model="formInline1.endtime"
                    type="datetime"
                    placeholder="选择结束时间"
                    @change="enddata"
                    :picker-options="pickerOptionsEnd1"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getTasktable1(0)">查询</el-button>
              <el-button type="primary" @click="resetForm1">重置</el-button>
              <el-button type="primary" @click="addtask()">新增任务</el-button>
            </el-form-item>
          </div>
        </el-form>
        <el-table :data="spacetaskData" stripe border style="width:100%;text-align:center">
          <el-table-column type="index" label="id"></el-table-column>
          <el-table-column label="检验编号" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.attributes.pump_id}}</span>
            </template>
          </el-table-column>
          <el-table-column label="委托方" align="center" width="200">
            <template slot-scope="scope">
              <span>{{scope.row.attributes.factory}}</span>
            </template>
          </el-table-column>
          <el-table-column label="所属地区" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.attributes.province}}</span>
            </template>
          </el-table-column>
          <el-table-column label="委托人联系方式" align="center" width="200">
            <template slot-scope="scope">
              <span
                v-if="scope.row.attributes.entrust_phone"
              >{{scope.row.attributes.entrust_phone.toString().substring(0,4)+'xxxxx'}}</span>
              <span v-else></span>
            </template>
          </el-table-column>
          <el-table-column label="水泵类型" align="center" width="150">
            <template slot-scope="scope">
              <span>{{scope.row.attributes.pump_model}}</span>
            </template>
          </el-table-column>
          <el-table-column label="水泵型号" align="center" width="150">
            <template slot-scope="scope">
              <span>{{scope.row.attributes.pump_type}}</span>
            </template>
          </el-table-column>
          <el-table-column label="检验单位" align="center" width="200">
            <template slot-scope="scope">
              <span>{{scope.row.attributes.detection_unit}}</span>
            </template>
          </el-table-column>
          <el-table-column label="检验标准" align="center" width="100">
            <template slot-scope="scope">
              <span>{{scope.row.attributes.standard}}</span>
            </template>
          </el-table-column>
          <el-table-column label="检验实验室" align="center" width="200">
            <template slot-scope="scope">
              <span>{{scope.row.attributes.lab}}</span>
            </template>
          </el-table-column>
          <el-table-column label="测试台体" align="center" width="200">
            <template slot-scope="scope">
              <span>{{scope.row.attributes.internal_num}}</span>
            </template>
          </el-table-column>
 
          <el-table-column label="创建日期" align="center" width="150">
            <template slot-scope="scope">
              <span>{{new Date(scope.row.createdAt).toLocaleDateString()}}</span>
            </template>
          </el-table-column>
          <el-table-column label="计划完成时间" align="center" width="200">
            <template slot-scope="scope">
              <span>{{timestampToTime(scope.row.attributes.test_time)}}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="检测人员" align="center" width="100">
            <template slot-scope="scope"></template>
          </el-table-column>
          <el-table-column label="任务状态" align="center" width="100">
            <template slot-scope="scope"></template>
          </el-table-column>
          <el-table-column label="审核状态" align="center" width="100">
            <template slot-scope="scope"></template>
          </el-table-column> -->
          <el-table-column width="300" label="查看" align="center">
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="editorClient(scope.row.id)"
              ></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
              <el-button
                type="primary"
                @click="taskDetail(scope.row.id,scope.row.attributes.internal_num)"
                size="mini"
              >详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin-top:20px">
          <el-pagination
            @size-change="handleSizeChange1"
            @current-change="handleCurrentChange1"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pagesize1"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total1"
          ></el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div class="block">
      <el-dialog
        :title="'检测取证任务'+dialogtext"
        :visible.sync="taskdialog"
        width="50%"
        v-if="taskdialog"
      >
        <el-form ref="taskform" :model="form" :rules="formrule" label-width="120px">
          <el-divider content-position="left" style="color:blue">检测任务基本信息</el-divider>
          <el-row>
            <el-col :span="12">
              <div class="grid-content bg-purple">
                <el-form-item label="检验编号：" prop="inspection_number">
                  <el-input v-model="form.inspection_number" placeholder="请输入检验编号"></el-input>
                </el-form-item>
                <el-form-item label="所属地址" prop="addr">
                  <el-cascader
                    placeholder="请选择所属地址"
                    size="large"
                    :options="regionoptions"
                    v-model="form.addr"
                    @change="handleModChange"
                  ></el-cascader>
                </el-form-item>
                <el-form-item label="水泵用途" prop="usetype">
                  <el-select v-model="form.usetype" placeholder="请选择水泵用途">
                    <el-option
                      v-for="(item,index) in pumpusetype"
                      :label="item"
                      :value="item"
                      :key="index"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="检测类型">
                  <el-select v-model="form.checktype" placeholder="请选择检测类型">
                    <el-option label="性能检测" value="性能检测"></el-option>
                  </el-select>
                </el-form-item>
                <!-- <el-form-item label="检验标准"  prop="region">
                  <el-select v-model="form.region" placeholder="请选择检验标准" @change="standardName">
                    <el-option
                      v-for="(item,key) in form.standard"
                      :label="item.data.inspection_standard"
                      :value="JSON.stringify(item.data)"
                      :key="key"
                    ></el-option>
                  </el-select>
                </el-form-item>-->
                <el-form-item label="质检项目" prop="region">
                  <el-select v-model="form.region" placeholder="质检项目" @change="changeStandard">
                    <el-option
                      v-for="(item,key) in form.standard"
                      :label="item.attributes.name"
                      :value="item.id"
                      :key="key"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
            <!--右边的地方-->
            <el-col :span="12">
              <div class="grid-content bg-purple-light">
                <el-form-item label="委托方" prop="entrust">
                  <el-input v-model="form.entrust"></el-input>
                </el-form-item>
                <el-form-item label="委托方联系方式" prop="entrustphone">
                  <el-input v-model.number="form.entrustphone" placeholder="请输入委托方联系方式"></el-input>
                </el-form-item>
                <el-form-item label="水泵型号" prop="model">
                  <el-select v-model="form.model" placeholder="请选择水泵型号">
                    <el-option
                      v-for="(item,index) in pumpmodel"
                      :label="item"
                      :value="item"
                      :key="index"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="计划完成时间：" prop="endtime">
                  <el-date-picker
                    v-model="form.endtime"
                    type="datetime"
                    placeholder="请选择任务计划完成时间"
                    :picker-options="pickerOptionsEnd"
                    value-format="timestamp"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item label="检测标准" prop="reportmodule">
                  <el-select
                    v-model="form.reportmodule"
                    value-key="name"
                    placeholder="请选择检验标准"
                    @change="changeReport"
                  >
                    <el-option
                      v-for="item in modulelist"
                      :label="item.attributes.data.name"
                      :value="item.attributes.data"
                      :key="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-divider content-position="left" style="color:blue">检测资源信息</el-divider>
          <el-row>
            <el-col :span="12">
              <div class="grid-content bg-purple">
                <el-form-item label="检测单位" prop="client">
                  <el-select
                    v-model="form.client"
                    placeholder="请选择检测单位"
                    @change="pumpDepartmentSelect"
                  >
                    <el-option
                      v-for="(item,index) in departmentpump"
                      :key="index"
                      :label="item.attributes.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="检测人">
                  <el-select v-model="form.testuser" placeholder="请选择检测类型">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple-light">
                <el-form-item label="检测实验室">
                  <el-select
                    v-model="form.laboratory"
                    placeholder="请选择检测实验室"
                    @change="laboratorySelect"
                  >
                    <el-option
                      v-for="(item,index) in departmentlaboratory"
                      :key="index"
                      :label="item.attributes.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="测试台体" prop="bedname">
                  <el-select v-model="form.bedname" placeholder="请选择测试台体" @change="testBedSelect">
                    <el-option
                      v-for="(item,key) in testbedlist"
                      :label="item.attributes.name"
                      :value="item.id"
                      :key="key"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="taskdialog = false">取 消</el-button>
          <el-button type="primary" @click="addBedtask('taskform')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- </div> -->
  </div>
</template>
<script>
import { regionData, CodeToText } from "element-china-area-data";
import Parse from "parse";
import { getModule, deriveReport } from "@/api/reportmodule/reportmodule";
import { returnLogin } from "@/utils/return";
import { gettables } from "@/api/login";
import Cookies from "js-cookie";
import $ from "jquery";
var province, city, discrict;
export default {
  data() {
    return {
      pumpusetype: [
        "计量泵",
        "给水泵",
        "排水泵",
        "疏水泵",
        "喷灌泵",
        "增压泵",
        "排污泵"
      ],
      pumpmodel: [
        "离心泵",
        "潜水泵",
        "混流泵",
        "螺杆泵",
        "轴流泵",
        "旋涡泵",
        "电动泵",
        "蒸汽泵",
        "齿轮泵",
        "罗茨泵",
        "滑片泵",
        "喷射泵",
        "升液泵",
        "电磁泵"
      ],
      formInline: {
        user: "",
        region: "",
        name: "",
        department: "",
        standard: "",
        factory: "",
        starttime: "",
        endtime: ""
      },
      regionoptions: regionData,
      pickerOptionsStart: {
        disabledDate: time => {
          let endDateVal = this.formInline.endtime;
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
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      pickerOptionsEnd1: {
        disabledDate: time => {
          let beginDateVal = this.formInline.starttime;
          if (beginDateVal) {
            return (
              time.getTime() <
              new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
            );
          } else {
            return time.getTime() < Date.now() - 8.64e7;
          }
        }
      },
      taskData: [],
      pagesize: 10,
      start: 0,
      total: 0,
      standard: {},
      form: {
        endtime: "",
        inspection_number: "",
        client: "",
        region: "",
        produt: "",
        model: "",
        standard: [],
        testbed: [],
        bedname: "",
        addr: [],
        testuser: "",
        entrust: "", //请选择委托方
        entrustphone: "", //委托人联系方式
        laboratory: "", //实验室,
        checktype: "性能检测", //水泵检测类型
        usetype: "", //水泵用途
        reportmodule: "" //检测标准
      },
      options: [
        {
          value: "浙江利欧",
          label: "浙江利欧"
        },
        {
          value: "南方泵业",
          label: "南方泵业"
        },
        {
          value: "新界泵业",
          label: "新界泵业"
        },
        {
          value: "丰球",
          label: "丰球"
        }
      ],
      formLabelWidth: "120px",
      taskdialog: false,
      formrule: {
        inspection_number: [
          { required: true, message: "请输入检验编号", trigger: "blur" }
        ],
        client: [
          { required: true, message: "请选择检测单位", trigger: "change" }
        ],
        region: [
          { required: true, message: "请选择质检项目", trigger: "change" }
        ],
        reportmodule: [
          { required: true, message: "请选择检验标准", trigger: "change" }
        ],
        produt: [
          { required: true, message: "请输入产品名称", trigger: "blur" }
        ],
        model: [
          { required: true, message: "请选择水泵型号", trigger: "change" }
        ],
        bedname: [
          { required: true, message: "请选择测试台体", trigger: "change" }
        ],
        entrust: [{ required: true, message: "请输入委托方", trigger: "blur" }],
        usetype: [
          { required: true, message: "请选择水泵用途", trigger: "change" }
        ],
        entrustphone: [
          { required: true, message: "请输入委托人联系方式", trigger: "blur" },
          {
            validator: function(rule, value, callback) {
              var MobileRegex = /^1[3-9]\d{9}$/;
              if (!MobileRegex.test(value)) {
                callback(new Error("手机号码格式不正确！"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        starttime: [
          {
            type: "date",
            required: true,
            message: "请选择开始时间",
            trigger: "change"
          }
        ],
        endtime: [
          {
            type: "date",
            required: true,
            message: "请选择结束时间",
            trigger: "change"
          }
        ]
      },
      spacetaskData: [],
      pagesize1: 10,
      start1: 0,
      total1: 0,
      dialogtext: "新增",
      formInline1: {
        user: "",
        region: "",
        name: "",
        department: "",
        standard: "",
        factory: "",
        starttime: "",
        endtime: ""
      },
      modulelist: [], //检测标准列表
      pumpclientid: "", //编辑时的任务ID
      departmentname: "", //单位名称
      laboratoryname: "", //实验室名称
      departmentpump: [], //泵单位
      departmentlaboratory: [], //实验室数列
      testbedlist: [], //测试台体数列
      testbedname: "" //测试台体名称
    };
  },
  created() {},
  mounted() {
    this.getTasktable();
    this.getTasktable1();
    this.getDepartmentPump();
    this.getStandard();
  },
  methods: {
    //初始化实验室
    getDepartmentLaboratory(val, laboratoryid, testbedid) {
      var Department = Parse.Object.extend("PumpDepartment");
      var department = new Parse.Query(Department);
      department.equalTo("org_type", "实验室");
      department.equalTo("ParentId", val);
      department.find().then(
        resultes => {
          this.departmentlaboratory = resultes;
          if (laboratoryid) {
            this.laboratorySelect(laboratoryid, testbedid);
          }
        },
        error => {
          returnLogin(error);
        }
      );
    },
    getStandard() {
      var InspectionStandard = Parse.Object.extend("InspectionStandard");
      var inspectionstandard = new Parse.Query(InspectionStandard);
      inspectionstandard.find().then(
        resultes => {
          if (resultes) {
            console.log(resultes);
            this.modulelist = resultes;
          }
        },
        error => {
          returnLogin(error);
        }
      );
      //  getModule()
      //   .then(resultes => {
      //     if (resultes) {
 
      //       console.log(this.modulelist)
      //     }
      //   })
      //   .catch(error => {
 
      //   });
      var Report = Parse.Object.extend("Report");
      var report = new Parse.Query(Report);
 
      report.find().then(
        resultes => {
          this.form.standard = resultes;
        },
        error => {
          returnLogin(error);
        }
      );
    },
    //得到泵单位
    getDepartmentPump() {
      var Department = Parse.Object.extend("PumpDepartment");
      var department = new Parse.Query(Department);
      department.equalTo("org_type", "泵单位");
      department.find().then(
        resultes => {
          this.departmentpump = resultes;
        },
        error => {
          returnLogin(error);
        }
      );
    },
    //检测实验室选择
    laboratorySelect(val, testbedid) {
      this.departmentlaboratory.map(item => {
        if (item.id == val) {
          this.laboratoryname = item.attributes.name;
        }
      });
      var Testbed = Parse.Object.extend("Testbed");
      var testbed = new Parse.Query(Testbed);
      testbed.equalTo("department", val);
      testbed.find().then(
        resultes => {
          this.testbedlist = resultes;
          if (testbedid) {
            this.testBedSelect(testbedid);
          }
        },
        error => {
          returnLogin(error);
        }
      );
    },
    //检测单位选择
    pumpDepartmentSelect(val, laboratoryid, testbedid) {
      this.departmentpump.map(item => {
        if (item.id == val) {
          this.departmentname = item.attributes.name;
        }
      });
      this.getDepartmentLaboratory(val, laboratoryid, testbedid);
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
    onSubmit() {},
    resetForm() {
      this.formInline = {
        user: "",
        region: "",
        name: "",
        department: "",
        standard: "",
        factory: "",
        starttime: "",
        endtime: ""
      };
    },
    getTasktable(issearch) {
      if (issearch == 0) {
        this.start = 0;
      }
      var date = Math.floor(new Date().getTime() / 1000);
      var PumpClient = Parse.Object.extend("PumpClient");
      var pumpclient = new Parse.Query(PumpClient);
      pumpclient.descending("createdAt");
      pumpclient.limit(this.pagesize);
      pumpclient.skip(this.start);
      if (this.formInline.factory != "") {
        pumpclient.matches("factory", this.formInline.factory);
      }
      if (this.formInline.name != "") {
        pumpclient.matches("pump_id", this.formInline.name);
      }
      if (this.formInline.standard != "") {
        pumpclient.equalTo("standard", this.formInline.standard);
      }
      if (this.formInline.department != "") {
        pumpclient.equalTo("detection_unit", this.formInline.department);
      }
      pumpclient.greaterThan("test_time", date);
      pumpclient.count().then(
        count => {
          this.total = count;
          pumpclient.find().then(resultes => {
            this.taskData = resultes;
          });
        },
        error => {
          returnLogin(error);
        }
      );
    },
    handleSizeChange(val) {
      this.pagesize = val;
      console.log(111);
      this.getTasktable();
    },
    handleCurrentChange(val) {
      this.start = Number(val - 1) * Number(this.pagesize);
      this.getTasktable();
    },
    resetForm1() {
      this.formInline1 = {
        user: "",
        region: "",
        name: "",
        department: "",
        standard: "",
        factory: "",
        starttime: "",
        endtime: ""
      };
    },
    //已结束任务
    getTasktable1(issearch) {
      if (issearch == 0) {
        this.start = 0;
      }
      var date = Math.floor(new Date().getTime() / 1000);
      var PumpClient = Parse.Object.extend("PumpClient");
      var pumpclient = new Parse.Query(PumpClient);
      pumpclient.descending("createdAt");
      pumpclient.limit(this.pagesize1);
      pumpclient.skip(this.start1);
      if (this.formInline1.factory != "") {
        pumpclient.matches("factory", this.formInline1.factory);
      }
      if (this.formInline1.name != "") {
        pumpclient.matches("pump_id", this.formInline1.name);
      }
      if (this.formInline1.standard != "") {
        pumpclient.equalTo("standard", this.formInline1.standard);
      }
      if (this.formInline1.department != "") {
        pumpclient.equalTo("detection_unit", this.formInline1.department);
      }
      pumpclient.lessThan("test_time", date);
      pumpclient.count().then(
        count => {
          this.total1 = count;
          pumpclient.find().then(resultes => {
            this.spacetaskData = resultes;
          });
        },
        error => {
          returnLogin(error);
        }
      );
    },
    addtask() {
      this.taskdialog = true;
      this.$nextTick(() => {
        this.form.usetype = "";
        this.form.checktype = "";
        this.form.addr = [];
        this.form.entrustphone = "";
        this.form.entrust = "";
        this.form.inspection_number = "";
        this.form.model = "";
        this.form.endtime = "";
        this.form.client = "";
        this.form.laboratory = "";
        this.form.region = "";
      });
    },
 
    handleSizeChange1(val) {
      this.pagesize1 = val;
      this.getTasktable1();
    },
    handleCurrentChange1(val) {
      this.start1 = Number(val - 1) * Number(this.pagesize1);
      this.getTasktable1();
    },
    taskDetail(id, testbedid) {
      this.$router.push({
        path: "/inspection/reportdetail",
        query: {
          id: id,
          testbedid: testbedid
        }
      });
    },
    //检验标准选择
    standardName(val) {
      console.log(val);
      let obj = {};
      obj = this.form.standard.find(item => {
        //这里的selectList就是上面遍历的数据源
        return JSON.stringify(item.data) == val; //筛选出匹配数据
      });
      this.standard = obj.data.inspection_standard; //我这边的name就是对应label的
    },
    changeStandard(val) {
      this.form.standard.map(item => {
        if (item.id == val) {
          this.standard = val;
        }
      });
    },
    //地址选择
    handleModChange(addr) {
      province = CodeToText[addr[0]];
      city = CodeToText[addr[1]];
      discrict = CodeToText[addr[2]];
    },
    //测试台体选择
    testBedSelect(val) {
      this.testbedlist.map(item => {
        if (item.id == val) {
          this.testbedname = item.attributes.name;
        }
      });
    },
    //新增和编辑
    addBedtask(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var PumpClient = Parse.Object.extend("PumpClient");
          var pumpclient = new PumpClient();
          if (this.pumpclientid != "") {
            pumpclient.id = this.pumpclientid;
            this.dialogtext = "编辑";
          } else {
            this.dialogtext = "新增";
          }
          var Department = Parse.Object.extend("PumpDepartment");
          var department = new Department();
          department.id = this.form.client;
          pumpclient.set("department", department);
          var Department1 = Parse.Object.extend("PumpDepartment");
          var department1 = new Department1();
          department1.id = this.form.laboratory;
          pumpclient.set("laboratory", department1);
          var Testbed = Parse.Object.extend("Testbed");
          var testbed = new Testbed();
          testbed.id = this.form.bedname;
          pumpclient.set("test_bed", testbed);
          pumpclient.set("lab", this.laboratoryname);
          pumpclient.set("detection_unit", this.departmentname);
          pumpclient.set("standard", this.standard);
          pumpclient.set("pump_id", this.form.inspection_number);
          pumpclient.set("province", province);
          pumpclient.set("city", city);
          pumpclient.set("datas", this.form.reportmodule);
          pumpclient.set("district", discrict);
          pumpclient.set("test_time", this.form.endtime / 1000);
          pumpclient.set("internal_num", this.testbedname);
          pumpclient.set("addr", this.form.addr);
          pumpclient.set("factory", this.form.entrust);
          pumpclient.set("entrust_phone", this.form.entrustphone);
          pumpclient.set("pump_model", this.form.model);
          pumpclient.set("pump_type", this.form.checktype);
          pumpclient.set("pump_use", this.form.usetype);
          pumpclient.save().then(
            resultes => {
              if (this.pumpclientid == "") {
                var Report = Parse.Object.extend("Report");
                var report = new Parse.Query(Report);
                report.id = this.standard;
                report.get(this.standard).then(res => {
                  var userId = Parse.User.current().id;
                  var arr = [];
                  res.attributes.product.map(item => {
                    arr.push(
                      new Promise((resolve, reject) => {
                        return $.ajax({
                          type: "GET",
                          contentType: "application/json",
                          dataType: "json",
                          headers: {
                            sessionToken: Cookies.get("access_token")
                          },
                          url:
                            Cookies.get("apiserver") +
                            "/classes/Product/" +
                            item,
                          success: response => {
                            if (response) {
                              var _this = this;
                              var appid = Cookies.get("appids");
                              var ACL = {
                                key: {}
                              };
                              for (var key in ACL) {
                                key = "role:" + Cookies.get("appids");
                                ACL[key] = {
                                  read: true,
                                  write: true
                                };
                              }
                              delete ACL.key;
                              $.ajax({
                                type: "POST",
                                dataType: "json",
                                contentType: "application/json",
                                headers: {
                                  sessionToken: Cookies.get("access_token")
                                },
                                data: JSON.stringify({
                                  ACL: ACL,
                                  basedata: response.config,
                                  status: resultes.id,
                                  devaddr: _this.form.bedname,
                                  name: _this.standard
                                }),
                                url:
                                  Cookies.get("apiserver") + "/classes/Device",
                                success: result => {
                                  resolve(result);
                                },
                                fail: error => {
                                  reject(error);
                                }
                              });
                            }
                          }
                        });
                      })
                    );
                    Promise.all(arr)
                      .then(data => {
                        if (data.length == res.attributes.product.length) {
                          this.$message({
                            message: "添加成功",
                            type: "success"
                          });
                          this.pumpclientid = "";
                          this.taskdialog = false;
                          this.getTasktable();
                        }
                      })
                      .catch(error => {
                        this.$message({
                          message: error,
                          type: "error"
                        });
                      });
                  });
                });
              } else {
                this.pumpclientid = "";
                this.taskdialog = false;
                this.getTasktable();
              }
            },
            error => {
              returnLogin(error);
            }
          );
        }
      });
    },
    //检验标准选择事件
    changeReport(val) {},
    //编辑任务
    editorClient(id) {
      this.$nextTick(() => {
        this.form.usetype = "";
        this.form.checktype = "";
        this.form.addr = [];
        this.form.entrustphone = "";
        this.form.entrust = "";
        this.form.inspection_number = "";
        this.form.model = "";
        this.form.endtime = "";
        this.form.client = "";
        this.form.laboratory = "";
        this.form.region = "";
        this.form.bedname = "";
      });
      this.pumpclientid = id;
      var PumpClient = Parse.Object.extend("PumpClient");
      var pumpclient = new Parse.Query(PumpClient);
      pumpclient.get(id).then(
        response => {
          this.taskdialog = true;
          this.form.reportmodule = response.attributes.datas;
          this.form.region = response.attributes.standard;
          this.standard = response.attributes.standard;
          this.form.usetype = response.attributes.pump_use;
          this.form.checktype = response.attributes.pump_type;
          this.form.addr = response.attributes.addr;
          this.form.entrustphone = response.attributes.entrust_phone;
          this.form.entrust = response.attributes.factory;
          this.form.inspection_number = response.attributes.pump_id;
          this.form.model = response.attributes.pump_model;
          this.form.endtime = response.attributes.test_time * 1000;
          this.form.client = response.attributes.department.id;
          this.form.laboratory = response.attributes.laboratory.id;
          this.pumpDepartmentSelect(
            response.attributes.department.id,
            response.attributes.laboratory.id,
            response.attributes.test_bed.id
          );
          this.form.bedname = response.attributes.test_bed.id;
          this.handleModChange(response.attributes.addr);
        },
        error => {
          returnLogin(error);
        }
      );
    },
    derive(reportId) {
      deriveReport(reportId).then(res => {});
    },
    //时间校验
    enddata() {
      if (this.formInline.endtime <= this.formInline.starttime) {
        this.$message.warning("任务结束时间要小于开始时间");
        this.formInline.endtime = "";
      }
      if (this.formInline.endtime < Date.now() - 2000) {
        this.$message.warning("任务结束时间要大于当前时间");
        this.formInline.endtime = "";
      }
    },
    testdata() {
      if (
        this.formInline.endtime <= this.formInline.starttime &&
        this.formInline.endtime != "" &&
        this.formInline.endtime != null
      ) {
        this.$message.warning("任务开始时间要小于结束时间");
        this.formInline.starttime = "";
      }
      if (this.formInline.starttime < Date.now() - 2000) {
        this.$message.warning("任务开始时间要大于当前时间");
        this.formInline.starttime = "";
      }
    },
    deleteClient(id) {
      this.$confirm("此操作将永久删除该测试任务, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var PumpClient = Parse.Object.extend("PumpClient");
          var pumpclient = new PumpClient();
          pumpclient.id = id;
          pumpclient.destroy().then(resultes => {
            if (resultes) {
              var arr = [];
              var where = {
                  status:id
                }
              $.ajax({
                type: "GET",
                contentType: "application/json",
                dataType: "json",
                headers: {
                  sessionToken: Cookies.get("access_token")
                },
                data: {
                  where:JSON.stringify(where)
                },
                url: Cookies.get("apiserver") + "/classes/Device",
                success: response => {
                  if (response) {
                    console.log(response)
                    response.results.map(item => {
                      arr.push(
                        new Promise((resolve, reject) => {
                          return $.ajax({
                            type: "DELETE",
                            contentType: "application/json",
                            dataType: "json",
                            headers: {
                              sessionToken: Cookies.get("access_token")
                            },
                            url:
                              Cookies.get("apiserver") +
                              "/classes/Device/" +
                              item.objectId,
                            success: response => {
                              if (response) {
                                resolve(response);
                              }
                            },
                            fail: error => {
                              reject(error);
                            }
                          });
                        })
                      );
                      Promise.all(arr)
                        .then(data => {
                          if (data.length == response.results.length) {
                            this.$message.success("删除成功");
                            this.getTasktable();
                          }
                        })
                        .catch(error => {
                          this.$message({
                            message: error,
                            type: "error"
                          });
                        });
                    });
                  }
                }
              })
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    clientView(row,index) {
      var vm = this;

/*       $.ajax({
            type: "GET",
            dataType: "json",
            contentType: "application/json",
            headers: {
              sessionToken: Cookies.get("access_token")
            },
            data: {
            order:'basedata.index',
            where:JSON.stringify(where)
            },
            url:Cookies.get("apiserver") + "/classes/Device",
            success: resultes => {
              console.log(resultes)
              window.open(
                `${window.location.origin}/spa/#/fullscreen?standard=${row.attributes.standard}&pumpclient=${row.id}&devicesid=${resultes.results[0].objectId}`,
                "_blank"
              );
            },
            fail: error => {
              
            }
          });
 */

      let url = '/classes/Device/'
      let where= {
        status:row.id
      }
      // #### 临时url,注意删除
      // let topoUrl= 'http://192.168.2.18:8888'
      let topoUrl= window.location.origin + '/spa'

      vm.$axiosWen.get(url,{
          params:{                
            order:'basedata.index',
            where:JSON.stringify(where)
              }})
            .then(function (response) {
                  if(response){
                  window.open(
                    `${topoUrl}/#/fullscreen?standard=${row.attributes.standard}&pumpclient=${row.id}&devicesid=${response.results[0].objectId}&index=${index}`,
                    "_blank"
                  );
              }               
            })
            .catch(function (error) {
              console.log('Device err',error);
            })


    },
    evidenceView(row){
      this.$router.push({
        path:'/inspection/evidence_detail',
        query:{
          taskid:row.id
        }
      })
    }
  }
};
</script>
<style scope>
.inspection {
  width: 100%;
  min-height: 875px;
  padding: 20px;
  box-sizing: border-box;
  background-size: cover;
}
</style>
<style>
/* .inspection .el-table th.is-leaf {
  background-color: #00587e;
  color: #ffffff;
}
.inspection .el-table--striped .el-table__body tr.el-table__row--striped td {
  background-color: #08263e;
  color: #419ba5;
}
.inspection td {
  background-color: #08263e;
  color: #419ba5;
}
.inspection .el-table__empty-block {
  background: #08263e;
} */
.inspection .el-select {
  width: 100%;
}
.inspection .el-date-editor.el-input {
  width: 100%;
}
.inspection .el-form--inline .el-date-editor.el-input {
  width: 100%;
}
.inspection .el-cascader {
  width: 100%;
}
.inspection .el-divider__text.is-left {
  color: blue;
  font-size: 16px;
}
 
@media screen and (max-width: 1350px) {
  .inspection .el-col {
    width: 100%;
  }
}
</style>