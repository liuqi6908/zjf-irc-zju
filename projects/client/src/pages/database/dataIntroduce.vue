<script lang="ts" setup>
import BaseTable from 'shared/component/base/table/BaseTable.vue'

import { cloneDeep } from 'lodash-es'
import { Notify } from 'quasar'
import DesktopRequestDaialog from '~/view/request/DesktopRequestDaialog.vue'
import { getDataDownload } from '~/api/data/dataDownloadHandle'
import { getDataFields } from '~/api/data/getDataDirctoryFields'
import { getDataPreview } from '~/api/data/dataPreviewHandle'
import { putSuggest } from '~/api/dataSuggest/putSuggest'

import { isDesktop } from '~/api/desktop/isDesktop'

const route = useRoute()

const tableFieldsCol = [
  { label: '字段', name: 'nameZH', field: 'nameZH', align: 'center' },
  { label: '含义', name: 'description', field: 'description', align: 'center' },
]
useDataBase()

const tableFieldRows = ref<any[]>([])

const downloadUrl = ref('')
const previewTable = ref([])
const referenceText = ref('')
const dialog = ref(false)
const loading = ref(false)
const isClient = ref(false)
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
        align: 'center',
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

  previewTable.value = (await getDataPreview(route.query.dataId as string).finally(() => {
    loading.value = false
  })).filter(row => Object.values(row).some(v => v))

  downloadUrl.value = getDataDownload(route.query.dataId as string)
  isClient.value = await isDesktop()
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
    <div w-limited-1>
      <header flex="~ row" mb-10 w-full items-center gap4 py6 font-600>
        <q-btn flat dense h6 min-h6 w6 p0 text-grey-6 @click="() => $router.back()">
          <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 12L0 6L6 0L7.4 1.4L2.8 6L7.4 10.6L6 12Z" fill="#6E7686" />
          </svg>
        </q-btn>
        <span text="grey-8 5">数据资源介绍</span>
      </header>

      <div flex="~ col" mt-5 gap-5>
        <span flex="~ row" text-4 font-600 text-grey-8>表格字段说明</span>
        <BaseTable
          v-if="tableFieldRows.length"
          v-slot="{ props, col }" disable-pagination :loading="loading" :cols="tableFieldsCol" :rows="tableFieldRows"
        >
          <div>
            {{ props.row[`${col}`] }}
          </div>
        </BaseTable>
      </div>

      <div class="h-10 w-full" />

      <div flex="~ col" mt-5 gap-5>
        <span flex="~ row" text-4 font-600 text-grey-8> 表格数据预览</span>

        <BaseTable
          v-slot="{ props, col }"
          disable-pagination :loading="loading" :cols="previewTableData.col" :rows="previewTableData.row"
        >
          <div>
            {{ props.row[`${col}`] }}
          </div>
        </BaseTable>
      </div>

      <div mt-6 text="primary-1 left" v-text="`引用规范：${route.query.reference || '暂无引用规范'}`" />
    </div>

    <div flex="~ row gap-5" my-10>
      <Btn v-if="!isClient && !isPurchased" outline label="数据申请使用" @click="requestDesktop = true" />
      <a v-else-if="!isPurchased" :href="downloadUrl" download="数据库">
        <Btn label="数据下载" />
      </a>

      <btn v-if="isPurchased" label="建议采购" @click="openDialog()" />
    </div>

    <!-- <BaseTable /> -->
    <ZDialog v-model="dialog" title="采购理由" footer @ok="confirmRequest">
      <q-input v-model="referenceText" filled type="textarea" />
    </ZDialog>

    <DesktopRequestDaialog v-model="requestDesktop" />
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
