<script setup lang="ts">
import type { TabItem } from '~/components/tab/Tabs.vue'

const cols = [
  /** 用户信息 */
  { name: 'account', field: 'founder.account', label: '用户' },
  { name: 'email', field: 'email', label: '邮箱' },
  { name: 'name', field: 'founder.verification.name', label: '姓名' },
  /** 云桌面信息 */
  { name: 'ip', field: 'ip', label: '外发IP' },
  /** 外发文件信息 */
  { name: 'fileName', field: 'fileName', label: '文件名' },
  { name: 'fileSize', field: 'fileSize', label: '文件大小' },
  { name: 'note', field: 'note', label: '备注信息' },
  /** 其他 */
  { name: 'createdAt', field: 'createdAt', label: '外发时间' },
  { name: 'operation', field: 'operation', label: '操作' },
]

const tabList = ref<TabItem[]>([
  { id: 0, label: '大文件外发待审核', component: markRaw(defineAsyncComponent(() => import('~/view/exportFile/LargeFileAudit.vue'))), params: { cols } },
  { id: 1, label: '大文件外发审核记录', component: markRaw(defineAsyncComponent(() => import('~/view/exportFile/LargeFileRecord.vue'))), params: { cols } },
  { id: 2, label: '小文件自动外发记录', component: markRaw(defineAsyncComponent(() => import('~/view/exportFile/SmallFileRecord.vue'))), params: { cols } },
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
