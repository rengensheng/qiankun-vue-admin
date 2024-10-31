<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { ConfigProvider } from 'ant-design-vue'
import { loadMenu } from './utils/menu'
import zh_CN from 'ant-design-vue/lib/locale/zh_CN'

const router = useRouter()
const route = useRoute()

async function loadData() {
  console.log('route', route.fullPath)
  if (route.fullPath === '/login') {
    console.log('login')
    return
  }
  if (!localStorage.getItem('token')) {
    router.replace('/login')
    return
  }
  await loadMenu(router)
  if (route.fullPath === '/') {
    return
  }
  console.log('这里了', route.fullPath)
  router.replace(route.fullPath)
}
loadData()
</script>

<template>
  <ConfigProvider :locale="zh_CN">
    <router-view />
  </ConfigProvider>
</template>
