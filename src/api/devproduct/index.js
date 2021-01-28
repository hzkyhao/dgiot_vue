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

export async function queryRole(params) {
  return request({
    url: 'iotapi/classes/_Role',
    method: "get",
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json'
    },
    params
  });
}


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

