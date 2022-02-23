import { context } from './vuex'

const state = {
  visitedViews: [], //标签组
  cachedViews: [] // 需要缓存的标签组，根据这个数组，确定是否缓存页面，暂时没用到
}

const mutations = {
  ADD_VISITED_VIEW(state: { visitedViews: any[] }, view: { path: any; meta: { title: any } }) {
    // 如果标签跳转的路由存在就不添加
    // 名字不同，路径相同的。也加入标签组
    if (state.visitedViews.some((v) => v.path === view.path)) return
    state.visitedViews.push(
      Object.assign({}, view, {
        title: view.meta.title || 'no-name'
      })
    )
  },
  ADD_CACHED_VIEW(state: { cachedViews: any[] }, view: { name: any; meta: { noCache: any } }) {
    // 已存在缓存就不缓存了
    if (state.cachedViews.includes(view.name)) return
    if (!view.meta.noCache) {
      state.cachedViews.push(view.name)
    }
  },
  DEL_VISITED_VIEW(state: { visitedViews: any[] }, view: { path: any }) {
    for (const [i, v] of state.visitedViews.entries()) {
      if (v.path === view.path) {
        state.visitedViews.splice(i, 1)
      }
    }
  },
  DEL_CACHED_VIEW(state: { cachedViews: any[] }, view: { name: any }) {
    const index = state.cachedViews.indexOf(view.name)
    index > -1 && state.cachedViews.splice(index, 1)
  }
}

const actions = {
  addView({ commit }: context, view: any) {
    commit('ADD_VISITED_VIEW', view)
    commit('ADD_CACHED_VIEW', view)
  },
  delView({ commit, state }: context, view: any) {
    return new Promise((resolve) => {
      commit('DEL_VISITED_VIEW', view)
      commit('DEL_CACHED_VIEW', view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  }
}

const tabs = {
  namespaced: true,
  state,
  mutations,
  actions
}

export default tabs
