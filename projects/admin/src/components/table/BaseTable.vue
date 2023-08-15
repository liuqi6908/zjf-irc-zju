<script setup lang="ts">
import type { QTableProps } from 'quasar'

export type HeaderSlot = 'addBtn'

interface Props {
  rows: Array<any>
  col: QTableProps['columns']
  header?: Array<HeaderSlot>
}
const props = defineProps<Props>()
const emits = defineEmits(['update:rows'])

const rowsRef = ref<Array<any>>([])

function addRow() {
  if (!props.col?.length)
    return
  const res = {} as any
  for (const obj of props.col)
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
  if (props.rows.length) {
    rowsRef.value = props.rows
    emits('update:rows', props.rows)
  }
}, { deep: true, immediate: true })

defineExpose({
  deleteRow,
})
</script>

<template>
  <q-table :rows="rows" :columns="col">
    <template #top>
      <q-btn v-if="header?.includes('addBtn')" label="增加一项" push color="primary-1" @click="addRow" />
    </template>
    <template #body="props">
      <q-tr :props="props">
        <q-td v-for="c in col" :key="c.name">
          <slot :props="props" :col="c.name" />
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<style lang="">

</style>
