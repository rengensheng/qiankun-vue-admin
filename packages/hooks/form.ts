import { ref, Ref, VNodeRef } from 'vue'

export function useForm<T>() {
  let currentFormRef: Ref<any> = ref<VNodeRef>()
  function register(formRef: Ref<VNodeRef>) {
    currentFormRef = formRef
    console.log(currentFormRef.value)
  }
  async function getFormValues() {
    if (currentFormRef.value) {
      const result = await currentFormRef.value.validate()
      return result as T
    }
    return {}
  }
  async function resetFields() {
    if (currentFormRef.value) {
      await currentFormRef.value.resetFields()
    }
  }
  return {
    register,
    getFormValues,
    resetFields
  }
}
