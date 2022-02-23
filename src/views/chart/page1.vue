<template>
  <div class="con" :style="{ background: bg }" @click="changeBg">page1</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const bg = ref('red')
const changeBg = () => {
  bg.value = 'blue'
}
</script>

<style lang="scss">
.con {
  width: 100%;
  height: 100%;
}
</style>
