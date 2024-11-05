<template>
  <div class="sky">
    <div
      class="stars"
      ref="starsRef"
    >
      <div
        class="star"
        v-for="(_item, index) in starsCount"
        :key="index"
      ></div>
    </div>
    <div class="app-name website-logo bg-clip-text">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue'

const starsCount = ref(800)
const distance = ref(900)
const starsRef: any = useTemplateRef('starsRef')

onMounted(() => {
  let starNodes = Array.from(starsRef.value.children)
  starNodes.forEach((item: any) => {
    let speed = 0.2 + Math.random() * 1
    let thisDistance = distance.value + Math.random() * 300
    item.style.transformOrigin = `0 0 ${thisDistance}px`
    item.style.transform = `
        translate3d(0,0,-${thisDistance}px)
        rotateY(${Math.random() * 360}deg)
        rotateX(${Math.random() * -50}deg)
        scale(${speed},${speed})`
  })
})
</script>

<style lang="css" scoped>
.sky {
  position: absolute;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(
    200% 105% at top center,
    #1c81e6cc 10%,
    #266a9ecc 40%,
    #2d4e94cc 65%,
    #594e7acc
  );
  background-attachment: fixed;
  overflow: hidden;
}

@keyframes rotate {
  0% {
    transform: perspective(400px) rotateZ(20deg) rotateX(-40deg) rotateY(0);
  }
  100% {
    transform: perspective(400px) rotateZ(20deg) rotateX(-40deg) rotateY(-360deg);
  }
}
.stars {
  transform: perspective(500px);
  transform-style: preserve-3d;
  position: absolute;
  perspective-origin: 50% 100%;
  left: 45%;
  animation: rotate 90s infinite linear;
  bottom: 0;
}
.star {
  width: 2px;
  height: 2px;
  background: #f7f7b6;
  position: absolute;
  left: 0;
  top: 0;
  backface-visibility: hidden;
}

.website-logo {
  text-shadow:
    1px 1px 0 #726d77,
    2px 2px 0 #7e7877,
    3px 3px 0 #9e9a9a,
    4px 4px 0 #928f8f;
  color: #f7f7f5;
}
@keyframes color-change {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
