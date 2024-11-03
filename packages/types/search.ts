import { DictOption } from './dict'

export type SearchOption = {
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
  search?: boolean
  options?: DictOption[] | any
  defaultValue?: string | number
  placeholder?: string
  multiPlaceholder?: string[]
}
