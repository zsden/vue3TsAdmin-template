<template>
  <div @click="login">{{ count }}</div>
</template>

<script lang="ts">
import { useStore } from 'vuex'
import { computed } from 'vue'
export default {
  setup() {
    const store = useStore()
    const login = () => {
      store.dispatch('login')
    }
    return {
      login,
      count: computed(() => store.state.user.username)
    }
  }
}
</script>

<style></style>
