(this.webpackJsonp=this.webpackJsonp||[]).push([["chunk-b440"],{MPjy:function(e,t,r){"use strict";r.d(t,"a",function(){return i});var s=r("X3IP");function i(e){"209"==e.code?(Object(s.Message)({message:"您权限过期,请重新登录",type:"error",duration:2e3}),sessionStorage.removeItem("roles"),sessionStorage.removeItem("username"),sessionStorage.removeItem("token"),sessionStorage.removeItem("list"),location.href="/#/login"):119==e.code?Object(s.Message)({message:"没有操作权限",type:"warning",duration:2e3}):Object(s.Message)({message:e.message,type:"error"})}},Mld3:function(e,t,r){"use strict";r.d(t,"a",function(){return i}),r.d(t,"b",function(){return a}),r.d(t,"c",function(){return l}),r.d(t,"d",function(){return n});var s=r("t3Un");function i(e){var t=e.order,r=e.limit,i=e.skip,a=e.keys,l=e.include,n=e.where;return Object(s.a)({url:"/classes/Project",method:"get",params:{order:t,limit:r,skip:i,keys:a,include:l,where:n}})}function a(e){if("number"==typeof e){e=String(e);var t=/0{8}$/,r=/0{4}$/;return t.test(e)?e.replace(t,"亿"):r.test(e)?e.replace(r,"万"):e}if("string"==typeof e){var s=/万+$/,i=/亿+$/;return i.test(e)?e.replace(i,"00000000"):s.test(e)?e.replace(s,"0000"):e}}function l(e,t,r){return Object(s.a)({url:"/lictool",method:"get",params:{appid:e,appsecret:t,shuwa_iot_software:r}})}function n(e){return Object(s.a)({url:"/licsetup",method:"get",params:{license:e}})}},"RU/L":function(e,t,r){r("Rqdy");var s=r("WEpk").Object;e.exports=function(e,t,r){return s.defineProperty(e,t,r)}},Rqdy:function(e,t,r){var s=r("Y7ZC");s(s.S+s.F*!r("jmDH"),"Object",{defineProperty:r("2faE").f})},SEkw:function(e,t,r){e.exports={default:r("RU/L"),__esModule:!0}},YEIV:function(e,t,r){"use strict";t.__esModule=!0;var s=function(e){return e&&e.__esModule?e:{default:e}}(r("SEkw"));t.default=function(e,t,r){return t in e?(0,s.default)(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}},aWz1:function(e,t,r){"use strict";var s=r("uUZv");r.n(s).a},jm48:function(e,t,r){"use strict";r.r(t);var s=r("gDS+"),i=r.n(s),a=r("YEIV"),l=r.n(a),n=r("v0iw"),o=r.n(n),u=r("MPjy"),c=r("Mld3"),p={},m={data:function(){var e,t=this,r=function(e,t,r){/^[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/.test(t)?r():r(new Error("需要输入正确的服务器IP"))};return{serverdialogVisible:!1,dialogFormVisible:!1,dialogVisible:!1,licensedetail:{},formInline:{user:"",region:1,app:"",version:""},tableData:[],pagesize:10,total:0,start:0,licenseid:"",ruleForm:l()({name:"",region:"standard",date1:"",date2:"",appname:"",version:"",licensekey:"",username:""},"version",""),serverForm:{app:"",serverip:"",serverhe:"",serverg:"",serverkey:"",license:"",online:!1,customer_name:"",disk:Number("50G".replace(/G/g,"")),status:"unauthorized",publicip:"",mac:""},applist:[],rules:(e={name:[{required:!0,message:"请输入预计设计规模"},{type:"number",message:"预计设计规模 必须为数字值"}],region:[{required:!0,message:"请选择应用类型",trigger:"change"}],appname:[{required:!0,message:"请选择需要应用",trigger:"change"}],version:[{required:!0,message:"请选择应用版本",trigger:"change"}],licensekey:[{required:!0,message:"license必填",trigger:"blur"}],username:[{required:!0,message:"客户名称必填",trigger:"blur"}]},l()(e,"version",[{required:!0,message:"应用版本必填",trigger:"blur"}]),l()(e,"date1",[{type:"date",required:!0,message:"请选择开始时间",trigger:"change"}]),l()(e,"date2",[{type:"date",required:!0,message:"请选择结束时间",trigger:"change"}]),e),serverrules:{app:[{required:!0,message:"请选择客户名称",trigger:"change"}],serverip:[{required:!0,message:"请输入服务器私网IP",trigger:"blur"},{validator:r}],publicip:[{required:!0,message:"请输入服务器公网IP",trigger:"blur"},{validator:r}],mac:[{required:!0,message:"请输入服务器MAC地址",trigger:"blur"}],serverhe:[{required:!0,message:"请输入服务器配置"},{validator:function(e,t,r){""===t?r(new Error("请输入正数")):/^[+]?(0|([1-9]\d*))(\.\d+)?$/g.test(t)?r():r(new Error("请输入数字"))},type:"number",message:"服务器配置必须为数字值"}],serverg:[{required:!0,message:"请输入服务器配置"},{type:"number",message:"服务器配置必须为数字值"}],serverkey:[{required:!0,message:"请输入机器码",trigger:"blur"},{validator:function(e,t,r){/^[A-Za-z0-9]{32}$/.test(t)?r():r(new Error("需要输入正确32位机器码"))}}],customer_name:[{required:!0,message:"请输入用户名称",trigger:"blur"}],disk:[{required:!0,message:"请输入服务器内存"},{type:"number",message:"服务器内存必须为数字值"}],stauts:[{required:!0,message:"请选择服务器状态",trigger:"change"}]},pickerOptionsStart:{disabledDate:function(e){var r=t.ruleForm.date2;return r&&e.getTime()>new Date(r).getTime()||e.getTime()<Date.now()-864e5}},pickerOptionsEnd:{disabledDate:function(e){var r=t.ruleForm.date1;return r?e.getTime()<new Date(r).getTime():e.getTime()<Date.now()-864e5}},appid:"",appsecret:"",isupdatedserver:""}},mounted:function(){this.getApp(),this.$route.query.appid&&(this.formInline.app=this.$route.query.appid),this.getOrigin(0),this.appid=this.$route.query.appid,this.appsecret=this.$route.query.appsecret},methods:{addServer:function(){this.serverdialogVisible=!0},serverOption:function(e){var t=this;this.$refs[e].validate(function(r){if(r){var s=new(o.a.Object.extend("License")),i=new(o.a.Object.extend("App")),a=new o.a.ACL;i.id=t.serverForm.app;var l=o.a.User.current().id;a.setReadAccess(l,!0),a.setWriteAccess(l,!0),s.set("key",t.serverForm.serverkey),s.set("private_ip",t.serverForm.serverip),s.set("is_online",t.serverForm.online),s.set("customer_name",t.serverForm.customer_name),s.set("public_ip",t.serverForm.publicip),s.set("disk",t.serverForm.disk+"G"),s.set("core",t.serverForm.serverhe),s.set("memory",t.serverForm.serverg+"G"),s.set("mac",t.serverForm.mac),s.set("license",t.serverForm.license),s.set("app",i),s.set("ACL",a),s.save().then(function(r){r&&(t.$message.success("添加成功"),t.$refs[e].resetFields(),t.getOrigin(0),t.serverdialogVisible=!1)},function(e){Object(u.a)(e)})}else console.log("error.submit")})},getApp:function(){var e=this,t=o.a.Object.extend("App");new o.a.Query(t).find().then(function(t){t&&(e.applist=t)},function(e){Object(u.a)(e)})},getOrigin:function(e){var t=this;0==e&&(this.start=0);var r=o.a.Object.extend("License"),s=new o.a.Query(r);1!=this.formInline.region&&s.equalTo("is_online",this.formInline.region),""!=this.formInline.app&&s.equalTo("app",this.formInline.app),""!=this.formInline.user&&s.matches("customer_name",this.formInline.user,"i"),""!=this.formInline.version&&s.equalTo("type",this.formInline.version),s.ascending("-updatedAt"),s.skip(this.start),s.limit(this.pagesize),s.count().then(function(e){t.total=e,s.find().then(function(e){e&&(t.tableData=e)},function(e){Object(u.a)(e)})})},handleSizeChange:function(e){this.pagesize=e,this.getOrigin(1)},handleCurrentChange:function(e){this.start=(e-1)*this.pagesize,this.getOrigin(1)},addserver:function(e){var t=this;if(console.log(e),this.licenseid=e.id,this.ruleForm.version=e.attributes.software,e.attributes.license?this.ruleForm.licensekey=e.attributes.license:this.ruleForm.licensekey="",this.ruleForm.username=e.attributes.customer_name,e.attributes.product)for(var r in e.attributes.product)p[r]=e.attributes.product[r];"installed"==e.attributes.status||"start_install"==e.attributes.status||"installing"==e.attributes.status?this.$confirm("installed"==e.attributes.status?"是否重新部署服务器, 是否继续?":"服务器正在部署中，是否重新部署","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){t.dialogFormVisible=!0}).catch(function(){t.$message({type:"info",message:"已取消重新部署"})}):this.dialogFormVisible=!0},updatedLicense:function(e){var t=this;this.$refs[e].validate(function(e){if(!e)return console.log("error submit!!"),!1;p.software=t.ruleForm.version;var r=new(o.a.Object.extend("License"));r.id=t.licenseid,r.set("type",t.ruleForm.region),r.set("license",t.ruleForm.licensekey),r.set("status","start_install"),r.set("customer_name",t.ruleForm.username),r.set("product",p),r.save().then(function(e){e&&(t.$message.success("正在部署中"),t.dialogFormVisible=!1,t.getOrigin(1))},function(e){Object(u.a)(e)})})},handleDetail:function(e,t){this.dialogVisible=!0,this.licensedetail=i()(t.attributes.product,null,10)},startDate:function(){this.ruleForm.date2<=this.ruleForm.date1&&""!=this.ruleForm.date2&&null!=this.ruleForm.date2&&(this.$message.warning("采集结束时间要小于开始时间"),this.ruleForm.date1=""),this.ruleForm.date1<Date.now()-2e3&&(this.$message.warning("采集开始时间要大于当前时间"),this.ruleForm.date1="")},endDate:function(){this.ruleForm.date2<=this.ruleForm.date1&&(this.$message.warning("采集结束时间要小于开始时间"),this.ruleForm.date2=""),this.ruleForm.date2<Date.now()-2e3&&(this.$message.warning("采集结束时间要大于当前时间"),this.ruleForm.date2="")},uploadLicense1:function(e){Object(c.d)(e.attributes.license).then(function(t){window.open(window.location.origin+"/iotapi/licsetup?license="+e.attributes.license,"_blank")})},lictool:function(){var e=this;Object(c.c)(this.appid,this.appsecret).then(function(t){t&&window.open(window.location.origin+"/iotapi/lictool?appid="+e.appid+"&appsecret="+e.appsecret,"_blank")}).catch(function(t){e.$message.error(t.error)})}}},v=(r("aWz1"),r("KHd+")),d=Object(v.a)(m,function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"serverlist"},[r("div",{staticClass:"servercontent"},[r("el-breadcrumb",{staticStyle:{"margin-bottom":"20px"},attrs:{"separator-class":"el-icon-arrow-right"}},[r("el-breadcrumb-item",{attrs:{to:{path:"/roles/applicationManagement"}}},[e._v("返回应用管理")]),e._v(" "),r("el-breadcrumb-item",[e._v("部署服务")])],1),e._v(" "),r("h3",[e._v("服务器部署")]),e._v(" "),r("el-form",{staticClass:"demo-form-inline",attrs:{inline:!0,model:e.formInline,size:"small"}},[r("el-form-item",{staticStyle:{float:"left"}},[r("el-button",{directives:[{name:"show",rawName:"v-show",value:e.appid&&e.appsecret,expression:"appid&&appsecret"}],attrs:{type:"success"},on:{click:e.lictool}},[e._v("\n          下载\n          "),r("i",{staticClass:"el-icon-download"})])],1),e._v(" "),r("el-form-item",[r("el-input",{attrs:{placeholder:"请输入用户名称"},model:{value:e.formInline.user,callback:function(t){e.$set(e.formInline,"user",t)},expression:"formInline.user"}})],1),e._v(" "),r("el-form-item",[r("el-select",{attrs:{placeholder:"运行状态"},model:{value:e.formInline.region,callback:function(t){e.$set(e.formInline,"region",t)},expression:"formInline.region"}},[r("el-option",{attrs:{label:"全部",value:1}}),e._v(" "),r("el-option",{attrs:{label:"在线",value:!0}}),e._v(" "),r("el-option",{attrs:{label:"离线",value:!1}})],1)],1),e._v(" "),r("el-form-item",[r("el-select",{attrs:{placeholder:"应用商名称"},model:{value:e.formInline.app,callback:function(t){e.$set(e.formInline,"app",t)},expression:"formInline.app"}},e._l(e.applist,function(e,t){return r("el-option",{key:t,attrs:{label:e.attributes.title,value:e.id}})}))],1),e._v(" "),r("el-form-item",[r("el-select",{attrs:{placeholder:"请选择应用类型"},model:{value:e.formInline.version,callback:function(t){e.$set(e.formInline,"version",t)},expression:"formInline.version"}},[r("el-option",{attrs:{label:"标准版",value:"standard"}}),e._v(" "),r("el-option",{attrs:{label:"企业版",value:"enterprise"}}),e._v(" "),r("el-option",{attrs:{label:"旗舰版",value:"ultimate"}})],1)],1),e._v(" "),r("el-form-item",[r("el-button",{attrs:{type:"primary"},on:{click:function(t){e.getOrigin(0)}}},[e._v("查询")]),e._v(" "),r("el-button",{attrs:{type:"primary"},on:{click:e.addServer}},[e._v("新增")])],1)],1)],1),e._v(" "),r("div",{staticClass:"servertable"},[r("el-table",{staticStyle:{width:"100%","text-align":"center"},attrs:{data:e.tableData}},[r("el-table-column",{attrs:{label:"编号",type:"index",width:"50",align:"center"}}),e._v(" "),r("el-table-column",{attrs:{label:"客户名称",align:"center",width:"100"},scopedSlots:e._u([{key:"default",fn:function(t){return[r("span",[e._v(e._s(t.row.attributes.customer_name))])]}}])}),e._v(" "),r("el-table-column",{attrs:{label:"客户应用",align:"center",width:"200"},scopedSlots:e._u([{key:"default",fn:function(t){return[r("span",[e._v(e._s(t.row.attributes.appname))])]}}])}),e._v(" "),r("el-table-column",{attrs:{label:"版本",align:"center",width:"100"},scopedSlots:e._u([{key:"default",fn:function(t){return[r("span",[e._v(e._s(t.row.attributes.version))])]}}])}),e._v(" "),r("el-table-column",{attrs:{label:"服务器IP",align:"center",width:"150"},scopedSlots:e._u([{key:"default",fn:function(t){return[r("p",[e._v(e._s(t.row.attributes.private_ip+"(私)"))]),e._v(" "),r("p",[e._v(e._s(t.row.attributes.public_ip+"(公)"))])]}}])}),e._v(" "),r("el-table-column",{attrs:{label:"服务器配置",align:"center",width:"150"},scopedSlots:e._u([{key:"default",fn:function(t){return[r("el-popover",{attrs:{trigger:"hover",placement:"top"}},[r("p",[e._v("IP地址: "+e._s(t.row.attributes.private_ip))]),e._v(" "),r("p",[e._v("MAC地址: "+e._s(t.row.attributes.mac))]),e._v(" "),r("div",{staticClass:"name-wrapper",attrs:{slot:"reference"},slot:"reference"},[r("el-tag",{attrs:{effect:"dark"}},[r("span",[e._v(e._s(t.row.attributes.core+"核"+t.row.attributes.memory+" "+t.row.attributes.disk+"内存"))])])],1)])]}}])}),e._v(" "),r("el-table-column",{attrs:{label:"机器码",align:"center","show-overflow-tooltip":"",width:"200"},scopedSlots:e._u([{key:"default",fn:function(t){return[r("span",[e._v(e._s(t.row.attributes.key))])]}}])}),e._v(" "),r("el-table-column",{attrs:{label:"授权码",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[r("span",[e._v(e._s(t.row.attributes.license))])]}}])}),e._v(" "),r("el-table-column",{attrs:{label:"连接状态",align:"center",width:"100"},scopedSlots:e._u([{key:"default",fn:function(t){return[1==t.row.attributes.is_online?r("span",{staticStyle:{color:"green"}},[e._v("在线")]):r("span",{staticStyle:{color:"red"}},[e._v("离线")])]}}])}),e._v(" "),r("el-table-column",{attrs:{label:"部署情况",align:"center",width:"100"},scopedSlots:e._u([{key:"default",fn:function(t){return["unauthorized"==t.row.attributes.status?r("span",{staticStyle:{color:"red"}},[e._v("未授权")]):"start_install"==t.row.attributes.status?r("span",{staticStyle:{color:"green"}},[e._v("开始部署")]):"installing"==t.row.attributes.status?r("span",{staticStyle:{color:"green"}},[e._v("部署中")]):r("span",{staticStyle:{color:"green"}},[e._v("部署完成")])]}}])}),e._v(" "),r("el-table-column",{attrs:{label:"操作",align:"center",width:"300"},scopedSlots:e._u([{key:"default",fn:function(t){return[r("el-button",{attrs:{size:"mini"},on:{click:function(r){e.handleDetail(t.$index,t.row)}}},[e._v("详 情")]),e._v(" "),r("el-button",{attrs:{size:"mini",type:"primary",icon:"el-icon-s-operation"},on:{click:function(r){e.addserver(t.row)}}},[e._v("服务器部署")]),e._v(" "),r("el-button",{attrs:{size:"mini",type:"success"},on:{click:function(r){e.uploadLicense1(t.row)}}},[e._v("下载配置")])]}}])})],1)],1),e._v(" "),r("div",{staticClass:"serverpagina"},[r("el-pagination",{attrs:{"page-sizes":[10,20,30,50],"page-size":e.pagesize,layout:"total, sizes, prev, pager, next, jumper",total:e.total},on:{"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}})],1),e._v(" "),r("el-dialog",{attrs:{title:"服务部署",visible:e.dialogFormVisible,"close-on-click-modal":!1},on:{"update:visible":function(t){e.dialogFormVisible=t}}},[r("el-form",{ref:"ruleForm",staticClass:"demo-ruleForm",attrs:{model:e.ruleForm,rules:e.rules,"label-width":"100px"}},[r("el-form-item",{attrs:{label:"应用类型",prop:"region"}},[r("el-select",{attrs:{placeholder:"请选择应用类型"},model:{value:e.ruleForm.region,callback:function(t){e.$set(e.ruleForm,"region",t)},expression:"ruleForm.region"}},[r("el-option",{attrs:{label:"标准版",value:"standard"}}),e._v(" "),r("el-option",{attrs:{label:"企业版",value:"enterprise"}}),e._v(" "),r("el-option",{attrs:{label:"旗舰版",value:"ultimate"}})],1),e._v(" "),r("p",{staticStyle:{color:"#cc6e00",margin:"0",position:"absolute",top:"30px"}},[e._v("标准版本为单机版")])],1),e._v(" "),r("el-form-item",{attrs:{label:"授权码",prop:"licensekey"}},[r("el-input",{attrs:{placeholder:"请输入license授权码"},model:{value:e.ruleForm.licensekey,callback:function(t){e.$set(e.ruleForm,"licensekey",t)},expression:"ruleForm.licensekey"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"客户名称",prop:"username"}},[r("el-input",{attrs:{placeholder:"请输入客户名称"},model:{value:e.ruleForm.username,callback:function(t){e.$set(e.ruleForm,"username",t)},expression:"ruleForm.username"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"服务版本",prop:"version"}},[r("el-input",{attrs:{placeholder:"请输入服务版本"},model:{value:e.ruleForm.version,callback:function(t){e.$set(e.ruleForm,"version",t)},expression:"ruleForm.version"}})],1)],1),e._v(" "),r("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[r("el-button",{attrs:{type:"primary"},on:{click:function(t){e.updatedLicense("ruleForm")}}},[e._v("部 署")]),e._v(" "),r("el-button",{on:{click:function(t){e.dialogFormVisible=!1}}},[e._v("取 消")])],1)],1),e._v(" "),r("el-dialog",{attrs:{title:"详情",visible:e.dialogVisible,width:"50%","before-close":e.handleClose,"close-on-click-modal":!1},on:{"update:visible":function(t){e.dialogVisible=t}}},[r("div",[r("el-input",{attrs:{type:"textarea",rows:20,readonly:""},model:{value:e.licensedetail,callback:function(t){e.licensedetail=t},expression:"licensedetail"}})],1),e._v(" "),r("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"})]),e._v(" "),r("el-dialog",{attrs:{title:"服务器配置",visible:e.serverdialogVisible,width:"50%","close-on-click-modal":!1,"before-close":e.handleClose},on:{"update:visible":function(t){e.serverdialogVisible=t}}},[r("el-form",{ref:"serverForm",staticClass:"demo-serverForm",attrs:{model:e.serverForm,rules:e.serverrules,"label-width":"100px"}},[r("el-form-item",{attrs:{label:"用户名称",prop:"customer_name"}},[r("el-input",{model:{value:e.serverForm.customer_name,callback:function(t){e.$set(e.serverForm,"customer_name",t)},expression:"serverForm.customer_name"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"应用名称",prop:"app"}},[r("el-select",{attrs:{placeholder:"应用商名称"},model:{value:e.serverForm.app,callback:function(t){e.$set(e.serverForm,"app",t)},expression:"serverForm.app"}},e._l(e.applist,function(e,t){return r("el-option",{key:t,attrs:{label:e.attributes.title,value:e.id}})}))],1),e._v(" "),r("el-form-item",{attrs:{label:"服务器IP(私)",prop:"serverip"}},[r("el-input",{model:{value:e.serverForm.serverip,callback:function(t){e.$set(e.serverForm,"serverip",t)},expression:"serverForm.serverip"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"服务器IP(公)",prop:"publicip"}},[r("el-input",{model:{value:e.serverForm.publicip,callback:function(t){e.$set(e.serverForm,"publicip",t)},expression:"serverForm.publicip"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"MAC地址",prop:"mac"}},[r("el-input",{model:{value:e.serverForm.mac,callback:function(t){e.$set(e.serverForm,"mac",t)},expression:"serverForm.mac"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"服务器配置",required:""}},[r("el-col",{attrs:{span:11}},[r("el-form-item",{attrs:{prop:"serverhe"}},[r("el-input",{model:{value:e.serverForm.serverhe,callback:function(t){e.$set(e.serverForm,"serverhe",t)},expression:"serverForm.serverhe"}},[r("template",{slot:"append"},[e._v("核")])],2)],1)],1),e._v(" "),r("el-col",{staticClass:"line",attrs:{span:2}},[e._v("-")]),e._v(" "),r("el-col",{attrs:{span:11}},[r("el-form-item",{attrs:{prop:"serverg"}},[r("el-input",{model:{value:e.serverForm.serverg,callback:function(t){e.$set(e.serverForm,"serverg",e._n(t))},expression:"serverForm.serverg"}},[r("template",{slot:"append"},[e._v("G")])],2)],1)],1)],1),e._v(" "),r("el-form-item",{attrs:{label:"内存",prop:"disk"}},[r("el-input",{model:{value:e.serverForm.disk,callback:function(t){e.$set(e.serverForm,"disk",e._n(t))},expression:"serverForm.disk"}},[r("template",{slot:"append"},[e._v("G")])],2)],1),e._v(" "),r("el-form-item",{attrs:{label:"机器码",prop:"serverkey"}},[r("el-input",{attrs:{placeholder:"请输入机器码"},model:{value:e.serverForm.serverkey,callback:function(t){e.$set(e.serverForm,"serverkey",t)},expression:"serverForm.serverkey"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"授权码"}},[r("el-input",{attrs:{placeholder:"请输入授权码(未授权可为空)"},model:{value:e.serverForm.licence,callback:function(t){e.$set(e.serverForm,"licence",t)},expression:"serverForm.licence"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"服务器状态",prop:"status"}},[r("el-select",{attrs:{placeholder:"应用商名称"},model:{value:e.serverForm.status,callback:function(t){e.$set(e.serverForm,"status",t)},expression:"serverForm.status"}},[r("el-option",{attrs:{label:"未授权",value:"unauthorized"}}),e._v(" "),r("el-option",{attrs:{label:"开始部署",value:"start_install"}}),e._v(" "),r("el-option",{attrs:{label:"部署中",value:"installing"}}),e._v(" "),r("el-option",{attrs:{label:"部署完成",value:"installed"}})],1)],1),e._v(" "),r("el-form-item",{attrs:{label:"在线状态",prop:"online"}},[r("el-switch",{attrs:{"active-color":"#13ce66","inactive-color":"#ff4949"},model:{value:e.serverForm.online,callback:function(t){e.$set(e.serverForm,"online",t)},expression:"serverForm.online"}})],1)],1),e._v(" "),r("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[r("el-button",{on:{click:function(t){e.serverdialogVisible=!1}}},[e._v("取 消")]),e._v(" "),r("el-button",{attrs:{type:"primary"},on:{click:function(t){e.serverOption("serverForm")}}},[e._v("确 定")])],1)],1)],1)},[],!1,null,"4a840f20",null);d.options.__file="server_control.vue";t.default=d.exports},uUZv:function(e,t,r){}}]);