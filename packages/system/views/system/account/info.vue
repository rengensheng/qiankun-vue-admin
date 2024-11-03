<script setup lang="ts">
import { useUserStore } from '@packages/store'
import { Button, Modal, AvatarUpload, message, Input } from '@packages/components'
import { uploadAvatar, changeUserInfo } from '@packages/api/user/login'
import { onMounted, ref } from 'vue'

const userStore = useUserStore()
const showAvatarModal = ref(false)
const nickName = ref(userStore.user?.realName)
const email = ref(userStore.user?.email)
const phone = ref(userStore.user?.phone)
const imageUpload = ref<typeof AvatarUpload>()
function handleOpenAvatar() {
  showAvatarModal.value = true
}
async function handleSavaAvatar() {
  if (!imageUpload.value) return
  const image = await imageUpload.value?.handleGetImageFile()
  try {
    await uploadAvatar(image)
    await userStore.updateUserInfo()
    message.success('更改头像成功')
    showAvatarModal.value = false
  } catch (e) {
    message.error('更改头像失败')
  }
}
async function handleSaveUserInfo() {
  console.log('nickName', nickName.value)
  console.log('email', email.value)
  if (!nickName.value || !email.value) {
    message.error('用户昵称和邮箱不能为空')
    return
  }
  try {
    await changeUserInfo(nickName.value, email.value, phone.value)
    await userStore.updateUserInfo()
    message.success('更改资料成功')
  } catch (e) {
    message.error('更改资料失败')
  }
}
onMounted(async () => {
  await userStore.updateUserInfo()
  nickName.value = userStore.user?.realName
  email.value = userStore.user?.email
  phone.value = userStore.user?.phone
})
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
    <div class="ml-3">
      <div class="flex items-center mt-10">
        <div class="mr-2">用户昵称:</div>
        <div>
          <Input
            v-model:value="nickName"
            placeholder="请输入用户昵称"
          />
        </div>
      </div>
      <div class="flex items-center mt-2">
        <div class="mr-2">用户邮箱:</div>
        <div>
          <Input
            v-model:value="email"
            placeholder="请输入用户邮箱"
          />
        </div>
      </div>
      <div class="flex items-center mt-2">
        <div class="mr-2">联系方式:</div>
        <div>
          <Input
            v-model:value="phone"
            placeholder="请输入联系方式"
          />
        </div>
      </div>
      <div class="mt-5">
        <Button
          type="primary"
          @click="handleSaveUserInfo"
          >保存资料</Button
        >
      </div>
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
