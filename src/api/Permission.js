/**
 *@author vivitang
 *@description Permission接口聚合
 */

import request from "@/utils/request";

export async function QueryPermission(params) {
  return request({
    url: 'iotapi/classes/Permission',
    method: "get",
    params
  });
}

export async function getPermission(params) {
  return request({
    url: `iotapi/classes/Permission/${params}`,
    method: "get",
  });
}

export async function putPermission(id, data) {
  return request({
    url: `iotapi/classes/Permission/${id}`,
    method: "PUT",
    data
  });
}
