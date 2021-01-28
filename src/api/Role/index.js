import request from '@/utils/request'
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
