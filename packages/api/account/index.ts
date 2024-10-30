import { postAction } from '../utils/request'
import { AccountType, ApiListType } from '@packages/types'

export function getAccountList(pageNo: number | undefined, pageSize: number | undefined) {
  return postAction<ApiListType<AccountType>>('/api/user/list', {
    pageNo,
    pageSize
  })
}

export function updateAccount(account: Partial<AccountType>) {
  delete account.createdTime
  delete account.updatedTime
  return postAction<AccountType>('/api/user/update/' + account.id, account)
}

export function deleteAccount(id: string) {
  return postAction<string>('/api/user/delete/' + id)
}

export function createAccount(account: AccountType) {
  return postAction<AccountType>('/api/user/create', account)
}
