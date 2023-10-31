<script setup lang="ts">
import { QTable, useQuasar } from 'quasar'
import type { QTableProps } from 'quasar'
import type { IDesktop, IQueryConfig } from 'zjf-types'
import moment from 'moment'
import { batchDeleteDesktop, desktopQueryList } from '~/api/desktop/index'

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
  { name: 'name', field: 'name', label: '云桌面名称' },
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
const pagination = tablePagination()
const loading = ref(true)

/** 选中的云桌面 */
const selected = ref<any[]>([])

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
          value: true,
        },
      ],
      sort: [
        {
          field: 'createdAt',
          order: 'ASC',
        },
      ],
      relations: {
        lastUser: {
          verification: true,
        },
      },
    }
    const { total, data } = await desktopQueryList(body)
    pagination.value.rowsNumber = total
    rows.splice(0, rows.length, ...data.map((v) => {
      v.user = v.lastUser
      delete v.lastUser
      return flattenJSON(v)
    }))
    rows.forEach((item) => {
      item.createdAt = moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
      item.expiredAt = moment(item.expiredAt).format('YYYY-MM-DD HH:mm:ss')
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
 * 删除云桌面
 * @param ids 云桌面id
 */
function deleteDesktop(ids: string[]) {
  $q.dialog({
    title: '删除确认',
    message: '该操作将删除已选云桌面，是否继续？',
    cancel: true,
  }).onOk(async () => {
    loading.value = true
    try {
      const res = await batchDeleteDesktop(ids)
      if (res) {
        $q.notify({
          message: '删除成功！',
          type: 'success',
        })
        tableRef.value?.requestServerInteraction()
      }
      else {
        throw new Error('删除失败！')
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
    v-model:selected="selected"
    :title="title"
    h-full
    :columns="cols"
    :rows="rows"
    :loading="loading"
    :rows-per-page-options="rowsPerPageOptions"
    row-key="id"
    selection="multiple"
    @request="queryData"
  >
    <template #top-right>
      <q-btn
        color="red"
        :disable="!selected.length"
        @click="deleteDesktop(selected.map(v => v.id))"
      >
        批量删除
        <q-icon name="fas fa-trash" size="18px" ml-2 />
      </q-btn>
    </template>
    <template #loading>
      <q-inner-loading showing color="primary" />
    </template>
    <template #body="props">
      <q-tr :props="props">
        <q-td>
          <q-checkbox
            v-model="selected"
            :val="props.row"
          />
        </q-td>
        <q-td v-for="col in cols" :key="col.name">
          <template v-if="col.name === 'user.account'">
            <q-btn v-if="props.row['user.account']" flat no-caps color="primary" :label="props.row['user.account']" @click="checkUserInfo(props.row)" />
          </template>
          <template v-else-if="col.name === 'action'">
            <q-btn label="删除" color="red" size="sm" @click="deleteDesktop([props.row.id])" />
          </template>
          <template v-else>
            {{ props.row[col.field as string] }}
          </template>
        </q-td>
      </q-tr>
    </template>
  </QTable>
</template>
