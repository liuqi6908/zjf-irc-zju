<script setup lang="ts">
import LineEchartsCard from '../echarts/LineEchartsCard.vue'
import { getDesktopVmDetail } from '~/api/desktopVm/getDesktopVmDetail'

interface Props {
  uuid: string
}
const props = defineProps<Props>()

const data = reactive({
  cpu: {
    title: 'CPU',
    unit: '%',
    value: [
      { value: [], time: [], label: '使用率：' },
    ],
  },
  network: {
    title: '网卡读取速率',
    unit: 'KB/s',
    value: [
      { value: [], time: [], label: '上行：' },
      { value: [], time: [], label: '下行：' },
    ],
  },
  storage: {
    title: '内存',
    unit: '%',
    value: [
      {
        time: [],
        value: [],
        label: '负载率：',
      },
    ],
  },
})

/** 定时器的引用 */
const { pause, resume } = useIntervalFn(() => fetchDesktopVm(), 30000, { immediate: false })

async function fetchDesktopVm() {
  try {
    const res = await getDesktopVmDetail(props.uuid)
    if (!res)
      return pause()
    let { CPU, memUsed, NetworkIn, NetworkOut } = res
    const { cpu, network, storage } = data
    if (!CPU || !CPU.length)
      CPU = defaultData()
    cpu.value[0].value = CPU.map((item: any) => Number(item.value) * 100)
    cpu.value[0].time = CPU.map((item: any) => item.time)

    if (!memUsed || !memUsed.length)
      memUsed = defaultData()
    storage.value[0].value = memUsed.map((item: any) => Number(item.value) * 100)
    storage.value[0].time = memUsed.map((item: any) => item.time)

    if (!NetworkIn || !NetworkIn.length)
      NetworkIn = defaultData()
    network.value[0].value = NetworkIn.map((item: any) => item.value)
    network.value[0].time = NetworkIn.map((item: any) => item.time)

    if (!NetworkOut || !NetworkOut.length)
      NetworkOut = defaultData()
    network.value[1].value = NetworkOut.map((item: any) => item.value)
    network.value[1].time = NetworkOut.map((item: any) => item.time)

    const max = Math.max(...network.value[0].value, ...network.value[1].value)
    if (max > 1024 * 1024 * 1024)
      network.unit = 'GB/s'
    else if (max > 1024 * 1024)
      network.unit = 'MB/s'
    else if (max > 1024)
      network.unit = 'KB/s'
    else
      network.unit = 'B/s'
  }
  catch (_) {
    pause()
  }
}

function defaultData() {
  return [{ value: 0, time: new Date().getTime() / 1000 }]
}

watch(() => props.uuid, async (desktopId) => {
  if (desktopId) {
    fetchDesktopVm()
    resume()
  }
}, { immediate: true })
</script>

<template>
  <div flex="~ col" gap-4>
    <LineEchartsCard
      v-for="(item, index) in data"
      :key="index"
      :data="item.value"
      :title="item.title"
      :unit="item.unit"
      symbol="none"
      legend class="p-4! pb-2!"
      :h="item.value.length > 1 ? 77 : 58.5"
    />
  </div>
</template>
