<script setup lang="ts">
import type { IQueryDto, IUser } from 'zjf-types'
import { Notify, QTable, useQuasar } from 'quasar'
import moment from 'moment'
import { hideSensitiveInfo } from 'zjf-utils'
import { searchUserQuery } from '~/api/auth/user/searchUserQuery'
import { updateUserRole } from '~/api/role'

const $q = useQuasar()
const tableRef = ref<QTable>()

const rows: Array<any> = reactive([])
const pagination = tablePagination()
const loading = ref(true)
const filter = ref('')

onMounted(async () => {
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
    const { total, data } = await searchUserQuery(body)
    pagination.value.rowsNumber = total
    rows.splice(0, rows.length, ...data.map(v => flattenJSON(v)))
    rows.forEach((item) => {
      item.createdAt = moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
      item['verification.idCard'] = hideSensitiveInfo(item['verification.idCard'])
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
 * 取消管理员
 * @param row
 */
function cancelAdmin(id: string) {
  $q.dialog({
    title: '取消确认',
    message: '是否取消当前用户的管理员？',
    cancel: true,
  }).onOk(async () => {
    loading.value = true
    try {
      const res = await updateUserRole(id, '')
      if (res) {
        Notify.create({
          message: '操作成功',
          type: 'success',
        })
        tableRef.value?.requestServerInteraction()
      }
    }
    catch (_) {}
    finally {
      loading.value = false
    }
  })
}

/**
 * 分配角色
 * @param id
 */
async function assignRoles(id: string, roleName?: string) {
  if (!id)
    return
  $q.dialog({
    component: await defineAsyncComponent(
      () => import('./dialog/AssignDialog.vue'),
    ).__asyncLoader(),
    componentProps: {
      id,
      roleName,
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
    title="管理员分配"
    h-full
    :columns="userTableCols"
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
        <q-td v-for="col in userTableCols" :key="col.name">
          <template v-if="col.name === 'attachments'">
            <q-btn flat color="primary" label="查看认证材料" @click="checkAttachment(props.row[col.field as string], props.row.id)" />
          </template>
          <template v-else-if="col.name === 'action'">
            <q-btn label="分配" :disable="props.row.account === 'root'" color="primary" mr-2 size="sm" @click="assignRoles(props.row.id, props.row.roleName)" />
            <q-btn label="取消" :disable="!props.row.roleName || props.row.account === 'root'" color="red" size="sm" @click="cancelAdmin(props.row.id)" />
          </template>
          <template v-else>
            {{ props.row[col.field as string] }}
          </template>
        </q-td>
      </q-tr>
    </template>
  </QTable>
</template>
