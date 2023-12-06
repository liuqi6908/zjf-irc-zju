<script lang="ts" setup>
import type { Node } from '~/composables/database'
import { Notify } from 'quasar'
import { updateReference } from '~/api/data'

const { rootData } = useDatabase()

const database = ref<Node[]>((rootData.value || [])[0]?.children || [])
const id = ref('')
const text = ref('')

/**
 * 更新引用规范
 */
async function confirm() {
  const res = await updateReference(id.value, text.value)
  if (res) {
    Notify.create({
      message: '更新成功',
      type: 'success',
    })
    const obj = database.value.find(v => v.id === id.value)
    if (obj)
      obj.reference = text.value
    id.value = ''
  }
}
</script>

<template>
  <div flex="~ col gap-4">
    <div text-xl font-600 mb-2>
      引用规范
    </div>
    <div v-if="!database?.length" text-alert-error mt-4>
      编辑引用规范前请先上传中间表
    </div>

    <div
      v-for="item in database"
      :key="item.id"
      flex="~ row items-center gap-4"
    >
      <div v-text="item.nameZH" />
      <q-btn
        color="primary"
        label="编辑引用规范"
        ml-auto
        @click="() => {
          id = item.id
          text = item.reference || ''
        }"
      />
    </div>

    <q-dialog :model-value="!!id" @update:model-value="id = ''">
      <q-card min-w-200>
        <q-card-section>
          <q-input
            v-model="text"
            filled max-h-100
            type="textarea"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat color="primary" label="确认" @click="confirm" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
