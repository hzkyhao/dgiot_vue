/* eslint-disable space-before-blocks */
import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: 'iotapi/auth/login',
    method: 'post',
    data: JSON.stringify({
      username,
      password
    })
  })
}
export function getInfo(token) {
  return request({
    url: 'iotapi/user/info',
    method: 'get',
    params: { token }
  })
}

export function logoutBtn() {
  return request({
    url: 'iotapi/user/logout',
    method: 'post'
    // headers: {
    //   Authorization: "Logout 123456789"
    // }
  })
}
export function addcon(config) {
  return request({
    url: 'iotapi/add_vcon',
    method: 'post',
    data: {
      config: config
    }
  })
}
export function passwordreset(account, code, password) {
  return request({
    url: 'iotapi/verify_code/passwordreset',
    method: 'post',
    params: {
      account: account,
      code: code
    },
    data: {
      password: password
    }
  })
}
export function timestampToTime(timestamp) {
  var date = new Date(timestamp * 1000)
  var Y = date.getFullYear() + '-'
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  var D = (date.getDate() + 1 <= 10 ? '0' + (date.getDate()) : date.getDate()) + ' '
  var h = (date.getHours() + 1 <= 10 ? '0' + (date.getHours()) : date.getHours()) + ':'
  var m = (date.getMinutes() + 1 <= 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':'
  var s = (date.getSeconds() + 1 <= 10 ? '0' + (date.getSeconds()) : date.getSeconds())
  return Y + M + D + h + m + s
}
export function unixtime() {
  var date = new Date()
  var Y = date.getFullYear() + '-'
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  var D = (date.getDate() + 1 < 10 ? '0' + (date.getDate()) : date.getDate()) + ' '
  var h = date.getHours() + ':'
  var m = date.getMinutes() + ':'
  var s = date.getSeconds()
  if (s > 9) {
    s = date.getSeconds()
  } else {
    s = '0' + date.getSeconds()
  }
  return Y + M + D + h + m + s
}

export function timetounix(val){
  var nowTime = val
  var date = new Date(nowTime)
  var time = date.getTime()
  time = time / 1000
  return time
}
export function Phonelogin(phone, nationcode){
  return request({
    url: 'iotapi/sendsms?account=' + phone + '&nationcode=' + nationcode,
    method: 'post',
    data: {
    }
  })
}
export function Verify(actions, phone, code){
  return request({
    url: 'iotapi/verify_code/' + actions + '?account=' + phone + '&code=' + code,
    method: 'post',
    data: {
    }
  })
}
export function UpdatedMenu(role, menus){
  return request({
    url: 'iotapi/add_menu',
    method: 'put',
    data: {
      role: 'role:' + role,
      items: menus
    }
  })
}
export function UpdatedRole(role, roles){
  return request({
    url: 'iotapi/add_permission',
    method: 'put',
    data: {
      role: 'role:' + role,
      items: roles
    }
  })
}
export function Sitepro(pro){
  return request({
    url: 'iotapi/classes/Site/' + pro,
    method: 'get',
    data: {
    }
  })
}
// export function sessionme() {
//   return request({
//     method: 'get',
//     url: '/session/me',
//     data: {}
//   })
// }
export function utc2beijing(utc_datetime) {
  // 转为正常的时间格式 年-月-日 时:分:秒
  var date = new Date(utc_datetime)
  var Y = date.getFullYear() + '-'
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  var D = (date.getDate() + 1 <= 10 ? '0' + (date.getDate()) : date.getDate()) + ' '
  var h = (date.getHours() + 1 <= 10 ? '0' + (date.getHours()) : date.getHours()) + ':'
  var m = (date.getMinutes() + 1 <= 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':'
  var s = (date.getSeconds() + 1 <= 10 ? '0' + (date.getSeconds()) : date.getSeconds())
  return Y + M + D + h + m + s
}
