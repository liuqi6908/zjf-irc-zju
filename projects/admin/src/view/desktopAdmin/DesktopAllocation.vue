<script setup lang="ts">
import { QTable, useQuasar } from 'quasar'
import type { QTableProps } from 'quasar'
import type { IDesktop, IQueryConfig } from 'zjf-types'
import moment from 'moment'
import { desktopQueryList, stopDesktop } from '~/api/desktop/index'

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
const pagination = tablePagination()
const loading = ref(true)

const file = ref<File>()

onMounted(() => {
  cols.forEach((item) => {
    item.align = 'center'
  })
  tableRef.value?.requestServerInteraction()
  watch(
    file,
    (newVal) => {
      if (newVal)
        uploadFile()
    },
  )
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
    const { total, data } = await desktopQueryList(body)
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
    catch (_) {}
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

/**
 * 上传文件
 */
async function uploadFile() {
  if (!file.value)
    return
  loading.value = true

  try {
    const fromData = new FormData()
    fromData.append('file', file.value)
    file.value = undefined
    $q.notify({
      type: 'warn',
      message: '敬请期待',
    })
    /* const res = await uploadFileCreateDesktop(fromData)
    if (res) {
      $q.notify({
        type: 'success',
        message: '上传成功',
      })
      tableRef.value?.requestServerInteraction()
    } */
  }
  catch (_) {}
  finally {
    loading.value = false
  }
}

function onRejected() {
  $q.notify({
    type: 'danger',
    message: '只能上传 CSV 格式文件',
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
    <template #top-right>
      <q-file
        v-model="file"
        class="mr-4! w-30!"
        standout dense label-color="grey-1" bg-color="green"
        label="上传CSV" input-style="color: transparent"
        max-files="1" accept="text/csv"
        @rejected="onRejected"
      >
        <template #append>
          <q-icon name="fas fa-cloud-upload" size="18px" color="grey-1" />
        </template>
      </q-file>
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
            <q-btn label="分配" :disable="Boolean(props.row.userId)" color="green" size="sm" mr-2 @click="allocationDesktop(props.row.id)" />
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

<style lang="scss" scoped>
.q-file {
  height: 36px;
  :deep(.q-field__control) {
    min-height: 36px;
    .q-field__control-container {
      padding-top: 0;
      .q-field__label {
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .q-field__append {
      height: 36px;
    }
  }
}
</style>
