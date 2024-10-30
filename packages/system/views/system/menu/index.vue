<script setup lang="ts">
import {
  Table,
  Popconfirm,
  Button,
  Modal,
  Form,
  FormItem,
  Input,
  Space,
  RadioButton,
  RadioGroup,
  TreeSelect,
  InputNumber,
  message
} from '@packages/components'
import { useDict } from '@packages/hooks'
import type { PaginationProps } from '@packages/components'
import { getMenuDataList, deleteMenu, createMenu, updateMenu } from '@packages/api/menu'
import { ref, watchEffect } from 'vue'
import { DictOption, MenuType } from '@packages/types'
const dataSource = ref<MenuType[]>([])
const openModal = ref<boolean>(false)
const editRecord = ref<any>()
const menuTreeOptions = ref<DictOption[]>([])
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
    title: '菜单名',
    dataIndex: 'menuName'
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
    dataIndex: 'orderNo'
  },
  {
    title: '状态',
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
  menuTreeOptions.value = await useDict('/api/menu/list', 'menuName', 'id', 'parentMenu')
  console.log('tree', menuTreeOptions.value)
}
loadDict()
async function getList() {
  const res = await getMenuDataList()
  if (res.result && res.result.items) {
    const menuList = res.result.items
    menuList.forEach((menu) => {
      menu.key = menu.id
      menu.children = menuList.filter((item) => item.parentMenu === menu.id)
      if (!menu.children.length) {
        delete menu.children
      }
    })
    dataSource.value = menuList.filter((item) => !item.parentMenu)
    pagination.value.total = res.result.total
  }
}
function handleOpenCreateUser() {
  editRecord.value = {}
  openModal.value = true
}
function handleOpenEditUser(record: MenuType) {
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
function handleCreate(record: MenuType) {
  createMenu(record)
    .then(() => {
      openModal.value = false
      getList()
      message.success('创建成功')
      loadDict()
    })
    .catch((e) => {
      message.error(e.message)
    })
}
function handleUpdate(record: MenuType) {
  updateMenu(record)
    .then(() => {
      openModal.value = false
      getList()
      loadDict()
      message.success('编辑成功')
    })
    .catch((e) => {
      message.error(e.message)
    })
}
async function handleDelete(record: MenuType) {
  await deleteMenu(record.id)
  getList()
}
watchEffect(() => {
  getList()
})
</script>

<template>
  <div class="px-2">
    <div class="py-2 px-2">
      <h2 class="text-xl font-bold">菜单管理</h2>
    </div>
    <div class="py-2">
      <Button
        type="primary"
        @click="handleOpenCreateUser"
        >新建菜单</Button
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
  </div>
  <Modal
    v-model:open="openModal"
    title="菜单信息"
    @ok="handleSaveUser"
  >
    <Form
      :model="editRecord"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 14 }"
      autocomplete="off"
    >
      <FormItem
        label="菜单类型"
        name="type"
        :rules="[{ required: true, message: '请输入组件路径!' }]"
      >
        <RadioGroup
          v-model:value="editRecord.type"
          button-style="solid"
        >
          <RadioButton value="0">目录</RadioButton>
          <RadioButton value="1">菜单</RadioButton>
          <RadioButton value="2">按钮</RadioButton>
        </RadioGroup>
      </FormItem>
      <FormItem
        label="菜单名称"
        name="menuName"
        :rules="[{ required: true, message: '请输入菜单名称!' }]"
      >
        <Input
          v-model:value="editRecord.menuName"
          placeholder="请输入菜单名称"
        />
      </FormItem>
      <FormItem
        label="上级菜单"
        name="menuName"
      >
        <TreeSelect
          v-model:value="editRecord.parentMenu"
          style="width: 100%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          placeholder="请选择上级菜单"
          allow-clear
          tree-default-expand-all
          :tree-data="menuTreeOptions"
          tree-node-filter-prop="label"
        >
        </TreeSelect>
      </FormItem>
      <FormItem
        label="路由地址"
        name="routePath"
        :rules="[{ required: true, message: '请输入路由地址!' }]"
      >
        <Input
          v-model:value="editRecord.routePath"
          placeholder="请输入路由地址"
        />
      </FormItem>
      <FormItem
        label="组件路径"
        name="component"
        :rules="[{ required: true, message: '请输入组件路径!' }]"
      >
        <Input
          v-model:value="editRecord.component"
          placeholder="请输入组件路径"
        />
      </FormItem>
      <FormItem
        label="权限标识"
        name="permission"
        ><Input
          v-model:value="editRecord.permission"
          placeholder="请输入组件路径"
        />
      </FormItem>
      <FormItem
        label="状态"
        name="status"
        :rules="[{ required: true, message: '请输入状态!' }]"
      >
        <RadioGroup
          v-model:value="editRecord.status"
          button-style="solid"
        >
          <RadioButton value="0">启用</RadioButton>
          <RadioButton value="1">禁用</RadioButton>
        </RadioGroup>
      </FormItem>
      <FormItem
        label="是否外链"
        name="isExt"
        :rules="[{ required: true, message: '请输入是否外链!' }]"
      >
        <RadioGroup
          v-model:value="editRecord.isExt"
          button-style="solid"
        >
          <RadioButton value="0">否</RadioButton>
          <RadioButton value="1">是</RadioButton>
        </RadioGroup>
      </FormItem>
      <FormItem
        label="是否缓存"
        name="keepalive"
        :rules="[{ required: true, message: '请输入是否缓存!' }]"
      >
        <RadioGroup
          v-model:value="editRecord.keepalive"
          button-style="solid"
        >
          <RadioButton value="0">否</RadioButton>
          <RadioButton value="1">是</RadioButton>
        </RadioGroup>
      </FormItem>
      <FormItem
        label="是否显示"
        name="show"
        :rules="[{ required: true, message: '请输入是否显示!' }]"
      >
        <RadioGroup
          v-model:value="editRecord.show"
          button-style="solid"
        >
          <RadioButton value="0">否</RadioButton>
          <RadioButton value="1">是</RadioButton>
        </RadioGroup>
      </FormItem>
      <FormItem
        label="排序"
        name="orderNo"
        :rules="[{ required: true, message: '请输入排序!' }]"
      >
        <InputNumber
          v-model:value="editRecord.orderNo"
          placeholder="请输入排序"
        />
      </FormItem>
    </Form>
  </Modal>
</template>
