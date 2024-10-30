import { postAction } from "../utils/request"
import { ApiListType, MenuType, Route } from "@packages/types"

export function getMenuList() {
  return postAction<Route[]>("/api/menu/getMenuList")
}

export function getMenuDataList() {
  return postAction<ApiListType<MenuType>>(`/api/menu/list`, {
    pageSize: 1000
  })
}

export function updateMenu(menu: Partial<MenuType>) {
  delete menu.createdTime
  delete menu.updatedTime
  return postAction<MenuType>('/api/menu/update/' + menu.id, menu)
}

export function deleteMenu(id: string) {
  return postAction<string>('/api/menu/delete/' + id)
}

export function createMenu(menu: MenuType) {
  return postAction<MenuType>('/api/menu/create', menu)
}