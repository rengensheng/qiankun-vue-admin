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
  InputNumber
} from '@packages/components'
import { useDict, useTable } from '@packages/hooks'
import { ref } from 'vue'
import { DictOption, MenuType } from '@packages/types'
const menuTreeOptions = ref<DictOption[]>([])
const {
  dataSource,
  openModal,
  editRow,
  handleDelete,
  handleOpenCreate,
  handleOpenEdit,
  handleSave
} = useTable<MenuType>({
  name: '菜单',
  api: 'menu',
  pageSize: 10000,
  parseList: parseMenuList
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
function parseMenuList<T>(dataList: MenuType[]) {
  dataList.forEach((menu) => {
    menu.key = menu.id
    menu.children = dataList.filter((item) => item.parentMenu === menu.id)
    if (!menu.children.length) {
      delete menu.children
    }
  })
  return dataList.filter((item) => !item.parentMenu)
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
    >
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'action'">
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
  >
    <Form
      :model="editRow"
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
          v-model:value="editRow.type"
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
          v-model:value="editRow.menuName"
          placeholder="请输入菜单名称"
        />
      </FormItem>
      <FormItem
        label="上级菜单"
        name="menuName"
      >
        <TreeSelect
          v-model:value="editRow.parentMenu"
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
          v-model:value="editRow.routePath"
          placeholder="请输入路由地址"
        />
      </FormItem>
      <FormItem
        label="组件路径"
        name="component"
        :rules="[{ required: true, message: '请输入组件路径!' }]"
      >
        <Input
          v-model:value="editRow.component"
          placeholder="请输入组件路径"
        />
      </FormItem>
      <FormItem
        label="权限标识"
        name="permission"
        ><Input
          v-model:value="editRow.permission"
          placeholder="请输入组件路径"
        />
      </FormItem>
      <FormItem
        label="状态"
        name="status"
        :rules="[{ required: true, message: '请输入状态!' }]"
      >
        <RadioGroup
          v-model:value="editRow.status"
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
          v-model:value="editRow.isExt"
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
          v-model:value="editRow.keepalive"
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
          v-model:value="editRow.show"
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
          v-model:value="editRow.orderNo"
          placeholder="请输入排序"
        />
      </FormItem>
    </Form>
  </Modal>
</template>
