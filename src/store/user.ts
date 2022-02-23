import { context } from './vuex'
const state = {
  username: '1'
}

const user = {
  state: state,
  mutations: {
    username(state: { username: string }, payload: { username: string }) {
      state.username = payload.username
    }
  },
  actions: {
    login({ commit }: context) {
      commit({
        type: 'username',
        username: '欧阳'
      })
    }
  },
  getters: {}
}

export default user
