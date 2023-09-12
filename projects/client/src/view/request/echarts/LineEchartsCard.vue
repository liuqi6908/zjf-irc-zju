<script lang="ts" setup>
import Echarts from 'vue-echarts'
import { cloneDeep } from 'lodash-es'
import moment from 'moment'

interface Props {
  title: string
  data: { value: number[]; time: number[]; label: string }[]
  unit: string
  legend?: boolean
}

const props = defineProps<Props>()

const baseOption = {
  color: ['#025CB9', '#F99E34'],
  grid: {
    left: 1,
    right: 5,
    bottom: 10,
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    axisLine: {
      lineStyle: {
        color: '#6E7686',
      },
    },
  },
  yAxis: {
    type: 'value',
    splitLine: {
      lineStyle: {
        color: '#D4DDEA',
        type: 'dashed',
      },
    },
  },
  series: [],
}
const options = ref()

/**
 * 时间戳转时间
 * @param timestamp
 */
function timestampToTime(timestamp: number) {
  return moment.unix(timestamp).format('HH:mm')
}

/**
 * 格式化series
 * @param data
 * @param color
 */
function formatterSeries(data: number[], color: string) {
  const index = ['kb', 'mb', 'gb'].findIndex(v => props.unit.toLowerCase().includes(v))

  if (index >= 0) {
    data = data.map(item =>
      Number(item) / 1024 ** (index + 1),
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
    name: props.legend ? data[data.length - 1]?.toString() : '',
    data,
  }
}

function formatterLegend(data: any[]) {
  const cloneData = cloneDeep(data)
  const formatter = function (label: string) {
    const name = cloneData.find(i => i.name === label)?.label
    label = `${Number(label).toFixed(2)}${props.unit}`
    return `{text|${name}}{num|${label}}`
  }

  data = data.map((item, index) => {
    return {
      name: item?.name,
      textStyle: {
        height: 24,
        rich: {
          a: {
            verticalAlign: 'middle',
          },
          text: {
            color: '#292D36',
            fontSize: '16px',
            fontWeight: '600',
          },
          num: {
            color: baseOption.color[index % baseOption.color.length],
            fontSize: '28px',
            fontWeight: '600',
          },
        },
      },
    }
  },
  )

  return {
    data,
    formatter,
    icon: 'rect',
    itemWidth: 10,
    itemHeight: 10,
    left: 0,
  }
}

watch(
  () => props.data,
  (newVal) => {
    options.value = cloneDeep(baseOption)
    if (newVal) {
      const { xAxis, yAxis, series } = options.value

      const timeArr = newVal[0].time.map(item => timestampToTime(item))
      /** 坐标轴上显示4个x的刻度值 */
      const interval = Math.ceil(timeArr.length / 4)
      xAxis.data = timeArr.map((item, index) => {
        if (index % interval === 0 || index === timeArr.length - 1)
          return `${item}`
        else
          return ''
      })
      // 控制标签的显示间隔
      xAxis.axisLabel = {
        interval: interval - 1,
      }

      yAxis.axisLabel = { formatter: `{value} ${props.unit}` }

      series.push(...newVal.map((item, index) => {
        const color = index === 0 ? 'rgba(2, 92, 185, 0.12)' : 'rgba(249, 158, 52, 0.12)'
        const newVal = item.value
        return formatterSeries(newVal, color)
      }))

      const names = series.map((item: any, index: number) => {
        return {
          label: newVal[index].label,
          name: item.name,
        }
      })
      options.value.legend = formatterLegend(names)
    }
  },
  {
    deep: true,
  },
)
</script>

<template>
  <div bg-grey-1 p-6>
    <header mb-4 text="grey-8 left" title-4>
      {{ title }}
    </header>
    <client-only>
      <Echarts
        class="chart"
        :option="options"
        :update-options="{ notMerge: false }"
        autofill h-80 autoresize
      />
    </client-only>
  </div>
</template>
