<script setup lang="ts">
import { changePassword } from '@packages/api/user/login'
import { UseForm, Button, message } from '@packages/components'
import { useForm } from '@packages/hooks'
import { FormOption } from '@packages/types'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const editRow = ref<any>({})
const loading = ref<boolean>(false)
const router = useRouter()
const formOptions: FormOption[] = [
  {
    field: 'oldPassword',
    name: '旧密码',
    type: 'password',
    required: true
  },
  {
    field: 'newPassword',
    name: '新密码',
    type: 'password',
    required: true
  },
  {
    field: 'renewPassword',
    name: '再次输入',
    type: 'password',
    required: true
  }
]
const { register, getFormValues } = useForm<any>()
async function handleChangePassword() {
  console.log('handleChangePassword')
  const formValues = await getFormValues()
  console.log('formValues', formValues)
  if (formValues.newPassword !== formValues.renewPassword) {
    message.error('两次输入的密码不一致')
    return
  }
  try {
    loading.value = true
    await changePassword(formValues.oldPassword, formValues.newPassword)
    message.success('修改成功')
    router.replace('/login')
  } catch (e: any) {
    message.error('修改密码失败 ' + e.message)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="w-1/2 mx-auto">
    <div class="text-center text-2xl font-bold py-5">修改密码</div>
    <UseForm
      :register="register"
      :form-options="formOptions"
      :edit-row="editRow"
    />
    <div class="text-center">
      <Button
        :loading="loading"
        type="primary"
        @click="handleChangePassword"
        >修改密码</Button
      >
    </div>
  </div>
</template>
