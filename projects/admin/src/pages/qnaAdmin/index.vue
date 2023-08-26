<script setup lang="ts">
import Tabs from 'shared/component/base/tab/Tabs.vue'
import { cmsConfig } from 'shared/constants'
import { cloneDeep } from 'lodash-es'
import { Notify } from 'quasar'
import { getCms } from '~/api/cms/getCms'
import EditableGrid from '~/components/table/EditableGrid.vue'
import { upsertCms } from '~/api/cms/upsertCms'

const questionId = ref('question')
const currTabObj = ref()
const tab = ref('')
const tableLoading = ref()

const tabList = computed(() => cmsConfig.find(i => i.id === questionId.value)?.children)

/** 当前的组件所需要的props */
const rowsJson = computed(() => {
  const json = [] as any
  const cloneRow = cloneDeep(currTabObj.value.rows)
  if (cloneRow) {
    cloneRow.forEach((item, index) => {
      json.push({
        richText: item.richText,
        title: item.title,
      })
    })
  }

  return json
})

async function saveRows() {
  const res = await upsertCms(tab.value, currTabObj.value.rows)
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
  <div bg-grey-1>
    <Tabs v-model="tab" :tab-list="tabList" @update:curr-tab-obj="(val) => currTabObj = val">
      <EditableGrid v-model:rows="currTabObj.rows" :loading="tableLoading" :col-names="currTabObj.col" :component-name="currTabObj.label" @save="saveRows" />
      预览
      <div full p-10>
        <component :is="currTabObj.component" :list="rowsJson" />
      </div>
    </Tabs>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
