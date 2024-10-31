<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useUserStore } from '@packages/store'
import { Route } from '@packages/types'
import { onMounted, onUnmounted, ref } from 'vue'
import { loadMicroApp } from 'qiankun'

const route = useRoute()
const store = useUserStore()
const microApp = ref<any>(null)

async function getMenuListFlatten(): Promise<Route[]> {
  const sourceMenuList = await store.loadMenuList()
  const menuList: Route[] = []
  sourceMenuList.forEach((item) => {
    if (item.children && item.children.length) {
      const childMenus: Route[] = []
      item.children.forEach((child) => {
        childMenus.push({
          ...child,
          path: item.path + '/' + child.path
        })
      })
      menuList.push(...childMenus)
    } else {
      menuList.push(item)
    }
  })

  return menuList
}

onMounted(async () => {
  const menuList = await getMenuListFlatten()
  console.log('route', route)
  menuList.forEach((menu) => {
    if (menu.path === route.fullPath) {
      microApp.value = loadMicroApp(
        {
          name: (route.params.appName as string) || route.fullPath.split('/')[2],
          entry: menu.url || menu.component,
          container: '#sub-app-container',
          props: {
            menu: menu
          }
        },
        {
          // sandbox: { strictStyleIsolation: true },
          getPublicPath(entry: any) {
            console.log('entry', entry)
            return entry.substring(0, entry.lastIndexOf('/') + 1).replace('micro/', '')
          }
        }
      )
    }
  })
})
onUnmounted(() => {
  microApp.value?.unmount()
})
</script>

<template>
  <div id="sub-app-container"></div>
</template>
