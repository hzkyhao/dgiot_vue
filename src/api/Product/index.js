import { query_object } from '@/api/shuwa_parse'
export async function queryProduct(params) {
  return query_object('Product', params)
}

