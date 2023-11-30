<script setup lang="ts">
import { useQuasar } from 'quasar'
import type { IUpsertDataRoleBodyDto } from 'zjf-types'
import { cloneDeep } from 'lodash'
import { upsertDataRole, queryDataRoleInfo } from '~/api/dataRole'

interface Props {
  type: 'update' | 'add'
  name?: string
  callback?: () => void
}

const { type, name, callback = () => {} } = defineProps<Props>()
const $q = useQuasar()
let role: IUpsertDataRoleBodyDto = {
  name: '',
  description: '',
  select: false,
  sort: 0,
  viewableDirectoryIds: [],
  downloadableDirectoryIds: []
}
const roleForm = ref<IUpsertDataRoleBodyDto>(cloneDeep(role))
const dialog = ref(true)
const loading = ref(false)

onMounted(async () => {
  if (name) {
    loading.value = true
    try {
      const res = await queryDataRoleInfo(name)
      const { viewDirectories, downloadDirectories } = res
      delete res.viewDirectories
      delete res.downloadDirectories
      role = {
        ...res,
        viewableDirectoryIds: viewDirectories?.map(v => v.id) || [],
        downloadableDirectoryIds: downloadDirectories?.map(v => v.id) || [],
      }
    }
    catch (_) {}
    finally {
      loading.value = false
      onReset()
    }
  }
})

/**
 * 提交
 */
async function onSubmit() {
  if (!roleForm.value.name)
    return
  try {
    loading.value = true
    const flag = await upsertDataRole({
      ...roleForm.value,
      sort: Number(roleForm.value.sort) || 0
    })
    if (flag) {
      $q.notify({
        message: type === 'update' ? '更新成功！' : '添加成功！',
        type: 'success',
      })
      dialog.value = false
      callback()
    }
  }
  catch (_) {}
  finally {
    loading.value = false
  }
}

/**
 * 重置
 */
function onReset() {
  roleForm.value = cloneDeep(role)
}
</script>

<template>
  <QDialog v-model="dialog">
    <QCard p-6 relative min-w-100>
      <header text-lg mb-5 relative>
        {{ type === 'add' ? '添加角色' : '编辑角色' }}
        <q-btn v-close-popup size="10px" icon="fas fa-times" absolute top-0 right-0 flat px-1 />
      </header>
      <q-form
        @submit="onSubmit"
        @reset="onReset"
      >
        <q-input
          v-model="roleForm.name"
          label="角色名称"
          filled
          lazy-rules
          :readonly="type === 'update'"
          :rules="[val => val && val.length > 0 || '请输入角色名称']"
        />
        <q-input
          v-model="roleForm.description"
          label="描述"
          filled
          class="mb-5"
        />
        <q-input
          v-model="roleForm.sort"
          label="排序"
          filled
          type="number"
        />
        <q-toggle
          v-model="roleForm.select"
          color="primary"
          label="是否可选"
          left-label
          my-3
        />
        <div text-right mt-4>
          <q-btn label="重置" type="reset" color="primary" flat class="q-ml-sm" />
          <q-btn label="提交" :disable="!roleForm.name" type="submit" color="primary" ml-2 />
        </div>
      </q-form>
      <q-inner-loading :showing="loading" color="primary" />
    </QCard>
  </QDialog>
</template>

<style lang="scss" scoped>
.q-form {
  :deep(.q-field__bottom) {
    padding: 4px 10px !important;
  }
}
</style>
