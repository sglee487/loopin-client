import { defineStore } from 'pinia'

interface State {
  accessToken: string | undefined;
  refreshToken: string | undefined;
  // 다른 상태 정의
}


export const useUserStore = defineStore('user', {
  state: (): State => ({
    accessToken: undefined,
    refreshToken: undefined,
    // ...
  }),
  actions: {
    testAction() {
    },
    async login() {
      console.log('login');
    }
  },
  persist: true,
})