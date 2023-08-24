<script setup lang="ts">
import type { TabItem } from 'shared/component/base/tab/Tabs.vue'
import Tabs from 'shared/component/base/tab/Tabs.vue'
import { type IDesktopQueueHistory, type IQueryConfig, PAGINATION_SIZE_MAX } from 'zjf-types'
import { cloneDeep } from 'lodash-es'
import DesktopAdminTable from '~/view/desktopAdmin/DesktopAdminTable.vue'

import { getDesktopQuery } from '~/api/desktopRequest/getdesktopQuery'
import { desktopQueryList } from '~/api/desktop/desktopsList'

const requestingTable = {
  col: [
    { name: 'status', field: 'status', label: '状态', align: 'center' },
    { name: 'nickname', field: 'nickname', label: '用户名', align: 'center' },
    { name: 'realName', field: 'realName', label: '真实姓名', align: 'center' },
    { name: 'identify', field: 'identify', label: '身份', align: 'center' },
    { name: 'roleName', field: 'roleName', label: '权限', align: 'center' },
    { name: 'createdAt', field: 'createdAt', label: '申请时间', align: 'center' },
    { name: 'duration', field: 'duration', label: '申请时长', align: 'center' },
    { name: 'attachments', field: 'attachments', label: '申请材料', align: 'center' },
    { name: 'operation', field: 'operation', label: '操作', align: 'center' },
  ],
  row: [],
}
const desktopAssignTable = {
  col: [
    { name: 'id', field: 'id', label: '云桌面ID', align: 'center' },
    { name: 'internalIp', field: 'internalIp', label: '云桌面IP地址', align: 'center' },
    { name: 'accessUrl', field: 'accessUrl', label: '云桌面访问地址', align: 'center' },
    { name: 'account', field: 'account', label: '云桌面账号', align: 'center' },
    { name: 'password', field: 'password', label: '云桌面密码', align: 'center' },
    { name: 'expiredAt', field: 'expiredAt', label: '到期时间', align: 'center' },

    { name: 'endStatus', field: 'endStatus', label: '状态', align: 'center' },
    { name: 'choseUser', field: 'choseUser', label: '用户', align: 'center' },
    { name: 'history', field: 'history', label: '历史用户', align: 'center' },

    { name: 'opSaveChangeExpires', field: 'opSaveChangeExpires', label: '操作', align: 'center' },
  ],
  row: [],
}

const tabList = ref<TabItem[]>([
  { id: 'requestingList', label: '审核队列', isRequest: false, tableData: requestingTable },
  { id: 'desktopAssign', label: '桌面分配', isRequest: false, tableData: desktopAssignTable },
])
const currentTab = ref<TabItem>()
const tab = ref()
const queueingList = ref([])

const baseOptions = {
  filters: [],
  pagination: {
    pageSize: PAGINATION_SIZE_MAX,
    page: 0,
  },
  relations: {
    user: true,
  },
} as IQueryConfig<IDesktopQueueHistory>

const options = computed<IQueryConfig<IDesktopQueueHistory>>(() => {
  const base = cloneDeep(baseOptions)
  if (tab.value === 'requestingList') {
    base.sort = [{
      field: 'requestAt',
      order: 'ASC',
    }]
    return base
  }
  else {
    base.filters = [{
      field: 'status',
      type: '=',
      value: 'queueing',
    }]
    return base
  }
})

onBeforeMount(() => {
  tab.value = tabList.value[0].id
})

watch(tab, async (newTab) => {
  const obj = tabList.value.find(i => i.id === newTab)
  if (obj?.isRequest)
    return
  const res = await getDesktopQuery(options.value)
  if (newTab === 'requestingList') {
    res.data.forEach((item: any) => {
      currentTab.value.tableData.row.push({
        ...item,
        nickname: item.user?.nickname || '',
        name: item.user.verification?.name || '',
        roleName: item.user?.roleName || '',
        identify: item.user.verification?.identify || '',
      })
    })
  }
  else {
    res.data.forEach((item: any) => {
      queueingList.value.push(item)
    })
    const desktopList = await desktopQueryList(baseOptions)
    desktopList.data.forEach((item: any) => {
      currentTab.value.tableData?.row.push({
        ...item,
      })
    })
  }

  if (obj)
    obj.isRequest = true
})
</script>

<template>
  <Tabs v-model="tab" :tab-list="tabList" @update:curr-tab-obj="(val) => currentTab = val">
    <DesktopAdminTable
      v-if="currentTab?.tableData"
      v-model:rows="currentTab.tableData.row"
      :tab="tab"
      :queueing-list="queueingList"
      :cols="currentTab?.tableData?.col"
    />
  </Tabs>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
