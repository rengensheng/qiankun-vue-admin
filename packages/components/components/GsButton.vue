<script setup lang="ts">
import { ref } from 'vue'
defineProps({
  type: {
    type: String,
    default: 'white'
  }
})
const bgMap: Record<string, string> = {
  white: 'rgba(255, 255, 255, 0.5)',
  black: 'rgba(0, 0, 0, 0.2)',
  blue: 'rgba(50, 100, 200, 0.2)'
}
const emits = defineEmits(['click'])
const showRipple = ref<boolean>(false)
const ripplePosition = ref<{
  x: number
  y: number
  width: number
  height: number
}>({ x: 0, y: 0, width: 0, height: 0 })
function handleClick(event: MouseEvent) {
  showRipple.value = false
  setTimeout(() => {
    showRipple.value = false
  }, 500)
  if (!event || !event.currentTarget) {
    return emits('click', event)
  }
  const { clientX, clientY } = event
  const targetElem = event.currentTarget as HTMLElement
  const { left, top, width, height } = targetElem.getBoundingClientRect()
  const rippleSize = Math.max(width, height) / 2
  ripplePosition.value = {
    x: clientX - left - rippleSize / 2,
    y: clientY - top - rippleSize / 2,
    width: rippleSize,
    height: rippleSize
  }
  showRipple.value = true
  setTimeout(() => {
    emits('click', event)
  }, 100)
}
</script>

<template>
  <div
    @click="handleClick"
    class="gs-button"
  >
    <div
      :class="{ ripple: showRipple }"
      style="display: none"
      :style="{
        top: ripplePosition.y + 'px',
        left: ripplePosition.x + 'px',
        width: ripplePosition.width + 'px',
        height: ripplePosition.height + 'px',
        backgroundColor: bgMap[type]
      }"
    ></div>
    <slot></slot>
  </div>
</template>

<style>
.gs-button {
  position: relative;
  overflow: hidden;
  user-select: none;
}
.ripple {
  display: block !important;
  position: absolute;
  border-radius: 50%;
  transform: scale(0);
  animation: ripple 0.3s linear;
}
@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}
</style>
