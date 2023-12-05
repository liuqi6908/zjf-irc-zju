<script setup lang="ts">
import type { IDataDirectory } from 'zjf-types'
import { fileToFormData } from 'zjf-utils'
import Tabs from 'shared/component/base/tab/Tabs.vue'
import { Notify, QList } from 'quasar'
import DataResource from '~/view/dataAdmin/DataResource.vue'

import { uploadDataByRootId } from '~/api/data/uploadDataByRootId'
import { uploadDataDescribe } from '~/api/file/dataDescribe'
import { putRootData } from '~/api/data/putRootData'
import { deleteRootData } from '~/api/data/delecteRootData'
import { updateRootData } from '~/api/data/updateRootData'

const { getDataByRootId, geRootData, rootTabList, loading } = useDataBase()

const tab = ref('')
const currentTabObj = ref()

const editRef = ref<typeof QList>()
const dialog = ref(false)
const editInfo = reactive({
  /** 操作类型（0新增、1编辑） */
  type: 0,
  id: '',
  nameEN: '',
  nameZH: '',
  order: undefined,
})

const midTable = ref<File>()
const describe = ref()

onBeforeMount(async () => {
  await geRootData()
  if (rootTabList.value.length)
    tab.value = rootTabList.value[0].id
})

onMounted(() => {
  document.addEventListener('click', () => {
    if (editRef.value)
      editRef.value.$el.style.display = 'none'
  })
})

/**
 * 右击菜单
 * @param params
 */
function rightEvent(params: any) {
  const { val, event } = params
  editInfo.type = 1
  editInfo.id = val.id
  editInfo.nameZH = val.label
  editInfo.nameEN = val.nameEN
  editInfo.order = val.order ?? 0
  const el = editRef.value?.$el
  if (el) {
    el.style.left = `${event.clientX - 250}px`
    el.style.display = el.style.display === 'none' ? 'block' : 'none'
  }
}

/**
 * 打开新增对话框
 */
function openAddDialog() {
  dialog.value = true
  editInfo.type = 0
  editInfo.id = ''
  editInfo.nameZH = ''
  editInfo.nameEN = ''
  editInfo.order = undefined
}

/**
 * 新建/更新数据大类
 */
async function confirmEditInfo() {
  let res
  const body = {
    nameZH: editInfo.nameZH,
    nameEN: editInfo.nameEN,
    order: Number(editInfo.order) ?? 0,
  }
  if (editInfo.type)
    res = await updateRootData(editInfo.id, body)
  else
    res = await putRootData({ ...body, id: editInfo.id })
  dialog.value = false

  if (res) {
    await geRootData()
    Notify.create({
      message: `${editInfo.type ? '编辑' : '新增'}成功`,
      type: 'success',
    })
  }
}

/**
 * 删除数据大类
 */
async function deleteDataBase() {
  const res = await deleteRootData(editInfo.id)
  if (res) {
    Notify.create({
      message: '删除成功',
      type: 'success',
    })
    await geRootData()
  }
}

/**
 * 获取指定分类的数据
 * @param id
 */
async function getRootDataById(id: string) {
  const res = await getDataByRootId(id)
  if (res && currentTabObj.value)
    currentTabObj.value.data = res
}

/**
 * 上传中间表
 * @param id
 * @param file
 */
async function uploadFile(id: string, file: File) {
  const fromData = new FormData()
  fromData.append('file', file)

  const res = await uploadDataByRootId(id, fromData)
  if (res) {
    Notify.create({
      message: '上传成功',
      type: 'success',
    })
    await getRootDataById(id)
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

watch(
  tab,
  async (newVal) => {
    if (newVal)
      getRootDataById(newVal)
  },
)

watch(
  midTable,
  async (newVal) => {
    if (newVal)
      await uploadFile(tab.value, newVal)
  },
)

watch(
  describe,
  async (newVal) => {
    if (newVal && newVal.file) {
      const formData = fileToFormData(newVal.file)
      const filename = `${newVal.enName}.docx`
      const res = await uploadDataDescribe(tab.value, filename, formData)
      if (res) {
        Notify.create({
          type: 'success',
          message: '上传成功',
        })
      }
    }
  },
)

const disable = computed(() => !editInfo.id || !editInfo.nameZH || !editInfo.nameEN)
</script>

<template>
  <div absolute full p-4 class="data-admin">
    <q-card full overflow-hidden>
      <Tabs
        v-model="tab"
        v-model:curr-tab-obj="currentTabObj"
        flex="~ col"
        showcaption items-center
        :tab-list="rootTabList"
        @update:right-event="rightEvent"
      >
        <template #right>
          <q-btn flat text-primary-1 @click="openAddDialog()">
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
    </q-card>

    <!-- 编辑/新增 数据大类 -->
    <q-dialog v-model="dialog">
      <q-card min-w-100 p-5>
        <div title-4 v-text="editInfo.type ? '编辑' : '新增'" />
        <q-card-section>
          <q-input
            v-model="editInfo.id"
            label="资源ID"
            filled
            lazy-rules
            :readonly="!!editInfo.type"
            :rules="[val => val && val.length > 0 || '请输入资源ID']"
          >
            <template v-slot:append>
              <div cursor-pointer ml-1 text-lg i-mdi:information-variant>
                <q-tooltip
                  anchor="center right" self="center left"
                  :offset="[15, 0]" py-3 px-4
                  bg-grey-1 shadow-lg text="base grey-8"
                >
                  <div>创建数据资源后，ID不可变</div>
                  <div>样例数据路径：zjf-data/preview/{{ editInfo.id }}</div>
                  <div>下载数据路径：zjf-data/download/{{ editInfo.id }}</div>
                </q-tooltip>
              </div>
            </template>
          </q-input>
          <q-input
            v-model="editInfo.nameZH"
            label="中文名"
            filled
            lazy-rules
            :rules="[val => val && val.length > 0 || '请输入中文名']"
          />
          <q-input
            v-model="editInfo.nameEN"
            label="英文名"
            filled
            lazy-rules
            :rules="[val => val && val.length > 0 || '请输入英文名']"
          />
          <q-input
            v-model="editInfo.order"
            label="排序字段"
            filled
            type="number"
          />
        </q-card-section>
        <div text-right>
          <q-btn label="取消" color="primary" flat mr-2 @click="dialog = false" />
          <q-btn label="确认" color="primary" :disable="disable" @click="confirmEditInfo" />
        </div>
      </q-card>
    </q-dialog>

    <!-- 右击菜单 -->
    <QList ref="editRef" style="display: none" bordered absolute top-12 bg-grey-1 z-100 shadow-lg>
      <q-item clickable>
        <q-item-section @click="dialog = true">
          编辑
        </q-item-section>
      </q-item>
      <q-item clickable>
        <q-item-section @click="deleteDataBase()">
          删除
        </q-item-section>
      </q-item>
    </QList>
  </div>
</template>

<style lang="scss" scoped>
.data-admin {
  :deep(.q-tab-panels) {
    width: 100%;
    flex: 1;
    .q-tab-panel > div {
      height: 100%;
    }
  }
}
</style>

<route lang="yaml">
meta:
  layout: home
</route>
