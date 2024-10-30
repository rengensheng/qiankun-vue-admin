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
  Tabs,
  TabPane,
} from "@packages/components";
import { ref, watchEffect } from "vue";
import { useRouter, useRoute } from "vue-router";

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const currentSelectedMenuKeys = ref<string[]>([]);
const openKeys = ref<string[]>([]);
const openPanes = ref<any[]>([]);
const activePaneKey = ref<string>("");

watchEffect(() => {
  if (userStore.menuList.length > 0) {
    if (currentSelectedMenuKeys.value.length === 0) {
      handleSelectMenu({ key: route.fullPath });
    }
    currentSelectedMenuKeys.value = [route.fullPath];
    activePaneKey.value = route.fullPath;
  }
});

function findMenuInfo(key: string) {
  for (let i = 0; i < userStore.menuList.length; i++) {
    const item = userStore.menuList[i];
    if (item.children && item.children.length) {
      for (let j = 0; j < item.children.length; j++) {
        const child = item.children[j];
        if (key === `${item.path}/${child.path}`) {
          return {
            key,
            title: child.name,
            path: key,
          };
        }
      }
    } else {
      if (item.path === key) {
        return {
          key,
          title: item.name,
          path: item.path,
        };
      }
    }
  }
  return;
}
function handleSelectMenu(menu: any) {
  router.push(menu.key);
  currentSelectedMenuKeys.value = [menu.key];
  activePaneKey.value = menu.key;
  if (openPanes.value.some((pane) => pane.key === menu.key)) {
    activePaneKey.value = menu.key;
    return;
  }
  addTab(menu.key);
}
async function addTab(key: string) {
  if (openPanes.value.some((pane) => pane.key === key)) {
    activePaneKey.value = key;
    return;
  }
  const menuInfo = findMenuInfo(key);
  console.log("findMenuInfo", menuInfo);
  if (!menuInfo) {
    return;
  }
  openPanes.value.push(menuInfo);
}
function deleteTab(key: any) {
  const index = openPanes.value.findIndex((pane) => pane.key === key);
  openPanes.value.splice(index, 1);
  if (activePaneKey.value === key) {
    if (openPanes.value[index]) {
      activePaneKey.value = openPanes.value[index].key;
    } else {
      activePaneKey.value = openPanes.value[openPanes.value.length - 1].key;
    }
    router.push(activePaneKey.value);
  }
}
function handleChangeTab(key: any) {
  activePaneKey.value = key;
  router.push(key);
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
          @select="handleSelectMenu"
          :style="{ height: '100%', borderRight: 0 }"
        >
          <template
            v-for="(menuItem, index) in userStore.menuList"
            :key="index"
          >
            <SubMenu v-if="menuItem.children?.length" :key="menuItem.name">
              <template #title>
                <span class="flex items-center">
                  {{ menuItem.name }}
                </span>
              </template>
              <template
                v-for="menuChildItem in menuItem.children"
                :key="menuChildItem.path"
              >
                <MenuItem
                  :key="menuItem.path + '/' + menuChildItem.path"
                  v-if="!menuChildItem.meta || !menuChildItem.meta.hideMenu"
                  >{{ menuChildItem.name }}</MenuItem
                >
              </template>
            </SubMenu>
            <MenuItem
              v-else
              :key="menuItem.path"
              v-if="!menuItem.meta || !menuItem.meta.hideMenu"
              >{{ menuItem.name }}</MenuItem
            >
          </template>
        </Menu>
      </LayoutSider>
      <Layout style="padding: 10px 24px 24px">
        <LayoutContent
          :style="{
            background: '#fff',
            padding: '10px 20px',
            minHeight: '280px',
          }"
        >
          <Tabs
            v-model:activeKey="activePaneKey"
            hide-add
            type="editable-card"
            @change="handleChangeTab"
            @edit="deleteTab"
          >
            <TabPane
              v-for="pane in openPanes"
              :key="pane.key"
              :tab="pane.title"
              :closable="true"
            >
            </TabPane>
          </Tabs>
          <router-view :key="activePaneKey" />
        </LayoutContent>
      </Layout>
    </Layout>
  </Layout>
</template>
