import { query_object, get_object, del_object, update_object, create_object } from '@/api/shuwa_parse'
import request from '@/utils/request'

export async function queryRole(params) {
  return query_object('_Role', params)
}

export async function getRole(ObjectId) {
  return get_object('_Role', ObjectId)
}

export async function delRole(ObjectId) {
  return del_object('_Role', ObjectId)
}

export async function putRole(ObjectId, params) {
  return update_object('_Role', ObjectId, params)
}

export async function postRole(params) {
  return create_object('_Role', params)
}

export function roletree() {
  return request({
    url: 'iotapi/roletree',
    method: 'get'
  })
}

export function getServer(pro) {
  return request({
    url: 'iotapi/apihub',
    method: 'get',
    params: {
      appname: pro
    }
  })
}
