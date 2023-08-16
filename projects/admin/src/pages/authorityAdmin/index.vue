<script setup lang="ts">
import type { QTree } from 'quasar'
import type { TabItem } from 'shared/component/base/tab/Tabs.vue'
import Tabs from 'shared/component/base/tab/Tabs.vue'
import AuthAdminTable from '~/view/authorityAdmin/AuthAdminTable.vue'

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
    { name: 'saveRows', label: '操作', align: 'left', field: 'saveRows' },
  ],
  row: [{
    user: 'user',
    realName: 'realName',
    unit: 'unit',
    attachment: ['https://picsum.photos/500/300?t=2', 'https://picsum.photos/500/300?t=3', 'https://picsum.photos/500/300?t='],
    saveRows: '',
    roleAssign: {
      label: '教师',
      value: 'teacher',
    },
  }],
}

const tabList = reactive<TabItem[]>([
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

const roleNames = [{ label: '教师', value: 'teacher' }, { label: '学生', value: 'students' }]

const currentTab = ref<TabItem>()
const tab = ref(tabList[0].id)
</script>

<template>
  <Tabs v-model="tab" :tab-list="tabList" @update:curr-tab-obj="(val) => currentTab = val">
    <AuthAdminTable
      v-if="currentTab?.tableData"
      v-model:rows="currentTab.tableData.row"
      :operation="tab === 'setting' ? ['addRows'] : undefined"
      :col="currentTab?.tableData.col"
      :tree-node="verifyTree"
      :select-list="roleNames"
    />
  </Tabs>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
