import { createStore } from 'vuex'
import user from './user'
import tabs from './tabs'

const store = createStore({
  modules: {
    user,
    tabs
  }
})

export default store
