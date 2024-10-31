<script setup lang="ts">
import { Table, Popconfirm, Pagination, Button, Modal, Space, UseForm } from '@packages/components'
import { FormOption, RoleType } from '@packages/types'
import { useTable, useForm } from '@packages/hooks'
const { register, getFormValues } = useForm<RoleType>()
const {
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
    title: '备注',
    dataIndex: 'remark'
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
    <Table
      :columns="columns"
      :dataSource="dataSource"
      :pagination="false"
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
  <Modal
    v-model:open="openModal"
    title="用户信息"
    @ok="handleSave"
  >
    <UseForm
      :editRow="editRow"
      :register="register"
      :formOptions="formOptions"
    />
  </Modal>
</template>
