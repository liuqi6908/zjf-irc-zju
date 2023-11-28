<script lang="ts" setup>
import BaseTable from 'shared/component/base/table/BaseTable.vue'
import { FileExportLargeStatus, PAGINATION_SIZE_MAX } from 'zjf-types'
import type { IFileExportLarge, IFileExportSmall, IQueryDto } from 'zjf-types'
import moment from 'moment'
import type { QTableProps } from 'quasar'

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
const baseOpts: IQueryDto<IFileExportSmall> = {
  pagination: {
    page: 0,
    pageSize: PAGINATION_SIZE_MAX,
  },
  filters: [],
  sort: [
    {
      field: 'createdAt',
      order: 'DESC',
    },
  ],
  relations: {
    founder: { verification: true },
  },
}

const historyCol: QTableProps['columns'] = [
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

const searchFilename = ref('')
const selectList = ref([
  { label: '已通过', id: FileExportLargeStatus.Approved },
  { label: '待审核', id: FileExportLargeStatus.Pending },
  { label: '已驳回', id: FileExportLargeStatus.Rejected },
])
const select = ref(selectList.value)

const rows = ref([])

const dialog = ref(false)
const reason = ref('')

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
  <div>
    <header flex="~ col" mb-5>
      <div flex="~ row justify-center" my-4>
        <q-btn-toggle
          v-model="model"
          unelevated spread no-caps rounded-0
          toggle-color="primary-1"
          toggle-text-color="grey-1"
          color="grey-2"
          text-color="grey-8"
          :options="toggle"
          size="16px" padding="6.3px 48px"
        />
      </div>

      <div flex="~ row justify-between items-center" mt-4>
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
              removable
              :tabindex="scope.tabindex"
              color="grey-2"
              text-color="grey-8"
              class="q-ma-none pa-3"
              size="16px"
              @remove="scope.removeAtIndex(scope.index)"
            >
              {{ scope.opt.label }}
            </q-chip>
          </ZSelect>
          <UserCodeInput v-model:user-code="searchFilename" class="w-60!" :dark="false" label="搜索文件名">
            <template #prepend>
              <div w-5 i-material-symbols:search-rounded bg-grey-5 relative top-5px />
            </template>
          </UserCodeInput>
        </div>
      </div>
    </header>

    <BaseTable
      v-slot="{ col, props }"
      :cols="historyCol.filter(v => model === 'big' || !['status', 'rejectReason'].includes(v.name))"
      :rows="rows"
    >
      <div v-if="col === 'status'" flex-center>
        <HistoryStatus :status="props.row[`${col}`]" />
      </div>

      <div v-else-if="col === 'createdAt'">
        {{ moment(props.row[`${col}`]).format('YYYY-MM-DD HH:mm:ss') }}
      </div>

      <div v-else-if="col === 'rejectReason'">
        <div v-if="props.row[`${col}`]">
          <div
            text-primary-1 cursor-pointer
            @click="() => {
              dialog = true
              reason = props.row[`${col}`]
            }"
          >
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

    <!-- 驳回理由 -->
    <ZDialog v-model="dialog" title="驳回理由">
      {{ reason }}
      <footer flex justify-end mt-6>
        <q-btn
          v-close-popup flat square h10 min-w-28 bg-primary-1
          text-grey-1 label="确认"
        />
      </footer>
    </ZDialog>
  </div>
</template>

<style lang="scss" scoped>
.q-btn-toggle {
  :deep(.q-btn) {
    font-weight: 600;
  }
}
:deep(.q-field) {
  .q-field__native {
    min-height: inherit !important;
    gap: 1rem;
  }
  .q-field__label {
    font-size: 16px;
  }
}
:deep(.q-chip) {
  .q-icon {
    font-size: 14px;
    margin-left: 2px;
    color: var(--grey-4);
  }
}
</style>
