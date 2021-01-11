import request from '@/utils/request'

export function get(dictName) {
  const params = {
    dictName,
    page: 0,
    size: 9999
  }
  return request({
    url: '/iotapi/dictDetail',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: '/iotapi/dictDetail',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: '/iotapi/dictDetail/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: '/iotapi/dictDetail',
    method: 'put',
    data
  })
}
