import { query_object, create_object, del_object, update_object } from '@/api/shuwa_parse'

export async function queryDict(params) {
  return query_object('Dict', params)
}

export async function getBatchNumer() {
  const params = {
    order: "-createdAt",
    where: {
      type: "batch_number"
    }
  };
  return query_object('Dict', params)
}

export async function create_Dict(params) {
  return create_object('Dict', params)
}

export async function getIndustry(key, limit) {
  const params = {
    limit: limit || 100,
    where: {
      "data.key": key || 'category'
    }
  }
  return query_object('Dict', params)
}

export async function delete_Dict(params) {
  return del_object('Dict', params)
}

export async function update_Dict(params) {
  
  return update_object('Dict', params.id,params)
}