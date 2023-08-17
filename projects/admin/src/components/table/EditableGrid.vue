<script setup lang="ts">
import UploadFile from './UploadFile.vue'

export type ColNameType = typeof columnsconfig[number]['name']

interface Props {
  /** 需要编辑的项目 */
  colNames: Array<ColNameType>
  /** 当前组件的中文名称 */
  componentName: string
  rows: Array<any>
}
const props = defineProps<Props>()
const emits = defineEmits(['update:rows', 'save'])

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
  { name: 'delete', label: '删除', align: 'left', field: 'delete' },
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
      flat bordered
      :rows="rows"
      :columns="baseCol"
      row-key="name"
      wrap-cells
    >
      <template #top>
        <q-btn color="primary" :label="`增加一个${componentName}项`" @click="addRow" />
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
          <q-td key="delete" :props="props">
            <q-btn flat @click="deleteRow(props.row)">
              <div i-mingcute:delete-2-line text-red />
            </q-btn>
          </q-td>
        </q-tr>
      </template>

      <template #bottom>
        <div w-full flex="~ row justify-end">
          <q-btn color="secondary" label="保存编辑内容" @click="$emit('save')" />
        </div>
      </template>
    </q-table>
  </div>
</template>
