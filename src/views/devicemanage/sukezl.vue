<template>
  <div class="sukezl">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="指令记录管理" name="first">
        <div class="firstheader">
          <el-form ref="zlForm" :model="zlForm" :inline="true" >
            <el-form-item label="设备类型">
              <el-select v-model="zlForm.hardwareType" placeholder="请选择设备类型">
                <el-option
                  v-for="(item,index) in deviceData"
                  :key="index"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="设备编号">
              <el-input v-model="zlForm.hardware_number"></el-input>
            </el-form-item>
            <!-- <el-form-item label="指令分类">
              <el-select v-model="zlForm.region" placeholder="请选择指令分类">
                <el-option label="控制" :value="0"></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="指令状态">
              <el-select v-model="zlForm.status" placeholder="请选择指令状态">
                <el-option label="发送成功" value="SEND_SUCCESS"></el-option>
                <el-option label="发送失败设备不在线" value="SEND_FAIL_OFFLINE"></el-option>
                <el-option label="发送失败授权码不正确" value="SEND_FAIL_DISALLOW"></el-option>
                <el-option label="等待发送" value="WAIT_SEND"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="指令回复类型">
              <el-select v-model="zlForm.needReply" placeholder="请选择回复类型">
                <el-option label="全部" :value="9"></el-option>
                <el-option label="需要" :value="1"></el-option>
                <el-option label="不需要" :value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="开始时间">
              <el-date-picker v-model="zlForm.starttime" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间">
              <el-date-picker v-model="zlForm.endtime" type="datetime" placeholder="选择结束时间"></el-date-picker>
            </el-form-item>
             <!-- <el-form-item label="显示状态">
              <el-select v-model="zlForm.display" placeholder="请选择指令分类">
                <el-option label="全部可见" :value='9'></el-option>
                <el-option label="显示可见" :value='1'></el-option>
                <el-option label="显示隐藏" :value='0'></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item>
              <el-button type="primary" size="mini" @click="getZldata(0)">查询</el-button>
              <el-button @click="resetForm" size="mini" type="primary">重置</el-button>
              <!-- <el-button type="warning" size="small">隐藏</el-button>
              <el-button type="success" size="small">显示</el-button> -->
            </el-form-item>
          </el-form>
        </div>
        <div class="firsttable">
          <el-table :data="zlData" style="width: 100%;text-align:center;" ref="multipleTable">
             <!-- <el-table-column
              type="selection"
              width="55">
            </el-table-column> -->
            <el-table-column  label="设备类型" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.attributes.hardwareType}}</span>
              </template>
            </el-table-column>
            <el-table-column  label="设备编号" align="center">
               <template slot-scope="scope">
                <span>{{scope.row.attributes.hardware_number}}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column  label="指令分类" align="center" width="100">
               <template slot-scope="scope">
                <span>控制</span>
              </template>
            </el-table-column> -->
            <el-table-column  label="指令ID" align="center">
               <template slot-scope="scope">
                <span>{{scope.row.attributes.instruct_id}}</span>
              </template>
            </el-table-column>
            <el-table-column  label="指令名称" align="center" width="100">
              <template slot-scope="scope">
                <span>{{scope.row.attributes.name}}</span>
              </template>
            </el-table-column>
             <el-table-column label="指令路径" align="center" width="300">
               <template slot-scope="scope">
                <span v-if="scope.row.attributes.dir==1">FROM_HARDWARE_TO_SOFTWARE</span>
                <span v-else-if="scope.row.attributes.dir==2">FROM_SOFTWARE_TO_HARDWARE</span>
               </template>
             </el-table-column>
            <el-table-column  label="指令参数" align="center">
               <template slot-scope="scope">
                <span>{{scope.row.attributes.paras}}</span>
               </template>
            </el-table-column>
            <el-table-column  label="指令状态" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.attributes.status}}</span>
              </template>
            </el-table-column>
            <el-table-column  label="指令下发时间" align="center"  width="200">
              <template slot-scope="scope">
                <span>{{timestampToTime(scope.row.attributes.ts)}}</span>
              </template>
            </el-table-column>
            <el-table-column  label="指令记录操作" align="center" width="150">
              <template slot-scope="scope">
                <el-button type="danger" size="mini" @click="Deletezl(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="fenye">
          <el-pagination
            background
            @size-change="zlSizeChange"
            :pager-count="5"
            @current-change="zlCurrentChange"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="zlPageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="zlTotal"
          ></el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="指令管理" name="second">
        <div class="secondheader">
          <el-form ref="sukeForm" :model="sukeForm" :inline="true">
            <el-form-item label="设备类型">
              <el-select v-model="sukeForm.hardwareType" placeholder="请选择设备类型">
                <el-option
                  v-for="(item,index) in deviceData"
                  :key="index"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="指令分类">
              <el-select v-model="sukeForm.region" placeholder="请选择指令分类">
                <el-option label="控制" value="shanghai"></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="指令状态">
              <el-select v-model="sukeForm.enable" placeholder="请选择指令状态">
                <el-option label="全部" :value="9"></el-option>
                <el-option label="启用" :value="1"></el-option>
                <el-option label="禁用" :value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="指令回复类型">
              <el-select v-model="sukeForm.needReply" placeholder="请选择指令回复类型">
                <el-option label="全部" :value="9"></el-option>
                <el-option label="需要" :value="1"></el-option>
                <el-option label="不需要" :value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="指令名称">
              <el-select v-model="sukeForm.name" placeholder="请选择指令名称" clearable>
                <el-option v-for="(item,index) in sukeDatazl" :label="item.name" :key="index" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="mini" @click="searchzl(0)">查询</el-button>
              <el-button size="mini" type="primary" @click="resetsukeForm">重置</el-button>
              <el-button size="mini" type="primary" @click="dialogFormVisible=true">指令增加</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="firsttable">
          <el-table :data="sukeData" style="width: 100%;text-align:center;">
            <el-table-column prop="hardwareType" label="设备类型" align="center"></el-table-column>
            <!-- <el-table-column label="指令分类" align="center">
              <template slot-scope="scope">
                <span>控制</span>
              </template>
            </el-table-column> -->
            <el-table-column prop="name" label="指令名称" align="center"></el-table-column>
            <el-table-column prop="nameEncrypt" label="加密指令" align="center"></el-table-column>
            <el-table-column label="指令回复类型" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.needReply==1">需要回复</span>
                <span v-else>不需要回复</span>
              </template>
            </el-table-column>
           
            <el-table-column prop="remark" label="备注" align="center"></el-table-column>
            <el-table-column prop label="指令操作" align="center" width="300">
              <template slot-scope="scope">
                <el-button type="primary" @click="ESukeZl(scope.row)" size="mini">编辑</el-button>
                <el-button
                  type="success"
                  size="mini"
                  v-if="scope.row.enable==0"
                  @click="editorsukezl(scope.row)"
                >启用</el-button>
                <el-button type="warning" size="mini" v-else @click="editorsukezl(scope.row)">禁用</el-button>
                <!-- <el-button type="danger" size="mini" @click="deletesukezl(scope.row.id)">删除</el-button> -->
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="fenye">
          <el-pagination
            background
            @size-change="sukeSizeChange"
            :pager-count="5"
            @current-change="sukeCurrentChange"
            :page-sizes="[1,10, 20, 30, 50]"
            :page-size="sukePageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="sukeTotal"
          ></el-pagination>
        </div>
        <!--增加指令弹窗-->
        <el-dialog title="指令" :visible.sync="dialogFormVisible">
          <el-form :model="form" ref="sukeform" :rules="rules">
            <el-form-item label="设备类型" :label-width="formLabelWidth" prop="hardwareType">
              <el-select v-model="form.hardwareType" placeholder="请选择设备类型" style="width:100%">
                <el-option
                  v-for="(item,index) in deviceData"
                  :key="index"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="指令名称" :label-width="formLabelWidth" prop="name">
              <el-input v-model="form.name" autocomplete="off" placeholder="请输入指令名称1，30个字符"></el-input>
            </el-form-item>
            <el-form-item label="加密指令" :label-width="formLabelWidth" prop="nameEncrypt">
              <el-input v-model="form.nameEncrypt" autocomplete="off" placeholder="请输入加密指令1，30个字符"></el-input>
            </el-form-item>
            <el-form-item label="指令回复类型" :label-width="formLabelWidth" prop="needReply">
              <el-select v-model="form.needReply" placeholder="请选择指令回复类型" style="width:100%">
                <el-option label="需要" :value="1"></el-option>
                <el-option label="不需要" :value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="指令状态" :label-width="formLabelWidth" prop="enable">
              <el-select v-model="form.enable" placeholder="请选择状态" style="width:100%">
                <el-option label="启用" :value="1"></el-option>
                <el-option label="废弃" :value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="备注" :label-width="formLabelWidth">
              <el-input type="textarea" v-model="form.remark" :row="5"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addsukezl('sukeform')">确 定</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { searchSuketype, addSkzl, editorSkzl,querydevinfo,queryzlinfo } from "@/api/sukeserver"
import Parse from 'parse'
import {returnLogin} from '@/utils/return'
var arr=[]
export default {
  data() {
    var validName = (rule, value, callback) => {
      let reg = /^[(\u4e00-\u9fa5)|(0-9a-zA-Z)]{1,30}/;
      if (!reg.test(value)) {
        callback(new Error("应用商名称，1到30个字符"));
      } else {
        callback();
      }
    };
    return {
      formLabelWidth: "120px",
      dialogFormVisible: false,
      form: {
        name: "",
        region: "",
        hardwareType: "",
        nameEncrypt: "",
        needReply: "",
        enable: "",
        remark: "",
        objectId:''
      },
      activeName: "first",
      zlForm: {
        hardware_number: "",
        region: "",
        hardwareType: "",
        nameEncrypt: "",
        needReply: "",
        status: "",
        starttime:new Date(new Date().setHours(0, 0, 0, 0)-24*60*60*1000*90),
        endtime: new Date(),
        display:9,
      },
      sukeForm: {
        name: "",
        region: "",
        hardwareType:'',
        enable:9,
        needReply:9
      },
      rules: {
        name: [
          { required: true, message: "请输入指令名称", trigger: "blur" },
          { min: 1, max: 30, message: "长度在 1到 30 个字符", trigger: "blur" }
        ],
        hardwareType: [
          { required: true, message: "请选择设备类型", trigger: "change" }
        ],
        needReply: [
          { required: true, message: "请选择指令回复类型", trigger: "change" }
        ],
        enable: [
          { required: true, message: "请选择指令状态", trigger: "change" }
        ],
        nameEncrypt: [
          { required: true, message: "请输入加密指令", trigger: "blur" }
        ]
      },
      zlData: [],
      zlPageSize: 10,
      zlTotal: 0,
      zlStart: 0,
      sukeData: [],
      sukePageSize: 10,
      sukeTotal: 0,
      sukeStart: 0,
      deviceData: [],
      zlobjectId:'',
      sukeDatazl:[]
    };
  },
  mounted() {
    this.getSukedevtype();
    this.searchzl1()
    // this.getSukedev()
  },
  methods: {
    // getSukedev(){
    //   var SukeDev = Parse.Object.extend('SukeDev')
    //   var sukedev = new Parse.Query(SukeDev)
    //   sukedev.limit(10000)
    //   sukedev.find().then(resultes=>{
    //     resultes.map(items=>{
    //       if(!items.attributes.yysId||!items.attributes.yysName){
    //           arr.push(
    //             　new Promise((resolve,reject)=>{
    //                  var SukeDev = Parse.Object.extend('SukeDev')
    //                   var sukedev = new SukeDev()
    //                   sukedev.id = items.id
    //                    sukedev.set('yysName','电表')
    //                    sukedev.set('yysId','09')
    //                   sukedev.save().then(result => {
    //             　　　　　　　resolve(result)
    //                   },error=>{
    //           　　　　　　reject(error)
    //                     });
    //            })　　　
    //           )
    //       }
    //     })
    //     this.promiseall(arr)
    //   })
    // },
    // promiseall(arr){
    //    Promise.all(arr).then(data=>{
    //         //成功
    //     }).catch(error=>{
    //     　　//失败
    //     })
    // },
    timestampToTime(timestamp) {
      var date = new Date(timestamp * 1000) 
      var Y = date.getFullYear() + '-';
      var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
      var D = (date.getDate()+1 <= 10 ? '0'+(date.getDate()) : date.getDate()) + ' ';
      var h = (date.getHours()+1 <= 10 ? '0'+(date.getHours()) : date.getHours())  + ':';
      var m = (date.getMinutes()+1 <= 10 ? '0'+(date.getMinutes()) : date.getMinutes())  + ':';
      var s = (date.getSeconds()+1 <= 10 ? '0'+(date.getSeconds()) : date.getSeconds());
      return Y+M+D+h+m+s;
    },
    getSukedevtype() {
       querydevinfo(this.sukeForm,this.sukeStart,this.sukePageSize).then(response=>{
         this.deviceData=response.data
         this.getZldata()
       })
    },
    getZldata(start){
      if(start==0){
        this.zlStart=0
      }
        var Sukelog = Parse.Object.extend('SukeLog')
         var sukelog = new Parse.Query(Sukelog)
         if(this.zlForm.hardwareType!=""){
           sukelog.equalTo('hardwareType',this.zlForm.hardwareType)
         }
         if(this.zlForm.hardware_number!=''){
           sukelog.equalTo('hardware_number',this.zlForm.hardware_number)
         }
  
         if(this.zlForm.status!=''){
           sukelog.equalTo('status',this.zlForm.status)
         }
         if(this.zlForm.starttime!=''){
           var starttime=Math.ceil(Number(this.zlForm.starttime)/1000)
           sukelog.greaterThan('ts',starttime)
         }
         if(this.zlForm.endtime!=''){
           var endtime=Math.ceil(Number(this.zlForm.endtime)/1000)
           sukelog.lessThan('ts',endtime)
         }
          sukelog.limit(this.zlPageSize)
          sukelog.skip(this.zlStart)
          sukelog.ascending('-ts')
          sukelog.count().then(count=>{
         this.zlTotal =count
         sukelog.find().then(results=>{
           this.zlData = results
         })
        })
    },
    handleClick(tab, event) {
      if (tab.name == "second") {
        this.searchzl()
      }
    },

    resetForm() {
      this.zlForm=
        {
        hardware_number: "",
        region: "",
        hardwareType: "",
        nameEncrypt: "",
        needReply: "",
        status: "",
        starttime:new Date(new Date().setHours(0, 0, 0, 0)-24*60*60*1000*90),
        endtime: new Date(),
        display:9,
      }
    },
    searchzl1(){
      queryzlinfo({}).then(resultes=>{
        if(resultes){
          this.sukeDatazl = resultes.data;
        }
        
        
      })
    },
    searchzl(start){
      if(start==0){
        this.sukeStart=0
      }
      queryzlinfo(this.sukeForm,this.sukeStart,this.sukePageSize).then(resultes=>{
         if(resultes){
        this.sukeData = resultes.data;
        this.sukeTotal = resultes.count;
         }
      })
    },
    //指令记录管理
    zlSizeChange(val) {
      this.zlPageSize = val;
      this.getZldata()
    },
    zlCurrentChange(val) {
      this.zlStart = (val - 1) * this.zlPageSize;
      this.getZldata()
    },
    Deletezl(id){
      this.$confirm('此操作将永久删除此条指令记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var Sukelog = Parse.Object.extend('SukeLog')
            var sukelog = new Parse.Query(Sukelog)
            sukelog.get(id).then(object=>{
              object.destroy().then(res=>{
                if(res){
                  this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                this.getZldata()
                }
              })
            })
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      
    },
    handleSelectionChange(val){
      console.log(val)
    },
    ESukeZl(row){
        this.dialogFormVisible=true
        this.form.hardwareType=row.hardwareType,
        this.form.name=row.name,
        this.form.nameEncrypt=row.nameEncrypt,
        this.form.needReply=row.needReply,
        this.form.remark=row.remark,
        this.form.enable=row.enable
        this.form.objectId=row.objectId
        
    },
    //指令管理
    sukeSizeChange(val) {
      this.sukePageSize = val;
      this.searchzl()
    },
    sukeCurrentChange(val) {
      this.sukeStart = (val - 1) * this.sukePageSize;
      this.searchzl()
    },
    addsukezl(formName) {  
      this.$refs[formName].validate(valid => {
        if (valid) {
          if(this.form.objectId==''){
             addSkzl(this.form).then(resultes => {
            if (resultes) {
              this.$message({
                type: "success",
                message: "添加成功"
              });
              this.$refs[formName].resetFields()
              this.form.remark=''
              this.dialogFormVisible = false;
              this.searchzl()
             
            }
          }).catch(error=>{
            this.$message({
              type: "error",
              message: error.error
            })
          });
        }else{
          editorSkzl(this.form).then(resultes=>{
             if (resultes) {
              this.$message({
                type: "success",
                message: "修改成功"
              });
              this.$refs[formName].resetFields()
              this.form.remark=''
              this.dialogFormVisible = false;
              this.searchzl()
              
            }
          })
        } 
        }
      });
    },
    editorsukezl(row) {
      if (row.enable == 1) {
        row.enable = 0;
        editorSkzl(row).then(resultes => {
          if (resultes) {
            this.$message({
              type: "error",
              message: "禁用成功"
            });
            this.handleClick({ name: "second" });
          }
        });
      } else {
        row.enable = 1;
        editorSkzl(row).then(resultes => {
          if (resultes) {
            this.$message({
              type: "success",
              message: "修改成功"
            });
            this.handleClick({ name: "second" });
          }
        });
      }
    },
    resetsukeForm(){
      this.sukeForm={
        name: "",
        region: "",
        hardwareType:'',
        enable:9,
        needReply:9
      }
    }
  }
};
</script>
<style scoped>
.sukezl {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}
.sukezl .firsttable {
  margin-top: 10px;
}
.fenye {
  margin-top: 10px;
}
</style>
<style>
.sukezl .el-tabs__header {
  padding-left: 10px;
  font-size: 16px;
}
.sukezl .el-table td,
.general .el-table th {
  padding: 5px 0;
}
.sukezl .el-tabs__header .el-tabs__item {
  font-size: 16px;
}
.sukezl .el-tabs__content {
  padding-left: 10px;
  box-sizing: border-box;
}
.sukezl .firstheader .el-input--suffix .el-input__inner,
.sukezl .firstheader .el-input__inner,
.sukezl .secondheader .el-input--suffix .el-input__inner,
.sukezl .secondheader .el-input__inner {
  height: 26px;
  border-radius: 0;
  line-height: 26px;
  width: 200px;
}
.sukezl .firstheader .el-date-editor.el-input{
  width:200px;
}
.firstheader .el-date-editor .el-input {
  width: 200px;
}
.firstheader .el-form-item {
  margin-bottom: 0;
}
.secondheader .el-form-item {
  /* width: 300px; */
  margin-bottom: 0;
}
</style>
