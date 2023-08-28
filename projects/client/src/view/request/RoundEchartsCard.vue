<script lang="ts" setup>
import { computed } from 'vue'
import Echarts from 'vue-echarts'

interface Props {
  title: string
  color: string
  value: number
}

const props = defineProps<Props>()

const data = computed(() => {
  const val2 = Number.parseFloat((1.0 - props.value).toFixed(10))
  return [
    { value: props.value, color: props.color },
    { value: val2, color: '#025CB91F' },
  ]
})

// [
//   { value: 0.2, color: '#025CB9' },
//   { value: 0.8, color: '#025CB91F' },
// ]

const option = {
  title: { text: props.title },
  color: data.value.map(item => item.color),
  series: [
    {
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      labelLine: {
        show: false,
      },
      data: data.value,
    //   data: [
    //     { value: 0.2, name: '', color: '#025CB9' },
    //     { value: 0.8, name: '', color: '#025CB91F' },
    //   ],
    },
  ],
}
</script>

<template>
  <div bg-grey-1 p-6>
    <div flex="~ row items-center">
      <Echarts
        class="chart"
        :option="option"
        autoresize h-60 w-50
      />
      <div mx-5 text-grey-8 title-2>
        {{ `${(props.value * 100).toFixed(2)}%` }}
      </div>
    </div>
    <div flex="~ row justify-between">
      <span>已用：</span>
      <span>总量：</span>
    </div>
  </div>
</template>
