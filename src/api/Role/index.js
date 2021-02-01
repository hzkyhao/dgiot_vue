import { query_object, get_object, del_object, update_object, create_object } from '@/api/shuwa_parse'

export async function queryRole(params) {
  return query_object('_Role', params)
}

export async function getRole(ObjectId) {
  return get_object('_Role', ObjectId)
}

export async function deleteRole(ObjectId) {
  return del_object('_Role', ObjectId)
}

export async function putRole(ObjectId, params) {
  return update_object('_Role', ObjectId, params)
}

export async function postRole(params) {
  return create_object('_Role', params)
}
