<script lang="ts" setup>
import { cloneDeep } from 'lodash-es'
import { Notify } from 'quasar'
import type { DataRoot, IDataDirectory } from 'zjf-types'
import { getDataDescribe } from '~/api/file/dataDescribe'
import { updateReference } from '~/api/file/updateReference'

interface Reference { id: string; text: string }
interface Describe { id: string; enName: string; file: any }

interface Props {
  midTable: File | undefined
  dataRootId: DataRoot
  describe?: Describe
  treeData?: { data: IDataDirectory[] }
  dataBase?: IDataDirectory[]
}
const props = defineProps<Props>()
const emits = defineEmits(['update:midTable', 'update:describe', 'update:reference'])

const midTable = ref<File>()
const refDialog = ref(false)
const reference = reactive<Reference>({ id: '', text: '' })
const rowData = ref([])

const mideTableCol = [
  {
    name: 'DATABASE',
    label: '库',
    field: 'DATABASE',
  },
  {
    name: 'DATABASE_ENG',
    label: '库-en',
    field: 'DATABASE_ENG',
  },
  {
    name: 'B_DATABASE',
    label: '子库',
    field: 'B_DATABASE',
  },
  {
    name: 'B_DATABASE_ENG',
    label: '子库-en',
    field: 'B_DATABASE_ENG',
  },
  {
    name: 'PART',
    label: '模块',
    field: 'PART',
  },
  {
    name: 'PART_ENG',
    label: '模块-en',
    field: 'PART_ENG',
  },
  {
    name: 'TABLE',
    label: '表',
    field: 'TABLE',
  },
  {
    name: 'TABLE_ENG',
    label: '表-en',
    field: 'TABLE_ENG',
  },
]

function emitDescribe(val: any, enName: string, id?: string) {
  const desc = {} as Describe

  desc.file = val
  desc.id = id
  desc.enName = enName

  emits('update:describe', desc)
}

function editReference(id: string) {
  refDialog.value = true
  reference.id = id
}

async function confirmRef() {
  refDialog.value = !refDialog.value
  const res = await updateReference(reference.id, reference.text)
  if (res) {
    Notify.create({
      message: '上传成功',
      type: 'success',
    })
  }
}
// function emitReference(val: string, id: string) {
//   const refer = {} as Reference
//   refer.text = val
//   refer.id = id
//   emits('update:reference', refer)
// }

function downLoadDescribe(enName: string): string {
  const filename = `${enName}.doc`
  const res = getDataDescribe(props.dataRootId, filename)
  return res
}

function flattenTree(tree: IDataDirectory, parentNames = [], result = ([] as any[])) {
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
  if (!props.treeData?.data)
    return []
  if (!props.treeData.data.length)
    return []

  const res = flattenTree(props.treeData.data[0])
  rowData.value = cloneDeep(res)

  return rowData.value
})
</script>

<template>
  <div full flex="~ col gap-7" p-10>
    <header flex="~ row items-center gap-10">
      <span font-600 text-grey-8 title-4>
        上传中间表
      </span>

      <q-file
        :model-value="midTable"
        bg-color="primary"

        dense filled
        accept=".csv"
        label-color="white"
        label="上传中间表"
        @update:model-value="(val) => $emit('update:midTable', val)"
      />
    </header>

    <base-table v-slot="{ props, col }" :cols="mideTableCol" :rows="tableData">
      <div flex="~ row">
        {{ props.row[`${col}`] }}
      </div>
    </base-table>

    <header font-600 text-grey-8 title-4 flex="~ row justify-start">
      数据库介绍
    </header>

    <div v-for="data in dataBase" :key="data.id" flex="~ row items-center justify-between">
      <div font-600 text-grey-5>
        {{ data.nameZH }}
      </div>

      <div flex="~ row justify-between gap-5">
        <q-file
          bg-color="primary"
          label="上传当前数据库介绍"
          filled dense
          accept=".doc"
          label-color="white"
          :model-value="describe?.file[`${data.id}`]"
          @update:model-value="(val) => emitDescribe(val, data.nameEN, data.rootId)"
        />
        <q-btn
          color="teal" label="下载当前数据库介绍"
          :href="downLoadDescribe(data.nameEN)"
        />
      </div>
    </div>

    <header font-600 text-grey-8 title-4 flex="~ row justify-start">
      引用规范
    </header>

    <div v-for="data in dataBase" :key="data.id" col-grow min-w-2xl flex="~ row items-center justify-between">
      <div font-600 text-grey-5>
        {{ data.nameZH }}
      </div>
      <q-btn color="primary" label="编辑引用规范" @click="editReference(data.id)" />
    </div>

    <q-dialog v-model="refDialog">
      <q-card min-w-3xl>
        <q-card-section>
          <q-input
            v-model="reference.text"
            filled
            type="textarea"
          />
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="确认" @click="confirmRef" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
