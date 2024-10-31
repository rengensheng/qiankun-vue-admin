import { UserLoginRes } from '@packages/types'
import { postAction } from '../utils/request'

export function userLogin(username: string, password: string) {
  return postAction<UserLoginRes>('/api/user/login ', {
    username,
    password
  })
}

export function getUserInfo() {
  return postAction<UserLoginRes>('/api/user/getUserInfo', {})
}

export function changePassword(oldPassword: string, newPassword: string) {
  return postAction<UserLoginRes>('/api/user/password', {
    oldPassword,
    newPassword
  })
}
