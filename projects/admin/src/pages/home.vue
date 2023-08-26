<script setup lang="ts">
import type { Carousel } from 'shared/component/cms/home/HomeCarousel.vue'
import { cmsConfig } from 'shared/constants'

import Tabs from 'shared/component/base/tab/Tabs.vue'

import { cloneDeep } from 'lodash-es'
import { Notify } from 'quasar'
import EditableGrid from '~/components/table/EditableGrid.vue'
import { getCms } from '~/api/cms/getCms'
import { upsertCms } from '~/api/cms/upsertCms'

const homeId = ref('home')
const currTabObj = ref()
const tab = ref('')
const tableLoading = ref()

const tabList = computed(() => cmsConfig.find(i => i.id === homeId.value)?.children)

/** 当前的组件所需要的props */
const rowsJson = computed(() => {
  const json = [] as any
  const cloneRow = cloneDeep(currTabObj.value.rows)
  if (cloneRow) {
    cloneRow.forEach((item, index) => {
      json.push({
        name: `silder${index}`,
        content: item.content,
        title: item.title,
        img: item.uploadImg,
        richText: item.richText,
      })
    })
  }

  return json
})

async function saveRows() {
  const res = await upsertCms<Carousel>(tab.value, currTabObj.value.rows)
  if (res) {
    Notify.create({
      type: 'success',
      message: '保存成功',
    })
  }
}

onMounted(async () => {
  if (tabList.value && tabList.value?.length)
    tab.value = tabList.value[0].id
})

watch(tab, async (newTab) => {
  tableLoading.value = true
  const res = await getCms(newTab)
  tableLoading.value = false
  if (res)
    currTabObj.value.rows = res.json
})
</script>

<template>
  <div bg-grey-1 p-xl>
    <Tabs v-model="tab" :tab-list="tabList" @update:curr-tab-obj="(val) => currTabObj = val">
      <EditableGrid v-model:rows="currTabObj.rows" :loading="tableLoading" :col-names="currTabObj.col" :component-name="currTabObj.label" @save="saveRows" />
      <component :is="currTabObj.component" :list="rowsJson" />
    </Tabs>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
