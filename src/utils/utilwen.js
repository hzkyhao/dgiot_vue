import axios from 'axios'
import qs from 'qs';
import { Message } from 'element-ui'
import Cookies from 'js-cookie'


axios.defaults.withCredentials =true

const serviceWen = axios.create({
  baseURL: process.env.BASE_API,
  timeout: 8000
})

// request拦截器
serviceWen.interceptors.request.use(config => {
  config.headers["Content-Type"]='application/json'
  config.headers["Accept"]='application/json'
  if (Cookies.get("access_token")) {
    config.headers['sessionToken'] = Cookies.get("access_token");
  }

  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
serviceWen.interceptors.response.use(
  response => {
    const res = response.data
    if (response && response.status !== 200 && response.status !== 201) {
        Message({
          message: res.data,
          type: 'error',
          duration: 1 * 1000
        })
    } else {
      return response.data
    }
  },
  error => {
    console.log(error)// for debug
    if (error.response.status === 504) {
      Message({
        message: '请求超时',
        type: 'error',
        duration: 2 * 1000
      })
    } else if(error.response.status===401){
      Message({
        message:'您权限过期,请重新登录',
        type: 'warning',
        duration: 2 * 1000
      })
     sessionStorage.removeItem('roles')
     sessionStorage.removeItem('username')
     sessionStorage.removeItem('token')
     Cookies.set('username',''-1)
    Cookies.set('sessionToken',''-1)
    Cookies.set('access_token',''-1)
     localStorage.removeItem('list')
     location.href = '/#/login'
    }
    else if(error.response.status===403){
      Message({
        message: '没有操作权限 w',
        type: 'error',
        duration: 2 * 1000
      })
    }
    else{
      return Promise.reject(error.response.data)
    }
  }
)

function objGet (data, path) {
  if(data == undefined) return '';
  
  const pathArr = path.split('.');
  let result = data;
  
  for(let i = 0; i < pathArr.length; i++) {
    if(result[pathArr[i]] == undefined) return '';
    result = result[pathArr[i]]; 
  }
  return result
}

function getFirstKey(obj){
  if(!obj){
      return ''
  }
  var keyStr = Object.keys(obj)[0]
  var index = keyStr.lastIndexOf("\:");
  return keyStr.substring(index+1,keyStr.length);
}

function dateFormat(fmt, date) {
  // "YYYY-mm-dd HH:MM"
  let ret;
  if(!date){
    return ''
  }
  const opt = {
      "Y+": date.getFullYear().toString(),        // 年
      "m+": (date.getMonth() + 1).toString(),     // 月
      "d+": date.getDate().toString(),            // 日
      "H+": date.getHours().toString(),           // 时
      "M+": date.getMinutes().toString(),         // 分
      "S+": date.getSeconds().toString()          // 秒
  };
  for (let k in opt) {
      ret = new RegExp("(" + k + ")").exec(fmt);
      if (ret) {
          fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
      };
  };
  return fmt;
}
export default{
  install(Vue,options)
  {
    Vue.prototype.getData = function () {
      console.log('I am a method in plug-in');
    },
    Vue.prototype.$axiosWen = serviceWen;
    Vue.prototype.$objGet = objGet;
    Vue.prototype.$qs = qs;
    Vue.prototype.$qs = qs;
    Vue.prototype.$dateFormat = dateFormat;
    Vue.prototype.$getFirstKey = getFirstKey;

	}
}