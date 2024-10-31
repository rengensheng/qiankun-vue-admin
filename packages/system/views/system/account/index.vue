<script setup lang="ts">
import { Table, Popconfirm, Pagination, Button, Modal, Space, UseForm } from '@packages/components'
import { useDict, useForm, useTable } from '@packages/hooks'
import { ref } from 'vue'
import { AccountType, DictOption, FormOption } from '@packages/types'
const roleOptions = ref<DictOption[]>([])
const deptOptions = ref<DictOption[]>([])
const columns = [
  {
    title: '用户名',
    dataIndex: 'account'
  },
  {
    title: '昵称',
    dataIndex: 'nickname'
  },
  {
    title: '邮箱',
    dataIndex: 'email'
  },
  {
    title: '角色',
    dataIndex: 'role'
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

async function loadDict() {
  roleOptions.value = await useDict('/api/role/list', 'roleName', 'roleValue')
  deptOptions.value = await useDict('/api/dept/list', 'deptName', 'id')
}

const formOptions: FormOption[] = [
  {
    field: 'account',
    name: '账户名',
    type: 'input',
    required: true
  },
  {
    field: 'role',
    name: '角色',
    type: 'select',
    options: roleOptions,
    required: true
  },
  {
    field: 'dept',
    name: '所属部门',
    options: deptOptions,
    type: 'select'
  },
  {
    field: 'nickname',
    name: '昵称',
    type: 'input',
    required: true
  },
  {
    field: 'email',
    name: '邮箱',
    type: 'input',
    required: true
  },
  {
    field: 'remark',
    name: '备注',
    type: 'textarea'
  }
]

const { register, getFormValues } = useForm<AccountType>()

const {
  dataSource,
  pagination,
  openModal,
  editRow,
  handleDelete,
  handleOpenCreate,
  handleOpenEdit,
  handleSave
} = useTable<AccountType>({
  name: '用户',
  api: 'user',
  getValues: getFormValues
})
loadDict()
</script>

<template>
  <div class="px-2">
    <div class="py-2 px-2">
      <h2 class="text-xl font-bold">账号管理</h2>
    </div>
    <div class="py-2">
      <Button
        type="primary"
        @click="handleOpenCreate"
        >新建用户</Button
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
            <a @click="handleOpenEdit(record as AccountType)">编辑</a>
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
      :edit-row="editRow"
      :form-options="formOptions"
      :register="register"
    />
  </Modal>
</template>
