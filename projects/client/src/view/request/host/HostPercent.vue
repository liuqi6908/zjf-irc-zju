<script setup lang="ts">
import RoundEchartsCard from '../echarts/RoundEchartsCard.vue'
import { getDesktopHostCpu } from '~/api/desktopHost/getDesktopCpu'

interface Props {
  uuid: string
}
const props = defineProps<Props>()

const cpuList = reactive({
  cpu: {
    title: 'CPU分配情况',
    unit: undefined,
    color: '#025CB9',
    used: 0,
    total: 0,
  },
  storage: {
    title: '内存使用率',
    unit: 'GB',
    color: '#F99E34',
    used: 0,
    total: 0,
  },
  disk: {
    title: '存储使用率',
    unit: 'GB',
    color: '#8D5FF0',
    used: 0,
    total: 0,
  },
})

const { pause, resume } = useIntervalFn(() => fetchDEsktopCpu(), 30000)

async function fetchDEsktopCpu(uuid?: string) {
  try {
    const res = await getDesktopHostCpu(uuid || props.uuid)
    if (!res)
      throw new Error('Error')

    cpuList.cpu.used = Number(res.CPUUsedCount[0].value)
    cpuList.cpu.total = cpuList.cpu.used + Number(res.CPUAvailableCount[0].value)

    cpuList.storage.used = Number(res.memUsed[0].value)
    cpuList.storage.total = cpuList.storage.used + Number(res.memAvailable[0].value)

    cpuList.disk.used = Number(res.diskUsed[0].value)
    cpuList.disk.total = cpuList.storage.used + Number(res.diskTotal[0].value)
  }
  catch (_) {
    pause()
  }
}

watch(
  () => props.uuid,
  (newVal) => {
    if (newVal) {
      fetchDEsktopCpu(newVal)
      resume()
    }
    else {
      pause()
    }
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <div flex="~ row gap-10 wrap">
    <RoundEchartsCard
      v-for="(item, index) in cpuList"
      :key="index"
      class="col-grow"
      :title="item.title"
      :value="{
        used: item.used,
        total: item.total,
      }"
      :unit="item.unit"
      :color="item.color"
    />
  </div>
</template>
