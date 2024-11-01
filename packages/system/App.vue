<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { ConfigProvider } from 'ant-design-vue'
import { loadMenu } from './utils/menu'
import zh_CN from 'ant-design-vue/lib/locale/zh_CN'

const router = useRouter()
const route = useRoute()

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
}
loadData()
</script>

<template>
  <ConfigProvider :locale="zh_CN">
    <router-view />
  </ConfigProvider>
</template>
