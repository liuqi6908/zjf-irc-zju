<script setup lang="ts">
import { isClient } from '@vueuse/core'
import { QScrollArea } from 'quasar'

useHead({
  title: '数智三农云科研平台',
  meta: [
    { name: 'description', content: '「数智三农云科研平台」是一整套供科研人员处理分析大数据和开展学术研究的云端超融合系统的简称。' },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: '/favicon.svg',
    },
  ],
})

const el = ref<QScrollArea>()
const route = useRoute()

watch(
  () => route.name,
  () => {
    el.value?.setScrollPosition('vertical', 0)
  },
)

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
  <QScrollArea ref="el" full>
    <RouterView />
  </QScrollArea>
</template>
