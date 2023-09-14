<script setup lang="ts">
import { useQuasar } from 'quasar'
import { queryDataRole, updateUserDataRole } from '~/api/dataRole'

interface Props {
  id: string
  dataRoleName?: string
  callback: () => void
}

const { id, dataRoleName, callback = () => {} } = defineProps<Props>()
const $q = useQuasar()

const dialog = ref(true)
const loading = ref(false)
const name = ref(dataRoleName)
const options = ref<any[]>([])

onBeforeMount(async () => {
  options.value = await queryDataRole()
})

/**
 * 分配角色
 */
async function assignRoles() {
  if (!id || !name.value)
    return
  try {
    loading.value = true
    const flag = await updateUserDataRole(id, name.value)
    if (flag) {
      $q.notify({
        message: '分配成功！',
        type: 'success',
      })
      dialog.value = false
      callback()
    }
  }
  catch (_) { }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <QDialog v-model="dialog">
    <QCard relative p-6 min-w-80 w-30vw class="max-w-inherit!">
      <header relative text-lg mb-5>
        分配角色
        <q-btn v-close-popup size="10px" icon="fas fa-times" absolute flat top-0 right-0 px-1 />
      </header>
      <q-list>
        <q-item
          v-for="(item, index) in options"
          :key="index"
          v-ripple
          tag="label"
        >
          <q-item-section avatar>
            <q-radio v-model="name" :val="item.name" />
          </q-item-section>
          <q-item-section>
            <q-item-label v-text="item.name" />
            <q-item-label caption v-text="item.description" />
          </q-item-section>
        </q-item>
      </q-list>
      <footer mt-5 text-right>
        <q-btn flat color="primary" label="取消" @click="dialog = false" />
        <q-btn :disable="!id || !name" label="分配" ml-2 color="primary" @click="assignRoles()" />
      </footer>
      <q-inner-loading :showing="loading" color="primary" />
    </QCard>
  </QDialog>
</template>
