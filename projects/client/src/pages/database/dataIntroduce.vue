<script lang="ts" setup>
import BaseTable from 'shared/component/base/table/BaseTable.vue'

import { cloneDeep } from 'lodash-es'
import { Notify } from 'quasar'
import type { QTableProps } from 'quasar'
import type { IDataField } from 'zjf-types'
import DesktopRequestDaialog from '~/view/request/DesktopRequestDaialog.vue'
import { getDataDownload } from '~/api/data/dataDownloadHandle'
import { getDataFields } from '~/api/data/getDataDirctoryFields'
import { getDataPreview } from '~/api/data/dataPreviewHandle'
import { putSuggest } from '~/api/dataSuggest/putSuggest'

const route = useRoute()
const { $get } = useRequest()
const { isDesktop } = useUser()

const tableFieldsCol: QTableProps['columns'] = [
  { label: '字段', name: 'nameZH', field: 'nameZH', align: 'center' },
  { label: '含义', name: 'description', field: 'description', align: 'center' },
]

const tableFieldRows = ref<IDataField[]>([])

const downloadUrl = ref('')
const previewTable = ref([])
const referenceText = ref('')
const dialog = ref(false)
const loading = ref(false)
const requestDesktop = ref(false)

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

const isPurchased = computed(() => route.query.label?.includes('预购'))

onBeforeMount(async () => {
  loading.value = true

  const field = await getDataFields(route.query.dataId as string)
  tableFieldRows.value = field

  previewTable.value = await getDataPreview(route.query.dataId as string).finally(() => {
    loading.value = false
  })

  let url = getDataDownload(route.query.dataId as string)
  if (url.startsWith('/api'))
    url = url.substring(4)
  downloadUrl.value = await $get(url)
})

async function openDialog() {
  dialog.value = true

  // const res = await downloadDescribeByRole('访客')
  // console.log({ res })
}

async function confirmRequest() {
  if (!route.query.dataId)
    return

  const res = await putSuggest(route.query.dataId as string, referenceText.value)
  if (res) {
    Notify.create({
      message: '建议采购成功',
      type: 'success',
    })
  }
}
</script>

<template>
  <div flex="~ col items-center" min-h-4xl bg-grey-1>
    <div w-3xl>
      <header flex="~ row" items-center justify-start>
        <q-btn flat text-grey-6 mr-2 @click="$router.back()">
          <div h-6 w-6 i-mingcute:left-line />
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

      <div mt-6 text="primary-1 left" v-text="`引用规范：${route.query.reference || '暂无引用规范'}`" />
    </div>

    <div flex="~ row gap-5" my-10>
      <Btn v-if="!isDesktop && !isPurchased" outline label="数据申请使用" @click="requestDesktop = true" />
      <a v-else-if="!isPurchased" :href="downloadUrl" download="数据库">
        <Btn label="数据下载" />
      </a>
      <btn v-if="isPurchased" label="建议采购" @click="openDialog()" />
    </div>

    <!-- <BaseTable /> -->
    <ZDialog v-model="dialog" title="采购理由" footer @ok="confirmRequest">
      <q-input
        v-model="referenceText"
        filled
        type="textarea"
      />
    </ZDialog>

    <DesktopRequestDaialog v-model="requestDesktop" />
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
