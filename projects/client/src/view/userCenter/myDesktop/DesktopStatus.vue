<script lang="ts" setup>
import type { DesktopQueueStatus } from 'zjf-types'

interface Props {
  status?: DesktopQueueStatus
  /** 附加信息（驳回理由，排队人数） */
  queueLength?: string
  duration?: number
}
const props = defineProps<Props>()

const statusOptions = {
  pending: {
    text: '待审核',
    icon: 'material-symbols:alarm',
    color: 'alert-warning',
  },
  queueing: {
    text: '排队中',
    icon: 'i-mdi:dots-horizontal',
    color: 'alert-warning',
  },
  using: {
    icon: 'i-mdi:check-circle',
    color: 'alert-success',
    text: '使用中',
  },
}

const statusClass = computed(() => {
  if (!props.status)
    return
  if (props.duration || props.duration === 0)
    statusOptions[`${props.status}`].caption = `（倒计时${props.duration}天）`

  if (props.queueLength || props.queueLength === 0)
    statusOptions[`${props.status}`].caption = `前面有${props.queueLength}人在排队`

  return statusOptions[`${props.status}`]
})
</script>

<template>
  <div border-1 border-primary-1 p2 class="~ row items-center justify-center">
    <span text-4 text-grey-8> 状态：</span>
    <div :class="`text-${statusClass?.color} ${statusClass?.icon}`" mx-1 />
    <span text-4 text-grey-8>{{ statusClass?.text }}</span>
    <span text-4 text-grey-8>{{ statusClass?.caption }}</span>
  </div>
</template>

<style lang="">

</style>
