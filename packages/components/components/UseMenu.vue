<script setup lang="ts">
import { Route } from '@packages/types'
import SubMenuItem from './SubMenuItem.vue'
import UseMenuItem from './UseMenuItem.vue'
import { PropType, ref } from 'vue'

const props = defineProps({
  menu: {
    type: Array as PropType<Route[]>,
    required: true
  },
  defaultOpenKeys: {
    type: Array as PropType<string[]>,
    default: () => []
  },
  defaultActiveKey: {
    type: String,
    default: ''
  }
})
const emits = defineEmits(['select'])
const openKeys = ref<string[]>(props.defaultOpenKeys)
const activeKey = ref<string>(props.defaultActiveKey)

function handleChangeSubMenu(activeKey: string) {
  if (openKeys.value.includes(activeKey)) {
    openKeys.value = openKeys.value.filter((key) => key !== activeKey)
  } else {
    openKeys.value.push(activeKey)
  }
}
function handleSelectMenu(path: string) {
  activeKey.value = path
  emits('select', {
    key: path
  })
}
function handleOpenParent() {
  props.menu.forEach((item) => {
    if (item.children && item.children.length > 0) {
      handleChangeSubMenu(item.id)
    }
  })
}
handleOpenParent()
</script>

<template>
  <template
    v-for="menuItem in menu"
    :key="menuItem.id"
  >
    <template v-if="menuItem.children && menuItem.children.length > 0">
      <SubMenuItem
        :menu="menuItem"
        v-if="!menuItem.meta || !menuItem.meta.hideMenu"
        :open-keys="openKeys"
        @change="handleChangeSubMenu"
      >
        <template
          v-for="menuChild in menuItem.children"
          :key="menuChild.id"
        >
          <UseMenuItem
            v-if="!menuChild.meta || !menuChild.meta.hideMenu"
            :active-key="activeKey"
            :menu="menuChild"
            :path="menuChild.fullPath"
            @change="handleSelectMenu"
          />
        </template>
      </SubMenuItem>
    </template>
    <template v-else>
      <UseMenuItem
        v-if="!menuItem.meta || !menuItem.meta.hideMenu"
        :active-key="activeKey"
        :menu="menuItem"
        :path="menuItem.fullPath"
        @change="handleSelectMenu"
      />
    </template>
  </template>
</template>
