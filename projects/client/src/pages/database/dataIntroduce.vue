<script lang="ts" setup>
import BaseTable from 'shared/component/base/table/BaseTable.vue'
import { cloneDeep } from 'lodash-es'
import { getDataDownload } from '~/api/data/dataDownloadHandle'
import { getDataFields } from '~/api/data/getDataDirctoryFields'
import { getDataPreview } from '~/api/data/dataPreviewHandle'

const route = useRoute()

const tableFieldsCol = [
  { label: '字段', name: 'nameZH', field: 'nameZH', align: 'center' },
  { label: '含义', name: 'description', field: 'description', align: 'center' },
]
const tableFieldRows = ref([])

const downloadUrl = ref('')
const previewTable = ref([])
const referenceText = ref('')
const dialog = ref(false)
const loading = ref(false)

const previewTableData = computed(() => {
  let row = [] as any
  const col = [] as any

  if (previewTable.value && previewTable.value.length) {
    const fieldArr = previewTable.value[0]
    for (const field in fieldArr) {
      col.push({
        name: field,
        field,
        label: field,
      })
    }
    row = cloneDeep(previewTable.value)
  }
  return {
    row,
    col,
  }
})

onBeforeMount(async () => {
  loading.value = true

  const field = await getDataFields(route.query.dataId as string)
  tableFieldRows.value = field

  previewTable.value = await getDataPreview(route.query.dataId as string).finally(() => {
    loading.value = false
  })

  downloadUrl.value = getDataDownload(route.query.dataId as string)
})

function openDialog() {
  dialog.value = true
}
</script>

<template>
  <div flex="~ col items-center" full bg-grey-1>
    <div w-3xl>
      <header flex="~ row" items-center justify-start>
        <q-btn flat mr-2 text-grey-6 @click="$router.back()">
          <div i-mingcute:left-line h-6 w-6 />
        </q-btn>
        <span font-600 text-grey-8>数据资源介绍</span>
      </header>

      <div flex="~ col" mt-5 gap-5>
        <span flex="~ row" font-600 text-grey-8>表格字段说明</span>
        <BaseTable v-if="tableFieldRows.length" v-slot="{ props, col }" :loading="loading" :cols="tableFieldsCol" :rows="tableFieldRows">
          <div>
            {{ props.row[`${col}`] }}
          </div>
        </BaseTable>
      </div>

      <div flex="~ col" mt-5 gap-5>
        <span flex="~ row" font-600 text-grey-8> 表格数据预览</span>

        <BaseTable v-slot="{ props, col }" :loading="loading" :cols="previewTableData.col" :rows="previewTableData.row">
          <div>
            {{ props.row[`${col}`] }}
          </div>
        </BaseTable>
      </div>
    </div>
    <span text-primary-1>引用规范：{{ route.query.reference || '暂无引用规范' }}</span>

    <div flex="~ row gap-5" my-10>
      <a :url="downloadUrl">
        <Btn label="数据下载" />
      </a>
      <btn v-if="route.query.rootId === 'pre-purchased'" label="建议采购" @click="openDialog()" />
    </div>

    <!-- <BaseTable /> -->
    <ZDialog v-model="dialog" title="采购理由" footer>
      <q-input
        v-model="referenceText"
        filled
        type="textarea"
      />
    </ZDialog>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
