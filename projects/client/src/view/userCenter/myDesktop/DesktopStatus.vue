<script lang="ts" setup>
import type { DesktopQueueStatus } from 'zjf-types'

interface Props {
  status?: DesktopQueueStatus
  /** 附加信息（驳回理由，排队人数） */
  queueLength?: string | number
  duration?: number
}
const props = defineProps<Props>()

const statusOptions: Record<DesktopQueueStatus, Record<string, string>> = {
  pending: {
    text: '待审核',
    icon: 'material-symbols:alarm',
    color: 'var(--alert-warning)',
  },
  queueing: {
    text: '排队中',
    icon: 'i-mdi:dots-horizontal',
    color: 'var(--alert-warning)',
  },
  using: {
    icon: 'i-mdi:check-circle',
    color: 'var(--alert-success)',
    text: '使用中',
  },
}

const statusClass = computed(() => {
  if (!props.status)
    return
  if (typeof props.duration === 'number') {
    if (props.duration >= 0 && props.duration < 360)
      statusOptions[`${props.status}`].caption = `（倒计时${props.duration}天）`
    else if (props.duration >= 360)
      statusOptions[`${props.status}`].caption = '（长期）'
  }

  if (props.queueLength || props.queueLength === 0)
    statusOptions[`${props.status}`].caption = `前面有${props.queueLength}人在排队`

  return statusOptions[`${props.status}`]
})
</script>

<template>
  <div flex=" ~ row" h12 items-center justify-center py2.5 font-bold border-1 border-primary-1 px6 text="4 grey-8">
    <span> 状态：</span>
    <div
      :style="{ color: statusClass?.color }"
      :class="`${statusClass?.icon}`" mx-1
    />
    <span>{{ statusClass?.text }}</span>
    <span>{{ statusClass?.caption }}</span>
  </div>
</template>

<style lang="">

</style>
