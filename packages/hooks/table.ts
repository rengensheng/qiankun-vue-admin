import { ref, watchEffect } from 'vue'
import { postAction } from '@packages/api/utils/request'
import { ApiBase, ApiListType } from '@packages/types'
import { message } from '@packages/components'
import type { PaginationProps } from '@packages/components'

export type TableOptionType = {
  name: string
  api: string
  createCheck?: (record: Partial<ApiBase>) => boolean
  updateCheck?: (record: Partial<ApiBase>) => boolean
}

export function useTable<T extends ApiBase>(option: TableOptionType) {
  const openModel = ref(false)
  const editRow = ref<T>({} as any)
  const pagination = ref<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,
    onChange: (page: number, pageSize: number) => {
      pagination.value.current = page
      pagination.value.pageSize = pageSize
    }
  })
  const searchParams = ref<Record<string, any>>({})
  const dataSource = ref<T[]>([])

  async function handleGetList() {
    try {
      const listResp = await postAction<ApiListType<T>>(`/api/${option.api}/list`, {
        pageNo: pagination.value.current,
        pageSize: pagination.value.pageSize,
        query: searchParams.value
      })
      if (listResp.result) {
        dataSource.value = listResp.result.items || []
        pagination.value.total = listResp.result.total
      }
    } catch (e) {
      console.error(e)
      message.error(`获取${option.name}列表失败`)
    }
  }

  async function handleUpdate(record: Partial<T>) {
    if (!option.updateCheck || option.updateCheck(record)) {
      try {
        await postAction<T>(`/api/${option.api}/update/${record.id}`, record)
      } catch (e) {
        console.error(e)
        message.error(`更新${option.name}失败`)
      }
    } else {
      message.error(`参数校验失败`)
    }
  }

  async function handleCreate(record: Partial<T>) {
    if (!option.createCheck || option.createCheck(record)) {
      try {
        await postAction<T>(`/api/${option.api}/create`, record)
        handleGetList()
      } catch (e) {
        console.error(e)
        message.error(`创建${option.name}失败`)
      }
    } else {
      message.error(`参数校验失败`)
    }
  }

  async function handleDelete(id: string) {
    try {
      await postAction<string>(`/api/${option.api}/delete/${id}`)
    } catch (e) {
      console.error(e)
      message.error(`删除${option.name}失败`)
    }
  }

  async function handleSeach(params: Record<string, any>) {
    searchParams.value = params
  }

  function handleOpenCreate() {
    editRow.value = {}
    openModel.value = true
  }

  function handleOpenEdit(record: T) {
    editRow.value = { ...record }
    openModel.value = true
  }

  function handleSave() {
    if (editRow.value.id) {
      handleUpdate(editRow.value)
    } else {
      handleCreate(editRow.value)
    }
  }

  watchEffect(() => {
    handleGetList()
  })

  return {
    dataSource,
    pagination,
    openModel,
    editRow,
    handleSeach,
    handleGetList,
    handleUpdate,
    handleCreate,
    handleDelete,
    handleOpenCreate,
    handleOpenEdit,
    handleSave
  }
}
