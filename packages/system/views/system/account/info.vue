<script setup lang="ts">
import { useUserStore } from '@packages/store'
import { Button, Modal, AvatarUpload, message } from '@packages/components'
import { uploadAvatar } from '@packages/api/user/login'
import { ref } from 'vue'

const userStore = useUserStore()
const showAvatarModal = ref(false)
const imageUpload = ref<typeof AvatarUpload>()
function handleOpenAvatar() {
  showAvatarModal.value = true
}
async function handleSavaAvatar() {
  if (!imageUpload.value) return
  const image = await imageUpload.value?.handleGetImageFile()
  console.log('image', image)
  try {
    await uploadAvatar(image)
    await userStore.updateUserInfo()
    message.success('更改头像成功')
    showAvatarModal.value = false
  } catch (e) {
    message.error('更改头像失败')
  }
}
</script>

<template>
  <div class="px-2 py-3 w-1/2">
    <div class="text-2xl pb-10">用户资料设置</div>
    <div class="flex items-center px-5">
      <div class="w-20 h-20 rounded-full overflow-hidden">
        <img
          v-if="userStore.user?.avatar"
          :src="userStore.user?.avatar"
          class="w-full h-full"
        />
        <img
          v-else
          src="/avatar.png"
          class="w-full h-full"
        />
      </div>
      <Button
        size="small"
        type="primary"
        class="ml-5"
        @click="handleOpenAvatar"
        >修改头像</Button
      >
    </div>
  </div>

  <Modal
    v-model:open="showAvatarModal"
    width="700px"
    title="头像设置"
    @ok="handleSavaAvatar"
  >
    <AvatarUpload
      ref="imageUpload"
      :image-url="userStore.user?.avatar || '/avatar.png'"
    />
  </Modal>
</template>
