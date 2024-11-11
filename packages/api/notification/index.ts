import { ApiListType, Notification } from '@packages/types'
import { postAction } from '../utils/request'

export function getNotificationList() {
  return postAction<ApiListType<Notification>>('/api/notification/list', {
    pageSize: 1000
  })
}

export function handleReadMessage(notification: Notification) {
  return postAction('/api/notification/read/' + notification.id, {})
}
