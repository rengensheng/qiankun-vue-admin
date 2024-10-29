<script setup lang="ts">
import {
  Menu,
  SubMenu,
  MenuItem,
  Layout,
  LayoutHeader,
  LayoutSider,
  LayoutContent,
  Breadcrumb,
  BreadcrumbItem,
} from "@packages/components";
import { ref } from "vue";

const currentSelectedMenuKeys = ref<string[]>(["1"]);
const openKeys = ref<string[]>(["sub1"]);
</script>

<template>
  <Layout class="h-screen">
    <LayoutHeader class="header">
      <div class="text-white flex items-center">
        <img
          src="https://vuejs.org/images/logo.png"
          alt="Vue logo"
          class="w-5 mr-2"
        />
        微服务后台管理系统
      </div>
    </LayoutHeader>
    <Layout>
      <LayoutSider width="200" style="background: transparent">
        <Menu
          v-model:selectedKeys="currentSelectedMenuKeys"
          v-model:openKeys="openKeys"
          mode="inline"
          :style="{ height: '100%', borderRight: 0 }"
        >
          <SubMenu key="sub1">
            <template #title>
              <span class="flex items-center">
                <user-outlined class="mr-2" />
                subnav 1
              </span>
            </template>
            <MenuItem key="1">option1</MenuItem>
            <MenuItem key="2">option2</MenuItem>
            <MenuItem key="3">option3</MenuItem>
            <MenuItem key="4">option4</MenuItem>
          </SubMenu>
        </Menu>
      </LayoutSider>
      <Layout style="padding: 0 24px 24px">
        <Breadcrumb style="margin: 16px 0">
          <BreadcrumbItem>Home</BreadcrumbItem>
        </Breadcrumb>
        <LayoutContent
          :style="{
            background: '#fff',
            padding: '24px',
            margin: 0,
            minHeight: '280px',
          }"
        >
          Content
        </LayoutContent>
      </Layout>
    </Layout>
  </Layout>
</template>
