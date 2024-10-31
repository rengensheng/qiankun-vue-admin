import { RoleType } from '@packages/types'
import { postAction } from '../utils/request'

export function saveRoleMenu(role: Partial<RoleType>) {
  delete role.createdTime
  delete role.updatedTime
  return postAction('/api/role/update/' + role.id, role)
}
