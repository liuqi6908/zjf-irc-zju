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

      percent.value = `${Number(data[0].value).toFixed(2)}%`
      options.value = {
        title: {
          text: props.title,
          left: -5,
          textStyle: {
            fontSize: 20,
            fontWeight: 600,
            color: 'black',
          },
        },
        color: data.map(item => item.color),
        series: [
          {
            type: 'pie',
            radius: ['49.14%', '75.6%'],
            center: ['48%', '57%'],
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
  <div p-6 border-1 border-grey-3 bg-grey-1>
    <div flex="~ row items-center">
      <client-only>
        <Echarts
          class="chart"
          :option="options"
          :update-options="{ notMerge: false }"
          autoresize h-57 w-50
        />
      </client-only>

      <div title-2 relative top-4>
        {{ percent }}
      </div>
    </div>
    <div flex="~ row justify-between" text="base grey-5" font-600>
      <span>已用：<span text-grey-8 v-text="finalVal?.newUsed" /></span>
      <span>总量：<span text-grey-8 v-text="finalVal?.newTotal" /></span>
    </div>
  </div>
</template>
