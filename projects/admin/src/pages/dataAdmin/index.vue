<script setup lang="ts">
import type { DataRoot, IDataDirectory } from 'zjf-types'
import { fileToFormData } from 'zjf-utils'

import Tabs from 'shared/component/base/tab/Tabs.vue'
import { Notify } from 'quasar'
import DataResource from '~/view/dataAdmin/DataResource.vue'

import { uploadDataByRootId } from '~/api/data/uploadDataByRootId'
import { uploadDataDescribe } from '~/api/file/dataDescribe'

import { useDataBase } from '~/composables/useDataBase'

// const tabList = ref<TabItem[]>([
//   {
//     id: DataRoot.PURCHASED,
//     label: dataRootDescriptions[DataRoot.PURCHASED],
//     isRequest: false,
//   },
//   {
//     id: DataRoot.SELF_BUILT,
//     label: dataRootDescriptions[DataRoot.SELF_BUILT],
//     isRequest: false,
//   },
//   {
//     id: DataRoot.PUBLIC,
//     label: dataRootDescriptions[DataRoot.PUBLIC],
//     isRequest: false,
//   },
//   {
//     id: DataRoot.PRE_PURCHASED,
//     label: dataRootDescriptions[DataRoot.PRE_PURCHASED],
//     isRequest: false,
//   },
// ])

const { getDataByRootId, geRootData, rootTabList } = useDataBase()

const tab = ref('')
const currentTabObj = ref()
const midTable = ref<File>()
const describe = ref()

async function uploadFile(tab: DataRoot, file: File) {
  const fromData = new FormData()
  fromData.append('file', file)

  const res = await uploadDataByRootId(tab, fromData)
  if (res) {
    Notify.create({
      message: '上传成功',
      type: 'success',
    })
  }
}

function findLevelObjects(tree: IDataDirectory[], targetLevel: number, currentLevel = 0): IDataDirectory[] {
  const levelObjects: IDataDirectory[] = []

  for (const node of tree) {
    if (currentLevel === targetLevel)
      levelObjects.push(node)

    if (node.children && node.children.length > 0) {
      const childLevelObjects = findLevelObjects(node.children, targetLevel, currentLevel + 1)
      levelObjects.push(...childLevelObjects)
    }
  }

  return levelObjects
}

const dataBase = computed(() => {
  if (currentTabObj.value.data && currentTabObj.value.data.length)
    return findLevelObjects(currentTabObj.value.data, 1)
})

onBeforeMount(() => {
  geRootData()

  if (rootTabList.length)
    tab.value = rootTabList[0].id
})

watch([tab, midTable], async ([newTab, newMid]) => {
  if (newMid)
    await uploadFile((newTab as DataRoot), newMid)
  const isRequest = currentTabObj.value.isRequest

  tab.value = newTab

  if (!newTab || isRequest)
    return

  const res = await getDataByRootId(newTab as DataRoot)
  if (res && currentTabObj.value) {
    currentTabObj.value.data = res
    currentTabObj.value.isRequest = true
  }
})

watch(describe, async (newDescribe) => {
  if (newDescribe && newDescribe.file) {
    const formData = fileToFormData(newDescribe.file)
    const filename = `${newDescribe.enName}.doc`
    const res = await uploadDataDescribe(tab.value, filename, formData)
    if (!res) {
      Notify.create({
        type: 'warning',
        message: '上传失败',
      })
    }
  }
})
</script>

<template>
  <Tabs v-model="tab" v-model:curr-tab-obj="currentTabObj" :tab-list="rootTabList">
    <!-- <TotalData v-if="tab === 'totalData'" /> -->
    <DataResource
      v-model:mid-table="midTable"
      v-model:describe="describe"
      :data-root-id="tab"
      :data-base="dataBase"
      :tree-data="currentTabObj"
    />
  </Tabs>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
