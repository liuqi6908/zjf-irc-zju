<script setup lang="ts">
import { QTable, exportFile, useQuasar } from 'quasar'
import type { QTableProps } from 'quasar'

interface Action {
  key: string
  value: string
}

interface QueryLog {
  total: {
    value: number
  }
  records: any[]
}

const $q = useQuasar()
const { $get, $post } = useRequest()
const tableRef = ref<QTable>()

const columns: QTableProps['columns'] = reactive([
  {
    name: 'account',
    label: '用户',
    field: 'account',
  },
  {
    name: 'email',
    label: '邮箱',
    field: 'email',
  },
  {
    name: 'ip',
    label: 'IP 地址',
    field: 'ip',
  },
  {
    name: 'rootId',
    label: '大类',
    field: 'rootId',
  },
  {
    name: 'dbId',
    label: '数据库',
    field: 'dbId',
  },
  {
    name: 'subDbId',
    label: '子库',
    field: 'subDbId',
  },
  {
    name: 'moduleId',
    label: '模块',
    field: 'moduleId',
  },
  {
    name: 'tableId',
    label: '表格',
    field: 'tableId',
  },
  {
    name: 'time',
    label: '操作时间',
    field: 'time',
  },
  {
    name: 'action',
    label: '操作',
    field: 'action',
  },
])
const rows: Array<any> = reactive([])
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})
const loading = ref(true)
const filter = ref('')

const actions = reactive<Array<Action>>([])

onMounted(async () => {
  columns.forEach((item) => {
    item.align = 'center'
    item.sortable = true
  })
  await getActions()
  // 从服务器获取初始数据
  tableRef.value?.requestServerInteraction()
})

/**
 * 获取全部可用行为
 */
async function getActions() {
  const data = await $get('log/data/_actions') as Array<Action>
  actions.push(...data)
}

/**
 * 查询日志数据
 */
async function queryLogData(props: any) {
  const { filter } = props
  const { page, rowsPerPage, sortBy } = props.pagination
  loading.value = true

  try {
    // eslint-disable-next-line no-template-curly-in-string
    let dsl = '${status} = 0'
    if (filter)
      dsl += ` AND \${user.account} HAS '${filter}'`
    const { total, records } = await $post('/log/data/query/dsl', {
      page,
      pageSize: rowsPerPage,
      dsl,
    }) as QueryLog
    pagination.value.rowsNumber = total.value
    records.forEach((item) => {
      delete item.user?.id
    })
    rows.splice(0, rows.length, ...records.map(v => flattenJSON(v)))
    rows.forEach((item) => {
      item.time = formatDate(item.time)
      item.action = actions.find(v => v.key === item.action)?.value || item.action
    })
    if (sortBy)
      rows.sort((a, b) => a[sortBy].localeCompare(b[sortBy]))
  }
  catch (e) {}
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
    `日志管理 ${formatDate()}.csv`,
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
  <div class="log-admin" p-6>
    <QTable
      ref="tableRef"
      v-model:pagination="pagination"
      title="日志管理"
      h-full
      :columns="columns"
      :rows="rows"
      :loading="loading"
      :rows-per-page-options="[5, 10, 20, 30, 50, 100]"
      :filter="filter"
      @request="queryLogData"
    >
      <template #top-right>
        <q-input v-model="filter" dense debounce="500" placeholder="搜索用户账号">
          <template #append>
            <q-icon name="fas fa-search" size="16px" />
          </template>
        </q-input>
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
    </QTable>
  </div>
</template>

<style lang="scss" scoped>
</style>
