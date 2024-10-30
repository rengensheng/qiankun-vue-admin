import { postAction } from '@packages/api/utils/request'
import { ApiListType, DictOption } from '@packages/types'

export async function useDict(
  apiUrl: string,
  label: string,
  value: string,
  treeLabel?: string
): Promise<DictOption[]> {
  const dictResp = await postAction<ApiListType<Record<string, string>>>(apiUrl)
  if (dictResp.result && dictResp.result.items) {
    const dictList = dictResp.result.items.map((item) => {
      const dictItem: DictOption = {
        label: item[label],
        value: item[value],
        children: [] as any
      }
      if (treeLabel) {
        dictItem.source = item
      }
      return dictItem
    })
    if (treeLabel) {
      dictList.forEach((item) => {
        item.children = dictList.filter((child) => {
          if (child.source) {
            if (child.source[treeLabel] === item.value) {
              child.parent = item
              return true
            }
            return false
          }
          return false
        })
      })
      return dictList.filter((item) => !item.parent)
    }
    return dictList
  }
  return []
}
