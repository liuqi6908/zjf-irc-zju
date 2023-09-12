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
  disk: {
    title: '磁盘',
    unit: '%',
    value: [
      { value: [], time: [], label: '占用率：' },
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
    let { CPU, Disk, NetworkIn, NetworkOut } = res
    const { cpu, network, disk } = data
    if (!CPU || !CPU.length)
      CPU = defaultData()
    cpu.value[0].value = CPU.map((item: any) => Number(item.value) * 100)
    cpu.value[0].time = CPU.map((item: any) => item.time)

    if (!Disk || !Disk.length)
      Disk = defaultData()
    disk.value[0].value = Disk.map((item: any) => Number(item.value) * 100)
    disk.value[0].time = Disk.map((item: any) => item.time)

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
  <div flex="~ col">
    <LineEchartsCard
      v-for="(item, index) in data"
      :key="index"
      :data="item.value"
      :title="item.title"
      :unit="item.unit"
      legend
    />
  </div>
</template>
