<script setup lang="ts">
import { Button } from 'ant-design-vue'
import { onMounted, ref } from 'vue'
const props = defineProps({
  imageUrl: String
})

const blockSize = ref<{
  x: number
  y: number
  width: number
  height: number
}>({
  x: 0,
  y: 0,
  width: 300,
  height: 300
})
const startMoveFlag = ref(false)

function handleUploadAvatar() {
  document.getElementById('uploadImage')?.click()
}
function handleImageChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) {
    return
  }
  const reader = new FileReader()
  reader.onload = function (e) {
    loadDefaultImage(e.target?.result as string)
  }
  reader.readAsDataURL(file)
}
function loadDefaultImage(imageUrl: string) {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement
  const ctx = canvas.getContext('2d')
  const img = new Image()
  img.src = imageUrl
  img.onload = function () {
    const imageWidthScale = 300 / img.width
    const imageHeightScale = 300 / img.height
    const scale = Math.min(imageWidthScale, imageHeightScale)
    const imageWidth = img.width * scale
    const imageHeight = img.height * scale
    ctx?.drawImage(img, (300 - imageWidth) / 2, (300 - imageHeight) / 2, imageWidth, imageHeight)
    handleGetPreview()
  }
}
function handleBlockMove(event: MouseEvent) {
  if (!startMoveFlag.value) {
    return
  }
  const canvas = document.getElementById('canvas') as HTMLCanvasElement
  const rect = canvas.getBoundingClientRect()
  blockSize.value.x = event.clientX - rect.left - blockSize.value.width / 2
  blockSize.value.y = event.clientY - rect.top - blockSize.value.height / 2
  handleGetPreview()
}
function handleGetPreview() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement
  if (!canvas) return
  const previewCanvas = document.getElementById('preview') as HTMLCanvasElement
  const previewCtx = previewCanvas.getContext('2d')
  previewCtx?.clearRect(0, 0, 300, 300)
  previewCtx?.drawImage(
    canvas,
    blockSize.value.x,
    blockSize.value.y,
    blockSize.value.width,
    blockSize.value.height,
    0,
    0,
    300,
    300
  )
}
function handleBlockSizeMinus() {
  blockSize.value.width -= 10
  blockSize.value.height -= 10
  handleGetPreview()
}
function handleBlockSizePlus() {
  blockSize.value.width += 10
  blockSize.value.height += 10
  handleGetPreview()
}
function handleBlockStartMove() {
  startMoveFlag.value = true
}
function handleBlockEndMove() {
  startMoveFlag.value = false
}
function handleGetImageFile() {
  const canvas = document.getElementById('preview') as HTMLCanvasElement
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob as Blob], 'avatar.png', { type: 'image/png' })
          resolve(file)
        } else {
          reject
        }
      })
    } catch (e) {
      reject(e)
    }
  })
}
defineExpose({
  handleGetImageFile
})
onMounted(() => {
  if (props.imageUrl) loadDefaultImage(props.imageUrl)
})
</script>

<template>
  <div class="px-2 py-3">
    <div class="flex justify-between">
      <div>
        <div
          class="relative bg-gray-100 overflow-hidden"
          style="width: 300px; height: 300px"
        >
          <canvas
            id="canvas"
            width="300"
            height="300"
          ></canvas>
          <div
            @mousedown="handleBlockStartMove"
            @mouseup="handleBlockEndMove"
            @mousemove="handleBlockMove"
            @mouseout="handleBlockEndMove"
            class="absolute border-1 border-solid border-white"
            style="background-color: rgba(0, 0, 0, 0.3)"
            :style="{
              width: blockSize.width + 'px',
              height: blockSize.height + 'px',
              left: blockSize.x + 'px',
              top: blockSize.y + 'px'
            }"
          ></div>
        </div>
        <div class="flex py-3 flex justify-around">
          <Button
            type="primary"
            @click="handleUploadAvatar"
            >上传头像</Button
          >
          <Button
            type="primary"
            @click="handleBlockSizePlus"
          >
            <div class="i-tabler:square-rounded-plus w-5 h-5"></div>
          </Button>
          <Button
            type="primary"
            @click="handleBlockSizeMinus"
          >
            <div class="i-tabler:square-rounded-minus w-5 h-5"></div>
          </Button>
        </div>
      </div>
      <div>
        <canvas
          class="bg-gray-300 ml-5"
          id="preview"
          width="300"
          height="300"
        ></canvas>
      </div>
    </div>
  </div>
  <input
    type="file"
    class="hidden"
    id="uploadImage"
    @change="handleImageChange"
  />
</template>
