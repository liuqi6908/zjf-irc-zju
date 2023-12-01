<script setup lang="ts">
import { QTable, useQuasar } from 'quasar'
import { DesktopQueueStatus } from 'zjf-types'
import type { IDesktopQueue, IQueryConfig } from 'zjf-types'
import moment from 'moment'
import { hideSensitiveInfo } from 'zjf-utils'
import { desktopRequestQueryList } from '~/api/desktop/request'
import { createAndAssignDesktop, desktopQueryList } from '~/api/desktop'

interface Props {
  title?: string
}

withDefaults(defineProps<Props>(), {
  title: '桌面管理',
})

const $q = useQuasar()
const tableRef = ref<QTable>()

const rows: Array<any> = reactive([])
const pagination = tablePagination()
const loading = ref(true)
let disabledAssign = true

onMounted(async () => {
  tableRef.value?.requestServerInteraction()
  disabledAssign = (await desktopQueryList({
    filters: [{
      field: 'disabled',
      type: '=',
      value: false,
    }],
    relations: {},
    sort: []
  })).total >= 50
})

/**
 * 查询数据
 */
async function queryData(props: any) {
  const { page, rowsPerPage } = props.pagination
  loading.value = true

  try {
    const body: IQueryConfig<IDesktopQueue> = {
      pagination: {
        page,
        pageSize: rowsPerPage,
      },
      filters: [
        {
          field: 'status',
          type: '=',
          value: DesktopQueueStatus.Queueing,
        },
      ],
      sort: [
        {
          field: 'createdAt',
          order: 'ASC',
        },
      ],
      relations: {
        user: {
          verification: true,
        },
      },
    }
    const { total, data } = await desktopRequestQueryList(body)
    pagination.value.rowsNumber = total
    rows.splice(0, rows.length, ...data.map(v => flattenJSON(v)))
    rows.forEach((item) => {
      item.createdAt = moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
      item['user.verification.idCard'] = hideSensitiveInfo(item['user.verification.idCard'])
      item.status = desktopStatus.find(v => v.value === item.status)?.label || ''
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
 * 自动创建云桌面并分配
 * @param id
 */
function assign(id: string) {
  $q.dialog({
    title: '分配确认',
    message: disabledAssign ? '云桌面授权已用完，无法继续分配，请释放后重试。' : '该操作将自动创建云桌面并分配给用户，是否继续？',
    cancel: true,
  }).onOk(async () => {
    if (disabledAssign)
      return
    const notify = $q.notify({
      type: 'ongoing',
      message: '正在为用户创建云桌面中，请耐心等待！',
      position: 'top',
      color: 'warning',
    })
    try {
      const res = await createAndAssignDesktop(id)
      if (res === true) {
        notify({
          type: 'success',
          message: '已成功创建并分配！',
          color: 'positive',
        })
        tableRef.value?.requestServerInteraction()
      }
      else {
        notify({
          type: 'danger',
          message: '创建失败！',
          color: 'negative',
        })
      }
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
    :columns="desktopRequestTableCols"
    :rows="rows"
    :loading="loading"
    :rows-per-page-options="rowsPerPageOptions"
    @request="queryData"
  >
    <template #loading>
      <q-inner-loading showing color="primary" />
    </template>
    <template #body="props">
      <q-tr :props="props">
        <q-td v-for="col in desktopRequestTableCols" :key="col.name">
          <template v-if="col.name === 'attachments'">
            <q-btn flat color="primary" label="查看申请材料" @click="checkAttachment(props.row.attachments, props.row['user.id'], 'desktop-request')" />
          </template>
          <template v-else-if="col.name === 'action'">
            <q-btn label="自动分配" color="green" size="sm" @click="assign(props.row['user.id'])" />
          </template>
          <template v-else>
            {{ props.row[col.field as string] }}
          </template>
        </q-td>
      </q-tr>
    </template>
  </QTable>
</template>
