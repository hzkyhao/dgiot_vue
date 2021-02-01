import { query_object, get_object, del_object, update_object, create_object } from '@/api/shuwa_parse'

export async function queryGroup(params) {
  return query_object('Product', params)
}

export async function getGroup(ObjectId) {
  return get_object('Product', ObjectId)
}

export async function deleteGroup(ObjectId) {
  return del_object('Product', ObjectId)
}

export async function putGroup(ObjectId, params) {
  return update_object('Product', ObjectId, params)
}

export async function postGroup(params) {
  return create_object('Product', params)
}
