<template>
  <div id="addApp">
    <div class="head">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item
          :to="{ path: '/roles/applicationManagement' }"
        >{{$t('application.applicationmanagement')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('route.新增应用')}}</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button
        type="primary"
        plain
        @click="handleClickBack"
        size="small"
      >{{$t('application.return')}}</el-button>
    </div>

    <div class="form">
      <div class="title">
        <p style="color:#f00;">{{'*'+$t('application.mustfillin')}}</p>
      </div>

      <el-form ref="form" :model="form" label-width="180px">
        <!-- 应用名称 -->
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item
                label="应用单位"
                prop="department"
                :rules="[
                    { required: true, message: '应用单位不能为空'},
                ]"
              >
                <el-input v-model="form.department" placeholder="应用单位"></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('application.applicationname')"
                prop="name"
                :rules="[
                    { required: true, message: '应用名称不能为空'},
                ]"
              >
                <el-input v-model="form.name" :placeholder="$t('application.applicationname')"></el-input>
              </el-form-item>
              <!-- 应用链接 -->
              <el-form-item
                :label="$t('application.applicationlink')"
                prop="productIdentifier"
                :rules="[
                    { required: true, message: '应用链接不能为空'},
                ]"
              >
                <el-input v-model="form.productIdentifier" placeholder="例：vcon" class="link">
                  <template slot="prepend">{{host}}</template>
                </el-input>
                <!-- 所属行业 -->
              </el-form-item>
              <el-form-item
                :label="$t('application.industrytype')"
                prop="category"
                :rules="[
                    { required: true, message: '请选择所属行业',trigger: 'blur'},
                ]"
              >
                <el-cascader
                  ref="category"
                  :options="treeData"
                  v-model="form.category"
                  :placeholder="$t('application.industrytype')"
                  clearable
                ></el-cascader>
              </el-form-item>
              <!--应用产品、-->
              <el-form-item label="应用产品">
                <el-select v-model="form.product" multiple placeholder="请选择">
                  <el-option
                    v-for="(item,index) in productlist"
                    :key="index"
                    :label="item.attributes.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <!-- 应用描述 -->
              <el-form-item :label="$t('application.applicationdescription')">
                <el-input
                  type="textarea"
                  :rows="4"
                  v-model="form.desc"
                  maxlength="300"
                  show-word-limit
                  :placeholder="$t('application.applicationdescription')"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
              <!-- 应用图片 -->
              <el-form-item :label="$t('application.applicationpictures')">
                <el-upload
                  class="upload-demo"
                  ref="upload"
                  action="/iotapi/upload"
                  :file-list="form.fileList"
                  :auto-upload="false"
                  list-type="picture"
                  :limit="1"
                  :on-success="handleSuccess"
                >
                  <el-button
                    slot="trigger"
                    size="small"
                    type="primary"
                  >{{$t('application.selectfile')}}</el-button>
                  <el-button
                    style="margin-left: 10px;"
                    size="small"
                    type="success"
                    @click="submitUpload"
                  >{{$t('application.uploadtoserver')}}</el-button>

                  <span v-show="form.img != ''">{{$t('developer.path')}}:{{form.img}}</span>
                  <div
                    slot="tip"
                    class="el-upload__tip"
                  >{{$t('application.onlyJPG/PNGfilescanbeuploadedandnomorethan500kb')}}</div>
                </el-upload>
              </el-form-item>
              <el-form-item label="背景图片">
                <el-upload
                  class="upload-demo"
                  ref="upload1"
                  action="/iotapi/upload"
                  :file-list="form.fileList1"
                  :auto-upload="false"
                  list-type="picture"
                  :limit="1"
                  :on-success="handleSuccess1"
                >
                  <el-button
                    slot="trigger"
                    size="small"
                    type="primary"
                  >{{$t('application.selectfile')}}</el-button>
                  <el-button
                    style="margin-left: 10px;"
                    size="small"
                    type="success"
                    @click="submitUpload1"
                  >{{$t('application.uploadtoserver')}}</el-button>

                  <span v-show="form.img1 != ''">{{$t('developer.path')}}:{{form.img1}}</span>
                  <div
                    slot="tip"
                    class="el-upload__tip"
                  >{{$t('application.onlyJPG/PNGfilescanbeuploadedandnomorethan500kb')}}</div>
                </el-upload>
              </el-form-item>

              <!-- 版权信息 -->
              <el-form-item :label="$t('application.copyrightinformation')">
                <el-input
                  type="textarea"
                  :rows="3"
                  v-model="form.copyright"
                  maxlength="300"
                  show-word-limit
                  :placeholder="$t('application.copyrightinformation')"
                ></el-input>
              </el-form-item>
              <el-form-item :label="$t('application.monitoringpanel')">
                <el-input :placeholder="$t('application.monitoringpanel')" v-model="form.dashboard">
                  <template slot="prepend">http://</template>
                  <el-button
                    slot="append"
                    type="primary"
                    style="background:#409eff;color:#ffffff;border-radius:1px 1px 1px 0"
                    @click="open12"
                  >{{$t('application.preview')}}</el-button>
                </el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <!-- 分割 -->
        <el-divider>
          <b>{{$t('application.applicationconfiguration')}}</b>
        </el-divider>
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item
                :label="$t('application.applicationaccessscale')"
                prop="scale"
                :rules="[
                    { required: true, message: '请选择应用接入规模',trigger: 'change'},
                ]"
              >
                <el-select v-model.number="form.scale" clearable>
                  <el-option
                    v-for="item in form.scaleDate"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <!-- Token有效时间 -->
              <!-- <el-form-item :label="$t('application.tokeneffectivetime')">
                <el-input
                  controls-position="left"
                  v-model.number="form.time"
                  type="number"
                  :min="1"
                  :placheholder="$t('application.tokeneffectivetime')"
                >
                  <template slot="append">{{$t('application.seconds')}}</template>
                </el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
              <el-form-item label="App Secret">
                <el-input v-model="form.secret">
                  <el-button slot="append" icon="el-icon-refresh-right" @click="handleClickRefresh"></el-button>
                </el-input>
              </el-form-item> -->
            </div>
          </el-col>
        </el-row>
        <!-- 应用接入规模 -->

        <!-- App Secret -->
      </el-form>
      <div class="btns">
        <el-button
          v-show="page=='add'"
          type="primary"
          @click="handleClickSubmit"
        >{{$t('application.submission')}}</el-button>
        <el-button
          v-show="page=='update'"
          type="primary"
          @click="handleClickUpdate"
        >{{$t('application.submission')}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
let Base64 = require("js-base64").Base64;
import {
  getIndustry,
  Upload,
  addApp,
  handleZero,
  updateApp
} from "@/api/applicationManagement";
import Parse from "parse";
export default {
  data() {
    return {
      imageUrl: false,
      host: window.location.origin + "/lot/",
      // 表单
      form: {
        name: "", //应用名称
        options: [], //所属行业
        category: "", //中文所属行业
        number: "", //应用编号
        code: "", //应用授权码
        scale: "", //应用接入规模
        dashboard: "",
        product:[],
        department:'',//应用单位
        scaleDate: [
          { id: 0, value: 100, label: "100" },
          { id: 1, value: 1000, label: "1000" },
          { id: 2, value: 10000, label: "1万" },
          { id: 3, value: 100000, label: "10万" },
          { id: 4, value: 1000000, label: "100万" },
          { id: 5, value: 10000000, label: "1000万" },
          { id: 6, value: 100000000, label: "1亿" }
        ],
        productIdentifier: "", //应用链接
        fileList: [], //上传列表，
        fileList1: [], //上传列表
        img: "", //上传图片路径
        img1: "", //背景图片
        copyright: "", //版权信息
        desc: "", //应用描述
        time: 7200, //Token有效时间
        secret: "" //App Secret
      },
      sessionToken: "",
      file: "",
      page: "",
      // 页面内容，传值变化
      content: {
        title: "",
        objectId: ""
      },
      // 参数
      argu: {},
      Notification: "",
      productlist:[]//产品合级
    };
  },
  computed: {
    treeData() {
      let cloneData = JSON.parse(JSON.stringify(this.form.options)); // 对源数据深度克隆
      return cloneData.filter(father => {
        let branchArr = cloneData.filter(child => father.id == child.parentid); //返回每一项的子级数组
        branchArr.length > 0 ? (father.children = branchArr) : ""; //如果存在子级，则给父级添加一个children属性，并赋值
        return father.parentid == 0; //返回第一层
      });
    }
  },
  created() {
    this.Industry();
    this.randomSecret();
    this.getProductList()
    this.sessionToken = sessionStorage.getItem("token");
  },
  mounted() {
    this.estiPage();
  },
  methods: {
    // 刷新secret
    handleClickRefresh() {
      this.randomSecret();
    },
    
    getProductList(){
      var Product = Parse.Object.extend('Product')
      var product = new Parse.Query(Product)
      product.find().then(response=>{
        if(response){
          this.productlist = response
        }
      })
    },
    // 产生随机secrets
    randomSecret() {
      let ranNum = Math.ceil(Math.random() * 25);
      this.form.secret = Base64.encode(
        String.fromCharCode(65 + ranNum) +
          Math.ceil(Math.random() * 10000000) +
          Number(new Date())
      );
    },
    // 判断页面
    estiPage() {
      this.argu = this.$route.query;
      console.log(this.argu);
      this.content.title = this.argu.title;
      this.page = this.argu.page;
      if (this.page == "update") {
        this.form.name = this.argu.name;
        this.form.scale = Number(handleZero(this.argu.scale));
        this.form.secret = this.argu.secret;
        this.form.productIdentifier = this.argu.productIdentifier;
        this.content.objectId = this.argu.objectId;
        this.form.department = this.argu.userUnit
        this.form.category = this.argu.category.split("/");
        if (this.argu.dashboard) {
          this.form.dashboard = this.argu.dashboard.substr(7);
        } else {
          this.form.dashboard = "";
        }

        if (this.argu.logo != "") {
          this.form.img = this.argu.logo;
          this.form.fileList.push({
            name: "logo.png",
            url: this.argu.logo
          });
        }
        if (this.argu.background != "") {
          this.form.img1 = this.argu.background;
          this.form.fileList1.push({
            name: "background.png",
            url: this.argu.background
          });
        }
      }
    },
    // 返回
    handleClickBack() {
      this.$router.push({ path: "/roles/applicationManagement" });
    },
    // 上传图片
    submitUpload() {
      this.$refs.upload.submit();
    },
    // 改变文件
    handleChangeFile(e) {
      let file = e.target.files[0];
      let type = file.name.substr(-3);
      if (file.size / 1024 > 500) {
        this.$message.error("上传图片大小不能超过500KB!");
      } else if (type != "png" && type != "jpg") {
        this.$message.error("上传图片格式不正确，必须是png或jpg格式！");
      } else {
        this.file = file;
      }
    },
    // 上传成功
    handleSuccess(response, file, fileList) {
      this.form.img = response.path;
      this.$message({
        message: "上传成功！",
        type: "success"
      });
      // document.getElementsByClassName('el-upload-list__item .is-success')[0].setAttribute('display','block')
      document
        .getElementsByClassName("el-icon-close")[0]
        .setAttribute("display", "none");
    },

    // 上传失败
    handleError(err, file, fileList) {
      this.$message({
        message: "上传失败！",
        type: "error"
      });
    },
    // 判断是否可以提交
    isSubmit() {
      if (
        this.form.name == "" ||
        this.form.scale == "" ||
        this.form.productIdentifier == ""
      ) {
        this.$message.error("有必填项没有填写，无法提交！");
        return false;
      } else {
        return true;
      }
    },
    handleSuccess1(response, file, fileList) {
      this.form.img1 = response.path;
      this.$message({
        message: "上传成功！",
        type: "success"
      });
      // document.getElementsByClassName('el-upload-list__item .is-success')[0].setAttribute('display','block')
      document
        .getElementsByClassName("el-icon-close")[0]
        .setAttribute("display", "none");
    },
    submitUpload1() {
      this.$refs.upload1.submit();
    },
    // 提交
    handleClickSubmit() {
      if (!this.isSubmit()) {
        return;
      }
      var Project = Parse.Object.extend('Project')
      var project = new Project()
      var Product = Parse.Object.extend('Product')
      var product = new Product()
      // var User = Parse.Object.extend("_User");
      // var user = new User();
      // user.id = Parse.User.current().id
      var acl = new Parse.ACL()
      acl.setReadAccess(Parse.User.current().id,true)
      acl.setWriteAccess(Parse.User.current().id,true)
      project.set('ACL',acl)
      var relation = project.relation('product')
      this.form.product.map(item=>{
        product.set('objectId',item)
        relation.add(product)
      })
      project.set('title',this.form.name)
      project.set('category',this.form.category.join("/"))
      project.set('scale',this.form.scale)
      project.set('productIdentifier',this.form.productIdentifier)
      project.set('copyright',this.form.copyright)
      project.set('desc',this.form.desc)
      project.set('logo',this.form.img)
      // project.set('secret',this.form.secret)
      // project.set('config',{'expires':this.form.time})
      project.set('background',this.form.img1)
      project.set('userUnit',this.form.department)
      // project.set('user',user)
      if (this.form.dashboard != "") {
        project.set('dashboard',"http://" + this.form.dashboard)
      } else {
        project.set('dashboard','')
      }
      project.save().then(resultes=>{
        if(resultes){
                 this.$message({
              message: "添加成功！",
              type: "success"
            });
             this.$router.push({ path: "/roles/projectManagement" });
        }
      })
    },
    // 修改
    handleClickUpdate() {
      if (!this.isSubmit()) {
        return;
      }
      var Project = Parse.Object.extend('Project')
      var project = new Project()
      project.id = this.argu.objectId;
      var Product = Parse.Object.extend('Product')
      var product = new Product()
      // var User = Parse.Object.extend("_User");
      // var user = new User();
      // user.id = Parse.User.current().id
      var acl = new Parse.ACL()
      acl.setReadAccess(Parse.User.current().id,true)
      acl.setWriteAccess(Parse.User.current().id,true)
      project.set('ACL',acl)
      var relation = project.relation('product')
      this.form.product.map(item=>{
        product.set('objectId',item)
        relation.add(product)
      })
      project.set('title',this.form.name)
      project.set('category',this.form.category.join("/"))
      project.set('scale',this.form.scale)
      project.set('productIdentifier',this.form.productIdentifier)
      project.set('copyright',this.form.copyright)
      project.set('desc',this.form.desc)
      project.set('logo',this.form.img)
      // project.set('secret',this.form.secret)
      // project.set('config',{'expires':this.form.time})
      project.set('background',this.form.img1)
      project.set('userUnit',this.form.department)
      // project.set('user',user)
      if (this.form.dashboard != "") {
        project.set('dashboard',"http://" + this.form.dashboard)
      } else {
        project.set('dashboard','')
      }
      project.save().then(resultes=>{
        if(resultes){
                 this.$message({
              message: "修改成功！",
              type: "success"
            });
             this.$router.push({ path: "/roles/projectManagement" });
        }
      })
    },
    // 获取行业信息
    Industry() {
      this.form.options = [];
      var Datas = Parse.Object.extend("Datas");
      var datas = new Parse.Query(Datas);
      datas.equalTo("data.key", "category");
      datas.limit(1000);
      datas.find().then(
        response => {
          if (response) {
            response.map(items => {
              var obj = {};
              obj.value = items.attributes.data.CategoryName;
              obj.label = items.attributes.data.CategoryName;
              obj.id = items.attributes.data.Id;
              obj.parentid = items.attributes.data.SuperId;
              this.form.options.push(obj);
            });
          }
        },
        error => {
          this.$message.error(error.message);
        }
      );
    },
    open12() {
      this.Notification = this.$notify({
        title: "面板预览",
        dangerouslyUseHTMLString: true,
        duration: 0,
        type: "success",
        message: `<div><iframe
                src='http://${this.form.dashboard}'
                width="1000"
                height="400"
                frameborder="0"
      ></iframe></div>`
      });
    }
  },
  beforeDestroy() {
    if (this.Notification) {
      this.Notification.close();
    }
  }
};
</script>

<style lang="scss" scoped>
#addApp {
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  .head {
    margin: 20px 0;
    display: flex;
    justify-content: space-between;
  }
  .form {
    border: 3px solid #f7f7f7;
    padding: 10px 30px;
    .title {
      text-align: right;
      margin: 10px 0;
    }
    .el-form {
      // display: flex;
      // flex-wrap: wrap;
      // justify-content: space-between;
      .el-col-12 {
        padding: 20px;
        @media screen and (max-width: 1100px) {
          width: 100%;
        }
      }
      .el-form-item {
        /deep/ .el-slider__marks-text {
          width: 30px;
          margin-top: 5px;
        }
        /deep/ .el-cascader {
          width: 100%;
        }
        /deep/ .el-select {
          width: 100%;
        }
        /deep/ .el-input-number {
          width: 100%;
        }
      }
    }
  }
  .btns {
    margin-top: 40px;
    text-align: center;
  }
}
</style>
<style>
.el-upload-list__item.is-success .el-upload-list__item-status-label {
  display: none;
}
.el-upload-list__item .el-icon-close {
  display: block;
}
.el-notification {
  width: 1000px;
}
</style>
