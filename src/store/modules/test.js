
const test = {
  state: {
    userId: ''
  },

  mutations: {
    set_User_Id(state, userId) {
      state.userId = userId
    }
  },

  actions: {
    getUserId({ dispatch }, userid) {
      dispatch('setUserId', userid)
    },
    setUserId({ commit }, userid) {
      commit('set_User_Id', userid)
    }
  }
}

export default test
