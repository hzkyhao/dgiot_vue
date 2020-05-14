<template>
  <div class="tasklistmanage">
    <div class="taskheader">
      <h4>任务资源分配</h4>
      <div class="taskform">
        <el-form :inline="true" :model="taskform" class="demo-form-inline">
          <el-form-item>
            <el-input v-model="taskform.name" placeholder="任务名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="getCrondTask(0)">查 询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-plus" @click="dialogFormVisible=true">新建任务</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="tasktable">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column label="任务名称">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column prop="type" label="任务类型"></el-table-column>
        <el-table-column prop="attr" label="任务属性"></el-table-column>
        <!-- <el-table-column prop="name" label="任务执行频率"></el-table-column>
        <el-table-column prop="name" label="任务执行次数"></el-table-column>-->
        <el-table-column  label="上报通道">
            <template slot-scope="scope">
               <span>{{scope.row.upchannel.join('、')}}</span>
            </template>
        </el-table-column>
        <el-table-column prop="ts" label="开始执行时间"></el-table-column>
        <el-table-column label="任务状态">
            <template slot-scope="scope">
                <span v-if="scope.row.active==1" style="color:green">已激活</span>
                <span v-else style="color:red">未激活</span>
            </template>
        </el-table-column>
        <el-table-column prop="address" label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="editorCrond(scope.row.id)">编 辑</el-button>
            <el-popover placement="top" width="300" :ref="`popover-${scope.$index}`">
                <p>确定删除{{scope.row.name}}这个任务吗？</p>
                <div style="text-align: right; margin: 0">
                <el-button
                    size="mini"
                    @click="scope._self.$refs[`popover-${scope.$index}`].doClose()"
                >取消</el-button>
            <el-button type="primary" size="mini" @click="makeSure(scope)">确定</el-button>
            </div>     
            <el-button type="danger" slot="reference" size="mini">删 除</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="taskpage">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      <!-- <el-button type="primary" style="background:#409EFF">首页</el-button>
      <el-button type="primary" style="background:#409EFF">尾页</el-button> -->
      </el-pagination>
    </div>
    <div class="dialog">
      <el-dialog title="任务配置" :visible.sync="dialogFormVisible" width="40%" :close-on-click-modal="false">
        <el-form ref="form" :model="form" label-width="120px" :rules="formrules">
          <el-form-item label="任务名称" prop="name">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="任务类型" prop="type">
            <el-select v-model="form.type" placeholder="请选择任务类型">
              <el-option label="临时任务" :value="1"></el-option>
              <el-option label="即时任务" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务属性" prop="attributes">
            <el-select v-model="form.attributes" placeholder="请选择任务属性">
              <el-option label="当前数据" :value="1"></el-option>
              <el-option label="历史日数据" :value="2"></el-option>
              <el-option label="历史月数据" :value="3"></el-option>
              <el-option label="远程控制" :value="4"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上报通道" prop="upchannel">
            <el-select v-model="form.upchannel" placeholder="上报通道" multiple>
              <el-option label="主站" :value="1"></el-option>
              <el-option label="存储库" :value="2"></el-option>
              <el-option label="时序库" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="采集策略" class="lineone" label-width="100px">
            <div class="flexg" v-for="(item, index) in form.downchannel" :key="index">
              <el-form-item
                :label="'采集轮次'+(index+1)"
                class="elformcontent"
                label-width="100px"
                :prop="'downchannel.'+index+'.type'"
                :rules="[{required: true, message: '选择通道类型',trigger: 'change'}]"
              >
                <el-select v-model="item.type" placeholder="请选择通道类型">
                  <el-option
                    v-for="item in channel"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                :prop="'downchannel.'+index+'.interval'"
                :rules="[{required: true, message: '输入时长',type:'number'}]"
              >
                <el-input v-model.number="item.interval" type="number" :min="1" placeholder="本轮时长"></el-input>
              </el-form-item>
              <el-form-item>
                <el-select v-model="item.unit" placeholder="选择单位">
                  <el-option label="时" value="hours"></el-option>
                  <el-option label="分" value="minutes"></el-option>
                  <el-option label="秒" value="seconds"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-link
                  type="primary"
                  @click.prevent="removeDomain(item)"
                  :underline="false"
                  icon="el-icon-minus"
                >删除</el-link>
              </el-form-item>
            </div>
          </el-form-item>
          <div style="width: 100%;
    margin-left: 50px">
            <el-link @click="addDomain" icon="el-icon-plus" type="primary" :underline="false">添加采集策略</el-link>
          </div>

          <!-- <el-form-item label="任务执行次数">
                        <el-input v-model.number="form.unit" autocomplete="off" ></el-input>
          </el-form-item>-->
          <!-- <el-form-item label="任务执行频率" class="freq">
                        <el-form-item>
                             <el-select v-model="form.unit" placeholder="请选择">
                            <el-option></el-option>
                        </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-select v-model="form.freq" placeholder="请选择">
                            <el-option></el-option>
                        </el-select>
                        </el-form-item>
          </el-form-item>-->

          <el-form-item label="上报策略" prop="strategy">
            <el-select v-model="form.strategy" placeholder="上报策略">
              <el-option label="逐条上报" :value="1"></el-option>
              <el-option label="统一上报" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="开始执行时间">
                        <el-date-picker
                            v-model="form.starttime"
                            type="datetime"
                            placeholder="选择日期时间"
                            @change="testdata"
                            :picker-options="pickerOptionsStart"
                        ></el-date-picker>
                    </el-form-item>
          -->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('form')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import Parse from "parse";
import {utc2beijing} from '@/api/login'
var taskid = Math.floor(Math.random()*128+1)
export default {
  data() {
    return {
      taskform: {
        name: ""
      },
      tableData: [],
      multipleSelection: [],
      start: 0,
      pagesize: 10,
      total: 0,
      dialogFormVisible: false,
      channel: [
        {
          label: "LTE通道",
          value: 1
        },
        {
          label: "GPRS/CMDA通道",
          value: 2
        },
        {
          label: "LoRa通道",
          value: 3
        },
        {
          label: "微功率通道",
          value: 4
        },
        {
          label: "RS232/RS485通道",
          value: 5
        },
        {
          label: "红外通道",
          value: 6
        },
        {
          label: "NB-IOT通道",
          value: 7
        },
        {
          label: "载波通道",
          value: 8
        },
        {
          label: "Zeta通道",
          value: 9
        },
        {
          label: "ZigBee通道",
          value: 10
        },
        {
          label: "光纤通道",
          value: 11
        },
        {
          label: "网络连接",
          value: 12
        },
        {
          label: "5G通道",
          value: 13
        },
        {
          label: "WIFI通道",
          value: 14
        },
        {
          label: "RS422通道",
          value: 15
        },
        {
          label: "NFC通道",
          value: 16
        },{
          label: "Bluetooth通道",
          value: 17
        }
      ],
      form: {
        name: "",
        type: "",
        attributes: "",
        unit: "",
        starttime: "",
        freq: "",
        strategy: "",
        downchannel: [
          {
            type: "",
            interval: "",
            unit: "seconds"
          }
        ]
      },
      formrules: {
        name: [{ required: true, message: "请输入任务名称", trigger: "blur" }],
        type: [
          { required: true, message: "请选择任务类型", trigger: "change" }
        ],
        attributes: [
          { required: true, message: "请选择任务属性", trigger: "change" }
        ],
        strategy: [
          { required: true, message: "请选择上报策略", trigger: "change" }
        ],
        upchannel: [
          { required: true, message: "请选择上报通道", trigger: "change" }
        ]
      },
      pickerOptionsStart: {
        disabledDate: time => {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      crondid: ""
    };
  },
  mounted() {
      this.getCrondTask(1)
  },
  methods: {
    getCrondTask(index) {
        if(index==0){
            this.start=0
        }
        this.tableData=[]
      var Crond = Parse.Object.extend("Crond");
      var crond = new Parse.Query(Crond);
      crond.notEqualTo("type", 4);
      if (this.taskform.name != "") {
        crond.equalTo("name", this.taskform.name);
      }
      crond.ascending("-updatedAt");
      crond.skip(this.start);
      crond.limit(this.pagesize);
      crond.count().then(
        count => {
          this.total = count;
          crond.find().then(resultes => {
             
            resultes.map(items=>{
                 var obj={}
                var arr=[]
                obj.id = items.id
                obj.ts = utc2beijing(items.attributes.createdAt)
                obj.name = items.attributes.name
                if(items.attributes.type==1){
                    obj.type = '临时任务'
                }else if(items.attributes.type==2){
                    obj.type = '即时任务'
                }
               if(items.attributes.args.attr==1){
                   obj.attr = '当前数据'
               }else if(items.attributes.args.attr==2){
                   obj.attr='历史日数据'
               }
               else if(items.attributes.args.attr==3){
                   obj.attr='历史日数据'
               }
               else if(items.attributes.args.attr==4){
                   obj.attr='远程控制'
               }
               items.attributes.args.upchannel.map(upchannel=>{
                   var string=''
                   if(upchannel==1){
                       string='主站'
                   }else if(upchannel==2){
                       string='存储库'
                   }else{
                       string = '时序库'
                   }
                   arr.push(string)
               })
               obj.upchannel =arr
               obj.active = items.attributes.active
               this.tableData.push(obj)
            })
            
          });
        },
        error => {
          if (error.code == "209") {
            this.$message({
              type: "warning",
              message: "登陆权限过期，请重新登录"
            });
            this.$router.push({
              path: "/login"
            });
          } else if (error.code == 119) {
            this.$message({
              type: "error",
              message: "没有操作权限"
            });
          } else {
            this.$message(error.message);
          }
        }
      );
    },
    //分页
    handleSizeChange(val) {
      this.pagesize = val;
      this.getCrondTask(1)
    },
    handleCurrentChange(val) {
      this.start = (val - 1) * this.pagesize;
      this.getCrondTask(1)
    },
    testdata() {
      if (this.form.starttime < Date.now() - 2000) {
        this.$message("开始执行时间要大于当前时间");
        this.form.starttime = "";
      }
    },
    removeDomain(item) {
      var index = this.form.downchannel.indexOf(item);
      if (index !== -1) {
        this.form.downchannel.splice(index, 1);
      }
    },
    addDomain() {
      this.form.downchannel.push({
        type: "",
        interval: "",
        unit: "seconds"
      });
    },
    //添加和编辑用同一个弹窗
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var Crond = Parse.Object.extend("Crond");
          var crond = new Crond();
          var querycround = new Parse.Query(Crond)
          if (this.crondid != "") {
            crond.id = this.crondid;
          }
          var arr=[]
          this.form.downchannel.map(items=>{
            arr.push([items.type,items.interval])
          })
           crond.set('task',{
            'res':this.form.upchannel,
            "chs": arr,
            })
          crond.set("name", this.form.name);
          crond.set("visible", 1);
          crond.set("crond", {
                "freq": 2,
                "unit": 1,
                "end_time": 1601395200,
                "start_time": 1571152234
              });
          crond.set("type", this.form.type);
          crond.set("args", {
            upchannel: this.form.upchannel,
            downchannel: this.form.downchannel,
            attr: this.form.attributes,
            strategy: this.form.strategy
          });
          crond.set("active", 1);
         
          if(this.form.type==1){
              crond.set('typedesc','临时任务')
               crond.set("tid", 301)
          }else if(this.form.type==2){
              crond.set('typedesc','即时任务')
               crond.set("tid", 302)
          }
          //判断任务id是不是为空添加任务
          if(this.crondid==''){
              // querycround.equalTo('tid',taskid)
              // querycround.find().then(response=>{
              //   if(response.length!=0){
              //   this.$message({
              //       message: "任务id重复",
              //       type: "error"
              //   });
              //   return
              //   }else{
                 crond.save().then(resultes => {
                    if (resultes) {
                    this.$message("添加成功");
                    this.$refs[formName].resetFields();
                    this.form={
                        name: "",
                        type: "",
                        attributes: "",
                        unit: "",
                        starttime: "",
                        freq: "",
                        strategy: "",
                        downchannel: [
                        {
                            type: "",
                            interval: "",
                            unit: "seconds"
                        }
                        ]
                    },
                    this.dialogFormVisible = false;
                    this.crondid=''
                    this.getCrondTask(1)
            }
          });
            // }
            // })
            //编辑任务
        }else{
            crond.save().then(resultes => {
                        if (resultes) {
                        this.$message("编辑成功");
                        this.$refs[formName].resetFields();
                        this.form={
                            name: "",
                            type: "",
                            attributes: "",
                            unit: "",
                            starttime: "",
                            freq: "",
                            strategy: "",
                            downchannel: [
                            {
                                type: "",
                                interval: "",
                                unit: "seconds"
                            }
                            ]
                        },
                         taskid=Math.floor(Math.random()*128+1)
                        this.dialogFormVisible = false;
                        this.crondid=''
                        this.getCrondTask(1)
                }
          });
        }
         
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    editorCrond(id) {
        this.crondid=id
         var Crond = Parse.Object.extend("Crond");
         var crond = new Parse.Query(Crond);
         crond.get(id).then(resultes=>{
             this.dialogFormVisible=true
             this.form.upchannel=resultes.attributes.args.upchannel
             this.form.downchannel= resultes.attributes.args.downchannel
             this.form.attributes=resultes.attributes.args.attr
             this.form.strategy=resultes.attributes.args.strategy
             this.form.name = resultes.attributes.name
             this.form.type = resultes.attributes.type
             taskid=resultes.attributes.tid
             console.log(resultes)
         },error=>{
            if (error.code == "209") {
            this.$message({
              type: "warning",
              message: "登陆权限过期，请重新登录"
            });
            this.$router.push({
              path: "/login"
            });
          } else if (error.code == 119) {
            this.$message({
              type: "error",
              message: "没有操作权限"
            });
          } else {
            this.$message(error.message);
          } 
         })
    },
    makeSure(scope){
         var Crond = Parse.Object.extend("Crond");
         var crond = new Crond();
         crond.id = scope.row.id
         crond.destroy().then(response=>{
             if(response){
                  this.$message({
                      type:'success',
                      message:'删除成功'
                  })
                  scope._self.$refs[`popover-${scope.$index}`].doClose();
                  this.getCrondTask(1)
             }
         },error=>{
              if (error.code == "209") {
                    this.$message({
                    type: "warning",
                    message: "登陆权限过期，请重新登录"
                    });
                    this.$router.push({
                    path: "/login"
                    });
                } else if (error.code == 119) {
                    this.$message({
                    type: "error",
                    message: "没有操作权限"
                    });
                } else {
                    this.$message(error.message);
            } 
         })

    }
  }
};
</script>
<style lang="scss" scoped>
.tasklistmanage {
  height: 100%;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  background: #fff;
  .taskheader {
    .taskform {
      /deep/ .el-form-item:last-child {
        float: right;
      }
    }
  }
  .taskpage {
    margin-top: 20px;
  }
  .dialog {
    /deep/ .el-form {
      display: flex;
      flex-wrap: wrap;
      /deep/ .lineone {
        width: 100% !important;
      }
    }
    .el-form-item {
      width: 50%;
      @media screen and (max-width: 1350px) {
        width: 100%;
      }
      .el-input {
        width: 100%;
      }
      .el-select {
        width: 100%;
      }
    }
    /deep/ .freq {
      .el-form-item__content {
        display: flex;
      }
    }
  }
}
</style>
<style>
.flexg {
  display: flex;
  margin-top: 20px;
}
.elformcontent .el-input__inner {
  width: 200px;
}
/* .flexg .el-input__inner:first-child{
        width:200px;
    } */
</style>
