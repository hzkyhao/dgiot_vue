<!-- 组件说明 -->
<template>
  <div class="modules">
    <el-dialog :visible.sync="edit_module" title="修改物模型" width="17%">
      <el-form
        ref="editForm"
        :model="editForm"
        :rules="rules"
        label-width="100px"
        class="demo-editForm"
      >
        <el-form-item label="产品名称" prop="name">
          <el-input v-model="editForm.name" />
        </el-form-item>
        <el-form-item label="产品类型" prop="devType">
          <el-input v-model="editForm.devType" />
        </el-form-item>
        <el-form-item label="所属分类" prop="category">
          <el-cascader
            v-model="editForm.category"
            :options="categoryListOptions"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="editPostForm('editForm')"
        >修改</el-button
        >
        <el-button @click="resetForm('editForm')">重置</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="add_module" title="新增物模型" width="17%">
      <el-form
        ref="moduleForm"
        :model="moduleForm"
        :rules="rules"
        label-width="100px"
        class="demo-moduleForm"
      >
        <el-form-item label="产品名称" prop="name">
          <el-input v-model="moduleForm.name" />
        </el-form-item>
        <el-form-item label="产品类型" prop="devType">
          <el-input v-model="moduleForm.devType" />
        </el-form-item>
        <el-form-item label="所属分类" prop="category">
          <el-cascader
            v-model="moduleForm.category"
            :options="categoryListOptions"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="submitForm('moduleForm')"
        >立即创建</el-button
        >
        <el-button @click="resetForm('moduleForm')">重置</el-button>
      </span>
    </el-dialog>
    <header>
      <el-row :gutter="24">
        <el-col :span="20">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-plus"
            @click="add_module = true"
          >新增</el-button
          >
        </el-col>
        <el-col :span="4">
          <el-input
            v-model="searchText"
            placeholder="请输入产品名称"
            size="mini"
          >
            <el-button
              slot="append"
              size="mini"
              type="primary"
              icon="el-icon-search"
              @click="searchModule(searchText)"
            >搜索</el-button
            >
          </el-input>
        </el-col>
      </el-row>
    </header>
    <center>
      <el-table
        v-loading="pictLoading"
        :data="
          tableData.filter(
            data =>
              !search || data.name.toLowerCase().includes(search.toLowerCase())
          )
        "
        max-height="583"
        element-loading-background="rgba(0, 0, 0, 0.5)"
        element-loading-text="数据正在加载中"
        element-loading-spinner="el-icon-loading"
        style="width: 100%; min-height:583px"
      >
        <el-table-column label="objectId" prop="objectId" />
        <el-table-column label="产品名称">
          <template slot-scope="scope">{{ scope.row.data.name }}</template>
        </el-table-column>
        <el-table-column label="产品类型">
          <template slot-scope="scope">{{ scope.row.data.devType }}</template>
        </el-table-column>
        <el-table-column label="key" prop="key" />
        <el-table-column label="所属分类">
          <template slot-scope="scope">{{ scope.row.data.category }}</template>
        </el-table-column>
        <el-table-column align="right">
          <template slot="header" slot-scope="scope">
            <el-input
              v-model="search"
              size="mini"
              placeholder="输入关键字搜索"
            />
          </template>
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
            >修改</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row, tableData)"
            >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </center>
    <footer>
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="10"
        :total="pageTotal"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </footer>
  </div>
</template>

<script>
import Parse from 'parse'
export default {

  name: 'Modules',
  components: {

  },
  data() {
    return {
      productObj: [],
      pictLoading: false,
      categoryListOptions: [],
      limit: 10,
      skip: 0,
      add_module: false,
      edit_module: false,
      searchText: '',
      hashkey: '',
      categoryList: [],
      infoData: '物模型管理',
      currentPage: 1,
      pageTotal: 0,
      tableData: [],
      search: '',
      editForm: {
        name: '物模型管理',
        devType: '物模型管理',
        category: '',
        type: 'Product'
      },
      moduleForm: {
        name: '物模型管理',
        devType: '物模型管理',
        category: '',
        type: 'Product'
      },
      rules: {
        name: [
          { required: true, message: '请输入产品名称', trigger: 'blur' }
        ],
        devType: [
          { required: true, message: '请输入产品类型', trigger: 'blur' }
        ],
        category: [
          { required: true, message: '请选择模型所属分类', trigger: 'blur' }
        ]
      }

    };
  },
  computed: {

  },
  mounted() {
    this.searchModule('')
    this.Industry()
  },
  beforeCreate() {}, // 生命周期 - 创建之前
  beforeMount() {}, // 生命周期 - 挂载之前
  beforeUpdate() {}, // 生命周期 - 更新之前
  updated() {}, // 生命周期 - 更新之后
  beforeDestroy() {}, // 生命周期 - 销毁之前
  destroyed() {}, // 生命周期 - 销毁完成
  activated() {},
  methods: {
    // 查询product
    getProduct() {
      this.$axiosWen.get('/classes/Product').then(res => {
        this.productObj = res.results
        console.log(this.productObj)
      }).catch(e => {
        this.productObj = []
        console.log(e, "查询product出错")
      })
    },
    // 深度克隆
    treeData(paramData) {
      const cloneData = JSON.parse(JSON.stringify(paramData)) // 对源数据深度克隆
      return cloneData.filter(father => {
        const branchArr = cloneData.filter(child => father.id == child.parentid) // 返回每一项的子级数组
        branchArr.length > 0 ? (father.children = branchArr) : '' // 如果存在子级，则给父级添加一个children属性，并赋值
        return father.parentid == 0 // 返回第一层
      })
    },
    // 查询样品
    Industry() {
      this.categoryList = []
      var Dict = Parse.Object.extend('Dict')
      var datas = new Parse.Query(Dict)
      this.getProduct()
      datas.equalTo('data.key', 'category')
      datas.limit(1000)
      datas.find().then(
        response => {
          if (response) {
            response.map(items => {
              var obj = {}
              obj.value = items.attributes.type
              obj.label = items.attributes.data.CategoryName
              obj.id = items.attributes.data.Id
              obj.parentid = items.attributes.data.SuperId
              this.categoryList.push(obj)
            })
            // this.searchProduct();
            this.categoryListOptions = this.treeData(this.categoryList)
          }
        },
        error => {
          console.log(error, "error")
        }
      )
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = {
            "category": this.moduleForm.category[0],
            "devType": this.moduleForm.devType,
            "name": this.moduleForm.name
          }
          this.$axiosWen.post('/hash/Product', data).then(res => {
            const { objectId } = res
            this.hashkey = objectId
            this.productObj.forEach(i => {
              console.log(i)
              if (i.objectId == this.hashkey) {
                console.log(i.thing)
                data.thing = i.thing
              }
            })
            if (this.hashkey) {
              this.$axiosWen.post('/classes/Dict', {
                data: data,
                "key": this.hashkey,
                "type": this.moduleForm.type
              }).then(res => {
                this.$message({
                  type: "success",
                  message: "新建物模型成功"
                })
                this.add_module = false
                this.searchModule('')
              }).catch(e => {
                this.$message({
                  type: "error",
                  message: `新建物模型失败,原因${e.error}`
                })
              })
            }
          }).catch(e => {
            this.$message({
              type: "error",
              message: `key生成失败,原因${e.error}`
            })
            console.log(e)
          })
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 搜索
    searchModule(text) {
      this.pictLoading = true
      let params
      if (text.length) {
        params = {
          order: '-createdAt',
          keys: "count(*)",
          limit: this.limit,
          skip: this.skip,
          where: { type: 'Module', 'key': {
            '$regex': `${text}`
          }}
        }
      } else {
        params = {
          order: '-createdAt',
          keys: "count(*)",
          limit: this.limit,
          skip: this.skip,
          where: { type: 'Product' }
        }
      }
      this.$axiosWen.get('/classes/Dict', { params: params }).then(
        res => {
          this.pictLoading = false
          this.tableData = res.results
          this.pageTotal = res.count
        }).catch(
        e => {
          this.pictLoading = false
          console.log(e)
        })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.limit = val
      this.searchModule(this.searchText)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.skip = this.limit * (val - 1)
      this.searchModule(this.searchText)
    },
    handleEdit(index, row) {
      this.edit_module = true,
      this.editForm = row.data
      console.log(index, row);
    },
    editPostForm(form) {
      console.log(form)
    },
    handleDelete(index, row, rows) {
      this.$axiosWen.delete(`/classes/Dict/${row.objectId}`)
        .then(res => {
          rows.splice(index, 1);
          this.$message({
            type: "success",
            message: "删除成功"
          })
        })
        .catch(e => {
          this.$message({
            type: "error",
            message: `删除失败,原因${e.error}`
          })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
/* @import url() */
.modules {
  margin: 20px;
  footer {
    margin-top: 20px;
    text-align: center;
  }
}
</style>
