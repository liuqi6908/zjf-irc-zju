<script setup lang="ts">
import { QTable, useQuasar } from 'quasar'
import type { QTableProps } from 'quasar'
import type { IDataDirectory } from 'zjf-types'
import { deleteDataRole, queryDataRole, queryDataRoleInfo, upsertDataRole } from '~/api/dataRole'
import type { IRequest } from '~/api/dataRole'

interface Node {
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
  { name: 'action', field: 'action', label: '操作' },
])
const rows: Array<any> = reactive([])
const loading = ref(true)

const rowLoading = ref(false)
let rowKey = ''
const roleTree: Node[] = reactive([])
const download: Record<string, string[]> = reactive({
  ticked: [],
  expanded: [],
})
const view: Record<string, string[]> = reactive({
  ticked: [],
  expanded: [],
})

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
 * @param row
 */
async function addRole(row?: any) {
  $q.dialog({
    component: await defineAsyncComponent(
      () => import('./dialog/AddDialog.vue'),
    ).__asyncLoader(),
    componentProps: {
      type: row ? 'update' : 'add',
      role: row,
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

/**
 * 展开行
 * @param key
 */
async function handleExpandRow(key?: string) {
  if (rowKey && key === rowKey) {
    rowKey = ''
    return tableRef.value?.setExpanded([])
  }
  if (!key)
    key = rowKey
  else
    rowKey = key
  rowLoading.value = true
  tableRef.value?.setExpanded([key])
  download.ticked = []
  download.expanded = []
  view.ticked = []
  view.expanded = []
  try {
    const { downloadDirectories, viewDirectories } = await queryDataRoleInfo(key)
    download.ticked = downloadDirectories?.map(v => v.id) || []
    view.ticked = viewDirectories?.map(v => v.id) || []
  }
  catch (_) {}
  finally {
    rowLoading.value = false
  }
}

/**
 * 更新数据权限
 */
function updateDataRole() {
  const obj = rows.find(v => v.name === rowKey)
  if (!rowKey || !obj)
    return
  $q.dialog({
    title: '更新确认',
    message: `该操作将更新 <b>${rowKey}</b> 角色的权限，是否继续？`,
    cancel: true,
    html: true,
  }).onOk(async () => {
    rowLoading.value = true
    try {
      const body: IRequest = {
        name: obj.name,
        description: obj.description,
        downloadableDirectoryIds: download.ticked,
        viewableDirectoryIds: view.ticked,
      }

      const flag = await upsertDataRole(body)
      if (flag) {
        $q.notify({
          message: '更新成功！',
          type: 'success',
        })
      }
    }
    catch (_) { }
    finally {
      rowLoading.value = false
    }
  })
}
</script>

<template>
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
            <q-btn label="权限" color="green" size="sm" @click="handleExpandRow(props.key)" />
            <q-btn label="编辑" mx-2 color="primary" size="sm" @click="addRole(props.row)" />
            <q-btn label="删除" color="red" size="sm" @click="deleteRole(props.row.name)" />
          </template>
          <template v-else>
            {{ props.row[col.field as string] }}
          </template>
        </q-td>
      </q-tr>
      <q-tr v-show="props.expand" :props="props">
        <q-td colspan="100%" class="bg-grey-2!">
          <div min-h-60>
            <q-inner-loading v-if="rowLoading" showing z-100 color="primary" />
            <div text-left p-4 flex="~ col">
              <div text-base v-text="'访问权限'" />
              <q-tree
                v-model:ticked="download.ticked"
                v-model:expanded="download.expanded"
                :nodes="roleTree"
                node-key="id"
                tick-strategy="strict"
                mb-4
              />
              <div text-base v-text="'下载权限'" />
              <q-tree
                v-model:ticked="view.ticked"
                v-model:expanded="view.expanded"
                :nodes="roleTree"
                node-key="id"
                tick-strategy="strict"
                mb-2
              />
              <div text-right>
                <q-btn label="重置" mr-4 flat color="primary" @click="handleExpandRow()" />
                <q-btn label="保存" color="primary" @click="updateDataRole()" />
              </div>
            </div>
          </div>
        </q-td>
      </q-tr>
    </template>
  </QTable>
</template>
