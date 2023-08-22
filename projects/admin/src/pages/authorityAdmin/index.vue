<script setup lang="ts">
import type { TabItem } from 'shared/component/base/tab/Tabs.vue'
import Tabs from 'shared/component/base/tab/Tabs.vue'
import { Notify } from 'quasar'
import { cloneDeep } from 'lodash-es'
import AuthAdminTable from '~/view/authorityAdmin/AuthAdminTable.vue'

import { upsertDataRole } from '~/api/dataPermission/upsertDataRole'
import { getDataRolesList } from '~/api/dataPermission/getDataRolesList'

const { fetchAllData, verifyTree, loading } = useDataBase()

const settingTable = {
  row: [
    // {
    //   roleName: '浙大老师',
    //   verify: null,
    //   downLoadVerify: null,
    //   operation: 'operation',
    // },
  ] as Array<{ rolName: string; verify: string[]; downLoadVerify: string[]; operation: any }>,
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

const currentTab = ref<TabItem>()
const tab = ref(tabList[0].id)

const roleNames = [{ label: '教师', value: 'teacher' }, { label: '学生', value: 'students' }]

async function saveRole(row: any) {
  if (tab.value === 'setting') {
    let verifyStr: string[] = []
    let downLoadStr: string[] = []
    if (row.verify)
      verifyStr = row.verify.map(item => item.id)

    if (row.downLoadVerify)
      downLoadStr = row.downLoadVerify.map(item => item.id)

    const res = await upsertDataRole(row.roleName, verifyStr, downLoadStr)
    if (res) {
      Notify.create({
        message: '保存成功',
        type: 'success',
      })
    }
  }
}

async function init() {
  loading.value = true
  const rows = await getDataRolesList()
  if (rows) {
    for (const row of rows) {
      const cloneRow = cloneDeep(row)
      const viewArr = cloneRow.viewDirectories.map(i => i.id)
      const downloadArr = cloneRow.downloadDirectories.map(i => i.id)
      currentTab.value.tableData.row.push({
        roleName: cloneRow.name,
        verify: viewArr,
        downLoadVerify: downloadArr,
      })
    }
  }
  loading.value = false
}

watch(tab, async (newTab) => {
  const obj = tabList.find(i => i.id === newTab)
  if (!obj)
    return
  if (obj.isRequest)
    return
  if (newTab === 'setting') {
    fetchAllData()
    await init()
    obj.isRequest = true
  }
}, { immediate: true })
</script>

<template>
  <Tabs v-model="tab" :tab-list="tabList" @update:curr-tab-obj="(val) => currentTab = val">
    <AuthAdminTable
      v-if="currentTab?.tableData"
      v-model:rows="currentTab.tableData.row"
      :loading="loading"
      :operation="tab === 'setting' ? ['addRows'] : undefined"
      :col="currentTab?.tableData.col"
      :tree-node="verifyTree"
      :select-list="roleNames"
      @update:save="saveRole"
    />
  </Tabs>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
