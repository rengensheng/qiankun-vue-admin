<script setup lang="ts">
import { Route } from '@packages/types'
import { computed, PropType } from 'vue'
import Icons from './Icons.vue'
import GsButton from './GsButton.vue'

const props = defineProps({
  menu: {
    type: Object as PropType<Route>,
    required: true
  },
  activeKey: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  collapsed: {
    type: Boolean,
    default: false
  }
})
const emits = defineEmits(['change'])

const iconSize = computed(() => {
  const baseCss = 'transition-property-all transition-duration-500 transition-ease'
  const iconCss = props.collapsed ? `w-6 h-6` : 'w-4 h-4 mr-2'
  return `${iconCss} ${baseCss}`
})
function handleChangeMenu() {
  emits('change', props.path)
}
</script>

<template>
  <GsButton
    type="blue"
    class="my-1"
  >
    <div
      class="px-3 py-2 text-base cursor-pointer hover:bg-blue-50 hover:text-sky-600 rounded-md select-none flex items-center"
      :class="{ 'bg-blue-50 text-sky-600': activeKey === path }"
      @click="handleChangeMenu"
    >
      <Icons
        v-if="menu.icon"
        :name="menu.icon"
        :size="iconSize"
      />
      <Transition name="slide-fade">
        <span
          v-if="!collapsed"
          class="block whitespace-nowrap"
          >{{ menu.name }}</span
        >
      </Transition>
    </div>
  </GsButton>
</template>

<style>
.slide-fade-leave-active,
.slide-fade-enter-active {
  width: fit-content;
  opacity: 1;
  transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  width: fit-content;
  opacity: 0;
}
</style>
