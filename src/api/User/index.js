import { query_object, get_object, del_object, update_object, create_object } from '@/api/shuwa_parse'

export async function queryUser(params) {
  return query_object('_User', params)
}

export async function getUser(ObjectId) {
  return get_object('_User', ObjectId)
}

export async function deleteUser(ObjectId) {
  return del_object('_User', ObjectId)
}

export async function putUser(ObjectId) {
  return update_object('_User', ObjectId)
}

export async function postUser(params) {
  return create_object('_User', params)
}
