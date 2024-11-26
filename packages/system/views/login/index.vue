<script setup lang="ts">
import { Input, Button, Divider, message } from '@packages/components'
import { useUserStore } from '@packages/store'
import { userLogin } from '@packages/api/user/login'
import { githubLogin, googleLogin } from '@packages/api/oauth/login'
import { useRouter, useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import { loadMenu, unLoadMenu } from '../../utils/menu'
import { ApiResponse, UserLoginRes } from '@packages/types'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const username = ref<string>('')
const password = ref<string>('')
const loading = ref<boolean>(false)
const systemName = (import.meta as any).env.VITE_APP_NAME || 'Micro UI'
async function handleLogin() {
  if (!username.value || !password.value) {
    message.error('用户名和密码不能为空')
    return
  }
  try {
    loading.value = true
    const userResp = await userLogin(username.value, password.value)
    loginSystem(userResp)
  } catch (error: any) {
    message.error(error.message)
  } finally {
    loading.value = false
  }
}

async function loginSystem(userResp: ApiResponse<UserLoginRes>) {
  if (userResp.result) {
    userStore.login(userResp.result)
    message.success('登录成功')
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
}

function useGithubLogin(code: string) {
  loading.value = true
  githubLogin(code)
    .then((resp) => {
      loginSystem(resp)
    })
    .finally(() => {
      loading.value = false
    })
}

function useGoogleLogin(code: string) {
  loading.value = true
  googleLogin(code)
    .then((resp) => {
      loginSystem(resp)
    })
    .finally(() => {
      loading.value = false
    })
}

function handleGithubLogin() {
  const clientId = (import.meta as any).env.VITE_GITHUB_CLIENT_ID
  if (!clientId) {
    message.error('请配置Github登录clientId')
    return
  }
  const backUrl = encodeURIComponent(`${window.location.origin}/login?from=github`)
  window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${backUrl}`
}
function handleGoogleLogin() {
  const clientId = (import.meta as any).env.VITE_GOOGLE_CLIENT_ID
  if (!clientId) {
    message.error('请配置Google登录clientId')
    return
  }
  const stateCode = '3EAB37D9D5310BFE'
  const backUrl = encodeURIComponent(`${window.location.origin}/login?from=google`)
  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/userinfo.profile&state=${stateCode}&include_granted_scopes=true&response_type=code&client_id=${clientId}&redirect_uri=${backUrl}`
}
onMounted(() => {
  if (route.query.from === 'github') {
    message.loading('正在获取github用户信息，请稍等...')
    useGithubLogin(route.query.code as string)
  } else if (route.query.from === 'google') {
    message.loading('正在获取google用户信息，请稍等...')
    useGoogleLogin(route.query.code as string)
  }
  unLoadMenu(router)
})
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
          <div class="text-gray-700 text-3xl text-center mt-10">{{ systemName + '登录' }}</div>
        </div>
      </div>
    </div>
    <div class="flex flex-col flex-grow justify-center items-center h-full bg-white">
      <div class="w-96 flex flex-col items-start justify-center">
        <div
          class="text-center text-2xl font-bold mb-4 flex items-center text-gray-600 justify-center"
        >
          用户登录
        </div>
        <div class="text-center text-sm mb-7 text-gray-500">请输入账号密码进行登录</div>
        <div class="w-full">
          <Input
            v-model:value="username"
            type="text"
            class="w-full border border-gray-300 rounded mb-5 text-gray-500"
            placeholder="用户名"
          >
            <template #prefix>
              <div class="i-tabler:user text-gray-400 w-1em h-1em"></div>
            </template>
          </Input>
          <Input
            v-model:value="password"
            type="password"
            class="w-full border border-gray-300 rounded mb-5 text-gray-500"
            placeholder="密码"
          >
            <template #prefix>
              <div class="i-tabler:lock-password text-gray-400 w-1em h-1em"></div>
            </template>
          </Input>
        </div>
        <Button
          class="w-full mt-4 flex py-4 items-center !border-gray-600 justify-center bg-gray-600 hover:bg-gray-500 hover:outline-none hover:!text-white text-white font-bold"
          :loading="loading"
          @click="handleLogin"
        >
          <div class="i-tabler:login-2 w-4 h-4 mr-2"></div>
          登录系统</Button
        >
        <div class="w-full py-3 text-right">
          <router-link
            to="/register"
            class="text-gray-500"
            >注册账号</router-link
          >
        </div>
      </div>
      <div class="w-96">
        <Divider class="!text-gray-400">第三方登录</Divider>
        <div class="w-full">
          <Button
            class="flex items-center justify-center w-full font-bold hover:bg-blue-50"
            @click="handleGithubLogin"
          >
            <div class="i-tabler:brand-github-filled w-5 h-5 text-gray-500 py-4"></div>
            <span class="text-gray-500 ml-2">Github</span>
          </Button>
          <Button
            class="flex items-center justify-center w-full font-bold hover:bg-blue-50 mt-5"
            @click="handleGoogleLogin"
          >
            <div class="i-tabler:brand-google-filled w-5 h-5 text-gray-500 py-4"></div>
            <span class="text-gray-500 ml-2">Google</span>
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
