<template>
  <div class="tdengine">
    <div class="tdheader">
      <el-button type="success" size="small">新增</el-button>
      <el-button type="warning" size="small">批量删除</el-button>
    </div>
    <div class="tdtable">
      <el-table
        :data="tableData"
        class="tb-edit"
        style="width: 100%"
        highlight-current-row
        @row-click="handleCurrentChange"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="序号" type="index" width="50" ></el-table-column>
        <el-table-column label="应用名称" >
          <template slot-scope="scope">
            <template v-if="scope.row.edit">
              <el-input
                size="small"
                v-model="scope.row.date"
                placeholder="请输入内容"
                @change="handleEdit(scope.$index, scope.row)"
              ></el-input>
            </template>
            <span v-else>{{scope.row.date}}</span>
          </template>
        </el-table-column>
        <el-table-column label="数据库名称" >
          <template slot-scope="scope">
            <template v-if="scope.row.edit">
              <el-input
                size="small"
                v-model="scope.row.date"
                placeholder="请输入内容"
                @change="handleEdit(scope.$index, scope.row)"
              ></el-input>
            </template>
            <span v-else>{{scope.row.date}}</span>
          </template>
        </el-table-column>
        <el-table-column label="超级表名称" >
          <template slot-scope="scope">
            <template v-if="scope.row.edit">
              <el-input
                size="small"
                v-model="scope.row.name"
                placeholder="请输入内容"
                @change="handleEdit(scope.$index, scope.row)"
              ></el-input>
            </template>
            <span v-else>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="字段集">
          <template slot-scope="scope">
            <template v-if="scope.row.edit">
              <el-input
                size="small"
                v-model="scope.row.address"
                placeholder="请输入内容"
                @change="handleEdit(scope.$index, scope.row)"
              ></el-input>
            </template>

            <span v-else>{{scope.row.address}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="标签集" show-overflow-tooltip>
          <template slot-scope="scope">
            <template v-if="scope.row.edit">
              <el-input
                size="small"
                v-model="scope.row.address"
                placeholder="请输入内容"
                @change="handleEdit(scope.$index, scope.row)"
              ></el-input>
            </template>

            <span v-else>{{scope.row.address}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="创建语句" show-overflow-tooltip>
          <template slot-scope="scope">
            <template v-if="scope.row.edit">
              <el-input
                size="small"
                v-model="scope.row.address"
                placeholder="请输入内容"
                @change="handleEdit(scope.$index, scope.row)"
              ></el-input>
            </template>

            <span v-else>{{scope.row.address}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="插入语句" show-overflow-tooltip>
          <template slot-scope="scope">
            <template v-if="scope.row.edit">
              <el-input
                size="small"
                v-model="scope.row.address"
                placeholder="请输入内容"
                type="textarea"
                :rows="5"
                @change="handleEdit(scope.$index, scope.row)"
              ></el-input>
            </template>

            <span v-else>{{scope.row.address}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="更新时间">
          <template slot-scope="scope">
           

            <span>{{scope.row.address}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作类型" width="200">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              v-if="!scope.row.edit"
              @click="scope.row.edit=!scope.row.edit"
            >编 辑</el-button>
            <el-button
              v-else
              size="small"
              type="success"
              @click="handleSuccess(scope.$index, scope.row)"
            >保 存</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          edit: false
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
          edit: false
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
          edit: false
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
          edit: false
        }
      ],
      multipleSelection:[],//表格多选数据集
    };
  },
  mounted() {},
  methods: {
    handleCurrentChange(row, event, column) {
      //   console.log(row, event, column, event.currentTarget);
    },
    handleEdit(index, row) {
      //   console.log(index, row);
    },
    handleDelete(index, row) {
      //   console.log(index, row);
    },
    handleSuccess(index, row) {
      row.edit = false;
      var obj = row;
      this.$set(this.tableData, index, obj)
    },
    handleSelectionChange(val){
        this.multipleSelection = val
    }
  }
};
</script>
<style lang="scss" scoped>
.tdengine {
  height: 100%;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  .tdheader {
    height: 50px;
    margin-top: 30px;
    text-align: right;
  }
}
</style>