<script setup lang="ts">
import type { TabItem } from 'shared/component/base/tab/Tabs.vue'
import type { IDataDirectory } from 'zjf-types'
import { DataRoot, dataRootDescriptions } from 'zjf-types'
import { fileToFormData } from 'zjf-utils'

import Tabs from 'shared/component/base/tab/Tabs.vue'
import { Notify } from 'quasar'
import DataResource from '~/view/dataAdmin/DataResource.vue'
import TotalData from '~/view/dataAdmin/TotalData.vue'

import { getDataByRootId } from '~/api/data/getDataByRootId'
import { uploadDataByRootId } from '~/api/data/uploadDataByRootId'
import { uploadDataDescribe } from '~/api/file/dataDescribe'

const tabList = ref<TabItem[]>([
  {
    id: 'totalData',
    label: '数据资源总体介绍',
    isRequest: false,
  },
  {
    id: DataRoot.PURCHASED,
    label: dataRootDescriptions[DataRoot.PURCHASED],
    isRequest: false,
  },
  {
    id: DataRoot.SELF_BUILT,
    label: dataRootDescriptions[DataRoot.SELF_BUILT],
    isRequest: false,
  },
  {
    id: DataRoot.PUBLIC,
    label: dataRootDescriptions[DataRoot.PUBLIC],
    isRequest: false,
  },
  {
    id: DataRoot.PRE_PURCHASED,
    label: dataRootDescriptions[DataRoot.PRE_PURCHASED],
    isRequest: false,
  },
])
const tab = ref(tabList.value[0].id)
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

watch([tab, midTable], async ([newTab, newMid]) => {
  const isRequest = tabList.value.find(i => i.id === newTab)?.isRequest
  if (newMid)
    await uploadFile((newTab as DataRoot), newMid)

  if (newTab === 'totalData' || isRequest)
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
    const res = await uploadDataDescribe(newDescribe.id, filename, formData)
    if (!res) {
      Notify.create({
        type: 'warn',
        message: '上传失败，请重新上传',
      })
    }
  }
})
</script>

<template>
  <Tabs v-model="tab" v-model:curr-tab-obj="currentTabObj" :tab-list="tabList">
    <TotalData v-if="tab === 'totalData'" />
    <DataResource
      v-else
      v-model:mid-table="midTable"
      v-model:describe="describe"
      :data-root-id="tab"
      :data-base="dataBase"
    />
  </Tabs>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
