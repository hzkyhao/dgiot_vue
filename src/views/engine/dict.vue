<!-- 组件说明 -->
<template>
  <div class="dict">
    <div class="dialog">
      <el-dialog :visible.sync="add_dict_dialog" :title="title_dict_dialog" width="26%">
        <el-form ref="dictForm" :model="dictForm" :rules="rules" label-width="120px" size="mini">
          <el-form-item
            label="设备类型"
            prop="type">
            <el-input v-model="dictForm.type" />
          </el-form-item>
          <el-form-item
            label="指令名称"
            prop="name">
            <el-input v-model="dictForm.name" />
          </el-form-item>
          <el-form-item
            label="加密指令"
            prop="nameEncrypt">
            <el-input v-model="dictForm.nameEncrypt" />
          </el-form-item>
          <el-form-item
            label="指令回复类型"
            prop="needReply">
            <el-radio v-model="dictForm.needReply" label="1" border>需要回复</el-radio>
            <el-radio v-model="dictForm.needReply" label="2" border>不需要回复</el-radio>
          </el-form-item>
          <el-form-item
            label="指令状态"
            prop="enable">
            <el-radio v-model="dictForm.enable" label="1" border>启用</el-radio>
            <el-radio v-model="dictForm.enable" label="2" border>废弃</el-radio>
          </el-form-item>
          <el-form-item
            label="备注">
            <el-input
              :autosize="{ minRows: 2, maxRows: 4}"
              v-model="dictForm.description"
              type="textarea"
              placeholder="请输入内容"/>
          </el-form-item>
          <el-form-item size="mini">
            <el-button v-if="editDictId" type="primary" @click="onSubmit('dictForm')">修改</el-button>
            <el-button v-else type="primary" @click="onSubmit('dictForm')">立即创建</el-button>
            <el-button @click="add_dict_dialog = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <el-dialog :visible.sync="dict_temp_dialog" :title="title_temp_dialog">
        <el-form ref="dictTempForm" :model="dictTempForm" :rules="rules" >
          <el-form-item :label-width="formLabelWidth" label="词典名称" prop="name">
            <el-input v-model="dictTempForm.name" autocomplete="off"/>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="词典类型">
            <el-input v-model="dictTempForm.cType" autocomplete="off"/>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="词典状态" prop="enable">
            <el-radio v-model="dictTempForm.enable" label="1" border>启用</el-radio>
            <el-radio v-model="dictTempForm.enable" label="0" border>禁用</el-radio>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="描述">
            <el-input
              :autosize="{ minRows: 2, maxRows: 4}"
              v-model="dictTempForm.description"
              type="textarea"
              placeholder="请输入描述"/>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="词典数据">
            <vue-json-editor
              v-model="dictTempForm.params"
              :show-btns="true"
              :mode="'code'"
              lang="zh"
              @json-change="onJsonChange"
              @has-error="onError"
              @json-save = "onJsonSave('dictTempForm')"/>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="词典模板管理" name="词典模板管理">
        <el-input v-model="search_dict" placeholder="请输入词典名" style="width:200px" size="mini" clearable />
        <el-button
          :disabled="!search_dict.length"
          size="mini"
          type="primary"
          icon="el-icon-search"
          @click="searchDict(search_dict)">搜索</el-button>
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="createDictTemp">创建词典模板
        </el-button>
        <el-table
          :header-cell-style="{'text-align':'center'}"
          :cell-style="{'text-align':'center'}"
          :data="dictRecord"
          :row-class-name="tableRowClassName"
          style="width: 100%">
          <el-table-column label="词典编号" >
            <template slot-scope="scope">
              {{ scope.row.objectId }}
            </template>
          </el-table-column>
          <el-table-column label="词典名称" >
            <template slot-scope="scope">
              {{ scope.row.data.name }}
            </template>
          </el-table-column>
          <el-table-column label="词典类型" >
            <template slot-scope="scope">
              {{ scope.row.data.cType }}
            </template>
          </el-table-column>
          <el-table-column label="词典状态" >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.data.enable == '1'" type="success">启用</el-tag>
              <el-tag v-else type="warning">禁用</el-tag>
            </template>

          </el-table-column>
          <el-table-column label="描述" >
            <template slot-scope="scope">
              {{ scope.row.data.description }}
            </template>
          </el-table-column>
          <el-table-column label="操作" >
            <template slot-scope="scope">
              <el-button size="mini" type="success" plain @click="editDictTemp(scope.row)">编辑</el-button>
              <el-button v-if="scope.row.data.enable =='0'" size="mini" type="warning" plain @click="disabledDict(scope.row,'1')">启用</el-button>
              <el-button v-else size="mini" type="warning" plain @click="disabledDict(scope.row,'0')">禁用</el-button>
              <el-button size="mini" type="danger" plain @click="deleteDict(scope.row.objectId,'词典模板')">删除</el-button>
              <el-button size="mini" type="info" plain @click="detailsTemp(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="词典管理" name="词典管理">
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="showDictDialog">创建词典
        </el-button>
        <el-table
          :header-cell-style="{'text-align':'center'}"
          :cell-style="{'text-align':'center'}"
          :data="dictData"
          :row-class-name="tableRowClassName"
          style="width: 100%">
          <el-table-column prop="type" label="设备类型" >
            <template slot-scope="scope">
              {{ scope.row.data.type }}
            </template>
          </el-table-column>
          <el-table-column label="指令名称" >
            <template slot-scope="scope">
              {{ scope.row.data.name }}
            </template>
          </el-table-column>
          <el-table-column label="加密指令" >
            <template slot-scope="scope">
              {{ scope.row.data.nameEncrypt }}
            </template>
          </el-table-column>
          <el-table-column label="指令状态" >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.data.enable == '1'" type="success">启用</el-tag>
              <el-tag v-else type="warning">废弃</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="指令回复类型" >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.data.needReply == '1'" type="success">需要回复</el-tag>
              <el-tag v-else type="warning">不需要回复</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="备注" >
            <template slot-scope="scope">
              {{ scope.row.data.description }}
            </template>
          </el-table-column>
          <el-table-column label="指令操作" >
            <template slot-scope="scope">
              <el-button size="mini" type="success" plain @click="editDict(scope.row)">编辑</el-button>
              <el-button v-if="scope.row.data.enable =='0'" size="mini" type="warning" plain @click="disabledDict(scope.row,'1')">启用</el-button>
              <el-button v-else size="mini" type="warning" plain @click="disabledDict(scope.row,'0')">禁用</el-button>
              <el-button size="mini" type="danger" plain @click="deleteDict(scope.row.objectId,'词典')">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { queryDict, postDict, delDict, putDict } from '@/api/Direct/index.js'
import vueJsonEditor from 'vue-json-editor'
export default {
  name: "Dict",
  components: { vueJsonEditor },
  data() {
    return {
      rules: {
        type: [
          { required: true, message: '请输入设备类型', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入设备类型', trigger: 'blur' }
        ],
        nameEncrypt: [
          { required: true, message: '请输入设备类型', trigger: 'blur' }
        ],
        needReply: [
          { required: true, message: '请选择指令回复类型', trigger: 'change' }
        ],
        enable: [
          { required: true, message: '请选择指令状态', trigger: 'change' }
        ]
      },
      editDictId: '',
      editDictTempId: '',
      infoData: new Date(),
      activeName: "词典模板管理",
      title_temp_dialog: '新增词典模板',
      title_dict_dialog: '新增词典',
      search_dict: "",
      add_dict_dialog: false,
      dict_temp_dialog: false,
      dictData: [],
      dictRecord: [],
      dictForm: {
        type: '',
        name: '',
        nameEncrypt: '',
        needReply: '',
        enable: '',
        description: ''
      },
      dictTempForm: {
        name: '',
        cType: '',
        enable: '0',
        description: '',
        params: {}
      },
      formLabelWidth: '120px'
    };
  },
  computed: {},
  mounted() {
    this.getDictData()
    this.getDictRecord()
  },
  beforeCreate() { }, // 生命周期 - 创建之前
  beforeMount() { }, // 生命周期 - 挂载之前
  beforeUpdate() { }, // 生命周期 - 更新之前
  updated() { }, // 生命周期 - 更新之后
  beforeDestroy() { }, // 生命周期 - 销毁之前
  destroyed() { }, // 生命周期 - 销毁完成
  activated() { },
  methods: {
    clearFormValidate(formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields();
      }
    },
    onError() {
      this.$message('非Json数据类型')
    },
    onJsonChange() { // 数据改变时触发
      console.log('onJsonChange', this.dictTempForm.params)
    },
    onJsonSave(formName) { // 点击保存触发
      console.log('onJsonSave', this.dictTempForm.params)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.editDictTempId) {
            this.put_Dict_temp(this.editDictTempId, this.dictTempForm)
          } else {
            this.addDict_temp(this.dictTempForm)
          }
        } else {
          console.log('error submit!!');
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
      this.dict_temp_dialog = true
      this.editDictTempId = ''
      this.title_temp_dialog = '创建词典模板'
      this.dictTempForm = {
        name: '',
        cType: '',
        enable: '0',
        description: '',
        params: {}
      }
    },
    detailsTemp(row) {
      alert(JSON.stringify(row))
    },
    showDictDialog() {
      this.add_dict_dialog = true
      this.title_dict_dialog = '新增词典'
      this.editDictId = ''
      this.dictForm = {
        cType: '',
        name: '',
        nameEncrypt: '',
        needReply: '',
        enable: '',
        description: ''
      }
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.editDictId) {
            this.put_Dict(this.editDictId, this.dictForm)
          } else {
            this.addDict(this.dictForm)
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    async addDict_temp(form) {
      const aclKey = 'role' + ':' + JSON.parse(this.$Cookies.get('roles'))[0].name
      const set_acl = {}
      set_acl[aclKey] = {
        read: true,
        write: true
      }
      const params = {
        data: form,
        ACL: set_acl,
        key: form.name,
        type: "dict_template"
      };
      const res = await postDict(params)
      if (res) {
        this.$message('创建成功')
        this.dict_temp_dialog = false
        this.getDictData()
      }
    },
    async addDict(form) {
      form.key = 'dict'
      const aclKey = 'role' + ':' + JSON.parse(this.$Cookies.get('roles'))[0].name
      const set_acl = {}
      set_acl[aclKey] = {
        read: true,
        write: true
      }
      const params = {
        data: form,
        ACL: set_acl,
        key: form.name
      };
      const res = await postDict(params)
      if (res) {
        this.$message('创建成功')
        this.add_dict_dialog = false
        this.getDictRecord()
      }
    },
    editDictTemp(row) {
      this.editDictTempId = row.objectId
      this.dictTempForm = row.data
      const { params = {}} = row.data
      this.dictTempForm.params = params
      this.dict_temp_dialog = true
      this.title_temp_dialog = '编辑词典模板'
    },
    editDict(row) {
      this.editDictId = row.objectId
      this.dictForm = row.data
      this.add_dict_dialog = true
      this.title_dict_dialog = '编辑词典'
    },
    async put_Dict_temp(editDictId, row) {
      const params = {
        data: row,
        key: row.name
      }
      const { updatedAt } = await putDict(editDictId, params)
      if (updatedAt) {
        this.getDictData()
        this.dict_temp_dialog = false
        this.$message('词典数据更新成功')
      } else {
        this.$message('词典数据更新失败')
      }
    },
    async put_Dict(editDictId, row) {
      const params = {
        data: row,
        key: row.name
      }
      const { updatedAt } = await putDict(editDictId, params)
      if (updatedAt) {
        this.getDictRecord()
        this.add_dict_dialog = false
        this.$message('词典数据更新成功')
      } else {
        this.$message('词典数据更新失败')
      }
    },
    async disabledDict(row, type) {
      row.data.enable = type
      const params = {
        data: row.data
      }
      const { updatedAt } = await putDict(row.objectId, params)
      if (updatedAt) {
        this.$message('词典状态设置成功')
      } else {
        this.$message('词典状态设置失败')
      }
    },
    async deleteDict(ObjectId, type) {
      const res = await this.$del_object('Dict', ObjectId)
      if (res) {
        if (type == '词典') {
          this.getDictRecord()
        } else {
          this.getDictData()
        }
        this.$message(type + '删除成功')
      } else {
        this.$message(type + '删除失败')
      }
    },
    async getDictData() {
      const parsms = {
        limit: 1000,
        where: {
          'type': 'dict_template'
        }
      }
      const { results } = await queryDict(parsms)
      this.dictRecord = results
    },
    async getDictRecord() {
      const parsms = {
        limit: 1000,
        where: {
          'data.key': 'dict'
        }
      }
      const { results } = await queryDict(parsms)
      console.log(results)
      this.dictData = results
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
    /deep/.jsoneditor-vue{
      max-height:400px;
      min-height: 100px;
    }
    /deep/.json-save-btn{
      cursor: pointer;
    }
  }
</style>
