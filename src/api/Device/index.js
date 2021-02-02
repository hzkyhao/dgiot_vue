/*
 * @Author: your name
 * @Date: 2021-02-01 19:02:18
 * @LastEditTime: 2021-02-01 21:29:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \platform\src\api\Device\index.js
 */
import request from "@/utils/request";
import { query_object, get_object, del_object, update_object, create_object } from '@/api/shuwa_parse'

export async function queryDevice(params) {
  return query_object('Device', params)
}

export async function getDevice(ObjectId) {
  return get_object('Device', ObjectId)
}

export async function delDevice(ObjectId) {
  return del_object('Device', ObjectId)
}

export async function batchDeleteDevice(ObjectIdArr) {
  return this.$postBatch('Device',ObjectIdArr)
}

export async function putDevice(ObjectId,params) {
  return update_object('Device', ObjectId,params)
}

export async function postDevice(params) {
  return create_object('Device', params)
}
export async function getDeviceCountByProduct(productId) {
  const params = {
    keys: 'count(*)',
    skip: 0,
    limit: 1,
    where: {
      "product": productId
    }
  }
  const { count = -1 } = await query_object('Device', params)
  return count
}
export async function getTdDevice(objectId) {
  var initData = {
    "include": "product",
    "order": "-createdAt",
    "where": { "objectId": objectId }
  }
  console.info("params", initData)
  console.log(new Date())
  return request({
    url: `iotapi/device`,
    method: "post",
    data: initData
  });
}
