<script setup lang="ts">
import DesktopTable from '../../userCenter/myDesktop/DesktopTable.vue'
import LineEchartsCard from '../echarts/LineEchartsCard.vue'
import { getDesktopVmDetail } from '~/api/desktopVm/getDesktopVmDetail'

interface Props {
  uuid: string
}
const props = defineProps<Props>()
const data = reactive({
  cpu: [{ value: [], time: [] }],
  storage: [{ value: [], time: [] }],
  disk: [{ value: [], time: [] }],
  network: [{ value: [], time: [] }],
})

const watchData = [
  { name: 'watch', label: '监控数据' },
]
watch(() => props.uuid, async (desktopId) => {
  const detail = await getDesktopVmDetail(desktopId)
  if (detail.CPU && detail.CPU.length) {
    data.cpu[0].value = detail.CPU.map((item: any) => {
      const { value } = item
      return Number(value) * 100
    })
    data.cpu[0].time = detail.CPU.map((item: any) => {
      const { time } = item
      return time
    })
  }
}, { immediate: true })
</script>

<template>
  <DesktopTable :cols="watchData">
    <div flex="~ col" class="col-grow">
      <LineEchartsCard :data="data.cpu" title="CPU" unit="%" />
      <LineEchartsCard :data="data.cpu" title="CPU" unit="%" />
    </div>
  </DesktopTable>
</template>
