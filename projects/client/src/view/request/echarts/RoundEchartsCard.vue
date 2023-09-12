<script lang="ts" setup>
import Echarts from 'vue-echarts'
import { formatFileSize } from 'zjf-utils'

interface Props {
  title: string
  color: string
  unit?: string
  value: {
    total: number
    used: number
  }
}

const props = defineProps<Props>()
const options = shallowRef()
const percent = ref('')

const finalVal = computed(() => {
  const { total, used } = props.value

  let newUsed = ''
  let newTotal = ''

  if (props.unit === 'GB') {
    newUsed = formatFileSize(used)
    newTotal = formatFileSize(total)
  }
  else {
    newUsed = used.toString()
    newTotal = total.toString()
  }

  return {
    newTotal, newUsed,
  }
})

function computedItem() {
  const { total, used } = props.value

  const val1 = (used / total) * 100
  const val2 = 100 - val1
  return [
    { value: val1, color: props.color },
    { value: val2, color: '#025CB91F' },
  ]
}

watch(() => props.value,
  (newVal) => {
    if (newVal) {
      const data = computedItem()

      percent.value = `${Number(data[0].value / 100).toFixed(2)}%`
      options.value = {
        title: { text: props.title },
        color: data.map(item => item.color),
        series: [
          {
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            labelLine: {
              show: false,
            },
            data,
          },
        ],
      }
    }
  }, { deep: true },
)
</script>

<template>
  <div border-1 border-grey-2 bg-grey-1 p-6>
    <div flex="~ row items-center">
      <client-only>
        <Echarts
          class="chart"
          :option="options"
          :update-options="{ notMerge: false }"
          autoresize h-60 w-40
        />
      </client-only>

      <div mx-5 text-grey-8 title-3>
        {{ percent }}
      </div>
    </div>
    <div flex="~ row justify-between">
      <span>已用：{{ finalVal?.newUsed }} </span>
      <span>总量：{{ finalVal?.newTotal }}</span>
    </div>
  </div>
</template>
