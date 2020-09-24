<template>
  <div class="group">
    <div class="tree">
      <el-input v-model="filterText" placeholder="输入关键字进行过滤" />

      <el-tree
        ref="tree"
        :data="treeData"
        :props="defaultProps"
        :filter-node-method="filterNode"
        class="filter-tree"
        accordion
        default-expand-all
      />
    </div>
    <div class="devlist">
      <el-input v-model="filterTable" placeholder="请输入内容" />
      <el-table :data="tables" style="width: 100%" row-key="id">
        <el-table-column label="日期" width="180">
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span style="margin-left: 10px" v-html="format(scope.row.date)" />
          </template>
        </el-table-column>
        <el-table-column label="姓名" width="180">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>姓名: {{ scope.row.name }}</p>
              <p>住址: {{ scope.row.address }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium" v-html="format(scope.row.name)" />
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
// import x from ''
export default {
  components: {},

  data() {
    return {
      filterText: "",
      filterTable: "",
      treeData: [
        {
          id: 1,
          label: "一级 1",
          children: [
            {
              id: 4,
              label: "二级 1-1",
              children: [
                {
                  id: 9,
                  label: "三级 1-1-1"
                },
                {
                  id: 10,
                  label: "三级 1-1-2"
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: "一级 2",
          children: [
            {
              id: 5,
              label: "二级 2-1"
            },
            {
              id: 6,
              label: "二级 2-2"
            }
          ]
        },
        {
          id: 3,
          label: "一级 3",
          children: [
            {
              id: 7,
              label: "二级 3-1"
            },
            {
              id: 8,
              label: "二级 3-2"
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      },
      tableData: [{
        date: '2016-05-02',
        name: '王仲虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王季虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王伯虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王叔虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    };
  },
  computed: {
    tables() {
      const search = this.filterTable;
      if (search) {
        console.log("this.tableData", this.tableData);
        return this.tableData.filter(dataNews => {
          return Object.keys(dataNews).some(key => {
            return (
              String(dataNews[key])
                .toLowerCase()
                .indexOf(search) > -1
            );
          });
        });
      }
      console.log("this.tableData", this.tableData);
      return this.tableData;
    }
  },
  watch: {
    filterTable(val) {
      this.$refs.tree.filter(val);
    }
  },

  methods: {
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    format(val) {
      if (val.indexOf(this.filterTable) !== -1 && this.filterText !== "") {
        return val.replace(
          this.filterTable,
          '<font color="red">' + this.filterTable + "</font>"
        );
      } else {
        return val;
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    }
  }
};
</script>

<style lang="scss" scoped>
.group{
  display: flex;
  .tree{
    flex:1
  }
  .devlist{
    flex:5
  }
}
</style>
