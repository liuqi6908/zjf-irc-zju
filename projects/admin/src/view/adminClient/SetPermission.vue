<script setup lang="ts">
import { QTable, useQuasar } from 'quasar'
import type { QTableProps } from 'quasar'
import type { IUpsertRoleBodyDto } from 'zjf-types'

import { getRoles, deleteRoleByName, upsertRole } from '~/api/role'

defineProps<{ title: string }>()
const $q = useQuasar()
const tableRef = ref<QTable>()

const cols: QTableProps['columns'] = reactive([
  { name: 'name', field: 'name', label: '名称' },
  { name: 'description', field: 'description', label: '描述' },
  { name: 'permissions', field: 'permissions', label: '权限' },
  { name: 'action', field: 'action', label: '操作' },
])
const rows: Array<any> = reactive([])
const loading = ref(true)

const dialog = ref(false)
const editInfo = ref({
  /** 操作类型（0新增、1编辑） */
  type: 0,
  name: '',
  description: '',
  permissions: [] as string[],
})

onMounted(() => {
  cols.forEach(item => item.align = 'center')
  queryRoles()
})

/**
 * 查询全部角色
 */
async function queryRoles() {
  loading.value = true
  try {
    const data = (await getRoles()).map(v => {
      return {
        ...v,
        permissions: rolePermissionsToLabel(v.permissions?.map(v => v.name))
      }
    })
    rows.splice(0, rows.length, ...data)
  }
  catch (_) {}
  finally {
    loading.value = false
  }
}

/**
 * 删除角色
 * @param name
 */
function deleteRole(name: string) {
  $q.dialog({
    title: '删除确认',
    message: `该操作将删除 <b>${name}</b> 权限，是否继续？`,
    cancel: true,
    html: true,
  }).onOk(async () => {
    loading.value = true
    try {
      const res = await deleteRoleByName(name)
      if (res) {
        $q.notify({
          message: '删除成功！',
          type: 'success',
        })
        await queryRoles()
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
async function addRole(row = {
  name: '',
  description: '',
  permissions: [],
}) {
  editInfo.value = {
    ...row,
    type: row.name ? 1 : 0,
  }
  dialog.value = true
}

async function confirm() {
  const { type, name, description, permissions } = editInfo.value
  if (!name)
    return
  try {
    loading.value = true
    const body: IUpsertRoleBodyDto = {
      name,
      description,
      permissions: labelToRolePermissions(permissions)
    }
    await upsertRole(body)
    $q.notify({
      message: type ? '更新成功！' : '添加成功！',
      type: 'success',
    })
    dialog.value = false
    await queryRoles()
  }
  catch (_) {}
  finally {
    loading.value = false
  }
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
          添加权限
          <q-icon name="fas fa-plus" size="18px" ml-2 />
        </q-btn>
      </template>
      <template #loading>
        <q-inner-loading showing color="primary" />
      </template>
      <template #body="props">
        <q-tr :props="props">
          <q-td
            v-for="col in cols"
            :key="col.name"
            whitespace="pre-wrap!"
          >
            <template v-if="col.name === 'action'">
              <div flex="~ row gap-2 justify-center">
                <q-btn
                  label="编辑" color="primary"
                  size="sm" min-w-14
                  @click="addRole(props.row)"
                />
                <q-btn
                  label="删除" color="red"
                  size="sm" min-w-14
                  @click="deleteRole(props.row.name)"
                />
              </div>
            </template>
            <template v-else-if="col.name === 'permissions'">
              {{ props.row[col.field as string].join('，') }}
            </template>
            <template v-else>
              {{ props.row[col.field as string] }}
            </template>
          </q-td>
        </q-tr>
      </template>
    </QTable>

    <!-- 编辑/新增 权限 -->
    <q-dialog v-model="dialog">
      <q-card min-w-100 p-5>
        <div title-4 v-text="editInfo.type ? '编辑' : '新增'" />
        <q-card-section>
          <q-input
            v-model="editInfo.name"
            label="权限名称"
            filled
            lazy-rules
            :readonly="!!editInfo.type"
            :rules="[val => val && val.length > 0 || '请输入权限名称']"
          />
          <q-input
            v-model="editInfo.description"
            label="描述"
            filled
          />
          <q-checkbox
            indeterminate
            :model-value="!editInfo.permissions.length ? false : editInfo.permissions.length === permissionList.length ? true : null"
            left-label size="sm" mt-4
            @update:model-value="(val) => {
              if (val)
                editInfo.permissions = permissionList.map(v => v.label)
              else
                editInfo.permissions = []
            }"
          >
            <div text-lg font-600>
              权限
            </div>
          </q-checkbox>
          <div flex="~ row gap-x-4 wrap">
            <q-checkbox
              v-for="{ label } in permissionList"
              :key="label"
              v-model="editInfo.permissions"
              :val="label"
              left-label size="xs"
            >
              <div text-sm>
                {{ label }}
              </div>
            </q-checkbox>
          </div>
        </q-card-section>
        <div text-right>
          <q-btn label="取消" color="primary" flat mr-2 @click="dialog = false" />
          <q-btn label="确认" color="primary" :disable="!editInfo.name" @click="confirm" />
        </div>
        <q-inner-loading :showing="loading" color="primary" />
      </q-card>
    </q-dialog>
  </div>
</template>
