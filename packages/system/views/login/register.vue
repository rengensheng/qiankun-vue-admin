<script setup lang="ts">
import { Input, Button, message } from '@packages/components'
import { useUserStore } from '@packages/store'
import { userRegister } from '@packages/api/user/login'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { loadMenu } from '../../utils/menu'

const userStore = useUserStore()
const router = useRouter()
const username = ref<string>('')
const password = ref<string>('')
const rePassword = ref<string>('')
const nickname = ref<string>('')
const loading = ref<boolean>(false)
const systemName = (import.meta as any).env.VITE_APP_NAME || 'Micro UI'
async function handleRegister() {
  if (password.value !== rePassword.value) {
    message.error('两次输入的密码不一致')
    return
  }
  if (!username.value || !password.value || !rePassword.value || !nickname.value) {
    message.error('用户名、密码、昵称不能为空')
    return
  }
  try {
    loading.value = true
    const userResp = await userRegister(username.value, password.value, nickname.value)
    if (userResp.result) {
      userStore.login(userResp.result)
      message.success('注册成功')
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
    } else {
      message.error(userResp.message)
    }
  } catch (error: any) {
    message.error(error.message)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="w-screen h-screen bg-gray-50 flex">
    <div class="w-3/5 text-6xl flex items-center justify-center text-transparent position-relative">
      <div>
        <div class="w-full mx-auto">
          <img
            src="/bg.svg"
            class="w-120"
          />
          <div class="text-gray-700 text-3xl text-center mt-10">{{ systemName + '注册' }}</div>
        </div>
      </div>
    </div>
    <div class="flex flex-grow justify-center items-center h-full bg-white">
      <div class="w-96 flex flex-col items-start justify-center">
        <div class="text-center text-2xl font-bold mb-4 flex items-center text-gray-600">
          用户注册
        </div>
        <div class="text-center text-sm mb-7 text-gray-500">请输入账号密码进行注册</div>
        <div class="w-full">
          <Input
            v-model:value="username"
            type="text"
            class="w-full border border-gray-300 rounded mb-5"
            placeholder="登录账户名"
          >
            <template #prefix>
              <div class="i-tabler:user text-gray-400 w-1em h-1em"></div>
            </template>
          </Input>
          <Input
            v-model:value="nickname"
            type="text"
            class="w-full border border-gray-300 rounded mb-5"
            placeholder="用户昵称"
          >
            <template #prefix>
              <div class="i-tabler:user-edit text-gray-400 w-1em h-1em"></div>
            </template>
          </Input>
          <Input
            v-model:value="password"
            type="password"
            class="w-full border border-gray-300 rounded mb-5"
            placeholder="密码"
          >
            <template #prefix>
              <div class="i-tabler:lock-password text-gray-400 w-1em h-1em"></div>
            </template>
          </Input>
          <Input
            v-model:value="rePassword"
            type="password"
            class="w-full border border-gray-300 rounded mb-5"
            placeholder="再次输入密码"
          >
            <template #prefix>
              <div class="i-tabler:password-fingerprint text-gray-400 w-1em h-1em"></div>
            </template>
          </Input>
        </div>
        <Button
          type="primary"
          class="w-full mt-4 flex py-4 items-center !border-gray-600 justify-center bg-gray-600 hover:bg-gray-500 hover:outline-none hover:!text-white text-white font-bold"
          :loading="loading"
          @click="handleRegister"
        >
          <div class="i-tabler:user-plus w-4 h-4 mr-2"></div>
          注册账号</Button
        >
        <div class="w-full py-3 text-right">
          <router-link
            to="/login"
            class="text-gray-500"
            >登录系统</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
