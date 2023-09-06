<script setup lang="ts">
import type { Component } from 'vue'
import type { TabItem } from 'shared/component/base/tab/Tabs.vue'
import Tabs from 'shared/component/base/tab/Tabs.vue'

interface Tab extends TabItem {
  component: Component
}

export interface QueryDesktop {
  page: number
  pageSize: number
  total: number
  data: any[]
}

const tabList = ref<Tab[]>([
  { id: 'AuditQueue', label: '审核队列', isRequest: false, component: markRaw(defineAsyncComponent(() => import('~/view/desktopAdmin/AuditQueue.vue'))) },
  { id: 'DesktopAllocation', label: '桌面分配', isRequest: false, component: markRaw(defineAsyncComponent(() => import('~/view/desktopAdmin/DesktopAllocation.vue'))) },
  { id: 'DeactivationList', label: '已停用列表', isRequest: false, component: markRaw(defineAsyncComponent(() => import('~/view/desktopAdmin/DeactivationList.vue'))) },
])
const currentTab = ref<Tab>()
const tab = ref(tabList.value[0].id)
</script>

<template>
  <Tabs v-model="tab" class="desktop-admin" :tab-list="tabList" @update:curr-tab-obj="val => currentTab = val">
    <component :is="currentTab?.component" :title="currentTab?.label" />
  </Tabs>
</template>

<style lang="scss" scoped>
.desktop-admin {
  position: absolute;
  display: flex;
  flex-direction: column;

  :deep(.q-tabs) {
    background: transparent;
  }

  :deep(.q-tab-panels) {
    flex: 1;
    background: transparent;

    .q-tab-panel>div {
      height: 100%;
      padding: 1.5rem;

      .q-table {
        thead {
          position: sticky;
          top: 0;
          background-color: white;
          z-index: 1;
        }
      }
    }
  }
}
</style>

<route lang="yaml">
meta:
  layout: home
</route>
