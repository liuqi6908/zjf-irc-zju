<script setup lang="ts">
import LineEchartsCard from '../echarts/LineEchartsCard.vue'
import { getDesktopTimeHostCpu } from '~/api/desktopHost/getDesktopTimeCpu'

interface Props {
  uuid: string
}
const props = defineProps<Props>()

const data = reactive({
  cpu: [{
    time: [],
    value: [],
  }],
  storage: [{
    time: [],
    value: [],
  }],
  oi: [{
    time: [],
    value: [],
  },
  {
    time: [],
    value: [],
  }],

})

/** 定时器的引用 */
const pollingInterval = ref()

function processData(dataArray: Array<any>, property: string) {
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

async function pollApi() {
  const res = await getDesktopTimeHostCpu(props.uuid)

  if (!res) {
    stopPolling()
    return
  }

  if (res.CPUUtilization) {
    data.cpu[0].value = processData(res.CPUUtilization, 'value')
    data.cpu[0].time = processData(res.CPUUtilization, 'time')
  }
  if (res.memUsed && res.memUsed.length) {
    data.storage[0].value = processData(res.memUsed, 'value')
    data.storage[0].time = processData(res.memUsed, 'time')
  }

  if (res.diskWrite && res.diskWrite.length && res.diskRead && res.diskRead.length) {
    data.oi[0].value = processData(res.diskWrite, 'value')
    data.oi[0].time = processData(res.diskWrite, 'time')

    data.oi[1].value = processData(res.diskRead, 'value')
    data.oi[1].time = processData(res.diskRead, 'time')
  }
}

function startPolling() {
  pollingInterval.value = setInterval(() => {
    pollApi()
  }, 10000)
}

function stopPolling() {
  clearInterval(pollingInterval.value)
  pollingInterval.value = null
}

watch(() => props.uuid, (newUuid) => {
  if (newUuid)
    startPolling()
}, { immediate: true })

onBeforeUnmount(() => {
  stopPolling()
})
</script>

<template>
  <div mb-20 mt-10 max-w-6xl w-full>
    <LineEchartsCard :data="data.cpu" title="总物理机CPU使用率" unit="%" />
    <LineEchartsCard :data="data.storage" title="总物理机CPU使用率" unit="%" />
    <LineEchartsCard :data="data.oi" title="总物理机磁盘IO" unit="kb" />
  </div>
</template>

<style lang="scss" scoped>

</style>
