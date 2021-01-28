import request from '@/utils/request'

export async function queryDevice(params) {
  return request({
    url: 'iotapi/classes/Device',
    method: "get",
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json'
    },
    params
  });
}

export async function delete_Device(params) {
  return request({
    url: 'iotapi/classes/Channel',
    method: "get",
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json'
    },
    params
  });
}


export async function put_Device(params) {
  return request({
    url: 'iotapi/classes/Channel',
    method: "get",
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json'
    },
    params
  });
}


export async function queryChannel(params) {
  return request({
    url: 'iotapi/classes/Channel',
    method: "get",
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json'
    },
    params
  });
}
