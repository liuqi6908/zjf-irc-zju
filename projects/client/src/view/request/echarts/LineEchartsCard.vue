<script lang="ts" setup>
import Echarts from 'vue-echarts'
import { cloneDeep } from 'lodash-es'

import moment from 'moment'

interface Props {
  title: string
  data: [ { value: []; time: []; label: '' }]
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

  name = name.toString()

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

function fromatterLegend(color: string, data: []) {
  let colorrr = ''

  const cloneData = cloneDeep(data)

  const formatter = function (label: string) {
    const name = cloneData.find(i => i.name === label)?.label

    label = `${Number(label).toFixed(2)}${props.unit}`
    return `{fontStyle|${name}}{numStyle|${label}}`
  }

  data = data.map((item, index) => {
    if (index === 0)
      colorrr = '#025CB9'
    else
      colorrr = '#F99E34'

    return {
      name: item?.name,
      color,
      textStyle: {
        rich: {
          fontStyle: {
            color: '#292D36',
            fontSize: '16px',
            fontWeight: '600',
          },
          numStyle: {
            color: colorrr,
            fontSize: '28px',
            fontWeight: '600',
          },
        },
      },
    }
  },
  )
  // }

  return {
    data,
    formatter,
    icon: 'rect',
    itemWidth: 10,
    itemHeight: 10,
    left: '10%',
    itemStyle: {
      borderType: 'solid',
    },
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

      options.value.series = newData.map((item, index) => {
        const color = index === 0 ? 'rgba(2, 92, 185, 0.12)' : 'rgba(249, 158, 52, 0.12)'
        const newVal = item.value

        return fromatterSeries(newVal, color)
      })

      // const names = options.value.series.map((item) => {
      //   return { name: item.name }
      // })
      const names = options.value.series.map((item, index) => {
        return {
          label: newData[index].label,
          name: item.name,
        }
      })
      options.value.legend = fromatterLegend(options.value.color[0], names)
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
