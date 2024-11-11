import { UserLoginRes } from '@packages/types'
import { postAction, uploadAction } from '../utils/request'

export function userLogin(username: string, password: string) {
  return postAction<UserLoginRes>('/api/user/login ', {
    username,
    password
  })
}

export function userRegister(username: string, password: string, nickname: string) {
  return postAction<UserLoginRes>('/api/user/register', {
    username,
    password,
    nickname
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

export function uploadAvatar(imageFile: File) {
  const formData = new FormData()
  formData.append('file', imageFile)
  return uploadAction<UserLoginRes>('/api/user/avatar/upload', formData)
}

export function changeUserInfo(nickName: string, email: string, phone?: string) {
  return postAction<UserLoginRes>('/api/user/change', {
    nickname: nickName,
    email,
    phone
  })
}
