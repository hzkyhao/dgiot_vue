/*
 * @Author: your name
 * @Date: 2021-03-01 10:03:27
 * @LastEditTime: 2021-03-01 10:22:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \platform\src\api\Platform\index.js
 */
import request from '@/utils/request'
export async function Project_count(params) {
  return request({
    url: 'iotapi/classes/Project',
    method: "get",
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json'
    },
    params: params
  });
}

export async function product_count(params) {
  return request({
    url: 'iotapi/classes/Product',
    method: "get",
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json'
    },
    params: params
  });
}

export async function app_count(params) {
  return request({
    url: 'iotapi/classes/App',
    method: "get",
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json'
    },
    params: params
  });
}

export async function dev_count(params) {
  return request({
    url: 'iotapi/classes/Device',
    method: "get",
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json'
    },
    params: params
  });
}

export async function dev_active_count(params) {
  return request({
    url: 'iotapi/classes/Device',
    method: "get",
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json'
    },
    params: params
  });
}

export async function dev_online_count(params) {
  return request({
    url: 'iotapi/classes/Device',
    method: "get",
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json'
    },
    params: params
  });
}

