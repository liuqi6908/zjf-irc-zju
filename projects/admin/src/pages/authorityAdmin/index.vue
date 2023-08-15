<script setup lang="ts">
import type { QTree } from 'quasar'
import type { TabList } from '~/components/tabTable/TabContent.vue'
import AdminTable from '~/view/authorityAdmin/AdminTable.vue'

const settingTable = {
  row: [
    {
      roleName: '浙大老师',
      verify: null,
      downLoadVerify: null,
      operation: 'operation',
    },
  ],
  col: [
    {
      name: 'roleName',
      label: '角色名称',
      align: 'left',
      field: 'roleName',
    },
    { name: 'verify', align: 'left', label: '查看权限', field: 'verify' },
    { name: 'downLoadVerify', label: '下载权限', align: 'left', field: 'downLoadVerify' },
    { name: 'operation', label: '操作', align: 'left', field: 'operation' },
  ],
}

const allocation = {
  col: [
    {
      name: 'user',
      label: '用户',
      align: 'left',
      field: 'user',
    },
    { name: 'realName', align: 'left', label: '真实姓名', field: 'realName' },
    { name: 'email', label: '邮箱', align: 'left', field: 'email' },
    { name: 'unit', label: '单位', align: 'left', field: 'unit' },
    { name: 'attachment', label: '证明材料', align: 'left', field: 'attachment' },
    { name: 'roleAssign', label: '角色分配', align: 'left', field: 'roleAssign' },
  ],
  row: [{
    user: 'user',
    realName: 'realName',
    unit: 'unit',
    attachment: ['https://picsum.photos/500/300?t=2', 'https://picsum.photos/500/300?t=3', 'https://picsum.photos/500/300?t='],
    roleAssign: '教师',
  }],
}

const tabList = reactive<TabList[]>([
  { label: '设置角色', id: 'setting', isRequest: false, tableData: settingTable },
  { label: '分配角色', id: 'allocation', isRequest: false, tableData: allocation },
])

const verifyTree = [
  {
    label: '数据库类型',
    children: [
      { label: '自建数据库' },
      { label: '预购数据库' },
      { label: '公共数据库' },
      {
        label: '已购数据库',
        children: [
          { label: '数字经济' },
        ],
      },
    ],
  },
] as QTree['nodes']

const currentTab = ref<TabList>()

const tab = ref(tabList[0].id)
</script>

<template>
  <TabContent v-model="tab" :tab-list="tabList" @update:curr-tab-obj="(val) => currentTab = val">
    <!-- <q-table
      v-if="currentTab?.tableData"
      :columns="currentTab?.tableData.col"
      :rows="currentTab?.tableData.row"
    /> -->
    <AdminTable
      v-if="currentTab?.tableData"
      v-model:rows="currentTab.tableData.row"
      :header="tab === 'setting' ? ['addBtn'] : undefined"
      :col="currentTab?.tableData.col"
      :tree-node="verifyTree"
    />
  </TabContent>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
