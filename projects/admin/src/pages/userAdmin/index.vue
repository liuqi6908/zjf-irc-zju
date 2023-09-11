<script setup lang="ts">
import type { TabItem } from '~/components/tab/Tabs.vue'

const tabList = ref<TabItem[]>([
  { id: 0, label: '注册用户', component: markRaw(defineAsyncComponent(() => import('~/view/userAdmin/AllUser.vue'))) },
  { id: 1, label: '待审核', component: markRaw(defineAsyncComponent(() => import('~/view/userAdmin/CheckPending.vue'))) },
  { id: 2, label: '已认证', component: markRaw(defineAsyncComponent(() => import('~/view/userAdmin/Authenticated.vue'))) },
  { id: 3, label: '驳回记录', component: markRaw(defineAsyncComponent(() => import('~/view/userAdmin/RejectList.vue'))) },
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
