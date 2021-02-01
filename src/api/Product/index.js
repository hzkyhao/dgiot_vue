import { query_object } from '@/api/shuwa_parse'
export async function queryProducts(params) {
  return query_object('Product', params)
}

