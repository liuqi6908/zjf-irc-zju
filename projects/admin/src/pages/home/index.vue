<script setup lang="ts">
import { cmsConfig } from 'shared/constants'
import type { TabItem } from '~/components/tab/Tabs.vue'
import Page from '~/view/home/index.vue'

const tabList = ref<TabItem[]>(
  cmsConfig.find(v => v.id === 'home')?.children.map((v) => {
    return {
      id: v.id,
      label: v.label,
    }
  }) || [],
)
const tab = ref(tabList.value[0].id)
</script>

<template>
  <Tabs v-model="tab" :tab-list="tabList" absolute>
    <Page :id="tab" page="home" full />
  </Tabs>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
