import { query_object, get_object, del_object, update_object, create_object } from '@/api/shuwa_parse'
import request from '@/utils/request'

export async function queryPermission(params) {
  return query_object('Permission', params)
}

export async function getPermission(ObjectId) {
  return get_object('Permission', ObjectId)
}

export async function delPermission(ObjectId) {
  return del_object('Permission', ObjectId)
}

export async function putPermission(ObjectId, params) {
  return update_object('Permission', ObjectId, params)
}

export async function postPermission(params) {
  return create_object('Permission', params)
}
