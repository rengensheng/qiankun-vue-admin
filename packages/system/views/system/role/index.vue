<script setup lang="ts">
import {
  Table,
  Popconfirm,
  Pagination,
  Button,
  Modal,
  Space,
  Tree,
  UseForm,
  message
} from '@packages/components'
import { FormOption, RoleType } from '@packages/types'
import { useTable, useForm } from '@packages/hooks'
import { ref } from 'vue'
import { getMenuData } from '@packages/api/menu'
import { saveRoleMenu } from '@packages/api/role'
const { register, getFormValues } = useForm<RoleType>()
const {
  loading,
  dataSource,
  pagination,
  openModal,
  editRow,
  handleDelete,
  handleOpenCreate,
  handleOpenEdit,
  handleSave
} = useTable<RoleType>({
  name: '角色',
  api: 'role',
  getValues: getFormValues
})
const columns = [
  {
    title: '角色名',
    dataIndex: 'roleName'
  },
  {
    title: '角色值',
    dataIndex: 'roleValue'
  },
  {
    title: '创建时间',
    dataIndex: 'createdTime'
  },
  {
    title: '操作',
    dataIndex: 'action'
  }
]
const formOptions: FormOption[] = [
  {
    field: 'roleName',
    name: '角色名',
    type: 'input',
    required: true
  },
  {
    field: 'roleValue',
    name: '角色值',
    type: 'input',
    required: true
  },
  {
    field: 'remark',
    type: 'textarea',
    name: '备注'
  }
]
const menuTreeData = ref<any[]>([])
const checkMenuKeys = ref<string[]>([])
const selectedRowKeys = ref<string[]>([])
const selectedRow = ref<RoleType>()
async function parseMenuList() {
  const dataListResp = await getMenuData()
  if (!dataListResp.result || !dataListResp.result.items) {
    return
  }
  const menuDataList: any = dataListResp.result.items
  menuDataList.forEach((menu: any) => {
    menu.key = menu.id
    menu.title = menu.menuName
    menu.children = menuDataList.filter((item: any) => item.parentMenu === menu.id)
    if (!menu.children.length) {
      delete menu.children
    }
  })
  menuTreeData.value = menuDataList.filter((item: any) => !item.parentMenu)
}
function onSelectChange(rowKeys: any[], selectRows: any[]) {
  selectedRowKeys.value = rowKeys.filter((key) => !selectedRowKeys.value.includes(key))
  if (selectedRowKeys.value.length > 1) {
    selectedRowKeys.value = [selectedRowKeys.value[0]]
  }
  selectedRow.value = undefined
  checkMenuKeys.value = []
  selectRows.forEach((row) => {
    if (selectedRowKeys.value.includes(row.id)) {
      selectedRow.value = row
      checkMenuKeys.value = row.menu.split(',')
    }
  })
}
async function handleSaveMenu() {
  try {
    loading.value = true
    await saveRoleMenu({
      ...selectedRow.value,
      menu: checkMenuKeys.value.join(',')
    })
    message.success('保存菜单成功')
  } catch (error: any) {
    console.error(error.message)
    message.error('保存菜单失败')
  } finally {
    loading.value = false
  }
}
parseMenuList()
</script>

<template>
  <div class="px-2">
    <div class="py-2 px-2">
      <h2 class="text-xl font-bold">角色管理</h2>
    </div>
    <div class="py-2">
      <Button
        type="primary"
        @click="handleOpenCreate"
        >新建角色</Button
      >
    </div>
    <div class="flex">
      <div class="w-2/3">
        <Table
          :columns="columns"
          :dataSource="dataSource"
          :pagination="false"
          :loading="loading"
          rowKey="id"
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        >
          <template #bodyCell="{ column, text, record }">
            <template v-if="column.dataIndex === 'action'">
              <Space>
                <a @click="handleOpenEdit(record as RoleType)">编辑</a>
                <Popconfirm
                  v-if="dataSource.length"
                  title="确认删除吗?"
                  @confirm="handleDelete(record.id)"
                >
                  <a>删除</a>
                </Popconfirm>
              </Space>
            </template>
            <template v-else>
              {{ text }}
            </template>
          </template>
        </Table>
        <div class="flex mt-4 justify-end">
          <Pagination
            class="py-2 px-2"
            v-model:current="pagination.current"
            v-model:pageSize="pagination.pageSize"
            show-quick-jumper
            :show-total="(total) => `共 ${total} 条`"
            show-size-changer
            :total="pagination.total"
            @change="pagination.onChange"
          />
        </div>
      </div>
      <div class="w-1/3">
        <div class="flex items-start justify-between px-2">
          <h2 class="text-xl font-bold">菜单权限</h2>
          <Button
            type="primary"
            size="small"
            :loading="loading"
            @click="handleSaveMenu"
            >保存</Button
          >
        </div>
        <Tree
          :tree-data="menuTreeData"
          checkable
          v-model:checkedKeys="checkMenuKeys"
        />
      </div>
    </div>
  </div>
  <Modal
    v-model:open="openModal"
    title="用户信息"
    @ok="handleSave"
    :confirm-loading="loading"
  >
    <UseForm
      :editRow="editRow"
      :register="register"
      :formOptions="formOptions"
    />
  </Modal>
</template>
