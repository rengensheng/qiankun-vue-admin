<script setup lang="ts">
import { useUserStore } from "@packages/store";
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
import { nextTick, ref, watchEffect } from "vue";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();
const currentSelectedMenuKeys = ref<string[]>([""]);
const openKeys = ref<string[]>([]);
watchEffect(() => {
  if (userStore.menuList.length > 0) {
    if (userStore.menuList[0].children?.length) {
      currentSelectedMenuKeys.value = [userStore.menuList[0].children[0].path];
    } else {
      currentSelectedMenuKeys.value = [userStore.menuList[0].path];
    }
    openKeys.value = [userStore.menuList[0].path];
  }
});
function onSelect() {
  console.log("onSelect");
  nextTick(() => {
    router.push("/sub/vue3");
  });
}
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
          <template v-for="menuItem in userStore.menuList" :key="menuItem.path">
            <SubMenu v-if="menuItem.children?.length" :key="menuItem.path">
              <template #title>
                <span class="flex items-center">
                  {{ menuItem.name }}
                </span>
              </template>
              <MenuItem
                v-for="menuChildItem in menuItem.children"
                :key="menuChildItem.path"
                >{{ menuChildItem.name }}</MenuItem
              >
            </SubMenu>
            <MenuItem v-else :key="menuItem.path + '-' + menuItem.name">{{
              menuItem.name
            }}</MenuItem>
          </template>
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
          <button @click="onSelect">显示</button>
          <router-view />
        </LayoutContent>
      </Layout>
    </Layout>
  </Layout>
</template>
