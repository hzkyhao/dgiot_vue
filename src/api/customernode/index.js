import request from '@/utils/request'

export function addCustomer(parentId, name) {
  return request({
    url: 'iotapi/suke/add_customernode',
    method: 'post',
    params: {
      parentId: parentId,
      name: name
    }
  })
}
