import { createRouter, createWebHashHistory, RouteLocationNormalized } from 'vue-router'
import type { RouteComponent, _RouteRecordBase } from 'vue-router'
import localCache from '../utils/cache'
import { reactive } from 'vue'

import layout from '../components/layout/index.vue'

declare type Lazy<T> = () => Promise<T>
export declare interface routerPath extends _RouteRecordBase {
  id: number
  name: string
  icon: string
  hidden?: boolean
  component: RouteComponent | Lazy<RouteComponent>
  // components?: never
  // props?: Record<string, boolean | Record<string, any> | ((to: RouteLocationNormalized) => Record<string, any>)> | boolean
}

export const routes: routerPath[] = [
  {
    id: 0,
    icon: 'Fold',
    path: '/',
    name: '首页',
    component: layout,
    meta: {
      affix: true
    },
    children: [
      {
        path: '/',
        name: '首页',
        component: () => import('../views/index.vue')
      }
    ]
  },
  {
    id: 1,
    icon: 'Link',
    path: '/login',
    name: '登录',
    hidden: true,
    component: layout
  },
  {
    id: 2,
    icon: 'PieChart',
    path: '/chart',
    name: '统计',
    component: layout,
    children: [
      {
        path: 'page1',
        name: '测试1',
        component: () => import('../views/chart/page1.vue')
      },
      {
        path: 'page2',
        name: '测试2',
        component: () => import('../views/chart/page2.vue')
      },
      {
        path: 'page3',
        name: '测试3',
        component: () => import('../views/chart/page3.vue')
      }
    ]
  }
]

export let menus = reactive(routes)

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export function resetRouter() {
  /**
   * newRoutes 要替换的路由
   */
  const newRoutes: routerPath[] = [
    {
      id: 0,
      icon: 'Fold',
      path: '/',
      name: '首页',
      component: layout,
      children: [
        {
          path: '/',
          component: () => import('../views/index.vue')
        }
      ]
    },
    {
      id: 1,
      icon: 'Link',
      path: '/login',
      name: '登录',
      hidden: true,
      component: layout,
      children: [
        {
          path: '/login',
          component: () => import('../views/login.vue')
        }
      ]
    },
    {
      id: 2,
      icon: 'PieChart',
      path: '/chart',
      name: '统计',
      component: layout,
      children: [
        {
          path: 'page1',
          name: '测试1',
          component: () => import('../views/login.vue')
        },
        {
          path: 'page2',
          name: '测试2',
          component: () => import('../views/login.vue')
        },
        {
          path: 'page3',
          name: '测试3',
          component: () => import('../views/login.vue')
        }
      ]
    }
  ]

  /**
   * 触发nav的响应式更新
   */
  menus.splice(0, menus.length, ...newRoutes)

  /**
   * 添加路由
   */
  for (const item of newRoutes) {
    let oldRouer = routes.findIndex((vo) => {
      return vo.path == item.path
    })
    if (oldRouer === -1) {
      router.addRoute(item)
    }
  }
}

router.beforeEach((to) => {
  if (to.path !== '/login') {
    const token = localCache.getCache('token')
    // if (!token) {
    //   return '/login'
    // }
  }
})

export default router
