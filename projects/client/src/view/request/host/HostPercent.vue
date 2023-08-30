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

})

watch(() => props.uuid, async (val) => {
  if (val) {
    const res = await getDesktopHostCpu(val)
    cpuList.cpu.used = Number(res.CPUUsedCount[0].value)
    cpuList.cpu.total = cpuList.cpu.used + Number(res.CPUAvailableCount[0].value)

    cpuList.storage.used = Number(res.memUsed[0].value)
    cpuList.storage.total = cpuList.storage.used + Number(res.memAvailable[0].value)
  }
}, { immediate: true })
</script>

<template>
  <div flex="~ row gap-10">
    <RoundEchartsCard class="col-grow" title="cpu占比" :value="cpuList.cpu" color="#025CB9" />
    <RoundEchartsCard unit="GB" class="col-grow" title="内存已分配率" :value="cpuList.storage" color="#F99E34" />
    <!-- <RoundEchartsCard class="col-grow" title="内存已分配率" :value="storagePercent" color="#F99E34" /> -->
  </div>
</template>

<style lang="">

</style>
