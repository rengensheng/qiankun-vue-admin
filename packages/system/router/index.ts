import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/UserLogin.vue')
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/BaseLayout.vue')
  },
]
const router = createRouter({
  history: createWebHistory(),
  routes
})
export default router