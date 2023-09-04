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
  { name: 'handlerAccount', field: 'handlerAccount', label: '审核人账号' },
  { name: 'handlerNickname', field: 'handlerNickname', label: '审核人姓名' },
])
const rows: Array<any> = reactive([])
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})
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
        founder: true,
        desktop: true,
        handler: true,
      },
    }
    const { total, data } = await queryExportLg(body) as QueryLg
    pagination.value.rowsNumber = total
    data.forEach((item) => {
      // 用户
      item.account = item.founder?.account
      item.nickname = item.founder?.nickname
      item.roleName = item.founder?.roleName
      // 云桌面
      item.desktopAccount = item.desktop?.account
      item.internalIp = item.desktop?.internalIp
      item.accessUrl = item.desktop?.accessUrl
      item.expiredAt = item.desktop?.expiredAt && moment(item.desktop?.expiredAt).format('YYYY-MM-DD HH:mm:ss')
      // 文件
      item.fileSize = formatFileSize(item.fileSize)
      item.createdAt = moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
      // 审核人
      item.handlerAccount = item.handler?.account
      item.handlerNickname = item.handler?.nickname
      item.handleAt = item.handleAt && moment(item.handleAt).format('YYYY-MM-DD HH:mm:ss')
    })
    rows.splice(0, rows.length, ...data)
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
    persistent: true,
  }).onOk(async () => {
    loading.value = true
    try {
      const data = await downloadLg(id)
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
    :rows-per-page-options="[50, 60, 70]"
    @request="queryData"
  >
    <template #body="prop">
      <q-tr :props="prop">
        <q-td v-for="col in columns" :key="col.name">
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
          <template v-else>
            {{ prop.row[col.name] }}
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
