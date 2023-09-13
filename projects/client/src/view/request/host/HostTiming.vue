<script setup lang="ts">
import LineEchartsCard from '../echarts/LineEchartsCard.vue'
import { getDesktopTimeHostCpu } from '~/api/desktopHost/getDesktopTimeCpu'

interface Props {
  uuid: string
}
const props = defineProps<Props>()

const data = reactive({
  cpu: {
    title: 'CPU',
    unit: '%',
    value: [
      {
        time: [],
        value: [],
        label: '使用率：',
      },
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
  oi: {
    title: '磁盘',
    unit: 'KB/s',
    value: [
      {
        time: [],
        value: [],
        label: '读取：',
      },
      {
        time: [],
        value: [],
        label: '写入：',
      },
    ],
  },
})

const { pause, resume } = useIntervalFn(() => pollApi(), 30000)

/**
 * 调用接口
 * @param uuid
 */
async function pollApi(uuid?: string) {
  try {
    const res = await getDesktopTimeHostCpu(uuid || props.uuid)
    if (!res)
      throw new Error('Error')

    const { CPUUtilization, memUsed, diskWrite, diskRead } = res
    const { cpu, storage, oi } = data
    if (CPUUtilization && CPUUtilization.length) {
      cpu.value[0].value = processData(CPUUtilization, 'value')
      cpu.value[0].time = processData(CPUUtilization, 'time')
    }
    if (memUsed && memUsed.length) {
      storage.value[0].value = processData(memUsed, 'value')
      storage.value[0].time = processData(memUsed, 'time')
    }
    if (diskWrite && diskWrite.length) {
      oi.value[0].value = processData(diskWrite, 'value')
      oi.value[0].time = processData(diskWrite, 'time')
    }
    if (diskRead && diskRead.length) {
      oi.value[1].value = processData(diskRead, 'value')
      oi.value[1].time = processData(diskRead, 'time')
    }
    const max = Math.max(...oi.value[0].value, ...oi.value[1].value)
    if (max > 1024 * 1024 * 1024)
      oi.unit = 'GB/s'
    else if (max > 1024 * 1024)
      oi.unit = 'MB/s'
    else if (max > 1024)
      oi.unit = 'KB/s'
    else
      oi.unit = 'B/s'
  }
  catch (_) {
    pause()
  }
}

/**
 * 处理数据
 * @param dataArray
 * @param property
 */
function processData(dataArray: any, property: string) {
  if (dataArray && dataArray.length) {
    return dataArray.map((item: any) => {
      const { value, time } = item
      if (time)
        return property === 'value' ? value : time
      return ''
    })
  }
  return []
}

watch(
  () => props.uuid,
  (newVal) => {
    if (newVal) {
      pollApi(newVal)
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
  <div mt-10 w-full mb-20 max-w-6xl>
    <LineEchartsCard
      v-for="(item, index) in data"
      :key="index"
      :data="item.value"
      symbol="none"
      legend h-65
      :title="item.title"
      :unit="item.unit"
    />
  </div>
</template>

<style lang="scss" scoped>

</style>
