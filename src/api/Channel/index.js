import request from '@/utils/request'

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
