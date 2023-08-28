<script setup lang="ts">
import type { TabItem } from 'shared/component/base/tab/Tabs.vue'
import Tabs from 'shared/component/base/tab/Tabs.vue'
import { DesktopQueueStatus, type IDesktop, type IQueryConfig, PAGINATION_SIZE_MAX } from 'zjf-types'
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

    { name: 'disabled', field: 'disabled', label: '状态', align: 'center' },
    { name: 'choseUser', field: 'choseUser', label: '用户', align: 'center' },
    { name: 'lastUser', field: 'lastUser', label: '历史用户', align: 'center' },

    { name: 'opSaveChangeExpires', field: 'opSaveChangeExpires', label: '操作', align: 'center' },
  ],
  row: [],
}

const desktopStopListTable = {
  col: [
    { name: 'id', field: 'id', label: '云桌面ID', align: 'center' },
    { name: 'internalIp', field: 'internalIp', label: '云桌面IP地址', align: 'center' },
    { name: 'accessUrl', field: 'accessUrl', label: '云桌面访问地址', align: 'center' },
    { name: 'account', field: 'account', label: '云桌面账号', align: 'center' },
    { name: 'password', field: 'password', label: '云桌面密码', align: 'center' },
    { name: 'expiredAt', field: 'expiredAt', label: '到期时间', align: 'center' },

    { name: 'disabled', field: 'disabled', label: '状态', align: 'center' },
    { name: 'lastUser', field: 'lastUser', label: '历史用户', align: 'center' },

    { name: 'opSaveChangeExpires', field: 'opSaveChangeExpires', label: '操作', align: 'center' },
  ],
  row: [],
}

const tabList = ref<TabItem[]>([
  { id: 'requestingList', label: '审核队列', isRequest: false, tableData: requestingTable },
  { id: 'desktopAssign', label: '桌面分配', isRequest: false, tableData: desktopAssignTable },
  { id: 'desktopStopList', label: '已停用列表', isRequest: false, tableData: desktopStopListTable },
])
const currentTab = ref<TabItem>()
const tab = ref()
const queueingList = ref([])

const baseOptions: IQueryConfig<IDesktop> = {
  pagination: {
    pageSize: PAGINATION_SIZE_MAX,
    page: 0,
  },
  relations: {
    user: { verification: true },
  },
}

/** 获取云桌面申请需要的参数 */
const options = computed(() => {
  const base = cloneDeep(baseOptions)
  if (tab.value === 'requestingList') {
    base.sort = [{
      field: 'createdAt',
      order: 'ASC',
    }]
    base.filters = [
      {
        field: 'status',
        type: 'IN',
        value: [DesktopQueueStatus.Pending],
      },
    ]
    return base
  }
  else if (tab.value === 'desktopAssign') {
    base.filters = [
      {
        field: 'status',
        type: 'IN',
        value: [DesktopQueueStatus.Queueing],
      },
    ]
    return base
  }
  else {
    return base
  }
})

/** 获取云桌面列表所需要的参数 */
const listOptions = computed(() => {
  const base = cloneDeep(baseOptions)
  base.relations = { lastUser: true }
  return base
})

/**
 *
 * @param isDisable 是否停用云桌面
 */
async function fetchDesktopList(isDisable?: boolean) {
  listOptions.value.filters = [
    {
      field: 'disabled',
      type: '=',
      value: isDisable,
    },
  ]
  const desktopList = await desktopQueryList(listOptions.value)
  if (!currentTab.value || !currentTab.value.tableData)
    return

  currentTab.value.tableData.row = desktopList.data.map((item: any) => {
    return {
      ...item,
      lastUser: item.lastUser?.id,
      opSaveChangeExpires: !isDisable,
    }
  })
}

async function fetchDesktopRequest() {
  const res = await getDesktopQuery(options.value)
  if (!currentTab.value || !currentTab.value.tableData)
    return
  currentTab.value.tableData.row = res.data.map((item: any) => {
    return {
      ...item,
      nickname: item.user?.nickname,
      name: item.user.verification?.name,
      roleName: item.user?.roleName,
      identify: item.user?.verification?.identify,
    }
  })
  if (res && res.data)
    return res.data
}

onBeforeMount(() => {
  tab.value = tabList.value[0].id
})

watch(tab, async (newTab) => {
  const obj = tabList.value.find(i => i.id === newTab)

  if (obj?.isRequest)
    return

  if (!currentTab.value || !currentTab.value.tableData)
    return

  if (newTab === 'requestingList') {
    await fetchDesktopRequest()
  }
  else if (newTab === 'desktopAssign') {
    const res = await fetchDesktopRequest()
    queueingList.value = res.map((item: any) => item)
    fetchDesktopList(false)
  }
  else if (newTab === 'desktopStopList') {
    fetchDesktopList(true)
  }

  if (obj)
    obj.isRequest = true
})
</script>

<template>
  <Tabs v-model="tab" bg-grey-1 :tab-list="tabList" @update:curr-tab-obj="(val) => currentTab = val">
    <DesktopAdminTable
      v-if="currentTab?.tableData && (tab === 'requestingList' || tab === 'desktopAssign')"
      v-model:rows="currentTab.tableData.row"
      :tab="tab"
      :queueing-list="queueingList"
      :cols="currentTab?.tableData?.col"
    />

    <BaseTable
      v-else-if=" currentTab?.tableData && tab === 'desktopStopList'"
      v-slot="{ props, col }"
      :cols="currentTab?.tableData.col"
      :rows="currentTab?.tableData?.row"
    >
      <div v-if="col === 'opSaveChangeExpires'">
        <q-btn color="grey-8" :disable="true" label="停用" />
      </div>
      <div v-else-if="col === 'disabled'">
        {{ props.row[`${col}`] ? '停用' : '' }}
      </div>
      <div v-else>
        {{ props.row[`${col}`] }}
      </div>
    </BaseTable>
  </Tabs>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
