<script setup lang="ts">
import type { TabItem } from '~/components/tab/Tabs.vue'

const tabList = ref<TabItem[]>([
  { id: 0, label: '待审核', component: markRaw(defineAsyncComponent(() => import('~/view/desktopAdmin/AuditQueue.vue'))) },
  { id: 1, label: '云桌面分配情况', component: markRaw(defineAsyncComponent(() => import('~/view/desktopAdmin/DesktopAllocation.vue'))) },
  { id: 2, label: '停用列表', component: markRaw(defineAsyncComponent(() => import('~/view/desktopAdmin/DeactivationList.vue'))) },
])
const tab = ref(tabList.value[0].id)
</script>

<template>
  <Tabs v-model="tab" :tab-list="tabList" absolute />
</template>

<style lang="scss" scoped>
:deep(.q-table) {
  thead {
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 1;
  }
  thead, tbody {
    > tr {
      th:last-child, td:last-child {
        position: sticky;
        right: 0;
        background-color: white;
      }
    }
  }
}
</style>

<route lang="yaml">
meta:
  layout: home
</route>
