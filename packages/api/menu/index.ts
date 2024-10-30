import { postAction } from "../utils/request"
import { ApiResponse, Route } from "@packages/types"

export function getMenuList() {
  return postAction<ApiResponse<Route[]>>("/api/menu/getMenuList")
}