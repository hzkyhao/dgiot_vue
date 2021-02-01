import axios from "axios";
import qs from "qs";
import { Message } from "element-ui";
import Cookies from "js-cookie";
import { query_object, get_object, del_object, update_object, create_object,query_object_header } from "@/api/shuwa_parse"

import { getBatchNumer, create_Dict,getIndustry, delete_Dict, update_Dict} from "@/api/Dict"
import { queryDevice, create_Device} from "@/api/Device"
import { queryProduct} from "@/api/Product"
axios.defaults.withCredentials = true;
const serviceWen = axios.create({
  baseURL: process.env.BASE_API,
  timeout: 8000
});

// request拦截器
serviceWen.interceptors.request.use(
  config => {
    config.headers["Accept"] = "application/json";
    config.headers["Content-Type"] = "application/json";
    config.headers["sessionToken"] = Cookies.get("sessionToken");
    // console.log('config.url', config.url)

    // if (config.url.indexOf("classes/") != -1) {
    //   config.headers["sessionToken"] = Cookies.get("sessionToken");
    //   console.log( config.headers["sessionToken"])
    // } else {
    //   // 接口用
    //
    //   config.headers["sessionToken"] = Cookies.get("sessionToken");
    // }

    return config;
  },
  error => {
    // Do something with request error
    console.log(error); // for debug
    Promise.reject(error);
  }
);

// respone拦截器
serviceWen.interceptors.response.use(
  response => {
    const res = response.data;
    if (response && response.status !== 200 && response.status !== 201) {
      Message({
        message: res.data,
        type: "error",
        duration: 1 * 1000
      });
    } else {
      return response.data;
    }
  },
  error => {
    console.log(error); // for debug
    if (error.response.status === 504) {
      Message({
        message: "请求超时",
        type: "error",
        duration: 2 * 1000
      });
    } else if (error.response.status === 401) {
      Message({
        message: "您权限过期,请重新登录",
        type: "warning",
        duration: 2 * 1000
      });
      sessionStorage.removeItem("roles");
      sessionStorage.removeItem("username");
      sessionStorage.removeItem("token");
      Cookies.set("username", "" - 1);
      Cookies.set("sessionToken", "" - 1);
      Cookies.set("access_token", "" - 1);
      localStorage.removeItem("list");
      location.href = "/#/login";
    } else if (error.response.status === 403) {
      Message({
        message: "没有操作权限 w",
        type: "error",
        duration: 2 * 1000
      });
    } else {
      return Promise.reject(error.response.data);
    }
  }
);

function objGet(data, path) {
  if (data == undefined) return "";

  const pathArr = path.split(".");
  let result = data;

  for (let i = 0; i < pathArr.length; i++) {
    if (result[pathArr[i]] == undefined) return "";
    result = result[pathArr[i]];
  }
  return result;
}

function getFirstKey(obj) {
  if (!obj) {
    return "";
  }
  var keyStr = Object.keys(obj)[0];
  var index = keyStr.lastIndexOf(":");
  return keyStr.substring(index + 1, keyStr.length);
}

function dateFormat(fmt, date) {
  // "YYYY-mm-dd HH:MM"
  let ret;
  if (!date) {
    return "";
  }
  const opt = {
    "Y+": date.getFullYear().toString(), // 年
    "m+": (date.getMonth() + 1).toString(), // 月
    "d+": date.getDate().toString(), // 日
    "H+": date.getHours().toString(), // 时
    "M+": date.getMinutes().toString(), // 分
    "S+": date.getSeconds().toString() // 秒
  };
  for (const k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(
        ret[1],
        ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0")
      );
    }
  }
  return fmt;
}

function timestampToTime(timestamp, full) {
  if (!timestamp) {
    return "";
  }
  var date = new Date(timestamp * 1000); // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + "-";
  var M =
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) + "-";
  var D = date.getDate() + " ";
  var h = date.getHours() + ":";
  var m = date.getMinutes() + ":";
  var s = date.getSeconds();

  if (full) {
    return Y + M + D + h + m + s;
  } else {
    return Y + M + D;
  }
}
export default {
  install(Vue, options) {
    Vue.prototype.$getIndustry = getIndustry
    Vue.prototype.$query_object_header = query_object_header
    Vue.prototype.$getBatchNumer = getBatchNumer
    Vue.prototype.$create_Dict = create_Dict
    Vue.prototype.$delete_Dict = delete_Dict
    Vue.prototype.$axiosWen = serviceWen
    Vue.prototype.$create_object = create_object;
    Vue.prototype.$update_object = update_object;
    Vue.prototype.$update_Dict = update_Dict;
    Vue.prototype.$del_object = del_object;
    Vue.prototype.$get_object = get_object;
    Vue.prototype.$query_object = query_object;
    Vue.prototype.$objGet = objGet;
    Vue.prototype.$qs = qs;
    Vue.prototype.$dateFormat = dateFormat;
    Vue.prototype.$getFirstKey = getFirstKey;
    Vue.prototype.$timestampToTime = timestampToTime;
    Vue.prototype.$queryDevice = queryDevice
    Vue.prototype.$create_Device = create_Device
    Vue.prototype.$queryProduct = queryProduct
  }
};
