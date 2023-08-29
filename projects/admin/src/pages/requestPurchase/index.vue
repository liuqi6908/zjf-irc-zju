<script setup lang="ts">
import type { IDataSuggestion, IQueryDto } from 'zjf-types'
import { PAGINATION_SIZE_MAX } from 'zjf-types'
import { onMounted } from 'vue'
import BaseTable from '../../components/table/BaseTable.vue'
import { queryDataRequest } from '../../api/dataRequest/queryDataRequest'

const requestCol = [
  { name: 'userId', field: 'userId', label: '用户id', align: 'center' },
  { name: 'account', field: 'account', label: '用户名', align: 'center' },
  { name: 'name', field: 'name', label: '真实姓名', align: 'center' },
  { name: 'duration', field: 'duration', label: '数据库', align: 'center' },
  { name: 'nickname', field: 'nickname', label: '子库', align: 'center' },
  { name: 'nickname', field: 'nickname', label: '模块', align: 'center' },
  { name: 'nickname', field: 'nickname', label: '表格', align: 'center' },
  { name: 'reason', field: 'reason', label: '采购理由', align: 'center' },
]
const rows = ref([])
const loading = ref(false)

const baseOptions: IQueryDto<IDataSuggestion> = {
  pagination: {
    page: 0,
    pageSize: PAGINATION_SIZE_MAX,
  },
  filters: [

  ],
  sort: [

  ],
  relations: {
    user: { verification: true },
    dataDirectory: true,
  },
}

async function fetchDataRequest() {
  loading.value = true
  const res = await queryDataRequest(baseOptions).finally(() => {
    loading.value = false
  })
  if (res) {
    rows.value = res.data.map((item) => {
      const { account } = item.user
      const { name } = item.user?.verification || ''
      return {
        ...item,
        account,
        name,
      }
    })
  }
}

onMounted(async () => {
  fetchDataRequest()
})
</script>

<template>
  <div>
    <BaseTable v-slot="{ props, col }" export="采购建议" :cols="requestCol" :operation="['export']" :rows="rows">
      <div>
        {{ props.row[`${col}`] }}
      </div>
    </BaseTable>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
