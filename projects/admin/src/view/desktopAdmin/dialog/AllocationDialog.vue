<script setup lang="ts">
import { QTable, useQuasar } from 'quasar'
import type { QTableProps } from 'quasar'
import { DesktopQueueStatus } from 'zjf-types'
import type { IDesktop, IQueryConfig } from 'zjf-types'
import moment from 'moment'
import { getDesktopQuery } from '~/api/desktopRequest/getdesktopQuery'
import { assignDesktop } from '~/api/desktop/assignDesktop'
import type { QueryDesktop } from '~/pages/desktopAdmin/index.vue'

interface Props {
  id: string
  callback: () => void
}

const { id, callback = () => {} } = defineProps<Props>()
const $q = useQuasar()
const tableRef = ref<QTable>()

const cols: QTableProps['columns'] = reactive([
  { name: 'account', field: 'user.account', label: '用户' },
  { name: 'email', field: 'user.email', label: '邮箱' },
  { name: 'name', field: 'user.verification.name', label: '姓名' },
  { name: 'school', field: 'user.verification.school', label: '学校' },
  { name: 'college', field: 'user.verification.college', label: '学院' },
  { name: 'college', field: 'user.verification.number', label: '学号' },
  { name: 'college', field: 'user.verification.idCard', label: '身份证' },
  { name: 'identify', field: 'user.verification.identify', label: '身份' },
  { name: 'dataRoleName', field: 'user.dataRoleName', label: '角色' },
  { name: 'roleName', field: 'user.roleName', label: '权限' },
  { name: 'createdAt', field: 'createdAt', label: '申请时间' },
  { name: 'duration', field: 'duration', label: '申请时长' },
  { name: 'status', field: 'status', label: '状态' },
])
const rows: Array<any> = reactive([])
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})
const selected = ref()

const dialog = ref(true)
const dialogLoading = ref(false)
const tableLoading = ref(false)

onMounted(async () => {
  cols.forEach((item) => {
    item.align = 'center'
  })
  nextTick(() => {
    tableRef.value?.requestServerInteraction()
  })
})

/**
 * 查询数据
 */
async function queryData(props: any) {
  const { page, rowsPerPage } = props.pagination
  tableLoading.value = true

  try {
    const body: IQueryConfig<IDesktop> = {
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
    const { total, data } = await getDesktopQuery(body) as QueryDesktop
    pagination.value.rowsNumber = total
    rows.splice(0, rows.length, ...data.map(v => flattenJSON(v)))
    rows.forEach((item) => {
      item.createdAt = moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
      item['user.verification.identify'] = userIdentify.find(v => v.value === item['user.verification.identify'])?.label || '无'
      item.status = desktopStatus.find(v => v.value === item.status)?.label || ''
    })
  }
  catch (e) { }
  finally {
    // 更新本地分页对象
    pagination.value.page = page
    pagination.value.rowsPerPage = rowsPerPage
    tableLoading.value = false
  }
}

const userId = computed(() => selected.value?.[0]?.userId)

/**
 * 分配云桌面
 */
async function allocationDesktop() {
  if (!userId.value)
    return
  try {
    dialogLoading.value = true
    const flag = await assignDesktop(id, userId.value)
    if (flag) {
      $q.notify({
        message: '分配成功！',
        type: 'success',
      })
      dialog.value = false
      callback()
    }
  }
  catch (_) { }
  finally {
    dialogLoading.value = false
  }
}
</script>

<template>
  <QDialog v-model="dialog" class="allocation-dialog">
    <QCard p-6 relative w-50vw min-w-100 class="max-w-inherit!">
      <header relative text-lg mb-5>
        分配云桌面
        <q-btn v-close-popup size="10px" icon="fas fa-times" absolute flat top-0 right-0 px-1 />
      </header>
      <QTable
        ref="tableRef"
        v-model:pagination="pagination"
        v-model:selected="selected"
        h-50vh
        :columns="cols"
        :rows="rows"
        :loading="tableLoading"
        :rows-per-page-options="rowsPerPageOptions"
        selection="single"
        row-key="userId"
        @request="queryData"
      >
        <template #loading>
          <q-inner-loading showing color="primary" />
        </template>
      </QTable>
      <footer mt-5 text-right>
        <q-btn flat color="primary" label="取消" @click="dialog = false" />
        <q-btn :disable="!userId" label="分配" ml-2 color="primary" @click="allocationDesktop()" />
      </footer>
      <q-inner-loading :showing="dialogLoading" color="primary" />
    </QCard>
  </QDialog>
</template>

<style lang="scss" scoped>
.allocation-dialog {
  :deep(.q-table) {
    thead {
      position: sticky;
      top: 0;
      background-color: white;
      z-index: 1;
    }
  }
}
</style>
