<script setup lang="ts">
import type { QTableProps } from 'quasar'

export type OperationType = 'addRows' | 'search'

interface Props {
  rows: Array<any>
  cols: QTableProps['columns']
  operation?: Array<OperationType>
  loading?: boolean
  search?: string
}
const props = defineProps<Props>()
const emits = defineEmits(['update:rows', 'update:search'])

const rowsRef = ref<Array<any>>([])

function addRow() {
  if (!props.cols?.length)
    return
  const res = {} as any
  for (const obj of props.cols)
    res[`${obj.name}`] = null

  rowsRef.value.push(res)

  emits('update:rows', rowsRef.value)
}

function deleteRow(rowItem: any) {
  const targetIndex = props.rows.findIndex((row) => {
    for (const key in rowItem) {
      if (rowItem[key] !== row[key])
        return false
    }
    return true
  })

  if (targetIndex !== -1)
    rowsRef.value.splice(targetIndex, 1)
  emits('update:rows', rowsRef.value)
}

watch(() => props.rows, (newRow) => {
  if (newRow && newRow.length) {
    rowsRef.value = newRow
    emits('update:rows', newRow)
  }
}, { deep: true, immediate: true })

defineExpose({
  deleteRow,
})
</script>

<template>
  <q-table :rows="rows" :columns="cols" :loading="loading">
    <template #top-left>
      <div w-full flex="~ row justify-between">
        <q-btn v-if="operation?.includes('addRows')" label="增加一项" push color="primary-1" @click="addRow" />
      </div>
    </template>
    <template #top-right>
      <q-input
        v-if="operation?.includes('search')"
        :model-value="search"
        dense
        borderless debounce="300" placeholder="搜索"
        @update:model-value="(val) => $emit('update:search', val)"
      >
        <template #append>
          <div i-mingcute:search-2-line />
        </template>
      </q-input>
    </template>

    <template #body="props">
      <q-tr :props="props">
        <q-td v-for="c in cols" :key="c.name">
          <slot :props="props" :col="c.name" />
        </q-td>
      </q-tr>
    </template>
    <template #loading>
      <q-inner-loading showing color="primary" />
    </template>
  </q-table>
</template>

<style lang="">

</style>
