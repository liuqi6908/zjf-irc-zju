<script setup lang="ts">
import type { QTableProps } from 'quasar'

export interface TabList {
  label: string
  /** tab名称 */
  id: string
  /** 当前tab是否已经请求过接口 */
  isRequest: boolean
  tableData?: {
    row: QTableProps['rows']
    col: QTableProps['columns']
  }
}
interface Props {
  modelValue: string
  tabList: TabList[]
}
const props = defineProps<Props>()
const emits = defineEmits(['update:modelValue', 'update:currTabObj'])

watch(() => props.modelValue, () => {
  const tabObj = props.tabList.find(i => i.id === props.modelValue)
  if (tabObj)
    emits('update:currTabObj', tabObj)
}, { immediate: true })
</script>

<template>
  <div full>
    <q-tabs bg-grey-2 text-primary-1 :model-value="modelValue" @update:model-value="(tab) => $emit('update:modelValue', tab)">
      <q-tab v-for="tab in tabList" :key="tab.id" text-4 font-600 :name="tab.id">
        {{ tab.label }}
      </q-tab>
    </q-tabs>

    <q-tab-panels :model-value="modelValue" @update:model-value="(tab) => $emit('update:modelValue', tab)">
      <q-tab-panel :name="modelValue">
        <div>
          <slot />
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>
