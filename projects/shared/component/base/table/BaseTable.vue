<script setup lang="ts">
import type { QTableProps } from 'quasar'
import { ref, watch } from 'vue';

export type OperationType = 'addRows' | 'search'

interface Props {
  rows: Array<any>
  cols: QTableProps['columns']
  operation?: Array<OperationType>
  loading?: boolean
}
const props = defineProps<Props>()
const emits = defineEmits(['update:rows'])

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

watch(() => props.rows, () => {
  if (props.rows&& props.rows.length) {
    rowsRef.value = props.rows
    emits('update:rows', props.rows)
  }
}, { deep: true, immediate: true })

defineExpose({
  deleteRow,
})
</script>

<template>
  <q-table class="my-sticky-dynamic" :rows="rows" bordered separator="cell" :columns="cols" :loading="loading" flat>
    <!-- <template #top-left>
      <div w-full flex="~ row justify-between">
        <q-btn v-if="operation?.includes('addRows')" label="增加一项" push color="primary-1" @click="addRow" />
      </div>
    </template> -->
    <!-- <template #top-right>
      <q-input v-if="operation?.includes('search')" borderless dense debounce="300" placeholder="搜索">
        <template #append>
          <div i-mingcute:search-2-line />
        </template>
      </q-input>
    </template> -->

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

<style lang="sass">
.my-sticky-dynamic
  border-radius: 0

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th /* bg color is important for th; just specify one */
      background: rgba(2, 92, 185, 0.70)
      color: #fff
</style>