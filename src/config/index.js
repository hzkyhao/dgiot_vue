/**
 * @description 系统全局配置
 */

// var serverURL = "/"  //构建用
// var serverURL = "http://148.70.107.251:5080/iotapi";
// var serverURL = "http://ci.iotn2n.com:5080/iotapi";
//  var serverURL = "http://148.70.50.192:5080/iotapi"
//  var serverURL = "http://prod.iotn2n.com/iotapi";//线上环境
//  var serverURL = "http://192.168.2.44:5080/iotapi"
var serverURL = "http://192.168.2.51:5080/iotapi"
//var serverURL = "http://192.168.2.66:5080/iotapi";
// var serverURL = "http://132.232.121.164:5080/iotapi";
//  var serverURL = "http://cad.iotn2n.com:5080/iotapi"
//  var serverURL = "http://192.168.2.26:5080/iotapi"
//  var serverURL = "http://pump.iotn2n.com:5080/iotapi"
// var serverURL = "http://sinmahe.iotn2n.com:5080/iotapi"
// var serverURL = "http://120.25.171.26:5080/iotapi"
// var serverURL =  'http://shapes.iotn2n.com:5080/iotapi'

var localTopoUrl = "http://192.168.2.18:8339";

try {
  // 判断是否为生产环境
  if (process.env.NODE_ENV === "production" || serverURL == "/") {
    var hostname = null;
    var serverURL = "/iotapi";
  } else {
    var reg = /^http(s)?:\/\/(.*?)\//;
    var hval = reg.exec(serverURL)[2];
    var i = hval.lastIndexOf(":");
    var hostname = hval.substr(0, i);
  }
} catch (error) {
  var hostname = null;
  var serverURL = "/iotapi";
  console.log("process error ###", error);
}

console.log("process ###", process.env);
// process.env.NODE_ENV === "development"

// 导出es6模块
/* export default {
    tokenCookieExpires: 1,
    passCookieExpires: 1,
    webName: 'eladmin',
    TokenKey: 'EL-ADMIN-TOEKN',
    timeout: 1200000,
    hostname:hostname,
    serverURL:serverURL
  }
   */

// 导出commonjs模块(es6也可导入!!)
module.exports = {
  /**
   * @description 记住密码状态下的token在Cookie中存储的天数，默认1天
   */
  tokenCookieExpires: 1,
  /**
   * @description 记住密码状态下的密码在Cookie中存储的天数，默认1天
   */
  passCookieExpires: 1,
  /**
   * @description 此处修改网站名称
   */
  webName: "eladmin",
  /**
   * @description token key
   */
  TokenKey: "EL-ADMIN-TOEKN",

  /**
   * @description 请求超时时间，毫秒（默认2分钟）
   */
  timeout: 1200000,
  hostname: hostname,
  serverURL: serverURL,
  localTopoUrl: localTopoUrl
};
