<template>
  <div class="protol">
    <div class="protolheader">
      <el-form ref="formInline" :inline="true" :model="formInline" :rules="addRules" class="demo-form-inline" size="small">
        <el-form-item label="协议名称" prop="name">
          <el-input v-model="formInline.name" placeholder="名称"/>
        </el-form-item>
        <el-form-item label="版本">
          <el-input v-model="formInline.version" placeholder="版本"/>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="formInline.desc" placeholder="版本描述"/>
        </el-form-item>
        <el-form-item >
          <el-button type="primary" @click="protol">编译</el-button>

        </el-form-item>
        <el-form-item style="display:block">
          <el-button type="primary" @click="subAce('formInline')">保存</el-button>
          <el-button type="primary" icon="el-icon-plus" @click="addAce">新增</el-button>
          <el-button type="primary" @click="chaxun">协议库</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog :visible.sync="dialogTableVisible" :close-on-click-modal="false" title="协议管理" width="50%">
      <el-table :data="gridData" style="width:100%;text-align:center">
        <el-table-column label="协议名称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.attributes.data.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="版本" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.attributes.data.version }}</span>
          </template>
        </el-table-column>
        <el-table-column label="描述" align="center" width="300">
          <template slot-scope="scope">
            <span>{{ scope.row.attributes.data.desc }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="300">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="editordata(scope.row)">编辑</el-button>
            <el-button v-if="scope.row.attributes.data.enable==false" type="success" size="mini" @click="kaisendable(scope.row)">启用</el-button>
            <el-button v-if="scope.row.attributes.data.enable==true" type="danger" size="mini" @click="jiesendable(scope.row)">禁用</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <div>
      <div><label id="plug-name"/></div>
      <pre id="editor" class="ace_editor" style="min-height:600px"><textarea class="ace_text-input"/></pre>
      <div style="color:#c2be9e;background:#272822;border-top:1px solid #dddddd;padding:5px">
        <span>{{ $t('product.controloutput') }}</span>
      </div>
      <pre
        id="editor2"
        class="ace_editor"
        style="min-height:300px;margin-bottom:0;margin-top:0"
      ><textarea class="ace_text-input"/></pre>
    </div>
  </div>
</template>
<script>
var editor
var editor2
const Base64 = require('js-base64').Base64
var isupdatetrue = ''
var setdata = 'JSUlLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLQolJSUgQGNvcHlyaWdodCAoQykgMjAxOCwgPHNodXdhPgolJSUgQGRvYwolJSUg5Y2P6K6u6Kej5p6QRGVtbwolJSUgQGVuZAolJSUgQ3JlYXRlZCA6IDA4LiDljYHkuIDmnIggMjAxOCAxNDo0OQolJSUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tCi1tb2R1bGUoc2h1d2FfZGVtb19kZWNvZGVyKS4KLWF1dGhvcigic2h1d2EiKS4KLWRlZmluZShNU0dfVFlQRSwgPDwiREVNTyI+PikuCi1wcm90b2NvbChbPDwiREVNTyI+Pl0pLgoKLWV4cG9ydChbcGFyc2VfZnJhbWUvMiwgdG9fZnJhbWUvMV0pLgoKCnBhcnNlX2ZyYW1lKEJ1ZmYsIE9wdHMpIC0+CiAgICBwYXJzZV9mcmFtZShCdWZmLCBbXSwgT3B0cykuCgoKcGFyc2VfZnJhbWUoPDw+PiwgQWNjLCBfT3B0cykgLT4KICAgIHs8PD4+LCBBY2N9OwpwYXJzZV9mcmFtZSg8PDE2IzY4LCBSZXN0L2JpbmFyeT4+ID0gQmluLCBBY2MsIF9PcHRzKSB3aGVuIGJ5dGVfc2l6ZShSZXN0KSA9PCA2IC0+CiAgICB7QmluLCBBY2N9OwpwYXJzZV9mcmFtZSg8PDE2IzY4LCBMZW46MTYvbGl0dGxlLWludGVnZXIsIExlbjoxNi9saXR0bGUtaW50ZWdlciwgMTYjNjgsIFJlc3QvYmluYXJ5Pj4gPSBCaW4sIEFjYywgT3B0cykgLT4KICAgIGNhc2UgYnl0ZV9zaXplKFJlc3QpIC0gMiA+PSBMZW4gb2YKICAgICAgICB0cnVlIC0+CiAgICAgICAgICAgIGNhc2UgUmVzdCBvZgogICAgICAgICAgICAgICAgPDxVc2VyWm9uZTpMZW4vYnl0ZXMsIENyYzo4LCAxNiMxNiwgUmVzdDEvYmluYXJ5Pj4gLT4KICAgICAgICAgICAgICAgICAgICBBY2MxID0KICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBzaHV3YV91dGlsczpnZXRfcGFyaXR5KFVzZXJab25lKSA9Oj0gQ3JjIG9mCiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnVlIC0+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRnJhbWUgPSAjewogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8PCJtc2d0eXBlIj4+ID0+ID9NU0dfVFlQRSwKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPDwiZGF0YSI+PiA9PiBVc2VyWm9uZQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQWNjICsrIFtGcmFtZV07CiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWxzZSAtPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFjYwogICAgICAgICAgICAgICAgICAgICAgICBlbmQsCiAgICAgICAgICAgICAgICAgICAgcGFyc2VfZnJhbWUoUmVzdDEsIEFjYzEsIE9wdHMpOwogICAgICAgICAgICAgICAgXyAtPgogICAgICAgICAgICAgICAgICAgIHBhcnNlX2ZyYW1lKFJlc3QsIEFjYywgT3B0cykKICAgICAgICAgICAgZW5kOwogICAgICAgIGZhbHNlIC0+CiAgICAgICAgICAgIHtCaW4sIEFjY30KICAgIGVuZDsKcGFyc2VfZnJhbWUoPDxfOjgsIFJlc3QvYmluYXJ5Pj4sIEFjYywgT3B0cykgLT4KICAgIHBhcnNlX2ZyYW1lKFJlc3QsIEFjYywgT3B0cykuCgoKJSUg57uE6KOF5oiQ5bCB5YyFLCDlj4LmlbDkuLpNYXDlvaLlvI8KdG9fZnJhbWUoI3s8PCJtc2d0eXBlIj4+IDo9ID9NU0dfVFlQRX0gPSBGcmFtZSkgLT4KICAgIFBheWxvYWQgPSB0ZXJtX3RvX2JpbmFyeShGcmFtZSksCiAgICA8PDE2IzAzLCBQYXlsb2FkL2JpbmFyeSwgMTYjMjM+Pi4='
import { Compile } from '@/api/System/index.js'
export default {
  name: 'Protrol',
  data() {
    const validCode = (rule, value, callback) => {
      const reg = /[0-9a-zA-Z]/
      if (!reg.test(value)) {
        callback(new Error('协议名称由数字和字母组合'))
      } else {
        callback()
      }
    }
    return {
      addRules: {
        name: [
          { required: true, message: '请输入协议名称', trigger: 'blur' },
          { validator: validCode, trigger: 'blur' }
        ]
      },
      dialogTableVisible: false,
      gridData: [],
      formInline: {
        name: '',
        version: '',
        desc: '',
        resource: false
      },
      objectId: '',
      warningeditror: []
    }
  },
  mounted() {
    editor = ace.edit('editor')
    editor.session.setMode('ace/mode/erlang') // 设置语言
    editor.setTheme('ace/theme/monokai')// 设置主题
    // enable autocompletion and snippets
    editor.setOptions({
      enableBasicAutocompletion: true,
      enableSnippets: true,
      enableLiveAutocompletion: true// 设置自动提示
    })
    editor2 = ace.edit('editor2')
    editor2.session.setMode('ace/mode/text') // 设置语言
    editor2.setTheme('ace/theme/monokai') // 设置主题
    editor2.setReadOnly(true)
    editor2.setOptions({
      enableBasicAutocompletion: true,
      enableSnippets: true,
      enableLiveAutocompletion: true // 设置自动提示
    })
    editor.setValue(Base64.decode(setdata))
  },
  methods: {
    protol() {
      var log = ''
      Compile(Base64.encode(editor.getValue()))
        .then(res => {
          if (res) {
            this.$message({
              type: 'success',
              message: '编译成功'
            })
            log = '编译成功' + res.mod + '\r\n'
            this.warningeditror = res.warnings
            this.warningeditror.map(items => {
              log += items + '\r\n'
            })
            isupdatetrue += log
            editor2.setValue(isupdatetrue)
          }
        })
        .catch(error => {
          this.warningeditror = error.error
          this.warningeditror.map(items => {
            log += items + '\r\n'
          })
          isupdatetrue += log
          editor2.setValue(isupdatetrue)
        })
    },
    addAce() {
      this.objectId = ''
      this.formInline.name = ''
      this.formInline.version = '',
      this.formInline.desc = '',
      this.formInline.resource = false
      editor.setValue(Base64.decode(setdata))
      // editor.setValue('')
    },
    subAce(formName) {
      var userid = Parse.User.current().id
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.objectId == '') {
            var obj = {
              name: this.formInline.name,
              version: this.formInline.version,
              code: Base64.encode(editor.getValue()),
              enable: this.formInline.resource,
              desc: this.formInline.desc
            }
            var Datas = Parse.Object.extend('Datas')
            var datas = new Datas()
            var acl = new Parse.ACL()
            //  acl.setPublicReadAccess(true)
            acl.setRoleReadAccess('root', true)
            acl.setRoleWriteAccess('root', true)
            acl.setRoleReadAccess('admin', true)
            acl.setRoleWriteAccess('admin', true)
            acl.setReadAccess(userid, true)
            acl.setWriteAccess(userid, true)
            datas.set('data', obj)
            datas.set('type', 'decoder')
            datas.set('ACL', acl)
            datas.save().then(res => {
              this.$message({
                type: 'success',
                message: '保存成功'
              })
            })
          } else {
            var obj = {
              name: this.formInline.name,
              version: this.formInline.version,
              code: Base64.encode(editor.getValue()),
              enable: this.formInline.resource,
              desc: this.formInline.desc
            }
            var Datas = Parse.Object.extend('Datas')
            var datas = new Parse.Query(Datas)
            datas.get(this.objectId).then(object => {
              object.set('data', obj)
              object.save().then(resultes => {
                this.$message({
                  type: 'success',
                  message: '修改成功'
                })
                this.objectId = ''
              })
            })
          }
        } else {
          this.$message({
            type: 'warning',
            message: '输入格式有误'
          })
        }
      })
    },
    chaxun() {
      var Datas = Parse.Object.extend('Datas')
      var datas = new Parse.Query(Datas)
      datas.equalTo('type', 'decoder')
      datas.ascending('-createdAt')
      datas.find().then(resultes => {
        if (resultes) {
          this.dialogTableVisible = true
          this.gridData = resultes
        }
      })
    },
    jiesendable(row) {
      this.objectId = row.id
      var obj = {
        name: row.attributes.data.name,
        version: row.attributes.data.version,
        code: row.attributes.data.code,
        desc: row.attributes.data.desc,
        enable: false
      }
      var Datas = Parse.Object.extend('Datas')
      var datas = new Parse.Query(Datas)
      datas.get(this.objectId).then(object => {
        object.set('data', obj)
        object.save().then(resultes => {
          this.$message({
            type: 'success',
            message: '禁用成功'
          })
          var Datas1 = Parse.Object.extend('Datas')
          var datas1 = new Parse.Query(Datas1)
          datas1.equalTo('type', 'decoder')
          datas1.ascending('-createdAt')
          datas1.find().then(resultes => {
            if (resultes) {
              this.gridData = resultes
            }
          })
        })
      })
    },
    kaisendable(row) {
      this.objectId = row.id
      var obj = {
        name: row.attributes.data.name,
        version: row.attributes.data.version,
        code: row.attributes.data.code,
        desc: row.attributes.data.desc,
        enable: true
      }
      var Datas = Parse.Object.extend('Datas')
      var datas = new Parse.Query(Datas)
      datas.get(this.objectId).then(object => {
        object.set('data', obj)
        object.save().then(resultes => {
          this.$message({
            type: 'success',
            message: '启用成功'
          })
          var Datas1 = Parse.Object.extend('Datas')
          var datas1 = new Parse.Query(Datas1)
          datas1.equalTo('type', 'decoder')
          datas1.ascending('-createdAt')
          datas1.find().then(resultes => {
            if (resultes) {
              this.gridData = resultes
            }
          })
        })
      })
    },
    editordata(row) {
      console.log(row)
      this.objectId = row.id
      this.formInline.name = row.attributes.data.name
      this.formInline.version = row.attributes.data.version
      this.formInline.desc = row.attributes.data.desc
      this.formInline.resource = row.attributes.data.enable
      editor.setValue(Base64.decode(row.attributes.data.code))
      this.dialogTableVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.protol{
  width: 100%;
  min-height: 875px;
  padding: 20px;
  box-sizing: border-box;
  background: #ffffff;
  /deep/ .ace_editor{
     margin:0;
  }
}
</style>
