<script setup lang="ts">
import { QTable, useQuasar } from 'quasar'
import moment from 'moment'
import type { QTableProps } from 'quasar'
import type { IQueryDto, IWork } from 'zjf-types'
import { download, queryList } from '~/api/work/index'

const $q = useQuasar()
const tableRef = ref<QTable>()

const columns: QTableProps['columns'] = reactive([
  { name: 'account', label: '用户', field: 'user.account' },
  { name: 'email', label: '邮箱', field: 'user.email' },
  { name: 'name', label: '姓名', field: 'user.verification.name' },
  { name: 'title', label: '标题', field: 'title' },
  { name: 'author', label: '作者', field: 'author' },
  { name: 'filename', label: '文件名', field: 'filename' },
  { name: 'createdAt', label: '提交时间', field: 'createdAt' },
  { name: 'action', label: '操作', field: 'action' },
])
const rows: Array<any> = reactive([])
const pagination = tablePagination()
const loading = ref(true)
const filter = ref('')

onMounted(async () => {
  columns.forEach((item) => {
    item.align = 'center'
  })
  // 从服务器获取初始数据
  tableRef.value?.requestServerInteraction()
})

/**
 * 查询作品数据
 */
async function queryWorkData(props: any) {
  const { filter } = props
  const { page, rowsPerPage } = props.pagination
  loading.value = true

  try {
    const body: IQueryDto<IWork> = {
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
      },
    }
    if (filter) {
      body.filters?.push({
        field: 'user.account',
        type: 'LIKE',
        value: filter,
      })
    }
    const { total, data } = await queryList(body)
    pagination.value.rowsNumber = total
    rows.splice(0, rows.length, ...data.map(v => flattenJSON(v)))
    rows.forEach((item) => {
      item.createdAt = moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
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
 * 下载作品
 * @param row
 */
function downloadWork(name: string, id: string) {
  $q.dialog({
    title: '下载确认',
    message: '该操作将下载作品附件，是否继续？',
    cancel: true,
  }).onOk(async () => {
    loading.value = true
    try {
      const data = await download(id)
      downloadFile(data, name)
    }
    catch (_) {}
    finally {
      loading.value = false
    }
  })
}
</script>

<template>
  <div p-4>
    <QTable
      ref="tableRef"
      v-model:pagination="pagination"
      title="作品管理"
      h-full
      :columns="columns"
      :rows="rows"
      :loading="loading"
      :rows-per-page-options="rowsPerPageOptions"
      :filter="filter"
      @request="queryWorkData"
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
          <q-td v-for="col in columns" :key="col.name">
            <template v-if="col.name === 'action'">
              <q-btn label="下载" color="primary" size="sm" @click="downloadWork(props.row.filename, props.row.id)" />
            </template>
            <template v-else>
              {{ props.row[col.field as string] }}
            </template>
          </q-td>
        </q-tr>
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
