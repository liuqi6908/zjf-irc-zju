<script lang="ts" setup>
import { Notify } from 'quasar'
import type { QTableProps } from 'quasar'
import { uploadDataByRootId, uploadTableData } from '~/api/data'
import type { Node } from '~/composables/database'
import { UploadType } from 'zjf-types'

interface Props {
  id: string
}

const { id } = defineProps<Props>()
const { getDataByRootId, rootData, loading } = useDatabase()

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
 * 上传中间表
 * @param file
 */
async function uploadIntermediateTable(file: File) {
  try {
    if (!isFileType(file, 'csv')) {
      return Notify.create({
        message: '只能上传 CSV 文件',
        type: 'danger',
      })
    }

    loading.value = true
    const fromData = new FormData()
    fromData.append('file', file)

    const res = await uploadDataByRootId(id, fromData)
    if (res) {
      Notify.create({
        message: '上传成功',
        type: 'success',
      })
      setTimeout(() => {
        getDataByRootId(id)
      }, 500)
    }
    else {
      loading.value = false
    }
  }
  catch (_) {
    loading.value = false
  }
}

/**
 * 上传表格 预览/下载 数据文件
 */
async function uploadTableDataFile(type: UploadType, file: File, row?: any) {
  try {
    const fileType = type === UploadType.PREVIEW ? 'csv' : 'zip'
    if (!isFileType(file, fileType)) {
      return Notify.create({
        message: `只能上传 ${fileType.toLocaleUpperCase()} 文件`,
        type: 'danger',
      })
    }

    loading.value = true
    const { DATABASE_ENG, B_DATABASE_ENG, PART_ENG, TABLE_ENG } = row || {}

    await uploadTableData(type, id, file, TABLE_ENG)
    Notify.create({
      message: '上传成功',
      type: 'success',
    })
    if (rootData.value?.length && DATABASE_ENG && B_DATABASE_ENG && PART_ENG && TABLE_ENG) {
      const table = rootData.value[0].children?.find(v => v.nameEN === DATABASE_ENG)
        ?.children?.find(v => v.nameEN === B_DATABASE_ENG)
        ?.children?.find(v => v.nameEN === PART_ENG)
        ?.children?.find(v => v.nameEN === TABLE_ENG)
      if (table) {
        table[type] = true
      }
    }
  }
  catch (e: any) {
    const { message } = e.response?.data || {}
    if (message) {
      Notify.create({
        message,
        type: 'danger',
      })
    }
  }
  finally {
    loading.value = false
  }
}

/**
 * 批量上传表格 预览/下载 数据文件
 * @param type
 * @param files
 */
async function massUploadTableDataFile(type: UploadType, files: File[]) {
  if (!files.length)
    return

  const total = files.length
  let success = 0
  const error: Record<string, string> = {}

  const fileType = type === UploadType.PREVIEW ? 'csv' : 'zip'

  const notify = Notify.create({
    type: 'ongoing',
    message: `正在上传中，请耐心等待！进度：0 / ${total}`,
    position: 'top',
    color: 'warning',
    classes: `user-${id}`,
  })

  for (const file of files) {
    const { name } = file
    if (!isFileType(file, fileType)) {
      error[name] = '文件类型不允许'
      continue
    }
    try {
      await uploadTableData(type, id, file)
      success++
    }
    catch (e: any) {
      error[name] = e.response?.data?.message || '未知错误'
    }
    finally {
      notify({
        message: `正在上传中，请耐心等待！进度：${success + Object.keys(error).length} / ${total}`,
      })
    }
  }
  getDataByRootId(id)
  if (success !== total) {
    notify({
      type: success ? 'danger' : 'warn',
      message: `共 ${total} 条数据，${success ? '全部上传失败' : `已成功上传 ${success} 条`}`,
      caption: Object.keys(error).map(v => `${v}：${error[v]}`).join('<br/>'),
      multiLine: true,
      html: true,
      timeout: 0,
      actions: [
        { label: '确认', color: 'white', handler: () => {} },
      ],
      color: success ? 'negative' : 'warning',
    })
  }
  else {
    notify({
      type: 'success',
      message: `已成功上传 ${success} 条数据`,
      color: 'positive',
    })
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
        @update:model-value="val => uploadIntermediateTable(val)"
      />
      <Upload
        :model-value="file"
        label="上传样例数据"
        accept="text/csv,application/vnd.ms-excel"
        ml-auto color="green"
        multiple :max-files="100"
        @update:model-value="val => massUploadTableDataFile(UploadType.PREVIEW, val)"
      />
      <Upload
        :model-value="file"
        label="上传下载数据"
        accept="application/x-zip-compressed"
        multiple :max-files="100"
        @update:model-value="val => massUploadTableDataFile(UploadType.DOWNLOAD, val)"
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
                @update:model-value="val => uploadTableDataFile(UploadType.PREVIEW, val, props.row)"
              />
              <Upload
                :model-value="file"
                accept="application/x-zip-compressed"
                label="下载" size="sm"
                @update:model-value="val => uploadTableDataFile(UploadType.DOWNLOAD, val, props.row)"
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
