import { query_object, get_object, del_object, update_object, create_object } from '@/api/shuwa_parse'

export async function queryDevice(params) {
  return query_object('Device', params)
}

export async function getDevice(ObjectId) {
  return get_object('Device', ObjectId)
}

export async function deleteDevice(ObjectId) {
  return del_object('Device', ObjectId)
}

export async function putDevice(ObjectId) {
  return update_object('Device', ObjectId)
}

export async function postDevice(params) {
  return create_object('Device', params)
}

export async function getDeviceCountByProduct(productId) {
  const params = {
    keys: 'count(*)',
    skip: 0,
    limit: 1,
    where: {
      "product": productId
    }
  }
  const { count = -1 } = await query_object('Device', params)
  return count
}
