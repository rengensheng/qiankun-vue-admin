import { useUserStore } from '@packages/store'
import { Router } from 'vue-router'
import { registerMenuRouter } from './permission'

export async function loadMenu(router: Router) {
  const userStore = useUserStore()
  userStore.getUserInfo()
  await userStore.loadMenuList()
  const componentList = (import.meta as any).glob('../views/**/*.vue')
  const routes = registerMenuRouter(userStore.menuList, componentList)
  console.log(router)
  if (!router) return
  routes.forEach((item) => {
    router.addRoute(item)
  })
  router.addRoute({
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  })
}
