<script setup lang="ts">
import { useUserStore } from '@packages/store'
import { Tabs, TabPane, UseMenu } from '@packages/components'
import { ref, watchEffect } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const currentSelectedMenuKeys = ref<string>('')
const openKeys = ref<string[]>([])
const openPanes = ref<any[]>([])
const activePaneKey = ref<string>('')
const isCollapsed = ref(false)

watchEffect(() => {
  if (userStore.menuList.length > 0) {
    if (!currentSelectedMenuKeys.value) {
      handleSelectMenu({ key: route.fullPath })
    }
    currentSelectedMenuKeys.value = route.fullPath
    activePaneKey.value = route.fullPath
  }
})

function findMenuInfo(key: string) {
  for (let i = 0; i < userStore.menuList.length; i++) {
    const item = userStore.menuList[i]
    if (item.children && item.children.length) {
      for (let j = 0; j < item.children.length; j++) {
        const child = item.children[j]
        if (key === `${item.path}/${child.path}`) {
          return {
            key,
            title: child.name,
            path: key
          }
        }
      }
    } else {
      if (item.path === key) {
        return {
          key,
          title: item.name,
          path: item.path
        }
      }
    }
  }
  return
}
function handleSelectMenu(menu: any) {
  router.push(menu.key)
  currentSelectedMenuKeys.value = menu.key
  activePaneKey.value = menu.key
  if (openPanes.value.some((pane) => pane.key === menu.key)) {
    activePaneKey.value = menu.key
    return
  }
  addTab(menu.key)
}
async function addTab(key: string) {
  if (openPanes.value.some((pane) => pane.key === key)) {
    activePaneKey.value = key
    return
  }
  const menuInfo = findMenuInfo(key)
  console.log('findMenuInfo', menuInfo)
  if (!menuInfo) {
    return
  }
  openPanes.value.push(menuInfo)
}
function deleteTab(key: any) {
  if (openPanes.value.length === 1) return
  const index = openPanes.value.findIndex((pane) => pane.key === key)
  openPanes.value.splice(index, 1)
  if (activePaneKey.value === key) {
    if (openPanes.value[index]) {
      activePaneKey.value = openPanes.value[index].key
    } else {
      activePaneKey.value = openPanes.value[openPanes.value.length - 1].key
    }
    router.push(activePaneKey.value)
  }
}
function handleChangeTab(key: any) {
  activePaneKey.value = key
  router.push(key)
}
function changeCollapsed() {
  isCollapsed.value = !isCollapsed.value
}
</script>

<template>
  <div class="w-screen h-screen flex w-full text-gray-500 p-0 m-0 overflow-hidden">
    <div
      class="border-r-gray-100 border-solid border-t-none border-r-1"
      :class="isCollapsed ? 'w-20 max-w-20 min-w-20' : 'w-50 max-w-50 min-w-50'"
    >
      <div class="px-2 py-3">
        <div class="flex items-center text-xl font-bold justify-center">
          <img
            src="https://vuejs.org/images/logo.png"
            alt="Vue logo"
            class="w-8 mr-2"
          />
          <template v-if="!isCollapsed">Micro UI</template>
        </div>
      </div>
      <div>
        <UseMenu
          :collapsed="isCollapsed"
          :menu="userStore.menuList"
          :default-active-key="currentSelectedMenuKeys"
          :default-open-keys="openKeys"
          @select="handleSelectMenu"
        />
      </div>
    </div>
    <div class="w-full flex-grow">
      <div class="py-1 items-center border-b-1 border-b-solid border-gray-100 flex h-12 bg-gray-50">
        <div class="w-1/2 flex">
          <div
            v-if="!isCollapsed"
            class="i-tabler:layout-sidebar-left-collapse-filled w-6 h-6 text-gray-400 ml-5 cursor-pointer"
            @click="changeCollapsed"
          ></div>
          <div
            v-else
            class="i-tabler:layout-sidebar-right-collapse-filled w-6 h-6 text-gray-400 ml-5 cursor-pointer"
            @click="changeCollapsed"
          ></div>
        </div>
        <div class="w-1/2 flex justify-end px-2">
          <div class="i-tabler:bell-ringing w-6 h-6 text-gray-400 mr-5"></div>
        </div>
      </div>
      <section class="px-2 py-3">
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
        <div
          class="overflow-y-auto w-full"
          style="height: calc(100vh - 120px)"
        >
          <router-view :key="activePaneKey" />
        </div>
      </section>
    </div>
  </div>
</template>
