<template>
  <div class="sky">
    <div
      class="stars"
      ref="starsRef"
    >
      <div
        class="star"
        v-for="index in starsCount"
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
  background: radial-gradient(200% 100% at bottom center, #f7f7b6, #db6f8e, #1b2947);
  background: radial-gradient(
    200% 105% at top center,
    #1b2947 10%,
    #75517d 40%,
    #e96f92 65%,
    #f7f7b6
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
  transition: all 0.2s linear;
  animation: color-change 5s linear infinite;
  background-image: linear-gradient(
    to right,
    #ff8177 0%,
    #ff867a 10%,
    #8ec5fc 20%,
    #ff8c7f 40%,
    #f99185 30%,
    #ffa6b7 40%,
    #e0c3fc 50%,
    #ff8177 70%,
    #8ec5fc 90%,
    #e77aa2 100%
  );
  background-size: 200% 200%;
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
