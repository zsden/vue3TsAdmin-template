import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      username: '1'
    }
  },
  actions: {
    login(username: string) {
      this.username = username
    }
  }
})
