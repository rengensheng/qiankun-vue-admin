import { defineStore } from 'pinia'

type SystemStoreState = {
  theme: string
}

type SystemStoreAction = {
  setTheme(theme: string): void
}

export const systemStore = defineStore<string, SystemStoreState, {}, SystemStoreAction>(
  'systemStore',
  {
    state: () => ({
      theme: 'light'
    }),
    actions: {
      setTheme(theme: string) {
        this.theme = theme
      }
    }
  }
)
