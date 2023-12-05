<script lang="ts" setup>
import { Notify } from 'quasar'
import type { QTableProps } from 'quasar'
import type { IDataDirectory } from 'zjf-types'
import { getDataDescribe } from '~/api/file/dataDescribe'
import { updateReference } from '~/api/file/updateReference'

interface Reference { id: string; text: string }
interface Describe { id: string; enName: string; file: any }

interface Props {
  midTable: File | undefined
  dataRootId: string
  describe?: Describe
  treeData?: { data: IDataDirectory[] }
  dataBase?: IDataDirectory[]
  loading?: boolean
}

const props = defineProps<Props>()
const emits = defineEmits(['update:midTable', 'update:describe', 'update:reference'])

const midTable = ref<File>()
const refDialog = ref(false)
const reference = reactive<Reference>({ id: '', text: '' })
const uploadTab = ref('uploadMid')
const fileOssList = ref<string[]>([])

const tableCol: QTableProps['columns'] = reactive([
  {
    name: 'DATABASE',
    label: '库',
    field: 'DATABASE',
  },
  {
    name: 'DATABASE_ENG',
    label: '库（英文）',
    field: 'DATABASE_ENG',
  },
  {
    name: 'B_DATABASE',
    label: '子库',
    field: 'B_DATABASE',
  },
  {
    name: 'B_DATABASE_ENG',
    label: '子库（英文）',
    field: 'B_DATABASE_ENG',
  },
  {
    name: 'PART',
    label: '模块',
    field: 'PART',
  },
  {
    name: 'PART_ENG',
    label: '模块（英文）',
    field: 'PART_ENG',
  },
  {
    name: 'TABLE',
    label: '表',
    field: 'TABLE',
  },
  {
    name: 'TABLE_ENG',
    label: '表（英文）',
    field: 'TABLE_ENG',
  },
])

onMounted(() => {
  tableCol.forEach(item => item.align = 'center')
})

function emitDescribe(val: any, enName: string, id = '') {
  const desc = {} as Describe

  desc.file = val
  desc.id = id
  desc.enName = enName

  fetchFileIsExist(enName)
  emits('update:describe', desc)
}

function editReference(id: string) {
  const { dataRootId, treeData } = props
  refDialog.value = true
  reference.text = treeData?.data.find(v => v.id === dataRootId)?.children?.find(v => v.id === id)?.reference || ''
  reference.id = id
}

async function confirmRef() {
  refDialog.value = !refDialog.value
  const { id, text } = reference
  const res = await updateReference(id, text)
  if (res) {
    Notify.create({
      message: '上传成功',
      type: 'success',
    })
    const { dataRootId, treeData } = props
    const obj = treeData?.data.find(v => v.id === dataRootId)?.children?.find(v => v.id === id)
    if (obj)
      obj.reference = text
  }
}

function downLoadDescribe(enName: string): string {
  const filename = `${enName}.docx`
  const res = getDataDescribe(props.dataRootId, filename)
  return res
}

function fetchFileIsExist(entName: string) {
  const res = getDataDescribe(props.dataRootId, `${entName}.docx`)
  const xhr = new XMLHttpRequest()

  xhr.open('GET', res, true)

  xhr.onload = function () {
    if (xhr.status === 200)
      fileOssList.value.push(entName)
  }
  xhr.send()
}

function flattenTree(tree: IDataDirectory, parentNames = ([] as any[]), result = ([] as any[])) {
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
                const { nameZH: tableNameZH, nameEN: tableNameEN } = table

                result.push({
                  DATABASE: currentNames[0].nameZH,
                  DATABASE_ENG: currentNames[0].nameEN,
                  B_DATABASE: bNameZH,
                  B_DATABASE_ENG: bNameEN,
                  PART: partNameZH,
                  PART_ENG: partNameEN,
                  TABLE: tableNameZH,
                  TABLE_ENG: tableNameEN,
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

const tableData = computed(() => {
  if (!props.treeData?.data || !props.treeData.data.length)
    return []

  return flattenTree(props.treeData.data[0])
})

const empty = computed(() => !props.dataBase?.length)

watch(
  uploadTab,
  (currTab) => {
    if (currTab === 'uploadDataIntroduce') {
      props.dataBase?.forEach((item: any) => {
        fetchFileIsExist(item.nameEN)
      })
    }
  },
  {
    immediate: true
  }
)
</script>

<template>
  <div full flex="~ row gap-7" p-4>
    <div>
      <q-tabs
        v-model="uploadTab"
        vertical
        class="text-teal"
      >
        <q-tab name="uploadMid" label="上传中间表" />
        <q-tab name="uploadDataIntroduce" label="上传数据库介绍" />
        <q-tab name="uploadReference" label="上传引用规范" />
      </q-tabs>
    </div>

    <q-tab-panels v-model="uploadTab" vertical animated class="col-grow" flex-1 w-0>
      <q-tab-panel name="uploadMid" p-0 flex="~ col gap-4">
        <header flex="~ row items-center gap-10">
          <div title-4>
            上传中间表
          </div>
          <Upload
            :model-value="midTable"
            w-30
            label="上传中间表"
            @update:model-value="val => $emit('update:midTable', val)"
          />
        </header>

        <q-table
          :rows-per-page-options="rowsPerPageOptions"
          :rows="tableData"
          :columns="tableCol"
          :loading="loading"
          flex-1 h="0!"
        >
          <template #body="props">
            <q-tr>
              <q-td v-for="col in tableCol" :key="col.name">
                {{ props.row[col.name] }}
              </q-td>
            </q-tr>
          </template>
          <template #loading>
            <q-inner-loading showing color="primary" />
          </template>
        </q-table>
      </q-tab-panel>

      <q-tab-panel name="uploadDataIntroduce" p-0 text-left>
        <div min-h-2xl>
          <header title-4>
            数据库介绍
          </header>

          <div v-if="empty" text-alert-error mt-4>
            编辑数据库介绍前请先上传中间表
          </div>

          <template v-else>
            <div
              v-for="data in dataBase"
              :key="data.id"
              my-4 text="base grey-8"
              flex="~ row items-center justify-between"
            >
              <div v-text="data.nameZH" />
              <div flex="~ row justify-between gap-5 items-center">
                <span font-600>文件名:</span>
                <span>{{ fileOssList.includes(data.nameEN) ? `${data.nameEN}.docx` : '暂未上传文件' }}</span>
                <Upload
                  label="上传数据库介绍"
                  accept=".docx"
                  w-34
                  :model-value="describe?.file[`${data.id}`]"
                  @update:model-value="val => emitDescribe(val, data.nameEN, data.rootId)"
                />
                <q-btn
                  color="teal"
                  label="下载数据库介绍"
                  :href="downLoadDescribe(data.nameEN)"
                />
              </div>
            </div>
          </template>
        </div>
      </q-tab-panel>

      <q-tab-panel name="uploadReference" p-0 text-left>
        <div min-h-2xl>
          <header title-4>
            引用规范
          </header>

          <div v-if="empty" text-alert-error mt-4>
            编辑引用规范前请先上传中间表
          </div>

          <template v-else>
            <div
              v-for="data in dataBase"
              :key="data.id"
              flex="~ row items-center justify-between"
              my-4 text="base grey-8"
            >
              <div v-text="data.nameZH" />
              <q-btn color="primary" label="编辑引用规范" @click="editReference(data.id)" />
            </div>
          </template>
        </div>
      </q-tab-panel>
    </q-tab-panels>

    <q-dialog v-model="refDialog">
      <q-card min-w-3xl>
        <q-card-section>
          <q-input
            v-model="reference.text"
            filled
            type="textarea"
          />
        </q-card-section>

        <q-card-actions align="right" class="bg-grey-1 text-teal">
          <q-btn flat label="确认" @click="confirmRef" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<style lang="scss" scoped>
.q-tab {
  :deep(.q-tab__indicator) {
    width: 4px !important;
    height: auto !important;
  }
}
:deep(.q-table__container) {
  .q-table__top {
    padding: 0 !important;
  }
  thead {
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 1;
  }
}
</style>
