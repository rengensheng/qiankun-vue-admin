<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue'
import { useUserStore } from '@packages/store'
import { Popover, Badge, notification } from '@packages/components'
import { Notification } from '@packages/types'
import { getNotificationList, handleReadMessage } from '@packages/api/notification'
const userStore = useUserStore()
const websocket = ref<WebSocket | null>(null)
const openNotification = ref<boolean>(false)
const notificationList = ref<Notification[]>([])

function handleOpen() {
  if (!userStore.user || !userStore.user.token) return
  const webSocketUrl =
    process.env.NODE_ENV === 'development'
      ? (import.meta as any).env.VITE_PROXY_URL
      : `${window.origin.replace('https', 'wss').replace('http', 'ws')}`
  websocket.value = new WebSocket(`${webSocketUrl}/api/websocket/${userStore.user.token}`)
  websocket.value.addEventListener('open', function () {
    console.log('WebSocket is connected.')
  })
  websocket.value.addEventListener('message', function (event) {
    const notificationInfo: Notification = JSON.parse(event.data)
    notificationList.value.unshift(notificationInfo)
    notification.open({
      message: notificationInfo.title,
      description: notificationInfo.content,
      duration: 3000
    })
  })
}

function handleGetNotificationList() {
  notificationList.value = []
  getNotificationList().then((res) => {
    console.log(res.result)
    const unreadList = res.result?.items?.filter((item: Notification) => item.status !== 'read')
    notificationList.value =
      unreadList?.concat(res.result?.items?.filter((item) => item.status === 'read') || []) || []
  })
}

async function handleReadNotification(notification: Notification) {
  await handleReadMessage(notification)
  notification.status = 'read'
}

onMounted(() => {
  handleGetNotificationList()
})

watchEffect(() => {
  handleOpen()
})
</script>

<template>
  <Popover
    placement="bottomRight"
    v-model:open="openNotification"
    title="系统通知"
    trigger="click"
  >
    <template #content>
      <div>
        <div class="flex flex-col items-center justify-between max-h-120">
          <div
            v-if="notificationList.length === 0"
            class="text-center text-gray-400 p-4"
          >
            暂无通知
          </div>
          <div
            v-for="notification in notificationList"
            :key="notification.id"
            @click="handleReadNotification(notification)"
            class="border-b-1 border-b-solid border-gray-100 w-full p-4 hover:bg-gray-50 cursor-pointer"
          >
            <div class="flex items-center">
              <div>
                <div
                  class="text-lg font-bold text-gray-600"
                  :class="{ '!text-blue-500': notification.status !== 'read' }"
                >
                  {{ notification.title }}
                </div>
                <div
                  class="text-sm text-gray-400"
                  :class="{ '!text-blue-400': notification.status !== 'read' }"
                >
                  {{ notification.content }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <Badge
      :count="notificationList.filter((item) => item.status !== 'read').length"
      class="mr-5"
    >
      <div class="i-tabler:bell-ringing w-6 h-6 text-gray-400"></div>
    </Badge>
  </Popover>
</template>
