<script setup lang="ts">
import { VerificationStatus } from 'zjf-types'
import type { IQueryDto, IUser } from 'zjf-types'
import { QTable, useQuasar } from 'quasar'
import moment from 'moment'
import { hideSensitiveInfo } from 'zjf-utils'
import { searchUserQuery } from '~/api/auth/user/searchUserQuery'

defineProps<{ title: string }>()
const $q = useQuasar()
const tableRef = ref<QTable>()

const rows: Array<any> = reactive([])
const pagination = tablePagination()
const loading = ref(true)
const filter = ref('')

onMounted(() => {
  // 从服务器获取初始数据
  tableRef.value?.requestServerInteraction()
})

/**
 * 查询用户列表
 */
async function queryUserList(props: any) {
  const { filter } = props
  const { page, rowsPerPage } = props.pagination
  loading.value = true

  try {
    const body: IQueryDto<IUser> = {
      pagination: {
        page,
        pageSize: rowsPerPage,
      },
      filters: [
        {
          field: 'verification.status',
          type: '=',
          value: VerificationStatus.APPROVED,
        },
      ],
      sort: [
        {
          field: 'createdAt',
          order: 'DESC',
        },
      ],
      relations: {
        verification: true,
      },
    }
    if (filter) {
      body.filters?.push({
        field: 'account',
        type: 'LIKE',
        value: filter,
      })
    }
    const { total, data } = await searchUserQuery(body)
    pagination.value.rowsNumber = total
    rows.splice(0, rows.length, ...data.map(v => flattenJSON(v)))
    rows.forEach((item) => {
      item.createdAt = moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
      item['verification.idCard'] = hideSensitiveInfo(item['verification.idCard'])
      item['verification.identify'] = userIdentify.find(v => v.value === item['verification.identify'])?.label
      item['verification.updatedAt'] = item['verification.updatedAt'] ? moment(item['verification.updatedAt']).format('YYYY-MM-DD HH:mm:ss') : null
      item['verification.status'] = userStatus.find(v => v.value === item['verification.status'])?.label || '未认证'
    })
  }
  catch (_) {}
  finally {
    // 更新本地分页对象
    pagination.value.page = page
    pagination.value.rowsPerPage = rowsPerPage
    loading.value = false
  }
}

/**
 * 分配角色
 * @param id
 */
async function assignRoles(id: string, dataRoleName?: string) {
  if (!id)
    return
  $q.dialog({
    component: await defineAsyncComponent(
      () => import('./dialog/AssignDialog.vue'),
    ).__asyncLoader(),
    componentProps: {
      id,
      dataRoleName,
      callback: () => {
        tableRef.value?.requestServerInteraction()
      },
    },
  })
}
</script>

<template>
  <QTable
    ref="tableRef"
    v-model:pagination="pagination"
    :title="title"
    h-full
    :columns="userTableCols"
    :rows="rows"
    :loading="loading"
    :rows-per-page-options="rowsPerPageOptions"
    :filter="filter"
    @request="queryUserList"
  >
    <template #top-right>
      <q-input v-model="filter" dense debounce="500" placeholder="搜索用户账号">
        <template #append>
          <q-icon name="fas fa-search" size="16px" />
        </template>
      </q-input>
    </template>
    <template #loading>
      <q-inner-loading showing color="primary" />
    </template>
    <template #body="props">
      <q-tr :props="props">
        <q-td v-for="col in userTableCols" :key="col.name">
          <template v-if="col.name === 'attachments'">
            <q-btn flat color="primary" label="查看认证材料" @click="checkAttachment(props.row[col.field as string], props.row.id)" />
          </template>
          <template v-else-if="col.name === 'action'">
            <q-btn label="分配" color="primary" size="sm" @click="assignRoles(props.row.id, props.row.dataRoleName)" />
          </template>
          <template v-else>
            {{ props.row[col.field as string] }}
          </template>
        </q-td>
      </q-tr>
    </template>
  </QTable>
</template>
