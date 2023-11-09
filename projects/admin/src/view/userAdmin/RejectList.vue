<script setup lang="ts">
import { VerificationStatus } from 'zjf-types'
import type { IQueryDto, IVerificationHistory } from 'zjf-types'
import { QTable } from 'quasar'
import type { QTableProps } from 'quasar'
import moment from 'moment'
import { hideSensitiveInfo } from 'zjf-utils'
import { queryAllApply } from '~/api/verification/queryAllApply'

defineProps<{ title: string }>()
const tableRef = ref<QTable>()

const cols: QTableProps['columns'] = [
  ...verifyTableCols?.filter((_, i) => i !== verifyTableCols!.length - 1) || [],
  { name: 'rejectReason', field: 'rejectReason', label: '驳回原因', align: 'center' },
]
const rows: Array<any> = reactive([])
const pagination = tablePagination()
const loading = ref(true)
const filter = ref('')

onMounted(async () => {
  // 从服务器获取初始数据
  tableRef.value?.requestServerInteraction()
})

/**
 * 查询认证申请列表
 */
async function queryVerifyList(props: any) {
  const { filter } = props
  const { page, rowsPerPage } = props.pagination
  loading.value = true

  try {
    const body: IQueryDto<IVerificationHistory> = {
      pagination: {
        page,
        pageSize: rowsPerPage,
      },
      filters: [
        {
          field: 'status',
          type: '=',
          value: VerificationStatus.REJECTED,
        },
      ],
      sort: [
        {
          field: 'createdAt',
          order: 'ASC',
        },
      ],
      relations: {
        founder: true,
      },
    }
    if (filter) {
      body.filters?.push({
        field: 'founder.account',
        type: 'LIKE',
        value: filter,
      })
    }
    const { total, data } = await queryAllApply(body)
    pagination.value.rowsNumber = total
    rows.splice(0, rows.length, ...data.map(v => flattenJSON(v)))
    rows.forEach((item) => {
      item.idCard = hideSensitiveInfo(item.idCard)
      item.createdAt = moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
      item.identify = userIdentify.find(v => v.value === item.identify)?.label
      item['founder.createdAt'] = item['founder.createdAt'] ? moment(item['founder.createdAt']).format('YYYY-MM-DD HH:mm:ss') : null
      item['founder.registerPlatform'] = userRegisterPlatform[item['founder.registerPlatform']]
    })
  }
  catch (_) {
    console.error(_)
  }
  finally {
    // 更新本地分页对象
    pagination.value.page = page
    pagination.value.rowsPerPage = rowsPerPage
    loading.value = false
  }
}
</script>

<template>
  <QTable
    ref="tableRef"
    v-model:pagination="pagination"
    :title="title"
    h-full
    :columns="cols"
    :rows="rows"
    :loading="loading"
    :rows-per-page-options="rowsPerPageOptions"
    :filter="filter"
    @request="queryVerifyList"
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
        <q-td v-for="col in cols" :key="col.name">
          <template v-if="col.name === 'attachments'">
            <q-btn flat color="primary" label="查看认证材料" @click="checkAttachment(props.row[col.field as string], props.row['founder.id'])" />
          </template>
          <template v-else>
            {{ props.row[col.field as string] }}
          </template>
        </q-td>
      </q-tr>
    </template>
  </QTable>
</template>
