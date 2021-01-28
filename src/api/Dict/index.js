import request from '@/utils/request'

export async function queryDict(params) {
  return request({
    url: 'iotapi/classes/Dict',
    method: "get",
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json'
    },
    params
  });
}
