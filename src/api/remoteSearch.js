import request from '@/utils/request'

export function userSearch(name) {
  return request({
    url: 'iotapi/search/user',
    method: 'get',
    params: { name }
  })
}
