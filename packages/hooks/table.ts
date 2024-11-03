import { onMounted, ref, watchEffect } from 'vue'
import { postAction } from '@packages/api/utils/request'
import { ApiBase, ApiListType, FormOption } from '@packages/types'
import { message } from '@packages/components'
import type { PaginationProps } from '@packages/components'

export type TableOptionType = {
  name: string
  api: string
  pageNo?: number
  pageSize?: number
  outHeight?: number
  outWidth?: number
  sortItem?: string
  sortType?: string
  formOptions?: FormOption[]
  createCheck?: (record: Partial<ApiBase>) => boolean
  updateCheck?: (record: Partial<ApiBase>) => boolean
  getValues?: () => Promise<Partial<ApiBase>>
  resetValues?: () => Promise<any>
  setValues?: (record: Partial<ApiBase>) => Promise<any>
  parseList?: (list: any[]) => any[]
}

export function useTable<T extends ApiBase>(option: TableOptionType) {
  const openModal = ref(false)
  const editRow = ref<T>({} as any)
  const scroll = ref<{
    x: string | number
    y: string | number
  }>({ x: 0, y: 0 })
  const loading = ref<boolean>(false)
  const pagination = ref<PaginationProps>({
    current: option.pageNo || 1,
    pageSize: option.pageSize || 10,
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
      loading.value = true
      const sortParams: Record<string, string> = {}
      if (option.sortItem) {
        sortParams.sortItem = option.sortItem
      }
      if (option.sortType) {
        sortParams.sortType = option.sortType
      }
      const listResp = await postAction<ApiListType<T>>(`/api/${option.api}/list`, {
        pageNo: pagination.value.current,
        pageSize: pagination.value.pageSize,
        query: searchParams.value,
        ...sortParams
      })
      if (listResp.result) {
        if (option.parseList && listResp.result.items) {
          dataSource.value = option.parseList(listResp.result.items)
        } else {
          dataSource.value = listResp.result.items || []
        }
        pagination.value.total = listResp.result.total
      }
    } catch (e) {
      console.error(e)
      message.error(`获取${option.name}列表失败`)
    } finally {
      loading.value = false
    }
  }

  async function handleUpdate(record: Partial<T>) {
    if (!option.updateCheck || option.updateCheck(record)) {
      try {
        loading.value = true
        await postAction<T>(`/api/${option.api}/update/${record.id}`, record)
        handleCancel()
        handleGetList()
      } catch (e) {
        console.error(e)
        message.error(`更新${option.name}失败`)
      } finally {
        loading.value = false
      }
    } else {
      message.error(`参数校验失败`)
    }
  }

  async function handleCreate(record: Partial<T>) {
    if (!option.createCheck || option.createCheck(record)) {
      try {
        loading.value = true
        await postAction<T>(`/api/${option.api}/create`, record)
        handleCancel()
        handleGetList()
      } catch (e) {
        console.error(e)
        message.error(`创建${option.name}失败`)
      } finally {
        loading.value = false
      }
    } else {
      message.error(`参数校验失败`)
    }
  }

  async function handleDelete(id: string) {
    try {
      loading.value = true
      await postAction<string>(`/api/${option.api}/delete/${id}`)
      handleGetList()
    } catch (e) {
      console.error(e)
      message.error(`删除${option.name}失败`)
    } finally {
      loading.value = false
    }
  }

  async function handleSearch(params: Record<string, any>) {
    searchParams.value = params
    pagination.value.current = 1
  }

  async function handleOpenCreate() {
    if (option.resetValues) {
      await option.resetValues()
    }
    editRow.value = {}
    if (option.formOptions) {
      option.formOptions.forEach((item) => {
        if (item.defaultValue) {
          editRow.value[item.field] = item.defaultValue
        }
      })
    }
    openModal.value = true
  }

  async function handleOpenEdit(record: T) {
    delete record.createdTime
    delete record.updatedTime
    if (option.setValues) {
      await option.setValues(record)
    }
    editRow.value = { ...record }
    openModal.value = true
  }

  async function handleSave() {
    console.log(option.getValues)
    if (option.getValues) {
      const formValue = await option.getValues()
      editRow.value = { ...editRow.value, ...formValue }
    }
    if (editRow.value.id) {
      handleUpdate(editRow.value)
    } else {
      handleCreate(editRow.value)
    }
  }

  function handleCancel() {
    openModal.value = false
  }

  function calcTableSize() {
    scroll.value.y = window.innerHeight - (option.outHeight || 370)
    scroll.value.x = '100%'
  }

  onMounted(() => {
    calcTableSize()
  })

  watchEffect(() => {
    handleGetList()
  })

  return {
    loading,
    scroll,
    dataSource,
    pagination,
    openModal,
    editRow,
    handleSearch,
    handleGetList,
    handleUpdate,
    handleCreate,
    handleDelete,
    handleOpenCreate,
    handleOpenEdit,
    handleSave
  }
}
