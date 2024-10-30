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
  Select,
  Space
} from '@packages/components'
import { useDict, useTable } from '@packages/hooks'
import { ref } from 'vue'
import { AccountType, DictOption } from '@packages/types'
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
  api: 'user'
})
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
    <Form
      :model="editRow"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 14 }"
      autocomplete="off"
    >
      <FormItem
        label="账户名"
        name="account"
        :rules="[{ required: true, message: '请输入账户名!' }]"
      >
        <Input
          v-model:value="editRow.account"
          placeholder="请输入账户名"
        />
      </FormItem>
      <FormItem
        label="角色"
        name="role"
        :rules="[{ required: true, message: '请输入角色!' }]"
      >
        <Select
          v-model:value="editRow.role"
          placeholder="请选择角色"
          :options="roleOptions"
        />
      </FormItem>
      <FormItem
        label="所属部门"
        name="dept"
      >
        <Select
          v-model:value="editRow.dept"
          placeholder="请选择所属部门"
          :options="deptOptions"
        />
      </FormItem>
      <FormItem
        label="昵称"
        name="nickname"
        :rules="[{ required: true, message: '请输入昵称!' }]"
      >
        <Input
          v-model:value="editRow.nickname"
          placeholder="请输入用户昵称"
        />
      </FormItem>
      <FormItem
        label="邮箱"
        name="email"
        :rules="[{ required: true, message: '请输入邮箱!' }]"
      >
        <Input
          v-model:value="editRow.email"
          placeholder="请输入邮箱"
        />
      </FormItem>
      <FormItem
        label="备注"
        name="remark"
      >
        <Input.TextArea
          v-model:value="editRow.remark"
          placeholder="请输入备注"
        />
      </FormItem>
    </Form>
  </Modal>
</template>
