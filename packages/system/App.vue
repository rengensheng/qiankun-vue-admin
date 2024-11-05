<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { ConfigProvider } from 'ant-design-vue'
import { useUserStore } from '@packages/store'
import { loadMenu } from './utils/menu'
import zh_CN from 'ant-design-vue/lib/locale/zh_CN'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

async function loadData() {
  await router.isReady()
  if (route.fullPath === '/login') {
    return
  }
  if (!localStorage.getItem('token')) {
    router.replace('/login')
    return
  }
  await loadMenu(router)
  router.replace(route.fullPath)
  if (route.fullPath === '/') {
    if (userStore.menuList.length === 0) {
      await loadMenu(router)
    }
    if (userStore.menuList.length > 0) {
      if (userStore.menuList[0].children?.length) {
        router.replace(userStore.menuList[0].children![0].fullPath)
      } else {
        router.replace(userStore.menuList[0].fullPath)
      }
    } else {
      router.replace('/dashboard/analysis')
    }
  }
}
loadData()
</script>

<template>
  <ConfigProvider :locale="zh_CN">
    <router-view />
  </ConfigProvider>
</template>
