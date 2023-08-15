<script lang="ts" setup>
import type { QTableProps } from 'quasar'
import { ref } from 'vue'
import BaseTable from '../../components/table/BaseTable.vue'

interface Props {
  rows: Array<any>
  cols: QTableProps['columns']
}
defineProps<Props>()
defineEmits(['update:rows'])

const baseTableRef = ref(null)
</script>

<template>
  <BaseTable
    ref="baseTableRef"
    v-slot="{ props }"
    :rows="rows"
    :cols="cols"
    @update:rows="(val) => $emit('update:rows', val)"
  >
    {{ props }}
  </BaseTable>
</template>
