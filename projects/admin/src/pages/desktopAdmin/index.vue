<script setup lang="ts">
import type { TabItem } from '~/components/tabTable/TabContent.vue'
import DesktopAdminTable from '~/view/desktopAdmin/DesktopAdminTable.vue'

const requestingTable = {
  col: [
    { name: 'queue', field: 'queue', label: '排队位置' },
    { name: 'status', field: 'status', label: '状态' },
    { name: 'user', field: 'user', label: '用户名' },
    { name: 'realName', field: 'realName', label: '真实姓名' },
    { name: 'identify', field: 'identify', label: '身份' },
    { name: 'verity', field: 'verity', label: '权限' },
    { name: 'requestAt', field: 'requestAt', label: '申请时间', sortable: true, sort: (a, b) => sortByTime() },
    { name: 'requestPeriod', field: 'requestPeriod', label: '申请时长' },
    { name: 'requestAttachment', field: 'requestAttachment', label: '申请材料' },
    { name: 'opAccessReject', field: 'opAccessReject', label: '操作' },
  ],
  row: [],
}
const desktopAssignTable = {
  col: [
    { name: 'couldID', field: 'couldID', label: '云桌面ID' },
    { name: 'virtualID', field: 'virtualID', label: '虚拟机ID' },
    { name: 'networkIP', field: 'networkIP', label: '内网IP地址' },
    { name: 'couldAddr', field: 'couldAddr', label: '云桌面访问地址' },
    { name: 'couldUserCode', field: 'couldUserCode', label: '云桌面账号' },
    { name: 'couldPassword', field: 'couldPassword', label: '云桌面密码' },
    { name: 'endTime', field: 'endTime', label: '到期时间' },
    { name: 'endStatus', field: 'endStatus', label: '状态' },
    { name: 'choseUser', field: 'choseUser', label: '用户' },
    { name: 'opSaveChangeExpires', field: 'opSaveChangeExpires', label: '操作' },
  ],
  row: [],
}

const tabList = ref<TabItem[]>([
  { id: 'requestingList', label: '申请队列', isRequest: false, tableData: requestingTable },
  { id: 'desktopAssign', label: '桌面分配', isRequest: false, tableData: desktopAssignTable },
])
const currentTab = ref<TabItem>()
const tab = ref(tabList.value[0].id)

function sortByTime() {

}
</script>

<template>
  <TabContent v-model="tab" :tab-list="tabList" @update:curr-tab-obj="(val) => currentTab = val">
    <!-- {{ currentTab?.tableData }} -->
    <DesktopAdminTable
      v-if="currentTab?.tableData"
      v-model:rows="currentTab.tableData.row"
      :cols="currentTab?.tableData?.col"
    />
  </TabContent>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
