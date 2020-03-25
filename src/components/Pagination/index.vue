<template>
  <div class="mod-paging-query fn-clear">
    <el-pagination
      small
      class="fn-right"
      layout="total, sizes, prev, pager, next"
      background
      :pager-count="7"
      :total="pager[props.total]"
      :current-page.sync="pager[props.page]"
      :page-size="pager[props.rows]"
      :page-sizes="pager[props.pages]"
      @size-change="onChangeSize"
      @current-change="onChangePage">
    </el-pagination>
    <div v-if="pageShow"> 
      <el-tooltip content="刷新" placement="top">
        <span class="iconfont iconicon-refresh"  @click="setup"></span>
      </el-tooltip>
      <el-tooltip content="导出当前表格" placement="top">
        <span class="iconfont iconxls der"  @click="now_derive"></span>
      </el-tooltip>
      <el-tooltip content="分页导出表格" placement="top">
        <span class="iconfont iconfile-xls ders" @click="show_table4"></span>
      </el-tooltip>
    </div>
    
    <!--分页导出-->
    <el-dialog title="提示" :visible.sync="centerDialogVisible" width="15%" center>
      <div>
        <p>导出页从</p>
        <el-input v-model="page_start" :min="1"/>
        <p>到</p>
        <el-input v-model="page_end" :min="2"/>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="page_derive">导出</el-button>
        <el-button type="primary" @click="centerDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
    {{isShow}}
  </div>
</template>

<script>
import FileSaver from "file-saver";
import XLSX from "xlsx";
import "@/styles/iconfont/iconfont.css"
import { parseTime } from '@/utils';
import { eventBus } from '@/api/eventBus';
export default {
  name: 'PagingQuery',
  props: {
    pager: {
      type: Object,
      required: true,
    },
    refresh: {
      type: Boolean,
    },
    // 是否显示导出按钮
    pageShow:{
      type:Boolean,
      default:true
    },
    props: {
      type: Object,
      required: false,
      default: () => ({
        page: 'page',   // 第几页
        rows: 'rows',   // 显示条数
        total: 'count', // 总记录条数
        name: "name" ,// 导出表格名称
        pages: "pages", //页数分类
        where: [],//导出条件
      }),
      isShow:{
        type:Boolean,
        default:true
      },
    },
  },
  data(){
    return {
      centerDialogVisible:false,
      page_start:1,
      page_end:2,
      json:[],
      obj:[],
      table5:[],
      name:"",
    }
  },
  // 设置绑定参数
  model: {
    prop: 'pager',
    event: 'setPager',
  },
  computed: {
    total() {
      // console.log(this.pager)
      return this.pager[this.props.count]||0;
    },
    // 检测获取到的数据是否为空
    isEmptyList() {
      return Math.ceil(this.pager[this.props.total] / this.pager[this.props.rows]) < this.pager[this.props.page];
    },
    test(){
      let i=1;
      return i++;
    }
  },
  created(){
    eventBus.$on('drive',data=>{
      this.json = data.json;
      this.obj = data.obj;
      if (this.json!=[] && this.obj!=[]){
      }
      this.derive(this.json,this.obj);
    })
  },
  watch: {
    total() {
      // 存在记录但未获取到数据时, 重新请求
      if (this.pager[this.props.page] > 1 && this.isEmptyList) {
        this.$emit('setPager', Object.assign(this.pager, {
          [this.props.page]: this.pager[this.props.page] - 1,
        }));
        // this.$emit('query');
      }
    },
    test:{
      handler(newVal) {
          this.$nextTick(function(){
            if(this.table6==true){
              this.derive(this.json,this.obj,this.name);
              this.centerDialogVisible=false;
            }
        })
      },
      deep:true
    }
  },
  // mounted(){
  //   console.log(this.pager.count)
  // },
  methods: {
    /**
     * json 请求获取的json字符串 
     * obj 对应的标题头,key键,属性名
     */
    derive(json,obj){
      let table = [
        []
      ];
      // 获取头部
      let s=0;
      for (let i in obj){
        if (typeof(obj[i])=="function"){
          let headers=obj[i]("header");
          for (let j in headers){
            table[0][s]=headers[j];
            s++;
          }
        }else{
          table[0][s]=obj[i];
          s++;
        }
      }
      s=null;
      // 拼接json
      for (let i of json){
        var line = []
        for (let j in obj){
          var col = i[j] 
          if(typeof(obj[j])=="function"){
            var Fun = obj[j]
            let value=Fun(col,line);
          }else{
            line.push(col);
          }
        }
        console.log(line);
        table.push(line);
      }
      // console.log(table);
      // return;
      const ws = XLSX.utils.json_to_sheet(table,{skipHeader:true,cellDates:true});
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, `${this.pager.name}.xlsx`);
    },
    // 每页条数
    onChangeSize(rows) {
      console.log(this.pager.count)
      console.log(this.pager.page)
      const temp = {
        [this.props.rows]: rows,
        // 当显示条数小于或等于总条数时，重置页数
        [this.props.page]: rows <= this.total ? 1 : this.pager[this.props.page],
      };
      this.$emit('setPagerCount', Object.assign(this.pager, temp));
      this.$emit('setPager', Object.assign(this.pager, temp));
      this.pager[this.props.total] = this.pager.count;
    },
    // 翻页
    onChangePage(page) {
      this.$emit('setPager', Object.assign(this.pager, { [this.props.page]: page }));
    },
    setup(){
      this.$emit('query',Object.assign(this.pager));
    },
    now_derive(){
      this.$emit("now_drive",Object.assign(this.pager));
    },
    show_table4(){
      this.centerDialogVisible=true;
    },
    page_derive(){
      this.centerDialogVisible=false;
      // 查询到所有需要的数据
      let start=this.page_start-1;
      let end=this.page_end-1;
      this.$emit('alldrive',{start,end})
    },
  },
};
</script>
<style>
.fn-clear{
  display: flex;
  background:#dbf0ff;
  line-height: 30px;
}
.fn-clear .iconfont{
  line-height: 26px;
  margin:0 0 0 20px;
  font-size:16px;
  cursor: pointer;
}
.fn-clear span.iconicon-refresh {
  color:#034a8e;
}
.fn-clear span.der {
  color:#207245;
}
.fn-clear span.ders {
  color:#84BF56;
}
/* 切换页数图标 */
.btn-prev:before {
    content: "上一页";
}
.btn-next:before {
    content: "下一页";
}
.btn-prev i.el-icon,.btn-next i.el-icon {
  display:none !important;
}
</style>
