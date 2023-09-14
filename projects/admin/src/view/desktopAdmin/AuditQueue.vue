<script setup lang="ts">
import { QTable, useQuasar } from 'quasar'
import type { QTableProps } from 'quasar'
import { DesktopQueueStatus } from 'zjf-types'
import type { IDesktopQueue, IQueryConfig } from 'zjf-types'
import moment from 'moment'
import { approveDesktop, desktopRequestQueryList, rejectDesktop } from '~/api/desktop/request'

interface Props {
  title?: string
}

withDefaults(defineProps<Props>(), {
  title: '桌面管理',
})

const $q = useQuasar()
const tableRef = ref<QTable>()

const cols: QTableProps['columns'] = reactive([
  { name: 'account', field: 'user.account', label: '用户' },
  { name: 'email', field: 'user.email', label: '邮箱' },
  { name: 'name', field: 'user.verification.name', label: '姓名' },
  { name: 'school', field: 'user.verification.school', label: '学校' },
  { name: 'college', field: 'user.verification.college', label: '学院' },
  { name: 'number', field: 'user.verification.number', label: '学号' },
  { name: 'idCard', field: 'user.verification.idCard', label: '身份证' },
  { name: 'identify', field: 'user.verification.identify', label: '身份' },
  { name: 'dataRoleName', field: 'user.dataRoleName', label: '角色' },
  { name: 'roleName', field: 'user.roleName', label: '权限' },
  { name: 'createdAt', field: 'createdAt', label: '申请时间' },
  { name: 'duration', field: 'duration', label: '申请时长' },
  { name: 'attachments', field: 'attachments', label: '申请材料' },
  { name: 'status', field: 'status', label: '状态' },
  { name: 'action', field: 'action', label: '操作' },
])
const rows: Array<any> = reactive([])
const pagination = tablePagination()
const loading = ref(true)

onMounted(() => {
  cols.forEach((item) => {
    item.align = 'center'
  })
  tableRef.value?.requestServerInteraction()
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
          value: DesktopQueueStatus.Pending,
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
      item['user.verification.identify'] = userIdentify.find(v => v.value === item['user.verification.identify'])?.label || '无'
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
 * 通过申请
 * @param id
 */
function approve(id: string) {
  $q.dialog({
    title: '通过确认',
    message: '该操作将通过桌面申请，是否继续？',
    cancel: true,
  }).onOk(async () => {
    loading.value = true
    try {
      await approveDesktop(id)
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
      await rejectDesktop(id, val)
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
    :columns="cols"
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
        <q-td v-for="col in cols" :key="col.name">
          <template v-if="col.name === 'attachments'">
            <q-btn flat color="primary" label="查看申请材料" @click="checkAttachment(props.row.attachments, props.row['user.id'], 'desktop-request')" />
          </template>
          <template v-else-if="col.name === 'action'">
            <q-btn label="通过" color="green" size="sm" mr-2 @click="approve(props.row['user.id'])" />
            <q-btn label="驳回" color="red" size="sm" @click="reject(props.row['user.id'])" />
          </template>
          <template v-else>
            {{ props.row[col.field as string] }}
          </template>
        </q-td>
      </q-tr>
    </template>
  </QTable>
</template>
