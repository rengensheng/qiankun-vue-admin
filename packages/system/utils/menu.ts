import { useUserStore } from '@packages/store'
import { Router, RouteRecordNameGeneric } from 'vue-router'
import { registerMenuRouter } from './permission'

const addedRouteNames: RouteRecordNameGeneric[] = []

export async function loadMenu(router: Router) {
  const userStore = useUserStore()
  userStore.getUserInfo()
  await userStore.loadMenuList()
  const componentList = (import.meta as any).glob('../views/**/*.vue')
  const routes = registerMenuRouter(userStore.menuList, componentList)
  if (!router) return
  routes.forEach((item) => {
    router.addRoute(item)
    addedRouteNames.push(item.name)
  })
  router.addRoute({
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  })
  router.afterEach((to) => {
    const title =
      (to.meta && to.meta.title && to.meta.title + '-' + (import.meta as any).env.VITE_APP_NAME) ||
      (import.meta as any).env.VITE_APP_NAME
    document.title = title
  })
}

export function unLoadMenu(router: Router) {
  const userStore = useUserStore()
  userStore.unloadMenu()
  addedRouteNames.forEach((item) => {
    if (item) router.removeRoute(item)
  })
  addedRouteNames.length = 0
}
