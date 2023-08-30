<script setup lang="ts">
import type { FileExportLargeStatus } from 'zjf-types'

interface Props {
  status: FileExportLargeStatus
}
const props = defineProps<Props>()

const textContent = reactive<Record<FileExportLargeStatus, any>>({
  approved: { text: '已通过', icon: 'i-material-symbols:done', color: 'alert-success' },
  rejected: { text: '已驳回', icon: 'i-material-symbols:close-rounded', color: 'alert-error' },
  pending: { text: '审核中', icon: 'i-material-symbols:horizontal-rule', color: 'alert-warning' },
})

const statusClass = computed(() => {
  return `bg-${textContent[props.status]?.color}`
})
</script>

<template>
  <div :class="statusClass" w-25 flex-center gap-1 rounded-6 px-3 py-1 text-grey-1>
    <div h-4 w-4 flex-center rounded-9999 bg-grey-1>
      <div :class="[`${textContent[status].icon}`, `bg-${textContent[props.status]?.color}`]" h-4 w-4 />
    </div>

    <span font-500 text-grey-1>{{ textContent[status].text }}</span>
  </div>
</template>

<style lang="">

</style>
