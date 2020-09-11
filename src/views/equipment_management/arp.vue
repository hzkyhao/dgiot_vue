<template>
  <div>
    <el-tab-pane label="物解析" name="fourth">
      <div class="protolheader">
        <el-form
          ref="formInline"
          :inline="true"
          :model="formInline"
          :rules="addRules"
          class="demo-form-inline"
        >
          <el-form-item :label="$t('product.protocolname')" prop="name">
            <el-input
              v-model="formInline.name"
              :placeholder="$t('product.protocolname')"
            />
          </el-form-item>
          <el-form-item :label="$t('plugins.version')">
            <el-input
              v-model="formInline.version"
              :placeholder="$t('plugins.version')"
            />
          </el-form-item>
          <el-form-item :label="$t('developer.describe')">
            <el-input
              v-model="formInline.desc"
              :placeholder="$t('developer.describe')"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="small"
              @click="subAce('formInline',true)"
            >{{ $t('product.preservation') }}</el-button>
            <el-button
              type="primary"
              size="small"
              @click="subAce1('formInline')"
            >设为公共</el-button>
            <el-button
              type="primary"
              size="small"
              @click="chaxun"
            >{{ $t('product.publicagreementlibrary') }}</el-button>
          </el-form-item>
          <el-form-item style="display:block">
            <el-button
              type="primary"
              size="small"
              @click="protol"
            >{{ $t('product.compile') }}</el-button>
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
        <pre
          id="editor"
          class="ace_editor"
          style="min-height:600px;margin-bottom:0;"
        ><textarea class="ace_text-input" /></pre>
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
    </el-tab-pane>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      formInline: {
        name: '',
        version: '',
        desc: '',
        resource: false
      }
    }
  },
  computed: {},
  methods: {}
}
</script>

<style lang='scss' scoped>
//@import url()
</style>
