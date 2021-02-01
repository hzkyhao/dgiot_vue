/*
 * @Author: h7ml
 * @Date: 2021-02-01 16:45:26
 * @LastEditTime: 2021-02-01 20:21:50
 * @Description: this.Batchdelete('Dict', ['id1','id2'])
 * @FilePath: \platform\src\api\batch\index.js
 */
import request from "@/utils/request";
import { Message } from "element-ui";
const Vue = require("vue");
/**
 *
 * @param {*} tableClass
 * @param {*} ObjectIdArr
 */
export async function Batchdelete(tableClass, ObjectIdArr) {
  if (!tableClass && !ObjectIdArr) {
    return Message({
      message: "tableClass 和 ObjectIdArr 字段为必传",
      type: "error",
      duration: 1 * 1000
    });
  } else if (Array.isArray(ObjectIdArr) !== true) {
    return Message({
      message: "或传入的ObjectIdArr不是一个数组",
      type: "error",
      duration: 1 * 1000
    });
  } else {
    // eslint-disable-next-line prefer-const
    let requests = []
    for (const key in ObjectIdArr) {
      requests.push({
        method: 'DELETE', path: `/parse/classes/${tableClass}/${ObjectIdArr[key]}`, body: {}
      })
      console.log(ObjectIdArr[key])
    }
    const params = {
      "requests": requests
    }
    return request({
      url: `iotapi/batch`,
      method: "post",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json"
      },
      params
    });
  }
}
Vue.prototype.$postBatch = Batchdelete
