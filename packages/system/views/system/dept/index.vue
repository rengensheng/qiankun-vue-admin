<script setup lang="ts">
import { Table, Popconfirm, Pagination, Button, Modal, Space, UseForm } from '@packages/components'
import type { DeptType, DictOption, FormOption } from '@packages/types'
import { useForm, useTable } from '@packages/hooks'
import { useDict } from '@packages/hooks'
import { ref } from 'vue'
const deptTreeOptions = ref<DictOption[]>([])
const formOptions: FormOption[] = [
  {
    field: 'deptName',
    name: '部门名',
    type: 'input',
    required: true
  },
  {
    field: 'parentDept',
    name: '上级部门',
    type: 'treeSelect',
    options: deptTreeOptions
  },
  {
    field: 'status',
    name: '是否启用',
    type: 'radioButton',
    options: [
      { label: '是', value: '0' },
      { label: '否', value: '1' }
    ],
    required: true
  },
  {
    field: 'orderNo',
    name: '排序',
    type: 'inputNumber',
    required: true
  },
  {
    field: 'remark',
    name: '备注',
    type: 'textarea'
  }
]
const { register, getFormValues } = useForm<DeptType>()
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
} = useTable<DeptType>({
  name: '部门',
  api: 'dept',
  getValues: getFormValues
})
const columns = [
  {
    title: '部门名称',
    dataIndex: 'deptName'
  },
  {
    title: '排序',
    dataIndex: 'orderNo'
  },
  {
    title: '是否启用',
    dataIndex: 'status'
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
async function loadDict() {
  deptTreeOptions.value = await useDict('/api/dept/list', 'deptName', 'id', 'parentDept')
}
loadDict()
</script>

<template>
  <div class="px-2">
    <div class="py-2 px-2">
      <h2 class="text-xl font-bold">部门管理</h2>
    </div>
    <div class="py-2">
      <Button
        type="primary"
        @click="handleOpenCreate"
        >新建部门</Button
      >
    </div>
    <Table
      :columns="columns"
      :dataSource="dataSource"
      :pagination="false"
      :loading="loading"
    >
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'action'">
          <Space>
            <a @click="handleOpenEdit(record as DeptType)">编辑</a>
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
    title="部门信息"
    @ok="handleSave"
    :confirm-loading="loading"
  >
    <UseForm
      :edit-row="editRow"
      :form-options="formOptions"
      :register="register"
    />
  </Modal>
</template>
