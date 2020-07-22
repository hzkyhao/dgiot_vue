import request from "@/utils/request";

export function initData(url, params) {
  return request({
    url: url,
    method: "get",
    params
  });
}
export function batch(url, params) {
  return request({
    url: url,
    method: "post",
    data: params
  });
}
