<script lang="ts" setup>
import Echarts from 'vue-echarts'

import moment from 'moment'

interface Props {
  title: string
  data: [ { value: []; time: [] }]
  unit: string
  legend?: boolean
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
  let name = ''
  if (props.legend)
    name = data[data.length - 1]

  return {
    type: 'line',
    areaStyle: {
      color,
    },
    emphasis: {
      focus: 'series',
    },
    name,
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

      /** 坐标轴上显示4个x的刻度值 */
      const interval = Math.ceil(timeArr.length / 4)
      const xAxis = timeArr.map((item, index) => {
        if (index % interval === 0 || index === timeArr.length - 1)
          return `${item}`
        else
          return ''
      })

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
          axisLabel: {
            interval: interval - 1, // 控制标签的显示间隔
          },
        },
      ]
      options.value.legend = {
        formatter(name: number) {
          if (props.unit === '%')
            return `${Number(name).toFixed(2)}%`

          else return `${Number(name).toFixed(2)}kb`
        },
        icon: 'rect',
        itemWidth: 10,
        itemHeight: 10,
        left: '10%',
        itemStyle: {
          borderType: 'solid',
        },
        textStyle: {
          fontWeight: 'bold',
          fontSize: '28',
        },
      }
      options.value.series = newData.map((item, index) => {
        const color = index === 0 ? 'rgba(2, 92, 185, 0.12)' : 'rgba(249, 158, 52, 0.12)'
        const newVal = item.value

        return fromatterSeries(newVal, color)
      })
    }
  },
  { deep: true })
</script>

<template>
  <div bg-grey-1 p-6>
    <header flex="~ row" mb-4 text-grey-8 title-4>
      {{ title }}
    </header>
    <client-only>
      <Echarts
        class="chart"
        :option="options"
        autofill h-80 min-w-lg
      />
    </client-only>
  </div>
</template>

<style lang="">

</style>
