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
  },
  collapsed: {
    type: Boolean,
    default: false
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
        :collapsed="collapsed"
      >
        <template
          v-for="menuChild in menuItem.children"
          :key="menuChild.id"
        >
          <UseMenuItem
            v-if="!menuChild.meta || !menuChild.meta.hideMenu"
            :active-key="activeKey"
            :menu="menuChild"
            :collapsed="collapsed"
            :path="menuChild.fullPath"
            @change="handleSelectMenu"
          />
        </template>
      </SubMenuItem>
    </template>
    <template v-else>
      <div class="px-3">
        <UseMenuItem
          v-if="!menuItem.meta || !menuItem.meta.hideMenu"
          :active-key="activeKey"
          :menu="menuItem"
          :collapsed="collapsed"
          :path="menuItem.fullPath"
          @change="handleSelectMenu"
        />
      </div>
    </template>
  </template>
</template>
