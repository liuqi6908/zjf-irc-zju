<script setup lang="ts">
import type { IQueryDto, IUser } from 'zjf-types'
import { PAGINATION_SIZE_MAX } from 'zjf-types'
import { Notify, useQuasar } from 'quasar'
import BaseTable from '~/components/table/BaseTable.vue'

import { searchUserQuery } from '~/api/auth/user/searchUserQuery'
import { getUrlByToken } from '~/api/file/getUrl'
import { updateRole } from '~/api/auth/user/updateRole'

const adminCols = [
  { name: 'account', field: 'account', label: '用户名', align: 'center' },
  { name: 'name', field: 'name', label: '真实姓名', align: 'center' },
  { name: 'email', field: 'email', label: '邮箱', align: 'center' },
  { name: 'school', field: 'school', label: '学校', align: 'center' },
  { name: 'college', field: 'college', label: '学院', align: 'center' },
  { name: 'identify', field: 'identify', label: '身份', align: 'center' },
  { name: 'registerAt', field: 'registerAt', label: '注册时间', align: 'center' },
  { name: 'createdAt', field: 'createdAt', label: '认证时间', align: 'center' },
  { name: 'attachments', field: 'attachments', label: '证明材料', align: 'center' },
  { name: 'admin', field: 'admin', label: '管理员', align: 'center' },
]
const adminRows = ref([])
const searchByUser = ref('')

const $q = useQuasar()

const baseOptions: IQueryDto<IUser> = {
  pagination: {
    page: 0,
    pageSize: PAGINATION_SIZE_MAX,
  },
  filters: [

  ],
  sort: [

  ],
  relations: {
    verification: true,
  },
}

async function fetchUser(options: IQueryDto<IUser>) {
  const res = await searchUserQuery(options)

  adminRows.value = res.data.map((item) => {
    const { createdAt, name, school, college, attachments } = item.verification || ''

    return {
      ...item,
      registerAt: item.createdAt,
      userId: item.id,
      createdAt,
      name,
      school,
      college,
      attachments,
    }
  })
}

onMounted(async () => {
  fetchUser(baseOptions)
})

function checkAttachment(row: any) {
  let message = ''
  if (row.attachments && row.attachments.length) {
    row.attachments.forEach((filename: string) => {
      const src = getUrlByToken(`file/private/verify/${row.userId}/${filename}`)
      message += `<img src=${src} /><a href=${src} download>点击下载文件</a><br/>`
    })
  }
  else {
    message = '当前用户暂无认证材料'
  }

  $q.dialog({
    title: '查看认证材料',
    message,
    html: true,
  })
}

function approveAdmin(row: any) {
  $q.dialog({
    message: '是否给当前用户分配管理员？',
    cancel: true,
  }).onOk(async () => {
    const res = await updateRole(row.userId, 'root')
    if (res) {
      Notify.create({
        message: '分配管理员操作成功',
        type: 'success',
      })
    }
  })
}

watch(searchByUser, async (searchVal) => {
  const base = { ...baseOptions }
  base.filters = [{ field: 'account', type: 'LIKE', value: searchVal }]
  await fetchUser(base)
})
</script>

<template>
  <div full>
    <BaseTable v-slot="{ props, col }" v-model:search="searchByUser" full min-h-3xl :cols="adminCols" :rows="adminRows" :operation="['search']">
      <div v-if="col === 'attachments'">
        <q-btn flat color="primary-1" label="查看认证材料" @click="checkAttachment(props.row)" />
      </div>
      <div v-else-if="col === 'admin'">
        <q-btn label="分配管理员" flat color="teal" @click="approveAdmin(props.row)" />
      </div>
      <div v-else>
        {{ props.row[`${col}`] }}
      </div>
    </BaseTable>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
