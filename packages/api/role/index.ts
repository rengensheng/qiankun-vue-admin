import { postAction } from "../utils/request";
import { RoleType, ApiListType } from "@packages/types";

export function getRoleList(pageNo: number | undefined, pageSize: number | undefined) {
  return postAction<ApiListType<RoleType>>('/api/role/list', {
    pageNo,
    pageSize,
  })
}

export function updateRole(role: Partial<RoleType>) {
  delete role.createdTime
  delete role.updatedTime
  return postAction<RoleType>('/api/role/update/' + role.id, role)
}

export function deleteRole(id: string) {
  return postAction<string>('/api/role/delete/' + id)
}

export function createRole(role: RoleType) {
  return postAction<RoleType>('/api/role/create', role)
}