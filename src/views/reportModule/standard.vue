<template>
  <div class="standard">
    <div style="padding:20px;" class="devicesright">
      <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
        <el-form-item label="标准类型">
          <el-select v-model="formInline.model" placeholder="选择标准类型">
            <el-option label="性能检测" value="性能检测"/>
          </el-select>
        </el-form-item>
        <el-form-item label="标准类别">
          <el-select v-model="formInline.standard" placeholder="选择标准类别">
            <el-option
              v-for="(item,index) in standard"
              :key="index"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="检测名称">
          <el-input v-model="formInline.name" placeholder="请输入检测名称"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="originReport(0)">查询</el-button>
          <el-button type="primary" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="adddevices">
        <el-button type="primary" size="small" @click="addStandard">新增检测标准</el-button>
        <!-- <el-button type="danger" size="small">删除</el-button> -->
      </div>
      <div class="tableblock">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"/>
          <el-table-column type="index" label="序号" align="center" width="50"/>
          <el-table-column label="检测标准名称" align="center" width="200">
            <template slot-scope="scope">{{ scope.row.attributes.data.name }}</template>
          </el-table-column>
          <el-table-column label="标准类型" width="250" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.attributes.data.model }}</span>
            </template>
          </el-table-column>
          <el-table-column label="适用产品" width="200" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.attributes.data.product }}</span>
            </template>
          </el-table-column>
          <el-table-column label="标准类别" width="200" align="center">
            <template slot-scope="scope">
              <span>{{ returnStandard(scope.row.attributes.data.standard) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="标准发行单位" width="250" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.attributes.data.client }}</span>
            </template>
          </el-table-column>
          <el-table-column label="标准发行时间" align="center" width="200">
            <template slot-scope="scope">
              <span>{{ timestampToTime(scope.row.attributes.data.start_time) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="备注" width="250" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.attributes.data.desc }}</span>
            </template>
          </el-table-column>
          <el-table-column label="系统创建时间" width="150" align="center">
            <template slot-scope="scope">
              <span>{{ utc2beijing(scope.row.createdAt) }}</span>
            </template>
          </el-table-column>

          <el-table-column label="检测标准管理" align="center" width="480">
            <template slot-scope="scope">
              <el-button size="small" icon="el-icon-edit" @click="editorReport(scope.row)">编辑</el-button>
              <el-button
                type="primary"
                size="small"
                icon="el-icon-circle-plus"
                @click="addChildReport(scope.row)"
              >子项新增</el-button>
              <router-link target="_blank" to="/pdf/download">
                <el-button type="success" size="small" icon="el-icon-share">下载</el-button>
              </router-link>
              <el-button
                type="info"
                size="small"
                icon="el-icon-star-off"
                @click="childManage(scope.row)"
              >子项管理</el-button>
              <el-button
                type="danger"
                size="small"
                icon="el-icon-delete"
                @click="deleteReport(scope.row.id)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pageblock">
        <el-pagination
          :page-sizes="[10, 20, 30, 50]"
          :page-size="pagesize"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <!--新增涉设备弹窗-->
    <el-dialog
      :title="message+'检验标准'"
      :visible.sync="dialogVisible"
      width="60%"

    >
      <div class="addContent">
        <el-form ref="reportform" :model="form" :rules="formrule">
          <el-row>
            <el-col :span="12">
              <el-form-item :label-width="formLabelWidth" label="检验标准名称" prop="name">
                <el-input v-model="form.name" autocomplete="off" placeholder="检验标准名称"/>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth" label="适用产品" prop="product">
                <el-select v-model="form.product" placeholder="选择适用产品">
                  <el-option
                    v-for="(item,index) in pumpmodel"
                    :label="item"
                    :value="item"
                    :key="index"
                  />
                </el-select>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth" label="标准类型" prop="model">
                <el-select v-model="form.model" placeholder="选择标准类型">
                  <el-option label="性能检测" value="性能检测"/>
                </el-select>
              </el-form-item>

              <el-form-item :label-width="formLabelWidth" label="备注信息">
                <el-input v-model="form.desc" :rows="4" type="textarea" placeholder="请输入标准备注信息"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label-width="formLabelWidth" label="检测标准文号" prop="inspection_number">
                <el-input
                  v-model="form.inspection_number"
                  autocomplete="off"
                  placeholder="请输入检测标准文号"
                />
              </el-form-item>
              <el-form-item :label-width="formLabelWidth" label="标准类别" prop="standard">
                <el-select v-model="form.standard" placeholder="选择标准类别">
                  <el-option
                    v-for="(item,index) in standard"
                    :key="index"
                    :value="item.value"
                    :label="item.label"
                  />
                </el-select>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth" label="标准发行单位" prop="client">
                <el-input v-model="form.client" autocomplete="off" placeholder="请输入标准发行单位"/>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth" label="标准发行时间">
                <el-date-picker
                  v-model="form.start_time"
                  type="date"
                  value-format="timestamp"
                  placeholder="选择日期"
                />
              </el-form-item>
              <el-form-item :label-width="formLabelWidth" label="标准源文件" required>
                <el-input v-loading="loading" v-model="form.filesrc" placeholder="请输入内容">
                  <template slot="append">
                    <el-button size="small" type="primary" >点击上传</el-button>
                    <form
                      ref="uploadform"
                      method="POST"
                      enctype="multipart/form-data"
                      style="position: absolute"
                    >
                      <input
                        type="file"
                        style="position:relative;top:-30px; opacity:0;z-index:5;height:40px;width:100px;cursor:pointer"
                        @change="upload($event)"
                      >
                    </form>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addReportModule('reportform')">确 定</el-button>
      </span>
    </el-dialog>
    <!--标准子项新增弹窗-->
    <el-dialog :visible.sync="dialogReport" title="标准子项新增" width="50%">
      <el-form
        ref="dynamicValidateForm"
        :model="dynamicValidateForm"
        label-width="100px"
        class="demo-dynamic"
        size="small"
      >
        <el-row v-for="(domain, index) in dynamicValidateForm.domains" :key="domain.key">
          <el-col :span="10">
            <el-form-item
              :label="'子项名称' + (index+1)"
              :prop="'domains.' + index + '.name'"
              :rules="{
                required: true, message: `子项目名称${index+1}不能为空`, trigger: 'blur'
              }"
            >
              <el-input v-model="domain.name"/>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item
              :label="'保证值' + (index+1)"
              :prop="'domains.' + index + '.title'"
              :rules="{
                required: true, message: `保证值${index+1}不能为空`, trigger: 'blur'
              }"
            >
              <el-input v-model="domain.title"/>
            </el-form-item>
          </el-col>
          <el-col :span="4" style="float:right">
            <el-button
              style="margin-left:5px;"
              size="small"
              type="danger"
              @click.prevent="removeDomain(domain)"
            >删除</el-button>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button @click="addDomain">新增子项</el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogReport=false">取 消</el-button>
        <el-button type="primary" @click="reportChildren('dynamicValidateForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!--子项管理弹窗-->
    <el-dialog :visible.sync="dialogTableVisible" title="标准子项管理" width="50%">
      <el-table
        :data="childrenData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        style="width:100%;text-align:center"
      >
        <el-table-column
          :index="(index)=>{return (index+1) + (currentPage-1)*pageSize}"
          label="序号"
          type="index"
          align="center"
          width="50"
        />
        <el-table-column prop="name" label="名称" align="center"/>
        <el-table-column prop="title" label="保证值" align="center"/>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="danger" size="small" @click="deleteChildren(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="margin-top:15px;">
        <el-pagination
          :page-sizes="[1,5,10,20]"
          :page-size="pageSize"
          :total="childrenData.length"
          align="center"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleChildSizeChange"
          @current-change="handleChildCurrentChange"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="ReportChildrenDelete">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Parse from 'parse'
import { returnLogin } from '@/utils/return'
import { addReport } from '@/api/reportmodule/reportmodule'
import Cookies from 'js-cookie'
var reportChildrenList = []
var formData = {}
export default {
  data() {
    return {
      loading: false,
      // 子项表格弹窗
      dialogTableVisible: false,
      // 弹窗新增编辑
      dialogReport: false,
      pumpmodel: [
        '离心泵',
        '潜水泵',
        '混流泵',
        '螺杆泵',
        '轴流泵',
        '旋涡泵',
        '电动泵',
        '蒸汽泵',
        '齿轮泵',
        '罗茨泵',
        '滑片泵',
        '喷射泵',
        '升液泵',
        '电磁泵'
      ],
      standard: [
        { label: '国际标准', value: 'ITBZ' },
        { label: '国家标准', value: 'GJBZ' },
        { label: '行业标准', value: 'HYBZ' },
        { label: '企业标准', value: 'QYBZ' },
        { label: '地方标准', value: 'DFBZ' },
        { label: '其他标准', value: 'OTHER' }
      ],
      formLabelWidth: '120px',
      dialogVisible: false,
      departmentid: '',
      formInline: {
        name: '',
        standard: '',
        model: ''
      },
      // 取证设备表格
      tableData: [],
      multipleSelection: [],
      pagesize: 10,
      start: 0,
      total: 0,
      message: '新增',
      form: {
        name: '',
        product: '',
        inspection_number: '',
        standard: '',
        start_time: '',
        model: '',
        filesrc: '',
        desc: '',
        client: '',
        reportchildren: []
      },
      formrule: {
        name: [
          { required: true, message: '请输入检测标准名称', trigger: 'blur' }
        ],
        product: [
          { required: true, message: '请选择标准适用产品', trigger: 'change' }
        ],
        inspection_number: [
          { required: true, message: '请输入检测标准文号', trigger: 'blur' }
        ],
        standard: [
          { required: true, message: '请选择标准类别', trigger: 'change' }
        ],
        client: [
          { required: true, message: '请输入检测标准发行单位', trigger: 'blur' }
        ],
        model: [
          { required: true, message: '请选择标准类型', trigger: 'change' }
        ]
      },
      // 弹窗关联的三个列表
      departmentlaboratory: [],
      testbedlist: [],
      productlist: [],
      // 子项表单
      dynamicValidateForm: {
        domains: [
          {
            title: '',
            key: Date.now(),
            value: '',
            name: '',
            evidenceway: '',
            assess: ''
          }
        ]
      },
      childrenData: [],
      currentPage: 1, // 当前页码
      pageSize: 10 // 每页的数据条数
    }
  },
  watch: {
    dialogVisible: {
      deep: true,
      handler(val) {
        console.log(val)
        if (!val) {
          this.$refs.reportform.resetFields()
          this.form.desc = ''
          this.form.start_time = ''
          this.form.filesrc = ''
          this.form.name = ''
          this.form.product = '';
          (this.form.inspection_number = ''),
          (this.form.standard = ''),
          (this.form.model = ''),
          (this.form.client = ''),
          (this.form.reportchildren = [])
        }
      }
    }
  },
  mounted() {
    this.originReport()
  },
  methods: {
    // 子项表格
    handleChildSizeChange(val) {
      this.currentPage = 1
      this.pageSize = val
    },
    handleChildCurrentChange(val) {
      this.currentPage = val
    },
    returnStandard(val) {
      var string = ''
      this.standard.map(item => {
        if (item.value == val) {
          string = item.label
        }
      })
      return string
    },
    timestampToTime(timestamp) {
      var date = new Date(timestamp)
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
      return Y + M + D
    },
    utc2beijing(utc_datetime) {
      // 转为正常的时间格式 年-月-日 时:分:秒
      var date = new Date(+new Date(utc_datetime) + 8 * 3600 * 1000)
        .toISOString()
        .replace(/T/g, ' ')
        .replace(/\.[\d]{3}Z/, '')
      return date // 2017-03-31 16:02:06
    },
    // 重置
    reset() {
      this.formInline.model = ''
      this.formInline.standard = ''
      this.formInline.name = ''
      this.originReport()
    },
    originReport(start) {
      if (start == 0) {
        this.start = 0
      }
      var InspectionStandard = Parse.Object.extend('InspectionStandard')
      var reportmodule = new Parse.Query(InspectionStandard)
      reportmodule.skip(this.start)
      reportmodule.limit(this.pagesize)
      reportmodule.equalTo('type', 'pump_report')
      if (this.formInline.name != '') {
        reportmodule.equalTo('data.name', this.formInline.name)
      }
      if (this.formInline.standard != '') {
        reportmodule.equalTo('data.standard', this.formInline.standard)
      }
      if (this.formInline.model != '') {
        reportmodule.equalTo('data.model', this.formInline.model)
      }
      reportmodule.ascending('-updatedAt')
      reportmodule.count().then(
        count => {
          this.total = count
          reportmodule.find().then(
            response => {
              this.tableData = response
            },
            error => {
              returnLogin(error)
            }
          )
        },
        error => {
          returnLogin(error)
        }
      )
    },
    // 表格多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 分页操作
    handleSizeChange(val) {
      this.pagesize = val
    },
    handleCurrentChange(val) {
      this.start = (val - 1) * this.pagesize
    },
    // 增加设备弹窗
    addStandard(istrue) {
      this.reportid = ''
      this.dialogVisible = true
    },
    upload(event) {
      if (event) {
        var file = event.target.files[0] // name: "dangqi1.png" || type: "image/png"
        var name = file.name
        var testmsg = event.target.files[0].type
        var type = file.type.split('/')[0]
        var extension = testmsg === 'application/pdf'
        if (!extension) {
          // 将图片img转化为base64
          this.$message({
            message: '只能上传PDF格式文件',
            type: 'error'
          })
          return false // 必须加上return false; 才能阻止
        } else {
          this.loading = true
          var reader = new FileReader()
          reader.readAsDataURL(file)
          var that = this
          reader.onloadend = function() {
            var dataURL = reader.result
            var blob = that.dataURItoBlob(dataURL)
            that.uploadFile(blob, name) // 执行上传接口
          }
        }
      }
    },
    dataURItoBlob(dataURI) {
      // base64 解码
      var byteString = atob(dataURI.split(',')[1])
      var mimeString = dataURI
        .split(',')[0]
        .split(':')[1]
        .split(';')[0]
      var ab = new ArrayBuffer(byteString.length)
      var ia = new Uint8Array(ab)
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
      }
      return new Blob([ab], { type: mimeString })
    },
    uploadFile(imgUrl, name) {
      var formdata = new FormData()
      formdata.append('file', imgUrl, name)
      formdata.append('output', 'json')
      formdata.append('path', Cookies.get('appids'))
      formdata.append('scene', Cookies.get('appids'))
      formdata.append('auth_token', Cookies.get('access_token')) // 下面是要传递的参数
      // 此处必须设置为  multipart/form-data
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data' // 之前说的以表单传数据的格式来传递fromdata
        }
      }
      this.$http
        .post(Cookies.get('fileserver'), formdata)
        .then(res => {
          if (res) {
            this.loading = false
            this.form.filesrc = res.body.url
          }
        })
        .catch(error => {
          this.loading = false
          this.$message(error)
        })
    },
    addReportModule(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.form.filesrc == '') {
            this.$message('请上传检验标准PDF文件')
            return
          }
          var InspectionStandard = Parse.Object.extend('InspectionStandard')
          var reportmodule = new InspectionStandard()
          var acl = new Parse.ACL()
          if (this.reportid != '') {
            datas.id = this.reportid
            this.message = '编辑'
          }
          acl.setWriteAccess(Parse.User.current().id, true)
          acl.setReadAccess(Parse.User.current().id, true)
          reportmodule.set('data', this.form)
          reportmodule.set('type', 'pump_report')
          reportmodule.save().then(
            response => {
              this.$message({
                type: 'success',
                message: `${this.message}成功`
              })
              this.form.name = ''

              this.dialogVisible = false
              this.originReport()
              this.$refs.reportform.resetFields()
              this.reportid = ''
            },
            error => {
              returnLogin(error)
            }
          )
        } else {
          this.$message('有必填项未填写')
          return false
        }
      })
    },
    // 编辑检测标准
    editorReport(row) {
      this.dialogVisible = true
      this.reportid = row.id;
      (this.form.name = row.attributes.data.name),
      (this.form.product = row.attributes.data.product),
      (this.form.inspection_number = row.attributes.data.inspection_number),
      (this.form.standard = row.attributes.data.standard),
      (this.form.start_time = row.attributes.data.start_time),
      (this.form.model = row.attributes.data.model),
      (this.form.filesrc = row.attributes.data.filesrc),
      (this.form.desc = row.attributes.data.desc),
      (this.form.client = row.attributes.data.client),
      (this.form.reportchildren = row.attributes.data.reportchildren)
    },
    deleteReport(id) {
      this.$confirm('此操作将永久此检测标准, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      })
        .then(() => {
          var ReportModule = Parse.Object.extend('ReportModule')
          var reportmodule = new ReportModule()
          reportmodule.id = id
          reportmodule.destroy().then(
            response => {
              if (response) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.originReport()
              }
            },
            error => {
              returnLogin(error)
            }
          )
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 动态增加表单
    addDomain() {
      this.dynamicValidateForm.domains.push({
        title: '',
        key: Date.now(),
        value: '',
        name: '',
        evidenceway: '',
        assess: ''
      })
    },
    removeDomain(item) {
      var index = this.dynamicValidateForm.domains.indexOf(item)
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1)
      }
    },
    addChildReport(row) {
      this.dialogReport = true
      this.reportid = row.id;
      (this.form.name = row.attributes.data.name),
      (this.form.product = row.attributes.data.product),
      (this.form.inspection_number = row.attributes.data.inspection_number),
      (this.form.standard = row.attributes.data.standard),
      (this.form.start_time = row.attributes.data.start_time),
      (this.form.model = row.attributes.data.model),
      (this.form.filesrc = row.attributes.data.filesrc),
      (this.form.desc = row.attributes.data.desc),
      (this.form.client = row.attributes.data.client),
      (this.form.reportchildren = row.attributes.data.reportchildren)
    },
    reportChildren(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var InspectionStandard = Parse.Object.extend('InspectionStandard')
          var reportmodule = new InspectionStandard()
          reportmodule.id = this.reportid
          this.form.reportchildren = this.form.reportchildren.concat(
            this.dynamicValidateForm.domains
          )
          reportmodule.set('data', this.form)
          reportmodule.save().then(resultes => {
            this.$message('新增成功')
            this.dialogReport = false
            this.dynamicValidateForm.domains = [
              {
                title: '',
                key: Date.now(),
                value: '',
                name: '',
                evidenceway: '',
                assess: ''
              }
            ]
          })
        } else {
          this.$message('请填写完整')
          return false
        }
      })
    },
    // 子项管理
    childManage(row) {
      this.childrenData = row.attributes.data.reportchildren.concat([]);
      (formData.name = row.attributes.data.name),
      (formData.product = row.attributes.data.product),
      (formData.inspection_number = row.attributes.data.inspection_number),
      (formData.standard = row.attributes.data.standard),
      (formData.start_time = row.attributes.data.start_time),
      (formData.model = row.attributes.data.model),
      (formData.filesrc = row.attributes.data.filesrc),
      (formData.desc = row.attributes.data.desc),
      (formData.client = row.attributes.data.client),
      (formData.reportchildren = row.attributes.data.reportchildren)
      this.dialogTableVisible = true
      this.reportid = row.id
    },
    // 删除子项
    deleteChildren(index) {
      this.childrenData.splice(
        index + (this.currentPage - 1) * this.pageSize,
        1
      )
    },
    // 删除确认
    ReportChildrenDelete() {
      this.$confirm('是否删除标准子项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          var InspectionStandard = Parse.Object.extend('InspectionStandard')
          var reportmodule = new InspectionStandard()
          reportmodule.id = this.reportid
          formData.reportchildren = this.childrenData
          reportmodule.set('data', formData)
          reportmodule.save().then(
            resultes => {
              if (resultes) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.dialogTableVisible = false
                this.originReport()
                this.required = ''
              }
            },
            error => {
              returnLogin(error)
            }
          )
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.standard {
  width: 100%;
  min-height: 875px;
  /* padding: 20px; */
  box-sizing: border-box;
  /* background: url("../../imgages/echartbanner1.png") no-repeat; */
  /* background-size: cover; */
  //   display: flex;
  /* overflow: scroll; */
  .devicesright {
    .tableblock {
      margin-top: 20px;
    }
  }
  .pageblock {
    margin-top: 20px;
  }
  /deep/ .el-dialog__body {
    /deep/ .el-select {
      width: 100%;
    }
    /deep/ .el-date-editor {
      width: 100%;
    }
  }
  /deep/ .el-upload-list {
    display: none;
  }

    /deep/ .el-col {
      @media screen and (max-width: 1350px) {
        width: 100%;
      }
  }
}
</style>
