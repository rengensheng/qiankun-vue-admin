import { postAction } from '../utils/request'
import { ApiListType, MenuType, Route } from '@packages/types'

export function getMenuList() {
  return postAction<Route[]>('/api/menu/getMenuList')
}

export function getMenuData() {
  return postAction<ApiListType<MenuType>>('/api/menu/list', {
    pageSize: 1000
  })
}
