import router from './router'
import type { App } from 'vue'
import { Router } from 'vue-router'

export function registerRouter(app: App): Router {
  app.use(router)
  return router
}
