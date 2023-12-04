<script setup lang="ts">
import { useQuasar } from 'quasar';
import type { IConfigDto, IUpsertConfigBodyDto } from 'zjf-types'
import { formatFileSize, fileSizeUnits } from 'zjf-utils'
import { getConfig, upsertConfig } from '~/api/config'
import { EXPORT_DFT_SM_DAILY_LIMIT, EXPORT_DFT_SM_SIZE_LIMIT, EXPORT_DFT_LG_SIZE_LIMIT } from 'zjf-types'

interface Props {
  title?: string
}

type Config = {
  [key in keyof IConfigDto]: {
    label: string
    value: number
    unit?: string
  }
}

withDefaults(defineProps<Props>(), {
  title: '文件外发',
})

const $q = useQuasar()

const config = reactive<Config>({
  sizeLimitSm: {
    label: '小文件尺寸限制',
    value: EXPORT_DFT_SM_SIZE_LIMIT,
    unit: fileSizeUnits[0]
  },
  sizeLimitLg:  {
    label: '大文件尺寸限制',
    value: EXPORT_DFT_LG_SIZE_LIMIT,
    unit: fileSizeUnits[0]
  },
  dailyLimit:  {
    label: '小文件每日外发限制',
    value: EXPORT_DFT_SM_DAILY_LIMIT
  },
})
const loading = ref(false)

onMounted(reset)

const disabled = computed(() => {
  for (const key of Object.keys(config) as Array<keyof IConfigDto>) {
    if (
      typeof config[key].value !== 'number' ||
      !(config[key].value > 0) ||
      config[key].unit && !fileSizeUnits.includes(config[key].unit!)
    )
      return true
  }
  return false
})

/**
 * 重置配置
 */
async function reset() {
  loading.value = true

  try {
    const { export: data = {
      sizeLimitSm: EXPORT_DFT_SM_SIZE_LIMIT,
      sizeLimitLg: EXPORT_DFT_LG_SIZE_LIMIT,
      dailyLimit: EXPORT_DFT_SM_DAILY_LIMIT
    } } = await getConfig('file') || {}
    if (data) {
      for (const key of Object.keys(data) as Array<keyof IConfigDto>) {
        if (config[key].unit) {
          const size = formatFileSize(data[key]).split(' ')
          config[key].value = Number(size[0])
          config[key].unit = size[1]
        }
        else {
          config[key].value = data[key]
        }
      }
    }
  }
  catch(_) {}
  finally {
    loading.value = false
  }
}

/**
 * 提交配置
 */
async function submit() {
  loading.value = true

  try {
    const k = 1024
    const { sizeLimitSm, sizeLimitLg, dailyLimit } = config
    const body: IUpsertConfigBodyDto = {
      version: 'file',
      sizeLimitSm: sizeLimitSm.value * Math.pow(k, fileSizeUnits.indexOf(sizeLimitSm.unit!)),
      sizeLimitLg: sizeLimitLg.value * Math.pow(k, fileSizeUnits.indexOf(sizeLimitLg.unit!)),
      dailyLimit: dailyLimit.value,
    }
    await upsertConfig(body)
    $q.notify({
      type: 'success',
      message: '配置成功',
    })
  }
  catch (_) {}
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div text-left flex="~ col">
    <q-inner-loading
      :showing="loading"
      label="加载中..."
      color="primary"
      label-class="text-primary"
      z-99
    />

    <div p="y3 x4" text-5 v-text="title" />
    <div flex="~ 1 col gap-4" p-4>
      <div
        v-for="(item, index) in config"
        :key="index"
        flex="~ row gap-8"
      >
        <div flex="~ col gap-2">
          <div v-text="item.label" />
          <q-input
            v-model.number="item.value"
            type="number"
            filled dense
          />
        </div>
        <div v-if="item.unit" flex="~ col gap-2">
          <div v-text="'单位'" />
          <q-select
            v-model="item.unit"
            :options="fileSizeUnits"
            filled dense w-10
          />
        </div>
      </div>
    </div>
    <div flex="~ row justify-end gap-6" p-4>
      <q-btn
        color="primary"
        w-28 h-10 outline rounded-2 text-base
        label="重 置"
        @click="reset"
      />
      <q-btn
        color="primary"
        rounded-2 w-28 h-10 text-base
        label="确 认"
        :disable="disabled"
        @click="submit"
      />
    </div>
  </div>
</template>
