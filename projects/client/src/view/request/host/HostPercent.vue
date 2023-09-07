<script setup lang="ts">
import RoundEchartsCard from '../echarts/RoundEchartsCard.vue'
import { getDesktopHostCpu } from '~/api/desktopHost/getDesktopCpu'

interface Props {
  uuid: string
}
const props = defineProps<Props>()

const cpuList = reactive({
  cpu: {
    used: 0,
    total: 0,
  },
  storage: {
    used: 0,
    total: 0,
  },
  disk: {
    used: 0,
    total: 0,
  },
})
/** 定时器的引用 */
let pollingInterval: any = 0

async function fetchDEsktopCpu(uuid?: string) {
  const res = await getDesktopHostCpu(uuid || props.uuid)

  if (!res) {
    stopPolling()
    return 'stop'
  }

  cpuList.cpu.used = Number(res.CPUUsedCount[0].value)
  cpuList.cpu.total = cpuList.cpu.used + Number(res.CPUAvailableCount[0].value)

  cpuList.storage.used = Number(res.memUsed[0].value)
  cpuList.storage.total = cpuList.storage.used + Number(res.memAvailable[0].value)

  cpuList.disk.used = Number(res.diskUsed[0].value)
  cpuList.disk.total = cpuList.storage.used + Number(res.diskTotal[0].value)
}

function startPolling() {
  pollingInterval = setInterval(() => {
    fetchDEsktopCpu()
  }, 10000)
}
function stopPolling() {
  clearInterval(pollingInterval)
  pollingInterval = null
}

onBeforeUnmount(() => {
  stopPolling()
})

watch(() => props.uuid, async (val) => {
  if (val) {
    const res = await fetchDEsktopCpu(val)
    if (res === 'stop')
      return
    startPolling()
  }
}, { immediate: true })
</script>

<template>
  <div flex="~ row gap-10 wrap">
    <RoundEchartsCard class="col-grow" title="CPU分配情况" :value="cpuList.cpu" color="#025CB9" />
    <RoundEchartsCard unit="GB" class="col-grow" title="内存使用率" :value="cpuList.storage" color="#F99E34" />
    <RoundEchartsCard unit="GB" class="col-grow" title="存储使用率" :value="cpuList.disk" color="#8D5FF0" />
  </div>
</template>

<style lang="">

</style>
