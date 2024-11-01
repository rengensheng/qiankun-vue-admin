import { Route } from '@packages/types'
import { RouteRecordRaw } from 'vue-router'

export function registerMenuRouter(
  menuList: Route[],
  componentList: Record<string, () => Promise<any>>
) {
  const routes = menuList
    .filter((item) => typeof item.component === 'string' && !item.component.startsWith('http'))
    .map((menu) => {
      if (menu.children) {
        menu.children = (
          menu.children
            .filter(
              (item) => typeof item.component === 'string' && !item.component.startsWith('http')
            )
            .map((child) => {
              return {
                ...child,
                component: componentList[`../views/${child.component}`]
              }
            }) as any
        ).concat(
          menu.children
            .filter(
              (item) => typeof item.component === 'string' && item.component.startsWith('http')
            )
            .map((child) => {
              return {
                ...child,
                url: child.component,
                component: () => import(`../views/micro/index.vue`)
              }
            })
        )
      }
      if (menu.component) {
        if (menu.component === 'LAYOUT') {
          return {
            ...menu,
            component: componentList[`../views/layouts/index.vue`],
            children: menu.children
          }
        } else if (menu.component === 'DEFINE') {
          return {
            ...menu,
            component: componentList[`../views/layouts/define.vue`],
            children: menu.children
          }
        } else {
          return {
            ...menu,
            component: componentList[`../views/${menu.component}`],
            children: menu.children
          }
        }
      }
    })
  return routes as RouteRecordRaw[]
}
