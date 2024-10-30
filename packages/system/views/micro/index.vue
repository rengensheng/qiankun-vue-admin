<script setup lang="ts">
import { useRoute } from "vue-router";
import { useUserStore } from "@packages/store";
import { Route } from "@packages/types";
import { onMounted, onUnmounted, ref } from "vue";
import { loadMicroApp } from "qiankun";

const route = useRoute();
const store = useUserStore();
const microApp = ref<any>(null);

async function getMenuListFlatten(): Promise<Route[]> {
  const sourceMenuList = await store.loadMenuList();
  const menuList: Route[] = [];
  sourceMenuList.forEach((item) => {
    if (item.children && item.children.length) {
      const childMenus: Route[] = [];
      item.children.forEach((child) => {
        childMenus.push({
          ...child,
          path: item.path + "/" + child.path,
        });
      });
      menuList.push(...childMenus);
    } else {
      menuList.push(item);
    }
  });

  return menuList;
}

onMounted(async () => {
  const menuList = await getMenuListFlatten();
  menuList.forEach((menu) => {
    if (menu.path === route.fullPath) {
      console.log('menu', menu);
      microApp.value = loadMicroApp({
        name: menu.name,
        entry: menu.component,
        container: "#sub-app-container",
        props: {
          menu: menu,
        },
        
      }, {
        getPublicPath(entry: any) {
          return entry.substring(0, entry.lastIndexOf("/") + 1).replace('micro/', '');
        },
      });
    }
  });
});
onUnmounted(() => {
  microApp.value?.unmount();
});
</script>

<template>
  <div id="sub-app-container"></div>
</template>
