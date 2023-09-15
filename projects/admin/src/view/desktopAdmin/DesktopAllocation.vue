<script setup lang="ts">
import { QTable, useQuasar } from 'quasar'
import type { QTableProps } from 'quasar'
import type { IDesktop, IQueryConfig } from 'zjf-types'
import moment from 'moment'
import { createDesktop, desktopQueryList, stopDesktop } from '~/api/desktop/index'

interface Props {
  title?: string
}

withDefaults(defineProps<Props>(), {
  title: '桌面管理',
})

const $q = useQuasar()
const tableRef = ref<QTable>()
const { data, saveAs } = useFileSystemAccess({
  dataType: 'Text',
  excludeAcceptAllOption: true,
  types: [{
    accept: {
      'text/csv': ['.csv'],
    },
    description: 'XLS 工作表',
  }],
})

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
 * 下载模板
 */
function downloadTemplate() {
  data.value = 'id,internalIp,accessUrl,account,password,expiredAt'
  saveAs({
    suggestedName: '桌面分配',
  })
}

/**
 * 上传文件
 */
function uploadFile() {
  if (!file.value)
    return

  const reader = new FileReader()

  reader.onload = async (event) => {
    loading.value = true
    let total = 0
    let success = 0
    const error: number[] = []
    try {
      // 获取读取的文件内容
      const content = event.target?.result as string
      // 将内容解析为 JSON 数组
      const lines = content.split('\n')
      const headers = lines[0].trim().split(',')
      const jsonArray = []
      for (let i = 1; i < lines.length; i++) {
        lines[i] = lines[i].trim().replace('\\r', '')
        if (lines[i]) {
          const line = lines[i].split(',')
          const obj: Record<string, string> = {}
          for (let j = 0; j < headers.length; j++)
            obj[headers[j]] = line[j]
          jsonArray.push(obj)
        }
      }
      total = jsonArray.length
      if (total) {
        for (let i = 0; i < total; i++) {
          try {
            jsonArray[i].expiredAt = new Date(jsonArray[i].expiredAt).toISOString()
            const res = await createDesktop(jsonArray[i] as any, { headers: { dialog: false } })
            if (res)
              success++
            else
              throw new Error('error')
          }
          catch (e: any) {
            error.push(e.response?.data?.message || 'error')
          }
        }
      }
    }
    catch (_) { }
    finally {
      loading.value = false
      file.value = undefined
      if (!total) {
        $q.notify({
          type: 'warn',
          message: '暂无数据',
        })
      }
      else if (!success) {
        $q.notify({
          type: 'danger',
          message: `共 ${total} 条数据，全部上传失败`,
          caption: error.map((v, i) => `${i + 1}：${v}`).join('<br/>'),
          multiLine: true,
          html: true,
          timeout: 0,
          actions: [
            { label: '确认', color: 'white', handler: () => { } },
          ],
        })
      }
      else if (success === total) {
        $q.notify({
          type: 'success',
          message: `已成功上传 ${success} 条数据`,
        })
      }
      else {
        $q.notify({
          type: 'warn',
          message: `共 ${total} 条数据，已成功上传 ${success} 条`,
          caption: error.map((v, i) => `${i + 1}：${v}`).join('<br/>'),
          multiLine: true,
          html: true,
          timeout: 0,
          actions: [
            { label: '确认', color: 'white', handler: () => {} },
          ],
        })
      }
      if (success)
        tableRef.value?.requestServerInteraction()
    }
  }

  reader.readAsText(file.value)
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
      <q-btn
        color="primary"
        @click="downloadTemplate()"
      >
        下载模板
        <q-icon name="fas fa-download" size="18px" ml-2 />
      </q-btn>
      <q-file
        v-model="file"
        class="w-30! mx-4!"
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
