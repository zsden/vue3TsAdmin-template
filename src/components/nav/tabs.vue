<template>
  <div class="tabs">
    <scroll-pane class="scroll-container" :noresize="false" :always="true">
      <router-link
        v-for="tab in visitedViews"
        ref="tag"
        :key="tab.path"
        class="tabs-item"
        :class="isActive(tab) ? 'active' : ''"
        :to="{ path: tab.path, query: tab.query, fullPath: tab.fullPath }"
        tag="span"
        @contextmenu.prevent="openMenu(tab, $event)"
      >
        {{ tab.name }}
        <el-icon v-if="!isAffix(tab)" @click.prevent="closeTabs(tab)">
          <Icon icon="Close" />
        </el-icon>
      </router-link>
    </scroll-pane>
    <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
      <li @click.prevent="menu('refresh')">刷新</li>
      <li v-if="!isAffix(selectedTab)" @click.prevent="menu('close')">关闭</li>
      <li @click.prevent="menu('other')">关闭其他</li>
      <li @click.prevent="menu('all')">全部关闭</li>
    </ul>
  </div>
</template>

<script lang="ts">
import scrollPane from './scrollPane.vue'
import { computed, defineComponent, watch, onMounted, ref, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'

const visible = ref(false)

export const closeMenu = () => {
  if (visible.value) visible.value = false
}

export default defineComponent({
  name: 'Tabs',
  components: {
    scrollPane
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()

    //tab部分
    const isActive = (tab: { path: string }) => {
      return tab.path === route.path
    }

    const isActiveCd = computed(() => {
      return isActive
    })

    const isAffix = (tab: { meta: { affix: boolean } }) => {
      return tab.meta && tab.meta.affix
    }

    const isAffixCd = computed(() => {
      return isAffix
    })

    const addTab = () => {
      const { name } = route
      // 已存在的标签就不更新tabs状态
      // 就是点击过的菜单，在点击不触发行为
      if (name) {
        store.dispatch('tabs/addView', route)
      }

      return false
    }

    const closeTabs = (tab: any) => {
      console.log(tab);
      
      store.dispatch('tabs/delView', tab).then(({ visitedViews }) => {
        // 如果删除的是当前页面，则跳转去下一个页面
        if (tab.path === route.path) {
          if (visitedViews.length) {
            // 跳转到最后一个标签
            const lastTab = visitedViews[visitedViews.length - 1]
            router.push(lastTab.fullPath)
          } else {
            // 如果没有标签了，则跳去首页
            router.push('/')
          }
        }
      })
    }

    onMounted(() => {
      addTab()
    })

    watch(
      () => route.path,
      (newPath) => {
        addTab()
      }
    )

    //右键菜单部分
    const top = ref(0)
    const left = ref(0)
    const selectedTab = ref({
      path: '',
      fullPath: '',
      meta: {
        affix: false
      }
    })

    const openMenu = (tab: { path: string; fullPath: string; meta: { affix: boolean } }, e: { clientX: number; offsetY: number }) => {
      // 计算偏移量
      // $el = Tabs.vue 这个Dom
      // getBoundingClientRect().left 获取tabs 距离窗口左边距离。
      // 由于left 根据父元素进行偏移。
      // 所以 left = 鼠标在窗口的x坐标 - 侧边栏宽度     15为菜单离鼠标一段距离
      left.value = e.clientX - 210 + 15 // 15: margin right
      // // top 由于不用适配，所以采用 鼠标在当前元素的相对位置
      top.value = e.offsetY
      // // 显示菜单
      visible.value = true
      // // 功能操作的tab。
      selectedTab.value = tab
    }

    const menu = (select: string) => {
      switch (select) {
        case 'refresh':
          // 清除该页面缓存，在跳转该路由 达到刷新效果。
          store.dispatch('tabs/delCachedView', selectedTab).then(() => {
            const { fullPath } = selectedTab.value
            nextTick(() => {
              const { query } = route
              router.replace({ path: fullPath, query })
            })
          })
          break
        case 'close':
          closeTabs(selectedTab.value)
          break
        case 'other':
          store.dispatch('tabs/delOtherView', selectedTab.value).then(() => {
            // 不是当前激活，删除其他后，跳转到该页面
            if (!isActive(selectedTab.value)) router.push(selectedTab.value.fullPath)
          })
          break
        case 'all':
          store.dispatch('tabs/delAllView').then(() => {
            router.push('/')
          })
          break
      }
      // 隐藏菜单
      visible.value = false
    }

    return {
      visitedViews: computed(() => store.state.tabs.visitedViews),
      isActive: isActiveCd,
      isAffix: isAffixCd,
      closeTabs,
      openMenu,
      closeMenu,
      visible,
      top,
      left,
      selectedTab,
      menu
    }
  }
})
</script>
<style lang="scss">
.tabs {
  position: relative;
  width: 100%;
  background: #fff;
  .tabs-item {
    display: inline-block;
    position: relative;
    cursor: pointer;
    height: 30px;
    line-height: 30px;
    border: 1px solid #d8dce5;
    color: #495060;
    background: #fff;
    padding: 0 8px;
    font-size: 12px;
    margin-right: 6px;
    text-decoration: none;
    &:last-of-type {
      margin-right: 15px;
    }
    &.active {
      background-color: #42b983;
      color: #fff;
      border-color: #42b983;
      &::before {
        content: '';
        background: #fff;
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        position: relative;
        margin-right: 2px;
      }
    }
  }
}
.contextmenu {
  margin: 0;
  background: #fff;
  z-index: 99;
  position: absolute;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #333;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
  width: 100px;
  li {
    margin: 0;
    padding: 7px 16px;
    cursor: pointer;
    &:hover {
      background: #eee;
    }
  }
}
</style>
