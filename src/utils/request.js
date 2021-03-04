/*
 * @Author: your name
 * @Date: 2021-03-03 17:30:51
 * @LastEditTime: 2021-03-04 17:47:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \platform\src\utils\request.js
 */
import axios from "axios";
import { Message } from "element-ui";
import Cookies from "js-cookie";
// 创建axios实例
axios.defaults.withCredentials = true;
let serviceBaseUrl = process.env.BASE_API
const { host } = window.location
console.log("host request", host)
if (host == 'dgiotvue-2gc5b4y325ad531a-1253666439.tcloudbaseapp.com') {
  serviceBaseUrl = 'http://dev.iotn2n.com/'
}
const service = axios.create({
  baseURL: serviceBaseUrl,
  timeout: 60000
});

// request拦截器
service.interceptors.request.use(
  config => {
    config.headers["Content-Type"] = "application/json";
    config.headers["Accept"] = "application/json";
    // if (Cookies.get('sessionToken')) {
    //   config.headers['sessionToken'] = Cookies.get('sessionToken') // 让每个请求携带自定义token 请根据实际情况自行修改
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
service.interceptors.response.use(
  response => {
    const res = response.data;
    if (response.status !== 200 && response.status !== 201) {
      // if ((response.status !== 200) || (response.status !== 201)) {
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
    console.log(error.response); // for debug
    if (error.response.data.code === 504) {
      Message({
        message: "请求超时",
        type: "error",
        duration: 2 * 1000
      });
    } else if (error.response.data.codea === 401) {
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
      localStorage.removeItem("list");
      location.href = "/#/login";
    } else if (error.response.data.code === 403) {
      console.log("没有操作权限");

      return Promise.reject(error.response.data);
    } else {
      return error.response.data
    }
  }
);

export default service;
