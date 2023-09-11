<script setup lang="ts">
import type { IQueryDto, IUser } from 'zjf-types'
import { Notify, QTable, useQuasar } from 'quasar'
import type { QTableProps } from 'quasar'
import moment from 'moment'
import { searchUserQuery } from '~/api/auth/user/searchUserQuery'
import { getUrlByToken } from '~/api/file/getUrl'
import { updateRole } from '~/api/auth/user/updateRole'

interface QueryUser {
  page: number
  pageSize: number
  total: number
  data: any[]
}

const $q = useQuasar()
const tableRef = ref<QTable>()

const columns: QTableProps['columns'] = reactive([
  { name: 'account', field: 'account', label: '用户' },
  { name: 'email', field: 'email', label: '邮箱' },
  { name: 'name', field: 'verification.name', label: '姓名' },
  { name: 'school', field: 'verification.school', label: '学校' },
  { name: 'college', field: 'verification.college', label: '学院' },
  { name: 'number', field: 'verification.number', label: '学号' },
  { name: 'idCard', field: 'verification.idCard', label: '身份证' },
  { name: 'identify', field: 'verification.identify', label: '身份' },
  { name: 'dataRoleName', field: 'dataRoleName', label: '角色' },
  { name: 'roleName', field: 'roleName', label: '权限' },
  { name: 'createdAt', field: 'createdAt', label: '注册时间' },
  { name: 'updatedAt', field: 'verification.updatedAt', label: '认证时间' },
  { name: 'status', field: 'verification.status', label: '状态' },
  { name: 'attachments', field: 'attachments', label: '证明材料' },
  { name: 'action', field: 'action', label: '操作' },
])
const rows: Array<any> = reactive([])
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})
const loading = ref(true)
const filter = ref('')

onMounted(async () => {
  columns.forEach((item) => {
    item.align = 'center'
  })
  // 从服务器获取初始数据
  tableRef.value?.requestServerInteraction()
})

/**
 * 查询用户列表
 */
async function queryUserList(props: any) {
  const { filter } = props
  const { page, rowsPerPage } = props.pagination
  loading.value = true

  try {
    const body: IQueryDto<IUser> = {
      pagination: {
        page,
        pageSize: rowsPerPage,
      },
      filters: [],
      sort: [
        {
          field: 'roleName',
          order: 'DESC',
        },
      ],
      relations: {
        verification: true,
      },
    }
    if (filter) {
      body.filters?.push({
        field: 'account',
        type: 'LIKE',
        value: filter,
      })
    }
    const { total, data } = await searchUserQuery(body) as QueryUser
    pagination.value.rowsNumber = total
    rows.splice(0, rows.length, ...data.map(v => flattenJSON(v)))
    rows.forEach((item) => {
      item.createdAt = moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
      item['verification.identify'] = userIdentify.find(v => v.value === item['verification.identify'])?.label
      item['verification.updatedAt'] = item['verification.updatedAt'] ? moment(item['verification.updatedAt']).format('YYYY-MM-DD HH:mm:ss') : null
      item['verification.status'] = userStatus.find(v => v.value === item['verification.status'])?.label || '未认证'
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
 * 查看证明材料
 * @param row
 */
function checkAttachment(row: any) {
  const images = row['verification.attachments']
  let message = ''

  if (images && images.length) {
    images.forEach((filename: string) => {
      const src = getUrlByToken(`file/private/verify/${row.id}/${filename}`)
      message += `<img src="${src}"><a href="${src}" download>点击下载文件</a><br/>`
    })
  }
  else {
    message = '当前用户暂无认证材料'
  }

  $q.dialog({
    title: '查看认证材料',
    message,
    html: true,
  })
}

/**
 * 分配/取消 管理员
 * @param row
 */
function approveAdmin(row: any, root: string) {
  let message
  if (root)
    message = '是否给当前用户分配管理员？'
  else
    message = '是否取消当前用户的管理员？'
  $q.dialog({
    title: `${root ? '分配' : '取消'}确认`,
    message,
    cancel: true,
  }).onOk(async () => {
    const res = await updateRole(row.id, root)
    if (res) {
      Notify.create({
        message: '操作成功',
        type: 'success',
      })
    }
    // 重新获取数据
    tableRef.value?.requestServerInteraction()
  })
}
</script>

<template>
  <div class="admin-client" p-4>
    <QTable
      ref="tableRef"
      v-model:pagination="pagination"
      title="管理员分配"
      h-full
      :columns="columns"
      :rows="rows"
      :loading="loading"
      :rows-per-page-options="rowsPerPageOptions"
      :filter="filter"
      @request="queryUserList"
    >
      <template #top-right>
        <q-input v-model="filter" dense debounce="500" placeholder="搜索用户账号">
          <template #append>
            <q-icon name="fas fa-search" size="16px" />
          </template>
        </q-input>
      </template>
      <template #loading>
        <q-inner-loading showing color="primary" />
      </template>
      <template #body="props">
        <q-tr :props="props">
          <q-td v-for="col in columns" :key="col.name">
            <template v-if="col.name === 'attachments'">
              <q-btn flat color="primary" label="查看认证材料" @click="checkAttachment(props.row)" />
            </template>
            <template v-else-if="col.name === 'action'">
              <q-btn label="分配" :disable="Boolean(props.row.roleName)" color="primary" mr-2 size="sm" @click="approveAdmin(props.row, 'root')" />
              <q-btn label="取消" :disable="!Boolean(props.row.roleName)" color="red" size="sm" @click="approveAdmin(props.row, '')" />
            </template>
            <template v-else>
              {{ props.row[col.field as string] }}
            </template>
          </q-td>
        </q-tr>
      </template>
    </QTable>
  </div>
</template>

<style lang="scss" scoped>
.admin-client {
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
