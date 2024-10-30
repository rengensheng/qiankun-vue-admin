<script setup lang="ts">
import {
  Table,
  Popconfirm,
  Pagination,
  Button,
  Modal,
  Form,
  FormItem,
  Input,
  Space,
  message
} from '@packages/components'
import type { PaginationProps } from '@packages/components'
import { getRoleList, deleteRole, createRole, updateRole } from '@packages/api/role'
import { ref, watchEffect } from 'vue'
import { RoleType } from '@packages/types'
const dataSource = ref<RoleType[]>([])
const openModal = ref<boolean>(false)
const editRecord = ref<any>()
const pagination = ref<PaginationProps>({
  current: 1,
  pageSize: 10,
  total: 0,
  onChange: (page: number, pageSize: number) => {
    pagination.value.current = page
    pagination.value.pageSize = pageSize
  }
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
async function getList() {
  const res = await getRoleList(pagination.value.current, pagination.value.pageSize)
  if (res.result && res.result.items) {
    dataSource.value = res.result.items
    pagination.value.total = res.result.total
  }
}
function handleOpenCreateUser() {
  editRecord.value = {}
  openModal.value = true
}
function handleOpenEditUser(record: RoleType) {
  editRecord.value = { ...record }
  openModal.value = true
}
function handleSaveUser() {
  if (editRecord.value.id) {
    handleUpdate(editRecord.value)
  } else {
    handleCreate(editRecord.value)
  }
}
function handleCreate(record: RoleType) {
  createRole(record)
    .then(() => {
      openModal.value = false
      getList()
      message.success('创建成功')
    })
    .catch((e) => {
      message.error(e.message)
    })
}
function handleUpdate(record: RoleType) {
  updateRole(record)
    .then(() => {
      openModal.value = false
      getList()
      message.success('编辑成功')
    })
    .catch((e) => {
      message.error(e.message)
    })
}
async function handleDelete(record: RoleType) {
  await deleteRole(record.id)
  getList()
}
watchEffect(() => {
  getList()
})
</script>

<template>
  <div class="px-2">
    <div class="py-2 px-2">
      <h2 class="text-xl font-bold">角色管理</h2>
    </div>
    <div class="py-2">
      <Button
        type="primary"
        @click="handleOpenCreateUser"
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
            <a @click="handleOpenEditUser(record as any)">编辑</a>
            <Popconfirm
              v-if="dataSource.length"
              title="确认删除吗?"
              @confirm="handleDelete(record as any)"
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
    @ok="handleSaveUser"
  >
    <Form
      :model="editRecord"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 14 }"
      autocomplete="off"
    >
      <FormItem
        label="角色名"
        name="roleName"
        :rules="[{ required: true, message: '请输入角色名!' }]"
      >
        <Input
          v-model:value="editRecord.roleName"
          placeholder="请输入角色名"
        />
      </FormItem>
      <FormItem
        label="角色值"
        name="roleValue"
        :rules="[{ required: true, message: '请输入角色值!' }]"
      >
        <Input
          v-model:value="editRecord.roleValue"
          placeholder="请输入角色值"
        />
      </FormItem>
      <FormItem
        label="备注"
        name="remark"
      >
        <Input.TextArea
          v-model:value="editRecord.remark"
          placeholder="请输入备注"
        />
      </FormItem>
    </Form>
  </Modal>
</template>
