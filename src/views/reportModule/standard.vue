<template>
  <div class="standard">
    <div style="padding:20px;" class="devicesright">
        <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
            <el-form-item label="标准类型">
                <el-select v-model="formInline.region" placeholder="标准类型">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="检测类型">
                <el-select v-model="formInline.region" placeholder="检测类型">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="检测名称">
                <el-input v-model="formInline.user" placeholder="请输入检测名称"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" >查询</el-button>
                <el-button type="primary" >重置</el-button>
            </el-form-item>
        </el-form>
        <div class="adddevices">
            <el-button type="primary" size="small" @click="addStandard">新增检测标准</el-button>
            <el-button type="danger" size="small">删除</el-button>
            <el-button type="primary" size="small">标准子项管理</el-button>
        </div>
        <div class="tableblock">
            <el-table
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column
                type="selection"
                width="55">
                </el-table-column>
                 <el-table-column
                type="index"
                label="序号"
                align="center"
                width="50">
                </el-table-column>
                <el-table-column
                label="检测标准名称"
                align="center"
                width="120">
                <template slot-scope="scope">{{ scope.row.date }}</template>
                </el-table-column>
                <el-table-column
                prop="name"
                label="标准类型"
                width="250"
                align="center"
                >
                </el-table-column>
                <el-table-column
                prop="address"
                label="适用产品"
                width="200"
                align="center"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                prop="name"
                label="检测类别"
                width="200"
                align="center"
                >
                </el-table-column>
                <el-table-column
                prop="name"
                label="标准发行单位"
                width="250"
                align="center"
                >
                </el-table-column>
                <el-table-column
                prop="name"
                label="标准发行时间"
                align="center"
                >
                </el-table-column>
                <el-table-column
                prop="name"
                label="备注"
                width="250"
                align="center"
                >
                </el-table-column>
                <el-table-column
                prop="name"
                label="系统创建时间"
                width="150"
                align="center"
                >
                </el-table-column>
           
                <el-table-column
                prop="name"
                label="检测标准管理"
                align="center"
                width="300"
                >
                <template slot-scope="scope">
                    <router-link target="_blank" to="/pdf/download">
                        <el-button type="primary" size="small">
                           下载
                        </el-button>
                    </router-link>
                </template>
                </el-table-column>
                
            </el-table>
        </div>
        <div class="pageblock">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-sizes="[10, 20, 30, 50]"
                :page-size="pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
    </div>
    <!--新增涉设备弹窗-->
    <el-dialog
        title="检测仪器新增"
        :visible.sync="dialogVisible"
        width="60%"
        >
       <div class="addContent">
           <el-form :model="form">
             <el-row>
                <el-col :span="12">
                    <el-form-item label="检验标准名称" :label-width="formLabelWidth">
                        <el-input v-model="form.name" autocomplete="off" placeholder="检验标准名称"></el-input>
                    </el-form-item>
                    <el-form-item label="适用产品" :label-width="formLabelWidth">
                        <el-select v-model="form.region" placeholder="选择取证设备分类">
                            <el-option label="区域一" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
                        </el-select>       
                   </el-form-item>
                   <el-form-item label="标准类型" :label-width="formLabelWidth">
                        <el-select v-model="form.region" placeholder="选择标准类型">
                            <el-option label="区域一" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
                        </el-select>       
                   </el-form-item>
                    <el-form-item label="标准发行单位" :label-width="formLabelWidth">
                        <el-input v-model="form.name" autocomplete="off" placeholder="请输入标准发行单位"></el-input>
                    </el-form-item>
                    <el-form-item label="备注信息" :label-width="formLabelWidth">
                        <el-input type="textarea" v-model="form.desc" :rows="4" placeholder="请输入标准备注信息"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                     <el-form-item label="检测标准文号" :label-width="formLabelWidth">
                        <el-input v-model="form.name" autocomplete="off" placeholder="请输入检测标准文号"></el-input>
                    </el-form-item>
                    <el-form-item label="标准类别" :label-width="formLabelWidth">
                        <el-select v-model="form.region" placeholder="选择标准类别">
                            <el-option label="区域一" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
                        </el-select>       
                   </el-form-item>
                  <el-form-item label="标准发行时间" :label-width="formLabelWidth">
                    <el-date-picker
                            v-model="form.time"
                            type="datetime"
                            placeholder="选择标准发行时间">
                    </el-date-picker>
                </el-form-item>
                 <el-form-item label="标准源文件" :label-width="formLabelWidth">
                   <el-input placeholder="请输入内容" v-model="form.filesrc">
                        <template slot="append">
                            <el-upload
                                class="upload-demo"
                                action="https://jsonplaceholder.typicode.com/posts/"
                                :limit="1"
                                accept=".PDF"
                                :before-upload="beforeUpload"
                                :on-success="successUpload"
                                >
                                <el-button size="small" type="primary">点击上传</el-button>
                            </el-upload>
                        </template>
                    </el-input>
                </el-form-item>
               
                </el-col>
             </el-row>
         </el-form>
       </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
import Parse from "parse";
import Pumpdepartment from "@/components/resource/pumpdepartment";
import {returnLogin} from '@/utils/return'
export default {
  components: {
    Pumpdepartment
  },
  data() {
    return {
        formLabelWidth:'120px',
        dialogVisible:false,
        departmentid:'',
        formInline: {
          user: '',
          region: '',
          filesrc:'',
          desc:'',
          time:''
        },
        //取证设备表格
         tableData: [{
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-08',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-06',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-07',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }],
        multipleSelection: [],
        pagesize:10,
        start:0,
        total:0,
        form: {
          name: '',
          region: '',
          laboratory:'',
          testbed:'',
          product:''
        },
        //弹窗关联的三个列表
        departmentlaboratory:[],
        testbedlist:[],
        productlist:[]
    };
  },
  mounted() {
   
  },
  methods: {
  
    //表格多选
    handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //分页操作
    handleSizeChange(val) {
    this.pagesize=val
    },
    handleCurrentChange(val) {
    this.start = (val-1)*this.pagesize
    },
    //增加设备弹窗
    addStandard(){
        this.dialogVisible = true
       
    },
    beforeUpload(file) {
        console.log(file)
        var testmsg=file.name.substring(file.name.lastIndexOf('.')+1)
        const extension = testmsg === 'pdf'
        if(!extension) {
            this.$message({
                message: '上传文件只能是pdf格式!',
                type: 'warning'
            });
        }
        return extension || extension2
    },
    successUpload(response, file, fileList){
        this.form.filesrc = response.path
    }
  }
};
</script>
<style lang="scss" scoped>
.standard {
  width: 100%;
  min-height: 875px;
  /* padding: 20px; */
  box-sizing: border-box;
  /* background: url("../../imgages/echartbanner1.png") no-repeat; */
  /* background-size: cover; */
//   display: flex;
  /* overflow: scroll; */
  .devicesright{
      .tableblock{
          margin-top:20px;
      }
  }
  .pageblock{
      margin-top:20px;
  }
  /deep/ .el-dialog__body{
      /deep/ .el-select{
          width:100%;
      }
      /deep/ .el-date-editor{
          width:100%;
      }
  }
  /deep/ .el-upload-list{
      display:none;
  }
    
}

</style>
<style>

</style>
