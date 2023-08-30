<script lang="ts" setup>
import Echarts, { UPDATE_OPTIONS_KEY } from 'vue-echarts'

import moment from 'moment'
import { selectEquallyDistributedElements } from './selectEquallyEl'

interface Props {
  title: string
  data: [ { value: string[]; time: string[] }]
  unit: string

}
const props = defineProps<Props>()

const options = shallowRef()

function timestampToTime(timestamp: number) {
  const time = moment.unix(timestamp).format('HH:mm')
  return time
}

function fromatterSeries(data: [], color: string) {
  if (props.unit === 'kb') {
    data = data.map(item =>
      Number(item) / 1024,
    )
  }

  return {
    type: 'line',
    areaStyle: {
      color,
    },
    emphasis: {
      focus: 'series',
    },
    data,
  }
}

const baseOption = {
  color: ['#025CB9', '#F99E34'],
  legend: {
    top: '5%',
    left: 'center',
  },
  yAxis: [
    {
      type: 'value',
      splitLine: {
        lineStyle: {
          color: '#D4DDEA',
          type: 'dashed',
        },
      },
    },
  ],
  series: [],
  grid: {
    left: '10%',
    right: '3%',
  },
}

watch(() => props.data,
  (newData) => {
    options.value = { ...baseOption }
    if (newData) {
      const timestampArr = newData[0].time
      const timeArr = timestampArr.map(item => timestampToTime(item))
      const xAxis = selectEquallyDistributedElements(timeArr)
      options.value.yAxis[0].axisLabel = {
        formatter: `{value} ${props.unit}`,
      }
      options.value.xAxis = [
        {
          type: 'category',
          boundaryGap: false,
          data: xAxis,
          axisLine: {
            lineStyle: {
              color: '#6E7686',
            },
          },
        },
      ]
      options.value.series = newData.map((item, index) => {
        const color = index === 0 ? 'rgba(2, 92, 185, 0.12)' : 'rgba(249, 158, 52, 0.12)'
        const newVal = selectEquallyDistributedElements(item.value)

        return fromatterSeries(newVal, color)
      })
    }
  },
  { deep: true })

provide(UPDATE_OPTIONS_KEY, options)
</script>

<template>
  <div w-full bg-grey-1 p-6>
    <header flex="~ row" text-grey-8 title-4>
      {{ title }}
    </header>
    <Echarts
      class="chart"
      :option="options"

      autofill h-80
    />
  </div>
</template>

<style lang="">

</style>
