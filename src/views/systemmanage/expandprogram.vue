<template>
  <div class="things-parse">
    <el-dialog :visible.sync="apiDialog" title="新增Api" width="15%">
      <el-form
        ref="formLabelAlign"
        :rules="rules"
        :model="formLabelAlign"
        size="mini"
        label-position="left"
        label-width="80px"
      >
        <el-form-item label="模块名称" prop="name">
          <el-input v-model="formLabelAlign.name" />
        </el-form-item>
        <el-form-item label="编程语言" prop="language">
          <el-select v-model="formLabelAlign.language" placeholder="活动区域">
            <el-option
              v-for="item in formLabelAlign.languageList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          size="mini"
          @click="submitFormApi('formLabelAlign')"
        >创建</el-button
        >
        <el-button size="mini" @click="apiDialog = false">取消</el-button>
      </span>
    </el-dialog>
    <el-row :gutter="24">
      <el-col :span="6">
        <el-button type="primary" @click="addApi">新增Api</el-button>
        <el-table
          ref="singleTable"
          :data="AllDict"
          highlight-current-row
          style="width: 100%"
          @current-change="handleCurrentChange"
        >
          <el-table-column label="类型" width="100">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.type }}</span>
            </template>
          </el-table-column>
          <el-table-column label="mod" width="100">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.mod }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleTest(scope.$index, scope.row.type, scope.row.mod)"

              >调测</el-button
              >
              <el-button
                size="mini"
                type="primary"
                @click="handleRelease(scope.$index,scope.row.type, scope.row.mod)"
              >发布</el-button
              >
              <el-button
                size="mini"
                type="danger"
                @click="
                  handleDelete(scope.$index, scope.row.type, scope.row.mod)
                "
              >下架</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="18">
        <!-- <el-tab-pane label="物解析" name="fourth"> -->
        <div class="protolheader">
          <el-tabs v-model="activeName">
            <el-tab-pane label="设计" name="design">

              <json-edit ref="jsonEditor" v-model="itemSwagger" />
            </el-tab-pane>
            <el-tab-pane label="编码" name="code">
              <el-form
                ref="thingsParseModel"
                :inline="true"
                :model="thingsParseModel"
                :rules="thingsParseRules"
              />
              <div>
                <div style="background:#ffffff">
                  <label id="plug-name" />
                </div>
                <pre
                  id="editor"
                  class="ace_editor"
                  style="min-height:480px;margin-bottom:0;"
                ><textarea class="ace_text-input" /></pre>
                <div style="background:#ffffff">
                  <label id="plug-name" />
                </div>
                <div
                  style="color:#c2be9e;background:#272822;border-top:1px solid #dddddd;padding:5px;margin-right: 80px;"
                >
                  <span>{{ $t("product.controloutput") }}</span>
                </div>
                <pre
                  id="editor2"
                  class="ace_editor"
                  style="min-height:200px;margin-bottom:0;margin-top:0"
                ><textarea class="ace_text-input" /></pre>
              </div>
            </el-tab-pane>

            <el-tab-pane label="测试" name="swagger">
              <iframe
                :src="swaggerPath"
                width="100%"
                height="700vh"
              />
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
    </el-row>
    <!-- </el-tab-pane> -->
  </div>
</template>
<script>
import jsonEdit from "./jsonEdit/index";
import Parse from "parse";
const Base64 = require("js-base64").Base64;
var isupdatetrue = "";
var editor;
var editor1;
var editor2;
var editorgraphql;
var editor5;
var editor6;
var subdialog;
var editormodel;
var editorcreate;
var editorinsert;
var editorsubtable;
var channelrow = {};
var setdata = "";
var isallchannel = false;
import { Compile, subupadte } from "@/api/System/index.js";
import { returnLogin } from "@/utils/return";
export default {
  name: "ThingsParse",
  components: { jsonEdit },
  props: {},
  data() {
    var validCode = (rule, value, callback) => {
      const reg = /[0-9a-zA-Z]/;
      if (!reg.test(value)) {
        callback(new Error("协议名称由数字和字母组合"));
      } else {
        callback();
      }
    };

    return {
      fullscreenLoading: false,
      rules: {
        name: [{ required: true, validator: validCode, trigger: "blur" }],
        language: [
          { required: true, message: "请选择编程语言", trigger: "change" }
        ]
      },
      labelPosition: "right",
      formLabelAlign: {
        languageList: ["python", "java", "ruby"],
        language: "python",
        name: "",
        region: "",
        type: ""
      },
      apiDialog: false,
      activeName: "design",
      itemSwagger: {},
      currentRow: null,
      AllDict: [],
      productName: "",
      form: {
        Productname: "",
        ProductKey: "",
        ProductAll: 0
      },
      swaggerPath: '',
      decoderstart: 0,
      decodertotal: 0,
      decoderlength: 10,
      protolchannel: [],
      productdetail: {},
      thingsParseModel: {
        name: "",
        version: "",
        desc: "",
        resource: false
      },
      thingsParseRules: {
        name: [
          {
            required: true,
            message: "请输入协议名称",
            trigger: "blur"
          },
          {
            validator: validCode,
            trigger: "blur"
          }
        ]
      },
      dialogTableVisible: false,
      gridData: [],
      protoldialog: false
    };
  },
  computed: {
    tableFilterData() {
      return null;
    }
  },
  mounted() {
    const hostIncludes = ["192.168.2.69", "192.168.2.58", "127.0.0.1", "localhost"]
    const { hostname } = location

    if (!hostIncludes.includes(hostname)) {
      this.swaggerPath = hostname + '' + ':5080/swagger/#/'
    } else {
      this.swaggerPath = 'http://pump.iotn2n.com:5080/swagger/#/'
    }
    console.log(` this.swaggerPath is ${this.swaggerPath}`)

    // editor编辑器使用
    editor2 = ace.edit("editor2");
    editor2.session.setMode("ace/mode/python"); // 设置语言
    editor2.setTheme("ace/theme/monokai"); // 设置主题
    editor2.setReadOnly(true);
    editor2.setOptions({
      enableBasicAutocompletion: true,
      enableSnippets: true,
      enableLiveAutocompletion: true // 设置自动提示
    });
    // this.Industry();
    // this.getAllunit();
    this.getAllDict();
    if (this.$route.query.activeName) {
      this.activeName = this.$route.query.activeName;
    }
  },
  methods: {
    // 李宏杰新增   下架api
    handleDelete(index, type, mod) {
      this.$confirm("确认要下架该api吗？")
        .then(_ => {
          this.$axiosWen
            .delete("iotapi/exproto", {
              params: {
                type: type,
                mod: mod,
                version: "debug"
              }
            })
            .then(res => {
              console.log(res);
              this.AllDict.splice(index, 1);
            })
            .catch(e => {
              console.log(e);
            });
        })
        .catch(_ => {});
    },

    // 调试api
    handleTest(index, Rtype, mod) {
      const mData = {
        code: Base64.encode(editor.getValue()),
        mod: mod,
        swagger: JSON.parse(this.itemSwagger),
        type: Rtype
      };
      console.log('itemSwagger===', mData);
      this.$axiosWen
        .put("iotapi/exproto", mData)
        .then(res => {
          console.log(res.results);
          editor2.setValue(Base64.decode(res.results))
          this.$message({
            showClose: true,
            message: '调测api成功',
            type: 'success'
          });
        })
        .catch(e => {
          console.log(e);
          this.$message.error('api有错误,请检查');
        })
    },

    // 发布api
    handleRelease(index, Rtype, mod) {
      const mData = {
        code: Base64.encode(editor.getValue()),
        mod: mod,
        swagger: JSON.parse(this.itemSwagger),
        type: Rtype
      };
      console.log('itemSwagger===', mData);
      this.$axiosWen
        .post("iotapi/release_exproto", mData)
        .then(res => {
          console.log(res);
          this.$message({
            showClose: true,
            message: '发布api成功',
            type: 'success'
          });
        })
        .catch(e => {
          console.log(e);
          this.$message.error('api有错误,请检查');
        })
    },
    /**
       *
       * @param addApi
       */
    addApi() {
      this.apiDialog = true;
    },
    /**
       *
       * @param 提交创建的接口
       */
    submitFormApi(form) {
      this.$refs[form].validate(valid => {
        const languageList = {
          python:
              "IyBjb2Rpbmc9dXRmOAppbXBvcnQgb3MKCmRlZiBwb3N0KGFyZ3Msc2Vzc2lvbixlbnYpOgogICAgI2JvZHkgPSBqc29uLmxvYWRzKGJhc2U2NC5iNjRkZWNvZGUoYXJncykuZGVjb2RlKCJ1dGYtOCIpKQogICAgI3ByaW50KGJvZHkpCiAgICAjc3RyYm9keSA9ICd7fScuZm9ybWF0KGJvZHkpCiAgICAjZW5ib2R5ID0gIGJhc2U2NC5iNjRlbmNvZGUoc3RyYm9keS5lbmNvZGUoJ3V0Zi04JykpCiAgICAjcHJpbnQoZW5ib2R5KQogICAgI3N0YXRlID0ganNvbi5sb2FkcyhiYXNlNjQuYjY0ZGVjb2RlKGVudikuZGVjb2RlKCJ1dGYtOCIpKQogICAgI3ByaW50KHN0YXRlKQogICAgIyByZXN0dXJsID0gc3RhdGVbJ3JvbGVzJ11bMF1bJ3RhZyddWydhcHBjb25maWcnXVsncmVzdCddCiAgICAjIHByaW50KHJlc3R1cmwpCiAgICAjIHMuaGVhZGVycy51cGRhdGUoeyJzZXNzaW9uVG9rZW4iOiBzZXNzaW9uLCAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nfSkKICAgICMgcnQgPSBzLmdldCgne30vY2xhc3Nlcy9EZXZpY2U/b3JkZXI9Y3JlYXRlZEF0JmxpbWl0PTEwJnNraXA9MCcuZm9ybWF0KHJlc3R1cmwpLAogICAgIyAgICAgICAgICAgICAgcGFyYW1zPXsnb3JkZXInOiAnY3JlYXRlZEF0JywgfSkKICAgICMgZm9yIHJvdyBpbiAocnQuanNvbigpWydyZXN1bHRzJ10pOgogICAgIyAgICAgcHJpbnQocm93KQogICAgcHJpbnQoYXJncykKICAgIHByaW50KHNlc3Npb24pCiAgICBwcmludChlbnYpCiAgICByZXR1cm4gYXJncwoKZGVmIG1haW4oKToKICAgICN7Im5hbWUiOiJzaHV3YSJ9CiAgICBhcmd2cyA9ICdleUp1WVcxbElqb2ljMmgxZDJFaWZRPT0nCiAgICByZXR1cm4gIHBvc3QoYXJndnMsICdzZXNzaW9uJywnZW52JykKCmRlZiBleGl0KCk6CiAgICBvcy5fZXhpdCgwKQoKaWYgX19uYW1lX18gPT0gIl9fbWFpbl9fIjoKICAgIG1haW4oKQ==",
          java: "",
          ruby: ""
        };
        const pythonName = "/python_" + this.formLabelAlign.name
        const initParams = {
          code: languageList[this.formLabelAlign.language],
          mod: this.formLabelAlign.name,
          swagger: {

            definitions: {},
            paths: {
              "/python_hello": {
                post: {
                  description: "Python测试API",
                  parameters: [
                    {
                      description: "生成报告",
                      in: "body",
                      name: "data",
                      required: true,
                      schema: {
                        properties: {
                          name: {
                            description: "姓名",
                            example: "shuwa",
                            required: true,
                            type: "string"
                          }
                        },
                        type: "object"
                      }
                    }
                  ],
                  responses: {
                    "200": {
                      description: "Returns operation status"
                    },
                    "400": {
                      description: "Bad Request"
                    },
                    "401": {
                      description: "Unauthorized"
                    },
                    "403": {
                      description: "Forbidden"
                    },
                    "500": {
                      description: "Server Internal error"
                    }
                  },
                  summary: "Python测试API",
                  tags: [
                    "EXPROTO"
                  ]
                }
              }

            },
            tags: [
              {
                description: "扩展编程",
                name: "EXPROTO"
              }
            ]
          },

          type: this.formLabelAlign.language
        };
        if (valid) {
          this.$axiosWen
            .post("iotapi/exproto", initParams)
            .then(r => {
              this.apiDialog = false;
              this.$message({
                type: "success",
                message: "新增api成功"
              });
              this.getAllDict();
            })
            .catch(e => {
              this.$message({
                type: "error",
                message: "新增api失败" + e
              });
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleCurrentChange(val) {
      console.log(val);
      this.itemSwagger = val.swagger;
      // this.currentRow = val.code;
      // this.$refs.singleTable.setCurrentRow(val.code);
      editor = ace.edit("editor");
      editor.session.setMode("ace/mode/python"); // 设置语言
      editor.setTheme("ace/theme/monokai"); // 设置主题
      editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true // 设置自动提示
      });
      editor.setValue(Base64.decode(val.code));
      editor.gotoLine(editor.session.getLength());
      // this.getProDetail(val.objectId);
    },
    toggle(type) {
      console.log(type);
    },
    getAllDict() {
      this.$axiosWen
        .get("iotapi/exproto", {
          params: {
            type: "python",
            mod: "all",
            version: "debug"
          }
        })
        .then(res => {
          this.AllDict = res.results;
          console.log(this.AllDict);
          this.handleCurrentChange(res.results[0]);
        })
        .catch(e => {
          console.log(e);
        });
    },
    Industry() {
      this.option = [];
      var Dict = Parse.Object.extend("Dict");
      var datas = new Parse.Query(Dict);
      datas.equalTo("data.key", "category");

      datas.limit(1000);
      datas.find().then(
        response => {
          if (response) {
            response.map(items => {
              var obj = {};
              obj.value = items.attributes.type;
              obj.label = items.attributes.data.CategoryName;
              obj.id = items.attributes.data.Id;
              obj.parentid = items.attributes.data.SuperId;
              this.option.push(obj);
            });
          }
        },
        error => {
          this.$message(error.message);
        }
      );
    },
    // 得到产品详情
    getProDetail(productId) {
      this.productId = productId;
      editor = ace.edit("editor");
      editor.session.setMode("ace/mode/python"); // 设置语言
      editor.setTheme("ace/theme/monokai"); // 设置主题
      editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true // 设置自动提示
      });

      // editor6 = ace.edit("editor6");
      // editor6.session.setMode("ace/mode/json"); // 设置语言
      // editor6.setTheme("ace/theme/twilight"); // 设置主题
      // editor6.setOptions({
      //   enableBasicAutocompletion: true,
      //   enableSnippets: true,
      //   enableLiveAutocompletion: true // 设置自动提示
      // });
      var Product = Parse.Object.extend("Product");
      var product = new Parse.Query(Product);
      product.get(productId).then(
        response => {
          if (response) {
            this.productName = response.attributes.name;
            for (var key in response.attributes) {
              this.productdetail[key] = response.attributes[key];
            }
            this.option.map(items => {
              if (this.productdetail.category == items.value) {
                this.productdetail.category = items.label;
              }
            });
            this.productdetail.createdAt = this.utc2beijing(response.createdAt);
            this.productdetail.id = response.id;
            this.dynamicReg = response.attributes.dynamicReg;
            this.productdetail.isshow = 0;
            this.form.Productname = response.attributes.name;
            this.ProductSecret = response.attributes.productSecret;
            this.form.Productkey = this.productId;
            // window.location.origin
            this.productimg = response.attributes.icon;
            if (response.attributes.decoder) {
              setdata = response.attributes.decoder.code;
              this.thingsParseModel.name = response.attributes.decoder.name;
              this.thingsParseModel.version =
                  response.attributes.decoder.version;
              this.thingsParseModel.desc = response.attributes.decoder.desc;
            } else {
              var str =
                  "IyBjb2Rpbmc9dXRmOAppbXBvcnQgc3lzCmltcG9ydCBvcwppbXBvcnQgcmVxdWVzdHMKaW1wb3J0IGpzb24KaW1wb3J0IGJhc2U2NAppbXBvcnQgbWF0cGxvdGxpYi5weXBsb3QgYXMgcGx0CmZyb20gcHlsYWIgaW1wb3J0IG1wbAppbXBvcnQgbWF0aAoKZ3JvdXBTZXNzaW9uID0gJycKaG9zdCA9ICdwdW1wLmlvdG4ybi5jb206MTMzNycKcyA9IHJlcXVlc3RzLnNlc3Npb24oKQpob3N0ID0gJ3B1bXAuaW90bjJuLmNvbScKCmRlZiBsb2dpbigpOgogICAgdXJsID0gJ2h0dHA6Ly97fTo1MDgwL2lvdGFwaS9sb2dpbicuZm9ybWF0KGhvc3QpCiAgICBoZWFkZXJzID0geydhY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbicsIkNvbnRlbnQtVHlwZSI6ICJ0ZXh0L3BsYWluIn0KICAgIGJvZHkgPSB7InVzZXJuYW1lIjonbGlvdV96aCcsInBhc3N3b3JkIjonbGlvdV96aCd9CiAgICByID0gcy5wb3N0KHVybCwgaGVhZGVycz1oZWFkZXJzLCBkYXRhPWpzb24uZHVtcHMoYm9keSkpCiAgICB0ID0gci5jb250ZW50ICAjIOivu+WPlui/lOWbnueahOWGheWuuQogICAgdCA9IGpzb24ubG9hZHModCkgICMg6Kej56CBSlNPTuWvueixoQogICAgZ3JvdXBTZXNzaW9uID0gci5qc29uKClbJ3Nlc3Npb25Ub2tlbiddCiAgICBzLmhlYWRlcnMudXBkYXRlKHsic2Vzc2lvblRva2VuIjogZ3JvdXBTZXNzaW9uLCAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nfSkKCmRlZiBkZXZpY2UoKToKICAgIHJ0ID0gW10KICAgIGRhdGEgPSBzLmdldCgnaHR0cDovL3t9OjUwODAvaW90YXBpL2RldmljZS9lOTZlZWE5YWU1Jy5mb3JtYXQoaG9zdCksCiAgICAgICAgICAgICAgICAgcGFyYW1zPXsnb3JkZXInOiAnY3JlYXRlZEF0JywgfSkKICAgIGZvciByb3cgaW4gKGRhdGEuanNvbigpWydyZXN1bHRzJ10pOgogICAgICAgIHByaW50KHJvdykKICAgIHJldHVybiBydAoKZGVmIHVwbG9hZCgpOgogICAgdXJsID0gJ2h0dHA6Ly97fTo1MDgwL2lvdGFwaS9sb2dpbicuZm9ybWF0KGhvc3QpCiAgICBoZWFkZXJzID0geydhY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbicsICJDb250ZW50LVR5cGUiOiAidGV4dC9wbGFpbiJ9CiAgICBib2R5ID0geyJ1c2VybmFtZSI6ICdsaW91X3poJywgInBhc3N3b3JkIjogJ2xpb3VfemgnfQogICAgciA9IHMucG9zdCh1cmwsIGhlYWRlcnM9aGVhZGVycywgZGF0YT1qc29uLmR1bXBzKGJvZHkpKQogICAgZ3JvdXBTZXNzaW9uID0gci5qc29uKClbJ3Nlc3Npb25Ub2tlbiddCiAgICB1cmwgPSAnaHR0cDovL3t9OjEyNTAvc2hhcGVzL3VwbG9hZCcuZm9ybWF0KGhvc3QpCiAgICBmaWxlcyA9IHsnZmlsZSc6IG9wZW4oJ3BsYXRmb3JtLnBuZycsJ3JiJyl9CiAgICBvcHRpb25zID0geydvdXRwdXQnOiAnanNvbicsICdwYXRoJzogJycsICdzY2VuZSc6ICdsaW91X3poJywnYXV0aF90b2tlbic6Z3JvdXBTZXNzaW9ufSAgIyDlj4LpmIXmtY/op4jlmajkuIrkvKDnmoTpgInpobkKICAgIHVwbG9hZHJlcyA9IHJlcXVlc3RzLnBvc3QodXJsLCBkYXRhPW9wdGlvbnMsIGZpbGVzPWZpbGVzKQogICAgY29udGVudCA9IGpzb24ubG9hZHModXBsb2FkcmVzLnRleHQpCiAgICBwcmludCgidXBsb2FkSW1nIGlzICIgKyBjb250ZW50WyJ1cmwiXSkKCgpkZWYgcG9zdChhcmdzLHNlc3Npb24pOgogICAgcHJpbnQoYXJncykKICAgIHByaW50KHNlc3Npb24pCiAgICBib2R5ID0gYmFzZTY0LmI2NGRlY29kZShhcmdzKS5kZWNvZGUoInV0Zi04IikKICAgIGRhdGEgPSBqc29uLmxvYWRzKGJvZHkpICMg6Kej56CBSlNPTuWvueixoQogICAgcHJpbnQoZGF0YSkKICAgIHMuaGVhZGVycy51cGRhdGUoeyJzZXNzaW9uVG9rZW4iOiBzZXNzaW9uLCAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nfSkKICAgIHVybCA9ICdodHRwOi8ve306NTA4MC9pb3RhcGkvbG9naW4nLmZvcm1hdChob3N0KQogICAgaGVhZGVycyA9IHsnYWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nLCJDb250ZW50LVR5cGUiOiAidGV4dC9wbGFpbiJ9CiAgICBib2R5ID0geyJ1c2VybmFtZSI6J2xpb3VfemgnLCJwYXNzd29yZCI6J2xpb3VfemgnfQogICAgciA9IHMucG9zdCh1cmwsIGhlYWRlcnM9aGVhZGVycywgZGF0YT1qc29uLmR1bXBzKGJvZHkpKQogICAgdCA9IHIuY29udGVudCAgIyDor7vlj5bov5Tlm57nmoTlhoXlrrkKICAgIHQgPSBqc29uLmxvYWRzKHQpICAjIOino+eggUpTT07lr7nosaEKICAgIHJldHVybiBhcmdzCgpkZWYgbWFpbihhcmd2cyk6CiAgICBwb3N0KGFyZ3ZzWzBdLGFyZ3ZzWzFdKQogICAgI2xvZ2luKCkKICAgICNkZXZpY2UoKQogICAgI3VwbG9hZCgpCiAgICByZXR1cm4gMAoKZGVmIGV4aXQoKToKICAgIG9zLl9leGl0KDApCgoKaWYgX19uYW1lX18gPT0gIl9fbWFpbl9fIjoKICAgbWFpbihzeXMuYXJndlsxOl0p";
                // setdata =
                //   decodeURIComponent(escape(window.atob((str).replace(/-/g, "+").replace(/_/g, "/"))))
              setdata = str;
            }
            if (!this.productdetail.thing) {
              this.productdetail.thing = {
                properties: []
              };
            }

            this.wmxData = this.productdetail.thing.properties.filter(item => {
              return item.name && item.dataType;
            });

            editor.setValue(Base64.decode(setdata));
            editor.gotoLine(editor.session.getLength());
            // editor6.setValue(JSON.stringify(this.productdetail.thing, null, 4));
            var Device = Parse.Object.extend("Device");
            var devices = new Parse.Query(Device);

            devices.equalTo("product", this.productId);
            devices.skip(0);
            devices.count().then(count => {
              this.form.ProductAll = count;
            });
          }
        },
        error => {
          returnLogin(error);
        }
      );
    },
    editordata(row) {
      this.thingsParseModel.name = row.attributes.data.name;
      this.thingsParseModel.version = row.attributes.data.version;
      this.thingsParseModel.desc = row.attributes.data.desc;
      this.thingsParseModel.resource = row.attributes.data.enable;
      editor.setValue(Base64.decode(row.attributes.data.code));
      this.dialogTableVisible = false;
    },
    getAllunit() {
      this.allunit = [];
      var Dict = Parse.Object.extend("Dict");
      var datas = new Parse.Query(Dict);
      var arr = [{}];
      datas.equalTo("type", "unit");
      datas.limit(1000);
      datas.find().then(
        response => {
          this.allunit = response.concat([]);
          this.allunit.unshift({
            attributes: {
              data: {
                Name: "无",
                Symbol: ""
              }
            }
          });
        },
        error => {
          returnLogin(error);
        }
      );
    },
    subAce(thingsParseModel, istrue) {
      this.$refs[thingsParseModel].validate(valid => {
        if (valid) {
          var obj = {
            name: thingsParseModel.name,
            version: thingsParseModel.version,
            code: Base64.encode(editor.getValue()),
            desc: thingsParseModel.desc
          };
          var Product = Parse.Object.extend("Product");
          var product = new Product();
          product.id = this.productId;
          // product.get(this.productId).then(object => {
          product.set("decoder", obj);
          product.save().then(
            res => {
              if (this.issub == false) {
                this.$message({
                  type: "success",
                  message: "保存成功"
                });
                if (istrue == true) {
                  isupdatetrue += "保存成功" + "\r\n";
                  editor2.setValue(isupdatetrue);
                }
              } else {
              }
              this.issub = true;
            },
            error => {
              returnLogin(error);
            }
          );
          // });
        } else {
          this.$message({
            type: "warning",
            message: "输入格式有误"
          });
        }
      });
    },
    subAce1(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var userid = Parse.User.current().id;
          var obj = {
            name: this.thingsParseModel.name,
            version: this.thingsParseModel.version,
            code: Base64.encode(editor.getValue()),
            desc: this.thingsParseModel.desc
          };

          var Dict = Parse.Object.extend("Dict");
          var datas1 = new Parse.Query(Dict);
          datas1.equalTo("data.name", obj.name);
          datas1.equalTo("data.version", obj.version);

          datas1.find().then(
            response => {
              if (response) {
                if (response.length >= 1) {
                  this.$messages("此协议版本已存在");
                  return;
                } else {
                  var datas = new Dict();
                  var acl = new Parse.ACL();
                  acl.setReadAccess(userid, true);
                  acl.setWriteAccess(userid, true);
                  acl.setPublicReadAccess(true);
                  datas.set("type", "decoder");
                  datas.set("data", obj);
                  datas.set("ACL", acl);
                  datas.save().then(
                    resultes => {
                      if (resultes) {
                        this.$message("保存到公共协议库成功");
                      }
                    },
                    error => {
                      this.$message(error.message);
                    }
                  );
                }
              }
            },
            error => {
              returnLogin(error);
            }
          );
        } else {
          this.$message({
            type: "warning",
            message: "输入格式有误"
          });
        }
      });
    },
    decoderSizeChange(val) {
      this.decoder.length = val;
      this.chaxun();
    },
    devicerCurrentChange(val) {
      this.decoderstart = (val - 1) * this.decoderlength;
      this.chaxun();
    },
    updateAllChannel() {
      if (this.multipleSelection.length == 0) {
        this.protoldialog = false;
      } else {
        var arr = [];
        this.multipleSelection.map(item => {
          arr.push(
            new Promise((reslove, reject) => {
              return subupadte(item.id, "update")
                .then(resultes => {
                  if (resultes) {
                    reslove(resultes);
                  }
                })
                .catch(error => {
                  reject(error);
                });
            })
          );
        });
        Promise.all(arr)
          .then(data => {
            this.$message({
              message: "热加载成功",
              type: "success"
            });
            if (data.length == this.multipleSelection.length) {
              this.protoldialog = false;
            }
          })
          .catch(error => {
            this.$message({
              message: error,
              type: "error"
            });
          });
      }
    },
    // 通道全选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    utc2beijing(utc_datetime) {
      // 转为正常的时间格式 年-月-日 时:分:秒
      var date = new Date(+new Date(utc_datetime) + 8 * 3600 * 1000)
        .toISOString()
        .replace(/T/g, " ")
        .replace(/\.[\d]{3}Z/, "");
      return date; // 2017-03-31 16:02:06
    },
    getChannelEnable(row, rowIndex) {
      if (row.row.attributes.isEnable == true) {
        return "green_active";
      } else {
        return "red_active";
      }
    },
    deletedata(id) {
      var Dict = Parse.Object.extend("Dict");
      var datas = new Dict();
      datas.id = id;
      datas.destroy().then(
        resultes => {
          if (resultes) {
            this.$message("成功删除");
            this.chaxun();
          }
        },
        error => {
          returnLogin(error);
        }
      );
    },
    // 热加载弹窗
    updatesubdialog() {
      this.protoldialog = true;
      var Channel = Parse.Object.extend("Channel");
      var query = new Parse.Query(Channel);
      var Product = Parse.Object.extend("Product");
      var product = new Product();
      product.id = this.productId;
      query.equalTo("product", product);
      query.equalTo("type", "1");
      query.ascending("-updatedAt");
      query.find().then(
        res => {
          this.protolchannel = res;
          this.$refs.multipleTable.toggleAllSelection();
        },
        error => {
          returnLogin(error);
        }
      );
    },
    chaxun() {
      var Dict = Parse.Object.extend("Dict");
      var datas = new Parse.Query(Dict);
      datas.skip(this.decoderstart);
      datas.limit(this.decoderlength);
      datas.equalTo("type", "decoder");
      datas.ascending("-createdAt");
      datas.count().then(
        count => {
          this.decodertotal = count;
          datas.find().then(resultes => {
            if (resultes) {
              this.dialogTableVisible = true;
              this.gridData = resultes;
            }
          });
        },
        error => {
          returnLogin(error);
        }
      );
    },
    // 协议编辑
    protol() {
      var log = "";
      Compile(Base64.encode(editor.getValue()))
        .then(res => {
          if (res) {
            this.$message({
              type: "success",
              message: "编译成功"
            });
            log = "编译成功" + res.mod + "\r\n";
            this.warningeditror = res.warnings;
            this.warningeditror.map(items => {
              log += items + "\r\n";
            });
            isupdatetrue += log;
            editor2.setValue(isupdatetrue);
          }
        })
        .catch(error => {
          this.warningeditror = error.error;
          this.warningeditror.map(items => {
            log += items + "\r\n";
          });
          isupdatetrue += log;
          editor2.setValue(isupdatetrue);
        });
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
  .things-parse {
    width: 100%;

    .ace_editor {
      margin-right: 80px;
    }
  }
</style>
