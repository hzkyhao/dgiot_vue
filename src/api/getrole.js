import request from '@/utils/request'

export function getcontrol() {
  return request({
    url: 'iotapi/permission',
    method: 'get',
    data: {
    }
  })
}
