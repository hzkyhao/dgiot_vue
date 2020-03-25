//parse错误返回
import { Message } from 'element-ui'

export  function returnLogin(error){
    if (error.code == "209") {
        Message({
            message:'您权限过期,请重新登录',
            type: 'error',
            duration: 2 * 1000
          })
        sessionStorage.removeItem('roles')
        sessionStorage.removeItem('username')
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('list')
        location.href = '/#/login'
      } else if (error.code == 119) {
        Message({
            message:'没有操作权限',
            type: 'warning',
            duration: 2 * 1000
          })
      }else{
          Message({
              message:error.message,
              type:'error'
          })
      }
   
}