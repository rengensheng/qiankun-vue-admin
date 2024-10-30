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
import { RoleType } from '@packages/types'
import { useTable } from '@packages/hooks'
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
  api: 'role'
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
    <Form
      :model="editRow"
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
          v-model:value="editRow.roleName"
          placeholder="请输入角色名"
        />
      </FormItem>
      <FormItem
        label="角色值"
        name="roleValue"
        :rules="[{ required: true, message: '请输入角色值!' }]"
      >
        <Input
          v-model:value="editRow.roleValue"
          placeholder="请输入角色值"
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
