import request from '@/utils/request'

export function hardInfo() {
  return request({
    url: '/hardinfo',
    method: 'get',
    params:{
    }
  })
}
export function license() {
  return request({
    url: '/license',
    method: 'get',
    params:{
    }
  })
}
export function iotHub(type,license,addr) {
  return request({
    url: '/iothub',
    method: 'get',
    params:{
      type,
      license,
      addr
    }
  })
}
export function iotApp(license) {
  return request({
    url: '/iotapp',
    timeout:60000,
    method: 'get',
    params:{
      license:license
    }
  })
}
