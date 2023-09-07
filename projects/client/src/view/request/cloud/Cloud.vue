<script setup lang="ts">
import LineEchartsCard from '../echarts/LineEchartsCard.vue'
import { getDesktopVmDetail } from '~/api/desktopVm/getDesktopVmDetail'

interface Props {
  uuid: string
}
const props = defineProps<Props>()

const data = reactive({
  cpu: [
    { value: [], time: [], label: '使用率：' },
  ],
  network: [
    { value: [], time: [], label: '上行：' },
    { value: [], time: [], label: '下行：' },
  ],
  disk: [
    { value: [], time: [], label: '占用率：' },
  ],
})

/** 定时器的引用 */
const { pause, resume } = useIntervalFn(() => fetchDesktopVm(), 10000, { immediate: false })

async function fetchDesktopVm() {
  try {
    const res = await getDesktopVmDetail(props.uuid)
    if (!res)
      return pause()
    let { CPU, Disk, NetworkIn, NetworkOut } = res
    if (!CPU || !CPU.length)
      CPU = defaultData()
    data.cpu[0].value = CPU.map((item: any) => Number(item.value) * 100)
    data.cpu[0].time = CPU.map((item: any) => item.time)

    if (!Disk || !Disk.length)
      Disk = defaultData()
    data.disk[0].value = Disk.map((item: any) => Number(item.value) * 100)
    data.disk[0].time = Disk.map((item: any) => item.time)

    if (!NetworkIn || !NetworkIn.length)
      NetworkIn = defaultData()
    data.network[0].value = NetworkIn.map((item: any) => item.value)
    data.network[0].time = NetworkIn.map((item: any) => item.time)

    if (!NetworkOut || !NetworkOut.length)
      NetworkOut = defaultData()
    data.network[1].value = NetworkOut.map((item: any) => item.value)
    data.network[1].time = NetworkOut.map((item: any) => item.time)
  }
  catch (_) {
    pause()
  }
}

function defaultData() {
  return [{ value: 0, time: new Date().getTime() }]
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
    <LineEchartsCard :data="data.cpu" title="CPU" unit="%" legend />
    <LineEchartsCard :data="data.network" title="网卡读取速率" unit="KB/S" legend />
    <LineEchartsCard :data="data.disk" title="磁盘" unit="%" legend />
  </div>
</template>
