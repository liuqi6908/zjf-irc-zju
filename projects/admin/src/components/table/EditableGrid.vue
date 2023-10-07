<script setup lang="ts">
import '@wangeditor/editor/dist/css/style.css'

type ColNameType = typeof columnsConfig[number]['name']

interface Props {
  /** 需要编辑的项目 */
  colNames: Array<ColNameType>
  /** 当前组件的中文名称 */
  componentName: string
  rows: Array<any>
  loading?: boolean
}

const props = defineProps<Props>()
const emits = defineEmits(['update:rows', 'update:dialog', 'save'])

const RichEdit = defineAsyncComponent(() => import('./RichEdit.vue'))

const baseCol = ref<Array<any>>([])
const rowsRef = ref<Array<any>>([])

const columnsConfig = [
  { name: 'title', label: '标题', align: 'center', field: 'title' },
  { name: 'uploadImg', label: '上传图片', align: 'center', field: 'uploadImg' },
  { name: 'svg', label: '上传SVG', align: 'center', field: 'svg' },
  { name: 'richText', label: '富文本', align: 'left', field: 'richText' },
  { name: 'delete', label: '删除', align: 'center', field: 'delete' },
  { name: 'sort', label: '排序', align: 'center', field: 'sort' },
]

watch(
  () => props.rows,
  (newVal) => {
    if (newVal.length)
      rowsRef.value = newVal
  },
)

watch(
  () => props.colNames,
  (newVal) => {
    baseCol.value = []
    for (const col in newVal) {
      const obj = columnsConfig.find(v => v.name === newVal[col])
      if (obj)
        baseCol.value.push(obj)
    }
  },
  {
    immediate: true,
  },
)

/**
 * 添加一行数据
 */
function addRow() {
  const res: any = {}
  for (const key of props.colNames)
    res[key] = null
  rowsRef.value.push(res)
  emits('update:rows', rowsRef.value)
}

/**
 * 删除一行数据
 * @param target
 */
function deleteRow(target: string[]) {
  const index = props.rows.findIndex((row) => {
    for (const key in target) {
      if (target[key] !== row[key])
        return false
    }
    return true
  })

  if (index !== -1)
    rowsRef.value.splice(index, 1)
  emits('update:rows', rowsRef.value)
}

/**
 * 更新排序
 * @param index
 * @param sort
 */
function upSort(index: number, sort: 'up' | 'down') {
  try {
    if (sort === 'up') {
      const temp = rowsRef.value[index]
      rowsRef.value[index] = rowsRef.value[index - 1]
      rowsRef.value[index - 1] = temp
    }
    else {
      const temp = rowsRef.value[index]
      rowsRef.value[index] = rowsRef.value[index + 1]
      rowsRef.value[index + 1] = temp
    }
    emits('update:rows', rowsRef.value)
  }
  catch (e) {}
}
</script>

<template>
  <q-table
    :rows="rows"
    :columns="baseCol"
    row-key="title"
    :loading="loading"
    flat h-full bordered wrap-cells hide-bottom
  >
    <template #top-left>
      <q-btn v-if="colNames.includes('add')" color="primary" label="新增一行" @click="addRow">
        <q-icon name="fas fa-plus" size="14px" ml-2 />
      </q-btn>
    </template>
    <template #top-right>
      <q-btn color="primary" label="预览" mr-4 @click="$emit('update:dialog', true)" />
      <q-btn color="green" label="保存" @click="$emit('save')" />
    </template>
    <template #body="props">
      <q-tr :props="props">
        <q-td key="title" :props="props" min-w-50>
          <q-input v-model="props.row.title" />
        </q-td>

        <q-td key="uploadImg" :props="props" min-w-30>
          <UploadFile v-model:urlImg="props.row.uploadImg" />
        </q-td>

        <q-td key="svg" :props="props" min-w-30>
          <UploadFile v-model:urlImg="props.row.svg" svg />
        </q-td>

        <q-td key="richText" :props="props">
          <ClientOnly>
            <RichEdit v-model="props.row.richText" />
          </ClientOnly>
        </q-td>

        <q-td key="delete" :props="props">
          <q-btn flat px-2 @click="deleteRow(props.row)">
            <div i-mingcute:delete-2-line text-red />
          </q-btn>
        </q-td>

        <q-td key="sort" :props="props" whitespace-nowrap>
          <q-btn :disable="props.rowIndex === 0" flat px-2 @click="upSort(props.rowIndex, 'up')">
            <div i-mingcute:arrow-up-fill />
          </q-btn>
          <q-btn :disable="props.rowIndex === rows.length - 1" flat px-2 @click="upSort(props.rowIndex, 'down')">
            <div i-mingcute:arrow-down-fill />
          </q-btn>
        </q-td>
      </q-tr>
    </template>
    <template #loading>
      <q-inner-loading showing color="primary" />
    </template>
  </q-table>
</template>

<style lang="scss" scoped>
:deep(.q-table) {
  thead {
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 1;
    th {
      text-align: center;
    }
  }
}
</style>
