<script setup lang="ts">
const props = defineProps({
  name: String,
  size: String,
  color: String
})

function getClass() {
  return `${props.name} ${props.size} ${props.color}`
}
</script>

<template>
  <div v-if="false">
    <div class="i-tabler:device-desktop-analytics w-1em h-1em"></div>
    <div class="i-tabler:brand-airtable w-1em h-1em"></div>
    <div class="i-tabler:user-filled w-1em h-1em"></div>
    <div class="i-tabler:menu-2 w-1em h-1em"></div>
    <div class="i-tabler:user-cog w-1em h-1em"></div>
    <div class="i-tabler:users-group w-1em h-1em"></div>
    <div class="i-tabler:lock-password w-1em h-1em"></div>
    <div class="i-tabler:brand-databricks w-1em h-1em"></div>
    <div class="i-tabler:brand-google-big-query w-1em h-1em"></div>
  </div>
  <div>
    <div :class="getClass()"></div>
  </div>
</template>
