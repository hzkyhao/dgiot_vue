<template>
  <div class="login-container">
    <div class="loginbanner">
      <el-form
        :model="ruleForm2"
        status-icon
        :rules="rules2"
        ref="ruleForm2"
        label-width="100px"
        class="login-form"
      >
       <div class="logo">
          <img :src="logosrc" alt="logo" style="width:80px;height:80px;">
          <p>{{title}}</p>
        </div>
        <!-- <el-form-item label="账号" prop="account">
          <el-input v-model="ruleForm2.account" placeholder="请输入账号"></el-input>
        </el-form-item>-->
        <el-form-item>
          <span class="svg-container">
            <svg-icon icon-class="user"/>
          </span>
          <el-input
            v-model="ruleForm2.phone"
            name="phone"
            type="text"
            auto-complete="on"
            :maxlength="11"
            placeholder="请输入手机号"
          />
        </el-form-item>
        <!-- <el-form-item label="手机号" prop="phone">
          <el-input v-model.number="" placeholder="请输入手机号" :maxlength="11"></el-input>
        </el-form-item>-->
        <!-- <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm2.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>-->
        <!-- <el-form-item label="姓名" prop="username">
          <el-input v-model="ruleForm2.username" placeholder="2-5个文字" :maxlength="5"></el-input>
        </el-form-item>-->
        <el-form-item prop="password" required>
          <span class="svg-container">
            <svg-icon icon-class="password"/>
          </span>
          <el-input
            v-model="ruleForm2.password"
            name="password"
            auto-complete="on"
            placeholder="请输入6-10位数字字母组合"
            type="password"
            :maxlength="10"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon icon-class="eye"/>
          </span>
        </el-form-item>

        <el-form-item prop="checkPass" required>
          <span class="svg-container">
            <svg-icon icon-class="password"/>
          </span>
          <el-input
            v-model="ruleForm2.checkPass"
            auto-complete="on"
            placeholder="请再次输入密码"
            type="password"
            :maxlength="10"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon icon-class="eye"/>
          </span>
        </el-form-item>
        <!-- <div class="yzm" style="width;100%;height:50px;margin-left:20px;margin-bottom:20px;">
          <el-input
            type="text"
            placeholder="请输入验证码"
            class="yzm"
            style="width:50%;float:left;border:1px solid #cccccc;border-radius:5px"
          ></el-input>
          <el-button @click="send" :disabled="sendMsgDisabled" style="float:right" type="primary">
            <span v-if="sendMsgDisabled">{{time+'秒后获取'}}</span>
            <span v-if="!sendMsgDisabled">发送验证码</span>
          </el-button>
        </div> -->
        <!-- <el-form-item prop="roles">
          <span class="svg-container">
            <svg-icon icon-class="pingtai"/>
          </span>
          <el-radio-group v-model="ruleForm2.roles" style="margin-left:10px">
            <el-radio label="visitor_pump">水泵</el-radio>
            <el-radio label="visitor">电网</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item style="margin-top:50px;">
          <el-button
            type="primary"
            style="width:100%;letter-spacing:10px;"
            @click="submitForm('ruleForm2')"
          >下一步</el-button>
        </el-form-item>
        <div class="hasuser">
          <span style="color:#409EFF;font-size:14px;cursor:pointer" @click="login">已有账号登陆</span>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import Parse from "parse";
import Cookies from 'js-cookie';
let Base64 = require('js-base64').Base64;
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (!/^\w{6,10}$/.test(value)) {
          callback(new Error("密码格式不正确"));
        }
        callback();
      }
    };
    var validatecheckPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm2.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      time: 60, // 发送验证码倒计时
      sendMsgDisabled: false,
      logosrc:'',
      title:'',
      ruleForm2: {
        account: "",
        phone: "",
        username: "",
        password: "",
        email: "",
        checkPass: "",
        roles:'',
      },
      protype:'',
      rules2: {
        account: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 1, max: 10, message: "长度在 1到 10 个字符", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
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
        password: [
          { validator: validatePass, trigger: "blur", required: true }
        ],
        checkPass: [
          { validator: validatecheckPass, trigger: "blur", required: true }
        ],
        username: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { min: 2, max: 5, message: "姓名格式不正确", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        roles: [
            { required: true, message: '请选择平台', trigger: 'change' }
          ],
      }
    };
  },
  mounted() {
    this.protype = sessionStorage.getItem('roletype')
    this.title = sessionStorage.getItem('product_title')
    this.logosrc =  sessionStorage.getItem('imgsrc')
  },
  methods: {
    showPwd() {
      if (this.pwdType === "password") {
        this.pwdType = "";
      } else {
        this.pwdType = "password";
      }
    },
    login() {
      this.$router.push({
        path: "/login"
      });
    },
    submitForm(formName) {
      var MobileRegex = /^1[3-9]\d{9}$/;
      this.$refs[formName].validate(valid => {
        if (valid) {
          var user = new Parse.User();
          user.set("username", this.ruleForm2.phone.toString());
          user.set("password", this.ruleForm2.password);
          if(MobileRegex.test(this.ruleForm2.phone)){
             user.set("phone", this.ruleForm2.phone.toString());
          }else{
             user.set("phone", '');
          }
         
          user.set('productId',this.protype)
          let acl = new Parse.ACL();
          user
            .save()
            .then(resultes => {
              console.log(resultes.attributes.sessionToken)
              Cookies.set('sessionToken',resultes.attributes.sessionToken)
              this.$router.push({
                path: "/phonelogin",
                query:{
                  phone:Base64.encode(this.ruleForm2.phone),
                  action:'register'
                }
              });
            })
            .catch(error=>{
              if(error.code==202){
                this.$message({
                message: '用户名已存在',
                type: "error"
              });
              }else{
                this.$message({
                message: error.message,
                type: "error"
              });
              }
              
            });
        } else {
          this.$message({
            message: "信息错误",
            type: "error"
          });
          return false;
        }
      });
    },
    send() {
      let _this = this;
      _this.sendMsgDisabled = true;
      let interval = window.setInterval(function() {
        if (_this.time-- <= 0) {
          _this.time = 60;
          _this.sendMsgDisabled = false;
          window.clearInterval(interval);
        }
      }, 1000);
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
$light_gray: rgba(0, 0, 0, 0.247058823529412);
/* reset element-ui css */
.login-container {
  background: url("../../imgages/loginbanner.jpg") no-repeat;
  height: 100%;
  background-size: cover;
//   opacity: 0.8;
  .loginbanner {
    background: transparent;
    padding: 16px;
    box-sizing: border-box;
    .hasuser {
      text-align: center;
    }
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;
      input {
        background: transparent;
        border: 1px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        &:-webkit-autofill {
          // -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: black !important;
        }
      }
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: #ffffff;
      border-radius: 5px;
      color: #454545;
    }
    .logo {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
    p {
      font-size: 30px;
      font-weight: bold;
      margin: 25px 0;
    }
  }
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: rgba(45, 58, 75, 0.8);
$dark_gray: #889aa4;
$light_gray: #eee;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    position: absolute;
    height: 550px;
    right: 5%;
    width: 520px;
    max-width: 100%;
    padding: 35px 35px 15px 35px;
    margin: 120px;
    background: #ffffff;
    box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2),
      0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12);
    border-radius: 5px;
  }
  .login_bottom {
    position: absolute; 
    left: 0;
    right: 0;
    bottom: 20px;
    width: 520px;
    max-width: 100%;
    padding: 35px 35px 15px 35px;
    margin: 0 auto;
    text-align: center;
    color: #ffffff;
    font-size: 14px;
    img {
      height: 16px;
      width: 16px;
      vertical-align: middle;
      margin: 0 2px;
    }
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
<style>
.login-container .el-form-item__content {
  border: 1px solid #cccccc;
  border-radius: 5px;
  margin-left: 20px !important;
}
.login-container .loginbanner .el-input input {
  color: black;
}
</style>
