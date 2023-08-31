<script lang="ts" setup>
import BaseTable from 'shared/component/base/table/BaseTable.vue'
import { FileExportLargeStatus, PAGINATION_SIZE_MAX } from 'zjf-types'
import type { IFileExportLarge, IFileExportSmall, IQueryDto } from 'zjf-types'
import moment from 'moment'
import { useQuasar } from 'quasar'

import HistoryStatus from './history/HistoryStatus.vue'
import { getOwnExportLg } from '~/api/exportLg/getOwnExportLg'
import { getOwnExportSm } from '~/api/exportSm/getOwnExportSm'

type FileType = 'small' | 'big'
const toggle: Array < { label: string; value: FileType } > = [
  { label: '小文件外发', value: 'small' },
  { label: '大文件外发', value: 'big' },
]

const model = ref<FileType>(toggle[0].value)
const loading = ref(false)
const $q = useQuasar()
const baseOpts: IQueryDto<IFileExportSmall> = {
  pagination: {
    page: 0,
    pageSize: PAGINATION_SIZE_MAX,
  },
  filters: [],
  sort: [],
  relations: {
    founder: { verification: true },
  },
}

const historyCol = [
  {
    name: 'fileName',
    label: '文件名',
    field: 'fileName',
    align: 'center',
  },
  {
    name: 'email',
    label: '邮箱地址',
    field: 'email',
    align: 'center',
  },
  {
    name: 'note',
    label: '备注信息',
    field: 'note',
    align: 'center',
  },
  {
    name: 'name',
    label: '真实姓名',
    field: 'name',
    align: 'center',
  },
  {
    name: 'status',
    label: '状态',
    field: 'status',
    align: 'center',
  },
  {
    name: 'rejectReason',
    label: '驳回理由',
    field: 'rejectReason',
    align: 'center',
  },
  {
    name: 'createdAt',
    label: '外发时间',
    field: 'createdAt',
    align: 'center',
  },
]
const select = ref()
const searchFilename = ref('')
const selectList = ref([
  { label: '已完成', id: FileExportLargeStatus.Approved },
  { label: '失败', id: FileExportLargeStatus.Rejected },
  { label: '审核中', id: FileExportLargeStatus.Pending },
])

const rows = ref([])

onMounted(() => {
  getSmExport(baseOpts)
})

async function getSmExport(options: IQueryDto<IFileExportSmall>) {
  loading.value = true
  const res = await getOwnExportSm(options).finally(() => {
    loading.value = false
  })
  if (!res)
    return
  rows.value = res.data.map((i: any) => {
    let name
    if (i?.founder?.verification)
      name = i.founder.verification.name
    else
      name = ''

    return {
      ...i,
      name,
    }
  })
}
async function getLgExport(options: IQueryDto<IFileExportLarge>) {
  loading.value = true
  const res = await getOwnExportLg(options).finally(() => {
    loading.value = false
  })
  if (!res)
    return
  rows.value = res.data.map((i: any) => {
    let name
    if (i?.founder?.verification)
      name = i.founder.verification.name
    else
      name = ''

    return {
      ...i,
      name,
    }
  })
}

function fetchRejectReason(reason: string) {
  $q.dialog({
    title: '驳回理由',
    message: reason,
  })
}

watch(model, (newModel) => {
  if (newModel === 'small') {
    rows.value = []

    getSmExport(baseOpts)
  }
  else if (newModel === 'big') {
    rows.value = []
    getLgExport(baseOpts)
  }
})

watch(searchFilename, (filename) => {
  const options = {
    ...baseOpts,
  }

  if (filename) {
    options.filters = [
      { field: 'fileName', type: 'LIKE', value: filename },
    ]
  }
  else {
    options.filters = []
  }

  if (model.value === 'small')
    getSmExport(options)

  else if (model.value === 'big')
    getLgExport(options)
})

watch(select, (selectOptions) => {
  const options = {
    ...baseOpts,
  }
  if (!selectOptions)
    return

  if (selectOptions.length) {
    const filtersIN = selectOptions.map((item: any) => item.id)
    options.filters = [
      {
        field: 'status',
        type: 'IN',
        value: filtersIN,
      },
    ]
  }
  else { options.filters = [] }

  if (model.value === 'small')
    getSmExport(options)

  else if (model.value === 'big')
    getLgExport(options)
})
</script>

<template>
  <div p-5>
    <header flex="~ col" mb-5>
      <div flex="~ row justify-center" my-4>
        <q-btn-toggle
          v-model="model"
          unelevated spread no-caps rounded-0
          toggle-color="primary-1"
          color="white"
          text-color="black"
          :options="toggle"
        />
      </div>

      <div flex="~ row justify-between items-center">
        <div text-4 font-600 text-grey-8>
          外发记录
        </div>

        <div flex="~ row gap-5">
          <ZSelect
            v-if="model === 'big'"
            v-slot="{ scope }"
            v-model="select"
            input-debounce="0"

            multiple use-chips chip min-w-20
            :options="selectList"
          >
            <q-chip
              dense removable ml-2
              :tabindex="scope.tabindex"
              color="grey-2"
              text-color="grey-8"
              class="q-ma-none pa-3"
              @remove="scope.removeAtIndex(scope.index)"
            >
              {{ scope.opt.label }}
            </q-chip>
          </ZSelect>
          <UserCodeInput v-model:user-code="searchFilename" :dark="false" label="搜索文件名">
            <template #prepend>
              <div i-material-symbols:search-rounded h-5 w-5 bg-grey-5 />
            </template>
          </UserCodeInput>
        </div>
      </div>
    </header>

    <BaseTable v-slot="{ col, props }" :cols="historyCol" :rows="rows">
      <div v-if="col === 'status'" flex-center>
        <HistoryStatus v-if="model === 'small'" :status="FileExportLargeStatus.Approved" />
        <HistoryStatus v-else :status="props.row[`${col}`]" />
      </div>

      <div v-else-if="col === 'createdAt'">
        {{ moment(props.row[`${col}`]).format('YYYY-MM-DD HH:mm:ss') }}
      </div>

      <div v-else-if="col === 'rejectReason'">
        <div v-if="props.row[`${col}`]">
          <div text-primary-1 @click="fetchRejectReason(props.row[`${col}`])">
            点击查看
          </div>
        </div>

        <div v-else>
          -
        </div>
      </div>

      <div v-else>
        {{ props.row[`${col}`] || '-' }}
      </div>
    </BaseTable>
  </div>
</template>

<style lang="scss">

</style>
