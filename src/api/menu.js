import request from '@/utils/request'

// 获取所有的菜单树
export function getMenusTree() {
  return request({
    url: 'iotapi/menus/tree',
    method: 'get'
  })
}

export function buildMenus() {
  return request({
    url: 'iotapi/menus/build',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: 'iotapi/menus',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/menus/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'iotapi/menus',
    method: 'put',
    data
  })
}
