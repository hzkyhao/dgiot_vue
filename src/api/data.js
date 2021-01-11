import request from "@/utils/request";

export function initData(url, params) {
  return request({
    url: url,
    method: "get",
    params
  });
}
export function batch(url, data) {
  console.log(url,data,'axios from batch')
  return request({
    url: 'iotapi'+url,
    method: "post",
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json'
    },
    data
  });
}

export async function getProject(params) {
  return request({
    url: 'iotapi/classes/Project',
    method: "get",
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json'
    },
    params
  });
}

export async function getApp(params) {
  return request({
    url: 'iotapi/classes/App',
    method: "get",
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json'
    },
    params
  });
}

export async function getProduct(params) {
  return request({
    url: 'iotapi/classes/Project',
    method: "get",
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json'
    },
    params
  });
}

export async function getDevice(params) {
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
