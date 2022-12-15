<template>
  <div class="nav-header">
    <div class="breadcrumb-con">
      <el-icon @click="handleFoldClick">
        <Icon class="fold" icon="Fold" />
      </el-icon>
      <el-breadcrumb class="breadcrumb" separator="/">
        <el-breadcrumb-item v-for="item in breadcrumb" :key="item.name" :to="{ path: '/' }">
          {{ item.name }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <tabs/>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { menus } from '../../router'
import tabs from './tabs.vue'

export default defineComponent({
  emits: ['foldChange'],
  components: {
    tabs
  },
  setup(props, { emit }) {
    const isFold = ref(false)
    const handleFoldClick = () => {
      isFold.value = !isFold.value
      emit('foldChange', isFold.value)
    }

    const route = useRoute()

    const getBreadcrumb = (path: string, name = '') => {
      let breadcrumb = [
        {
          name: '首页',
          path: '/'
        }
      ]
      if (path == '/') return breadcrumb
      const menu = menus.find((menu) => {
        if (menu.children && menu.children.length > 1) {
          for (const vo of menu.children) {
            if (menu.path + '/' + vo.path == path) {
              return menu
            }
          }
        } else {
          if (menu.path == path) {
            return menu
          }
        }
      })
      if (menu) {
        if (menu.children && menu.children.length > 1) {
          breadcrumb.push({
            name: name,
            path: path
          })
        } else {
          breadcrumb.push({
            name: menu.name,
            path: menu.path
          })
        }
      }
      return breadcrumb
    }

    const breadcrumb = reactive(getBreadcrumb(route.path, route.name?.toString()))

    watch(
      () => route.path,
      (newPath) => {
        let newBreadcrumb = getBreadcrumb(newPath, route.name?.toString())
        breadcrumb.splice(0, breadcrumb.length, ...newBreadcrumb)
      }
    )

    return {
      isFold,
      handleFoldClick,
      breadcrumb
    }
  }
})
</script>

<style scoped lang="scss">
.nav-header {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  .breadcrumb-con {
    display: flex;
    align-items: center;
    margin-top: 10px;
    .fold {
      cursor: pointer;
      width: 1.4em;
      height: 1.4em;
    }
    .breadcrumb {
      padding-left: 20px;
      padding-top: 4px;
    }
  }
}
</style>
