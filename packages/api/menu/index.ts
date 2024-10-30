import { postAction } from '../utils/request'
import { Route } from '@packages/types'

export function getMenuList() {
  return postAction<Route[]>('/api/menu/getMenuList')
}
