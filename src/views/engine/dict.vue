<!-- 组件说明 -->
<template>
  <div class="dict">
    <div class="dialog">
      <el-dialog
        :visible.sync="add_dict_dialog"
        :title="title_dict_dialog"
        width="40%"
      >
        <el-form
          ref="dictForm"
          :model="dictForm"
          :rules="rules"
          class="dict_type"
          label-width="120px"
          size="mini"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="词典类型" prop="type">
                <el-select
                  v-model="dictForm.type"
                  style="width: 100%;"
                  placeholder="请选择"
                  @change="selectChange"
                >
                  <el-option
                    v-for="item in dictRecord"
                    :key="item.data.name"
                    :label="item.data.name"
                    :value="item.data.name"
                    :disabled="item.data.name == 'ALL'"
                  />
              </el-select> </el-form-item
            ></el-col>
            <el-col :span="12">
              <el-form-item label="词典名称" prop="name">
              <el-input v-model="dictForm.name" /> </el-form-item
            ></el-col>
            <div v-for="(item, i) in dictForm.tempconfig" :key="i">
              <el-col :span="12">
                <el-form-item
                  v-if="item.title.zh"
                  :title="item.title.zh"
                  :label="item.title.zh"
                >
                <el-input v-model="item.default" /> </el-form-item
              ></el-col>
            </div>
            <el-col :span="12">
              <el-form-item label="所属应用" prop="roles">
                <el-input
                  v-model="dictForm.applicationtText"
                  placeholder="请选择所属应用"
                >
                  <template slot="append">
                    <i
                      :class="[
                        showTree ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
                      ]"
                      style="cursor: pointer;"
                      @click="showTree = !showTree"
                    />
                  </template>
                </el-input>
                <div v-if="showTree">
                  <el-tree
                    :data="allApps"
                    :props="defaultProps"
                    @node-click="handleNodeClick"
                  />
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态" prop="enable">
                <el-radio
                  v-model="dictForm.enable"
                  label="1"
                  border
                >启用</el-radio
                >
                <el-radio
                  v-model="dictForm.enable"
                  label="2"
                  border
                >废弃</el-radio
                >
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="备注">
            <el-input
              :autosize="{ minRows: 2, maxRows: 4 }"
              v-model="dictForm.description"
              type="textarea"
              placeholder="请输入内容"
            />
          </el-form-item>
          <el-form-item size="mini">
            <el-button
              v-if="editDictId"
              type="primary"
              @click="onSubmit('dictForm')"
            >修改</el-button
            >
            <el-button
              v-else
              type="primary"
              @click="onSubmit('dictForm')"
            >立即创建</el-button
            >
            <el-button @click="add_dict_dialog = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <el-dialog
        :visible.sync="dict_temp_dialog"
        :title="title_temp_dialog"
        width="80%"
      >
        <el-form
          ref="dictTempForm"
          :model="dictTempForm"
          :rules="rules"
          size="mini"
        >
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item
                :label-width="formLabelWidth"
                label="词典名称"
                prop="name"
              >
                <el-input
                  v-model="dictTempForm.name"
                  autocomplete="off"
              /> </el-form-item
            ></el-col>
            <el-col
              :span="8"
            ><el-form-item :label-width="formLabelWidth" label="词典类型">
              <el-input
                v-model="dictTempForm.cType"
                autocomplete="off"
            /> </el-form-item
            ></el-col>
            <el-col :span="8">
              <el-form-item
                :label-width="formLabelWidth"
                label="词典状态"
                prop="enable"
              >
                <el-radio
                  v-model="dictTempForm.enable"
                  label="1"
                  border
                >启用</el-radio
                >
                <el-radio
                  v-model="dictTempForm.enable"
                  label="0"
                  border
                >禁用</el-radio
                >
            </el-form-item></el-col
            >
          </el-row>

          <el-form-item :label-width="formLabelWidth" label="词典数据">
            <el-tabs v-model="elactiveName">
              <el-tab-pane label="Table" name="Table">
                <el-button
                  type="primary"
                  class="mt-3"
                  size="small"
                  icon="el-icon-plus"
                  @click.native="addRow(dictTempForm.params)"
                >新 增</el-button
                >

                <el-table
                  :data="dictTempForm.params"
                  height="300"
                  style="width: 100%;text-align: center;"
                >
                  <el-table-column prop="name" label="名称" />
                  <el-table-column prop="type" label="类型" />
                  <el-table-column prop="order" label="序号" />
                  <el-table-column prop="default" label="默认值" />
                  <el-table-column prop="required" label="是否必填">
                    <template slot-scope="scope">
                      {{ scope.row.required }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="description" label="中文标题">
                    <template slot-scope="scope">
                      {{ scope.row.title.zh }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="description" label="英文标题">
                    <template slot-scope="scope">
                      {{ scope.row.title.en }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="description" label="中文描述">
                    <template slot-scope="scope">
                      {{ scope.row.description.zh }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="description" label="英文描述">
                    <template slot-scope="scope">
                      {{ scope.row.description.en }}
                    </template>
                  </el-table-column>

                  <el-table-column label="操作" width="160" align="center">
                    <template slot-scope="scope">
                      <el-button
                        size="mini"
                        type="danger"
                        plain
                        title="删除"
                        @click.native="
                          delRow(scope.$index, dictTempForm.params)
                        "
                      >删除
                      </el-button>
                      <el-button
                        size="mini"
                        type="info"
                        plain
                        title="编辑"
                        @click.native="
                          editRow(scope.row, scope.$index, dictTempForm.params)
                        "
                      >编辑
                      </el-button>
                    </template>
                </el-table-column></el-table
                >
              </el-tab-pane>
              <el-tab-pane label="Json" name="Json">
                <vue-json-editor
                  v-model="dictTempForm.params"
                  :mode="'code'"
                  lang="zh"
                  @json-change="onJsonChange"
                  @has-error="onError"
                />
              </el-tab-pane>
            </el-tabs>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="描述">
            <el-input
              :autosize="{ minRows: 2, maxRows: 4 }"
              v-model="dictTempForm.description"
              type="textarea"
              placeholder="请输入描述"
            />
          </el-form-item>

          <el-form-item size="mini" style="text-align: center;">
            <el-button
              type="primary"
              @click="onJsonSave('dictTempForm')"
            >提交</el-button
            >
            <el-button @click="dict_temp_dialog = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <el-dialog
        :visible.sync="edit_dict_temp_dialog"
        :title="title_dict_edit_dialog"
        size="mini"
      >
        <el-form
          ref="tempparams"
          :model="tempparams"
          :rules="rules"
          size="mini"
          status-icon
          label-width="70px"
          class="demo-ruleForm"
        >
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="名称" label-width="50px" prop="name">
                <el-input
                  v-model="tempparams.name"
                  autocomplete="off"
              /> </el-form-item
            ></el-col>
            <el-col :span="5">
              <el-form-item label="类型" label-width="50px" prop="type">
                <el-select v-model="tempparams.type" placeholder="请选择">
                  <el-option
                    v-for="item in dictOptions"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
              </el-select> </el-form-item
            ></el-col>
            <el-col :span="5">
              <el-form-item label="序号" label-width="50px" prop="order">
              <el-input v-model.number="tempparams.order" /> </el-form-item
            ></el-col>

            <el-col
              :span="8"
            ><el-form-item label="必填" label-width="50px">
              <el-radio
                v-model="tempparams.required"
                label="1"
                border
              >是</el-radio
              >
              <el-radio
                v-model="tempparams.required"
                label="0"
                border
              >否</el-radio
              >
            </el-form-item></el-col
            >
          </el-row>

          <el-form-item label="中文标题" prop="title">
            <el-input v-model="tempparams.title.zh" autocomplete="off" />
          </el-form-item>
          <el-form-item label="英文标题" prop="title">
            <el-input v-model="tempparams.title.en" autocomplete="off" />
          </el-form-item>
          <el-form-item label="默认值" prop="default">
            <el-input v-model="tempparams.default" />
          </el-form-item>
          <el-form-item label="中文描述" prop="title">
            <el-input v-model="tempparams.description.zh" autocomplete="off" />
          </el-form-item>
          <el-form-item label="英文描述" prop="title">
            <el-input v-model="tempparams.description.en" autocomplete="off" />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="submitFormTempDict()"
            >提交</el-button
            >
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="词典模板管理" name="词典模板管理">
        <el-input
          v-model="search_dict"
          placeholder="请输入词典名"
          style="width:200px"
          size="mini"
          clearable
        />
        <el-button
          :disabled="!search_dict.length"
          size="mini"
          type="primary"
          icon="el-icon-search"
          @click="searchDict(search_dict)"
        >搜索</el-button
        >
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="createDictTemp"
        >创建词典模板
        </el-button>
        <el-table
          :header-cell-style="{ 'text-align': 'center' }"
          :cell-style="{ 'text-align': 'center' }"
          :data="dictRecord"
          :row-class-name="tableRowClassName"
          style="width: 100%"
        >
          <el-table-column label="索引" type="index" width="50" />
          <el-table-column label="词典编号">
            <template v-if="scope.row.objectId" slot-scope="scope">
              {{ scope.row.objectId }}
            </template>
          </el-table-column>
          <el-table-column label="词典名称">
            <template slot-scope="scope">
              {{ scope.row.data.name }}
            </template>
          </el-table-column>
          <el-table-column label="词典类型">
            <template slot-scope="scope">
              {{ scope.row.data.cType }}
            </template>
          </el-table-column>
          <el-table-column label="词典状态">
            <template slot-scope="scope">
              <el-tag
                v-if="scope.row.data.enable == '1'"
                type="success"
              >启用</el-tag
              >
              <el-tag v-else type="warning">禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="描述">
            <template slot-scope="scope">
              {{ scope.row.data.description }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template v-if="scope.row.objectId" slot-scope="scope">
              <el-button
                size="mini"
                type="success"
                plain
                @click="editDictTemp(scope.row)"
              >编辑</el-button
              >
              <el-button
                v-if="scope.row.data.enable == '0'"
                size="mini"
                type="warning"
                plain
                @click="disabledDict(scope.row, '1')"
              >启用</el-button
              >
              <el-button
                v-else
                size="mini"
                type="warning"
                plain
                @click="disabledDict(scope.row, '0')"
              >禁用</el-button
              >
              <el-button
                size="mini"
                type="danger"
                plain
                @click="deleteDict(scope.row.objectId, '词典模板')"
              >删除</el-button
              >
              <el-button
                size="mini"
                type="info"
                plain
                @click="detailsTemp(scope.row)"
              >详情</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="词典管理" name="词典管理">
        <el-select
          v-model="dictType"
          style="width: 200px"
          size="mini"
          placeholder="请选择"
          @change="selectDictChange"
        >
          <el-option
            v-for="item in dictRecordOpt"
            :key="item.data.name"
            :label="item.data.name"
            :value="item.data.name"
          />
        </el-select>
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="showDictDialog"
        >创建词典
        </el-button>
        <el-table
          v-show="isALL"
          :header-cell-style="{ 'text-align': 'center' }"
          :cell-style="{ 'text-align': 'center' }"
          :data="dictData"
          :row-class-name="tableRowClassName"
          style="width: 100%"
          border
          stripe
        >
          <el-table-column label="索引" type="index" width="50" />
          <el-table-column prop="type" label="Id">
            <template slot-scope="scope">
              {{ scope.row.objectId }}
            </template>
          </el-table-column>
          <el-table-column prop="type" label="词典类型">
            <template slot-scope="scope">
              {{ scope.row.data.type }}
            </template>
          </el-table-column>
          <el-table-column label="词典名称">
            <template slot-scope="scope">
              {{ scope.row.data.name }}
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <el-tag
                v-if="scope.row.data.enable == '1'"
                type="success"
              >启用</el-tag
              >
              <el-tag v-else type="warning">废弃</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="指令回复类型">
            <template slot-scope="scope">
              <el-tag
                v-if="scope.row.data.needReply == '1'"
                type="success"
              >需要回复</el-tag
              >
              <el-tag v-else type="warning">不需要回复</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="备注">
            <template slot-scope="scope">
              {{ scope.row.data.description }}
            </template>
          </el-table-column>
          <el-table-column label="指令操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="success"
                plain
                @click="editDict(scope.row)"
              >编辑</el-button
              >
              <el-button
                v-if="scope.row.data.enable == '0'"
                size="mini"
                type="warning"
                plain
                @click="disabledDict(scope.row, '1')"
              >启用</el-button
              >
              <el-button
                v-else
                size="mini"
                type="warning"
                plain
                @click="disabledDict(scope.row, '0')"
              >禁用</el-button
              >
              <el-button
                size="mini"
                type="danger"
                plain
                @click="deleteDict(scope.row.objectId, '词典')"
              >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-table
          v-show="!isALL"
          ref="filterObj"
          :header-cell-style="{ 'text-align': 'center' }"
          :cell-style="{ 'text-align': 'center' }"
          :data="filterObj"
          :row-class-name="tableRowClassName"
          class="filter_obj"
          style="width: 100%"
          border
        >
          <template v-for="(item,index) in dialogtempconfig">
            <el-table-column :label="dialogtempconfig[index].title.zh" :key="index" >
              <template slot-scope="scope">{{ scope.row.data.tempconfig[index].default }} </template>
            </el-table-column>
          </template>
          <el-table-column label="指令操作" >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="success"
                plain
                @click="editDict(scope.row)"
              >编辑</el-button
              >
              <el-button
                v-if="scope.row.data.enable == '0'"
                size="mini"
                type="warning"
                plain
                @click="disabledDict(scope.row, '1')"
              >启用</el-button
              >
              <el-button
                v-else
                size="mini"
                type="warning"
                plain
                @click="disabledDict(scope.row, '0')"
              >禁用</el-button
              >
              <el-button
                size="mini"
                type="danger"
                plain
                @click="deleteDict(scope.row.objectId, '词典')"
              >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
// import { utc2beijing, timestampToTime } from '@/utils/index'
import { queryDict, postDict, delDict, putDict } from "@/api/Direct/index.js";
import { resourceTypes } from "@/api/Rules";
import vueJsonEditor from "vue-json-editor";
export default {
  name: "Dict",
  components: { vueJsonEditor },
  data() {
    return {
      rules: {
        type: [{ required: true, message: "请输入词典类型", trigger: "blur" }],
        name: [{ required: true, message: "请输入词典类型", trigger: "blur" }],
        nameEncrypt: [
          { required: true, message: "请输入词典类型", trigger: "blur" }
        ],
        needReply: [
          { required: true, message: "请选择指令回复类型", trigger: "change" }
        ],
        enable: [{ required: true, message: "请选择状态", trigger: "change" }]
      },
      checkList: ['标题', '作者', '评级', '点击量', '时间'],
      columns: [
        {
          label: '标题',
          width: 'auto',
          prop: 'title',
          sortable: true,
          disableCheck: true
        },
        {
          label: '作者',
          width: 'auto',
          prop: 'author',
          sortable: true
        },
        {
          label: '评级',
          width: '200',
          prop: 'rate',
          sortable: true
        },
        {
          label: '点击量',
          width: 'auto',
          prop: 'pageViews',
          sortable: true
        },
        {
          label: '时间',
          width: 'auto',
          prop: 'datetime',
          sortable: true
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      },
      isALL: true,
      filterObj: [],
      tempObjectId: "",
      dictType: "",
      allApps: [],
      showTree: false,
      editIndexId: "",
      editDictId: "",
      editDictTempId: "",
      infoData: new Date(),
      elactiveName: "Table",
      activeName: "词典模板管理",
      title_dict_edit_dialog: "新增词典数据",
      title_temp_dialog: "新增词典模板",
      title_dict_dialog: "新增词典",
      search_dict: "",
      add_dict_dialog: false,
      dict_temp_dialog: false,
      edit_dict_temp_dialog: false,
      dialogtempconfigVisible: false,
      dialogtempconfig: [],
      dictData: [],
      dictRecord: [],
      dictRecordOpt: [],
      dictOptions: ["String", "Boolean", "Number", "Function"],
      dictForm: {
        type: "",
        name: "",
        nameEncrypt: "",
        needReply: "",
        enable: "",
        description: "",
        tempconfig: []
      },
      tempparams: {
        name: "",
        type: "",
        order: 0,
        title: {
          en: "",
          zh: ""
        },
        default: 5,
        required: false,
        description: {
          en: "",
          zh: ""
        }
      },
      dictTempForm: {
        name: "",
        cType: "",
        enable: "0",
        description: "",
        params: [
          {
            name: "Size",
            type: "integer",
            order: 100,
            title: {
              en: "Size",
              zh: "池子大小"
            },
            default: 5,
            required: false,
            description: {
              en: "Pool Size",
              zh: "进程池子数量"
            }
          },
          {
            name: "Port",
            type: "integer",
            order: 1,
            title: {
              zh: "端口"
            },
            default: 51888,
            required: true,
            description: {
              zh: "侦听端口"
            }
          },

          {
            name: "version",
            type: "string",
            order: 3,
            title: {
              zh: "DTU版本"
            },
            default: "0.0.1",
            required: true,
            description: {
              zh: "DTU版本"
            }
          },
          {
            name: "heartbeat",
            type: "integer",
            order: 2,
            title: {
              zh: "心跳周期"
            },
            default: 180,
            required: true,
            description: {
              zh: "心跳周期"
            }
          },
          {
            name: "MaxOverFlow",
            type: "integer",
            order: 101,
            title: {
              en: "MaxOverFlow",
              zh: "最大溢出"
            },
            default: 10,
            required: false,
            description: {
              en: "MaxOverFlow",
              zh: "最大溢出"
            }
          }
        ]
      },
      formLabelWidth: "120px"
    };
  },
  computed: {
    dragOptions() {
      return {
        animation: 600,
        group: 'description'
      }
    },
    finallyColumns() {
      return this.columns.filter((item) =>
        this.checkList.includes(item.label)
      )
    }
  },
  mounted() {
    this.getDictData();
    this.getDictRecord();
    this.dialogType();
  },
  beforeCreate() {}, // 生命周期 - 创建之前
  beforeMount() {}, // 生命周期 - 挂载之前
  beforeUpdate() {}, // 生命周期 - 更新之前
  updated() {}, // 生命周期 - 更新之后
  beforeDestroy() {}, // 生命周期 - 销毁之前
  destroyed() {}, // 生命周期 - 销毁完成
  activated() {},
  methods: {
    showTable(row) {
      console.log("row", row)
      this.dialogtempconfigVisible = true
      this.dialogtempconfig = row
      console.log(this.dialogtempconfig)
    },
    selectDictChange(v) {
      if (v == "ALL") {
        this.isALL = true;
      } else {
        this.isALL = false;
        // this.filterObj = []
        this.filterObj = this.dictData.filter(i => {
          if (i.data.type == v && i.data.tempconfig.length) {
            return i.data.tempconfig;
          }
        });

        this.dialogtempconfig = this.filterObj[0].data.tempconfig
        console.log('aa', this.dialogtempconfig)
        // filterObj.forEach(k => {
        //   console.log(k)
        //   this.filterObj.push(...k.data.tempconfig)
        // })
        console.log(this.filterObj)
      }
    },
    dialogType() {
      this.$axiosWen
        .get("iotapi/roletree")
        .then(res => {
          console.log(res);
          this.allApps = res.results;
        })
        .catch(e => {
          console.log(e);
        }),
      resourceTypes().then(resultes => {
        this.channelregion = resultes;
      });
    },
    handleNodeClick(data) {
      this.showTree = !this.showTree;
      this.dictForm.applicationtText = data.alias;
    },
    selectChange(v) {
      const dictRecord = this.dictRecord;
      const tempconfig = dictRecord.filter(i => {
        return i.data.name == v;
      });
      const config = tempconfig.filter(i => {
        return i.data.params;
      });
      // console.log("config", config);
      this.tempObjectId = config[0].objectId;
      this.dictForm.tempconfig = config[0].data.params;
      // console.log(this.dictForm.tempconfig);
    },
    submitFormTempDict() {
      this.edit_dict_temp_dialog = false;
      if (this.editIndexId) {
        this.dictTempForm.params[this.editIndexId] = this.tempparams;
        this.$message("编辑成功");
      } else {
        this.dictTempForm.params.push(this.tempparams);
        this.$message("新增成功");
      }
    },
    addRow(tabs) {
      this.editIndexId = "";
      this.title_dict_edit_dialog = "新增词典数据";
      this.edit_dict_temp_dialog = true;
      this.tempparams = {
        name: "",
        type: "",
        order: 0,
        title: {
          en: "",
          zh: ""
        },
        default: 0,
        required: false,
        description: {
          en: "",
          zh: ""
        }
      };
    },
    delRow(index, rows) {
      rows.splice(index, 1);
      this.onJsonSave("dictTempForm");
    },
    editRow(row, index, params) {
      this.editIndexId = index;
      this.title_dict_edit_dialog = "修改词典数据";
      this.edit_dict_temp_dialog = true;
      this.tempparams = row;
    },
    clearFormValidate(formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields();
      }
    },
    onError() {
      this.$message("非Json数据类型");
    },
    onJsonChange() {
      // 数据改变时触发
      console.log("onJsonChange", this.dictTempForm.params);
    },
    onJsonSave(formName) {
      // 点击保存触发
      console.log("onJsonSave", this.dictTempForm.params);
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.editDictTempId) {
            this.put_Dict_temp(this.editDictTempId, this.dictTempForm);
          } else {
            this.addDict_temp(this.dictTempForm);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return "warning-row";
      } else if (rowIndex === 3) {
        return "success-row";
      }
      return "";
    },
    searchDict(v) {
      console.log(v);
    },
    /**
     * 創建詞典模板
     **/
    createDictTemp() {
      this.dict_temp_dialog = true;
      this.editDictTempId = "";
      this.title_temp_dialog = "创建词典模板";
      this.dictTempForm = {
        name: "",
        cType: "",
        enable: "0",
        description: "",
        params: [
          {
            name: "Size",
            type: "integer",
            order: 100,
            title: {
              en: "Size",
              zh: "池子大小"
            },
            default: 5,
            required: false,
            description: {
              en: "Pool Size",
              zh: "进程池子数量"
            }
          },
          {
            name: "Port",
            type: "integer",
            order: 1,
            title: {
              zh: "端口"
            },
            default: 51888,
            required: true,
            description: {
              zh: "侦听端口"
            }
          },

          {
            name: "version",
            type: "string",
            order: 3,
            title: {
              zh: "DTU版本"
            },
            default: "0.0.1",
            required: true,
            description: {
              zh: "DTU版本"
            }
          },
          {
            name: "heartbeat",
            type: "integer",
            order: 2,
            title: {
              zh: "心跳周期"
            },
            default: 180,
            required: true,
            description: {
              zh: "心跳周期"
            }
          },
          {
            name: "MaxOverFlow",
            type: "integer",
            order: 101,
            title: {
              en: "MaxOverFlow",
              zh: "最大溢出"
            },
            default: 10,
            required: false,
            description: {
              en: "MaxOverFlow",
              zh: "最大溢出"
            }
          }
        ]
      };
    },
    detailsTemp(row) {
      alert(JSON.stringify(row));
    },
    showDictDialog() {
      this.add_dict_dialog = true;
      this.title_dict_dialog = "新增词典";
      this.editDictId = "";
      this.dictForm = {
        cType: "",
        name: "",
        nameEncrypt: "",
        needReply: "",
        enable: "",
        description: "",
        tempconfig: []
      };
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.editDictId) {
            this.put_Dict(this.editDictId, this.dictForm);
          } else {
            this.addDict(this.dictForm);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    async addDict_temp(form) {
      const aclKey =
        "role" + ":" + JSON.parse(this.$Cookies.get("roles"))[0].name;
      const set_acl = {};
      set_acl[aclKey] = {
        read: true,
        write: true
      };
      const params = {
        data: form,
        ACL: set_acl,
        key: form.name,
        type: "dict_template"
      };
      const res = await postDict(params);
      if (res) {
        this.$message("创建成功");
        this.dict_temp_dialog = false;
        this.getDictData();
      }
    },
    async addDict(form) {
      form.key = "dict";
      const aclKey =
        "role" + ":" + JSON.parse(this.$Cookies.get("roles"))[0].name;
      const set_acl = {};
      set_acl[aclKey] = {
        read: true,
        write: true
      };
      const params = {
        data: form,
        ACL: set_acl,
        key: form.name,
        type: this.tempObjectId
      };
      const res = await postDict(params);
      if (res) {
        this.$message("创建成功");
        this.add_dict_dialog = false;
        this.getDictRecord();
      }
    },
    editDictTemp(row) {
      this.editDictTempId = row.objectId;
      this.dictTempForm = row.data;
      const { params = {}} = row.data;
      this.dictTempForm.params = params;
      this.dict_temp_dialog = true;
      this.title_temp_dialog = "编辑词典模板";
    },
    editDict(row) {
      this.editDictId = row.objectId;
      this.dictForm = row.data;
      this.add_dict_dialog = true;
      this.title_dict_dialog = "编辑词典";
    },
    async put_Dict_temp(editDictId, row) {
      const params = {
        data: row,
        key: row.name
      };
      const { updatedAt } = await putDict(editDictId, params);
      if (updatedAt) {
        this.getDictData();
        this.dict_temp_dialog = false;
        this.$message("词典数据更新成功");
      } else {
        this.$message("词典数据更新失败");
      }
    },
    async put_Dict(editDictId, row) {
      const params = {
        data: row,
        key: row.name
      };
      const { updatedAt } = await putDict(editDictId, params);
      if (updatedAt) {
        this.getDictRecord();
        this.add_dict_dialog = false;
        this.$message("词典数据更新成功");
      } else {
        this.$message("词典数据更新失败");
      }
    },
    async disabledDict(row, type) {
      row.data.enable = type;
      const params = {
        data: row.data
      };
      const { updatedAt } = await putDict(row.objectId, params);
      if (updatedAt) {
        this.$message("词典状态设置成功");
      } else {
        this.$message("词典状态设置失败");
      }
    },
    async deleteDict(ObjectId, type) {
      const res = await this.$del_object("Dict", ObjectId);
      if (res) {
        if (type == "词典") {
          this.getDictRecord();
        } else {
          this.getDictData();
        }
        this.$message(type + "删除成功");
      } else {
        this.$message(type + "删除失败");
      }
    },
    async getDictData() {
      const parsms = {
        limit: 1000,
        where: {
          type: "dict_template"
        }
      };
      const { results } = await queryDict(parsms);

      this.dictRecord = results;
      this.dictRecordOpt.push({ data: { name: "ALL" }}, ...results);
      // console.log('aa', this.dictRecord);
    },
    async getDictRecord() {
      const parsms = {
        limit: 1000,
        where: {
          "data.key": "dict"
        }
      };
      const { results } = await queryDict(parsms);

      this.dictData = results;
    }
  } // 如果页面有keep-alive缓存功能，这个函数会触发
};
</script>

<style lang="scss" scoped>
.dict {
  /deep/ .el-table .warning-row {
    background: oldlace;
  }

  /deep/ .el-table .success-row {
    background: #f0f9eb;
  }

  /deep/.jsoneditor-vue {
    height: 300px;
  }

  /deep/.json-save-btn {
    cursor: pointer;
  }
  .dict_type /deep/ .el-form-item {
  }
}
</style>
