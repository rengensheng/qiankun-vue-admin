import { DictOption } from './dict'

export type FormOption = {
  type:
    | 'input'
    | 'password'
    | 'textarea'
    | 'select'
    | 'inputNumber'
    | 'radio'
    | 'radioButton'
    | 'checkbox'
    | 'date'
    | 'dateRange'
    | 'time'
    | 'dateTime'
    | 'dateTimeRange'
    | 'switch'
    | 'slider'
    | 'rate'
    | 'color'
    | 'upload'
    | 'treeSelect'
  name: string
  field: string
  options?: DictOption[] | any
  defaultValue?: string | number
  required?: boolean
  placeholder?: string
  multiPlaceholder?: string[]
  disabled?: boolean
  readonly?: boolean
  hidden?: boolean
  search?: boolean
  clearable?: boolean
  multiple?: boolean
  rules?: any[]
}
