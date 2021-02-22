/*
 * @Author: h7ml
 * @Date: 2021-02-01 16:45:26
 * @LastEditTime: 2021-02-22 11:11:56
 * @Description: this.Batchdelete('Dict', ['id1','id2'])
 * @FilePath: \platform\src\api\batch\index.js
 */
// https://docs.parseplatform.org/rest/guide/#batch-operations
// http://132.232.119.105:5080/swagger/#/Data/post_batch
import request from "@/utils/request";
import { Message } from "element-ui";
const Vue = require("vue");

/**
 *
 * @param {*} tableClass
 * @param {*} ObjectIdArr
 */
export async function Batchdelete(method, tableClass, ObjectIdArr, body) {
  if (!tableClass && !ObjectIdArr) {
    return Message({
      message: "tableClass 和 ObjectIdArr 字段为必传",
      type: "error",
      duration: 1 * 1000
    });
  } else if (Array.isArray(ObjectIdArr) !== true) {
    return Message({
      message: "传入的ObjectIdArr不是一个数组",
      type: "error",
      duration: 1 * 1000
    });
  } else {
    // eslint-disable-next-line prefer-const
    let requests = []
    for (const key in ObjectIdArr) {
      requests.push({
        method: method, path: `classes/${tableClass}/${ObjectIdArr[key]}`, body: body
      })
    }
    const params = {
      "requests": requests
    }
    console.log(params)
    return request({
      url: `iotapi/batch`,
      method: "post",
      data: params
    });
  }
}
/**
 *
 * @param {*}
 * @description  调用方法参考  src\views\equipment_management\platform_overview.vue
 */
export async function batch(data) {
  console.log(data, 'axios from batch')
  return request({
    url: 'iotapi/batch',
    method: "post",
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json'
    },
    data: { requests: data }
  });
}
Vue.prototype.$methodBatch = batch
Vue.prototype.$postBatch = Batchdelete

