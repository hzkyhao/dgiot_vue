import request from '@/utils/request'

export function resourceTypes() {
  return request({
    url: 'iotapi/resource_types',
    method: 'get',
    params: {}
  })
}
export function addRule(actions, ctx, description, rawsql) {
  return request({
    url: 'iotapi/rules',
    method: 'post',
    data: {
      actions: actions,
      ctx: ctx,
      description: description,
      rawsql: rawsql
    }
  })
}
export function getRule() {
  return request({
    url: 'iotapi/rules',
    method: 'get',
    params: {}
  })
}
export function getRuleDetail(id) {
  return request({
    url: 'iotapi/rule/' + id,
    method: 'get',
    params: {}
  })
}
export function ruleDelete(id) {
  return request({
    url: 'iotapi/rule/' + id,
    method: 'delete',
    params: {}
  })
}
export function getActions() {
  return request({
    url: 'iotapi/rule_actions',
    method: 'get',
    params: {

    }
  })
}
export function getResource() {
  return request({
    url: 'iotapi/rule_resource',
    method: 'get',
    params: {

    }
  })
}
export function postResource(config, description, name, type) {
  return request({
    url: 'iotapi/rule_resource',
    method: 'post',
    data: {
      config: config,
      description: description,
      name: name,
      type: type
    }
  })
}
export function ruleTest(actions, ctx, description, forname, name, rawsql) {
  return request({
    url: 'iotapi/rule_test',
    method: 'post',
    data: {
      actions: actions,
      ctx: ctx,
      description: description,
      for: forname,
      name: name,
      rawsql: rawsql
    }
  })
}
