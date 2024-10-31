<script setup lang="ts">
import { Input, Button, message } from '@packages/components'
import { useUserStore } from '@packages/store'
import { userLogin } from '@packages/api/user/login'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { loadMenu } from '../../utils/menu'

const userStore = useUserStore()
const router = useRouter()
const username = ref<string>('')
const password = ref<string>('')
const loading = ref<boolean>(false)

async function handleLogin() {
  if (!username.value || !password.value) {
    message.error('用户名和密码不能为空')
    return
  }
  try {
    loading.value = true
    const userResp = await userLogin(username.value, password.value)
    if (userResp.result) {
      userStore.login(userResp.result)
      message.success('登录成功')
      if (userStore.menuList.length === 0) {
        await loadMenu(router)
      }
      router.replace('/dashboard/analysis')
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
    <div
      class="w-2/3 text-6xl flex items-center justify-center bg-clip-text text-transparent website-logo"
    >
      QianKun Admin
    </div>
    <div class="flex w-1/3 justify-center items-center h-full bg-white">
      <div class="w-96 flex flex-col items-start justify-center">
        <div class="text-center text-2xl font-bold mb-4 flex items-center text-gray-600">
          <div class="i-tabler:user-screen w-8 h-8 mr-2"></div>
          用户登录
        </div>
        <div class="text-center text-sm mb-5 text-gray-500">请输入账号密码进行登录</div>
        <div>
          <Input
            v-model:value="username"
            type="text"
            class="w-full border border-gray-300 rounded mb-2"
            placeholder="用户名"
          />
          <Input
            v-model:value="password"
            type="password"
            class="w-full border border-gray-300 rounded mb-2"
            placeholder="密码"
          />
        </div>
        <Button
          type="primary"
          class="w-full mt-4"
          :loading="loading"
          @click="handleLogin"
        >
          登录系统</Button
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
.website-logo {
  transition: all 0.2s linear;
  animation: color-change 5s linear infinite;
  background-image: linear-gradient(
    to right,
    #ff8177 0%,
    #ff867a 10%,
    #8ec5fc 20%,
    #ff8c7f 40%,
    #f99185 30%,
    #ffa6b7 40%,
    #e0c3fc 50%,
    #ff8177 70%,
    #8ec5fc 90%,
    #e77aa2 100%
  );
  background-size: 200% 200%;
}
@keyframes color-change {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
