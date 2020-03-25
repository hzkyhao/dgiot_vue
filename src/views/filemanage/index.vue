<template>
  <div class="filemanage">
    <div class="fileheader">
      <div class="country">
       
        <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
         <el-form-item label="省份" >
          <el-input v-model="ruleForm.province" placeholder="请输入省份"></el-input>
        </el-form-item>
         <el-form-item label="市级">
          <el-input v-model="ruleForm.city" placeholder="请输入市"></el-input>
        </el-form-item>
        <el-form-item label="用户编号" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="出厂编号" prop="produce">
          <el-input v-model="ruleForm.produce"></el-input>
        </el-form-item>
         <el-form-item label="表地址" prop="addr">
          <el-input v-model="ruleForm.addr"></el-input>
        </el-form-item>
         <el-form-item label="集中器地址" prop="vcaddr">
          <el-input v-model="ruleForm.vcaddr"></el-input>
        </el-form-item>
         <el-form-item label="pn值" prop="pn">
          <el-input v-model="ruleForm.pn" type="number" :min="0"></el-input>
        </el-form-item>
        <!-- <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item> -->
      </el-form>
      </div>
      <div class="csv">
        <p style="font-size:14px;">CSV文件</p>
        <el-input v-model="csvpath"></el-input>
        <el-upload
          class="upload-demo"
          :action="uploadurl"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          multiple
          :limit="1"
          :on-change="handleChange"
          :on-exceed="handleExceed"
          :file-list="fileList"
        >
          <el-button size="small" type="primary" style="margin-top:20px;">上传CSV</el-button>
        </el-upload>
      </div>
      <div class="uploadcsv">
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
      </div>
    </div>
    <div>
      
    </div>
  </div>
</template>
<script>
import { Upload } from "@/api/filemanage";
export default {
  data() {
    return {
      // http://148.70.50.192:4080/upload
      fileList: [],
      csvpath: "",
      dir: "upload",
      path: "",
      node: null,
      locationpath: "",
      uploadurl: "/upload",
      ruleForm: {
        name: "",
        produce:'',
        pn:0,
        addr:'',
        vcaddr:'',
        country: "",
        province: "",
        city: "",
      },
      rules: {
        name: [
          { required: true, message: "请输入用户编号", trigger: "blur" }
        ],
         produce: [
          { required: true, message: "请输入出厂编号", trigger: "blur" }
        ],
         addr: [
          { required: true, message: "请输入表地址", trigger: "blur" }
        ],
         vcaddr: [
          { required: true, message: "请输入集中器地址", trigger: "blur" }
        ],
         pn: [
          { required: true, message: "请输入pn值", trigger: "blur" }
        ],
      }
    };
  },
  mounted() {},
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleChange(file) {
      this.csvpath = file.name;
    },
    submitBtn() {
     
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
           this.path = location.origin + "/" + this.dir + "/" + this.csvpath;
            console.log(this.path);
            Upload(this.node, this.ruleForm.country, this.ruleForm.province, this.ruleForm.city, this.path)
              .then(response => {
                if (response.result == true) {
                  this.$message({
                    message: "操作成功",
                    type: "success"
                  });
                } else {
                  this.$message.error("上传失败");
                }
              })
              .catch(error => {
                console.log(error);
              });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
<style scoped>
.filemanage {
  background: #ffffff;
  padding-left: 10px;
  box-sizing: border-box;
  width: 100%;
  min-height: 875px;
}
h4 {
  background: #cccccc;
  height: 50px;
  line-height: 50px;
}
.fileheader {
  padding: 20px;
  width: 100%;
  height: auto;
  border: 1px solid #dddddd;
  box-sizing: border-box;
}
.uploadcsv {
  margin-top: 20px;
  text-align: right;
}
</style>
<style>
.fileheader .el-form-item{
  display:inline-block;
}
</style>

