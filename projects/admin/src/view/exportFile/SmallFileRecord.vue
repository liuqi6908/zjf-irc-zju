<script setup lang="ts">
import { QTable, useQuasar } from 'quasar'
import { cloneDeep } from 'lodash-es'
import type { QTableProps } from 'quasar'
import type { IFileExportSmall, IQueryConfig } from 'zjf-types'
import moment from 'moment'
import { formatFileSize } from 'zjf-utils'
import { downloadSm, queryExportSm } from '~/api/exportFile/index'

interface Props {
  title?: string
  cols: QTableProps['columns']
}

interface QueryLg {
  total: number
  data: any[]
}

const props = withDefaults(defineProps<Props>(), {
  title: '文件外发',
})

const $q = useQuasar()
const tableRef = ref<QTable>()

const columns: QTableProps['columns'] = reactive([...cloneDeep(props.cols!)])
const rows: Array<any> = reactive([])
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})
const loading = ref(true)

onMounted(async () => {
  columns.forEach((item) => {
    item.align = 'center'
  })
  tableRef.value?.requestServerInteraction()
})

/**
 * 查询小文件外发审核记录
 */
async function queryData(props: any) {
  const { page, rowsPerPage } = props.pagination
  loading.value = true

  try {
    const body: IQueryConfig<IFileExportSmall> = {
      pagination: {
        page,
        pageSize: rowsPerPage,
      },
      sort: [
        {
          field: 'createdAt',
          order: 'DESC',
        },
      ],
      relations: {
        founder: true,
        desktop: true,
      },
    }
    const { total, data } = await queryExportSm(body) as QueryLg
    pagination.value.rowsNumber = total
    data.forEach((item) => {
      // 云桌面
      if (item.desktop)
        item.desktop.expiredAt = item.desktop.expiredAt && moment(item.desktop.expiredAt).format('YYYY-MM-DD HH:mm:ss')
      // 文件
      item.fileSize = formatFileSize(item.fileSize)
      item.createdAt = moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
    })
    rows.splice(0, rows.length, ...data.map(v => flattenJSON(v)))
  }
  catch (e) { }
  finally {
    // 更新本地分页对象
    pagination.value.page = page
    pagination.value.rowsPerPage = rowsPerPage
    loading.value = false
  }
}

/**
 * 下载附件
 * @param name
 * @param id
 */
function download(name: string, id: string) {
  $q.dialog({
    title: '下载确认',
    message: '该操作将下载文件外发附件，是否继续？',
    cancel: true,
  }).onOk(async () => {
    loading.value = true
    try {
      const data = await downloadSm(id)
      downloadFile(data, name)
    }
    catch (_) {
      $q.notify({
        message: '下载失败！',
        type: 'danger',
      })
    }
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
    :columns="columns"
    :rows="rows"
    :loading="loading"
    :rows-per-page-options="rowsPerPageOptions"
    @request="queryData"
  >
    <template #body="prop">
      <q-tr :props="prop">
        <q-td v-for="col in columns" :key="col.name">
          <template v-if="col.name === 'operation'">
            <q-btn label="下载" color="primary" size="sm" @click="download(prop.row.fileName, prop.row.id)" />
          </template>
          <template v-else>
            {{ prop.row[col.field as string] }}
          </template>
        </q-td>
      </q-tr>
    </template>
    <template #loading>
      <q-inner-loading showing color="primary" />
    </template>
  </QTable>
</template>
