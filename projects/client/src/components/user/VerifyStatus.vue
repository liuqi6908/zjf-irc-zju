<script lang="ts" setup>
import { VerificationStatus } from 'zjf-types'

interface Props {
  status?: VerificationStatus
}
const props = defineProps<Props>()

const currentStyle = computed(() => {
  const noneColor = '#F44336'
  const bgNone = 'rgba(244, 67, 54, 0.08)'

  const doneColor = '#22B07D'
  const bgDone = 'rgba(34, 176, 125, 0.08)'

  const pendingColor = '#FFBA2F'
  const bgPending = 'rgba(255, 186, 47, 0.08)'

  const cancelColor = '#025CB9'
  const bgCancel = 'rgba(2, 92, 185, 0.12)'

  if (props.status === VerificationStatus.APPROVED)
    return { border: `1px solid ${doneColor}`, color: doneColor, backgroundColor: bgDone }
  else if (props.status === VerificationStatus.PENDING)
    return { border: `1px solid ${pendingColor}`, color: pendingColor, backgroundColor: bgPending }
  else if (props.status === VerificationStatus.CANCELLED)
    return { border: `1px solid ${cancelColor}`, color: cancelColor, backgroundColor: bgCancel }
  else if (props.status === VerificationStatus.REJECTED)
    return { border: `1px solid ${noneColor}`, color: noneColor, backgroundColor: bgNone }
  else
    return { border: `1px solid ${noneColor}`, color: noneColor, backgroundColor: bgNone }
})

const textClass = computed(() => {
  if (props.status === VerificationStatus.APPROVED)
    return { text: '已认证', icon: '<div i-ep:success-filled/>' }
  else if (props.status === VerificationStatus.PENDING)
    return { text: '审核中', icon: '<div i-material-symbols:alarm-rounded />' }
  else if (props.status === VerificationStatus.CANCELLED)
    return { text: '已取消', icon: '<div i-mdi:close-circle />' }
  else if (props.status === VerificationStatus.REJECTED)
    return { text: '已驳回', icon: '<div i-mdi:close-circle />' }
  else
    return { text: '未认证', icon: '<div i-material-symbols:error/>' }
})
</script>

<template>
  <div :style="currentStyle" flex="~ row nowrap" text="base nowrap" font-600 items-center h-12 px6 py2.5>
    <span text-grey-8>认证状态: </span>
    <div flex-center text-lg ml4 mr1 v-html="textClass?.icon" />
    <span text-grey-8>{{ textClass?.text }}</span>
  </div>
</template>
