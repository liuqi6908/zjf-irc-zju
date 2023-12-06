<script setup lang="ts">
import { cmsConfig } from 'shared/constants'
import Page from '~/view/home/index.vue'

const tabList = ref(
  expandArray(
    cmsConfig.map(v => v.children.map(({ id, label, sort }) => ({ id, label, sort, page: v.id })))
  ).sort((a, b) => a.sort - b.sort)
)
const tab = ref(tabList.value[0].id)
</script>

<template>
  <Tabs v-model="tab" :tab-list="tabList" absolute>
    <Page :page="tabList.find(v => v.id === tab)?.page" :id="tab" full />
  </Tabs>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
