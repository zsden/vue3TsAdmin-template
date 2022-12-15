<template>
  <div class="tabs">
    <scroll-pane class="scroll-container" :noresize="false" :always="true">
      <router-link
        v-for="tab in visitedViews"
        ref="tag"
        :key="tab.path"
        class="tabs-item"
        :class="isActive(tab) ? 'active' : ''"
        :to="{ path: tab.path, query: tab.query }"
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
import { useRoute, useRouter } from 'vue-router'
import { tabView, delType, useTabsStore } from '../../pinia/tabs'
import { storeToRefs } from 'pinia'

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
    const tabsStore = useTabsStore()
    const route = useRoute()
    const router = useRouter()

    //tab部分
    const isActive = (tab: { path: string }) => {
      return tab.path === route.path
    }

    const isActiveCd = computed(() => {
      return isActive
    })

    const isAffix = (tab: tabView) => {
      return tab.meta && tab.meta.affix
    }

    const isAffixCd = computed(() => {
      return isAffix
    })

    const addTab = () => {
      if (route.name) {
        tabsStore.addView(route)
      }
    }

    const closeTabs = (tab: tabView) => {
      tabsStore.delView(tab, delType.self).then(({ visitedViews }) => {
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
      () => {
        addTab()
      }
    )

    //右键菜单部分
    const top = ref(0)
    const left = ref(0)
    const selectedTab = ref({} as tabView)

    const openMenu = (tab: tabView, e: { clientX: number; offsetY: number }) => {
      // 计算偏移量
      // 由于left 根据父元素进行偏移。
      // 所以 left = 鼠标在窗口的x坐标 - 侧边栏宽度     15为菜单离鼠标一段距离
      left.value = e.clientX - 210 + 15 // 15: margin right
      top.value = e.offsetY
      visible.value = true
      tab.meta = {
        ...tab.meta,
        affix: tab.meta.affix || false
      }
      selectedTab.value = tab
    }

    const menu = (select: string) => {
      switch (select) {
        case 'refresh':
          tabsStore.delCachedView(selectedTab.value).then(() => {
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
          tabsStore.delView(selectedTab.value, delType.other).then(() => {
            if (!isActive(selectedTab.value)) router.push(selectedTab.value.fullPath)
          })
          break
        case 'all':
          tabsStore.delView(selectedTab.value, delType.all).then(() => {
            router.push('/')
          })
          break
      }
      // 隐藏菜单
      visible.value = false
    }

    const { visitedViews } = storeToRefs(tabsStore)
    return {
      visitedViews: visitedViews,
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
