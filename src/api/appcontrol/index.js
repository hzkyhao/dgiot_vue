import request from '@/utils/request'

export function Addapp(expries,desc,secret)  {
  return request({
    url: '/classes/App',
    method: 'post',
    data:{
        config:{
            expires:expries,  
        },
        desc:desc,
        secret:secret,
    }
  })
}