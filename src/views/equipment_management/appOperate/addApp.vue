<template>
  <div id="addApp">
    <div class="head">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item
          :to="{ path: '/roles/applicationManagement' }"
        >{{$t('application.applicationmanagement')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{actionType == 'update'? '编辑应用':'新增应用'}}</el-breadcrumb-item>
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
        <!-- 工程名称 -->
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item
                label="工程单位"
                prop="department"
                :rules="[
                    { required: true, message: '工程单位不能为空'},
                ]"
              >
                <el-input v-model="form.department" placeholder="工程单位"></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('application.applicationname')"
                prop="name"
                :rules="[
                    { required: true, message: '工程名称不能为空'},
                ]"
              >
                <el-input
                  v-model="form.name"
                  :placeholder="$t('application.applicationname')"
                  readonly
                ></el-input>
              </el-form-item>
              <!-- 工程链接 -->
              <el-form-item
                :label="$t('application.applicationlink')"
                prop="productIdentifier"
                :rules="[
                    { required: true, message: '工程链接不能为空'},
                ]"
              >
                <!--         <el-input v-model="form.productIdentifier" placeholder="例：vcon" class="link">
                  <template slot="prepend">{{host}}</template>
                </el-input>
                -->
                <el-select v-model="form.productIdentifier" placeholder="请选择" disabled>
                  <el-option
                    v-for="item in applicationList"
                    :key="item.id"
                    :label="host + item.attributes.desc"
                    :value="item.attributes.desc"
                  ></el-option>
                </el-select>
              </el-form-item>
              <!-- 所属行业 -->
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

              <!-- 所属应用(角色) app -->
              <el-form-item
                :label="$t('application.applicationtype')"
                :rules="[
                    { required: true, message: '请选择所属应用',trigger: 'blur'},
                ]"
              >
              <el-input v-model="form.relationApp" :disabled="true">  </el-input>
              <!--
                  <el-option
                    v-for="item in applicationList"
                    :key="item.id"
                    :label="item.attributes.name"
                    :value="item.attributes.name"
                  ></el-option>                            
              -->

              </el-form-item>
              <!--工程产品、-->
              <!-- <el-form-item label="工程产品">
                <el-select v-model="form.product" multiple placeholder="请选择">
                  <el-option
                    v-for="(item,index) in productlist"
                    :key="index"
                    :label="item.attributes.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>-->

              <!-- 工程描述 -->
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
              <!-- 工程图片 -->
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
                    { required: true, message: '请选择工程接入规模',trigger: 'change'},
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
              </el-form-item>-->
            </div>
          </el-col>
        </el-row>
        <!-- 工程接入规模 -->

        <!-- App Secret -->
      </el-form>
      <div class="btns">
        <el-button
          v-show="actionType == 'add'"
          type="primary"
          @click="handleClickSubmit"
        >{{$t('application.submission')}}</el-button>
        <el-button
          v-show="actionType =='update'"
          type="primary"
          @click="handleClickUpdate"
        >更新</el-button>
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
import { resolve } from "url";
import { returnLogin } from "@/utils/return";
import request from '@/utils/request'
export default {
  data() {
    return {
      imageUrl: false,
      host: window.location.origin + "/lot/",
      applicationList: [], //所属行业
      // 表单
      form: {
        name: "", //工程名称
        options: [], //所属行业
        category: [], //中文所属行业
        relationApp: "", //
        number: "", //工程编号
        code: "", //工程授权码
        scale: "", //工程接入规模
        dashboard: "",
        product: [],
        department: "", //工程单位
        scaleDate: [
          { id: 0, value: 100, label: "100" },
          { id: 1, value: 1000, label: "1000" },
          { id: 2, value: 10000, label: "1万" },
          { id: 3, value: 100000, label: "10万" },
          { id: 4, value: 1000000, label: "100万" },
          { id: 5, value: 10000000, label: "1000万" },
          { id: 6, value: 100000000, label: "1亿" }
        ],
        productIdentifier: "", //工程链接
        fileList: [], //上传列表，
        fileList1: [], //上传列表
        img: "", //上传图片路径
        img1: "", //背景图片
        copyright: "", //版权信息
        desc: "", //工程描述
        time: 7200, //Token有效时间
        secret: "" //App Secret
      },
      sessionToken: "",
      file: "",
      actionType: "",
      relationAppObjectId:'',
      // 页面内容，传值变化
      content: {
        title: "",
        objectId: ""
      },
      // 参数
      argu: {},
      Notification: "",
      productlist: [] //产品合级
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
    },
    applicationData() {
      return [];
    }
  },
  created() {
    this.Industry();
    this.randomSecret();
    this.getProductList();
    // this.sessionToken = sessionStorage.getItem("token");
  },
  mounted() {
    this.initData();
  },
  methods: {
    // 刷新secret
    handleClickRefresh() {
      this.randomSecret();
    },
    onApplicationchange(val) {},
    getProductList(relAppid) {
      var Product = Parse.Object.extend("Product");
      var product = new Parse.Query(Product);
      product.find().then(response => {
        if (response) {
          this.productlist = response;
        }
      });
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
    initData() {
      this.argu = this.$route.query;
      this.content.title = this.argu.title;
      this.actionType = this.argu.actionType;

      this.getApplication()
        .then(response => {
          this.applicationList = response;

          //从工程管理列表,的修改按钮 跳转过来的
          if (this.actionType == "update") {
            this.form.name = this.argu.name;
            this.form.scale = Number(handleZero(this.argu.scale));
            this.form.secret = this.argu.secret;
            this.form.productIdentifier = this.argu.productIdentifier;
            this.content.objectId = this.argu.objectId;
            this.form.department = this.argu.userUnit;
            this.form.desc = this.argu.desc;
            this.form.copyright = this.argu.copyright;

            if (this.argu.category) {
              this.form.category = this.argu.category.split("/");
            }
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

            this.form.relationApp = this.argu.name;
          } else {
            //从应用管理的应用部署跳转过来的
            this.relationAppObjectId = this.$route.query.appObjectId;
            
            this.form.relationApp = this.$route.query.name;
            this.form.productIdentifier = this.$route.query.desc;
            this.form.name = this.$route.query.desc;


    /*         var App = Parse.Object.extend("App");
            var app = new Parse.Query(App);
            app.get(appid).then(resultes => {
              if (resultes) {
                // this.form.relationApp = resultes.id
                this.form.relationApp = resultes.attributes.name;
                this.form.productIdentifier = resultes.attributes.desc;
                this.form.name = resultes.attributes.desc;
              }
            }); */
          }
        })
        .catch(error => {
          returnLogin(error);
        });
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
        this.$message("上传图片大小不能超过500KB!");
      } else if (type != "png" && type != "jpg") {
        this.$message("上传图片格式不正确，必须是png或jpg格式！");
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
        this.$message("有必填项没有填写，无法提交！");
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
    // 新增
    handleClickSubmit() {
      if (!this.isSubmit()) {
        return;
      }
      var Project = Parse.Object.extend("Project");
      var project = new Project();
      var Product = Parse.Object.extend("Product");
      var product = new Product();
      var acl = new Parse.ACL();

      acl.setRoleReadAccess(this.form.relationApp, true);
      acl.setRoleWriteAccess(this.form.relationApp, true);

      project.set("ACL", acl);
      // var relation = project.relation("product");
      // this.form.product.map(item => {
      //   product.set("objectId", item);
      //   relation.add(product);
      // });
      project.set("title", this.form.name);
      project.set("category", this.form.category.join("/"));
      project.set("scale", this.form.scale);
      project.set("productIdentifier", this.form.productIdentifier);
      project.set("copyright", this.form.copyright);
      project.set("desc", this.form.desc);
      project.set("logo", this.form.img);
      project.set("background", this.form.img1);
      project.set("userUnit", this.form.department);
      if (this.form.dashboard != "") {
        project.set("dashboard", "http://" + this.form.dashboard);
      } else {
        project.set("dashboard", "");
      }
      project.save().then(resultes => {
        if (resultes) {
    
          var sourceId = this.relationAppObjectId; 
          var destId =  resultes.id;

          //添加关联
          this.addRelation(destId,sourceId);
        }
      }).catch(error =>{
        // Maybe it's title重复
        this.$message(JSON.stringify(error))

      });
    },
    addRelation(destObjectId, sourceObjectId) {
 /*       this.$axiosWen
        .put("/classes/Project/" + destObjectId, {
          app: {
            __op: "AddRelation",
            objects: [
              {
                __type: "Pointer",
                className: "App",
                objectId: sourceObjectId //被关联的应用记录的id
              }
            ]
          }
        })
        .then(function(response) {
          console.log("addRelation", response);
        })
        .catch(function(error) {
          console.log("addRelation", error);
        }); 
            dest:{          
              className:'Project',
              objectId:destObjectId,
              fieldName:'app'
          },
          src:{
            className:'App',            
            objectId:sourceObjectId,
          }   */
          

        
        this.$axiosWen.post("/relation",{    
          destClass: "Project",
          destId: destObjectId,
          destField: "app",
          srcClass: "App",
          srcId: sourceObjectId
        })
        .then((response) => {
          this.$message({
            message: "添加部署成功！",
            type: "success"
          });
          
          this.$router.push({ path: "/roles/projectManagement" });


        })
        .catch((error) => {
          this.$message(error)
          console.log("addRelation", error);
        });

/* 
        this.$axiosWen.post("/approle",{
          appid:'YqtGTfll9w',
          desc:'ds',
          secret:'RDc4MjQ1NzYxNTg5NDU3ODMyNzUx'
         } )
        .then((response) => {

          console.log('approle response',response);         
       

        })
 */
 
        

        // 通过objectId来查询
 /*        var App = Parse.Object.extend("App");
        var appQuery = new Parse.Query(App);
        var app = new App()

        app.id = relTableRowByObjectId

        appQuery.equalTo("app", app)

        // 构建project对象
        var Project = new Parse.Object("Project");

        

        // 为book对象关联作者
        var relation = Project.relation("app");
        relation.add(authorOne);
 */

    },
    // 修改
    handleClickUpdate() {
      if (!this.isSubmit()) {
        return;
      }
      var Project = Parse.Object.extend("Project");
      var project = new Project();
      project.id = this.argu.objectId;

      var Product = Parse.Object.extend("Product");
      var product = new Product();
      var acl = new Parse.ACL();

      acl.setRoleReadAccess(this.form.relationApp, true);
      acl.setRoleWriteAccess(this.form.relationApp, true);

      project.set("ACL", acl);
      // var relation = project.relation("product");
      // this.form.product.map(item => {
      //   product.set("objectId", item);
      //   relation.add(product);
      // });
      project.set("title", this.form.name);
      project.set("category", this.form.category.join("/"));
      project.set("scale", this.form.scale);
      project.set("productIdentifier", this.form.productIdentifier);
      project.set("copyright", this.form.copyright);
      project.set("desc", this.form.desc);
      project.set("logo", this.form.img);

      project.set("background", this.form.img1);
      project.set("userUnit", this.form.department);
      // project.set('user',user)
      if (this.form.dashboard != "") {
        project.set("dashboard", "http://" + this.form.dashboard);
      } else {
        project.set("dashboard", "");
      }
      project.save().then(resultes => {
        if (resultes) {
          this.$message({
            message: "修改成功！",
            type: "success"
          });
          this.$router.push({ path: "/roles/projectManagement" });
        }
      });
    },
    // 获取行业信息
    Industry() {
      this.form.options = [];
      var Dict = Parse.Object.extend("Dict");
      var datas = new Parse.Query(Dict);
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
          this.$message(error.message);
        }
      );
    },
    // 获取应用列表
    getApplication() {
      return new Promise((resolve, reject) => {
        var App = Parse.Object.extend("App");
        var query = new Parse.Query(App);
        var _this = this;
        query.limit(100);
        query.find().then(
          response => {
            if (response) {
              resolve(response);
            }
          },
          error => {
            reject(error);
          }
        );
      });
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
