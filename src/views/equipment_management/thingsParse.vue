<template>
  <div class="things-parse">
    <el-row :gutter="24">
      <el-col :span="4">
        <template>
          <el-table
            ref="singleTable"
            :data="AllDict"
            highlight-current-row
            style="width: 100%"
            @current-change="handleCurrentChange"
          >
            <el-table-column prop="objectId" label="Id" />
            <el-table-column prop="name" label="产品名称" />
          </el-table>
        </template>
      </el-col>
      <el-col :span="20">
        <!-- <el-tab-pane label="物解析" name="fourth"> -->
        <div class="protolheader">
          <el-form
            ref="thingsParseModel"
            :inline="true"
            :model="thingsParseModel"
            :rules="thingsParseRules"
          >
            <el-form-item :label="$t('product.protocolname')" prop="name">
              <el-input
                v-model="thingsParseModel.name"
                :placeholder="$t('product.protocolname')"
              />
            </el-form-item>
            <el-form-item :label="$t('plugins.version')">
              <el-input
                v-model="thingsParseModel.version"
                :placeholder="$t('plugins.version')"
              />
            </el-form-item>
            <el-form-item :label="$t('developer.describe')">
              <el-input
                v-model="thingsParseModel.desc"
                :placeholder="$t('developer.describe')"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                size="small"
                @click="subAce('thingsParseModel', true)"
              >
                {{ $t("product.preservation") }}</el-button
                >
              <el-button
                type="primary"
                size="small"
                @click="subAce1('thingsParseModel')"
              >设为公共</el-button
              >
              <el-button type="primary" size="small" @click="chaxun">{{
                $t("product.publicagreementlibrary")
              }}</el-button>
              <el-button type="primary" size="small" @click="protol">{{
                $t("product.compile")
              }}</el-button>
              <el-button
                type="success"
                size="small"
                @click="updatesubdialog"
              >热加载</el-button
              >

            </el-form-item>
          </el-form>
        </div>
        <!--通道热加载-->
        <el-dialog
          :visible.sync="protoldialog"
          :close-on-click-modal="false"
          title="通道热加载"
          width="50%"
        >
          <el-table
            ref="multipleTable"
            :data="protolchannel"
            :row-class-name="getChannelEnable"
            style="width: 100%;"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column :label="$t('developer.channelnumber')">
              <template slot-scope="scope">
                <span>{{ scope.row.id }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('developer.channelname')">
              <template slot-scope="scope">
                <span>{{ scope.row.attributes.name }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('developer.channeladdr')">
              <template slot-scope="scope">
                <span>{{ "channel/" + scope.row.id }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('developer.channeltype')">
              <template slot-scope="scope">
                <span v-if="scope.row.attributes.type == 1">{{
                  $t("developer.collectionchannel")
                }}</span>
                <span v-else>{{ $t("developer.resourcechannel") }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('developer.servicetype')">
              <template slot-scope="scope">
                <span>{{ scope.row.attributes.cType }}</span>
              </template>
            </el-table-column>
          </el-table>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="updateAllChannel">确定</el-button>
          </div>
        </el-dialog>
        <!--公共协议库弹窗-->
        <el-dialog
          :title="$t('product.publicagreementlibrary')"
          :visible.sync="dialogTableVisible"
          :close-on-click-modal="false"
          width="50%"
        >
          <el-table
            :data="gridData"
            style="width:100%;text-align:center;margin-top:20px;"
          >
            <el-table-column :label="$t('product.protocolname')" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.attributes.data.name }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('plugins.version')" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.attributes.data.version }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('developer.describe')" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.attributes.data.desc }}</span>
              </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center">
              <template slot-scope="scope">
                <span>{{ utc2beijing(scope.row.attributes.createdAt) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('developer.operation')"
              align="center"
              width="200"
            >
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  @click="editordata(scope.row)"
                >{{ $t("product.clone") }}
                </el-button>
                <el-button
                  type="danger"
                  size="mini"
                  @click="deletedata(scope.row.id)"
                >{{ $t("developer.delete") }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="elpagination" style="padding:20px 0">
            <el-pagination
              :page-sizes="[10, 20, 30, 50]"
              :page-size="decoderlength"
              :total="decodertotal"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="decoderSizeChange"
              @current-change="devicerCurrentChange"
            />
          </div>
        </el-dialog>
        <div>
          <div style="background:#ffffff">
            <label id="plug-name" />
          </div>
          <pre
            id="editor"
            class="ace_editor"
            style="min-height:600px;margin-bottom:0;"
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
            style="min-height:300px;margin-bottom:0;margin-top:0"
          ><textarea class="ace_text-input" /></pre>
        </div>
      </el-col>
    </el-row>
    <!-- </el-tab-pane> -->
  </div>
</template>
<script>
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
    editor2.session.setMode("ace/mode/text"); // 设置语言
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
    handleCurrentChange(val) {
      this.currentRow = val;
      this.$refs.singleTable.setCurrentRow(val);
      this.getProDetail(val.objectId);
    },
    getAllDict() {
      this.$axiosWen
        .get("iotapi/classes/Product", {
          params: {
            where: { category: { $nin: ["Evidence"] }},
            order: "updatedAt" // -updatedAt  updatedAt
          }
        })
        .then(res => {
          this.AllDict = res.results;
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
      console.log('===')
      this.productId = productId;
      editor = ace.edit("editor");
      editor.session.setMode("ace/mode/erlang"); // 设置语言
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
              setdata =
                  "JSUlLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLQolJSUgQGNvcHlyaWdodCAoQykgMjAxOCwgPHNodXdhPgolJSUgQGRvYwolJSUg5Y2P6K6u6Kej5p6QRGVtbwolJSUgQGVuZAolJSUgQ3JlYXRlZCA6IDA4LiDljYHkuIDmnIggMjAxOCAxNDo0OQolJSUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tCi1tb2R1bGUoc2h1d2FfZGVtb19kZWNvZGVyKS4KLWF1dGhvcigic2h1d2EiKS4KLWRlZmluZShNU0dfVFlQRSwgPDwiREVNTyI+PikuCi1wcm90b2NvbChbPDwiREVNTyI+Pl0pLgoKLWV4cG9ydChbcGFyc2VfZnJhbWUvMiwgdG9fZnJhbWUvMV0pLgoKCnBhcnNlX2ZyYW1lKEJ1ZmYsIE9wdHMpIC0+CiAgICBwYXJzZV9mcmFtZShCdWZmLCBbXSwgT3B0cykuCgoKcGFyc2VfZnJhbWUoPDw+PiwgQWNjLCBfT3B0cykgLT4KICAgIHs8PD4+LCBBY2N9OwpwYXJzZV9mcmFtZSg8PDE2IzY4LCBSZXN0L2JpbmFyeT4+ID0gQmluLCBBY2MsIF9PcHRzKSB3aGVuIGJ5dGVfc2l6ZShSZXN0KSA9PCA2IC0+CiAgICB7QmluLCBBY2N9OwpwYXJzZV9mcmFtZSg8PDE2IzY4LCBMZW46MTYvbGl0dGxlLWludGVnZXIsIExlbjoxNi9saXR0bGUtaW50ZWdlciwgMTYjNjgsIFJlc3QvYmluYXJ5Pj4gPSBCaW4sIEFjYywgT3B0cykgLT4KICAgIGNhc2UgYnl0ZV9zaXplKFJlc3QpIC0gMiA+PSBMZW4gb2YKICAgICAgICB0cnVlIC0+CiAgICAgICAgICAgIGNhc2UgUmVzdCBvZgogICAgICAgICAgICAgICAgPDxVc2VyWm9uZTpMZW4vYnl0ZXMsIENyYzo4LCAxNiMxNiwgUmVzdDEvYmluYXJ5Pj4gLT4KICAgICAgICAgICAgICAgICAgICBBY2MxID0KICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBzaHV3YV91dGlsczpnZXRfcGFyaXR5KFVzZXJab25lKSA9Oj0gQ3JjIG9mCiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnVlIC0+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRnJhbWUgPSAjewogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8PCJtc2d0eXBlIj4+ID0+ID9NU0dfVFlQRSwKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPDwiZGF0YSI+PiA9PiBVc2VyWm9uZQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQWNjICsrIFtGcmFtZV07CiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWxzZSAtPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFjYwogICAgICAgICAgICAgICAgICAgICAgICBlbmQsCiAgICAgICAgICAgICAgICAgICAgcGFyc2VfZnJhbWUoUmVzdDEsIEFjYzEsIE9wdHMpOwogICAgICAgICAgICAgICAgXyAtPgogICAgICAgICAgICAgICAgICAgIHBhcnNlX2ZyYW1lKFJlc3QsIEFjYywgT3B0cykKICAgICAgICAgICAgZW5kOwogICAgICAgIGZhbHNlIC0+CiAgICAgICAgICAgIHtCaW4sIEFjY30KICAgIGVuZDsKcGFyc2VfZnJhbWUoPDxfOjgsIFJlc3QvYmluYXJ5Pj4sIEFjYywgT3B0cykgLT4KICAgIHBhcnNlX2ZyYW1lKFJlc3QsIEFjYywgT3B0cykuCgoKJSUg57uE6KOF5oiQ5bCB5YyFLCDlj4LmlbDkuLpNYXDlvaLlvI8KdG9fZnJhbWUoI3s8PCJtc2d0eXBlIj4+IDo9ID9NU0dfVFlQRX0gPSBGcmFtZSkgLT4KICAgIFBheWxvYWQgPSB0ZXJtX3RvX2JpbmFyeShGcmFtZSksCiAgICA8PDE2IzAzLCBQYXlsb2FkL2JpbmFyeSwgMTYjMjM+Pi4=";
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
    margin: 40px;
    width: 100%;

    .ace_editor {
      margin-right: 80px;
    }
  }
</style>
