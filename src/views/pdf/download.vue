<template>
  <div class="pdf">
    <div class="pdf-tab">
      <el-button
        class="btn-def btn-pre"
        size="small"
        type="primary"
        @click.stop="prePage">上一页</el-button>
      <el-button
        class="btn-def btn-next"
        size="small"
        @click.stop="nextPage">下一页</el-button>
      <el-button
        class="btn-def"
        size="small"
        @click.stop="clock">顺时针</el-button>
      <el-button
        class="btn-def"
        @click.stop="counterClock">逆时针</el-button>
      <el-button
        size="small"
        class="btn-def"
        @click.stop="pdfPrintAll">全部打印</el-button>
      <el-button
        class="btn-def"
        size="small"
        @click.stop="pdfPrint">部分打印</el-button>
      <el-tag type="success" >当前页码:{{ pageNum }}/{{ pageTotalNum }}</el-tag>
      <el-tag type="primary" >页面加载成功: {{ curPageNum }}</el-tag>
    </div>
    <pdf
      ref="pdf"
      :src="pdfUrl"
      :page="pageNum"
      :rotate="pageRotate"
      @password="password"
      @progress="loadedRatio = $event"
      @page-loaded="pageLoaded($event)"
      @num-pages="pageTotalNum=$event"
      @error="pdfError($event)"
      @link-clicked="page = $event"/>
  </div>
</template>
<script>
import pdf from 'vue-pdf'
export default {
  name: 'Pdf',
  components: {
    pdf
  },
  data() {
    return {
      pdfUrl: '../../static/111.pdf',
      pageNum: 1,
      pageTotalNum: 1,
      pageRotate: 0,
      // 加载进度
      loadedRatio: 0,
      curPageNum: 0
    }
  },
  mounted: function() {
  },
  methods: {
    prePage() {
      var p = this.pageNum
      p = p > 1 ? p - 1 : this.pageTotalNum
      this.pageNum = p
    },
    nextPage() {
      var p = this.pageNum
      p = p < this.pageTotalNum ? p + 1 : 1
      this.pageNum = p
    },
    clock() {
      this.pageRotate += 90
    },
    counterClock() {
      this.pageRotate -= 90
    },
    password(updatePassword, reason) {
      updatePassword(prompt('password is "123456"'))
      console.log('...reason...')
      console.log(reason)
      console.log('...reason...')
    },
    pageLoaded(e) {
      this.curPageNum = e
    },
    pdfError(error) {
      console.error(error)
    },
    pdfPrintAll() {
      this.$refs.pdf.print()
    },
    pdfPrint() {
      this.$refs.pdf.print(100, [1, 2])
    }
  }
}
</script>
