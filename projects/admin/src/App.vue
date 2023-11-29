<script setup lang="ts">
import { isClient } from '@vueuse/core'

useHead({
  title: '智能云科研平台-管理后台',
  meta: [
    { name: 'description', content: '「智能云科研平台」是一整套供科研人员处理分析大数据和开展学术研究的云端超融合系统的简称。' },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: '/favicon.svg',
    },
  ],
})

const { width } = useWindowSize()
watch(
  width,
  (newVal) => {
    if (isClient) {
      nextTick(() => {
        const body = document.body
        const base = 1290
        if (body) {
          if (newVal < base) {
            body.style.transform = `scale(${newVal / base})`
            body.style.width = `${base / newVal * 100}%`
            body.style.height = `${base / newVal * 100}%`
          }
          else {
            body.style.transform = ''
            body.style.width = '100%'
            body.style.height = '100%'
          }
        }
      })
    }
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <RouterView />
</template>
