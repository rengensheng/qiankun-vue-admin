import { App } from 'vue'
import { createPinia } from 'pinia'

export * from './user'

export function registerStore(app: App) {
  const pinia = createPinia()
  app.use(pinia)
}
