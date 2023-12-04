<script lang="ts" setup>
import { DesktopQueueStatus } from 'zjf-types'
import { download } from 'zjf-utils'
import BaseTable from 'shared/component/base/table/BaseTable.vue'

import { cloneDeep } from 'lodash-es'
import { Notify } from 'quasar'
import type { QTableProps } from 'quasar'
import { tableFileIsExist, getDataDownload } from '~/api/data/dataDownloadHandle'
import { getDataFields } from '~/api/data/getDataDirctoryFields'
import { getDataPreview } from '~/api/data/dataPreviewHandle'
import { putSuggest } from '~/api/dataSuggest/putSuggest'
import { getOwnDesktopQuery } from '~/api/desktop/getOwnDesktopQuery'

const route = useRoute()
const router = useRouter()
const { isDesktop, isLogin, isVerify } = useUser()
const { $get } = useRequest()

const tableFieldsCol: QTableProps['columns'] = [
  { label: '字段', name: 'nameZH', field: 'nameZH', align: 'center' },
  { label: '含义', name: 'description', field: 'description', align: 'center' },
]
useDataBase()

const tableFieldRows = ref<any[]>([])

const previewTable = ref([])
const referenceText = ref('')
const dialog = ref(false)
const loading = ref(false)

const previewTableData = computed(() => {
  let row: any[] = []
  const col: any[] = []

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
  else {
    col.push({
      name: 'empty',
      label: '暂无数据',
      align: 'center',
    })
  }

  return {
    row,
    col,
  }
})

/** 是否预购 */
const isPurchased = computed(() => route.query.label?.includes('预购'))
/** 是否已经申请了云桌面 */
const isApplyDesktop = ref(false)
/** 表格文件是否存在 */
const isExist = ref(false)

onBeforeMount(async () => {
  loading.value = true

  try {
    const id = route.query.dataId as string

    tableFieldRows.value = await getDataFields(id)

    previewTable.value = (await getDataPreview(id))
      .filter((row: any) => Object.values(row).some(v => v))
  }
  catch(_) {}
  finally {
    loading.value = false
  }

  // 不在云桌面 且 已通过认证，判断是否已申请云桌面
  if (!isDesktop.value && isVerify.value)
    getRequestInfo()
  // 在云桌面中，判断该表格文件是否存在
  else if (isDesktop.value)
    isExist.value = await tableFileIsExist(route.query.dataId as string)
})

/**
 * 获取云桌面申请信息
 */
async function getRequestInfo() {
  try {
    const res = await getOwnDesktopQuery()
    if (res) {
      const { queue = {} } = res
      if (queue.status === DesktopQueueStatus.Using)
        isApplyDesktop.value = true
    }
  }
  catch (_) {}
}

/**
 * 建议采购申请
 */
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

/**
 * 下载数据
 * @param url
 */
async function downloadData() {
  let api = getDataDownload(route.query.dataId as string)
  if (api.startsWith('/api'))
    api = api.substring(4)
  const url = await $get(api)
  download(url, url.split('/').pop().split('?').shift())
}
</script>

<template>
  <div flex="~ col items-center" min-h-4xl bg-grey-1>
    <div w-limited-1>
      <header flex="~ row" mb-10 w-full items-center font-600 py6 gap4>
        <q-btn flat dense text-grey-6 h6 min-h6 w6 p0 @click="router.back()">
          <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 12L0 6L6 0L7.4 1.4L2.8 6L7.4 10.6L6 12Z" fill="#6E7686" />
          </svg>
        </q-btn>
        <span text="grey-8 5" cursor-pointer @click="router.back()">数据资源介绍</span>
      </header>

      <div flex="~ col" mt-5 gap-5>
        <span flex="~ row" font-600 text-grey-8 text-4>表格字段说明</span>
        <BaseTable
          v-if="tableFieldRows.length"
          v-slot="{ props, col }" disable-pagination :loading="loading" :cols="tableFieldsCol" :rows="tableFieldRows"
        >
          <div text-left>
            {{ props.row[`${col}`] }}
          </div>
        </BaseTable>
      </div>

      <div class="w-full h-10" />

      <div flex="~ col" mt-5 gap-5>
        <span flex="~ row" text-4 font-600 text-grey-8>表格数据预览</span>

        <BaseTable
          v-slot="{ props, col }"
          :loading="loading" :cols="previewTableData.col" :rows="previewTableData.row"
          no-data-label="管理员正在配置中"
        >
          <div>
            {{ props.row[`${col}`] }}
          </div>
        </BaseTable>
      </div>

      <div text="primary-1 left" text-4 mt-6 v-text="`引用规范：${route.query.reference || '暂无引用规范'}`" />
    </div>

    <!-- 底部操作栏 -->
    <div flex="~ col" items-center gap-4 my-20>
      <Btn1
        v-if="isPurchased"
        w-36 label="建议采购"
        :disable="!isLogin || !isVerify"
        :color="!isLogin || !isVerify ? 'grey-5' : undefined"
        @click="dialog = true"
      />
      <q-btn
        v-else-if="!isDesktop && !isApplyDesktop"
        color="primary"
        :disable="!isLogin"
        square h12 outline w-36
        @click="router.push('/request')"
      >
        <span text-4 font-600>数据申请使用</span>
      </q-btn>
      <q-btn
        v-else-if="!isDesktop && isApplyDesktop"
        color="primary"
        square h12 outline w-44
        @click="router.push('/userCenter/cloudDesktop')"
      >
        <span text-4 font-600>请前往云桌面下载</span>
      </q-btn>
      <Btn1
        v-else
        w-36 label="数据下载"
        :disable="!isLogin || !isExist"
        :color="!isLogin || !isExist ? 'grey-5' : undefined"
        @click="downloadData()"
      />
      <div v-if="!isLogin" text="base grey-5" font-400>
        您尚未登录，请
        <span
          font-600 text-primary-1 cursor-pointer
          underline="~ offset-2" decoration-2
          @click="router.push('/auth/login')"
          v-text="'登录'"
        />
        后重试
      </div>
      <div v-else-if="isPurchased && !isVerify" text="base grey-5" font-400>
        用户认证通过后才能建议采购，请先前往
        <span
          font-600 text-primary-1 cursor-pointer
          underline="~ offset-2" decoration-2
          @click="router.push('/userCenter/authentication')"
          v-text="'用户中心'"
        />
        进行认证
      </div>
      <div v-else-if="!isPurchased && isDesktop && !isExist" text="base grey-5" font-400>
        管理员正在配置中
      </div>
    </div>

    <ZDialog v-model="dialog" title="采购理由" footer @ok="confirmRequest">
      <q-input
        v-model="referenceText"
        placeholder="请输入采购理由"
        class="advice-input" filled
      />
    </ZDialog>
  </div>
</template>

<style lang="sass">
.advice-input
  .q-field__control,
  .q-field__inner
    border-radius: 0px !important
  &.q-field--filled .q-field__control
    background: var(--grey-2)
    border: 1px solid var(--grey-3)

  &.q-field--filled .q-field__control::before
    border-bottom: none
  &.q-field--filled textarea
    padding-top: 10px
    min-height: 200px
</style>

<route lang="yaml">
meta:
  layout: home
</route>
