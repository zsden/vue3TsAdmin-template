<template>
  <el-scrollbar ref="scrollbar" class="scroll-container" :noresize="false" :always="true">
    <slot />
  </el-scrollbar>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
export default defineComponent({
  setup() {
    const route = useRoute()
    const scrollbar = ref(null)
    const update = () => {
      if (scrollbar.value) {
        // @ts-ignore
        scrollbar.value.update()
      }
    }
    watch(
      () => route.path,
      (newPath) => {
        update()
      }
    )
    return { scrollbar }
  }
})
</script>
<style lang="scss" scoped>
.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 40px;
  ::v-deep {
    .el-scrollbar__bar {
      bottom: 0px;
    }
    .el-scrollbar__view {
      display: flex;
    }
  }
}
</style>
