(this.webpackJsonp=this.webpackJsonp||[]).push([["chunk-6e86"],{EicX:function(t,e,a){"use strict";a.r(e);var n=a("Yh9x"),s=(a("p46w"),[]),i=[],l={data:function(){return{tableData:[],total:0,start:1,length:10,node:null,dialogVisible:!1,start1:1,length1:10,total1:0,tableData1:[],app:"",version:"",searchvalue:"",search:""}},computed:{},mounted:function(){this.getInformation()},methods:{handleSizeChange:function(t){this.start=1,this.length=t},handleCurrentChange:function(t){this.start=t},handleSizeChange1:function(t){this.start1=1,this.length1=t},handleCurrentChange1:function(t){this.start1=t},getInformation:function(){var t=this;Object(n.c)(this.node,this.start,this.length).then(function(e){e&&(t.tableData=e.apps,s=e.apps,t.total=e.recordsTotal)}).catch(function(e){t.$message({type:"error",message:e.error})})},handleClose:function(){this.dialogVisible=!1},changevalue:function(){var t=this;""==this.search&&(this.tableData=s),this.tableData=this.tableData.filter(function(e){return!t.search||e.app.toLowerCase().includes(t.search.toLowerCase())})},changedialog:function(){var t=this;""==this.searchvalue&&(this.tableData1=i),this.tableData1=tableData1.filter(function(e){return!t.searchvalue||e.path.toLowerCase().includes(searchvalue.toLowerCase())})},checkupdate:function(t){var e=this;this.tableData1=[],this.searchvalue="",this.dialogVisible=!0,this.app=t,this.total1=0,Object(n.d)(t).then(function(t){t&&(t.map(function(t){0==t.is_changed?t.is_changed="false":t.is_changed="true"}),e.tableData1=t,i=t,e.total1=t.length)})},checkupdateall:function(){var t=this;this.searchvalue="",this.dialogVisible=!0,this.tableData1=[],this.total1=0,this.app="",Object(n.e)("changed").then(function(e){e&&(e.map(function(t){0==t.is_changed?t.is_changed="false":t.is_changed="true"}),t.tableData1=e,i=e,t.total1=e.length)})},startup:function(t){var e=this;sessionStorage.getItem("username")?Object(n.f)(t).then(function(t){t&&(e.$message({message:"启动成功",type:"success"}),e.getInformation())}).catch(function(t){console.log(t)}):this.$message({message:"您还未登录",type:"warning"})},stopup:function(t){var e=this;sessionStorage.getItem("username")?Object(n.g)(t).then(function(t){t&&(e.$message({message:"停止成功",type:"success"}),e.getInformation())}).catch(function(t){console.log(t)}):this.$message({message:"您还未登录",type:"warning"})},reupload:function(){var t=this;""==this.app?Object(n.b)("all").then(function(e){e&&(0==e.length?t.$message({message:"当前无更新",type:"warning"}):t.$message({message:"已更新模块"+e,type:"success"}))}):Object(n.b)(this.app).then(function(e){e&&(0==e.length?t.$message({message:"当前无更新",type:"warning"}):t.$message({message:"已更新模块"+e,type:"success"}),t.app)})}}},o=(a("pUAd"),a("L3pk"),a("KHd+")),c=Object(o.a)(l,function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"appmarage"},[a("div",{staticClass:"header"},[a("el-button",{attrs:{type:"primary",size:"small"},on:{click:t.checkupdateall}},[t._v("\n            "+t._s(t.$t("plugins.checkupdate"))+"\n        ")])],1),t._v(" "),a("div",{staticClass:"block",staticStyle:{"margin-top":"10px"}},[a("el-table",{staticStyle:{width:"100%","text-align":"center"},attrs:{data:t.tableData.slice((t.start-1)*t.length,t.start*t.length)}},[a("el-table-column",{attrs:{label:"App",align:"center"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",{style:{color:1==e.row.active?"green":"red"}},[t._v(t._s(e.row.app))])]}}])}),t._v(" "),a("el-table-column",{attrs:{prop:"version",label:t.$t("plugins.version"),align:"center",sortable:""}}),t._v(" "),a("el-table-column",{attrs:{prop:"desc",label:t.$t("developer.describe"),align:"center",sortable:""}}),t._v(" "),a("el-table-column",{attrs:{label:t.$t("developer.operation"),align:"right"},scopedSlots:t._u([{key:"header",fn:function(e){return[a("el-input",{attrs:{size:"mini",placeholder:t.$t("plugins.enterappsearch")},on:{change:t.changevalue},model:{value:t.search,callback:function(e){t.search=e},expression:"search"}})]}},{key:"default",fn:function(e){return[0==e.row.active?a("el-button",{attrs:{type:"info",size:"small",plain:""},on:{click:function(a){t.startup(e.row.app)}}},[a("div",{staticStyle:{width:"10px",height:"10px","border-radius":"50%",display:"inline-block",background:"#00cc33","margin-right":"10px"}}),t._v(t._s(t.$t("plugins.start")))]):t._e(),t._v(" "),1==e.row.active?a("el-button",{attrs:{type:"info",size:"small",plain:""},on:{click:function(a){t.stopup(e.row.app)}}},[a("div",{staticStyle:{width:"10px",height:"10px","border-radius":"50%",display:"inline-block",background:"#a94442","margin-right":"10px"}}),t._v(t._s(t.$t("plugins.stop")))]):t._e(),t._v(" "),a("el-button",{attrs:{type:"info",size:"small",plain:""},on:{click:function(a){t.checkupdate(e.row.app)}}},[t._v(t._s(t.$t("plugins.checkupdate")))])]}}])})],1)],1),t._v(" "),a("div",{staticClass:"block"},[a("el-pagination",{staticStyle:{"margin-top":"30px"},attrs:{background:"","page-sizes":[10,25,50,100],"page-size":t.length,layout:"total, sizes, prev, pager, next, jumper",total:t.total},on:{"size-change":t.handleSizeChange,"current-change":t.handleCurrentChange}})],1),t._v(" "),a("el-dialog",{attrs:{title:t.$t("plugins.modulelist"),visible:t.dialogVisible,width:"40%","before-close":t.handleClose},on:{"update:visible":function(e){t.dialogVisible=e}}},[a("div",[a("el-table",{staticStyle:{width:"100%","text-align":"center","margin-top":"20px"},attrs:{data:t.tableData1.slice((t.start1-1)*t.length1,t.start1*t.length1),height:"300"}},[a("el-table-column",{attrs:{prop:"path",label:t.$t("plugins.modulename"),sortable:"",align:"center"}}),t._v(" "),a("el-table-column",{attrs:{prop:"is_changed",label:t.$t("plugins.ischange"),sortable:"",align:"center"}})],1),t._v(" "),a("div",{staticClass:"block"},[a("el-pagination",{staticStyle:{"margin-top":"30px"},attrs:{background:"","page-sizes":[10,25,50,100],"page-size":t.length1,layout:"total, sizes, prev, pager, next, jumper",total:t.total1},on:{"size-change":t.handleSizeChange1,"current-change":t.handleCurrentChange1}})],1)],1),t._v(" "),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{staticStyle:{float:"left"},on:{click:function(e){t.dialogVisible=!1}}},[t._v(t._s(t.$t("developer.cancel")))]),t._v(" "),a("el-button",{staticStyle:{float:"right"},attrs:{type:"primary"},on:{click:t.reupload}},[t._v(t._s(t.$t("developer.determine")))])],1)])],1)},[],!1,null,"12917fb6",null);c.options.__file="appmarage.vue";e.default=c.exports},L3pk:function(t,e,a){"use strict";var n=a("cA5M");a.n(n).a},cA5M:function(t,e,a){},pUAd:function(t,e,a){"use strict";var n=a("xzS3");a.n(n).a},xzS3:function(t,e,a){}}]);