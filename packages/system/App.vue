<script setup lang="ts">
import { useUserStore } from "@packages/store";
const userStore = useUserStore();
userStore.getUserInfo();
</script>

<template>
  <router-view />
</template>