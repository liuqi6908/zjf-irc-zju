<script setup lang="ts">
import type { TabItem } from 'shared/component/base/tab/Tabs.vue'
import Tabs from 'shared/component/base/tab/Tabs.vue'
import { Notify } from 'quasar'
import { cloneDeep } from 'lodash-es'
import type { IQueryDto, IVerificationHistory } from 'zjf-types'
import { PAGINATION_SIZE_MAX } from 'zjf-types'
import AuthAdminTable from '~/view/authorityAdmin/AuthAdminTable.vue'

import { upsertDataRole } from '~/api/dataPermission/upsertDataRole'
import { getDataRolesList } from '~/api/dataPermission/getDataRolesList'
import { queryAllApply } from '~/api/verification/queryAllApply'
import { updateUserRole } from '~/api/auth/user/updateUserRole'

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
      name: 'account',
      label: '用户',
      align: 'left',
      field: 'account',
    },
    { name: 'name', align: 'left', label: '真实姓名', field: 'name' },
    { name: 'email', label: '邮箱', align: 'left', field: 'email' },
    { name: 'unit', label: '单位', align: 'left', field: 'unit' },
    { name: 'attachments', label: '证明材料', align: 'left', field: 'attachments' },
    { name: 'roleAssign', label: '角色分配', align: 'left', field: 'roleAssign' },
    { name: 'saveRows', label: '操作', align: 'left', field: 'saveRows' },
  ],
  row: [],
}

const tabList = reactive<TabItem[]>([
  { label: '设置角色', id: 'setting', isRequest: false, tableData: settingTable },
  { label: '分配角色', id: 'allocation', isRequest: false, tableData: allocation },
])

const currentTab = ref<TabItem>()
const tab = ref(tabList[0].id)
const roles = reactive<string[]>([])

// const roleNames = [{ label: '教师', value: 'teacher' }, { label: '学生', value: 'students' }]

const baseQuery = ({
  page: 0,
  pageSize: PAGINATION_SIZE_MAX,
  filters: [],
  sort: [],
  relations: {
    founder: true,
  },
}) as IQueryDto<IVerificationHistory>

async function saveRole(row: any) {
  if (tab.value === 'setting') {
    const verifyStr: string[] = row.verify || []
    const downLoadStr: string[] = row.downLoadVerify || []

    const res = await upsertDataRole(row.roleName, verifyStr, downLoadStr)
    if (res) {
      Notify.create({
        message: '保存成功',
        type: 'success',
      })
    }
  }
  else {
    const res = await updateUserRole(row.userId, row.roleAssign)
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
      roles.push(cloneRow.name)
      currentTab.value.tableData.row.push({
        roleName: cloneRow.name,
        verify: viewArr,
        downLoadVerify: downloadArr,

      })
    }
  }
}

async function allocationInit() {
  loading.value = true
  const rows = await queryAllApply(baseQuery)
  if (rows) {
    rows.data.forEach((item) => {
      currentTab.value.tableData?.row.push({
        ...item,
        email: item.founder.email,
        unit: item.founder.unit,
        account: item.founder.account,
        userId: item.founder.id,
        roleAssign: item.founder.dataRoleName,
      })
    })
  }
}

watch(tab, async (newTab) => {
  const obj = tabList.find(i => i.id === newTab)
  if (!obj)
    return
  if (obj.isRequest)
    return
  if (newTab === 'setting') {
    await init().finally(() => {
      fetchAllData()
      loading.value = false
    })
  }
  else {
    // const res = await
    await allocationInit().finally(() => {
      loading.value = false
    })
  }

  obj.isRequest = true
}, { immediate: true })
</script>

<template>
  <Tabs v-model="tab" bg-grey-1 :tab-list="tabList" @update:curr-tab-obj="(val) => currentTab = val">
    <AuthAdminTable
      v-if="currentTab?.tableData"
      v-model:rows="currentTab.tableData.row"
      :loading="loading"
      :operation="tab === 'setting' ? ['addRows'] : undefined"
      :col="currentTab?.tableData.col"
      :tree-node="verifyTree"
      :select-list="roles"
      @update:save="saveRole"
    />
  </Tabs>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
