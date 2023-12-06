<script lang="ts" setup>
import { Notify } from 'quasar'
import type { QTableProps } from 'quasar'
import { uploadDataByRootId } from '~/api/data'
import type { Node } from '~/composables/database'

interface Props {
  id: string
}

const { id } = defineProps<Props>()
const { getDataByRootId, rootData } = useDatabase()

const file = ref<File>()

const columns: QTableProps['columns'] = reactive([
  { name: 'DATABASE', label: '库', field: 'DATABASE' },
  { name: 'DATABASE_ENG', label: '库（英文）', field: 'DATABASE_ENG' },
  { name: 'B_DATABASE', label: '子库', field: 'B_DATABASE' },
  { name: 'B_DATABASE_ENG', label: '子库（英文）', field: 'B_DATABASE_ENG' },
  { name: 'PART', label: '模块', field: 'PART' },
  { name: 'PART_ENG', label: '模块（英文）', field: 'PART_ENG' },
  { name: 'TABLE', label: '表', field: 'TABLE' },
  { name: 'TABLE_ENG', label: '表（英文）', field: 'TABLE_ENG' },
  { name: 'preview', label: '样例数据', field: 'preview' },
  { name: 'download', label: '下载数据', field: 'download' },
  { name: 'operation', label: '上传数据', field: 'operation' },
])
const rows = computed(() => {
  if (rootData.value && rootData.value.length)
    return flattenTree(rootData.value[0])
})

onMounted(() => {
  columns.forEach(item => item.align = 'center')
})

/**
 * 展开树数据
 * @param tree
 * @param parentNames
 * @param result
 */
function flattenTree(tree: Node, parentNames = ([] as any[]), result = ([] as any[])) {
  if (!tree.children)
    return

  for (const treeChildren of tree.children) {
    const { nameZH, nameEN, children } = treeChildren
    const currentNames = [...parentNames, { nameZH, nameEN }]

    if (children) {
      for (const child of children) {
        const { nameZH: bNameZH, nameEN: bNameEN, children: partChildren } = child

        if (partChildren) {
          for (const part of partChildren) {
            const { nameZH: partNameZH, nameEN: partNameEN, children: tableChildren } = part

            if (tableChildren) {
              for (const table of tableChildren) {
                const { nameZH: tableNameZH, nameEN: tableNameEN, preview, download } = table as Node

                result.push({
                  DATABASE: currentNames[0].nameZH,
                  DATABASE_ENG: currentNames[0].nameEN,
                  B_DATABASE: bNameZH,
                  B_DATABASE_ENG: bNameEN,
                  PART: partNameZH,
                  PART_ENG: partNameEN,
                  TABLE: tableNameZH,
                  TABLE_ENG: tableNameEN,
                  preview,
                  download
                })
              }
            }
          }
        }

        flattenTree(child, currentNames, result)
      }
    }
  }

  return result
}

/**
 * 更多操作类型
 * @param file
 * @param flag
 */
function operationType(file: File, flag: 0 | 1 | 2) {
  if (file) {
    if (flag === 0) {
      if (isFileType(file, 'csv')) {
        uploadIntermediateTable(file)
      }
      else {
        Notify.create({
          message: '只能上传 CSV 文件',
          type: 'danger',
        })
      }
    }
    else if (flag === 1) {}
    else if (flag === 2) {}
  }
}

/**
 * 上传中间表
 * @param file
 */
async function uploadIntermediateTable(file: File) {
  const fromData = new FormData()
  fromData.append('file', file)

  const res = await uploadDataByRootId(id, fromData)
  if (res) {
    Notify.create({
      message: '上传成功',
      type: 'success',
    })
    await getDataByRootId(id)
  }
}
</script>

<template>
  <div flex="~ col gap-4">
    <div flex="~ row items-center gap-6">
      <div text-xl font-600>
        上传中间表
      </div>
      <Upload
        :model-value="file"
        label="上传中间表"
        accept="text/csv,application/vnd.ms-excel"
        @update:model-value="val => operationType(val, 0)"
      />
      <Upload
        :model-value="file"
        label="上传样例数据"
        accept="text/csv,application/vnd.ms-excel"
        ml-auto color="green"
        multiple :max-files="100"
        @update:model-value="val => operationType(val, 1)"
      />
      <Upload
        :model-value="file"
        label="上传下载数据"
        accept="application/x-zip-compressed"
        multiple :max-files="100"
        @update:model-value="val => operationType(val, 2)"
      />
    </div>

    <q-table
      :rows-per-page-options="rowsPerPageOptions"
      :rows="rows"
      :columns="columns"
      flex-1 h="0!"
    >
      <template #body="props">
        <q-tr>
          <q-td v-for="col in columns" :key="col.name">
            <template v-if="['preview', 'download'].includes(col.name)">
              <div v-if="props.row[col.name]" i-mdi:check-bold m-auto text="lg alert-success" />
              <div v-else i-mdi:close-thick m-auto text="lg alert-error" />
            </template>
            <div v-else-if="col.name === 'operation'" flex="~ row gap-2">
              <Upload
                :model-value="file"
                accept="text/csv,application/vnd.ms-excel"
                label="样例" color="green" size="sm"
              />
              <Upload
                :model-value="file"
                accept="application/x-zip-compressed"
                label="下载" size="sm"
              />
            </div>
            <template v-else>
              {{ props.row[col.name] }}
            </template>
          </q-td>
        </q-tr>
      </template>
      <template #loading>
        <q-inner-loading showing color="primary" />
      </template>
    </q-table>
  </div>
</template>

<style lang="scss" scoped>
:deep(.q-table) {
  thead {
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 1;
  }
  thead, tbody {
    > tr {
      th:last-child, td:last-child {
        position: sticky;
        right: 0;
        background-color: white;
      }
    }
  }
}
</style>
