import request from "@/utils/request";

export async function batch(data) {
  console.log(data, 'axios from batch')
  return request({
    url: 'iotapi/batch',
    method: "post",
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json'
    },
    data: { requests: data }
  });
}

