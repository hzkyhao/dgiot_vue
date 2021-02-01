import { query_object, get_object, del_object, update_object, create_object } from '@/api/shuwa_parse'
export async function queryChannel(params) {
  return query_object('Channel', params)
}

export async function getChannel(ObjectId) {
  return get_object('Channel', ObjectId)
}

export async function deleteChannel(ObjectId) {
  return del_object('Channel', ObjectId)
}

export async function putChannel(ObjectId) {
  return update_object('Channel', ObjectId)
}

export async function postChannel(params) {
  return create_object('Channel', params)
}
