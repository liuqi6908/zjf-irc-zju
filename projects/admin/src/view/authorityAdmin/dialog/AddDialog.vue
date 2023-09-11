<script setup lang="ts">
import { useQuasar } from 'quasar'
import type { IDataRole } from '~/api/dataRole'
import { upsertDataRole } from '~/api/dataRole'

interface Props {
  type: 'update' | 'add'
  role?: IDataRole
  callback?: () => void
}

const { type, role, callback = () => {} } = defineProps<Props>()
const $q = useQuasar()
const roleForm = reactive<IDataRole>({
  name: '',
  description: '',
})
const dialog = ref(true)
const loading = ref(false)

onMounted(() => {
  onReset()
})

const disable = computed(() => !roleForm.name)

/**
 * 提交
 */
async function onSubmit() {
  if (disable.value)
    return
  try {
    loading.value = true
    const flag = await upsertDataRole({
      ...roleForm,
      downloadableDirectoryIds: [],
      viewableDirectoryIds: [''],
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
  roleForm.name = role?.name || ''
  roleForm.description = role?.description || ''
}
</script>

<template>
  <QDialog v-model="dialog">
    <QCard p-6 min-w-100 relative>
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
        />
        <div text-right mt-4>
          <q-btn label="重置" type="reset" color="primary" flat class="q-ml-sm" />
          <q-btn label="提交" :disable="disable" type="submit" color="primary" ml-2 />
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
