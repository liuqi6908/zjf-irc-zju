<script setup lang="ts">
import DesktopTable from '../../userCenter/myDesktop/DesktopTable.vue'
import LineEchartsCard from '../echarts/LineEchartsCard.vue'
import { getDesktopVmStatus } from '~/api/desktopVm/getDesktopVmStatus'
import { getDesktopVmDetail } from '~/api/desktopVm/getDesktopVmDetail'

interface Props {
  uuid: string
}
const props = defineProps<Props>()
const data = reactive({
  cpu: [{ value: [], time: [], label: '使用率' }],
  storage: [{ value: [], time: [], label: '负载率' }],
  disk: [{ value: [], time: [] }],
  network: [{ value: [], time: [], label: '上行' }, { value: [], time: [], label: '下行' }],
})

const watchData = [
  { name: 'watch', label: '监控数据' },
]
/** 定时器的引用 */
const pollingInterval = ref()

function startPolling() {
  pollingInterval.value = setInterval(() => {
    fetchDesktopVm()
  }, 10000)
}

function stopPolling() {
  clearInterval(pollingInterval.value)
  pollingInterval.value = null
}
function processData(dataArray, property: string) {
  if (dataArray && dataArray.length) {
    return dataArray.map((item) => {
      const { value, time } = item
      if (time)
        return property === 'value' ? value : time
      return ''
    })
  }
  return []
}
async function fetchDesktopVm() {
  const detail = await getDesktopVmDetail(props.uuid)
  if (!detail) {
    stopPolling()
    return false
  }

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

  if (detail.NetworkIn && detail.NetworkIn.length) {
    data.network[0].value = processData(detail.NetworkIn, 'value')
    data.network[0].time = processData(detail.NetworkIn, 'time')
  }
  if (detail.NetworkOut && detail.NetworkOut.length) {
    data.network[1].value = processData(detail.NetworkOut, 'value')
    data.network[1].time = processData(detail.NetworkOut, 'time')
  }
}
watch(() => props.uuid, async (desktopId) => {
  if (desktopId) {
    const detail = await fetchDesktopVm()
    if (!detail)
      return
    startPolling()
  }

  const res = await getDesktopVmStatus(desktopId)
  // console.log({ res })
}, { immediate: true })

onBeforeUnmount(() => {
  stopPolling()
})
</script>

<template>
  <DesktopTable :cols="watchData">
    <div flex="~ row justify-center" w-full>
      <LineEchartsCard :data="data.cpu" title="CPU" unit="%" legend />
    </div>

    <div flex="~ row justify-center" w-full>
      <LineEchartsCard :data="data.network" title="网卡读取速率" unit="kb" legend />
    </div>
  </DesktopTable>
</template>
