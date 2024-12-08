<script setup lang="ts">
import { useUserStore } from '@packages/store'
import { Tabs, TabPane, UseMenu, Popover, Dropdown } from '@packages/components'
import SystemNotification from '../../components/SystemNotification.vue'
import { onMounted, ref, watchEffect, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const currentSelectedMenuKeys = ref<string>('')
const openKeys = ref<string[]>([])
const openPanes = ref<any[]>([])
const activePaneKey = ref<string>('')
const isCollapsed = ref(false)
const loadingView = ref(false)
const refresh = ref(false)
const webSiteName = (import.meta as any).env.VITE_APP_NAME || 'Micro UI'

watchEffect(async () => {
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
function handleSetting() {
  console.log('handleSetting')
  router.push('/account/info')
}
function handleExit() {
  localStorage.removeItem('token')
  router.replace('/login')
}
function handleRefresh() {
  refresh.value = true
  nextTick(() => {
    refresh.value = false
  })
}
function handleCloseCurrent(activeKey: string) {
  deleteTab(activeKey)
}
function handleCloseOther(activeKey: string) {
  openPanes.value = openPanes.value.filter((pane) => pane.key === activeKey)
  handleChangeTab(activeKey)
}
onMounted(() => {
  router.beforeEach((_to, _from, next) => {
    loadingView.value = true
    next()
  })
  router.afterEach(() => {
    loadingView.value = false
  })
})
</script>

<template>
  <div class="w-screen h-screen flex w-full text-gray-500 p-0 m-0 overflow-hidden">
    <div
      class="border-r-gray-100 border-r-solid border-t-none border-r-1 transition-property-bg transition-duration-500 transition-ease"
      :class="isCollapsed ? 'w-20 max-w-20 min-w-20' : 'w-50 max-w-50 min-w-50'"
    >
      <div class="px-2 py-3">
        <div class="flex items-center text-xl font-bold justify-center">
          <img
            src="/vite.svg"
            alt="Vue logo"
            class="w-8 mr-2"
          />
          <Transition name="logo">
            <template v-if="!isCollapsed">
              <span class="whitespace-nowrap">{{ webSiteName }}</span>
            </template>
          </Transition>
        </div>
      </div>
      <div>
        <UseMenu
          v-if="userStore.menuList.length > 0"
          :collapsed="isCollapsed"
          :menu="userStore.menuList"
          :default-active-key="currentSelectedMenuKeys"
          :default-open-keys="openKeys"
          @select="handleSelectMenu"
        />
      </div>
    </div>
    <div class="w-full flex-grow">
      <div class="py-1 items-center border-b-1 border-b-solid border-gray-100 flex h-14 bg-gray-50">
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
        <div class="w-1/2 flex justify-end px-2 items-center">
          <SystemNotification />
          <div>
            <Popover
              placement="bottomRight"
              trigger="click"
            >
              <template #content>
                <div class="w-64">
                  <div
                    class="px-2 py-3 flex items-center border-b-1 border-b-solid border-gray-100"
                  >
                    <div>
                      <div class="w-15 h-15 mr-5 rounded-full overflow-hidden">
                        <img
                          v-if="!userStore.user?.avatar"
                          src="/avatar.png"
                          class="w-full h-full"
                        />
                        <img
                          v-else
                          :src="userStore.user?.avatar"
                          class="w-full h-full"
                        />
                      </div>
                    </div>
                    <div>
                      <div class="text-lg font-bold">{{ userStore.user?.realName }}</div>
                      <div class="text-sm">{{ userStore.user?.account }}</div>
                    </div>
                  </div>
                  <div>
                    <div
                      class="px-2 py-3 flex items-center border-b-1 border-b-solid border-gray-100 hover:bg-gray-50 cursor-pointer"
                      @click="handleSetting"
                    >
                      <div class="i-tabler:settings w-6 h-6 text-gray-400 mr-5"></div>
                      <div>用户设置</div>
                    </div>
                    <div
                      class="px-2 py-3 flex items-center hover:bg-gray-50 cursor-pointer"
                      @click="handleExit"
                    >
                      <div class="i-tabler:door-exit w-6 h-6 text-gray-400 mr-5"></div>
                      <div>退出登录</div>
                    </div>
                  </div>
                </div>
              </template>
              <div class="w-8 h-8 mr-5 rounded-full overflow-hidden">
                <img
                  v-if="!userStore.user?.avatar"
                  src="/avatar.png"
                  class="w-full h-full"
                />
                <img
                  v-else
                  :src="userStore.user?.avatar"
                  class="w-full h-full"
                />
              </div>
            </Popover>
          </div>
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
            :closable="true"
          >
            <template #tab>
              <Dropdown :trigger="['contextmenu']">
                <template #overlay>
                  <div
                    class="bg-white shadow-lg border border-solid border-gray-200 rounded-md mt-3"
                  >
                    <div
                      class="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      @click="handleRefresh"
                    >
                      <div class="i-tabler:refresh w-1em h-1em mr-2"></div>
                      <div>刷新页面</div>
                    </div>
                    <div
                      class="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      @click="handleCloseCurrent(pane.key)"
                    >
                      <div class="i-tabler:device-imac-off w-1em h-1em mr-2"></div>
                      <div>关闭当前</div>
                    </div>
                    <div
                      class="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      @click="handleCloseOther(pane.key)"
                    >
                      <div class="i-tabler:device-imac-x w-1em h-1em mr-2"></div>
                      <div>关闭其他</div>
                    </div>
                  </div>
                </template>
                <span>{{ pane.title }}</span>
              </Dropdown>
            </template>
          </TabPane>
        </Tabs>
        <div
          class="overflow-y-auto w-full relative"
          style="height: calc(100vh - 120px)"
        >
          <router-view
            :key="activePaneKey"
            v-if="!refresh"
          />
          <div
            v-if="loadingView"
            class="absolute left-0 right-0 top-0 bottom-0 bg-white flex flex-col justify-center items-center bg-op-70"
          >
            <div class="i-tabler:loader w-10 h-10 text-blue-500 loading-icon -mt-50"></div>
            <div class="text-base text-gray-400 mt-5">正在加载中</div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style>
@keyframes icon-rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.loading-icon {
  animation: icon-rotate 2s linear infinite;
}
.logo-leave-active,
.logo-enter-active {
  opacity: 1;
  width: fit-content;
  transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}

.logo-enter-from,
.logo-leave-to {
  width: 0;
  opacity: 0;
  font-size: 12px;
  z-index: -1;
}
</style>
