export type SimpleRole = {
  roleName: string
  value: string
}

export type UserLoginRes = {
  account: string
  desc: string
  realName: string
  token: string
  avatar: string
  email: string
  phone: string
  roles: SimpleRole[]
}

export type AccountType = {
  account: string
  createdBy: string
  createdTime: string
  dept: string
  email: string
  id: string
  nickname: string
  pwd: string
  remark?: string
  revision: number
  role: string
  updatedBy: string
  updatedTime: string
}
