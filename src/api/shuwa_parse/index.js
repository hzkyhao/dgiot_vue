import request from '@/utils/request'

/**
 * 数蛙全局通用接口方法 查询
 * @param {*} tabclass  表名 必传 不可为空
 * @param {*} params    对应参数 必传  可为{}
 */
export async function query_object(tabclass, params) {
  return request({
    url: `iotapi/classes/${tabclass}`,
    method: "get",
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json'
    },
    params
  });
}

/**
 * 数蛙全局通用接口方法 查询单条数据
 * @param {*} tabclass  表名 必传 不可为空
 * @param {*} ObjectId   对应查询id 必传
 */
export async function get_object(tabclass, ObjectId) {
  return request({
    url: `iotapi/classes/${tabclass}/${ObjectId}`,
    method: "get",
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });
}


/**
 * 数蛙全局通用接口方法 删除单条数据
 * @param {*} tabclass  表名 必传 不可为空
 * @param {*} ObjectId   对应查询id 必传
 */

export async function del_object(tabclass, ObjectId) {
  return request({
    url: `iotapi/classes/${tabclass}/${ObjectId}`,
    method: "DELETE",
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });
}


/**
 * 数蛙全局通用接口方法 更新单条数据
 * @param {*} tabclass  表名 必传 不可为空
 * @param {*} ObjectId   对应查询id 必传
 * @param {*} data 更新的参数 必传
 */
export async function update_object(tabclass, ObjectId, data) {
  return request({
    url: `iotapi/classes/${tabclass}/${ObjectId}`,
    method: "PUT",
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json'
    },
    data
  });
}

/**
 * 数蛙全局通用接口方法 创建对象
 * @param {*} tabclass  表名 必传 不可为空
 * @param {*} data   创建对象相关参数
 */

export async function create_object(tabclass, data) {
  return request({
    url: `iotapi/classes/${tabclass}`,
    method: "POST",
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json'
    },
    data
  });
}
