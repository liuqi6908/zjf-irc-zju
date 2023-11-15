<script setup lang="ts">
import { QTable, exportFile, useQuasar } from 'quasar'
import moment from 'moment'
import type { QTableProps } from 'quasar'
import type { IDataSuggestion, IQueryDto } from 'zjf-types'
import { queryDataRequest } from '~/api/dataRequest/queryDataRequest'

const $q = useQuasar()
const tableRef = ref<QTable>()

const columns: QTableProps['columns'] = reactive([
  { name: 'account', label: '用户', field: 'user.account' },
  { name: 'email', label: '邮箱', field: 'user.email' },
  { name: 'name', label: '姓名', field: 'user.verification.name' },
  { name: 'root', label: '类', field: 'dataDirectory.parent.parent.parent.parent.nameZH' },
  { name: 'db', label: '数据库', field: 'dataDirectory.parent.parent.parent.nameZH' },
  { name: 'subDb', label: '子库', field: 'dataDirectory.parent.parent.nameZH' },
  { name: 'module', label: '模块', field: 'dataDirectory.parent.nameZH' },
  { name: 'table', label: '表格', field: 'dataDirectory.nameZH' },
  { name: 'reason', label: '采购理由', field: 'reason' },
])
const rows: Array<any> = reactive([])
const pagination = tablePagination()
const loading = ref(true)

onMounted(async () => {
  columns.forEach((item) => {
    item.align = 'center'
  })
  // 从服务器获取初始数据
  tableRef.value?.requestServerInteraction()
})

/**
 * 查询申请数据
 */
async function queryRequestData(props: any) {
  const { page, rowsPerPage } = props.pagination
  loading.value = true

  try {
    const body: IQueryDto<IDataSuggestion> = {
      pagination: {
        page,
        pageSize: rowsPerPage,
      },
      filters: [],
      sort: [],
      relations: {
        user: {
          verification: true,
        },
        dataDirectory: {
          parent: {
            parent: {
              parent: {
                parent: true,
              },
            },
          },
        },
      },
    }
    const { total, data } = await queryDataRequest(body)
    pagination.value.rowsNumber = total
    rows.splice(0, rows.length, ...data.map(v => flattenJSON(v)))
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
 * 导出表格
 */
function exportTable() {
  const content = [columns!.map(col => `"${col.label}"`)].concat(
    rows.map(row => columns!.map(col => `"${row[col.field as string]}"`).join(',')),
  ).join('\r\n')

  const status = exportFile(
    `申请采购 ${moment().format('YYYY-MM-DD HH:mm:ss')}.csv`,
    content,
    'text/csv',
  )

  if (!status) {
    $q.notify({
      message: '已取消下载...',
      type: 'warn',
    })
  }
}
</script>

<template>
  <div p-4>
    <QTable
      ref="tableRef"
      v-model:pagination="pagination"
      title="申请采购"
      h-full
      :columns="columns"
      :rows="rows"
      :loading="loading"
      :rows-per-page-options="rowsPerPageOptions"
      @request="queryRequestData"
    >
      <template #top-right>
        <q-btn
          color="primary"
          :disable="rows.length === 0"
          ml-6
          @click="exportTable"
        >
          导出为CSV
          <q-icon name="fas fa-download" size="18px" ml-2 />
        </q-btn>
      </template>
      <template #loading>
        <q-inner-loading showing color="primary" />
      </template>
    </QTable>
  </div>
</template>

<style lang="scss" scoped>
:deep(.q-table) {
  thead {
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 1;
  }
  thead, tbody {
    > tr {
      th:last-child, td:last-child {
        position: sticky;
        right: 0;
        background-color: white;
      }
    }
  }
}
</style>
