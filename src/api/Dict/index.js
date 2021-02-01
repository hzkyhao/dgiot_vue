import { query_object, create_object } from '@/api/shuwa_parse'

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

export async function createBatchNumer(params) {
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
