<script setup lang="ts">
import '@wangeditor/editor/dist/css/style.css'

import { defineAsyncComponent } from 'vue'
import UploadFile from './UploadFile.vue'

const props = defineProps<Props>()

const emits = defineEmits(['update:rows', 'save'])

const RichEdit = defineAsyncComponent(() => import('./RichEdit.vue'))

export type ColNameType = typeof columnsconfig[number]['name']

interface Props {
  /** 需要编辑的项目 */
  colNames: Array<ColNameType>
  /** 当前组件的中文名称 */
  componentName: string
  rows: Array<any>
  loading?: false
}
const baseCol = ref([])
const rowsRef = ref([])

const columnsconfig = [
  {
    name: 'title',
    label: '输入标题',
    align: 'left',
    field: 'title',
  },
  { name: 'content', align: 'left', label: '编辑内容', field: 'content' },
  { name: 'uploadImg', label: '上传图片', align: 'left', field: 'uploadImg' },
  { name: 'svg', label: '上传svg', align: 'left', field: 'svg' },
  { name: 'delete', label: '删除', align: 'left', field: 'delete' },
  {
    name: 'sort',
    label: '排序',
    align: 'left',
    field: 'sort',
  },
  {
    name: 'richText',
    label: '富文本',
    align: 'left',
    field: 'richText',
  },
]

function addRow() {
  const res = {} as any
  for (const key of props.colNames)
    res[key] = null
  rowsRef.value.push(res)
  emits('update:rows', rowsRef.value)
}

function deleteRow(target: string[]) {
  const targetIndex = props.rows.findIndex((row) => {
    for (const key in target) {
      if (target[key] !== row[key])
        return false
    }
    return true
  })

  if (targetIndex !== -1)
    rowsRef.value.splice(targetIndex, 1)
  emits('update:rows', rowsRef.value)
}

function upSort(row: any, rowIndex: any) {
  // if (rowsRef.value)
  //   return
  if (rowIndex === 0 && rowsRef.value.length) {
    const temp = rowsRef.value[rowIndex]
    rowsRef.value[0] = rowsRef.value[1]
    rowsRef.value[1] = temp
  }
  else if (rowIndex > 0) {
    rowsRef.value.splice(rowIndex, 1)
    rowsRef.value.splice(rowIndex - 1, 0, row)
  }
  emits('update:rows', rowsRef.value)
}

watch(() => props.rows, () => {
  if (props.rows.length)
    rowsRef.value = props.rows
})

watch(() => props.colNames, () => {
  for (const col in props.colNames) {
    const obj = columnsconfig.find(i => i.name === props.colNames[col])
    if (!obj)
      return
    baseCol.value.push(obj)
  }
}, { immediate: true })
</script>

<template>
  <div>
    <q-table
      class="q-pa-md"
      :rows="rows"
      :columns="baseCol"
      row-key="name"
      flat bordered wrap-cells
      :loading="loading"
    >
      <template #top>
        <q-btn v-if="colNames.includes('add')" color="primary" :label="`增加一个${componentName}项`" @click="addRow" />
      </template>

      <template #body="props">
        <q-tr :props="props">
          <q-td key="title" :props="props">
            <q-input v-model="props.row.title" />
          </q-td>

          <q-td key="content" :props="props">
            <div max-w-40 break-words>
              {{ props.row.content }}
            </div>
            <q-popup-edit
              v-slot="scope"
              v-model="props.row.content"
              buttons
            >
              <q-input
                v-model="scope.value"
                type="textarea"
                autofocus
                counter
                @keyup.enter.stop
              />
            </q-popup-edit>
          </q-td>

          <q-td key="uploadImg" :props="props">
            <UploadFile v-model:urlImg="props.row.uploadImg" />
          </q-td>

          <q-td key="svg" :props="props">
            <UploadFile v-model:urlImg="props.row.svg" svg />
          </q-td>

          <q-td key="richText" :props="props">
            <ClientOnly>
              <RichEdit v-model="props.row.richText" />
            </ClientOnly>
          </q-td>

          <q-td key="delete" :props="props">
            <q-btn flat @click="deleteRow(props.row)">
              <div i-mingcute:delete-2-line text-red />
            </q-btn>
          </q-td>

          <q-td key="sort" :props="props">
            <q-btn flat round>
              <div :class="props.rowIndex ? ' i-mingcute:arrow-up-fill' : 'i-mingcute:arrow-down-fill'" @click="upSort(props.row, props.rowIndex)" />
            </q-btn>
          </q-td>
        </q-tr>
      </template>

      <template #bottom>
        <div w-full flex="~ row justify-end">
          <q-btn color="secondary" label="保存编辑内容" @click="$emit('save')" />
        </div>
      </template>

      <template #loading>
        <q-inner-loading showing color="primary" />
      </template>
    </q-table>
  </div>
</template>
