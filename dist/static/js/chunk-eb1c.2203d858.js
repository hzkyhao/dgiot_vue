(this.webpackJsonp=this.webpackJsonp||[]).push([["chunk-eb1c"],{IFvI:function(e,t,n){"use strict";var a=n("lnSS");n.n(a).a},MPjy:function(e,t,n){"use strict";n.d(t,"a",function(){return r});var a=n("X3IP");function r(e){"209"==e.code?(Object(a.Message)({message:"您权限过期,请重新登录",type:"error",duration:2e3}),sessionStorage.removeItem("roles"),sessionStorage.removeItem("username"),sessionStorage.removeItem("token"),sessionStorage.removeItem("list"),location.href="/#/login"):119==e.code?Object(a.Message)({message:"没有操作权限",type:"warning",duration:2e3}):Object(a.Message)({message:e.message,type:"error"})}},"c0Z+":function(e,t,n){"use strict";var a=n("qFuS");n.n(a).a},lnSS:function(e,t,n){},lzw9:function(e,t,n){"use strict";n.d(t,"c",function(){return r}),n.d(t,"d",function(){return i}),n.d(t,"a",function(){return l}),n.d(t,"b",function(){return o});var a=n("t3Un");function r(e,t){return Object(a.a)({url:"/pump/templet?dataType=pump_report&start="+e+"&len="+t,method:"GET",data:{}})}function i(e){return Object(a.a)({url:"/pump/templet/"+e,method:"GET",data:{}})}function l(e,t){return Object(a.a)({url:"/pump/templet",method:"POST",data:{data:e,id:t,dataType:"pump_report"}})}function o(e){return Object(a.a)({url:"/pump/report/config?reportId="+e,method:"GET",data:{}})}},qFuS:function(e,t,n){},zs8C:function(e,t,n){"use strict";n.r(t);var a,r,i,l=n("4d7F"),o=n.n(l),s=n("gDS+"),c=n.n(s),u=n("72z0"),d=n("v0iw"),m=n.n(d),p=n("lzw9"),f=n("MPjy"),b=(n("fe1z"),{data:function(){var e=this;return{pumpusetype:["计量泵","给水泵","排水泵","疏水泵","喷灌泵","增压泵","排污泵"],pumpmodel:["离心泵","潜水泵","混流泵","螺杆泵","轴流泵","旋涡泵","电动泵","蒸汽泵","齿轮泵","罗茨泵","滑片泵","喷射泵","升液泵","电磁泵"],formInline:{user:"",region:"",name:"",department:"",standard:"",factory:"",starttime:"",endtime:""},regionoptions:u.regionData,pickerOptionsStart:{disabledDate:function(t){var n=e.formInline.endtime;return n&&t.getTime()>new Date(n).getTime()||t.getTime()<Date.now()-864e5}},pickerOptionsEnd:{disabledDate:function(e){return e.getTime()<Date.now()-864e5}},pickerOptionsEnd1:{disabledDate:function(t){var n=e.formInline.starttime;return n?t.getTime()<new Date(n).getTime()-864e5:t.getTime()<Date.now()-864e5}},taskData:[],pagesize:10,start:0,total:0,standard:{},form:{endtime:"",inspection_number:"",client:"",region:"",produt:"",model:"",standard:[],testbed:[],bedname:"",addr:[],testuser:"",entrust:"",entrustphone:"",laboratory:"",checktype:"性能检测",usetype:""},options:[{value:"浙江利欧",label:"浙江利欧"},{value:"南方泵业",label:"南方泵业"},{value:"新界泵业",label:"新界泵业"},{value:"丰球",label:"丰球"}],formLabelWidth:"120px",taskdialog:!1,formrule:{inspection_number:[{required:!0,message:"请输入检验编号",trigger:"blur"}],client:[{required:!0,message:"请选择检测单位",trigger:"change"}],region:[{required:!0,message:"请选择检验标准",trigger:"change"}],produt:[{required:!0,message:"请输入产品名称",trigger:"blur"}],model:[{required:!0,message:"请选择水泵型号",trigger:"change"}],bedname:[{required:!0,message:"请选择测试台体",trigger:"change"}],entrust:[{required:!0,message:"请输入委托方",trigger:"blur"}],usetype:[{required:!0,message:"请选择水泵用途",trigger:"change"}],entrustphone:[{required:!0,message:"请输入委托人联系方式",trigger:"blur"},{validator:function(e,t,n){/^1[3-9]\d{9}$/.test(t)?n():n(new Error("手机号码格式不正确！"))},trigger:"blur"}],starttime:[{type:"date",required:!0,message:"请选择开始时间",trigger:"change"}],endtime:[{type:"date",required:!0,message:"请选择结束时间",trigger:"change"}]},spacetaskData:[],pagesize1:10,start1:0,total1:0,dialogtext:"新增",formInline1:{user:"",region:"",name:"",department:"",standard:"",factory:"",starttime:"",endtime:""},pumpclientid:"",departmentname:"",laboratoryname:"",departmentpump:[],departmentlaboratory:[],testbedlist:[],testbedname:""}},created:function(){},mounted:function(){this.getTasktable(),this.getTasktable1(),this.getDepartmentPump(),this.getStandard()},methods:{getDepartmentLaboratory:function(e,t,n){var a=this,r=m.a.Object.extend("Department"),i=new m.a.Query(r);i.equalTo("org_type","实验室"),i.equalTo("ParentId",e),i.find().then(function(e){a.departmentlaboratory=e,t&&a.laboratorySelect(t,n)},function(e){Object(f.a)(e)})},getStandard:function(){var e=this,t=m.a.Object.extend("Report");new m.a.Query(t).find().then(function(t){e.form.standard=t},function(e){Object(f.a)(e)})},getDepartmentPump:function(){var e=this,t=m.a.Object.extend("Department"),n=new m.a.Query(t);n.equalTo("org_type","泵单位"),n.find().then(function(t){e.departmentpump=t},function(e){Object(f.a)(e)})},laboratorySelect:function(e,t){var n=this;this.departmentlaboratory.map(function(t){t.id==e&&(n.laboratoryname=t.attributes.name)});var a=m.a.Object.extend("Testbed"),r=new m.a.Query(a);r.equalTo("department",e),r.find().then(function(e){n.testbedlist=e,t&&n.testBedSelect(t)},function(e){Object(f.a)(e)})},pumpDepartmentSelect:function(e,t,n){var a=this;this.departmentpump.map(function(t){t.id==e&&(a.departmentname=t.attributes.name)}),this.getDepartmentLaboratory(e,t,n)},timestampToTime:function(e){var t=new Date(1e3*e);return t.getFullYear()+"-"+((t.getMonth()+1<10?"0"+(t.getMonth()+1):t.getMonth()+1)+"-")+((t.getDate()+1<=10?"0"+t.getDate():t.getDate())+" ")+((t.getHours()+1<=10?"0"+t.getHours():t.getHours())+":")+((t.getMinutes()+1<=10?"0"+t.getMinutes():t.getMinutes())+":")+(t.getSeconds()+1<=10?"0"+t.getSeconds():t.getSeconds())},onSubmit:function(){},resetForm:function(){this.formInline={user:"",region:"",name:"",department:"",standard:"",factory:"",starttime:"",endtime:""}},getTasktable:function(e){var t=this;0==e&&(this.start=0);var n=Math.floor((new Date).getTime()/1e3),a=m.a.Object.extend("PumpClient"),r=new m.a.Query(a);r.descending("createdAt"),r.limit(this.pagesize),r.skip(this.start),""!=this.formInline.factory&&r.matches("factory",this.formInline.factory),""!=this.formInline.name&&r.matches("pump_id",this.formInline.name),""!=this.formInline.standard&&r.equalTo("standard",this.formInline.standard),""!=this.formInline.department&&r.equalTo("detection_unit",this.formInline.department),r.greaterThan("test_time",n),r.count().then(function(e){t.total=e,r.find().then(function(e){t.taskData=e})},function(e){Object(f.a)(e)})},handleSizeChange:function(e){this.pagesize=e,console.log(111),this.getTasktable()},handleCurrentChange:function(e){this.start=Number(e-1)*Number(this.pagesize),this.getTasktable()},resetForm1:function(){this.formInline1={user:"",region:"",name:"",department:"",standard:"",factory:"",starttime:"",endtime:""}},getTasktable1:function(e){var t=this;0==e&&(this.start=0);var n=Math.floor((new Date).getTime()/1e3),a=m.a.Object.extend("PumpClient"),r=new m.a.Query(a);r.descending("createdAt"),r.limit(this.pagesize1),r.skip(this.start1),""!=this.formInline1.factory&&r.matches("factory",this.formInline1.factory),""!=this.formInline1.name&&r.matches("pump_id",this.formInline1.name),""!=this.formInline1.standard&&r.equalTo("standard",this.formInline1.standard),""!=this.formInline1.department&&r.equalTo("detection_unit",this.formInline1.department),r.lessThan("test_time",n),r.count().then(function(e){t.total1=e,r.find().then(function(e){t.spacetaskData=e})},function(e){Object(f.a)(e)})},addtask:function(){var e=this;this.taskdialog=!0,this.$nextTick(function(){e.form.usetype="",e.form.checktype="",e.form.addr=[],e.form.entrustphone="",e.form.entrust="",e.form.inspection_number="",e.form.model="",e.form.endtime="",e.form.client="",e.form.laboratory="",e.form.region=""})},handleSizeChange1:function(e){this.pagesize1=e,this.getTasktable1()},handleCurrentChange1:function(e){this.start1=Number(e-1)*Number(this.pagesize1),this.getTasktable1()},taskDetail:function(e,t){this.$router.push({path:"/inspection/reportdetail",query:{id:e,testbedid:t}})},standardName:function(e){console.log(e);var t;t=this.form.standard.find(function(t){return c()(t.data)==e}),this.standard=t.data.inspection_standard},changeStandard:function(e){var t=this;this.form.standard.map(function(n){n.id==e&&(t.standard=e)})},handleModChange:function(e){a=u.CodeToText[e[0]],r=u.CodeToText[e[1]],i=u.CodeToText[e[2]]},testBedSelect:function(e){var t=this;this.testbedlist.map(function(n){n.id==e&&(t.testbedname=n.attributes.name)})},addBedtask:function(e){var t=this;this.$refs[e].validate(function(e){if(e){var n=new(m.a.Object.extend("PumpClient"));""!=t.pumpclientid?(n.id=t.pumpclientid,t.dialogtext="编辑"):t.dialogtext="新增";var l=new(m.a.Object.extend("Department"));l.id=t.form.client,n.set("department",l);var s=new(m.a.Object.extend("Department"));s.id=t.form.laboratory,n.set("laboratory",s);var c=new(m.a.Object.extend("Testbed"));c.id=t.form.bedname,n.set("test_bed",c),n.set("lab",t.laboratoryname),n.set("detection_unit",t.departmentname),n.set("standard",t.standard),n.set("pump_id",t.form.inspection_number),n.set("province",a),n.set("city",r),n.set("datats",{}),n.set("district",i),n.set("test_time",t.form.endtime/1e3),n.set("internal_num",t.testbedname),n.set("addr",t.form.addr),n.set("factory",t.form.entrust),n.set("entrust_phone",t.form.entrustphone),n.set("pump_model",t.form.model),n.set("pump_type",t.form.checktype),n.set("pump_use",t.form.usetype),n.save().then(function(e){if(t.$message({message:t.dialogtext+"成功",type:"success"}),""==t.pumpclientid){var n=new(m.a.Object.extend("Report"));n.id=t.standard,n.relation("report").query().find().then(function(n){var a=m.a.User.current().id,r=[];n.map(function(i){r.push(new o.a(function(n,r){var l=new(m.a.Object.extend("Devices")),o=new m.a.ACL;return o.setReadAccess(a,!0),o.setWriteAccess(a,!0),o.setRoleReadAccess("pump",!0),o.setRoleWriteAccess("pump",!0),l.set("ACL",o),l.set("basedata",i.attributes.config),l.set("brand",e.id),l.set("devaddr",t.form.bedname),l.set("name",t.standard),l.save().then(function(e){n(e)},function(e){r(e.message)})})),o.a.all(r).then(function(e){e.length==n.length&&(t.$message({message:"添加成功",type:"success"}),t.pumpclientid="",t.taskdialog=!1,t.getTasktable(t.pagesize,t.start))}).catch(function(e){t.$message({message:e,type:"error"})})})})}else t.pumpclientid="",t.taskdialog=!1,t.getTasktable(t.pagesize,t.start)},function(e){Object(f.a)(e)})}})},editorClient:function(e){var t=this;this.$nextTick(function(){t.form.usetype="",t.form.checktype="",t.form.addr=[],t.form.entrustphone="",t.form.entrust="",t.form.inspection_number="",t.form.model="",t.form.endtime="",t.form.client="",t.form.laboratory="",t.form.region="",t.form.bedname=""}),this.pumpclientid=e;var n=m.a.Object.extend("PumpClient");new m.a.Query(n).get(e).then(function(e){t.taskdialog=!0,t.form.region=e.attributes.standard,t.standard=e.attributes.standard,t.form.usetype=e.attributes.pump_use,t.form.checktype=e.attributes.pump_type,t.form.addr=e.attributes.addr,t.form.entrustphone=e.attributes.entrust_phone,t.form.entrust=e.attributes.factory,t.form.inspection_number=e.attributes.pump_id,t.form.model=e.attributes.pump_model,t.form.endtime=1e3*e.attributes.test_time,t.form.client=e.attributes.department.id,t.form.laboratory=e.attributes.laboratory.id,t.pumpDepartmentSelect(e.attributes.department.id,e.attributes.laboratory.id,e.attributes.test_bed.id),t.form.bedname=e.attributes.test_bed.id,t.handleModChange(e.attributes.addr)},function(e){Object(f.a)(e)})},derive:function(e){Object(p.b)(e).then(function(e){})},enddata:function(){this.formInline.endtime<=this.formInline.starttime&&(this.$message.warning("任务结束时间要小于开始时间"),this.formInline.endtime=""),this.formInline.endtime<Date.now()-2e3&&(this.$message.warning("任务结束时间要大于当前时间"),this.formInline.endtime="")},testdata:function(){this.formInline.endtime<=this.formInline.starttime&&""!=this.formInline.endtime&&null!=this.formInline.endtime&&(this.$message.warning("任务开始时间要小于结束时间"),this.formInline.starttime=""),this.formInline.starttime<Date.now()-2e3&&(this.$message.warning("任务开始时间要大于当前时间"),this.formInline.starttime="")},deleteClient:function(e){var t=this,n=new(m.a.Object.extend("PumpClient"));n.id=e,n.destroy().then(function(n){if(n){var a=[],r=m.a.Object.extend("Devices"),i=new m.a.Query(r);i.equalTo("brand",e),i.find().then(function(e){e.map(function(n){a.push(new o.a(function(e,t){var a=new(m.a.Object.extend("Devices"));return a.id=n.id,a.destroy().then(function(t){t&&e(t)},function(e){t(e)})})),o.a.all(a).then(function(n){n.length==e.length&&(t.$message.success("删除成功"),t.getTasktable())}).catch(function(e){t.$message({message:e,type:"error"})})})})}})},clientView:function(e){var t=m.a.Object.extend("Devices"),n=new m.a.Query(t);n.equalTo("brand",e.id),n.ascending("basedata.index"),n.find().then(function(t){window.open(window.location.origin+"/spa/#/fullscreen?standard="+e.attributes.standard+"&testbed="+e.id+"&devicesid="+t[0].id,"_blank")})}}}),g=(n("IFvI"),n("c0Z+"),n("KHd+")),h=Object(g.a)(b,function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"inspection"},[n("el-tabs",{attrs:{type:"border-card"}},[n("el-tab-pane",{attrs:{label:"进行中("+e.total+")"}},[n("el-form",{staticClass:"demo-form-inline",attrs:{inline:!0,model:e.formInline,size:"small"}},[n("div",{staticStyle:{display:"flex","justify-content":"space-between"}},[n("el-form-item",{attrs:{label:"检验单位"}},[n("el-select",{attrs:{placeholder:"检验单位"},model:{value:e.formInline.department,callback:function(t){e.$set(e.formInline,"department",t)},expression:"formInline.department"}},e._l(e.departmentpump,function(e,t){return n("el-option",{key:t,attrs:{value:e.attributes.name,label:e.attributes.name}})}))],1),e._v(" "),n("el-form-item",{attrs:{label:"检验标准"}},[n("el-select",{attrs:{placeholder:"检验标准"},model:{value:e.formInline.standard,callback:function(t){e.$set(e.formInline,"standard",t)},expression:"formInline.standard"}},e._l(e.form.standard,function(e,t){return n("el-option",{key:t,attrs:{label:e.attributes.name,value:e.id}})}))],1),e._v(" "),n("el-form-item",{attrs:{label:"委托单位"}},[n("el-input",{attrs:{placeholder:"请输入委托单位"},model:{value:e.formInline.factory,callback:function(t){e.$set(e.formInline,"factory",t)},expression:"formInline.factory"}})],1),e._v(" "),n("el-form-item",{attrs:{label:"检测人员"}},[n("el-select",{attrs:{placeholder:"检测人员"},model:{value:e.formInline.region,callback:function(t){e.$set(e.formInline,"region",t)},expression:"formInline.region"}},[n("el-option",{attrs:{label:"区域一",value:"shanghai"}}),e._v(" "),n("el-option",{attrs:{label:"区域二",value:"beijing"}})],1)],1),e._v(" "),n("el-form-item",{attrs:{label:"检测任务编号"}},[n("el-input",{attrs:{placeholder:"检测任务编号"},model:{value:e.formInline.name,callback:function(t){e.$set(e.formInline,"name",t)},expression:"formInline.name"}})],1)],1),e._v(" "),n("div",[n("el-form-item",{attrs:{label:"检测时间"}},[n("el-col",{attrs:{span:11}},[n("el-form-item",[n("el-date-picker",{attrs:{type:"datetime",placeholder:"选择开始时间","picker-options":e.pickerOptionsStart},on:{change:e.testdata},model:{value:e.formInline.starttime,callback:function(t){e.$set(e.formInline,"starttime",t)},expression:"formInline.starttime"}})],1)],1),e._v(" "),n("el-col",{staticClass:"line",attrs:{span:2}},[e._v("-")]),e._v(" "),n("el-col",{attrs:{span:11}},[n("el-form-item",{attrs:{prop:"freq"}},[n("el-date-picker",{attrs:{type:"datetime",placeholder:"选择结束时间","picker-options":e.pickerOptionsEnd1},on:{change:e.enddata},model:{value:e.formInline.endtime,callback:function(t){e.$set(e.formInline,"endtime",t)},expression:"formInline.endtime"}})],1)],1)],1),e._v(" "),n("el-form-item",[n("el-button",{attrs:{type:"primary"},on:{click:function(t){e.getTasktable(0)}}},[e._v("查询")]),e._v(" "),n("el-button",{attrs:{type:"primary"},on:{click:e.resetForm}},[e._v("重置")]),e._v(" "),n("el-button",{attrs:{type:"primary"},on:{click:function(t){e.addtask()}}},[e._v("新增任务")])],1)],1)]),e._v(" "),n("div",{staticClass:"tasklist"},[n("el-table",{staticStyle:{width:"100%","text-align":"center"},attrs:{data:e.taskData,stripe:"",border:""}},[n("el-table-column",{attrs:{type:"index",label:"id"}}),e._v(" "),n("el-table-column",{attrs:{label:"检验编号",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("span",[e._v(e._s(t.row.attributes.pump_id))])]}}])}),e._v(" "),n("el-table-column",{attrs:{label:"委托方",align:"center",width:"200"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("span",[e._v(e._s(t.row.attributes.factory))])]}}])}),e._v(" "),n("el-table-column",{attrs:{label:"所属地区",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("span",[e._v(e._s(t.row.attributes.province))])]}}])}),e._v(" "),n("el-table-column",{attrs:{label:"委托人联系方式",align:"center",width:"200"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("span",[e._v(e._s(t.row.attributes.entrust_phone.toString().substring(0,4)+"xxxxx"))])]}}])}),e._v(" "),n("el-table-column",{attrs:{label:"水泵类型",align:"center",width:"150"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("span",[e._v(e._s(t.row.attributes.pump_model))])]}}])}),e._v(" "),n("el-table-column",{attrs:{label:"水泵型号",align:"center",width:"150"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("span",[e._v(e._s(t.row.attributes.pump_type))])]}}])}),e._v(" "),n("el-table-column",{attrs:{label:"检验单位",align:"center",width:"200"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("span",[e._v(e._s(t.row.attributes.detection_unit))])]}}])}),e._v(" "),n("el-table-column",{attrs:{label:"检验标准",align:"center",width:"100"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("span",[e._v(e._s(t.row.attributes.standard))])]}}])}),e._v(" "),n("el-table-column",{attrs:{label:"检验实验室",align:"center",width:"200"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("span",[e._v(e._s(t.row.attributes.lab))])]}}])}),e._v(" "),n("el-table-column",{attrs:{label:"测试台体",align:"center",width:"200"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("span",[e._v(e._s(t.row.attributes.internal_num))])]}}])}),e._v(" "),n("el-table-column",{attrs:{label:"创建日期",align:"center",width:"150"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("span",[e._v(e._s(new Date(t.row.createdAt).toLocaleDateString()))])]}}])}),e._v(" "),n("el-table-column",{attrs:{label:"计划完成时间",align:"center",width:"200"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("span",[e._v(e._s(e.timestampToTime(t.row.attributes.test_time)))])]}}])}),e._v(" "),n("el-table-column",{attrs:{label:"检测人员",align:"center",width:"100"},scopedSlots:e._u([{key:"default",fn:function(e){}}])}),e._v(" "),n("el-table-column",{attrs:{label:"任务状态",align:"center",width:"100"},scopedSlots:e._u([{key:"default",fn:function(e){}}])}),e._v(" "),n("el-table-column",{attrs:{label:"审核状态",align:"center",width:"100"},scopedSlots:e._u([{key:"default",fn:function(e){}}])}),e._v(" "),n("el-table-column",{attrs:{width:"300",label:"查看",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("el-button",{attrs:{type:"primary",icon:"el-icon-edit",size:"mini"},on:{click:function(n){e.editorClient(t.row.id)}}}),e._v(" "),n("el-button",{attrs:{type:"danger",icon:"el-icon-delete",size:"mini"},on:{click:function(n){e.deleteClient(t.row.id)}}}),e._v(" "),n("el-button",{attrs:{type:"primary",size:"mini"},on:{click:function(n){e.taskDetail(t.row.id,t.row.attributes.internal_num)}}},[e._v("详情")]),e._v(" "),n("el-button",{attrs:{type:"primary",size:"mini"},on:{click:function(n){e.clientView(t.row)}}},[e._v("取证")])]}}])})],1),e._v(" "),n("div",{staticStyle:{"margin-top":"20px"}},[n("el-pagination",{attrs:{"page-sizes":[10,20,30,40],"page-size":e.pagesize,layout:"total, sizes, prev, pager, next, jumper",total:e.total},on:{"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}})],1)],1)],1),e._v(" "),n("el-tab-pane",{attrs:{label:"已结束("+e.total1+")"}},[n("el-form",{staticClass:"demo-form-inline",attrs:{inline:!0,model:e.formInline1,size:"small"}},[n("div",{staticStyle:{display:"flex","justify-content":"space-between"}},[n("el-form-item",{attrs:{label:"检验单位"}},[n("el-select",{attrs:{placeholder:"检验单位"},model:{value:e.formInline1.department,callback:function(t){e.$set(e.formInline1,"department",t)},expression:"formInline1.department"}},e._l(e.departmentpump,function(e,t){return n("el-option",{key:t,attrs:{value:e.attributes.name,label:e.attributes.name}})}))],1),e._v(" "),n("el-form-item",{attrs:{label:"检验标准"}},[n("el-select",{attrs:{placeholder:"检验标准"},model:{value:e.formInline1.standard,callback:function(t){e.$set(e.formInline1,"standard",t)},expression:"formInline1.standard"}},e._l(e.form.standard,function(e,t){return n("el-option",{key:t,attrs:{label:e.attributes.name,value:e.id}})}))],1),e._v(" "),n("el-form-item",{attrs:{label:"委托单位"}},[n("el-input",{attrs:{placeholder:"请输入委托单位"},model:{value:e.formInline1.factory,callback:function(t){e.$set(e.formInline1,"factory",t)},expression:"formInline1.factory"}})],1),e._v(" "),n("el-form-item",{attrs:{label:"检测人员"}},[n("el-select",{attrs:{placeholder:"检测人员"},model:{value:e.formInline1.region,callback:function(t){e.$set(e.formInline1,"region",t)},expression:"formInline1.region"}},[n("el-option",{attrs:{label:"区域一",value:"shanghai"}}),e._v(" "),n("el-option",{attrs:{label:"区域二",value:"beijing"}})],1)],1),e._v(" "),n("el-form-item",{attrs:{label:"检测任务编号"}},[n("el-input",{attrs:{placeholder:"检测任务编号"},model:{value:e.formInline1.name,callback:function(t){e.$set(e.formInline1,"name",t)},expression:"formInline1.name"}})],1)],1),e._v(" "),n("div",[n("el-form-item",{attrs:{label:"检测时间"}},[n("el-col",{attrs:{span:11}},[n("el-form-item",[n("el-date-picker",{attrs:{type:"datetime",placeholder:"选择开始时间","picker-options":e.pickerOptionsStart},on:{change:e.testdata},model:{value:e.formInline1.starttime,callback:function(t){e.$set(e.formInline1,"starttime",t)},expression:"formInline1.starttime"}})],1)],1),e._v(" "),n("el-col",{staticClass:"line",attrs:{span:2}},[e._v("-")]),e._v(" "),n("el-col",{attrs:{span:11}},[n("el-form-item",{attrs:{prop:"freq"}},[n("el-date-picker",{attrs:{type:"datetime",placeholder:"选择结束时间","picker-options":e.pickerOptionsEnd1},on:{change:e.enddata},model:{value:e.formInline1.endtime,callback:function(t){e.$set(e.formInline1,"endtime",t)},expression:"formInline1.endtime"}})],1)],1)],1),e._v(" "),n("el-form-item",[n("el-button",{attrs:{type:"primary"},on:{click:function(t){e.getTasktable1(0)}}},[e._v("查询")]),e._v(" "),n("el-button",{attrs:{type:"primary"},on:{click:e.resetForm1}},[e._v("重置")]),e._v(" "),n("el-button",{attrs:{type:"primary"},on:{click:function(t){e.addtask()}}},[e._v("新增任务")])],1)],1)]),e._v(" "),n("el-table",{staticStyle:{width:"100%","text-align":"center"},attrs:{data:e.spacetaskData,stripe:"",border:""}},[n("el-table-column",{attrs:{type:"index",label:"id"}}),e._v(" "),n("el-table-column",{attrs:{label:"检验编号",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("span",[e._v(e._s(t.row.attributes.pump_id))])]}}])}),e._v(" "),n("el-table-column",{attrs:{label:"委托方",align:"center",width:"200"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("span",[e._v(e._s(t.row.attributes.factory))])]}}])}),e._v(" "),n("el-table-column",{attrs:{label:"所属地区",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("span",[e._v(e._s(t.row.attributes.province))])]}}])}),e._v(" "),n("el-table-column",{attrs:{label:"委托人联系方式",align:"center",width:"200"},scopedSlots:e._u([{key:"default",fn:function(t){return[t.row.attributes.entrust_phone?n("span",[e._v(e._s(t.row.attributes.entrust_phone.toString().substring(0,4)+"xxxxx"))]):n("span")]}}])}),e._v(" "),n("el-table-column",{attrs:{label:"水泵类型",align:"center",width:"150"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("span",[e._v(e._s(t.row.attributes.pump_model))])]}}])}),e._v(" "),n("el-table-column",{attrs:{label:"水泵型号",align:"center",width:"150"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("span",[e._v(e._s(t.row.attributes.pump_type))])]}}])}),e._v(" "),n("el-table-column",{attrs:{label:"检验单位",align:"center",width:"200"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("span",[e._v(e._s(t.row.attributes.detection_unit))])]}}])}),e._v(" "),n("el-table-column",{attrs:{label:"检验标准",align:"center",width:"100"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("span",[e._v(e._s(t.row.attributes.standard))])]}}])}),e._v(" "),n("el-table-column",{attrs:{label:"检验实验室",align:"center",width:"200"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("span",[e._v(e._s(t.row.attributes.lab))])]}}])}),e._v(" "),n("el-table-column",{attrs:{label:"测试台体",align:"center",width:"200"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("span",[e._v(e._s(t.row.attributes.internal_num))])]}}])}),e._v(" "),n("el-table-column",{attrs:{label:"创建日期",align:"center",width:"150"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("span",[e._v(e._s(new Date(t.row.createdAt).toLocaleDateString()))])]}}])}),e._v(" "),n("el-table-column",{attrs:{label:"计划完成时间",align:"center",width:"200"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("span",[e._v(e._s(e.timestampToTime(t.row.attributes.test_time)))])]}}])}),e._v(" "),n("el-table-column",{attrs:{label:"检测人员",align:"center",width:"100"},scopedSlots:e._u([{key:"default",fn:function(e){}}])}),e._v(" "),n("el-table-column",{attrs:{label:"任务状态",align:"center",width:"100"},scopedSlots:e._u([{key:"default",fn:function(e){}}])}),e._v(" "),n("el-table-column",{attrs:{label:"审核状态",align:"center",width:"100"},scopedSlots:e._u([{key:"default",fn:function(e){}}])}),e._v(" "),n("el-table-column",{attrs:{width:"300",label:"查看",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("el-button",{attrs:{type:"primary",icon:"el-icon-edit",size:"mini"},on:{click:function(n){e.editorClient(t.row.id)}}}),e._v(" "),n("el-button",{attrs:{type:"danger",icon:"el-icon-delete",size:"mini"}}),e._v(" "),n("el-button",{attrs:{type:"primary",size:"mini"},on:{click:function(n){e.taskDetail(t.row.id,t.row.attributes.internal_num)}}},[e._v("详情")])]}}])})],1),e._v(" "),n("div",{staticStyle:{"margin-top":"20px"}},[n("el-pagination",{attrs:{"page-sizes":[10,20,30,40],"page-size":e.pagesize1,layout:"total, sizes, prev, pager, next, jumper",total:e.total1},on:{"size-change":e.handleSizeChange1,"current-change":e.handleCurrentChange1}})],1)],1)],1),e._v(" "),n("div",{staticClass:"block"},[e.taskdialog?n("el-dialog",{attrs:{title:"检测取证任务"+e.dialogtext,visible:e.taskdialog,width:"50%"},on:{"update:visible":function(t){e.taskdialog=t}}},[n("el-form",{ref:"taskform",attrs:{model:e.form,rules:e.formrule,"label-width":"120px"}},[n("el-divider",{staticStyle:{color:"blue"},attrs:{"content-position":"left"}},[e._v("检测任务基本信息")]),e._v(" "),n("el-row",[n("el-col",{attrs:{span:12}},[n("div",{staticClass:"grid-content bg-purple"},[n("el-form-item",{attrs:{label:"检验编号：",prop:"inspection_number"}},[n("el-input",{attrs:{placeholder:"请输入检验编号"},model:{value:e.form.inspection_number,callback:function(t){e.$set(e.form,"inspection_number",t)},expression:"form.inspection_number"}})],1),e._v(" "),n("el-form-item",{attrs:{label:"所属地址",prop:"addr"}},[n("el-cascader",{attrs:{placeholder:"请选择所属地址",size:"large",options:e.regionoptions},on:{change:e.handleModChange},model:{value:e.form.addr,callback:function(t){e.$set(e.form,"addr",t)},expression:"form.addr"}})],1),e._v(" "),n("el-form-item",{attrs:{label:"水泵用途",prop:"usetype"}},[n("el-select",{attrs:{placeholder:"请选择水泵用途"},model:{value:e.form.usetype,callback:function(t){e.$set(e.form,"usetype",t)},expression:"form.usetype"}},e._l(e.pumpusetype,function(e,t){return n("el-option",{key:t,attrs:{label:e,value:e}})}))],1),e._v(" "),n("el-form-item",{attrs:{label:"检测类型"}},[n("el-select",{attrs:{placeholder:"请选择检测类型"},model:{value:e.form.checktype,callback:function(t){e.$set(e.form,"checktype",t)},expression:"form.checktype"}},[n("el-option",{attrs:{label:"性能检测",value:"性能检测"}})],1)],1),e._v(" "),n("el-form-item",{attrs:{label:"检验标准",prop:"region"}},[n("el-select",{attrs:{placeholder:"请选择检验标准"},on:{change:e.changeStandard},model:{value:e.form.region,callback:function(t){e.$set(e.form,"region",t)},expression:"form.region"}},e._l(e.form.standard,function(e,t){return n("el-option",{key:t,attrs:{label:e.attributes.name,value:e.id}})}))],1)],1)]),e._v(" "),n("el-col",{attrs:{span:12}},[n("div",{staticClass:"grid-content bg-purple-light"},[n("el-form-item",{attrs:{label:"委托方",prop:"entrust"}},[n("el-input",{model:{value:e.form.entrust,callback:function(t){e.$set(e.form,"entrust",t)},expression:"form.entrust"}})],1),e._v(" "),n("el-form-item",{attrs:{label:"委托方联系方式",prop:"entrustphone"}},[n("el-input",{attrs:{placeholder:"请输入委托方联系方式"},model:{value:e.form.entrustphone,callback:function(t){e.$set(e.form,"entrustphone",e._n(t))},expression:"form.entrustphone"}})],1),e._v(" "),n("el-form-item",{attrs:{label:"水泵型号",prop:"model"}},[n("el-select",{attrs:{placeholder:"请选择水泵型号"},model:{value:e.form.model,callback:function(t){e.$set(e.form,"model",t)},expression:"form.model"}},e._l(e.pumpmodel,function(e,t){return n("el-option",{key:t,attrs:{label:e,value:e}})}))],1),e._v(" "),n("el-form-item",{attrs:{label:"计划完成时间：",prop:"endtime"}},[n("el-date-picker",{attrs:{type:"datetime",placeholder:"请选择任务计划完成时间","picker-options":e.pickerOptionsEnd,"value-format":"timestamp"},model:{value:e.form.endtime,callback:function(t){e.$set(e.form,"endtime",t)},expression:"form.endtime"}})],1)],1)])],1),e._v(" "),n("el-divider",{staticStyle:{color:"blue"},attrs:{"content-position":"left"}},[e._v("检测资源信息")]),e._v(" "),n("el-row",[n("el-col",{attrs:{span:12}},[n("div",{staticClass:"grid-content bg-purple"},[n("el-form-item",{attrs:{label:"检测单位",prop:"client"}},[n("el-select",{attrs:{placeholder:"请选择检测单位"},on:{change:e.pumpDepartmentSelect},model:{value:e.form.client,callback:function(t){e.$set(e.form,"client",t)},expression:"form.client"}},e._l(e.departmentpump,function(e,t){return n("el-option",{key:t,attrs:{label:e.attributes.name,value:e.id}})}))],1),e._v(" "),n("el-form-item",{attrs:{label:"检测人"}},[n("el-select",{attrs:{placeholder:"请选择检测类型"},model:{value:e.form.testuser,callback:function(t){e.$set(e.form,"testuser",t)},expression:"form.testuser"}},[n("el-option",{attrs:{label:"区域一",value:"shanghai"}}),e._v(" "),n("el-option",{attrs:{label:"区域二",value:"beijing"}})],1)],1)],1)]),e._v(" "),n("el-col",{attrs:{span:12}},[n("div",{staticClass:"grid-content bg-purple-light"},[n("el-form-item",{attrs:{label:"检测实验室"}},[n("el-select",{attrs:{placeholder:"请选择检测实验室"},on:{change:e.laboratorySelect},model:{value:e.form.laboratory,callback:function(t){e.$set(e.form,"laboratory",t)},expression:"form.laboratory"}},e._l(e.departmentlaboratory,function(e,t){return n("el-option",{key:t,attrs:{label:e.attributes.name,value:e.id}})}))],1),e._v(" "),n("el-form-item",{attrs:{label:"测试台体",prop:"bedname"}},[n("el-select",{attrs:{placeholder:"请选择测试台体"},on:{change:e.testBedSelect},model:{value:e.form.bedname,callback:function(t){e.$set(e.form,"bedname",t)},expression:"form.bedname"}},e._l(e.testbedlist,function(e,t){return n("el-option",{key:t,attrs:{label:e.attributes.name,value:e.id}})}))],1)],1)])],1)],1),e._v(" "),n("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[n("el-button",{on:{click:function(t){e.taskdialog=!1}}},[e._v("取 消")]),e._v(" "),n("el-button",{attrs:{type:"primary"},on:{click:function(t){e.addBedtask("taskform")}}},[e._v("确 定")])],1)],1):e._e()],1)],1)},[],!1,null,null,null);h.options.__file="Inspection.vue";t.default=h.exports}}]);