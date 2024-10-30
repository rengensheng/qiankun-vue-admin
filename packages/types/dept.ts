export type DeptType = {
  createdBy: string
  createdTime: string // 可以考虑使用 Date 类型，如果你将其解析为 Date 对象
  deptName: string
  id: string
  orderNo: number
  parentDept: string
  remark: string
  revision: number
  status: string // 如果 status 只有 "0" 或 "1"，可以考虑使用字面量类型 '0' | '1'
  updatedBy: string
  updatedTime: string // 同样可以考虑使用 Date 类型
}
