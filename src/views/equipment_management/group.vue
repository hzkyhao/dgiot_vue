<template>
  <div class="group">
    <div v-if="showTree" class="tree">
      搜索 :
      <el-input
        v-model="filterText"
        placeholder="输入关键字进行过滤"
        style="width: 200px;"
      />

      <el-tree
        ref="tree"
        :data="treeData"
        :props="defaultProps"
        :allow-drop="allowDrop"
        :allow-drag="allowDrag"
        :filter-node-method="filterNode"
        default-expand-all
        class="treeitems"
        node-key="id"
        draggable
        @node-drop="handleDrop"
      >
        <span slot-scope="{ node, data }" class="custom-tree-node">
          <span v-if="data.tag.seen == true">
            <el-input v-model="editLabel" />
          </span>
          <span v-else style="color: #409EFF;">{{ node.label }}</span>
          <span v-if="data.tag.seen == false" style="margin-left: 5px;">
            <i
              class="el-icon-plus"
              title="新增"
              style="color: #67C23A
                ;"
              @click.stop="append(node, data)"
            />
            <i
              class="el-icon-delete"
              title="删除"
              style="color: red;"
              @click.stop="deletes(node, data)"
            />
            <i
              class="el-icon-edit"
              title="编辑"
              style="color: #909399
                ;"
              @click.stop="rename(node, data)"
            />
          </span>
          <span v-else>
            <i
              slot="suffix"
              class="el-icon-check"
              title="保存"
              @click.stop="savename(node, data)"
            />
          </span>
        </span>
      </el-tree>
    </div>
    <div class="main">
      <el-tabs v-model="activeName" @tab-click="goTo">
        <el-tab-pane
          v-for="item in tabsNav"
          :key="item.url"
          :label="item.label"
          :name="item.url"
        />
      </el-tabs>
      <router-view />
    </div>
    <div class="setting">
      <i
        :class="[showTree ? 'el-icon-s-fold' : 'el-icon-s-unfold']"
        @click="toggleTree()"
      />
    </div>
  </div>
</template>

<script>
import {
  roletree,
  addGroup
} from "@/api/home";
export default {
  components: {},
  data() {
    return {
      tabsNav: [{
        label: "统计预览",
        url: "platform"
      },
      {
        label: "虚拟分组",
        url: "devproduct"
      },
      {
        label: "通道列表",
        url: "resourcechannel"
      },
      {
        label: "设备列表",
        url: "devicelist"
      },
      {
        label: "产品列表",
        url: "productlist"
      },
      {
        label: "规则列表",
        url: "engine"
      }
      ],
      numberValidateForm: {
        name: ""
      },
      editLabel: "",
      filterText: "",
      addForm: {
        seen: false,
        date: "",
        name: "",
        address: ""
      },
      treeData: [],
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: "leaf"
      },
      showTree: true
    };
  },
  computed: {
    activeName: {
      get: function() {
        if (this.$route.path.replace("/dashboard/", "") != '') {
          return this.$route.path.replace("/dashboard/", "")
        } else {
          return "platform"
        }
      },
      set: function() {

      }

    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  mounted() {
    this.getTree();
  },
  methods: {
    // 页面跳转
    goTo(tab) {
      this.$router.push({
        path: '/dashboard/' + tab.name
      })
    },
    // toggleTree
    toggleTree() {
      this.showTree = !this.showTree;
    },
    // 获取角色树
    getTree() {
      roletree()
        .then(res => {
          this.treeData = res.results;
          console.log(this.treeData);
        })
        .catch(e => {
          console.log(e);
          this.treeData = [];
        });
    },
    // 新建虚拟分组
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          addGroup(this.numberValidateForm.name)
            .then(res => {
              this.$message({
                message: "新建设备分组成功",
                type: "success"
              });
            })
            .catch(e => {
              this.$message({
                message: "新建设备分组失败" + e.computed,
                type: "error"
              });
            });
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
            data["children"] = [];
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
      console.log(node, data.label, "用axios 删");
      this.$confirm("此操作将永久删除该节点,包括其子节点", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
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
    rename(node, data) {
      console.log(node, data);
      this.editLabel = data.label;
      data.tag.seen = true;
    },
    savename(node, data) {
      console.log(node, this.editLabel);
      data.label = this.editLabel;
      data.tag.seen = false;
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
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    }
  }
};
</script>

<style lang="scss" scoped>
.group {
  display: flex;
  position: relative;
  margin: 20px;

  .custom-tree-node {
    width: 100%;

    .el-input {
      width: 60%;
    }

    i {
      margin-left: 5px;
    }
  }

  /deep/ {
    .el-tree-node__content {
      height: 40px;
    }
  }

  .tree {
    flex: 0 0 300px;
    /* 左侧固定200px */
  }

  .main {
    flex: 1;
  }

  .setting {
    cursor: pointer;
    top: 0;
    right: 20px;
    font-size: 20px;
    position: absolute;
  }
}
</style>
