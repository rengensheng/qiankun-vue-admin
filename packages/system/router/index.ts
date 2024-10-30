import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/index.vue')
  },
  {
    path: '/',
    name: 'BaseLayout',
    component: () => import('../views/layouts/index.vue'),
    children: [{
      path: '/micro/:name',
      name: 'MicroChild',
      component: () => import('../views/micro/index.vue')
    }]
  }
]
const router = createRouter({
  history: createWebHistory(),
  routes
})
export default router