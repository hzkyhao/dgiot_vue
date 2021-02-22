/*
 * @Author: your name
 * @Date: 2021-02-22 17:25:16
 * @LastEditTime: 2021-02-22 17:26:57
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \platform\src\api\Direct\index.js
 */
import { query_object, get_object, del_object, update_object, create_object } from '@/api/shuwa_parse'
export async function queryDict(params) {
  return query_object('Dict', params)
}

export async function getDict(ObjectId) {
  return get_object('Dict', ObjectId)
}

export async function delDict(ObjectId) {
  return del_object('Dict', ObjectId)
}

export async function putDict(ObjectId, params) {
  return update_object('Dict', ObjectId, params)
}

export async function postDict(params) {
  return create_object('Dict', params)
}

export async function getDictCount(params) {
  return query_object('Dict', params)
}
