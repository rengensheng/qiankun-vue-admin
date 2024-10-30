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
  Space,
  message,
} from "@packages/components";
import { useDict } from "@packages/hooks";
import type { PaginationProps } from "@packages/components";
import {
  getAccountList,
  deleteAccount,
  createAccount,
  updateAccount,
} from "@packages/api/account";
import { ref, watchEffect } from "vue";
import { AccountType, DictOption } from "@packages/types";
const dataSource = ref<AccountType[]>([]);
const openModal = ref<boolean>(false);
const editRecord = ref<any>();
const roleOptions = ref<DictOption[]>([]);
const deptOptions = ref<DictOption[]>([]);
const pagination = ref<PaginationProps>({
  current: 1,
  pageSize: 10,
  total: 0,
  onChange: (page: number, pageSize: number) => {
    pagination.value.current = page;
    pagination.value.pageSize = pageSize;
  },
});
const columns = [
  {
    title: "用户名",
    dataIndex: "account",
  },
  {
    title: "昵称",
    dataIndex: "nickname",
  },
  {
    title: "邮箱",
    dataIndex: "email",
  },
  {
    title: "角色",
    dataIndex: "role",
  },
  {
    title: "创建时间",
    dataIndex: "createdTime",
  },
  {
    title: "备注",
    dataIndex: "remark",
  },
  {
    title: "操作",
    dataIndex: "action",
  },
];
async function loadDict() {
  roleOptions.value = await useDict("/api/role/list", "roleName", "roleValue");
  deptOptions.value = await useDict("/api/dept/list", "deptName", "id");
}
loadDict();
async function getList() {
  const res = await getAccountList(
    pagination.value.current,
    pagination.value.pageSize
  );
  if (res.result && res.result.items) {
    dataSource.value = res.result.items;
    pagination.value.total = res.result.total;
  }
}
function handleOpenCreateUser() {
  editRecord.value = {};
  openModal.value = true;
}
function handleOpenEditUser(record: AccountType) {
  editRecord.value = { ...record };
  openModal.value = true;
}
function handleSaveUser() {
  if (editRecord.value.id) {
    handleUpdate(editRecord.value);
  } else {
    handleCreate(editRecord.value);
  }
}
function handleCreate(record: AccountType) {
  createAccount(record)
    .then(() => {
      openModal.value = false;
      getList();
      message.success("创建成功");
    })
    .catch((e) => {
      message.error(e.message);
    });
}
function handleUpdate(record: AccountType) {
  updateAccount(record)
    .then(() => {
      openModal.value = false;
      getList();
      message.success("编辑成功");
    })
    .catch((e) => {
      message.error(e.message);
    });
}
async function handleDelete(record: AccountType) {
  await deleteAccount(record.id);
  getList();
}
watchEffect(() => {
  getList();
});
</script>

<template>
  <div class="px-2">
    <div class="py-2 px-2">
      <h2 class="text-xl font-bold">账号管理</h2>
    </div>
    <div class="py-2">
      <Button type="primary" @click="handleOpenCreateUser">新建用户</Button>
    </div>
    <Table :columns="columns" :dataSource="dataSource" :pagination="false">
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
  <Modal v-model:open="openModal" title="用户信息" @ok="handleSaveUser">
    <Form
      :model="editRecord"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 14 }"
      autocomplete="off"
    >
      <FormItem
        label="账户名"
        name="account"
        :rules="[{ required: true, message: '请输入账户名!' }]"
      >
        <Input v-model:value="editRecord.account" placeholder="请输入账户名" />
      </FormItem>
      <FormItem
        label="角色"
        name="role"
        :rules="[{ required: true, message: '请输入角色!' }]"
      >
        <Select
          v-model:value="editRecord.role"
          placeholder="请选择角色"
          :options="roleOptions"
        />
      </FormItem>
      <FormItem label="所属部门" name="dept">
        <Select
          v-model:value="editRecord.dept"
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
          v-model:value="editRecord.nickname"
          placeholder="请输入用户昵称"
        />
      </FormItem>
      <FormItem
        label="邮箱"
        name="email"
        :rules="[{ required: true, message: '请输入邮箱!' }]"
      >
        <Input v-model:value="editRecord.email" placeholder="请输入邮箱" />
      </FormItem>
      <FormItem label="备注" name="remark">
        <Input.TextArea
          v-model:value="editRecord.remark"
          placeholder="请输入备注"
        />
      </FormItem>
    </Form>
  </Modal>
</template>
