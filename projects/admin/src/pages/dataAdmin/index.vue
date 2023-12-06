<script setup lang="ts">
import Tabs from 'shared/component/base/tab/Tabs.vue'
import type { TabItem } from 'shared/component/base/tab/Tabs.vue'
import { QList, Notify } from 'quasar'
import DataAdmin from '~/view/dataAdmin/index.vue'

import { createDataRoot, updateDataRoot, deleteDataRoot } from '~/api/data'

const { rootList, getRootList, loading } = useDatabase()

const tab = ref('')
const tabList = computed<TabItem[]>(() => {
  return rootList.value?.map((item) => {
    return {
      ...item,
      label: item.nameZH
    }
  }) || []
})

const editRef = ref<typeof QList>()
const dialog = ref(false)
const editInfo = ref({
  /** 操作类型（0新增、1编辑） */
  type: 0,
  id: '',
  nameZH: '',
  nameEN: '',
  order: 0,
})

onBeforeMount(async () => {
  await getRootList()
  if (rootList.value?.length)
    tab.value = rootList.value[0].id
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
  const { id, label, nameEN = '', order = 0 } = val as TabItem
  editInfo.value = {
    type: 1,
    id,
    nameZH: label,
    nameEN,
    order,
  }
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
  editInfo.value = {
    type: 0,
    id: '',
    nameZH: '',
    nameEN: '',
    order: 0,
  }
}

/**
 * 新建/更新数据大类
 */
async function confirm() {
  let res
  const { type } = editInfo.value
  if (type)
    res = await updateDataRoot(editInfo.value)
  else
    res = await createDataRoot(editInfo.value)

  dialog.value = false
  if (res) {
    await getRootList()
    Notify.create({
      message: `${type ? '编辑' : '新增'}成功`,
      type: 'success'
    })
  }
}

/**
 * 删除数据大类
 */
async function deleteRoot() {
  const res = await deleteDataRoot(editInfo.value.id)
  if (res) {
    await getRootList()
    Notify.create({
      message: '删除成功',
      type: 'success',
    })
  }
}

/**
 * 禁用提交按钮
 */
const disable = computed(() => {
  const { id, nameZH, nameEN, order } = editInfo.value
  return !id || !nameZH || !nameEN || typeof order !== 'number'
})
</script>

<template>
  <div absolute full p-4 class="data-admin">
    <q-card full overflow-hidden>
      <Tabs
        v-model="tab"
        flex="~ col"
        showCaption
        :tab-list="tabList"
        @right-event="rightEvent"
      >
        <template #right>
          <q-btn flat text-primary-1 @click="openAddDialog()">
            <div i-material-symbols:add />
          </q-btn>
        </template>
        <DataAdmin :id="tab" />
      </Tabs>
    </q-card>

    <q-inner-loading
      :showing="loading"
      label="加载中..."
      color="primary"
      label-class="text-primary"
      z-99
    />

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
            v-model.number="editInfo.order"
            label="排序字段"
            filled
            type="number"
          />
        </q-card-section>
        <div text-right>
          <q-btn label="取消" color="primary" flat mr-2 @click="dialog = false" />
          <q-btn label="确认" color="primary" :disable="disable" @click="confirm" />
        </div>
      </q-card>
    </q-dialog>

    <!-- 右击菜单 -->
    <QList
      ref="editRef"
      style="display: none"
      bordered absolute top-12 bg-grey-1 z-100 shadow-lg
    >
      <q-item clickable>
        <q-item-section @click="dialog = true">
          编辑
        </q-item-section>
      </q-item>
      <q-item clickable>
        <q-item-section @click="deleteRoot">
          删除
        </q-item-section>
      </q-item>
    </QList>
  </div>
</template>

<style lang="scss" scoped>
.data-admin {
  :deep(.q-tab-panels) {
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
