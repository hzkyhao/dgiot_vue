<template>
  <div class="personpump">
    <h3>个人资质审核</h3>
    <div class="empower_top">
      <el-form
        :inline="true"
        :model="formInline"
        class="demo-form-inline"
        size="small"
        label-width="100px"
      >
        <el-form-item label="审核状态">
          <el-select v-model="formInline.status" placeholder="审核状态">
            <el-option label="全部" value="all"></el-option>
            <el-option label="待审核" value="Pending"></el-option>
            <el-option label="审核中" value="Auditing"></el-option>
            <el-option label="审核通过" value="Pass"></el-option>
            <el-option label="审核未通过" value="Failed"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请开始时间">
          <el-date-picker v-model="formInline.starttime" type="datetime" placeholder="选择开始时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker v-model="formInline.endtime" type="datetime" placeholder="选择结束时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="企业名称">
          <el-input v-model="formInline.name" placeholder="请输入企业名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="personEmpower">查询</el-button>
          <el-button type="primary">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="button_group">
        <el-row>
          <el-button type="success" size="small">审核</el-button>
          <el-button type="success" size="small">提交</el-button>
          <el-button type="success" size="small">驳回</el-button>
        </el-row>
      </div>
      <div class="block_table">
        <el-table :data="tableData" stripe style="width: 100%;text-align:center" border>
          <el-table-column label="序号" width="50" type="index" align="center"></el-table-column>
          <el-table-column label="企业名称" width="180" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.attributes.department.attributes.name}}</span>
            </template>
          </el-table-column>
          <el-table-column label="姓名" width="180" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.attributes.name}}</span>
            </template>
          </el-table-column>
          <el-table-column label="企业职务" width="100" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.attributes.job}}</span>
            </template>
          </el-table-column>
          <el-table-column label="出生日期" width="100" align="center">
            <template slot-scope="scope">
              <span>{{timestampToTime(scope.row.attributes.birthday).substring(0,11)}}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="政治面貌" width="100" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.attributes.politic_status}}</span>
            </template>
          </el-table-column> -->
          <el-table-column label="最高学历" width="100" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.attributes.education}}</span>
            </template>
          </el-table-column>
          <el-table-column label="主修专业" width="200" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.attributes.professional}}</span>
            </template>
          </el-table-column>
          <el-table-column label="个人职称" width="150" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.attributes.positional_titles}}</span>
            </template>
          </el-table-column>
          <el-table-column label="联系方式" width="200" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.attributes.userphone}}</span>
            </template>
          </el-table-column>
          <el-table-column label="从业时间" width="100" align="center">
            <template slot-scope="scope">
              <span>{{timestampToTime(scope.row.attributes.start_time).substring(0,11)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="申请时间" width="200" align="center">
            <template slot-scope="scope">
              <span>{{utc2beijing(scope.row.createdAt)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="最新审核日期" width="200" align="center">
            <template slot-scope="scope">
              <span
                v-if="scope.row.attributes.auditDate"
              >{{timestampToTime(scope.row.attributes.auditDate).substring(0,10)}}</span>
              <span v-else></span>
            </template>
          </el-table-column>
          <el-table-column label="审核状态" width="150" align="center">
            <template slot-scope="scope">
              <el-tag type="info" v-if="scope.row.attributes.status=='Pending'">待审核</el-tag>
              <el-tag type="success" v-else-if="scope.row.attributes.status=='Pass'">审核通过</el-tag>
              <el-tag type="danger" v-else-if="scope.row.attributes.status=='Failed'">审核未通过</el-tag>
              <el-tag type="primary" v-else>审核中</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="审核意见" width="200" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.attributes.suggestion">{{scope.row.attributes.suggestion}}</span>
              <span v-else></span>
            </template>
          </el-table-column>
          <el-table-column label="审核管理" width="150" align="center">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="lookUp(scope.row.id)">查看</el-button>
              <el-button type="success" size="small" @click="examine(scope.row.id)">审核</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="block_page">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <el-dialog title="个人资质审核" :visible.sync="dialogFormVisible" width="80%">
      <el-form ref="powerform" :model="powerform" label-width="120px" :rules="powerrules">
        <el-row>
          <!--左侧-->
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="powerform.name" placeholder="请输入姓名" readonly></el-input>
            </el-form-item>
            <el-form-item label="出生日期" prop="birthday">
              <el-date-picker
                readonly
                v-model="powerform.birthday"
                type="date"
                placeholder="选择出生日期"
                value-format="timestamp"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="最高学历">
              <el-select v-model="powerform.education" placeholder="请选择最高学历" disabled>
                <el-option
                  v-for="(item,index) in positional"
                  :label="item"
                  :value="item"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="个人职称" prop="positional_titles">
              <el-input v-model="powerform.positional_titles" placeholder="请输入个人职称" readonly></el-input>
            </el-form-item>
            <el-form-item label="身份证正反面" required>
              <el-col :span="11">
                <el-upload
                  class="avatar-uploader"
                  action="/iotapi/upload"
                  :show-file-list="false"
                  :on-success="handleFrontSuccess"
                  :before-upload="beforeAvatarUpload"
                >
                  <img v-if="powerform.frontimageUrl" :src="powerform.frontimageUrl" class="avatar" />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  <div
                    class="el-upload__text"
                    style="position:absolute;top:90px;color:#8c939d;
                      left:110px;"
                    v-show="powerform.frontimageUrl==''"
                  >正面</div>
                </el-upload>
              </el-col>
              <el-col class="line" :span="2"></el-col>
              <el-col :span="11" style="position:relative">
                <el-upload
                  class="avatar-uploader"
                  action="/iotapi/upload"
                  :show-file-list="false"
                  :on-success="handleContrarySuccess"
                  :before-upload="beforeAvatarUpload"
                >
                  <img
                    v-if="powerform.contraryimageUrl"
                    :src="powerform.contraryimageUrl"
                    class="avatar"
                  />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  <div
                    class="el-upload__text"
                    style="position:absolute;top:90px;color:#8c939d;
                      left:110px;"
                    v-show="powerform.contraryimageUrl==''"
                  >反面</div>
                </el-upload>
              </el-col>
            </el-form-item>
          </el-col>
          <!--右侧-->
          <el-col :span="12">
            <el-form-item label="企业职务" prop="job">
              <el-input v-model="powerform.job" readonly></el-input>
            </el-form-item>
            <!-- <el-form-item label="政治面貌" prop="politic_status">
              <el-select v-model="powerform.politic_status" placeholder="请选择政治面貌" disabled>
                <el-option label="党员" value="党员"></el-option>
                <el-option label="共青团员" value="共青团员"></el-option>
                <el-option label="群众" value="群众"></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="毕业院校">
              <el-input v-model="powerform.graduate_institutions" placeholder="请输入毕业院校" readonly></el-input>
            </el-form-item>
            <el-form-item label="主修专业" prop="professional">
              <el-input v-model="powerform.professional" placeholder="请输入主修专业" readonly></el-input>
            </el-form-item>
            <el-form-item label="身份证编号" prop="identity">
              <el-input v-model="powerform.identity" placeholder="请输入身份证编号" readonly></el-input>
            </el-form-item>
            <el-form-item label="职业资质" required>
              <el-upload
                class="avatar-uploader"
                action="/iotapi/upload"
                :show-file-list="false"
                :on-success="handleJobSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="powerform.joblicense" :src="powerform.joblicense" class="avatar" />
                <i
                  v-else
                  class="el-icon-plus avatar-uploader-icon"
                  style="width:300px;height:200px"
                ></i>
                <div
                  class="el-upload__text"
                  style="position:absolute;top:90px;color:#8c939d;
                      left:120px;"
                  v-show="powerform.joblicense==''"
                >职业资质</div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="家庭地址">
              <el-cascader
                readonly
                size="large"
                :options="regionData"
                v-model="powerform.addr"
                @change="handleModChange"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="相关工作年限" prop="working_seniority">
              <el-select v-model="powerform.working_seniority" placeholder="请选择工作年限" disabled>
                <el-option label="1年以内" value="1"></el-option>
                <el-option label="1-3年" value="2"></el-option>
                <el-option label="3-5年" value="3"></el-option>
                <el-option label="5-10年" value="4"></el-option>
                <el-option label="10年以上" value="5"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="培训经历">
              <el-input
                type="textarea"
                placeholder="请输入培训经历"
                v-model="powerform.training_experience"
                maxlength="300"
                :rows="4"
                show-word-limit
                readonly
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开始时间">
              <el-date-picker
                v-model="powerform.start_time"
                type="date"
                placeholder="选择开始时间"
                value-format="timestamp"
                readonly
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="联系方式" prop="userphone">
              <el-input v-model.number="powerform.userphone" placeholder="请输入联系方式" readonly></el-input>
            </el-form-item>
            <el-form-item label="相关从业经历" prop="practitioners_experience">
              <el-input
                type="textarea"
                placeholder="请输入个人水泵检测相关从业经历"
                v-model="powerform.practitioners_experience"
                :rows="4"
                readonly
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <!--审核弹窗-->
    <el-dialog title="认证审核" :visible.sync="dialogVisible" width="40%">
      <div>
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="审核状态" prop="status">
            <el-radio-group v-model="ruleForm.status">
              <el-radio label="Pending">待审核</el-radio>
              <el-radio label="Auditing">审核中</el-radio>
              <el-radio label="Failed">审核未通过</el-radio>
              <el-radio label="Pass">审核通过</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="审核意见" prop="suggestion">
            <el-input type="textarea" v-model="ruleForm.suggestion" :rows="4"></el-input>
          </el-form-item>
          <h3 style="border:1px solid #cccccc;height:40px;line-height:40px;padding-left:20px">U盾认证信息</h3>
          <el-row>
            <el-col :span="12">
              <el-form-item label="U盾序列号">
                <el-input v-model="ruleForm.unumber" placeholder="请输入U盾序列号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
               <el-form-item label="U盾KEY值">
                <el-input v-model="ruleForm.ukey" placeholder="请输入U盾KEY值"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { regionData, CodeToText } from "element-china-area-data";
import Parse from "parse";
import { returnLogin } from "@/utils/return";
export default {
  data() {
    const idrules = function(rule, value, callback) {
      var rules = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
      if (!rules.test(value)) {
        if (value.length != 18) {
          callback(new Error("请输入18位身份证号"));
        } else {
          callback(new Error("需要输入正确身份证号码"));
        }
      } else {
        callback();
      }
    };
    return {
      dialogVisible: false,
      dialogFormVisible: false,
      positional: ["大学专科", "大学本科", "硕士研究生", "博士研究生"],
      formInline: {
        name: "",
        status: "all",
        starttime: "",
        endtime: ""
      },
      tableData: [],
      pagesize: 10,
      start: 0,
      total: 0,
      regionData: regionData,
      powerform: {
        name: "",
        birthday: "",
        job: "",
        professional: "", //主修专业
        politic_status: "", //政治面貌
        education: "", //学历
        positional_titles: "", //个人职称
        identity: "", //身份证编号
        graduate_institutions: "", //毕业院校
        contraryimageUrl: "", //身份证反面
        frontimageUrl: "", //身份证正面
        joblicense: "", //职务资质
        addr: "", //家庭住址
        working_seniority: "", //相关工作年限
        training_experience: "", //培训经历
        start_time: "", //开始时间
        practitioners_experience: "", //从业经历
        userphone: "" //联系方式
      },
      powerrules: {
        name: [{ required: true, message: "请输入个人姓名", trigger: "blur" }],
        identity: [
          { required: true, message: "请输入正确身份证号", trigger: "blur" },
          { validator: idrules, trigger: "blur" }
        ],
        birthday: [
          {
            type: "date",
            required: true,
            message: "选择签发日期",
            trigger: "change"
          }
        ],
        job: [{ required: true, message: "请输入企业职务", trigger: "blur" }],
        politic_status: [
          { required: true, message: "请选择政治面貌", trigger: "change" }
        ],
        positional_titles: [
          { required: true, message: "请输入个人职称", trigger: "blur" }
        ],
        working_seniority: [
          { required: true, message: "请选择相关工作年限", trigger: "change" }
        ],
        practitioners_experience: [
          { required: true, message: "请输入相关工作经历", trigger: "change" }
        ],
        professional: [
          { required: true, message: "请输入主修专业", trigger: "blur" }
        ],
        userphone: [
          { required: true, message: "请输入联系方式", trigger: "blur" },
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
        ]
      },
      ruleForm: {
        status: "",
        suggestion: "",
        unumber:'',
        ukey:''
      },
      rules: {
        status: [
          { required: true, message: "请选择审核状态", trigger: "change" }
        ],
        suggestion: [
          { required: true, message: "请填写认证审核意见", trigger: "blur" }
        ],
        unumber: [
          { required: true, message: "请填写U盾序列号", trigger: "blur" }
        ],
        ukey: [
          { required: true, message: "请填写U盾KEY", trigger: "blur" }
        ]
      },
      personauthticationid: ""
    };
  },
  mounted() {
    this.personEmpower();
  },
  methods: {
    //时间戳处理
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
    utc2beijing(utc_datetime) {
      // 转为正常的时间格式 年-月-日 时:分:秒
      var date = new Date(+new Date(utc_datetime) + 8 * 3600 * 1000)
        .toISOString()
        .replace(/T/g, " ")
        .replace(/\.[\d]{3}Z/, "");
      return date; // 2017-03-31 16:02:06
    },
    personEmpower(start) {
      if (start == 0) {
        this.start = 0;
      }
      var PersonAuthtication = Parse.Object.extend("PersonAuthtication");
      var personauthtication = new Parse.Query(PersonAuthtication);
      if (this.formInline.status != "all") {
        personauthtication.equalTo("status", this.formInline.status);
      }
      personauthtication.include('department')
      personauthtication.ascending('- createdAt')
      personauthtication.skip(this.start);
      personauthtication.limit(this.pagesize);
      personauthtication.count().then(
        count => {
          this.total = count;
          personauthtication.find().then(
            response => {
              if (response) {
                console.log(response)
                this.tableData = response;
              }
            },
            error => {
              returnLogin(error);
            }
          );
        },
        error => {
          returnLogin(error);
        }
      );
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.personEmpower();
    },
    handleCurrentChange(val) {
      this.start = (val - 1) * this.pagesize;
      this.personEmpower();
    },
    lookUp(id) {
      var PersonAuthtication = Parse.Object.extend("PersonAuthtication");
      var personauthtication = new Parse.Query(PersonAuthtication);
      personauthtication.get(id).then(
        response => {
          if (response) {
            this.dialogFormVisible = true;
            this.powerform.name = response.attributes.name;
            this.powerform.birthday = response.attributes.birthday * 1000;
            this.powerform.job = response.attributes.job;
            this.powerform.professional = response.attributes.professional;
            // this.powerform.politic_status = response.attributes.politic_status;
            this.powerform.education = response.attributes.education;
            this.powerform.positional_titles =
              response.attributes.positional_titles;
            this.powerform.identity = response.attributes.identity;
            this.powerform.graduate_institutions =
              response.attributes.graduate_institutions;
            this.powerform.contraryimageUrl =
              response.attributes.contraryimageUrl;
            this.powerform.frontimageUrl = response.attributes.frontimageUrl;
            this.powerform.joblicense = response.attributes.joblicense;
            this.powerform.addr = response.attributes.addr;
            this.powerform.working_seniority =
              response.attributes.working_seniority;
            this.powerform.training_experience =
              response.attributes.training_experience;
            this.powerform.start_time = response.attributes.start_time * 1000;
            this.powerform.practitioners_experience =
              response.attributes.practitioners_experience;
            this.powerform.userphone = response.attributes.userphone;
          }
        },
        error => {
          returnLogin(error);
        }
      );
    },
    //审核
    examine(id) {
      this.personauthticationid = id;
      this.dialogVisible = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var nowtime = new Date().getTime();
          var PersonAuthtication = Parse.Object.extend("PersonAuthtication");
          var personauthtication = new PersonAuthtication();
          personauthtication.id = this.personauthticationid;
          personauthtication.set("status", this.ruleForm.status);
          personauthtication.set("unumber", this.ruleForm.unumber);
          personauthtication.set("ukey", this.ruleForm.ukey);
          personauthtication.set("suggestion", this.ruleForm.suggestion);
          personauthtication.set("auditDate", Math.floor(nowtime/1000));
          personauthtication.save().then(resultes => {
            if (resultes) {
              this.$refs[formName].resetFields();
              this.dialogVisible = false;
              this.personEmpower();
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.personpump {
  width: 100%;
  height: 100%;
  padding: 20px 20px 40px 20px;
  box-sizing: border-box;
  background: #ffffff;
  .empower_top {
    .block_table {
      margin-top: 20px;
    }
    .button_group {
      padding-left: 100px;
      box-sizing: border-box;
    }
    .block_page {
      margin-top: 20px;
    }
  }
}
</style>
<style>
.personpump .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.personpump.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.personpump .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 250px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.personpump .avatar {
  width: 250px;
  height: 178px;
  display: block;
}
.image-slot {
  font-size: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 250px;
  height: 250px;
  background: #f5f7fa;
  color: #909399;
}
.personpump .el-tabs__header {
  margin-top: 20px;
}
.personpump .el-select {
  width: 100%;
}
.personpump .el-cascader {
  width: 100%;
}

.personpump .el-select {
  width: 100%;
}
.personpump .el-date-editor {
  width: 100%;
}
</style>
