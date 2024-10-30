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
  InputNumber,
  RadioGroup,
  RadioButton,
  TreeSelect
} from '@packages/components'
import type { DeptType, DictOption } from '@packages/types'
import { useTable } from '@packages/hooks'
import { useDict } from '@packages/hooks'
import { ref } from 'vue'
const {
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
  api: 'dept'
})
const deptTreeOptions = ref<DictOption[]>([])
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
  >
    <Form
      :model="editRow"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 14 }"
      autocomplete="off"
    >
      <FormItem
        label="部门名"
        name="deptName"
        :rules="[{ required: true, message: '请输入部门名!' }]"
      >
        <Input
          v-model:value="editRow.deptName"
          placeholder="请输入部门名"
        />
      </FormItem>
      <FormItem
        label="上级部门"
        name="parentDept"
      >
        <TreeSelect
          v-model:value="editRow.parentDept"
          style="width: 100%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          placeholder="上级部门"
          allow-clear
          tree-default-expand-all
          :tree-data="deptTreeOptions"
          tree-node-filter-prop="label"
        >
        </TreeSelect>
      </FormItem>
      <FormItem
        label="是否启用"
        name="status"
        :rules="[{ required: true, message: '请输入是否启用!' }]"
      >
        <RadioGroup
          v-model:value="editRow.status"
          button-style="solid"
        >
          <RadioButton value="0">是</RadioButton>
          <RadioButton value="1">否</RadioButton>
        </RadioGroup>
      </FormItem>
      <FormItem
        label="排序"
        name="orderNo"
        :rules="[{ required: true, message: '请输入排序!' }]"
      >
        <InputNumber
          v-model:value="editRow.orderNo"
          placeholder="请输入排序"
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
