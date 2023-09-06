<script setup lang="ts">
import { QTable, useQuasar } from 'quasar'
import type { QTableProps } from 'quasar'
import type { IDesktop, IQueryConfig } from 'zjf-types'
import moment from 'moment'
import { desktopQueryList } from '~/api/desktop/desktopsList'
import { stopDesktop } from '~/api/desktop/stopDesktop'
import type { QueryDesktop } from '~/pages/desktopAdmin/index.vue'

interface Props {
  title?: string
}

withDefaults(defineProps<Props>(), {
  title: '桌面管理',
})

const $q = useQuasar()
const tableRef = ref<QTable>()

const cols: QTableProps['columns'] = reactive([
  { name: 'id', field: 'id', label: 'ID' },
  { name: 'internalIp', field: 'internalIp', label: 'IP地址' },
  { name: 'accessUrl', field: 'accessUrl', label: '访问地址' },
  { name: 'account', field: 'account', label: '账号' },
  { name: 'password', field: 'password', label: '密码' },
  { name: 'createdAt', field: 'createdAt', label: '创建时间' },
  { name: 'expiredAt', field: 'expiredAt', label: '到期时间' },
  { name: 'user.account', field: 'user.account', label: '用户' },
  { name: 'action', field: 'action', label: '操作' },
])
const rows: Array<any> = reactive([])
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})
const loading = ref(true)

onMounted(async () => {
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
    const body: IQueryConfig<IDesktop> = {
      pagination: {
        page,
        pageSize: rowsPerPage,
      },
      filters: [
        {
          field: 'disabled',
          type: '=',
          value: false,
        },
      ],
      sort: [
        {
          field: 'createdAt',
          order: 'DESC',
        },
      ],
      relations: {
        user: {
          verification: true,
        },
      },
    }
    const { total, data } = await desktopQueryList(body) as QueryDesktop
    pagination.value.rowsNumber = total
    rows.splice(0, rows.length, ...data.map(v => flattenJSON(v)))
    rows.forEach((item) => {
      item.createdAt = moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
      item.expiredAt = moment(item.expiredAt).format('YYYY-MM-DD')
    })
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
 * 查看用户信息
 * @param row
 */
async function checkUserInfo(row: any) {
  $q.dialog({
    component: await defineAsyncComponent(
      () => import('./dialog/UserInfoDialog.vue'),
    ).__asyncLoader(),
    componentProps: {
      userInfo: row,
    },
  })
}

/**
 * 停用云桌面
 * @param id 云桌面id
 */
function deleteDesktop(id: string) {
  $q.dialog({
    title: '停用确认',
    message: '该操作将停用该云桌面，是否继续？',
    cancel: true,
  }).onOk(async () => {
    loading.value = true
    try {
      const res = await stopDesktop(id)
      if (res) {
        $q.notify({
          message: '停用成功！',
          type: 'success',
        })
        tableRef.value?.requestServerInteraction()
      }
      else {
        throw new Error('停用失败！')
      }
    }
    catch (_) {
      $q.notify({
        message: '停用失败！',
        type: 'danger',
      })
    }
    finally {
      loading.value = false
    }
  })
}

/**
 * 添加/编辑云桌面
 * @param row
 */
async function desktopDialog(row?: any) {
  $q.dialog({
    component: await defineAsyncComponent(
      () => import('./dialog/DesktopDialog.vue'),
    ).__asyncLoader(),
    componentProps: {
      type: row ? 'update' : 'add',
      desktop: row,
      callback: () => {
        tableRef.value?.requestServerInteraction()
      },
    },
  })
}

/**
 * 分配云桌面
 * @param id
 */
async function allocationDesktop(id: string) {
  if (!id)
    return
  $q.dialog({
    component: await defineAsyncComponent(
      () => import('./dialog/AllocationDialog.vue'),
    ).__asyncLoader(),
    componentProps: {
      id,
      callback: () => {
        tableRef.value?.requestServerInteraction()
      },
    },
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
    :rows-per-page-options="[50, 60, 70]"
    @request="queryData"
  >
    <template #top-right>
      <q-btn
        color="primary"
        @click="desktopDialog()"
      >
        添加云桌面
        <q-icon name="fas fa-plus" size="18px" ml-2 />
      </q-btn>
    </template>
    <template #loading>
      <q-inner-loading showing color="primary" />
    </template>
    <template #body="props">
      <q-tr :props="props">
        <q-td v-for="col in cols" :key="col.name">
          <template v-if="col.name === 'user.account'">
            <q-btn v-if="props.row['user.account']" flat no-caps color="primary" :label="props.row['user.account']" @click="checkUserInfo(props.row)" />
          </template>
          <template v-else-if="col.name === 'action'">
            <q-btn label="分配" color="green" size="sm" mr-2 @click="allocationDesktop(props.row.id)" />
            <q-btn label="编辑" color="primary" size="sm" mr-2 @click="desktopDialog(props.row)" />
            <q-btn label="停用" color="red" size="sm" @click="deleteDesktop(props.row.id)" />
          </template>
          <template v-else>
            {{ props.row[col.field as string] }}
          </template>
        </q-td>
      </q-tr>
    </template>
  </QTable>
</template>
