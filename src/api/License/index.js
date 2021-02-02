import { query_object, get_object, del_object, update_object, create_object } from '@/api/shuwa_parse'
import request from '@/utils/request'

export async function queryLicense(params) {
  return query_object('License', params)
}

export async function getLicense(ObjectId) {
  return get_object('License', ObjectId)
}

export async function delLicense(ObjectId) {
  return del_object('License', ObjectId)
}

export async function putLicense(ObjectId,params) {
  return update_object('License', ObjectId,params)
}

export async function postLicense(params) {
  return create_object('License', params)
}


export function hardInfo() {
  return request({
    url: '/hardinfo',
    method: 'get',
    params: {
    }
  })
}
export function license() {
  return request({
    url: '/iotapi/license',
    method: 'get',
    params: {
    }
  })
}
export function iotHub(type, license, addr) {
  return request({
    url: '/iothub',
    method: 'get',
    params: {
      type,
      license,
      addr
    }
  })
}

export function uploadLicense(appid, appsecret, shuwa_iot_software) {
  return request({
    url: `iotapi/lictool`,
    method: 'get',
    params: {
      appid: appid,
      appsecret: appsecret,
      shuwa_iot_software: shuwa_iot_software
    }
  })
}
export function uploadServer(license) {
  return request({
    url: `iotapi/licsetup`,
    method: 'get',
    params: {
      license: license
    }
  })
}
export function offlineServer(license) {
  return request({
    url: `iotapi/licupdate`,
    method: 'get',
    params: {
      license: license
    }
  })
}
export function setUpLictool(appname) {
  return request({
    url: 'iotapi/iotapp',
    method: 'post',
    data: {
      appname: appname
    }
  })
}
