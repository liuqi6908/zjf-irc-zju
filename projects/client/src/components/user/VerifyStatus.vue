<script lang="ts" setup>
import { VerificationStatus } from 'zjf-types'

interface Props {
  status: VerificationStatus | 'none'
}
const props = defineProps<Props>()

const currentStyle = computed(() => {
  const noneColor = '#F44336'
  const bgNone = 'rgba(244, 67, 54, 0.08);'

  const doneColor = '#22B07D'
  const bgDone = 'rgba(34, 176, 125, 0.08)'

  const pendingColor = '#FFBA2F'
  const bgPending = 'rgba(255, 186, 47, 0.08)'
  if (props.status === 'none')
    return { border: `1px solid ${noneColor}`, color: noneColor, backgroundColor: bgNone }
  else if (props.status === VerificationStatus.APPROVED)
    return { border: `1px solid ${doneColor}`, color: doneColor, backgroundColor: bgDone }
  else if (props.status === VerificationStatus.PENDING)
    return { border: `1px solid ${pendingColor}`, color: pendingColor, backgroundColor: bgPending }
})

const textClass = computed(() => {
  if (props.status === VerificationStatus.APPROVED)
    return { text: '已认证', icon: 'ep:success-filled' }
  else if (props.status === 'none')
    return { text: '未认证', icon: 'material-symbols:error' }
  else if (props.status === VerificationStatus.PENDING)
    return { text: '审核中', icon: 'material-symbols:alarm-rounded' }
})
</script>

<template>
  <div :style="currentStyle" h-10 max-w-40 flex="~ col justify-center">
    认证状态: <div :class="`i-${textClass?.icon}`" /> {{ textClass?.text }}
  </div>
</template>

<style lang="">

</style>
