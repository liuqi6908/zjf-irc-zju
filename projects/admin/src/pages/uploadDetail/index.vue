<script setup lang="ts">
import { Notify } from 'quasar'
import { cmsConfig } from 'shared/constants'
import { getCms } from '~/api/cms/getCms'
import { upsertCms } from '~/api/cms/upsertCms'

const cmsId = ref('userUpdateDescribe')
const component = cmsConfig.find(i => i.id === 'user')?.children?.find((i: any) => i.id === cmsId.value).component

const cmsItem = reactive({
  component,
  json: '',
})

async function saveJson() {
  const res = await upsertCms(cmsId.value, [{ richText: cmsItem.json }])
  if (res) {
    Notify.create({
      message: '更新成功',
      type: 'success',
    })
  }
}

onMounted(async () => {
  const res = await getCms(cmsId.value)
  if (res && res.json)
    cmsItem.json = res.json[0].richText
})
</script>

<template>
  <div flex="~ col" bg-grey-1 p-10>
    <div flex="~ col">
      <RichEdit v-model="cmsItem.json" />

      <div flex="~ row justify-end">
        <q-btn label="保存编辑内容" color="teal" @click="saveJson" />
      </div>
    </div>

    <component :is="cmsItem.component" :list="[{ richText: cmsItem.json }]" />
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
