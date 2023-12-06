<script setup lang="ts">
import { Notify } from 'quasar'
import { getRoles, updateUserRole } from '~/api/role'
import { IRole } from 'zjf-types'

interface Props {
  id: string
  roleName?: string
  callback: () => void
}

const { id, roleName, callback = () => {} } = defineProps<Props>()

const dialog = ref(true)
const loading = ref(false)
const name = ref(roleName)
const options = ref<IRole[]>([])

onBeforeMount(async () => {
  loading.value = true
  options.value = await getRoles()
  loading.value = false
})

/**
 * 分配角色
 */
async function assignRoles() {
  if (!id || !name.value)
    return
  try {
    loading.value = true
    const flag = await updateUserRole(id, name.value)
    if (flag) {
      Notify.create({
        message: '分配成功！',
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
</script>

<template>
  <QDialog v-model="dialog">
    <QCard relative p-6 min-w-80 w-30vw class="max-w-inherit!">
      <header relative text-lg mb-5>
        分配权限
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
            <q-item-label v-if="item.description" caption v-text="item.description" />
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
