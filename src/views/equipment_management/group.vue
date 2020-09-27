<template>
  <div class="group">
    <el-row :gutter="20">
      <el-col :span="4">
        <div class="tree">
          搜索 :
          <el-input v-model="filterText" placeholder="输入关键字进行过滤" style="width: 200px;" />

          <el-tree
            ref="tree"
            :data="treeData"
            :props="defaultProps"
            :allow-drop="allowDrop"
            :allow-drag="allowDrag"
            default-expand-all
            class="treeitems"
            node-key="id"
            draggable
            @node-drop="handleDrop">
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <span v-if="data.tag.seen == true">
                <el-input v-model="editLabel" />
              </span>
              <span v-else style="color: #409EFF;">{{ node.label }}</span>
              <span v-if="data.tag.seen==false" style="margin-left: 5px;">
                <i
                  class="el-icon-plus"
                  title="新增"
                  style="color: #67C23A
                ;"
                  @click.stop="append(node, data)"/>
                <i class="el-icon-delete" title="删除" style="color: red;" @click.stop="deletes(node, data)" />
                <i
                  class="el-icon-edit"
                  title="编辑"
                  style="color: #909399
                ;"
                  @click.stop="rename(node, data)"/>
              </span>
              <span v-else>
                <i slot="suffix" class="el-icon-check" title="保存" @click.stop="savename(node, data)" />
              </span>
            </span>
          </el-tree>
        </div>
      </el-col>
      <el-col :span="20">
        <el-tabs v-model="activeName">
          <el-tab-pane label="统计预览" name="统计预览">
            <platform />
          </el-tab-pane>
          <el-tab-pane label="虚拟分组" name="虚拟分组">
            <devproduct />
          </el-tab-pane>
          <el-tab-pane label="设备列表" name="设备列表">
            <devicelist />
          </el-tab-pane>
          <el-tab-pane label="产品列表" name="产品列表">
            <productlist />
          </el-tab-pane>
          <el-tab-pane label="通道列表" name="通道列表">
            <resourcechannel />
          </el-tab-pane>
          <el-tab-pane label="用户列表" name="用户列表">
            <userlist />
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>

    <div class="dialog_module">
      <el-dialog :visible.sync="dialogVisible" title="提示" width="30%">
        <el-form ref="addForm" :model="addForm" status-icon label-width="100px" class="demo-ruleForm">
          <el-form-item label="日期" prop="date">
            <el-input v-model="addForm.date" autocomplete="off" />
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="addForm.name" autocomplete="off" />
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input v-model="addForm.address" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addRow(tableData, addForm, 'addForm')">提交</el-button>
            <el-button @click="resetForm('addForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { roletree, addGroup } from '@/api/home'
import platform from "@/views/equipment_management/platform_overview";
import devproduct from '@/views/equipment_management/home_group'
import devicelist from '@/views/equipment_management/home_index'
import productlist from '@/views/equipment_management/home_group2'
import resourcechannel from '@/views/engine/home_resourcechannel'
import userlist from '@/views/roles/home_structure';
export default {
  components: {
    platform,
    devproduct,
    devicelist,
    productlist,
    resourcechannel,
    userlist
  },
  data() {
    return {
      numberValidateForm: {
        name: ''
      },
      editLabel: "",
      editIndex: 0,
      filterText: "",
      filterTable: "",
      total: 0,
      pageSize: 10,
      currentPage2: 5,
      pageSizes: [5, 10, 20, 50],
      dialogVisible: false,
      currentPage: 1,
      addForm: {
        seen: false,
        date: "",
        name: "",
        address: ""
      },
      activeName: "统计预览",
      treeData: [
      ],
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: "leaf"
      },
      tableData: [{
        seen: false,
        date: "2016-05-02",
        name: "王仲虎",
        address: "上海市普陀区金沙江路 1518 弄"
      },
      {
        seen: false,
        date: "2016-05-04",
        name: "王季虎",
        address: "上海市普陀区金沙江路 1517 弄"
      },
      {
        seen: false,
        date: "2016-05-01",
        name: "王伯虎",
        address: "上海市普陀区金沙江路 1519 弄"
      },
      {
        seen: false,
        date: "2016-05-03",
        name: "王叔虎",
        address: "上海市普陀区金沙江路 1516 弄"
      },
      {
        seen: false,
        date: "2016-05-04",
        name: "王季虎",
        address: "上海市普陀区金沙江路 1517 弄"
      },
      {
        seen: false,
        date: "2016-05-01",
        name: "王伯虎",
        address: "上海市普陀区金沙江路 1519 弄"
      },
      {
        seen: false,
        date: "2016-05-03",
        name: "王叔虎",
        address: "上海市普陀区金沙江路 1516 弄"
      },
      {
        seen: false,
        date: "2016-05-04",
        name: "王季虎",
        address: "上海市普陀区金沙江路 1517 弄"
      },
      {
        seen: false,
        date: "2016-05-01",
        name: "王伯虎",
        address: "上海市普陀区金沙江路 1519 弄"
      },
      {
        seen: false,
        date: "2016-05-03",
        name: "王叔虎",
        address: "上海市普陀区金沙江路 1516 弄"
      },
      {
        seen: false,
        date: "2016-05-04",
        name: "王季虎",
        address: "上海市普陀区金沙江路 1517 弄"
      },
      {
        seen: false,
        date: "2016-05-01",
        name: "王伯虎",
        address: "上海市普陀区金沙江路 1519 弄"
      },
      {
        seen: false,
        date: "2016-05-03",
        name: "王叔虎",
        address: "上海市普陀区金沙江路 1516 弄"
      },
      {
        seen: false,
        date: "2016-05-04",
        name: "王季虎",
        address: "上海市普陀区金沙江路 1517 弄"
      },
      {
        seen: false,
        date: "2016-05-01",
        name: "王伯虎",
        address: "上海市普陀区金沙江路 1519 弄"
      },
      {
        seen: false,
        date: "2016-05-03",
        name: "王叔虎",
        address: "上海市普陀区金沙江路 1516 弄"
      },
      {
        seen: false,
        date: "2016-05-04",
        name: "王季虎",
        address: "上海市普陀区金沙江路 1517 弄"
      },
      {
        seen: false,
        date: "2016-05-01",
        name: "王伯虎",
        address: "上海市普陀区金沙江路 1519 弄"
      },
      {
        seen: false,
        date: "2016-05-03",
        name: "王叔虎",
        address: "上海市普陀区金沙江路 1516 弄"
      }
      ]
    };
  },
  computed: {
    tables() {
      const search = this.filterTable;
      if (search) {
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
      return this.tableData;
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  mounted() {
    this.getTree()
  },
  methods: {
    // 获取角色树
    getTree() {
      roletree().then(res => {
        this.treeData = res.results
        console.log(this.treeData)
      }).catch(e => {
        console.log(e)
        this.treeData = []
      })
    },
    // 新建虚拟分组
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addGroup(this.numberValidateForm.name).then(res => {
            this.$message({
              message: '新建设备分组成功',
              type: 'success'
            })
          }).catch(e => {
            this.$message({
              message: '新建设备分组失败' + e.computed,
              type: 'error'
            })
          })
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    append(node, data) {
      this.$prompt("节点名字", "增加节点", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({
          value
        }) => {
          this.$message({
            type: "success",
            message: "增加节点成功"
          });
          console.log(value);
          console.log(node, JSON.stringify(data));
          if (data.children) {
            data["children"].push({
              id: new Date().getTime(),
              label: value,
              tag: {
                seen: false
              }
            });
          } else {
            data['children'] = []
            data["children"].push({
              id: new Date().getTime(),
              label: value,
              tag: {
                seen: false
              }
            });
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    deletes(node, data) {
      console.log(node, data.label, "用axios 删")
      this.$confirm('此操作将永久删除该节点,包括其子节点', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    rename(node, data) {
      console.log(node, data)
      this.editLabel = data.label
      data.tag.seen = true
    },
    savename(node, data) {
      console.log(node, this.editLabel)
      data.label = this.editLabel
      data.tag.seen = false
    },
    allowDrop(draggingNode, dropNode, type) {
      if (draggingNode.level === dropNode.level) {
        if (draggingNode.data.parentId === dropNode.data.parentId) {
          return type === "prev" || type === "next";
        }
      } else {
        // 不同级不允许拖拽
        return false;
      }
    },
    // 拖拽==>判断节点能否被拖拽
    allowDrag(draggingNode) {
      return draggingNode.level !== 1;
    },
    // 拖拽成功完成时触发的事件，在这里可以将节点拖拽后的顺序返给后端

    handleDrop(node, data, type, event) {
      const arr = [];
      // data为拖拽后节点信息，找到它的父级，在从父级找子集
      const child = data.parent.childNodes;
      for (var key in child) {
        arr.push({
          id: child[key].data.id
        });
      }
      // 转为JSON字符串发请求带走信息
    },
    handleDelete(index, row, tables) {
      console.log(index, row, tables);
      this.$confirm("此操作将永久删除该条, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          tables.splice(index, 1);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleEdit(index, row) {
      row.seen = true;
    },
    handleSave(index, row) {
      row.seen = false;
      this.$message({
        type: "success",
        message: "编辑成功!"
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    addRow(tableData, event, formName) {
      tableData.unshift(event);
      this.$message({
        type: "success",
        message: "新增成功!"
      });
      this.$nextTick(() => {
        this.editFlag = false;
        this.dialogVisible = false;
      });
    },
    format(val) {
      if (val.indexOf(this.filterTable) !== -1 && this.filterTable !== "") {
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
    },
    handleSizeChange(newSize) {
      // pagesize改变触发
      this.currentPage = 1;
      this.pageSize = newSize;
    },
    handleCurrentChange(newPage) {
      // 页码改变触发
      this.currentPage = newPage;
    }
  }
};

</script>

<style lang="scss" scoped>
  .group {
    margin: 20px;
    .custom-tree-node{
      width: 100%;
      .el-input{
        width: 60%;
      }
      i{
        margin-left: 5px;
      }
    }
    /deep/ {
      .el-tree-node__content {
        height: 40px;
      }
    }
  }
</style>
