<template>
  <div class="application">
    <div class="addApplication" />
    <div
      class="appcontent"
      style="position:relative;display:flex;flex-direction:column;align-items:center"
    >
      <!-- <div class="isbutton">
        <el-button
          icon="el-icon-circle-plus-outline"
          round
          @click="dialogVisible = true"
        >添加新应用</el-button
        >
      </div> -->
      <el-card
        v-for="(item, index) in appdata"
        :key="index"
        class="box-card"
        style="width:80%;border:1px solid #cccccc;margin-bottom:10px"
      >
        <el-row :gutter="24">
          <el-col :span="4">
            <div class="grid-content bg-purple">
              <i class="iconfont icon-yingyong" style="color:#666666" />
              <p>{{ item.name }}</p>
            </div>
          </el-col>
          <el-col :span="16">
            <div class="grid-content bg-purple">
              <dl>
                <dt>
                  App ID
                  <el-tooltip
                    content="在SDK调用过程中唯一的一个应用标识"
                    placement="bottom"
                  >
                    <i class="el-icon-question" />
                  </el-tooltip>
                </dt>
                <dd>{{ item.objectId }}</dd>
                <dt>
                  App Secret
                  <el-tooltip
                    content="调用API时的Token,用来验证请求合法性,请注意保密"
                    placement="bottom"
                  >
                    <i class="el-icon-question" />
                  </el-tooltip>
                </dt>
                <dd v-if="item.isshow">{{ item.tag.appconfig.secret }}</dd>
                <dd v-if="!item.isshow">
                  <i v-if="item.tag.appconfig.secret">
                    {{
                      item.tag.appconfig.secret.substr(0, 4) +
                        "********************" +
                        item.tag.appconfig.secret.substr(24)
                    }}
                    <el-button

                      size="samll"
                      style="margin-left:10px;position:absolute;top:30px"
                      round
                      @click="xianshi(item.objectId)"
                      >完整密钥</el-button
                    >
                </i>
                </dd>
                <dt>应用名称</dt>
                <dd v-if="item.name">{{ item.name }}</dd>
                <dd v-else>-</dd>
              </dl>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple">
              <p class="editor">
                <strong>操作:</strong>
              </p>
              <p class="editor">
                <el-link type="primary" @click="updateapp(item)"
                  >修改应用</el-link
                >
              </p>
              <!-- <p class="editor">
                <el-link
                  type="primary"
                  @click="deleteapp(item.id)"
                >删除应用</el-link
                >
              </p> -->
              <p class="editor">
                <el-link type="primary" @click="nodeDeployment(item)"
                  >节点部署</el-link
                >
              </p>
              <p class="editor">
                <el-link type="primary" @click="applicationDeployment(item)"
                  >应用部署</el-link
                >
              </p>
            </div>
          </el-col>
        </el-row>
      </el-card>
      <el-pagination
        :page-sizes="[1, 5, 10]"
        :page-size="pagesize"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!--新建弹框-->
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      title="添加应用"
      width="55%"
    >
      <div
        v-loading="loading"
        class="block"
        element-loading-text="正在等待返回"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <el-form ref="form" :rules="Rule" :model="form" label-width="120px">
          <!-- <el-form-item label="平台">
                <el-select v-model="form.product" placeholder="请选择平台"  style="width:80%">
                  <el-option v-for="(item,index) in selectapp" :key="index" :label="item.attributes.subtitle" :value="item.id"></el-option>
               </el-select>
          </el-form-item>-->
          <el-form-item label="应用名称" prop="desc">
            <el-input
              v-model="form.desc"
              style="width:80%"
              placheholder="请输入应用名称"
            />
          </el-form-item>
          <el-form-item label="Token有效时间">
            <el-input
              v-model="form.time"
              type="number"
              style="width:80%"
              placheholder="请输入应用时间"
            />
            <span style="margin-left:5px;">秒</span>
          </el-form-item>

          <el-form-item label="文件资源" prop="file">
            <el-input
              v-model="form.file"
              style="width:80%"
              placheholder="请输入url"
            />
          </el-form-item>

          <el-form-item label="组态资源" prop="topo">
            <el-input
              v-model="form.topo"
              style="width:80%"
              placheholder="请输入url"
            />
          </el-form-item>

          <el-form-item label="Graphql API" prop="graphql">
            <el-input
              v-model="form.graphql"
              style="width:80%"
              placheholder="请输入url"
            />
          </el-form-item>

          <el-form-item label="Restful API" prop="rest">
            <el-input
              v-model="form.rest"
              style="width:80%"
              placheholder="请输入url"
            />
          </el-form-item>

          <el-form-item label="home">
            <el-input
              v-model="form.home"
              style="width:80%"
              placheholder="请输入路径"
            />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="Define('form')">确 定</el-button>
      </span>
    </el-dialog>

    <!--修改应用信息-->
    <el-dialog
      :visible.sync="update"
      :close-on-click-modal="false"
      title="修改应用信息"
      width="55%"
    >
      <div class="block">
        <el-form ref="form1" :rules="Rule" :model="form1" label-width="120px">
          <!-- <el-form-item label="应用名称" prop="desc">
            <el-input v-model="form1.desc" style="width:80%" />
          </el-form-item> -->
          <el-form-item label="访问密钥">
            <el-input v-model="form1.secret" style="width:80%" readonly>
              <el-button
                slot="append"
                icon="el-icon-refresh-right"
                @click="handleClickRefresh"
              />
            </el-input>
          </el-form-item>
          <el-form-item label="Token有效时间">
            <el-input
              v-model="form1.time"
              type="number"
              style="width:80%"
              placheholder="请输入应用时间"
            />
            <span style="margin-left:5px;">秒</span>
          </el-form-item>

          <el-form-item label="文件资源" prop="file">
            <el-input
              v-model="form1.file"
              style="width:80%"
              placheholder="请输入url"
            />
          </el-form-item>

          <el-form-item label="组态资源" prop="topo">
            <el-input
              v-model="form1.topo"
              style="width:80%"
              placheholder="请输入url"
            />
          </el-form-item>

          <el-form-item label="Graphql API" prop="graphql">
            <el-input
              v-model="form1.graphql"
              style="width:80%"
              placheholder="请输入url"
            />
          </el-form-item>

          <el-form-item label="Restful API" prop="rest">
            <el-input
              v-model="form1.rest"
              style="width:80%"
              placheholder="请输入url"
            />
          </el-form-item>

          <el-form-item label="home">
            <el-input
              v-model="form1.home"
              style="width:80%"
              placheholder="请输入路径"
            />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="update = false">取 消</el-button>
        <el-button type="primary" @click="updatedDefine('form1')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
const Base64 = require("js-base64").Base64;
import { Addapp, createRole } from "@/api/appcontrol";
import Parse from "parse";
export default {
  inject: ["reload"],
  data() {
    const validatorUrl = (rule, value, callback) => {
      var regStr = /^(((ht|f)tps?):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;
      if (value === "" || value === null) {
        callback(new Error("请输入url地址"));
      } else if (!regStr.test(value)) {
        callback(new Error("请输入正确的url地址"));
      } else {
        callback();
      }
    };
    return {
      total: 0,
      pagesize: 10,
      start: 0,
      update: false,
      form1: {
        name: "",
        product: "",
        time: "",
        file: "",
        graphql: "",
        rest: "",
        topo: "",
        secret: "",
        desc: "",
        home: ""
      },
      dialogVisible: false,
      form: {
        name: "",
        product: "",
        time: "18000",
        file: "http://file.iotn2n.com/shapes/upload",
        graphql: "http://cad.iotn2n.com:5080/iotapi/graphql",
        rest: "http://cad.iotn2n.com:5080/iotapi",
        topo: "http://shapes.iotn2n.com/",
        secret: "",
        home: "D:/shuwa/shuwa_data_center"
      },
      Rule: {
        desc: [
          { required: true, message: "请输入应用名称", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (value.length === 0) {
                callback(new Error("应用名称不能为空"));
              } else {
                callback();
              }
            }
          }
        ],
        file: [{ trigger: "blur", validator: validatorUrl }],
        topo: [{ trigger: "blur", validator: validatorUrl }],
        graphql: [{ trigger: "blur", validator: validatorUrl }],
        rest: [{ trigger: "blur", validator: validatorUrl }]
      },
      appdata: [],
      objectid: "",
      selectapp: [],
      arr: [],
      loading: false
    };
  },
  created() {},
  //   watch:{
  //      appdata:{
  //          handler(newVal) {
  //          console.log(newVal)
  //       },
  //       deep:true
  //      }

  //   },
  mounted() {
    this.getAppdetail(this.pagesize, this.start);

    console.log("this.$route.query", this.$route.query);

    if (this.$route.query && this.$route.query.projectName) {
      this.dialogVisible = true;
      this.form.desc = this.$route.query.projectName;
    }
  },
  methods: {
    Define(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.submit();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    submit() {
      this.loading = true;
      var ranNum = Math.ceil(Math.random() * 25);
      var session = Base64.encode(
        String.fromCharCode(65 + ranNum) +
          Math.ceil(Math.random() * 10000000) +
          Number(new Date())
      );

      const formParam = {
        file: this.form.file,
        graphql: this.form.graphql,
        rest: this.form.rest,
        topo: this.form.topo,
        home: this.form.home
      };

      Addapp(Number(this.form.time), this.form.desc, session, formParam)
        .then(resultes => {
          if (resultes) {
            //   createRole(resultes.objectId,session,this.form.desc).then(response=>{
            this.$message({
              type: "success",
              message: "应用创建成功"
            });
            this.loading = false;
            this.dialogVisible = false;
            this.getAppdetail(this.pagesize, this.start);
            //  })
          }
        })
        .catch(error => {
          this.$message({
            type: "error",
            message: error.error
          });
          this.loading = false;
          this.dialogVisible = false;
        });
    },
    getAppdetail(pagesize, start) {
      console.log(pagesize, start);
      this.$axiosWen
        .get("classes/_Role", {
          params: {
            skip: start,
            limit: pagesize,
            keys: "tag,name,desc,count(*)",
            order: "updatedAt" // -updatedAt  updatedAt
          }
        })
        .then(res => {
          this.appdata = res.results;
          this.appdata.map(item => {
            if(item.tag.appconfig.secret){
              item.isshow = false;
            }
          });
          this.total = res.count;
          console.log(this.appdata, "appdata");
        })
        .catch(e => {
          console.log(e);
        });
      // var App = Parse.Object.extend("_Role");
      // var app = new Parse.Query(App);
      // app.limit(pagesize);
      // app.skip(start);
      // app.ascending("-updatedAt");
      // app.count().then(count => {
      //   this.total = count;
      //   app.find().then(resultes => {
      //     this.appdata = resultes.concat([]);
      //     this.appdata.map(item => {
      //       // item.desc = object.attributes.desc
      //       item.isshow = false;
      //       // this.selectapp.map(object=>{
      //       //    if(item.attributes.product.id==object.id){

      //       //    }
      //       // })
      //     });
      //     console.log(this.appdata, "appdata");
      //   });
      // });
    },
    handleClickRefresh() {
      this.randomSecret();
    },

    // 产生随机secrets
    randomSecret() {
      const ranNum = Math.ceil(Math.random() * 25);
      this.form1.secret = Base64.encode(
        String.fromCharCode(65 + ranNum) +
          Math.ceil(Math.random() * 10000000) +
          Number(new Date())
      );
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.getAppdetail(this.pagesize, this.start);
    },
    handleCurrentChange(val) {
      this.start = Number(val - 1) * Number(this.pagesize);
      this.getAppdetail(this.pagesize, this.start);
    },
    updateapp(item) {
      this.update = true;
      this.form1.objectId = item.objectId;
      this.form1.time = item.tag.appconfig.expires;
      this.form1.file = item.tag.appconfig.file;
      this.form1.rest = item.tag.appconfig.rest;
      this.form1.topo = item.tag.appconfig.topo;
      this.form1.graphql = item.tag.appconfig.graphql;
      this.form1.home = item.tag.appconfig.home;

      this.form1.secret = item.tag.appconfig.secret;
      this.form1.desc = item.tag.appconfig.desc;
    },
    updatedDefine(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.updateObj(this.form1.objectId);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    updateObj(objectId) {
      // var App = Parse.Object.extend("App");
      // var app = new Parse.Query(App);
      // // 修改
      // app.get(this.objectid).then(object => {
      //   const formParam = {
      //     expires: this.form1.time,
      //     file: this.form1.file,
      //     graphql: this.form1.graphql,
      //     rest: this.form1.rest,
      //     topo: this.form1.topo,
      //     home: this.form1.home
      //   };
      //   object.set("config", formParam);
      //   object.set("secret", this.form1.secret);
      //   object.set("desc", this.form1.desc);
      //   object.set("name", this.form1.desc);
      //   object.save().then(
      //     resultes => {
      //       this.$message({
      //         type: "success",
      //         message: "应用修改成功"
      //       });
      //       this.update = false;
      //       this.getAppdetail(this.pagesize, this.start);
      //       // this.reload()
      //     },
      //     error => {
      //       console.log(error);
      //     }
      //   );
      // });
      const formParam = {
        expires: this.form1.time,
        file: this.form1.file,
        graphql: this.form1.graphql,
        rest: this.form1.rest,
        topo: this.form1.topo,
        home: this.form1.home,
        secret: this.form1.secret
      };
      var tag = {
        appconfig: {}
      };
      tag.appconfig = formParam;
      console.log(tag.appconfig);
      this.$axiosWen
        .put("classes/_Role/" + objectId, {
          tag
        })
        .then(res => {
          this.$message({
            type: "success",
            message: "应用修改成功"
          });
          this.getAppdetail(10,0)
          this.update = false;
        })
        .catch(e => {
          this.$message({
            type: "error",
            message: "应用修改失败" + e.error
          });
          console.log(e);
        });
    },
    deleteapp(id) {
      this.$confirm("此操作将永久删除该应用, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var App = Parse.Object.extend("App");
          var app = new Parse.Query(App);
          app.get(id).then(object => {
            object.destroy().then(response => {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getAppdetail(this.pagesize, this.start);
              // this.reload()
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 跳转新增
    nodeDeployment(row) {
      console.log(row)
      this.$router.push({
        path: "/roles/server_control",
        query: {
          appid: row.objectId,
          appsecret: row.tag.appconfig.secret
        }
      });
    },
    applicationDeployment(row) {
      this.$router.push({
        path: "/applicationManagement/addApp",
        query: {
          actionType: "add",
          title: "新增应用",
          appObjectId: row.objectId,
          desc: row.desc,
          name: row.name
        }
      });
    },
    // 显示，隐藏
    xianshi(objectId) {
      // console.log(objectId)
      var obj;
      for (var i = 0; i < this.appdata.length; i++) {
        if (this.appdata[i].objectId == objectId) {
          obj = this.appdata[i];
          this.appdata[i].isshow = true;
          this.$set(this.appdata, i, obj);
        }
      }
    }
  }
};
</script>
<style scoped lang="scss">
.application {
  width: 100%;
  min-height: 850px;
  padding: 20px 20px 40px 20px;
  box-sizing: border-box;
  background: #ffffff;
  box-sizing: border-box;
  .addApplication {
    width: 100%;
    height: 50px;
  }
}
</style>
<style>
.application .el-dialog__body {
  padding: 20px;
  border-bottom: 1px solid #333333;
}
.application .el-dialog__header {
  border-bottom: 1px solid #333333;
}
.application .el-dialog__title {
  font-size: 20px;
  font-weight: 900;
}
.application .el-dialog {
  border-radius: 10px;
}
.application .grid-content {
  text-align: center;
}
.application .grid-content dl dt {
  font-weight: 700;
  float: left;
  width: 160px;
  overflow: hidden;
  clear: left;
  text-align: right;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.application .grid-content dl dd {
  margin-left: 180px;
  margin-bottom: 1em;
  text-align: left;
}
.application .grid-content .editor {
  text-align: left;
  margin: 13px 0;
}
.application .el-card__body {
  font-size: 14px;
}
.application .appcontent .isbutton .el-button {
  position: absolute;
  top: -45px;
  right: 10%;
}
</style>
