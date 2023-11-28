<script setup lang="ts">
import type { QTableProps } from 'quasar'
import { ref, watch } from 'vue';

export type OperationType = 'addRows' | 'search'

interface Props {
  rows: Array<any>
  cols: QTableProps['columns']
  operation?: Array<OperationType>
  loading?: boolean
  /** 是否启用分页，禁用后，强制显示全部的数据 */
  disablePagination?: boolean
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
  addRow,
})
</script>

<template>
  <q-table
    class="my-sticky-dynamic"
    :rows="rows"
    bordered
    separator="cell"
    :columns="cols"
    :loading="loading"
    flat
    :hide-bottom="disablePagination"
    :pagination="{ rowsPerPage: disablePagination ? 0 : 10 }"
  >
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
  border-radius: 0 !important

  .q-table__top,
  thead tr:first-child th
    background: rgba(2, 92, 185, 0.70)
    color: #fff
  thead tr,
  tbody tr
    min-height: 40px
    height: auto

  tr
    min-height: 40px
    height: auto
    th,
    td
      height: 40px
      padding: 8px
      font-weight: 400
      border-color: var(--grey-3)
      font-size: 16px
      color: var(--grey-8)

  // 底部分页
  .q-table__bottom
    min-height: 30px
    padding: 0 8px
    background: var(--grey-2)
    color: var(--grey-8)
  .q-table__control .q-btn i
    font-size: 1rem

  .q-table__control button span.q-btn__content
    color: var(--grey-5)

  .q-table__control .q-select .q-field__control
    span
      color: var(--grey-7)
    i
      color: var(--grey-4)
</style>
