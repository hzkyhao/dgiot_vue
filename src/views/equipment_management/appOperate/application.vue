<template>
  <div class="application">
    <div class="addApplication">
    </div>
    <div  class="appcontent" style="position:relative;display:flex;flex-direction:column;align-items:center">
       <div class="isbutton">
           <el-button
        icon="el-icon-circle-plus-outline"
        round
        @click="dialogVisible=true"
      >添加新应用</el-button>
       </div>
      
       <el-card class="box-card" v-for="(item,index) in appdata" :key="index" style="width:80%;border:1px solid #cccccc;margin-bottom:10px">
       <el-row :gutter="24">
            <el-col :span="4"><div class="grid-content bg-purple">
               <i class="iconfont icon-yingyong" style="color:#666666"></i>
               <p>{{item.attributes.config.name}}</p>
               </div></el-col>
            <el-col :span="16">
               
               <div class="grid-content bg-purple">
                  <dl>
                    
                     <dt>App ID <el-tooltip content="在SDK调用过程中唯一的一个应用标识" placement="bottom" >
                                 <i class="el-icon-question"></i>
                                 </el-tooltip>
                     </dt>
                     <dd>{{item.id}}</dd>
                     <dt>App Secret <el-tooltip content="调用API时的Token,用来验证请求合法性,请注意保密" placement="bottom" >
                                 <i class="el-icon-question"></i>
                                 </el-tooltip></dt>
                    
                     <dd v-if="item.isshow">{{item.attributes.secret}}</dd>
                     <dd v-else>{{item.attributes.secret.substr(0,4)+'********************'+item.attributes.secret.substr(24)}}<el-button @click="xianshi(item.id)" size="samll" style="margin-left:10px;position:absolute;top:30px" round>完整密钥</el-button></dd>
                     <dt>应用描述</dt>
                     <dd v-if="item.attributes.desc">{{item.attributes.desc}}</dd>
                      <dd v-else>-</dd>
                  </dl>
               </div>
            </el-col>
            <el-col :span="4"><div class="grid-content bg-purple">
              <p class="editor">
                 <strong>操作:</strong>
              </p>
              <p class="editor">
                 <el-link type="primary" @click="updateapp(item.id)">修改应用信息</el-link>
              </p>
              <p class="editor">
                 <el-link type="primary" @click="deleteapp(item.id)">删除应用信息</el-link>
              </p>
               </div></el-col>
         </el-row>
    </el-card>
    <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[1,5,10]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
   </div>
    
    <!--新建弹框-->
    <el-dialog title="添加新应用" :visible.sync="dialogVisible" width="40%" :before-close="handleClose" :close-on-click-modal="false">
      <div class="block">
        <el-form ref="form" :model="form" label-width="120px">
            <!-- <el-form-item label="平台">
                <el-select v-model="form.product" placeholder="请选择平台"  style="width:80%">
                  <el-option v-for="(item,index) in selectapp" :key="index" :label="item.attributes.subtitle" :value="item.id"></el-option>
               </el-select>
          </el-form-item> -->
          <el-form-item label="应用描述">
            <el-input v-model="form.desc"  style="width:80%" placheholder="请输入应用名称"></el-input>
          </el-form-item>
          <el-form-item label="Token有效时间">
            <el-input type="number" v-model="form.time" style="width:80%" placheholder="请输入应用时间"></el-input><span style="margin-left:5px;">秒</span>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="Define">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改应用信息-->
    <el-dialog title="修改应用信息" :visible.sync="update" width="40%" :before-close="handleClose" :close-on-click-modal="false">
      <div class="block">
        <el-form ref="form" :model="form1" label-width="120px">
          <el-form-item label="应用描述">
            <el-input v-model="form1.desc"  style="width:80%"></el-input>
          </el-form-item>
           <el-form-item label="Token">
            <el-input v-model="form1.secret"  style="width:80%"></el-input>
          </el-form-item>
           <el-form-item label="Token有效时间">
            <el-input type="number" v-model="form1.time"  style="width:80%"  placheholder="请输入应用时间"></el-input><span style="margin-left:5px;">秒</span>
          </el-form-item>
        </el-form>
         </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="update = false">取 消</el-button>
        <el-button type="primary" @click="updatedDefine">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
let Base64 = require("js-base64").Base64;
import {Addapp} from '@/api/appcontrol'
import Parse from 'parse'
export default {
   inject:['reload'],
  data() {
    return {
       total:0,
       pagesize:10,
       start:0,
       update:false,
       form1:{
          name:'',
          product:'',
          time:'',
          secret:''
       },
      dialogVisible: false,
      form:{
         name:'',
         product:'',
         time:'',
         secret:''
         
      },
      appdata:[],
      objectid:'',
      selectapp:[],
      arr:[]
    };
  },
  created() {
    
  },
//   watch:{
//      appdata:{
//          handler(newVal) {
//          console.log(newVal)
//       },
//       deep:true
//      }
    
//   },
  mounted() {
       this.getAppdetail(this.pagesize,this.start)
      //  this.getSelect()
  },
  methods: {
     Define(){
        var ranNum = Math.ceil(Math.random() * 25)
        var session = Base64.encode(String.fromCharCode(65+ranNum)+Math.ceil(Math.random()*10000000)+Number(new Date()))
        Addapp(Number(this.form.time),this.form.desc,session).then(resultes=>{
            this.$message({
            type: "success",
            message: "应用创建成功"
         })
         this.dialogVisible=false
         this.getAppdetail(this.pagesize,this.start)
        }).catch(error=>{
           console.log(error)
        })
     },
     getAppdetail(pagesize,start){
        var App = Parse.Object.extend('App')
        var app = new Parse.Query(App)
         app.limit(pagesize)
         app.skip(start)
         app.ascending('-updatedAt')
         app.count().then(count=>{
         this.total =count
         app.find().then(resultes=>{
         this.appdata = resultes.concat([])
         this.appdata.map(item=>{
                  // item.desc = object.attributes.desc
                  item.isshow=false
            // this.selectapp.map(object=>{
            //    if(item.attributes.product.id==object.id){
                 
            //    }
            // })
         })
         console.log(this.appdata)
      })
   })
     },
   //   getSelect(){
   //       var Product =  Parse.Object.extend('_Product')
   //          var product = new Parse.Query(Product)
   //          product.find().then(res=>{
   //             this.selectapp = res
   //             this.form.product=res[0].id
   //          })
   //   },
     handleSizeChange(val) {
      this.pagesize = val;
      this.getAppdetail(this.pagesize,this.start)
    },
    handleCurrentChange(val) {
      this.start = Number(val - 1) * Number(this.pagesize);
      this.getAppdetail(this.pagesize,this.start)
    },
     updateapp(id){
        this.objectid = id
         var App = Parse.Object.extend('App')
         var app = new Parse.Query(App)
         app.get(id).then(res=>{
            this.update = true
            this.form1.time = res.attributes.config.expires
            this.form1.secret = res.attributes.secret
            this.form1.desc = res.attributes.desc
         },error=>{
            console.log(error)
         })
     },
     updatedDefine(){
         var App = Parse.Object.extend('App')
         var app = new Parse.Query(App)
         app.get(this.objectid).then((object)=>{
            object.set('config',{expires:this.form1.time})
            object.set('secret',this.form1.secret)
            object.set('desc',this.form1.desc)
            object.save().then(resultes=>{
             this.$message({
               type: "success",
               message: "应用修改成功"
         })
         this.update=false
         this.getAppdetail(this.pagesize,this.start)
         // this.reload()
         },error=>{
            console.log(error)
         })
      })
         
     },
     deleteapp(id){
        this.$confirm('此操作将永久删除该应用, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            var App = Parse.Object.extend('App')
            var app = new Parse.Query(App)
            app.get(id).then((object) => {
               object.destroy().then((response) => {
                  this.$message({
                     type: 'success',
                     message: '删除成功!'
                  });
                  this.getAppdetail(this.pagesize,this.start)
                  // this.reload()
            })
         })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
     },
     //显示，隐藏
     xianshi(id){
      var obj
      for(var i=0;i<this.appdata.length;i++){
         if(this.appdata[i].id==id){
            obj=this.appdata[i]
            this.appdata[i].isshow=true
            this.$set(this.appdata,i,obj)
         }
      }
     }
  }
};
</script>
<style scoped lang="scss">
.application {
  width: 100%;
  min-height: 850px;
  padding: 20px 20px 40px 20px;
  box-sizing: border-box;
  background: #ffffff;
  box-sizing: border-box;
  .addApplication {
    width: 100%;
    height: 50px;
  }
}
</style>
<style>
  .application .el-dialog__body{
     padding: 20px;
     border-bottom:1px solid #333333;
  }
 .application .el-dialog__header{
     border-bottom:1px solid #333333;
     
  }
 .application .el-dialog__title{
   font-size:20px;
   font-weight:900;
   }
   .application .el-dialog{
      border-radius:10px;
   }
   .application .grid-content{
      text-align:center;
   }
   .application .grid-content dl dt{
      font-weight: 700;
      float: left;
      width: 160px;
      overflow: hidden;
      clear: left;
      text-align: right;
      text-overflow: ellipsis;
      white-space: nowrap;
   }
   .application .grid-content dl dd{
      margin-left: 180px;
      margin-bottom: 1em;
      text-align:left;
   }
   .application .grid-content .editor{
      text-align:left;
      margin:13px 0;
   }
   .application .el-card__body{
      font-size:14px;
   }
   .application .appcontent .isbutton .el-button{
      position: absolute;
      top:-45px;
      right:10%;
   }
</style>
