import { UserLoginRes } from '@packages/types'
import { postAction } from '../utils/request'

export function githubLogin(code: string) {
  return postAction<UserLoginRes>('/api/oauth/login', { code, from: 'github' })
}

export function googleLogin(code: string) {
  return postAction<UserLoginRes>('/api/oauth/login', { code, from: 'google' })
}
