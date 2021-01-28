import request from '@/utils/request'

export async function queryProduct(params) {
  return request({
    url: 'iotapi/classes/Product',
    method: "get",
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json'
    },
    params
  });
}

