import { query_object } from '@/api/shuwa_parse'
export async function queryRole(params) {
  return query_object('_Role', params)
}
