import { login, logoutBtn } from '@/api/User/index'
import { getToken, setToken, removeToken } from '@/utils/auth'
import Cookies from 'js-cookie'
const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    departmentObj: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    set_DeptObj: (state, obj) => {
      state.departmentObj = obj
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
      Cookies.set('roles', roles)
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          const data = response.data
          setToken(data.token)
          commit('SET_TOKEN', data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    setRoles({ commit }, roles) {
      commit('SET_ROLES', roles)
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logoutBtn(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
