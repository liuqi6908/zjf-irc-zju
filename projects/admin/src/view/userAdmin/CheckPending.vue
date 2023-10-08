<script setup lang="ts">
import { VerificationStatus } from 'zjf-types'
import type { IQueryDto, IVerificationHistory } from 'zjf-types'
import { QTable, useQuasar } from 'quasar'
import moment from 'moment'
import { hideSensitiveInfo } from 'zjf-utils'
import { queryAllApply } from '~/api/verification/queryAllApply'
import { approveApply } from '~/api/verification/approveApply'
import { rejectApply } from '~/api/verification/rejectApply'

defineProps<{ title: string }>()
const $q = useQuasar()
const tableRef = ref<QTable>()

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
          value: VerificationStatus.PENDING,
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
      item['founder.email'] = hideSensitiveInfo(item['founder.email'])
      item.idCard = hideSensitiveInfo(item.idCard)
      item.createdAt = moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
      item.identify = userIdentify.find(v => v.value === item.identify)?.label
      item['founder.createdAt'] = item['founder.createdAt'] ? moment(item['founder.createdAt']).format('YYYY-MM-DD HH:mm:ss') : null
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
 * 通过认证申请
 * @param id
 */
function approve(id: string) {
  $q.dialog({
    title: '通过确认',
    message: '该操作将通过用户认证申请，是否继续？',
    cancel: true,
  }).onOk(async () => {
    loading.value = true
    try {
      await approveApply(id)
      $q.notify({
        message: '通过成功！',
        type: 'success',
      })
      tableRef.value?.requestServerInteraction()
    }
    catch (_) {}
    finally {
      loading.value = false
    }
  })
}

/**
 * 驳回认证申请
 * @param id
 */
function reject(id: string) {
  $q.dialog({
    title: '驳回确认',
    message: '请输入驳回原因：',
    prompt: {
      model: '',
      isValid: val => val.toString().trim().length > 2,
      type: 'text',
    },
    cancel: true,
  }).onOk(async (val) => {
    loading.value = true
    try {
      await rejectApply(id, val.toString())
      $q.notify({
        message: '驳回成功！',
        type: 'success',
      })
      tableRef.value?.requestServerInteraction()
    }
    catch (_) {}
    finally {
      loading.value = false
    }
  })
}
</script>

<template>
  <QTable
    ref="tableRef"
    v-model:pagination="pagination"
    :title="title"
    h-full
    :columns="verifyTableCols"
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
        <q-td v-for="col in verifyTableCols" :key="col.name">
          <template v-if="col.name === 'attachments'">
            <q-btn flat color="primary" label="查看认证材料" @click="checkAttachment(props.row[col.field as string], props.row['founder.id'])" />
          </template>
          <template v-else-if="col.name === 'action'">
            <q-btn label="通过" color="green" size="sm" mx-2 @click="approve(props.row.id)" />
            <q-btn label="驳回" color="red" size="sm" @click="reject(props.row.id)" />
          </template>
          <template v-else>
            {{ props.row[col.field as string] }}
          </template>
        </q-td>
      </q-tr>
    </template>
  </QTable>
</template>
