<template>
  <div class="nav-menu">
    <div class="logo" @click="test">
      <img class="img" src="../../assets/img/logo.svg" alt="logo" />
      <span v-if="!collapse" class="title">Vue3+TS</span>
    </div>
    <el-menu
      :default-active="menuActive"
      class="el-menu-vertical"
      :collapse="collapse"
      background-color="#0c2135"
      text-color="#b7bdc3"
      active-text-color="#0a60bd"
    >
      <template v-for="item in menus" :key="item.path">
        <template v-if="!item.hidden">
          <template v-if="item.children && item.children.length > 1">
            <el-sub-menu :index="item.path">
              <template #title>
                <el-icon v-if="item.icon"> <Icon :icon="item.icon" /></el-icon>
                <span>{{ item.name }}</span>
              </template>
              <el-menu-item
                v-for="vo in item.children"
                :key="vo.path"
                :index="item.path + '/' + vo.path"
                @click="goRouter(item.path + '/' + vo.path)"
                >{{ vo.name }}</el-menu-item
              >
              <!-- <el-sub-menu index="1-4">
                <template #title><span>item four</span></template>
                <el-menu-item index="1-4-1">item one</el-menu-item>
              </el-sub-menu> -->
            </el-sub-menu>
          </template>
          <template v-else>
            <el-menu-item :index="item.path" @click="goRouter(item.path)">
              <el-icon v-if="item.icon"> <Icon :icon="item.icon" /></el-icon>
              <span>{{ item.name }}</span>
            </el-menu-item>
          </template>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { menus, resetRouter } from '../../router/index'
// import { useStore } from '@/store'

// vuex - typescript  => pinia

export default defineComponent({
  props: {
    collapse: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const menuActive = ref('')

    menuActive.value = route.path

    watch(
      () => route.path,
      (newPath) => {
        menuActive.value = newPath
      }
    )

    const goRouter = (path: string) => {
      router.push(path)
    }

    const test = function () {
      resetRouter()
    }

    return {
      menuActive,
      menus,
      goRouter,
      test
    }
  }
})
</script>

<style scoped lang="scss">
.nav-menu {
  height: 100%;
  background-color: #001529;

  .logo {
    display: flex;
    height: 28px;
    padding: 12px 10px 8px 10px;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    .img {
      height: 100%;
      margin: 0 10px;
    }

    .title {
      font-size: 16px;
      font-weight: 700;
      color: white;
    }
  }

  .el-menu {
    border-right: none;
  }

  // 目录
  .el-submenu {
    background-color: #001529 !important;
    // 二级菜单 ( 默认背景 )
    .el-menu-item {
      padding-left: 50px !important;
      background-color: #0c2135 !important;
    }
  }

  ::v-deep(.el-submenu__title) {
    background-color: #001529 !important;
  }

  // hover 高亮
  .el-menu-item:hover {
    color: #fff !important; // 菜单
  }

  .el-menu-item.is-active {
    color: #fff !important;
    background-color: #0a60bd !important;
  }
}

.el-menu-vertical:not(.el-menu--collapse) {
  width: 100%;
  height: calc(100% - 48px);
}
</style>
