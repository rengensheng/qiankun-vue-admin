<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@packages/store'
import { Route } from '@packages/types'
import { onMounted, onUnmounted, ref } from 'vue'
import { loadMicroApp } from 'qiankun'

const route = useRoute()
const router = useRouter()
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

function getMicroAppPath(url: string) {
  if (process.env.NODE_ENV === 'development') {
    return url
  }
  return window.origin + url.replace(/http:\/\/.*?:\d*?\//, '/')
}

onMounted(async () => {
  const menuList = await getMenuListFlatten()
  menuList.forEach((menu) => {
    if (menu.path === route.fullPath) {
      const container = document.createElement('div')
      microApp.value = loadMicroApp(
        {
          name: (route.params.appName as string) || route.fullPath.split('/')[2],
          entry: getMicroAppPath(menu.url || menu.component),
          container,
          props: {
            menu: menu,
            user: store.user
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
      document.getElementById('sub-app-container')?.appendChild(container)
    }
  })
  try {
    await microApp.value.loadPromise
  } catch (e) {
    console.log('加载失败', e)
    router.replace('/404')
  }
})
onUnmounted(async () => {
  console.log(microApp.value)
  microApp.value?.unmount()
})
</script>

<template>
  <div id="sub-app-container"></div>
</template>
