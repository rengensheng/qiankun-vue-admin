export type Meta = {
  icon: string
  title: string
  hideMenu?: boolean
  ignoreKeepAlive?: boolean
}

export type Route = {
  path: string
  name: string
  icon: string
  component: string
  id: string
  meta: Meta
  orderNo: number
  parentPath: string
  children?: Route[]
}

export type MenuType = {
  key?: string
  component: string // 组件路径
  createdBy: string // 创建者
  createdTime: string // 创建时间
  icon: string // 图标
  id: string // 菜单 ID
  isExt: string // 是否扩展
  keepalive: string // 是否保持活跃
  menuName: string // 菜单名称
  orderNo: number // 排序号
  parentMenu: string // 父菜单 ID
  permission: string // 权限
  revision: number // 版本
  routePath: string // 路由路径
  show: string // 是否显示
  status: string // 状态
  type: string // 类型
  updatedBy: string // 更新者
  updatedTime: string // 更新时间
  children?: MenuType[]
}
