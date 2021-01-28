import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'iotapi/transaction/list',
    method: 'get',
    params: query
  })
}
