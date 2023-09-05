<script setup lang="ts">
import type { DataRoot, IDataDirectory } from 'zjf-types'
import { fileToFormData } from 'zjf-utils'

import Tabs from 'shared/component/base/tab/Tabs.vue'
import { Notify } from 'quasar'
import DataResource from '~/view/dataAdmin/DataResource.vue'

import { uploadDataByRootId } from '~/api/data/uploadDataByRootId'
import { uploadDataDescribe } from '~/api/file/dataDescribe'
import { putRootData } from '~/api/data/putRootData'

import { useDataBase } from '~/composables/useDataBase'
import { deleteRootData } from '~/api/data/delecteRootData'
import { updateRootData } from '~/api/data/updateRootData'

const { getDataByRootId, geRootData, rootTabList, loading } = useDataBase()

const tab = ref('')
const currentTabObj = ref()
const EditRef = ref()
const midTable = ref<File>()
const describe = ref()
const item = ref(false)
const editDialog = ref(false)
const editStatus = ref<'add' | 'update'>()
const editInfo = reactive({
  id: '',
  nameEN: '',
  nameZH: '',
})

async function uploadFile(tab: string, file: File) {
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

async function confirmEditInfo() {
  if (!editInfo.nameEN || !editInfo.nameZH)
    return

  if (editStatus.value === 'add') {
    const res = await putRootData(editInfo.nameZH, editInfo.nameEN)
    if (!res)
      return

    await geRootData()
    Notify.create({
      message: '添加成功',
      type: 'success',
    })
  }
  else if (editStatus.value === 'update') {
    const res = await updateRootData(editInfo.id, editInfo.nameZH)
    await geRootData()
    if (res) {
      Notify.create({
        message: '修改成功',
        type: 'success',
      })
    }
  }
  editInfo.id = ''
  editInfo.nameEN = ''
  editInfo.nameZH = ''
  editDialog.value = false
}

// async function editDataBase() {
//   editDialog.value = true
//   editStatus.value = 'update'
//   editInfo.id = id
// }
async function deleteDataBase() {
  const res = await deleteRootData(editInfo.id)
  if (res) {
    Notify.create({
      message: '删除成功',
      type: 'success',
    })
    await geRootData()
  }
  else {
    Notify.create({
      message: '删除失败',
      type: 'error',
    })
  }
}

function rightEvent({ val, event }) {
  item.value = true
  editInfo.id = val.id
  editStatus.value = 'update'
  EditRef.value.$el.style.left = `${event.clientX - 250}px`
  EditRef.value.$el.style.display = EditRef.value.$el.style.display === 'none' ? 'block' : 'none'
}

async function getRootDataById(tab: string) {
  const res = await getDataByRootId(tab)
  if (res && currentTabObj.value)
    currentTabObj.value.data = res
}

const dataBase = computed(() => {
  if (currentTabObj.value.data && currentTabObj.value.data.length)
    return findLevelObjects(currentTabObj.value.data, 1)
})

onBeforeMount(() => {
  geRootData().finally(() => {
    if (rootTabList)
      tab.value = rootTabList.value[0].id
  })
})

watch(tab, async (newTab) => {
  tab.value = newTab

  if (!newTab)
    return
  getRootDataById(newTab)
})

watch(midTable, async (newMid) => {
  if (newMid) {
    await uploadFile((tab.value as DataRoot), newMid)
    await getRootDataById(tab.value as DataRoot)
  }
})

watch(describe, async (newDescribe) => {
  if (newDescribe && newDescribe.file) {
    const formData = fileToFormData(newDescribe.file)
    const filename = `${newDescribe.enName}.docx`
    const res = await uploadDataDescribe(tab.value, filename, formData)
    if (!res) {
      Notify.create({
        type: 'warning',
        message: '上传失败',
      })
    }
  }
})
onMounted(() => {
  document.addEventListener('click', (event) => {
    if (!EditRef.value)
      return
    const element = EditRef.value.$el

    if (!element.contains(event.target))
      element.style.display = 'none'
  })
})
</script>

<template>
  <div flex="~ row" bg-grey-1>
    <!-- <div flex="~ col" class="col-4" m-10>
      <q-btn label="增加一个自定义数据库" flat color="primary-1" />
      <div flex="~ col">
        <q-chip
          v-for="(data, index) in rootTabList" :key="index"
          removable
          clickable
          color="primary-1"
          text-color="white"
          @click="editDataBase(data.id)"
          @remove="deleteDataBase(data.id)"
        >
          {{ data.label }}
        </q-chip>
      </div>
    </div> -->

    <q-dialog v-model="editDialog">
      <q-card min-w-100 p-5>
        <q-card-section>
          <q-input v-if="editStatus === 'add'" v-model="editInfo.nameEN" label="请输入英文字段" />
          <q-input v-model="editInfo.nameZH" label="请输入中文字段" />
        </q-card-section>

        <div mt-10 w-full flex="~ row gap-10 justify-end">
          <q-btn label="确认" color="primary-1" @click="confirmEditInfo" />
          <q-btn label="取消" color="red" @click="editDialog = false" />
        </div>
      </q-card>
    </q-dialog>

    <Tabs
      v-model="tab"
      v-model:curr-tab-obj="currentTabObj"
      class="col-grow"
      showcaption items-start
      :tab-list="rootTabList"
      @update:rightEvent="rightEvent"
    >
      <template #right>
        <q-btn flat text-primary-1 @click=" editDialog = true, editStatus = 'add'">
          <div i-material-symbols:add />
        </q-btn>
      </template>
      <DataResource
        v-model:mid-table="midTable"
        v-model:describe="describe"
        :loading="loading"
        :data-root-id="tab"
        :data-base="dataBase"
        :tree-data="currentTabObj"
      />
    </Tabs>

    <q-list ref="EditRef" style="display: none;" bordered absolute top-12 bg-grey-1>
      <q-item clickable>
        <q-item-section @click="editDialog = true">
          编辑当前数据库的中文名称
        </q-item-section>
      </q-item>
      <q-item clickable>
        <q-item-section @click="deleteDataBase()">
          删除当前数据库
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
