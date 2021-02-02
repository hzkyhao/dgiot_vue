import request from '@/utils/request'

export function getNode() {
  return request({
    url: '/nodes',
    method: 'get',
    params: {

    }
  })
}
export function joinNode(action, node) {
  return request({
    url: '/cluster?action=' + action,
    method: 'post',
    data: {
      node: node
    }
  })
}
