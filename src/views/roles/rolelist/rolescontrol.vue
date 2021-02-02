<template>
  <div class="rolescontrol">
    <div class="search">
      <el-input v-model="search" placeholder="请输入内容" style="width:200px" clearable/>
      <el-button type="primary" icon="el-icon-search" style="margin-left:20px;" >{{ $t('developer.search') }}</el-button>
      <el-button type="primary" icon="el-icon-plus" @click="addcontrol">{{ $t('developer.add') }}</el-button>
    </div>
    <tree-table
      :key="key"
      :default-expand-all="defaultExpandAll"
      :data="treeData"
      :columns="columns"
      style="margin-top:20px;"
      row-key="objectId"
    >
      <template slot="scope" slot-scope="{scope}">
        <el-tag>{{ scope.row.createtime }}</el-tag>
      </template>
      <template slot="operation" slot-scope="{scope}">
        <el-button size="mini" type="success" icon="el-icon-edit" @click="handleEdit(scope.row)">{{ $t('developer.edit') }}</el-button>
        <el-button size="mini" type="danger" icon="el-icon-delete" disabled @click="handleDelete(scope.row)">{{ $t('developer.delete') }}</el-button>
      </template>
    </tree-table>
    <!--编辑权限弹窗-->
    <el-dialog :title="$t('developer.edit')" :visible.sync="roleEdit">
      <el-form :model="form">
        <el-form-item :label="$t('user.name')" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" style="width:300px;" disabled/>
        </el-form-item>
        <el-form-item :label="$t('user.Reamrks')" :label-width="formLabelWidth">
          <el-input v-model="form.alias" autocomplete="off" style="width:300px;"/>
        </el-form-item>
        <el-form-item :label="$t('developer.describe')" :label-width="formLabelWidth">
          <el-input
            v-model="form.description"
            :rows="2"
            autocomplete="off"
            style="width:300px;"
            type="textarea"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleEdit = false">{{ $t('developer.cancel') }}</el-button>
        <el-button type="primary" @click="updaterole">{{ $t('developer.determine') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import treeTable from '@/components/TreeTable'
import { getcontrol } from '@/api/Role/index'
import { QueryPermission, getPermission, putPermission } from '@/api/Permission/index.js'
import Parse from 'parse'
import { utc2beijing } from '@/utils'
export default {
  components: { treeTable },
  data() {
    return {
      formLabelWidth: '120px',
      roleEdit: false,
      form: {
        name: '',
        alias: '',
        description: ''
      },
      search: '',
      defaultExpandAll: false,
      key: 1,
      permissionid: '',
      columns: [
        {
          label: 'Name',
          key: 'alias',
          expand: true,
          align: 'left'
        },
        {
          label: 'Alias',
          key: 'name',
          width: 200,
          align: 'center'
        },
        {
          label: 'Created time',
          key: 'scope'
        },
        {
          label: 'Operation',
          key: 'operation'
        }
      ],
      data: []
    }
  },
  computed: {
    treeData() {
      const cloneData = JSON.parse(JSON.stringify(this.data)) // 对源数据深度克隆
      return cloneData.filter(father => {
        const branchArr = cloneData.filter(child => father.objectId == child.parent) // 返回每一项的子级数组
        branchArr.length > 0 ? father.children = branchArr : '' // 如果存在子级，则给父级添加一个children属性，并赋值
        return father.parent == 0 // 返回第一层
      })
    }
  },
  mounted() {
    this.getcontrolrole()
  },
  methods: {
    async handleEdit(row) {
      this.permissionid = row.objectId
      console.log(row, this.permissionid)
      const resultes = await getPermission(row.objectId)
      console.log("QueryP", resultes)
      this.form.name = resultes.name
      this.form.description = resultes.description
      this.form.alias = resultes.alias

      this.roleEdit = true
    },
    handleDelete(row) {

    },
    addcontrol() {

    },
    async  getcontrolrole() {
      this.data = []
      const res = await queryPermission({ limit: 1000 })
      if (res.results) {
        const results = res.results
        results.map(items => {
          var obj = {}
          obj.name = items.name
          obj.alias = items.alias
          obj.objectId = items.objectId
          obj.parent = items.parent.objectId
          obj.createtime = utc2beijing(items.createdAt)
          this.data.push(obj)
        })
      } else {
        this.data = []
      }
    },
    updaterole() {
      this.$axiosWen.put(`iotapi/classes/Permission/${this.permissionid}`, {
        'alias': this.form.alias,
        'description': this.form.description
      }).then(res => {
        this.$message({
          type: 'success',
          message: '更新成功'
        })
        this.roleEdit = false
      }).catch(e => { console.log(e) })
    // .then(resultes => {
    //     console.log(resultes)
    //     resultes.set('alias', this.form.alias)
    //     resultes.set('description', this.form.description)

    //     })

    //   })
    }
  }
}
</script>
<style scoped>
.rolescontrol {
  width: 100%;
  min-height: 875px;
  padding: 20px;
  box-sizing: border-box;
  background: #ffffff;
}
</style>
