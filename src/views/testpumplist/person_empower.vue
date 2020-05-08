<template>
  <div class="person_empower">
    <el-steps :active="active" simple>
      <el-step title="1填写个人基本信息" icon="el-icon-upload"></el-step>
      <el-step title="2正在审核" icon="el-icon-s-unfold"></el-step>
      <el-step title="3审核结果" icon="el-icon-s-check"></el-step>
    </el-steps>
    <div class="empower1" v-if="active==1">
      <h3 style="border:1px solid #cccccc;height:40px;line-height:40px;padding-left:20px">个人资质认证</h3>
      <div class="empowerform">
        <el-form ref="powerform" :model="powerform" label-width="120px" :rules="powerrules">
          <el-row>
            <!--左侧-->
            <el-col :span="12">
              <el-form-item label="姓名" prop="name">
                <el-input v-model="powerform.name" placeholder="请输入姓名"></el-input>
              </el-form-item>
              <el-form-item label="出生日期" prop="birthday">
                <el-date-picker v-model="powerform.birthday" type="date" placeholder="选择出生日期"  value-format="timestamp"></el-date-picker>
              </el-form-item>
               <el-form-item label="毕业院校">
                <el-input v-model="powerform.graduate_institutions" placeholder="请输入毕业院校"></el-input>
              </el-form-item>
               <el-form-item label="身份证编号" prop="identity">
                <el-input v-model="powerform.identity" placeholder="请输入身份证编号"></el-input>
              </el-form-item>
              <el-form-item label="身份证正反面" required>
                <el-col :span="11">
                 <img v-if="powerform.frontimageUrl" :src="powerform.frontimageUrl" class="avatar" />
                      <i v-else class="el-icon-plus avatar-uploader-icon" ></i>
                        <form
                          method="POST"
                          enctype="multipart/form-data"
                          ref="uploadform"
                          style="position: absolute"
                        >
                          <input
                            type="file"
                            @change="upload($event,'front')"
                            style="position:relative;top:-200px; opacity:0;z-index:5;height:200px;width:200px;cursor:pointer"
                          />
                      </form>
                    <div
                      class="el-upload__text"
                      style="position:absolute;top:90px;color:#8c939d;
                      left:110px;"
                      v-show="powerform.frontimageUrl==''"
                    >正面</div>
                
                  <el-button
                    size="small"
                    type="danger"
                    style="position: absolute;left: 200px;top:150px;margin-left:0"
                    v-show="powerform.frontimageUrl!=''"
                    @click="powerform.frontimageUrl=''"
                  >删除</el-button>
                </el-col>
                <el-col class="line" :span="2"></el-col>
                <el-col :span="11" style="position:relative">
                  <img v-if="powerform.contraryimageUrl" :src="powerform.contraryimageUrl" class="avatar" />
                      <i v-else class="el-icon-plus avatar-uploader-icon" ></i>
                        <form
                          method="POST"
                          enctype="multipart/form-data"
                          ref="uploadform"
                          style="position: absolute"
                        >
                          <input
                            type="file"
                            @change="upload($event,'contrary')"
                            style="position:relative;top:-200px; opacity:0;z-index:5;height:200px;width:200px;cursor:pointer"
                          />
                      </form>
                    <div
                      class="el-upload__text"
                      style="position:absolute;top:90px;color:#8c939d;
                      left:110px;"
                      v-show="powerform.contraryimageUrl==''"
                    >反面</div>
                  
                  <el-button
                    size="small"
                    type="danger"
                    style="position: absolute;left:190px;top: 150px;margin-left:0"
                    v-show="powerform.contraryimageUrl!=''"
                    @click="powerform.contraryimageUrl=''"
                  >删除</el-button>
                </el-col>
              </el-form-item>
            </el-col>
            <!--右侧-->
            <el-col :span="12">
              <el-form-item label="企业职务" prop="job">
                <el-input v-model="powerform.job"></el-input>
              </el-form-item>
              <!-- <el-form-item label="政治面貌" prop="politic_status">
                <el-select v-model="powerform.politic_status" placeholder="请选择政治面貌">
                  <el-option label="党员" value="党员"></el-option>
                  <el-option label="共青团员" value="共青团员"></el-option>
                  <el-option label="群众" value="群众"></el-option>
                </el-select>
              </el-form-item> -->
              <el-form-item label="最高学历">
                <el-select v-model="powerform.education" placeholder="请选择最高学历">
                  <el-option v-for="(item,index) in positional" :label="item" :value="item" :key="index"></el-option>
                </el-select>
              </el-form-item>
             
              <el-form-item label="主修专业">
                  <el-input v-model="powerform.professional" placeholder="请输入主修专业"></el-input>
                
              </el-form-item>
              <el-form-item label="个人职称" prop="positional_titles">
                <el-input v-model="powerform.positional_titles" placeholder="请输入个人职称"></el-input>
              </el-form-item>
             
              <el-form-item label="职业资质" required>
               <img v-if="powerform.joblicense" :src="powerform.joblicense" class="avatar" />
                      <i v-else class="el-icon-plus avatar-uploader-icon" ></i>
                        <form
                          method="POST"
                          enctype="multipart/form-data"
                          ref="uploadform"
                          style="position: absolute"
                        >
                          <input
                            type="file"
                            @change="upload($event,'joblicense')"
                            style="position:relative;top:-200px; opacity:0;z-index:5;height:200px;width:200px;cursor:pointer"
                          />
                      </form>
                  <div
                    class="el-upload__text"
                    style="position:absolute;top:90px;color:#8c939d;
                      left:120px;"
                    v-show="powerform.joblicense==''"
                  >职业资质</div>
                <!-- </el-upload> -->
                <el-button
                  size="small"
                  type="danger"
                  style="position: absolute;left: 200px;top:150px;margin-left:0"
                  v-show="powerform.joblicense!=''"
                  @click="powerform.joblicense=''"
                >删除</el-button>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="家庭地址">
                <el-cascader
                  size="large"
                  :options="regionData"
                  v-model="powerform.addr"
                  @change="handleModChange"
                ></el-cascader>
              </el-form-item>
              <el-form-item label="相关工作年限" prop="working_seniority">
                <el-select v-model="powerform.working_seniority" placeholder="请选择工作年限">
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
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="开始时间">
                <el-date-picker v-model="powerform.start_time" type="date" placeholder="选择开始时间"  value-format="timestamp"></el-date-picker>
              </el-form-item>
              <el-form-item label="联系方式" prop="userphone">
                <el-input v-model.number="powerform.userphone" placeholder="请输入联系方式"></el-input>
              </el-form-item>
              <el-form-item label="相关从业经历" prop="practitioners_experience">
                <el-input
                  type="textarea"
                  placeholder="请输入个人水泵检测相关从业经历"
                  v-model="powerform.practitioners_experience"
                  :rows="4"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="activefirst">
        <el-button type="primary" @click="submitForm('powerform')">提交审核</el-button>
        <el-button type="info">取消</el-button>
      </div>
    </div>
    <div class="empower2" v-if="active==2">
         <div class="block" style="margin:0 auto;text-align:center;padding:30px;">
            <el-image>
                <div slot="error" class="image-slot">
                <svg-icon icon-class="empowerexamine" style="width:8rem;height:8rem">

                </svg-icon>
                </div>
            </el-image>
            <p style="font-size: 25px;color: #409EFF;">正在审核中</p>
            <p style="font-size: 20px;">审核员联系电话：17201202365</p>
            <p style="color:#cccccc;font-size:14px">预计3到5个工作日完成，请耐心等待，谢谢您的配合和理解</p>
            <p><el-button type="primary" @click="cancelAdd">撤销审核<i class="el-icon-s-fold"></i></el-button></p>
    </div>
    </div>
  </div>
</template>
<script>
import { regionData, CodeToText } from "element-china-area-data";
import Parse from "parse";
import Cookies from 'js-cookie'
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
      positional:['大学专科','大学本科','硕士研究生','博士研究生'],
      active: 1,
      powerform: {
        name: "",
        birthday: "",
        job: "",
        professional:'',//主修专业
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
        userphone:''//联系方式
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
        professional:[
            { required: true, message: "请输入主修专业", trigger: "blur" }
        ],
        userphone:[
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
        ],
      },
      regionData: regionData,
      imgtype:''
    };
  },
  mounted() {},
  methods: {
    upload(event,type) {
      this.imgtype=type
      if (event) {
        var file = event.target.files[0]; //name: "dangqi1.png" || type: "image/png"
        var name = file.name;
        var testmsg = event.target.files[0].type
        var type = file.type.split("/")[0];
        var extension =
        testmsg === "image/jpeg" ||
        testmsg === "image/JPEG" ||
        testmsg === "image/png" ||
        testmsg === "image/PNG" ||
        testmsg === "image/bpm" ||
        testmsg === "image/BPM";
        if (!extension) {
          //将图片img转化为base64
            this.$message({
            message: "请上传图片",
            type: "error"
          });
          return false; //必须加上return false; 才能阻止
        }else{
          var reader = new FileReader();
          reader.readAsDataURL(file);
          var that = this;
          reader.onloadend = function() {
            var dataURL = reader.result;
            var blob = that.dataURItoBlob(dataURL);
            that.uploadFile(blob, name); //执行上传接口
          };
        }
      }
    },
    dataURItoBlob(dataURI) {
      // base64 解码
      var byteString = atob(dataURI.split(",")[1]);
      var mimeString = dataURI
        .split(",")[0]
        .split(":")[1]
        .split(";")[0];
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], { type: mimeString });
    },
    uploadFile(imgUrl, name) {
      var formdata = new FormData();
      formdata.append("file", imgUrl, name);
      formdata.append("output", 'json')
      formdata.append("path",Parse.User.current().id)
      formdata.append("auth_token", Cookies.get('sessionToken')) //下面是要传递的参数
      //此处必须设置为  multipart/form-data
      let config = {
        headers: {
          "Content-Type": "multipart/form-data" //之前说的以表单传数据的格式来传递fromdata
        }
      };
      this.$http
        .post(Cookies.get('fileserver'),formdata)
        .then(res => { 
          if(res){
            if(this.imgtype=='front'){
              this.powerform.frontimageUrl= res.body.url
            }else if(this.imgtype=='contrary'){
              this.powerform.contraryimageUrl = res.body.url
            }else if(this.imgtype=='joblicense'){
              this.powerform.joblicense = res.body.url
            }
            
          }
        }).catch(error=>{
          
          this.$message.error(error.bodyText)
        });
    },
    //身份证正面上传
    handleFrontSuccess(response, file, fileList) {
      this.powerform.frontimageUrl = response.path;
      this.$message({
        message: "上传成功！",
        type: "success"
      });
    },
    //反面上传
    handleContrarySuccess(response, file, fileList) {
      this.powerform.contraryimageUrl = response.path;
      this.$message({
        message: "上传成功！",
        type: "success"
      });
    },
    //职务上传
    handleJobSuccess(response, file, fileList) {
      this.powerform.joblicense = response.path;
      this.$message({
        message: "上传成功！",
        type: "success"
      });
    },
    submitForm(formName){
        this.$refs[formName].validate((valid) => {
            if (valid) {
                if(this.powerform.frontimageUrl==''){
                    this.$message.error('请上传身份证正面照') 
                    return
                }
                if(this.powerform.contraryimageUrl==''){
                    this.$message.error('请上传身份证贝面照')
                    return
                }
                if(this.powerform.joblicense==''){
                    this.$message.error('请上传资质资历图片')
                    return
                }
                var PersonAuthtication = Parse.Object.extend('PersonAuthtication')
                var personauthtication = new PersonAuthtication()
                var acl = new Parse.ACL()
                var Department = Parse.Object.extend('Department')
                var department = new Department()
                department.id = Parse.User.current().attributes.department.id
                if(this.personempowerid!=''){
                  personauthtication.id = this.personempowerid
                }
                var userId = Parse.User.current().id
                acl.setReadAccess(userId,true)
                acl.setWriteAccess(userId,true)
                acl.setRoleWriteAccess('Auditor',true)
                acl.setRoleReadAccess('Auditor',true)
                personauthtication.set('department',department)
                personauthtication.set("ACL",acl)
                personauthtication.set('name',this.powerform.name)
                personauthtication.set('birthday',this.powerform.birthday/1000)
                personauthtication.set('job',this.powerform.job)
                personauthtication.set('education',this.powerform.education)
                personauthtication.set('positional_titles',this.powerform.positional_titles)
                personauthtication.set('identity',this.powerform.identity)
                personauthtication.set('userphone',this.powerform.userphone)
                personauthtication.set('graduate_institutions',this.powerform.graduate_institutions)
                personauthtication.set('contraryimageUrl',this.powerform.contraryimageUrl)
                personauthtication.set('frontimageUrl',this.powerform.frontimageUrl)
                personauthtication.set('joblicense',this.powerform.joblicense)
                personauthtication.set('addr',this.powerform.addr)
                personauthtication.set('working_seniority',this.powerform.working_seniority)
                personauthtication.set('professional',this.powerform.professional)
                personauthtication.set('training_experience',this.powerform.training_experience)
                personauthtication.set('start_time',this.powerform.start_time/1000)
                personauthtication.set('practitioners_experience',this.powerform.practitioners_experience)
                personauthtication.set('status','Pending')
                personauthtication.save().then(resultes=>{
                    if(resultes){
                      this.personempowerid = resultes.id
                        this.$message.success('审核提交成功')
                        this.active=2
                    }
                })
            } else {
            this.$message.error('有必填项未填写')
            return false;
            }
        });
    },
    cancelAdd(){
      this.active=1
    },
  }
};
</script>
<style lang="scss" scoped>
.person_empower {
  width: 100%;
  height: 100%;
  padding: 20px 60px;
  box-sizing: border-box;
  background: #ffffff;
  .empower1 {
    .el-form {
      .el-col-12 {
        padding: 20px;
        @media screen and (max-width: 1100px) {
          width: 100%;
        }
        /deep/ .el-select {
          width: 100%;
        }
        /deep/ .el-cascader {
          width: 100%;
        }
      }
      /deep/ .el-select {
        width: 100%;
      }
      /deep/ .el-date-editor {
        width: 100%;
      }
    }
    .activefirst {
      text-align: center;
    }
  }
}
</style>
<style>
.person_empower .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.person_empower.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.person_empower .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 250px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  border:1px dashed #cccccc
}
.person_empower .avatar {
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
.person_empower .el-tabs__header {
  margin-top: 20px;
}
</style>