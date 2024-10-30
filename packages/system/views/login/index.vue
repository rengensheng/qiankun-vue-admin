<script setup lang="ts">
import { Input, Button, message } from '@packages/components'
import { useUserStore } from '@packages/store'
import { userLogin } from '@packages/api/user/login'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const userStore = useUserStore()
const router = useRouter()
const username = ref<string>('')
const password = ref<string>('')

async function handleLogin() {
  if (!username.value || !password.value) {
    message.error('用户名和密码不能为空')
    return
  }
  try {
    const userResp = await userLogin(username.value, password.value)
    if (userResp.result) {
      userStore.login(userResp.result)
      message.success('登录成功')
      router.replace('/')
    } else {
      message.error(userResp.message)
    }
  } catch (error: any) {
    message.error(error.message)
  }
}
</script>

<template>
  <div class="w-screen h-screen bg-white">
    <div class="flex justify-center items-center h-full">
      <div class="w-96">
        <div class="text-center text-2xl font-bold mb-2">用户登录</div>
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
          @click="handleLogin"
          >登录系统</Button
        >
      </div>
    </div>
  </div>
</template>
