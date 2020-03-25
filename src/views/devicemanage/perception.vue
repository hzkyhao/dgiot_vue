<template>
  <div class="perception">
    <h2>质检工作台智能感知服务</h2>
    <div class="header">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="grid-content bg-purple" style="padding-top:50px;">
            <el-form ref="form" :inline="true" :model="form" label-width="80px">
                <el-form-item>
                    <el-upload
                    class="upload-demo"
                    ref="upload"
                    :action="action"
                    :data="data"
                    :limit="1"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-change="getFilename"
                    :on-success="uploadsuccess"
                    :on-error="uploaderror"
                    :auto-upload="false"
                >
                <label class="el-form-item__label" style="margin-left:10px;">文件名称:</label>
                <el-input v-model="form.file" placeholder="文件名称" style="width:200px"></el-input>
                <el-button slot="trigger" type="primary" >导入检测计划</el-button>
                <el-button
                    style="margin-left: 10px;"
                    type="primary"
                    @click="submitUpload"
                >确定</el-button>
                    </el-upload>
                </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple" style="float:right">
            <div class="block">
              <el-form ref="form" :inline="true" :model="formlive" label-width="120px">
                <el-form-item label="质检影像采集取证终端状态">
                  <el-radio-group v-model="formlive.livestatus">
                    <el-radio label="正常运行"></el-radio>
                    <el-radio label="异常中断"></el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-form>
            </div>
            <div class="block">
              <el-form ref="form" :inline="true" :model="formstatus" label-width="120px">
                <el-form-item label="质检控制台智能感知服务状态">
                  <el-radio-group v-model="formstatus.pstatus">
                    <el-radio label="正常运行"></el-radio>
                    <el-radio label="异常中断"></el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="content">
      <el-table
        :data="tableData"
        border
        style="width: 100%;text-align:center"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center" width="55"></el-table-column>
        <el-table-column prop="date" label="任务名称" align="center" ></el-table-column>
        <el-table-column prop="name" label="发布单位" align="center" ></el-table-column>
        <el-table-column prop="address" align="center" label="检测单位"></el-table-column>
        <el-table-column prop="address" align="center" label="质检员"></el-table-column>
        <el-table-column prop="address" align="center" label="计划开始时间"></el-table-column>
        <el-table-column prop="address" align="center" label="计划结束时间"></el-table-column>
        <el-table-column prop="address" align="center" label="检验台"></el-table-column>
        <el-table-column prop="address" align="center" label="任务状态"></el-table-column>
        <el-table-column prop="address" align="center" label="回传状态"></el-table-column>
        <el-table-column  align="center" label="任务操作" width="300">
          <template slot-scope="scope">
            <el-button type="primary" @click="startTask(scope.row.id)">开始</el-button>
            <el-button type="primary" @click="endTask(scope.row.id)">结束</el-button>
            <el-button type="primary" @click="startTask(scope.row.id)">回传</el-button>

          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          background
          :page-sizes="[10, 20, 30, 50]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          style="margin-top:20px;text-align:right"
        ></el-pagination>
      </div>
    </div>
    <div class="footer">
      <div>
        <p>电子证据操作</p>
      </div>

      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="导入" name="first">
          <div class="firstcard">
            <el-form ref="form" :inline="true" :model="form1" label-width="80px">
              <el-form-item>
                    <el-upload
                    class="upload-demo"
                    ref="upload1"
                    :action="action1"
                    :data="data1"
                    :limit="1"
                    :on-preview="handlePreview1"
                    :on-remove="handleRemove1"
                    :on-change="getFilename1"
                    :on-success="uploadsuccess1"
                    :on-error="uploaderror1"
                    :auto-upload="false"
                    
                >
                 <label class="el-form-item__label" style="margin-left:10px;">文件名称:</label>
                    <el-input v-model="form1.file" placeholder="文件名称" style="width:200px"></el-input>
                <el-button slot="trigger" type="primary" :disabled="selectData.length==0">浏览</el-button>
                <el-button
                    style="margin-left: 10px;"
                    type="primary"
                    @click="submitUpload1"
                    :disabled="selectData.length==0"
                >导入电子证据</el-button>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div>
              <p>导入须知：</p>
              <ol>
                <li>点击导入电子数据，自动弹窗选择文件夹-文件，将电子证据数据导入系统</li>
                <li>浏览可研选择文件，导出电子证据文件</li>
                <li>电子证据文件格式为zip压缩文件，名称为对应任务名称</li>
              </ol>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="导出" name="second">
          <div class="secondcard">
            <el-form ref="form" :inline="true" :model="form" label-width="80px">
              <el-form-item>
                <el-button type="primary" >导出电子证据链</el-button>
              </el-form-item>
              <el-form-item label="文件名称:">
                <el-input v-model="form.file" placeholder="文件名称"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary">导出</el-button>
              </el-form-item>
            </el-form>
            <div>
              <p>导出须知：</p>
              <ol>
                <li>点击导入电子数据，自动弹窗选择文件夹-文件，将电子证据数据导入系统</li>
                <li>浏览可研选择文件，导出电子证据文件</li>
                <li>电子证据文件格式为zip压缩文件，名称为对应任务名称</li>
              </ol>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import $ from 'jquery'
export default {
  data() {
    return {
      data: {},
      data1:{},
      activeName: "first",
      pagesize: 10,
      start: 0,
      total: 0,
      selectData: [],
      tableData: [
        {
          id:'1111',
          name:'111',
          address:'3333',
          date:'2222'
        },
        {
          id:'2222',
          name:'4444',
          address:'5555',
          date:'6666'
        }
      ],
      form: {
        file: ""
      },
      form1:{
          file:''
      },
      formlive: {
        livestatus: "正常运行"
      },
      formstatus: {
        pstatus: "正常运行"
      }
    };
  },
  computed: {
      action(){
        //   return "http://" + location.hostname + ":8080/api/upload";
          return "http://192.168.2.28:8080/api/upload"
      },
      action1(){
            //   return "http://" + location.hostname + ":8080/api/upload";
          return "http://192.168.2.28:80/offline/task"
      }
  },
  mounted() {},
  methods: {
    Leading() {},
    Renovate() {},
    handleSelectionChange(val) {
      this.selectData = val;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    getFilename(file) {
      this.form.file = file.name;
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    uploadsuccess(response, file, fileList){
        this.$message({
             type: "success",
             message: "上传成功"
        })
    },
    uploaderror(response, file, fileList){
        this.$message({
             type: "error",
             message: response
        })
    },
     handleRemove1(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview1(file) {
      console.log(file);
    },
    getFilename1(file) {
      this.form1.file = file.name;
    },
    submitUpload1() {
      this.$refs.upload1.submit();
    },
    uploadsuccess1(response, file, fileList){
        this.$message({
             type: "success",
             message: "上传成功"
        })
    },
    uploaderror1(response, file, fileList){
        this.$message({
             type: "error",
             message: response
        })
    }
  }
};
</script>
<style scoped>
.perception {
  width: 100%;
  min-height: 875px;
  padding: 20px;
  margin-top: 20px;
  box-sizing: border-box;
  background: #ffffff;
}
.header {
  height: 100px;
  width: 100%;
}
.footer {
  height: auto;
  width: 100%;
  border: 1px solid #cccccc;
  padding: 20px;
  box-sizing: border-box;
  margin-top: 20px;
}
.perception ol li {
  margin: 10px 0;
}
</style>
<style>
.perception .block .el-form--inline .el-form-item__label {
  text-align: left;
}
.perception .el-tabs--border-card > .el-tabs__content {
  padding: 40px;
}
</style>
