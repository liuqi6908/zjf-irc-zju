<script setup lang="ts">
import type { Component } from 'vue'
import type { TabItem } from 'shared/component/base/tab/Tabs.vue'
import Tabs from 'shared/component/base/tab/Tabs.vue'

interface Tab extends TabItem {
  component: Component
}

const cols = [
  /** 用户信息 */
  { name: 'account', field: 'founder.account', label: '用户' },
  { name: 'email', field: 'email', label: '邮箱' },
  { name: 'nickname', field: 'founder.nickname', label: '姓名' },
  { name: 'dataRoleName', field: 'founder.dataRoleName', label: '角色' },
  { name: 'roleName', field: 'founder.roleName', label: '权限' },
  /** 云桌面信息 */
  { name: 'desktopId', field: 'desktopId', label: '云桌面ID' },
  { name: 'desktopAccount', field: 'desktop.account', label: '云桌面账号' },
  { name: 'internalIp', field: 'desktop.internalIp', label: '云桌面IP' },
  { name: 'accessUrl', field: 'desktop.accessUrl', label: '访问地址' },
  { name: 'expiredAt', field: 'desktop.expiredAt', label: '到期时间' },
  /** 外发文件信息 */
  { name: 'fileName', field: 'fileName', label: '文件名' },
  { name: 'fileSize', field: 'fileSize', label: '文件大小' },
  { name: 'note', field: 'note', label: '备注信息' },
  /** 其他 */
  { name: 'createdAt', field: 'createdAt', label: '外发时间' },
  { name: 'operation', field: 'operation', label: '操作' },
]

const tabList = ref<Tab[]>([
  { id: 'LargeFileAudit', label: '大文件外发待审核', isRequest: false, component: markRaw(defineAsyncComponent(() => import('~/view/exportFile/LargeFileAudit.vue'))) },
  { id: 'LargeFileRecord', label: '大文件外发审核记录', isRequest: false, component: markRaw(defineAsyncComponent(() => import('~/view/exportFile/LargeFileRecord.vue'))) },
  { id: 'SmallFileRecord', label: '小文件自动外发记录', isRequest: false, component: markRaw(defineAsyncComponent(() => import('~/view/exportFile/SmallFileRecord.vue'))) },
])
const currentTab = ref<Tab>()
const tab = ref(tabList.value[0].id)
</script>

<template>
  <Tabs v-model="tab" class="export-file" :tab-list="tabList" @update:curr-tab-obj="val => currentTab = val">
    <component
      :is="currentTab?.component"
      :title="currentTab?.label"
      :cols="cols"
    />
  </Tabs>
</template>

<style lang="scss" scoped>
.export-file {
  position: absolute;
  display: flex;
  flex-direction: column;
  :deep(.q-tabs) {
    background: transparent;
  }
  :deep(.q-tab-panels) {
    flex: 1;
    background: transparent;
    .q-tab-panel > div {
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
