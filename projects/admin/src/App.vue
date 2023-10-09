<script setup lang="ts">
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
</script>

<template>
  <RouterView />
</template>
