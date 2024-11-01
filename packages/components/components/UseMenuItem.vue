<script setup lang="ts">
import { Route } from '@packages/types'
import { PropType } from 'vue'
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
  }
})
const emits = defineEmits(['change'])
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
        size="w-4 h-4 mr-2"
      />
      {{ menu.name }}
    </div>
  </GsButton>
</template>
