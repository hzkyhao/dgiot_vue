import request from '@/utils/request'
import { query_object, get_object, del_object, update_object, create_object,query_object_header } from "@/api/shuwa_parse"

export async function queryDevice(params) {
  return query_object('Device', params)
}

export async function create_Device(parsms) {
  const { results } = await this.$create_object("Device", parsms)
  console.log(results)
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
