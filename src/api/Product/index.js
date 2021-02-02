import { query_object, get_object, del_object, update_object, create_object } from '@/api/shuwa_parse'
import request from '@/utils/request'

export async function queryProduct(params) {
  return query_object('Product', params)
}

export async function getProduct(ObjectId) {
  return get_object('Product', ObjectId)
}

export async function delProduct(ObjectId) {
  return del_object('Product', ObjectId)
}

export async function putProduct(ObjectId, params) {
  return update_object('Product', ObjectId, params)
}

export async function postProduct(params) {
  return create_object('Product', params)
}
