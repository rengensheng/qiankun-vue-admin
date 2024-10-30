import { Route } from '@packages/types'
import { RouteRecordRaw } from 'vue-router'

export function registerMenuRouter(
  menuList: Route[],
  componentList: Record<string, () => Promise<any>>
) {
  const routes = menuList
    .filter((item) => !item.component.startsWith('http'))
    .map((menu) => {
      if (menu.children) {
        menu.children = menu.children
          .filter((item) => !item.component.startsWith('http'))
          .map((child) => {
            return {
              ...child,
              component: componentList[`./views/${child.component}`]
            }
          }) as any
      }
      if (menu.component) {
        if (menu.component === 'LAYOUT') {
          return {
            ...menu,
            component: componentList[`./views/layouts/index.vue`],
            children: menu.children
          }
        } else {
          return {
            ...menu,
            component: componentList[`./views/${menu.component}`],
            children: menu.children
          }
        }
      }
    })
  return routes as RouteRecordRaw[]
}
