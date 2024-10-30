export function flatten(arr: Record<string, any>[], flatKey = 'children') {
  const result: Record<string, any>[] = []
  arr.forEach((item) => {
    if (item[flatKey]) {
      result.push(...flatten(item[flatKey], flatKey))
      delete item[flatKey]
    }
    result.push(item)
  })
  return result
}
