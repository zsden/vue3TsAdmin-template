import { defineStore } from 'pinia'
import { RouteRecordName, RouteLocationNormalized } from 'vue-router'

export interface tabView extends RouteLocationNormalized {
  meta: {
    affix?: boolean
    title?: string
    noCache?: boolean
  }
}

export enum delType {
  self = 0,
  other = 1,
  all = 2
}

export const useTabsStore = defineStore('tabs', {
  state: () => {
    let visitedViews: Array<tabView> = []
    let cachedViews: Array<RouteRecordName> = []
    return {
      visitedViews: visitedViews,
      cachedViews: cachedViews
    }
  },
  actions: {
    addVisitedView(view: tabView) {
      if (this.visitedViews.some((v) => v.path === view.path)) return
      this.visitedViews.push({
        ...view,
        name: view.name || '',
        path: view.path
      })
    },
    addCachedView(view: tabView) {
      if (!view.name || this.cachedViews.includes(view.name)) return
      if (view.meta && !view.meta.noCache) {
        this.cachedViews.push(view.name)
      }
    },
    addView(view: tabView) {
      this.addVisitedView(view)
      this.addCachedView(view)
    },
    delVisitedView(view: { path: string }) {
      return new Promise((resolve) => {
        for (const [i, v] of this.visitedViews.entries()) {
          if (v.path === view.path) {
            this.visitedViews.splice(i, 1)
          }
        }
        resolve('ok')
      })
    },
    delCachedView(view: { name: tabView['name'] }) {
      return new Promise((resolve) => {
        if (view.name) {
          const index = this.cachedViews.indexOf(view.name)
          index > -1 && this.cachedViews.splice(index, 1)
        }
        resolve('ok')
      })
    },
    delView(
      view: tabView,
      type: number
    ): Promise<{
      visitedViews: Array<tabView>
      cachedViews: Array<RouteRecordName>
    }> {
      return new Promise(async (resolve) => {
        const visitedViews = [...this.visitedViews]
        switch (type) {
          case delType.self:
            await this.delVisitedView(view)
            if (view.name) {
              await this.delCachedView(view)
            }
            break
          case delType.other:
            for (const v of visitedViews) {
              console.log(v.path, view.path)

              if (v.path !== view.path) {
                await this.delVisitedView(v)
                await this.delCachedView(v)
              }
            }
            break
          case delType.all:
            for (const v of visitedViews) {
              await this.delVisitedView(v)
              await this.delCachedView(v)
            }
            break

          default:
            break
        }
        resolve({
          visitedViews: [...this.visitedViews],
          cachedViews: [...this.cachedViews]
        })
      })
    }
  }
})
