<script setup lang="ts">
import { useUserStore } from '@packages/store'
import { useRouter, useRoute } from 'vue-router'
import { registerMenuRouter } from './utils/permission'
import { ConfigProvider } from 'ant-design-vue'
import zh_CN from 'ant-design-vue/lib/locale/zh_CN'

const router = useRouter()
const route = useRoute()

const userStore = useUserStore()
userStore.getUserInfo()

async function loadData() {
  await userStore.loadMenuList()
  const componentList = (import.meta as any).glob('./views/**/*.vue')
  const routes = registerMenuRouter(userStore.menuList, componentList)
  routes.forEach((item) => {
    router.addRoute(item)
  })
  if (route.fullPath === '/') {
    return
  }
  router.replace(route.fullPath)
}
loadData()
</script>

<template>
  <ConfigProvider :locale="zh_CN">
    <router-view />
  </ConfigProvider>
</template>
