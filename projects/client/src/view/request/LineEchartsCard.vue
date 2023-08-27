<script lang="ts" setup>
import Echarts from 'vue-echarts'

interface Props {
  title: string

}
defineProps<Props>()

const option = {
  color: ['#025CB9', '#F99E34'],
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
  ],
  yAxis: [
    {
      type: 'value',
    },
  ],
  series: [
    {
      type: 'line',
      areaStyle: {
        color: 'rgba(2, 92, 185, 0.12)',
      },
      emphasis: {
        focus: 'series',
      },
      data: [120, 132, 101, 134, 90, 230, 210],
    },
    {
      type: 'line',
      areaStyle: {
        color: 'rgba(249, 158, 52, 0.12)',
      },
      emphasis: {
        focus: 'series',
      },
      data: [220, 182, 191, 234, 290, 330, 310],
    },
  ],
}
</script>

<template>
  <div bg-grey-1 p-6>
    <header flex="~ row" text-grey-8 title-4>
      {{ title }}
    </header>
    <Echarts
      class="chart"
      :option="option"
      autoresize autofill h-60
    />
  </div>
</template>

<style lang="">

</style>
