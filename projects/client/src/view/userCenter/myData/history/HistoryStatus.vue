<script setup lang="ts">
import type { FileExportLargeStatus } from 'zjf-types'

interface Props {
  status: FileExportLargeStatus
}
const { status } = defineProps<Props>()

const textContent = reactive<Record<FileExportLargeStatus, any>>({
  approved: { text: '已通过', icon: 'i-material-symbols:done', color: 'success' },
  rejected: { text: '已驳回', icon: 'i-material-symbols:close-rounded', color: 'error' },
  pending: { text: '审核中', icon: 'i-material-symbols:horizontal-rule', color: 'warning' },
})
</script>

<template>
  <div
    :style="{ background: `var(--alert-${textContent[status]?.color})` }"
    flex-center w-25 gap-1 rounded-6 px-3 py-1 text-grey-1
  >
    <div flex-center rounded-9999 bg-grey-1 h-4 w-4>
      <div
        :style="{ background: `var(--alert-${textContent[status]?.color})` }"
        :class="textContent[status].icon" h-4 w-4
      />
    </div>

    <span text-grey-1>{{ textContent[status].text }}</span>
  </div>
</template>
