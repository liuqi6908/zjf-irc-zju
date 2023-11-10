<script setup lang="ts">
import { QTable, useQuasar } from 'quasar'
import { cloneDeep } from 'lodash-es'
import type { QTableProps } from 'quasar'
import type { IFileExportLarge, IQueryConfig } from 'zjf-types'
import moment from 'moment'
import { formatFileSize } from 'zjf-utils'
import { approveApply, downloadLg, queryExportLg, rejectApply } from '~/api/exportFile/index'

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
 * 查询大文件外发待审核数据
 */
async function queryData(props: any) {
  const { page, rowsPerPage } = props.pagination
  loading.value = true

  try {
    const body: IQueryConfig<IFileExportLarge> = {
      pagination: {
        page,
        pageSize: rowsPerPage,
      },
      filters: [
        {
          field: 'status',
          type: '=',
          value: 'pending',
        },
      ],
      sort: [
        {
          field: 'createdAt',
          order: 'ASC',
        },
      ],
      relations: {
        founder: {
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
      item['founder.registerPlatform'] = userRegisterPlatform[item['founder.registerPlatform']]
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
    message: '该操作将下载大文件外发附件，是否继续？',
    cancel: true,
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

/**
 * 通过文件外发
 * @param id
 */
function approve(id: string) {
  $q.dialog({
    title: '通过确认',
    message: '该操作将通过大文件外发审核，是否继续？',
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
    catch (_) {
      $q.notify({
        message: '通过失败！',
        type: 'danger',
      })
    }
    finally {
      loading.value = false
    }
  })
}

/**
 * 驳回文件外发
 * @param id
 */
function reject(id: string) {
  $q.dialog({
    title: '驳回确认',
    message: '请输入驳回原因：',
    prompt: {
      model: '',
      isValid: val => val.length > 0,
      type: 'text',
    },
    cancel: true,
  }).onOk(async (val) => {
    loading.value = true
    try {
      await rejectApply(id, val)
      $q.notify({
        message: '驳回成功！',
        type: 'success',
      })
      tableRef.value?.requestServerInteraction()
    }
    catch (_) {
      $q.notify({
        message: '驳回失败！',
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
            <q-btn label="通过" color="green" size="sm" mx-2 @click="approve(prop.row.id)" />
            <q-btn label="驳回" color="red" size="sm" @click="reject(prop.row.id)" />
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
