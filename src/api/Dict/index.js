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

