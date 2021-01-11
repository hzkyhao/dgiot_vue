import request from '@/utils/request'

export function getList(params) {
  return request({
    url: 'iotapi/table/list',
    method: 'get',
    params
  })
}
