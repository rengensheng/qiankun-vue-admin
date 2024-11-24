<script setup lang="ts">
import {
  Table,
  Popconfirm,
  Pagination,
  Button,
  Modal,
  Space,
  UseForm,
  Tree,
  SearchForm
} from '@packages/components'
import { useDict, useForm, useTable } from '@packages/hooks'
import { ref } from 'vue'
import { AccountType, DictOption, FormOption } from '@packages/types'
const roleOptions = ref<DictOption[]>([])
const deptOptions = ref<DictOption[]>([])
const checkMenuKeys = ref<string[]>([])
const columns = [
  {
    title: '用户名',
    dataIndex: 'account',
    sorter: true
  },
  {
    title: '昵称',
    dataIndex: 'nickname',
    sorter: true
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
    dataIndex: 'createdTime',
    sorter: true
  },
  {
    title: '操作',
    dataIndex: 'action'
  }
]
async function loadDict() {
  roleOptions.value = await useDict('/api/role/list', 'roleName', 'roleValue')
  deptOptions.value = await useDict('/api/dept/list', 'deptName', 'id', 'parentDept')
}
const formOptions: FormOption[] = [
  {
    field: 'account',
    name: '账户名',
    type: 'input',
    search: true,
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
    type: 'treeSelect'
  },
  {
    field: 'nickname',
    name: '昵称',
    type: 'input',
    search: true,
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
  loading,
  scroll,
  dataSource,
  pagination,
  openModal,
  editRow,
  handleSearch,
  handleDelete,
  handleOpenCreate,
  handleOpenEdit,
  handleSave,
  handleTableChange
} = useTable<AccountType>({
  name: '用户',
  api: 'user',
  getValues: getFormValues
})
loadDict()
function handleCheckTree() {
  console.log('checkMenuKeys', checkMenuKeys.value)
  if (checkMenuKeys.value.length > 0) {
    handleSearch({
      dept: checkMenuKeys.value.join(',')
    })
  } else {
    handleSearch({})
  }
}
</script>

<template>
  <div class="px-2">
    <div class="py-2 px-2">
      <h2 class="text-xl font-bold">账号管理</h2>
      <SearchForm
        :searchOptions="formOptions"
        :handle-search="handleSearch"
      />
    </div>
    <div class="py-2">
      <Button
        type="primary"
        @click="handleOpenCreate"
        >新建用户</Button
      >
    </div>
    <div class="flex">
      <div class="w-64">
        <Tree
          @check="handleCheckTree"
          v-if="deptOptions.length"
          :tree-data="deptOptions as any"
          :auto-expand-parent="true"
          :default-expand-all="true"
          :field-names="{
            title: 'label',
            key: 'value',
            children: 'children'
          }"
          checkable
          v-model:checkedKeys="checkMenuKeys as any"
        />
      </div>
      <div class="w-3/5 flex-1">
        <Table
          :loading="loading"
          :columns="columns"
          :dataSource="dataSource"
          @change="handleTableChange"
          :pagination="false"
          :scroll="{
            x: '100%',
            y: scroll.y
          }"
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
    </div>
  </div>
  <Modal
    v-model:open="openModal"
    title="用户信息"
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
