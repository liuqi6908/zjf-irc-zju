<script setup lang="ts">
import moment from 'moment'
import { exportFile, useQuasar } from 'quasar'
import type { QTableProps } from 'quasar'

export type OperationType = 'addRows' | 'search' | 'export'

interface Props {
  rows: Array<any>
  cols: QTableProps['columns']
  operation?: Array<OperationType>
  loading?: boolean
  search?: string
  export?: string
}
const props = defineProps<Props>()
const emits = defineEmits(['update:rows', 'update:search'])

const rowsRef = ref<Array<any>>([])
const pagination = ref({ rowsPerPage: 50 })

const $q = useQuasar()

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

function exportTable() {
  if (!props.rows || !props.cols)
    return

  const content = [props.cols!.map(col => `"${col.label}"`)].concat(
    props.rows.map(row => props.cols!.map(col => `"${row[col.field as string]}"`).join(',')),
  ).join('\r\n')

  const status = exportFile(
    `${props.export}${moment().format('YYYY-MM-DD HH:mm:ss')}.csv`,
    content,
    'text/csv',
  )

  if (!status) {
    $q.notify({
      message: '已取消下载...',
      type: 'warn',
    })
  }
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
  <q-table
    :rows-per-page-options="[50, 60, 70]"
    :rows="rows" :columns="cols" :loading="loading"
  >
    <template #top-left>
      <div w-full flex="~ row justify-between">
        <q-btn v-if="operation?.includes('addRows')" label="增加一项" push color="primary-1" @click="addRow" />
      </div>
    </template>

    <template v-if="operation?.includes('search')" #top-right>
      <q-input
        :model-value="search"
        dense
        borderless
        debounce="200"
        placeholder="搜索"
        @update:model-value="(val) => $emit('update:search', val)"
      >
        <template #append>
          <div i-mingcute:search-2-line />
        </template>
      </q-input>
    </template>

    <template v-else-if="operation?.includes('export')" #top-right>
      <q-btn
        color="primary"
        :disable="!rows || rows.length === 0"
        ml-6
        @click="exportTable"
      >
        导出为CSV
        <q-icon name="fas fa-download" size="18px" ml-2 />
      </q-btn>
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
