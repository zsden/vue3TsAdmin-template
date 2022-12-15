<template>
  <div @click="login">{{ username }}</div>
</template>

<script lang="ts">
import { storeToRefs } from 'pinia'
import { useUserStore } from '../pinia/user'
export default {
  setup() {
    const userStore = useUserStore()
    const login = () => {
      userStore.login('欧阳')
    }
    const { username } = storeToRefs(userStore)
    return {
      login,
      username: username
    }
  }
}
</script>

<style></style>
