<script setup lang="ts">
import { Table, Popconfirm, Button, Modal, Space, Tag, SearchForm } from '@packages/components'
import { useDict, useForm, useTable } from '@packages/hooks'
import { ref } from 'vue'
import { DictOption, FormOption, MenuType } from '@packages/types'
import UseForm from '@packages/components/components/UseForm.vue'
const menuTreeOptions = ref<DictOption[]>([])
const formOptions: FormOption[] = [
  {
    field: 'menuName',
    name: '菜单名称',
    type: 'input',
    search: true,
    required: true
  },
  {
    field: 'parentMenu',
    name: '上级菜单',
    type: 'treeSelect',
    options: menuTreeOptions,
    clearable: true
  },
  {
    field: 'routePath',
    name: '路由地址',
    type: 'input',
    required: true
  },
  {
    field: 'component',
    name: '组件路径',
    type: 'input',
    search: true,
    required: true
  },
  {
    field: 'icon',
    name: '图标',
    type: 'input',
    required: false
  },
  {
    field: 'permission',
    name: '权限标识',
    type: 'input',
    required: false
  },
  {
    field: 'status',
    name: '状态',
    type: 'radioButton',
    defaultValue: '0',
    options: [
      { label: '启用', value: '0' },
      { label: '禁用', value: '1' }
    ],
    required: true
  },
  {
    field: 'isExt',
    name: '是否外链',
    type: 'radioButton',
    defaultValue: '0',
    options: [
      { label: '否', value: '0' },
      { label: '是', value: '1' }
    ],
    required: true
  },
  {
    field: 'keepalive',
    name: '是否缓存',
    type: 'radioButton',
    defaultValue: '0',
    options: [
      { label: '否', value: '0' },
      { label: '是', value: '1' }
    ],
    required: true
  },
  {
    field: 'show',
    name: '是否显示',
    type: 'radioButton',
    defaultValue: '0',
    options: [
      { label: '否', value: '0' },
      { label: '是', value: '1' }
    ],
    required: true
  },
  {
    field: 'orderNo',
    name: '排序',
    type: 'inputNumber',
    required: true
  }
]
const { register, getFormValues } = useForm<MenuType>()
const {
  loading,
  scroll,
  dataSource,
  openModal,
  editRow,
  handleSearch,
  handleDelete,
  handleOpenCreate,
  handleOpenEdit,
  handleSave,
  handleTableChange
} = useTable<MenuType>({
  name: '菜单',
  api: 'menu',
  pageSize: 10000,
  sortItem: 'orderNo',
  sortType: 'asc',
  formOptions,
  parseList: parseMenuList,
  getValues: getFormValues
})
const columns = [
  {
    title: '菜单名',
    dataIndex: 'menuName',
    sorter: true
  },
  {
    title: '权限标识',
    dataIndex: 'permission'
  },
  {
    title: '组件',
    dataIndex: 'component'
  },
  {
    title: '排序',
    dataIndex: 'orderNo',
    sorter: true
  },
  {
    title: '状态',
    dataIndex: 'status',
    filters: [
      { text: '是', value: '0' },
      { text: '否', value: '1' }
    ]
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
function parseMenuList(dataList: MenuType[]) {
  dataList.forEach((menu) => {
    menu.key = menu.id
    menu.children = dataList.filter((item) => item.parentMenu === menu.id)
    if (!menu.children.length) {
      delete menu.children
    }
  })
  let list = dataList.filter((item) => !item.parentMenu)
  if (list.length === 0 && dataList.length > 0) {
    list = dataList
  }
  return list
}
async function loadDict() {
  menuTreeOptions.value = await useDict('/api/menu/list', 'menuName', 'id', 'parentMenu')
}
loadDict()
</script>

<template>
  <div class="px-2">
    <div class="py-2 px-2">
      <h2 class="text-xl font-bold">菜单管理</h2>
      <SearchForm
        :searchOptions="formOptions"
        :handle-search="handleSearch"
      />
    </div>
    <div class="py-2">
      <Button
        type="primary"
        @click="handleOpenCreate"
        >新建菜单</Button
      >
    </div>
    <Table
      :columns="columns"
      :dataSource="dataSource"
      :pagination="false"
      :loading="loading"
      :scroll="scroll"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'status'">
          <Tag :color="text === '0' ? 'green' : 'red'">
            {{ text === '0' ? '是' : '否' }}
          </Tag>
        </template>
        <template v-else-if="column.dataIndex === 'action'">
          <Space>
            <a @click="handleOpenEdit(record as MenuType)">编辑</a>
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
  </div>
  <Modal
    v-model:open="openModal"
    title="菜单信息"
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
