(this.webpackJsonp=this.webpackJsonp||[]).push([["chunk-1486"],{49:function(t,n){},50:function(t,n){},51:function(t,n){},52:function(t,n){},OPwr:function(t,n,o){"use strict";o.r(n);var a={name:"Pdf",components:{pdf:o("hY44").a},data:function(){return{pdfUrl:"../../static/111.pdf",pageNum:1,pageTotalNum:1,pageRotate:0,loadedRatio:0,curPageNum:0}},mounted:function(){},methods:{prePage:function(){var t=this.pageNum;t=t>1?t-1:this.pageTotalNum,this.pageNum=t},nextPage:function(){var t=this.pageNum;t=t<this.pageTotalNum?t+1:1,this.pageNum=t},clock:function(){this.pageRotate+=90},counterClock:function(){this.pageRotate-=90},password:function(t,n){t(prompt('password is "123456"')),console.log("...reason..."),console.log(n),console.log("...reason...")},pageLoaded:function(t){this.curPageNum=t},pdfError:function(t){console.error(t)},pdfPrintAll:function(){this.$refs.pdf.print()},pdfPrint:function(){this.$refs.pdf.print(100,[1,2])}}},e=o("KHd+"),s=Object(e.a)(a,function(){var t=this,n=t.$createElement,o=t._self._c||n;return o("div",{staticClass:"pdf"},[o("div",{staticClass:"pdf-tab"},[o("el-button",{staticClass:"btn-def btn-pre",attrs:{size:"small",type:"primary"},on:{click:function(n){return n.stopPropagation(),t.prePage(n)}}},[t._v("上一页")]),t._v(" "),o("el-button",{staticClass:"btn-def btn-next",attrs:{size:"small"},on:{click:function(n){return n.stopPropagation(),t.nextPage(n)}}},[t._v("下一页")]),t._v(" "),o("el-button",{staticClass:"btn-def",attrs:{size:"small"},on:{click:function(n){return n.stopPropagation(),t.clock(n)}}},[t._v("顺时针")]),t._v(" "),o("el-button",{staticClass:"btn-def",on:{click:function(n){return n.stopPropagation(),t.counterClock(n)}}},[t._v("逆时针")]),t._v(" "),o("el-button",{staticClass:"btn-def",attrs:{size:"small"},on:{click:function(n){return n.stopPropagation(),t.pdfPrintAll(n)}}},[t._v("全部打印")]),t._v(" "),o("el-button",{staticClass:"btn-def",attrs:{size:"small"},on:{click:function(n){return n.stopPropagation(),t.pdfPrint(n)}}},[t._v("部分打印")]),t._v(" "),o("el-tag",{attrs:{type:"success"}},[t._v("当前页码:"+t._s(t.pageNum)+"/"+t._s(t.pageTotalNum))]),t._v(" "),o("el-tag",{attrs:{type:"primary"}},[t._v("页面加载成功: "+t._s(t.curPageNum))])],1),t._v(" "),o("pdf",{ref:"pdf",attrs:{src:t.pdfUrl,page:t.pageNum,rotate:t.pageRotate},on:{password:t.password,progress:function(n){t.loadedRatio=n},"page-loaded":function(n){t.pageLoaded(n)},"num-pages":function(n){t.pageTotalNum=n},error:function(n){t.pdfError(n)},"link-clicked":function(n){t.page=n}}})],1)},[],!1,null,null,null);s.options.__file="download.vue";n.default=s.exports}}]);