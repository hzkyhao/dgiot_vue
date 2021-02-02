import { query_object, get_object, del_object, update_object, create_object } from '@/api/shuwa_parse'
import request from '@/utils/request'

export async function queryUser(params) {
  return query_object('_User', params)
}

export async function getUser(ObjectId) {
  return get_object('_User', ObjectId)
}

export async function delUser(ObjectId) {
  return del_object('_User', ObjectId)
}

export async function putUser(ObjectId) {
  return update_object('_User', ObjectId)
}

export async function postUser(params) {
  return create_object('_User', params)
}

export function Sitepro(pro){
  return request({
    url: 'iotapi/classes/Site/' + pro,
    method: 'get',
    data: {
    }
  })
}

export function login(username, password) {
  return request({
    url: 'iotapi/auth/login',
    method: 'post',
    data: JSON.stringify({
      username,
      password
    })
  })
}

export function logoutBtn() {
  return request({
    url: 'iotapi/user/logout',
    method: 'post'
  })
}

export function Phonelogin(phone, nationcode){
  return request({
    url: 'iotapi/sendsms?account=' + phone + '&nationcode=' + nationcode,
    method: 'post',
    data: {
    }
  })
}

export function Verify(actions, phone, code){
  return request({
    url: 'iotapi/verify_code/' + actions + '?account=' + phone + '&code=' + code,
    method: 'post',
    data: {
    }
  })
}

export function passwordreset(account, code, password) {
  return request({
    url: 'iotapi/verify_code/passwordreset',
    method: 'post',
    params: {
      account: account,
      code: code
    },
    data: {
      password: password
    }
  })
}
