import request from '@/utils/request'
/**
 * 首页接口
 */

// 获取角色列表
export function roletree() {
  return request({
    url: '/roletree',
    method: 'get'
  })
}

// 获取虚拟设备分组
/**
 * <<"nodeType">> => 0 是设备，<<"nodeType">> => 1 是网关，<<"nodeType">> => 2 是虚拟分组
 */
export function getGroup() {
  return request({
    url: '/classes/Product',
    method: 'get',
    params: {
      where: {
        nodeType: 2
      }
    }
  })
}

// 新建虚拟设备分组
export function addGroup(name) {
  return request({
    url: '/group',
    method: 'post',
    data: {
      "devType": 'shuwa_iot_hub',
      "name": name,
      "topo": 'group_topo'
    }
  })
}

// 修改role备注
export function putRole(role_id, alias) {
  return request({
    url: '/classes/_Role/' + role_id,
    method: 'put',
    data: {
      "alias": alias
    }
  })
}

// 删除role
export function delRole(role_id) {
  return request({
    url: '/classes/_Role/' + role_id,
    method: 'DELETE'
  })
}
