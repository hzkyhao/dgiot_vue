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
                @click="handleDelete(scope.$index, scope.row, 2)"
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
                src="http://pump.iotn2n.com:5080/swagger/#/Crond"
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
import { Compile, subupadte } from "@/api/systemmanage/system";
import { getIndustry } from "@/api/applicationManagement";
import { setTimeout } from "timers";
import gql from "graphql-tag";
import { postFile } from "@/api/appcontrol";
import {
  Websocket,
  sendInfo,
  TOPIC_EMPTY,
  MSG_EMPTY,
  DISCONNECT_MSG
} from "@/utils/wxscoket.js";
// import TaskCollection1 from "./task_collection1";
import { returnLogin } from "@/utils/return";
import { error } from "util";
import $ from "jquery";
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
    this.Industry();
    this.getAllunit();
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
            .delete("/exproto", {
              data: {
                type: type,
                mod: mod
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

    //调试api
    handleTest(index, Rtype, mod){
      let mData = {
                code: editor.getValue(),
                mod: mod,
                swagger: this.itemSwagger,
                type:type
            };
      console.log('itemSwagger==='+ this.itemSwagger);
        this.$axiosWen
            .put("/exproto",  Base64.encode(mData))
            .then(res => {
              console.log(res);
              this.AllDict.splice(index, 1);
            })
            .catch(e => {
              console.log(e);
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
            "IyBjb2Rpbmc9dXRmOAppbXBvcnQgc3lzCmltcG9ydCBvcwppbXBvcnQgcmVxdWVzdHMKaW1wb3J0IGpzb24KaW1wb3J0IGJhc2U2NAppbXBvcnQgbWF0cGxvdGxpYi5weXBsb3QgYXMgcGx0CmZyb20gcHlsYWIgaW1wb3J0IG1wbAppbXBvcnQgbWF0aAppbXBvcnQgdGltZQoKcyA9IHJlcXVlc3RzLnNlc3Npb24oKQpob3N0ID0gJ3B1bXAuaW90bjJuLmNvbScKCiIiIuWujOaIkOaLn+WQiOabsue6v+WPguaVsOiuoeeul+WJjeebuOW6lOWPmOmHj+eahOiuoeeulyIiIgpkZWYgcG9seW5vbWlhbF9maXR0aW5nKGRhdGFfeCxkYXRhX3kpOgogICAgc2l6ZT1sZW4oZGF0YV94KQogICAgaT0wCiAgICBzdW1feCA9IDAKICAgIHN1bV9zcWFyZV94ID0wCiAgICBzdW1fdGhpcmRfcG93ZXJfeCA9IDAKICAgIHN1bV9mb3VyX3Bvd2VyX3ggPSAwCiAgICBhdmVyYWdlX3ggPSAwCiAgICBhdmVyYWdlX3kgPSAwCiAgICBzdW1feSA9IDAKICAgIHN1bV94eSA9IDAKICAgIHN1bV9zcWFyZV94eSA9IDAKICAgIHdoaWxlIGk8c2l6ZToKICAgICAgICBzdW1feCArPSBkYXRhX3hbaV0KICAgICAgICBzdW1feSArPSBkYXRhX3lbaV0KICAgICAgICBzdW1fc3FhcmVfeCArPSBtYXRoLnBvdyhkYXRhX3hbaV0sMikKICAgICAgICBzdW1fdGhpcmRfcG93ZXJfeCArPW1hdGgucG93KGRhdGFfeFtpXSwzKQogICAgICAgIHN1bV9mb3VyX3Bvd2VyX3ggKz1tYXRoLnBvdyhkYXRhX3hbaV0sNCkKICAgICAgICBzdW1feHkgKz1kYXRhX3hbaV0qZGF0YV95W2ldCiAgICAgICAgc3VtX3NxYXJlX3h5ICs9bWF0aC5wb3coZGF0YV94W2ldLDIpKmRhdGFfeVtpXQogICAgICAgIGkgKz0gMTsKICAgIGF2ZXJhZ2VfeD1zdW1feC9zaXplCiAgICBhdmVyYWdlX3k9c3VtX3kvc2l6ZQogICAgcmV0dXJuIFtbc2l6ZSwgc3VtX3gsIHN1bV9zcWFyZV94LCBzdW1feV0KICAgICAgICAsIFtzdW1feCwgc3VtX3NxYXJlX3gsIHN1bV90aGlyZF9wb3dlcl94LCBzdW1feHldCiAgICAgICAgLCBbc3VtX3NxYXJlX3gsc3VtX3RoaXJkX3Bvd2VyX3gsc3VtX2ZvdXJfcG93ZXJfeCxzdW1fc3FhcmVfeHldXQoKCiIiIuWujOaIkOaLn+WQiOabsue6v+WPguaVsOeahOiuoeeulwog5YW25Lit6Kej5pa556iL55qE5pe25YCZ77yM5Yip55So6auY5pav5raI5YWD5rOV6K6h566X55u45bqU55qE5Y+C5pWw5YC8CiIiIgpkZWYgY2FsY3VsYXRlX3BhcmFtZXRlcihkYXRhKToKICAgICNp55So5p2l5o6n5Yi25YiX5YWD57Sg77yMbGluZeaYr+S4gOihjOWFg+e0oCxq55So5p2l5o6n5Yi25b6q546v5qyh5pWwLGRhdGFz55So5p2l5a2Y5YKo5bGA6YOo5Y+Y6YeP44CC5L+d5a2Y5L+u5pS55ZCO55qE5YC8CiAgICBpID0gMDsKICAgIGogPSAwOwogICAgbGluZV9zaXplID0gbGVuKGRhdGEpCgogICAgI+WwhuihjOWIl+W8j+WPmOaNouS4uuS4iuS4ieinkuihjOWIl+W8jwogICAgd2hpbGUgaiA8IGxpbmVfc2l6ZS0xOgogICAgICAgIGxpbmUgPSBkYXRhW2pdCiAgICAgICAgdGVtcCA9IGxpbmVbal0KICAgICAgICB0ZW1wbGV0ZT1bXQogICAgICAgIGZvciB4IGluIGxpbmU6CiAgICAgICAgICAgIHg9eC90ZW1wCiAgICAgICAgICAgIHRlbXBsZXRlLmFwcGVuZCh4KQogICAgICAgIGRhdGFbal09dGVtcGxldGUKICAgICAgICAjZmxhZ+agh+W/l+W6lOivpei/m+ihjOa2iOWFg+eahOihjOaVsAogICAgICAgIGZsYWcgPSBqKzEKICAgICAgICB3aGlsZSBmbGFnIDwgbGluZV9zaXplOgogICAgICAgICAgICB0ZW1wbGV0ZTEgPSBbXQogICAgICAgICAgICB0ZW1wMT1kYXRhW2ZsYWddW2pdCiAgICAgICAgICAgIGkgPSAwCiAgICAgICAgICAgIGZvciB4MSBpbiBkYXRhW2ZsYWddOgogICAgICAgICAgICAgICAgaWYgeDEhPTA6CiAgICAgICAgICAgICAgICAgICAgeDEgPSB4MS0odGVtcDEqdGVtcGxldGVbaV0pCiAgICAgICAgICAgICAgICAgICAgdGVtcGxldGUxLmFwcGVuZCh4MSkKICAgICAgICAgICAgICAgIGVsc2U6CiAgICAgICAgICAgICAgICAgICAgdGVtcGxldGUxLmFwcGVuZCgwKQogICAgICAgICAgICAgICAgaSArPSAxCiAgICAgICAgICAgIGRhdGFbZmxhZ10gPSB0ZW1wbGV0ZTEKICAgICAgICAgICAgZmxhZyArPTEKICAgICAgICBqICs9IDEKCgogICAgI+axguebuOW6lOeahOWPguaVsOWAvAogICAgcGFyYW1ldGVycz1bXQogICAgaT1saW5lX3NpemUtMQogICAgI2rmoIfor4blh4/ljrvlhYPntKDkuKrmlbAKICAgICNmbGFnX3JvbOagh+ivhumZpOmCo+S4gOWIlwogICAgZmxhZ19qPTAKICAgIHJvbF9zaXplPWxlbihkYXRhWzBdKQogICAgZmxhZ19yb2w9cm9sX3NpemUtMgogICAgI+iOt+W+l+ino+eahOS4quaVsAogICAgd2hpbGUgaT49MDoKICAgICAgICBvcGVyYXRlX2xpbmUgPSBkYXRhW2ldCiAgICAgICAgaWYgaT09bGluZV9zaXplLTE6CiAgICAgICAgICAgIHBhcmFtZXRlcj1vcGVyYXRlX2xpbmVbcm9sX3NpemUtMV0vb3BlcmF0ZV9saW5lW2ZsYWdfcm9sXQogICAgICAgICAgICBwYXJhbWV0ZXJzLmFwcGVuZChwYXJhbWV0ZXIpCiAgICAgICAgZWxzZToKICAgICAgICAgICAgZmxhZ19qPShyb2xfc2l6ZS1mbGFnX3JvbC0yKQogICAgICAgICAgICB0ZW1wMj1vcGVyYXRlX2xpbmVbcm9sX3NpemUtMV0KICAgICAgICAgICAgI3Jlc3VsdF9mbGFn5Li66K6/6Zeu5bey5rGC5Ye66Kej55qE5qCH5b+XCiAgICAgICAgICAgIHJlc3VsdF9mbGFnPTAKICAgICAgICAgICAgd2hpbGUgZmxhZ19qPjA6CiAgICAgICAgICAgICAgICB0ZW1wMi09b3BlcmF0ZV9saW5lW2ZsYWdfcm9sK2ZsYWdfal0qcGFyYW1ldGVyc1tyZXN1bHRfZmxhZ10KICAgICAgICAgICAgICAgIHJlc3VsdF9mbGFnKz0xCiAgICAgICAgICAgICAgICBmbGFnX2otPTEKICAgICAgICAgICAgcGFyYW1ldGVyPXRlbXAyL29wZXJhdGVfbGluZVtmbGFnX3JvbF0KICAgICAgICAgICAgcGFyYW1ldGVycy5hcHBlbmQocGFyYW1ldGVyKQogICAgICAgIGZsYWdfcm9sLT0xCiAgICAgICAgaS09MQogICAgcmV0dXJuIHBhcmFtZXRlcnMKCiIiIuiuoeeul+aLn+WQiOabsue6v+eahOWAvCIiIgpkZWYgY2FsY3VsYXRlKGRhdGFfeCxwYXJhbWV0ZXJzKToKICAgIGRhdGF5PVtdCiAgICBmb3IgeCBpbiBkYXRhX3g6CiAgICAgICAgZGF0YXkuYXBwZW5kKHBhcmFtZXRlcnNbMl0rcGFyYW1ldGVyc1sxXSp4K3BhcmFtZXRlcnNbMF0qeCp4KQogICAgcmV0dXJuIGRhdGF5CgoiIiLlrozmiJDlh73mlbDnmoTnu5jliLYiIiIKZGVmIGRyYXcoZmxvdywgbmV3aGVhZCwgaGVhZCwgIG5ld3Bvd2VyLCBwb3dlciwgbmV3ZWZmZWN0LCBlZmZlY3QpOgogICAgcGx0LnBsb3QoZmxvdywgbmV3aGVhZCxsYWJlbD0iSFHmi5/lkIjmm7Lnur8iLGNvbG9yPSJibGFjayIpCiAgICBwbHQuc2NhdHRlcihmbG93LCBoZWFkLGxhYmVsPSJIUeemu+aVo+aVsOaNriIpCgogICAgcGx0LnBsb3QoZmxvdywgbmV3cG93ZXIsIGxhYmVsPSJQUeaLn+WQiOabsue6vyIsY29sb3I9InJlZCIpCiAgICBwbHQuc2NhdHRlcihmbG93WzowXSwgcG93ZXJbOjBdLCBsYWJlbD0iUFHnprvmlaPmlbDmja4iKQoKICAgIHBsdC5wbG90KGZsb3csIG5ld2VmZmVjdCxsYWJlbD0iRVHmi5/lkIjmm7Lnur8iLGNvbG9yPSJibHVlIikKICAgIHBsdC5zY2F0dGVyKGZsb3csIGVmZmVjdCxsYWJlbD0iRVHnprvmlaPmlbDmja4iKQoKICAgIG1wbC5yY1BhcmFtc1snZm9udC5zYW5zLXNlcmlmJ10gPSBbJ1NpbUhlaSddCiAgICBtcGwucmNQYXJhbXNbJ2F4ZXMudW5pY29kZV9taW51cyddID0gRmFsc2UKCiAgICBwbHQudGl0bGUoIuaAp+iDveabsue6v+aLn+WQiOaVsOaNriIpCiAgICBwbHQubGVnZW5kKGxvYz0gImJlc3QiKQogICAgI+iOt+WPluW9k+WJjeaXtumXtAogICAgIyB0aWNrcyA9IHRpbWUudGltZSgpCiAgICAjIGZpbGUgPSAiLi8iICsgJ3t9Jy5mb3JtYXQodGlja3MpICsgIi5wbmciLAogICAgcGx0LnNhdmVmaWcoIi4vZmZmZi5wbmciKQogICAgcGx0LnNob3coKQogICAgIyByZXR1cm4gZmlsZQoKCmRlZiBwb3N0KGFyZ3Msc2Vzc2lvbixlbnYpOgogICAgYm9keSA9IGpzb24ubG9hZHMoYmFzZTY0LmI2NGRlY29kZShhcmdzKS5kZWNvZGUoInV0Zi04IikpCiAgICBwcmludChib2R5KQogICAgIyBzdHJib2R5ID0gJ3t9Jy5mb3JtYXQoYm9keSkKICAgICMgZW5ib2R5ID0gIGJhc2U2NC5iNjRlbmNvZGUoc3RyYm9keS5lbmNvZGUoJ3V0Zi04JykpCiAgICAjIHByaW50KGVuYm9keSkKICAgIHN0YXRlID0ganNvbi5sb2FkcyhiYXNlNjQuYjY0ZGVjb2RlKGVudikuZGVjb2RlKCJ1dGYtOCIpKQogICAgcHJpbnQoc3RhdGUpCiAgICAjIHJlc3R1cmwgPSBzdGF0ZVsncm9sZXMnXVswXVsndGFnJ11bJ2FwcGNvbmZpZyddWydyZXN0J10KICAgICMgcHJpbnQocmVzdHVybCkKICAgICMgcy5oZWFkZXJzLnVwZGF0ZSh7InNlc3Npb25Ub2tlbiI6IHNlc3Npb24sICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbid9KQogICAgIyBydCA9IHMuZ2V0KCd7fS9jbGFzc2VzL0RldmljZT9vcmRlcj1jcmVhdGVkQXQmbGltaXQ9MTAmc2tpcD0wJy5mb3JtYXQocmVzdHVybCksCiAgICAjICAgICAgICAgICAgICBwYXJhbXM9eydvcmRlcic6ICdjcmVhdGVkQXQnLCB9KQogICAgIyBmb3Igcm93IGluIChydC5qc29uKClbJ3Jlc3VsdHMnXSk6CiAgICAjICAgICBwcmludChyb3cpCgogICAgdXJsID0gJ2h0dHA6Ly97fTo2MDIwL3Jlc3Qvc3FsJy5mb3JtYXQoaG9zdCkKICAgICMgY3VybCAtSCAnQXV0aG9yaXphdGlvbjogQmFzaWMgPFRPS0VOPicgLWQgJzxTUUw+JyA8aXA+OjxQT1JUPi9yZXN0L3NxbAogICAgIyBUT0tFTuS4unt1c2VybmFtZX06e3Bhc3N3b3Jkfee7j+i/h0Jhc2U2NOe8lueggeS5i+WQjueahOWtl+espuS4su+8jOS+i+WmgnJvb3Q6dGFvc2RhdGHnvJbnoIHlkI7kuLpjbTl2ZERwMFlXOXpaR0YwWVE9PQogICAgaGVhZGVycyA9IHsnQXV0aG9yaXphdGlvbic6ICdCYXNpYyBjbTl2ZERwMFlXOXpaR0YwWVE9PSd9CiAgICBkYXRhID0gInNlbGVjdCBmbG93LCBoZWFkLCBlZmZlY3QsIHBvd2VyIGZyb20gXyIgKyBib2R5Wydwcm9kdWN0aWQnXSArICIuXyIgKyBib2R5WydkZXZpY2VpZCddICsgIiBvcmRlciBieSBjcmVhdGVkYXQgZGVzYyBsaW1pdCAyMDsiCiAgICByID0gcmVxdWVzdHMucG9zdCh1cmwsIGhlYWRlcnM9aGVhZGVycyxkYXRhPWRhdGEpCiAgICB0ID0gci5jb250ZW50ICMg6K+75Y+W6L+U5Zue55qE5YaF5a65CiAgICB0ID0ganNvbi5sb2Fkcyh0KSAjIOino+eggUpTT07lr7nosaEKICAgIGZsb3cgPSBbXQogICAgaGVhZCA9IFtdCiAgICBlZmZlY3QgPSBbXQogICAgcG93ZXIgPSBbXQogICAgZm9yIHJvdyBpbiAodFsnZGF0YSddKToKICAgICAgICBmbG93LmFwcGVuZChyb3dbMF0pCiAgICAgICAgaGVhZC5hcHBlbmQocm93WzFdKQogICAgICAgIGVmZmVjdC5hcHBlbmQocm93WzJdKQogICAgICAgIHBvd2VyLmFwcGVuZChyb3dbM10pCiAgICBwcmludChmbG93KQogICAgcHJpbnQoaGVhZCkKICAgIHByaW50KGVmZmVjdCkKICAgIHByaW50KHBvd2VyKQogICAgZmxvdyA9ICAgWzAuMDAsICAgIDQwLjIzLCAgODAuOTYsICAxMTkuNzksICAxNDAuMDQsICAxNTkuMTUsIDE3OC44MCwgMTk5LjMyLCAyMjIuMjIsIDI0MC4wNSwgMjUxLjUxLCAyNjEuMjYsIDI4Mi4zNSwgMjk5LjYwLCAzMjIuNzQsIDMzOS4wNiwgMzU4Ljk0LCAzODAuNzddCiAgICBoZWFkID0gICBbNDMuNTUsICAgNDQuMTIsICA0My4xMiwgIDQxLjQ1LCAgIDQwLjk3LCAgIDQwLjExLCAgMzkuMDcsICAzNy41NywgIDM1LjQzLCAgMzQuMDEsICAzMi45MywgIDMyLjEwLCAgMzAuNzAsICAyOS4zMywgIDI2LjcwLCAgMjUuMjcsICAyMi43NiwgIDE5LjY3XQogICAgcG93ZXIgPSBbMTQuNTAwLCAgMTYuNDI2LCAxOC4zMTAsIDIwLjc2OSwgIDIyLjE5NSwgIDIzLjU2NSwgMjQuOTcxLCAyNS45MzYsIDI2Ljg1NiwgMjcuMzY3LCAyNy45NDYsIDI4LDM0MSwgMjkuMDE3LCAyOS41NDMsIDMwLjE0OCwgMzAuNDI2LCAzMC44MjIsIDMwLjg3MV0KICAgIGVmZmVjdCA9IFswLjAwLCAgIDQuODI0LCAgIDkuNDg4LCAgMTMuNDk1LCAgMTUuNTkzLCAgMTcuMzQ1LCAxOC45ODcsIDIwLjM1MiwgMjEuNDAyLCAyMi4xODgsIDIyLjUwOSwgMjIuNzkyLCAyMy41NTksIDIzLjg3OCwgMjMuNDE5LCAyMy4yODcsIDIyLjIwNiwgMjAuMzU5XQoKICAgIGhlYWRkYXRhPXBvbHlub21pYWxfZml0dGluZyhmbG93LGhlYWQpCiAgICBoZWFkcGFyYW1ldGVycz1jYWxjdWxhdGVfcGFyYW1ldGVyKGhlYWRkYXRhKQogICAgbmV3aGVhZD1jYWxjdWxhdGUoZmxvdyxoZWFkcGFyYW1ldGVycykKCiAgICBwb3dlcmRhdGE9cG9seW5vbWlhbF9maXR0aW5nKGZsb3cscG93ZXIpCiAgICBwb3dlcnBhcmFtZXRlcnM9Y2FsY3VsYXRlX3BhcmFtZXRlcihwb3dlcmRhdGEpCiAgICBuZXdwb3dlcj1jYWxjdWxhdGUoZmxvdywgcG93ZXJwYXJhbWV0ZXJzKQoKICAgIGVmZmVjdGRhdGE9cG9seW5vbWlhbF9maXR0aW5nKGZsb3csZWZmZWN0KQogICAgZWZmZWN0cGFyYW1ldGVycz1jYWxjdWxhdGVfcGFyYW1ldGVyKGVmZmVjdGRhdGEpCiAgICBuZXdlZmZlY3Q9Y2FsY3VsYXRlKGZsb3csZWZmZWN0cGFyYW1ldGVycykKICAgIHByaW50KGJvZHlbJ3JlcG9ydGlkJ10pCiAgICBwcmludChzdGF0ZVsndXNlcm5hbWUnXSkKICAgIGRyYXcoZmxvdywgbmV3aGVhZCwgaGVhZCwgbmV3cG93ZXIsIHBvd2VyLCBuZXdlZmZlY3QsIGVmZmVjdCkKICAgICMgdXBsb2FkKGZpbGUsIHN0YXRlWyd1c2VybmFtZSddLCBzZXNzaW9uKQogICAgcmV0dXJuIGFyZ3MKCmRlZiB1cGxvYWQoZmlsZSwgcm9sZW5hbWUsIHNlc3Npb24pOgogICAgdXJsID0gJ2h0dHA6Ly97fToxMjUwL3NoYXBlcy91cGxvYWQnLmZvcm1hdChob3N0KQogICAgZmlsZXMgPSB7J2ZpbGUnOiBvcGVuKGZpbGUsJ3JiJyl9CiAgICBvcHRpb25zID0geydvdXRwdXQnOiAnanNvbicsICdwYXRoJzogJycsICdzY2VuZSc6IHJvbGVuYW1lLCAnYXV0aF90b2tlbic6c2Vzc2lvbn0gICMg5Y+C6ZiF5rWP6KeI5Zmo5LiK5Lyg55qE6YCJ6aG5CiAgICB1cGxvYWRyZXMgPSByZXF1ZXN0cy5wb3N0KHVybCwgZGF0YT1vcHRpb25zLCBmaWxlcz1maWxlcykKICAgIGNvbnRlbnQgPSBqc29uLmxvYWRzKHVwbG9hZHJlcy50ZXh0KQogICAgcHJpbnQoInVwbG9hZEltZyBpcyAiICsgY29udGVudFsidXJsIl0pCiAgICByZXR1cm4gIGNvbnRlbnRbInVybCJdCgpkZWYgbWFpbihhcmd2cyk6CiAgICBwb3N0KGFyZ3ZzWzBdLCBhcmd2c1sxXSkKICAgICNsb2dpbigpCiAgICAjZGV2aWNlKCkKICAgICN1cGxvYWQoKQogICAgcmV0dXJuIDAKCmRlZiBleGl0KCk6CiAgICBvcy5fZXhpdCgwKQoKCmlmIF9fbmFtZV9fID09ICJfX21haW5fXyI6CiAgIG1haW4oc3lzLmFyZ3ZbMTpdKQ==",
          java: "",
          ruby: ""
        };
        const initParams = {
          code: languageList[this.formLabelAlign.language],
          mod: this.formLabelAlign.name,
          swagger: {
            definitions: {},
            paths: {
              "/python_report": {
                post: {
                  description: "生成报告",
                  parameters: [
                    {
                      description: "生成报告",
                      in: "body",
                      name: "data",
                      required: true,
                      schema: {
                        properties: {
                          deviceid: {
                            description: "设备ID",
                            example: "e96eea9ae5",
                            required: true,
                            type: "string"
                          },
                          productid: {
                            description: "产品ID",
                            example: "9c5930e565",
                            required: true,
                            type: "string"
                          },
                          reportid: {
                            description: "报告ID",
                            example: "a58b37f29a",
                            required: true,
                            type: "string"
                          },
                          where: {
                            description:
                              '过滤条件 {"keys":["parentId","name"],"where":{"$or":[{"parentId":"lgtDJDEZlW"},{"objectId":"lgtDJDEZlW"}]}}',
                            example: '{"keys":["parentId","name"]}',
                            type: "object"
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
                  summary: "生成报告",
                  tags: ["EXPROTO"]
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
            .post("/exproto", initParams)
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
        .get("/exproto", {
          params: {
            type: "python",
            mod: "all"
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
