import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/index.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/login/register.vue')
  },
  {
    path: '/',
    name: 'BaseLayout',
    component: () => import('../views/layouts/define.vue'),
    children: [
      {
        path: '/micro/:appName/:name',
        name: 'MicroChild',
        component: () => import('../views/micro/index.vue')
      },
      {
        path: '/404',
        name: 'NotFound',
        meta: {
          title: 'Page not found',
          isLogin: false
        },
        component: () => import('../views/common/notFound.vue')
      },
      {
        path: '/account/info',
        name: 'userInfo',
        meta: {
          title: '用户资料设置',
          isLogin: false
        },
        component: () => import('../views/system/account/info.vue')
      }
    ]
  }
]
const router = createRouter({
  history: createWebHistory(),
  routes
})
export default router
