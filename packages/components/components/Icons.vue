<script setup lang="ts">
const props = defineProps({
  name: String,
  size: String,
  color: String
})

function getClass() {
  // 判断是否存在，不存在就写入到文件中
  return `${props.name} ${props.size} ${props.color}`
}
</script>

<template>
  <div>
    <div :class="getClass()"></div>
  </div>
</template>
