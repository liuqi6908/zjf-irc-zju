<script setup lang="ts">
import { useQuasar } from 'quasar'
import { createDesktop } from '~/api/desktop/createDesktop'
import { updateDesktop } from '~/api/desktop/updateDesktop'

interface Props {
  type: 'update' | 'add'
  desktop?: {
    id: string
    internalIp: string
    accessUrl: string
    account: string
    password: string
    expiredAt: string
  }
  callback?: () => void
}

const { type, desktop, callback = () => {} } = defineProps<Props>()
const $q = useQuasar()
const desktopForm = reactive<Record<string, string>>({})
const dialog = ref(true)
const loading = ref(false)

onMounted(() => {
  onReset()
})

const disable = computed(() => {
  for (const key in desktopForm) {
    if (!desktopForm[key])
      return true
  }
  return false
})

/**
 * 提交
 */
async function onSubmit() {
  if (disable.value)
    return
  try {
    loading.value = true
    let flag = false
    if (type === 'add')
      flag = await createDesktop(desktopForm as any)
    else
      flag = await updateDesktop(desktopForm.id, desktopForm as any)
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
  desktopForm.id = desktop?.id || ''
  desktopForm.internalIp = desktop?.internalIp || ''
  desktopForm.accessUrl = desktop?.accessUrl || ''
  desktopForm.account = desktop?.account || ''
  desktopForm.password = desktop?.password || ''
  desktopForm.expiredAt = desktop?.expiredAt || ''
}
</script>

<template>
  <QDialog v-model="dialog">
    <QCard p-6 min-w-100 relative>
      <header text-lg mb-5 relative>
        {{ type === 'add' ? '添加云桌面' : '编辑云桌面' }}
        <q-btn v-close-popup size="10px" icon="fas fa-times" absolute top-0 right-0 flat px-1 />
      </header>
      <q-form
        @submit="onSubmit"
        @reset="onReset"
      >
        <q-input
          v-model="desktopForm.id"
          label="ID"
          filled
          lazy-rules
          :readonly="type === 'update'"
          :rules="[val => val && val.length > 0 || '请输入云桌面ID']"
        />
        <q-input
          v-model="desktopForm.internalIp"
          label="IP地址"
          filled
          lazy-rules
          :rules="[val => val && val.length > 0 || '请输入云桌面IP地址']"
        />
        <q-input
          v-model="desktopForm.accessUrl"
          label="访问地址"
          filled
          lazy-rules
          :rules="[val => val && val.length > 0 || '请输入云桌面访问地址']"
        />
        <q-input
          v-model="desktopForm.account"
          label="账号"
          filled
          lazy-rules
          :rules="[val => val && val.length > 0 || '请输入云桌面账号']"
        />
        <q-input
          v-model="desktopForm.password"
          label="密码"
          filled
          lazy-rules
          :rules="[val => val && val.length > 0 || '请输入云桌面密码']"
        />
        <q-input
          v-model="desktopForm.expiredAt"
          label="到期时间"
          type="date"
          filled
          lazy-rules
          :rules="[val => val && val.length > 0 || '请选择云桌面到期时间']"
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
