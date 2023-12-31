<script setup lang="ts">
import { QTable, useQuasar } from 'quasar'
import { cloneDeep } from 'lodash-es'
import type { QTableProps } from 'quasar'
import type { IFileExportLarge, IQueryConfig } from 'zjf-types'
import moment from 'moment'
import { formatFileSize } from 'zjf-utils'
import { downloadLg, queryExportLg } from '~/api/exportFile/index'

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

const columns: QTableProps['columns'] = reactive([
  ...cloneDeep(props.cols!),
  { name: 'status', field: 'status', label: '状态' },
  { name: 'rejectReason', field: 'rejectReason', label: '驳回原因' },
  { name: 'handleAt', field: 'handleAt', label: '审核时间' },
  { name: 'handlerAccount', field: 'handler.account', label: '审核人账号' },
  { name: 'handlerName', field: 'handler.verification.name', label: '审核人姓名' },
])
const rows: Array<any> = reactive([])
const pagination = tablePagination()
const loading = ref(true)

const statusArr: Record<string, any> = reactive([
  {
    label: '待审核',
    value: 'pending',
    color: 'warning',
    icon: 'minus-circle',
    flag: true,
  },
  {
    label: '已通过',
    value: 'approved',
    color: 'green',
    icon: 'check-circle',
    flag: true,
  },
  {
    label: '已驳回',
    value: 'rejected',
    color: 'red',
    icon: 'times-circle',
    flag: true,
  },
])

onMounted(async () => {
  columns.forEach((item) => {
    item.align = 'center'
  })
  columns.sort((a, b) => {
    const keyA = a.field === 'operation' ? 1 : 0
    const keyB = b.field === 'operation' ? 1 : 0
    return keyA - keyB
  })
  watch(
    statusArr,
    () => tableRef.value?.requestServerInteraction(),
    {
      immediate: true,
    },
  )
})

/**
 * 查询大文件外发审核记录
 */
async function queryData(props: any) {
  const { page, rowsPerPage } = props.pagination
  loading.value = true

  try {
    if (statusArr.filter((v: any) => v.flag).length === 0) {
      rows.splice(0, rows.length)
      return
    }
    const body: IQueryConfig<IFileExportLarge> = {
      pagination: {
        page,
        pageSize: rowsPerPage,
      },
      filters: [
        {
          field: 'status',
          type: 'IN',
          value: statusArr.filter((v: any) => v.flag).map((v: any) => v.value),
        },
      ],
      sort: [
        {
          field: 'createdAt',
          order: 'DESC',
        },
      ],
      relations: {
        founder: {
          verification: true,
        },
        handler: {
          verification: true,
        },
      },
    }
    const { total, data } = await queryExportLg(body) as QueryLg
    pagination.value.rowsNumber = total
    rows.splice(0, rows.length, ...data.map(v => flattenJSON(v)))
    rows.forEach((item) => {
      // 文件
      item.fileSize = formatFileSize(item.fileSize)
      item.createdAt = moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
      // 审核时间
      item.handleAt = item.handleAt && moment(item.handleAt).format('YYYY-MM-DD HH:mm:ss')
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
      const data = await downloadLg(id)
      downloadFile(data, name)
    }
    catch (e: any) {
      const { status } = e.response
      $q.notify({
        message: status === 404 ? '无法找到指定的文件！' : '下载失败，发生未知的错误！',
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
        <q-td
          v-for="col in columns"
          :key="col.name"
        >
          <template v-if="col.name === 'operation'">
            <q-btn label="下载" color="primary" size="sm" @click="download(prop.row.fileName, prop.row.id)" />
          </template>
          <template v-else-if="col.name === 'status' && statusArr.find((v: any) => v.value === prop.row.status)">
            <q-chip
              :color="statusArr.find((v: any) => v.value === prop.row.status)?.color"
              text-color="white"
              :icon="`fas fa-${statusArr.find((v: any) => v.value === prop.row.status)?.icon}`"
              size="sm"
              :label="statusArr.find((v: any) => v.value === prop.row.status)?.label"
            />
          </template>
          <template v-else-if="col.name === 'rejectReason'">
            <div
              min-w-35 max-w-30vw overflow-hidden text-ellipsis
              v-text="prop.row[col.field as string]"
            />
          </template>
          <template v-else>
            {{ prop.row[col.field as string] }}
          </template>
        </q-td>
      </q-tr>
    </template>
    <template #top-right>
      <q-btn
        v-for="item in statusArr"
        :key="item.value"
        :color="item.flag ? item.color : ''"
        :style="{
          background: item.flag ? '' : '#dddddd',
        }"
        :icon="`fas fa-${item.icon}`"
        :label="item.label"
        ml-2 cursor-pointer rounded
        size="sm"
        @click="item.flag = !item.flag"
      />
    </template>
    <template #loading>
      <q-inner-loading showing color="primary" />
    </template>
  </QTable>
</template>
