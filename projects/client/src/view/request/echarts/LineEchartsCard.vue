<script lang="ts" setup>
import Echarts from 'vue-echarts'
import * as echarts from 'echarts'
import { cloneDeep } from 'lodash-es'
import moment from 'moment'

interface Props {
  title: string
  data: { value: number[]; time: number[]; label: string }[]
  unit: string
  legend?: boolean
  symbol?: string
}

const props = defineProps<Props>()

const baseOption = {
  color: ['#025CB9', '#F99E34'],
  grid: {
    left: 1,
    right: 5,
    top: 50,
    bottom: 1,
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    axisLine: {
      lineStyle: {
        color: '#D4DDEA',
      },
    },
    axisLabel: {
      textStyle: {
        color: '#6E7686',
      },
    },
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      textStyle: {
        color: '#6E7686',
      },
    },
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
    symbol: props.symbol || 'emptyCircle',
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
        offset: 0,
        color: `${color}00`,
      },
      {
        offset: 1,
        color: `${color}28`,
      }]),
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
            fontSize: 16,
            fontWeight: 600,
          },
          num: {
            color: baseOption.color[index % baseOption.color.length],
            fontSize: 28,
            fontWeight: 600,
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
    itemWidth: 8,
    itemHeight: 8,
    itemGap: 20,
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
      xAxis.axisLabel.interval = interval - 1

      yAxis.axisLabel.formatter = `{value} ${props.unit}`
      if (!props.title.includes('网卡'))
        yAxis.splitNumber = 2
      else
        yAxis.splitNumber = 4

      series.push(...newVal.map((item, index) => formatterSeries(item.value, baseOption.color[index % 2])))

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
  <div bg-grey-1 p-6 flex="~ col">
    <header mb-2 text="grey-8 left" title-4>
      {{ title }}
    </header>
    <client-only>
      <Echarts
        class="chart"
        :option="options"
        :update-options="{ notMerge: false }"
        autofill flex-1 autoresize h-0
      />
    </client-only>
  </div>
</template>
