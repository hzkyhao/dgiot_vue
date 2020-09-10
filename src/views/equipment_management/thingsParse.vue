<template>
  <div class="things-parse">


    <!-- <el-tab-pane label="物解析" name="fourth"> -->
            <div class="protolheader">
              <el-form
                ref="thingsParseFormRef"
                :inline="true"
                :model="thingsParseModel"
                :rules="thingsParseRules"
              >
                <el-form-item :label="$t('product.protocolname')" prop="name">
                  <el-input v-model="thingsParseModel.name" :placeholder="$t('product.protocolname')" />
                </el-form-item>
                <el-form-item :label="$t('plugins.version')">
                  <el-input v-model="thingsParseModel.version" :placeholder="$t('plugins.version')" />
                </el-form-item>
                <el-form-item :label="$t('developer.describe')">
                  <el-input v-model="thingsParseModel.desc" :placeholder="$t('developer.describe')" />
                </el-form-item>
                <el-form-item>
                  <el-button
                    type="primary"
                    size="small"
                    @click="subAce('thingsParseModel',true)"
                  >{{ $t('product.preservation') }}</el-button>
                  <el-button type="primary" size="small" @click="subAce1('thingsParseModel')">设为公共</el-button>
                  <el-button
                    type="primary"
                    size="small"
                    @click="chaxun"
                  >{{ $t('product.publicagreementlibrary') }}</el-button>
                </el-form-item>
                <el-form-item style="display:block">
                  <el-button type="primary" size="small" @click="protol">{{ $t('product.compile') }}</el-button>
                  <el-button type="success" size="small" @click="updatesubdialog">热加载</el-button>
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
                    <span>{{ 'channel/'+scope.row.id }}</span>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('developer.channeltype')">
                  <template slot-scope="scope">
                    <span
                      v-if="scope.row.attributes.type==1"
                    >{{ $t('developer.collectionchannel') }}</span>
                    <span v-else>{{ $t('developer.resourcechannel') }}</span>
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
              <el-table :data="gridData" style="width:100%;text-align:center;margin-top:20px;">
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
                <el-table-column :label="$t('developer.operation')" align="center" width="200">
                  <template slot-scope="scope">
                    <el-button
                      type="primary"
                      size="mini"
                      @click="editordata(scope.row)"
                    >{{ $t('product.clone') }}</el-button>
                    <el-button
                      type="danger"
                      size="mini"
                      @click="deletedata(scope.row.id)"
                    >{{ $t('developer.delete') }}</el-button>
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
              <pre id="editor" class="ace_editor" style="min-height:600px;margin-bottom:0;"><textarea class="ace_text-input" /></pre>
              <div style="background:#ffffff">
                <label id="plug-name" />
              </div>
              <div
                style="color:#c2be9e;background:#272822;border-top:1px solid #dddddd;padding:5px"
              >
                <span>{{ $t('product.controloutput') }}</span>
              </div>
              <pre
                id="editor2"
                class="ace_editor"
                style="min-height:300px;margin-bottom:0;margin-top:0"
              ><textarea class="ace_text-input" /></pre>
            </div>
          <!-- </el-tab-pane> -->


  </div>
</template>
<script>
import Parse from "parse";

export default {
  name: 'ThingsParse',
  props:{

  },
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
      thingsParseModel: {
        name: "",
        version: "",
        desc: "",
        resource: false
      },
     thingsParseRules: {
        name: [
          { required: true, message: "请输入协议名称", trigger: "blur" },
          { validator: validCode, trigger: "blur" }
        ]
      },
      dialogTableVisible: false,
      gridData: [],
      protoldialog: false
    
    };
  },
  computed: {
    tableFilterData() {

      return null
      
    }
  },
  mounted() {

  },
  methods: {
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
<style rel="stylesheet/scss" lang="scss" >
.things-parse {
width:100%;

}
</style>
