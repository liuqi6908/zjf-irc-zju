<script setup lang="ts">
import { QTable, useQuasar } from 'quasar'
import type { QTableProps } from 'quasar'
import type { IDataDirectory } from 'zjf-types'
import RoleDialog from './dialog/RoleDialog.vue'
import { deleteDataRole, queryDataRole } from '~/api/dataRole'

export interface Node {
  id: string
  label: string
  children?: Node[]
}

defineProps<{ title: string }>()
const $q = useQuasar()
const { $get } = useRequest()
const tableRef = ref<QTable>()

const cols: QTableProps['columns'] = reactive([
  { name: 'name', field: 'name', label: '角色名称' },
  { name: 'description', field: 'description', label: '描述' },
  { name: 'sort', field: 'sort', label: '排序' },
  { name: 'select', field: 'select', label: '是否可选' },
  { name: 'action', field: 'action', label: '操作' },
])
const rows: Array<any> = reactive([])
const loading = ref(true)

const roleTree: Node[] = reactive([])
const name = ref('')
const dialog = ref(false)

onMounted(() => {
  cols.forEach(item => item.align = 'center')
  queryRoleList()
  getRootList()
})

/**
 * 查询数据下载角色列表
 */
async function queryRoleList() {
  loading.value = true
  try {
    const data = await queryDataRole()
    rows.splice(0, rows.length, ...data)
  }
  catch (_) {}
  finally {
    loading.value = false
  }
}

/**
 * 删除数据下载角色
 * @param name
 */
function deleteRole(name: string) {
  $q.dialog({
    title: '删除确认',
    message: `该操作将删除 <b>${name}</b> 角色，是否继续？`,
    cancel: true,
    html: true,
  }).onOk(async () => {
    loading.value = true
    try {
      const res = await deleteDataRole(name)
      if (res) {
        $q.notify({
          message: '删除成功！',
          type: 'success',
        })
        await queryRoleList()
      }
    }
    catch (_) {}
    finally {
      loading.value = false
    }
  })
}

/**
 * 添加/编辑数据下载角色
 * @param name
 */
async function addRole(name?: string) {
  $q.dialog({
    component: await defineAsyncComponent(
      () => import('./dialog/AddDialog.vue'),
    ).__asyncLoader(),
    componentProps: {
      type: name ? 'update' : 'add',
      name,
      callback: async () => {
        await queryRoleList()
      },
    },
  })
}

/**
 * 获取所有的根节点（数据大类）
 */
async function getRootList() {
  try {
    const data = await $get<IDataDirectory[]>('/data/root/list')
    data.forEach((item) => {
      roleTree.push({
        id: item.id,
        label: item.nameZH,
        children: [],
      })
      getRootData(item.id)
    })
  }
  catch (_) { }
}

/**
 * 获取制定分类的数据
 * @param id
 */
async function getRootData(id: string) {
  try {
    const data = await $get<IDataDirectory[]>(`/data/list/${id}`)
    const obj = roleTree.find(v => v.id === id)
    function disposalData(data?: IDataDirectory[]): any {
      return data?.map((v) => {
        return {
          id: v.id,
          label: v.nameZH,
          children: disposalData(v.children),
        }
      })
    }
    if (obj)
      obj.children = disposalData(data[0]?.children)
  }
  catch (_) { }
}
</script>

<template>
  <div>
    <QTable
      ref="tableRef"
      :title="title"
      h-full
      :columns="cols"
      :rows="rows"
      :loading="loading"
      hide-bottom
      :pagination="{
        rowsPerPage: rows.length,
      }"
      row-key="name"
    >
      <template #top-right>
        <q-btn
          color="primary"
          @click="addRole()"
        >
          添加角色
          <q-icon name="fas fa-plus" size="18px" ml-2 />
        </q-btn>
      </template>
      <template #loading>
        <q-inner-loading showing color="primary" />
      </template>
      <template #body="props">
        <q-tr :props="props">
          <q-td v-for="col in cols" :key="col.name">
            <template v-if="col.name === 'action'">
              <q-btn label="权限" color="green" size="sm" @click="() => (dialog = true, name = props.row.name)" />
              <q-btn label="编辑" mx-2 color="primary" size="sm" @click="addRole(props.row.name)" />
              <q-btn label="删除" color="red" size="sm" @click="deleteRole(props.row.name)" />
            </template>
            <template v-else-if="col.name === 'select'">
              {{ props.row[col.field as string] ? '是' : '否' }}
            </template>
            <template v-else>
              {{ props.row[col.field as string] }}
            </template>
          </q-td>
        </q-tr>
      </template>
    </QTable>
    <RoleDialog
      v-if="dialog"
      v-model="dialog"
      :name="name"
      :tree="roleTree"
    />
  </div>
</template>
