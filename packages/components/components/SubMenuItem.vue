<script setup lang="ts">
import { Route } from '@packages/types'
import { PropType, ref } from 'vue'

defineProps({
  menu: {
    type: Object as PropType<Route>,
    required: true
  },
  openKeys: {
    type: Array as PropType<string[]>,
    required: true
  }
})
const emits = defineEmits(['change'])
function handleChange(activeKey: string) {
  emits('change', activeKey)
}
</script>

<template>
  <div class="px-3">
    <div
      class="flex text-gray-400 hover:text-gray-700 cursor-pointer hover:font-bold py-2 px-1 text-sm group"
      @click="handleChange(menu.id)"
    >
      <div class="mr-1 overflow-hidden transition-all transition-delay-150">
        <div
          v-if="openKeys.includes(menu.id)"
          class="i-tabler:chevron-down w-4 h-4"
        ></div>
        <div
          v-else
          class="i-tabler:chevron-right w-4 h-4"
        ></div>
      </div>
      <div class="select-none">
        {{ menu.name }}
      </div>
    </div>
    <div v-if="openKeys.includes(menu.id)">
      <slot></slot>
    </div>
  </div>
</template>
