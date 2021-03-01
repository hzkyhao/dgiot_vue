/**
 * Created by jiachenpan on 16/11/18.
 */
const Vue = require("vue");
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
    decodeURIComponent(search)
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"') +
    '"}'
  )
}
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function (...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
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

export function timetounix(val) {
  var nowTime = val
  var date = new Date(nowTime)
  var time = date.getTime()
  time = time / 1000
  return time
}

Vue.prototype.$utc2beijing = (utc_datetime) => {
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


// 万亿零转换
export function handleZero(value) {
  // console.log(value);
  // console.log(typeof(value));
  if (typeof (value) === 'number') {
    value = String(value)
    const Y = /0{8}$/
    const W = /0{4}$/
    if (Y.test(value)) {
      return value.replace(Y, '亿')
    } else if (W.test(value)) {
      return value.replace(W, '万')
    }
    return value
  } else if (typeof (value) === 'string') {
    const W = /万+$/
    const Y = /亿+$/
    if (Y.test(value)) {
      return value.replace(Y, '00000000')
    } else if (W.test(value)) {
      return value.replace(W, '0000')
    }
    return value
  }
}
