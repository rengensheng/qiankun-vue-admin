export type DictOption = {
  label: string,
  value: string | number,
  children?: DictOption[],
  parent?: DictOption,
  source?: Record<string, any>
}