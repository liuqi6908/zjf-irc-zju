<script lang="ts" setup>
import { DesktopQueueStatus } from 'zjf-types'
import { download } from 'zjf-utils'
import BaseTable from 'shared/component/base/table/BaseTable.vue'

import { cloneDeep } from 'lodash-es'
import { Notify } from 'quasar'
import type { QTableProps } from 'quasar'
import { getDataDownload } from '~/api/data/dataDownloadHandle'
import { getDataFields } from '~/api/data/getDataDirctoryFields'
import { getDataPreview } from '~/api/data/dataPreviewHandle'
import { putSuggest } from '~/api/dataSuggest/putSuggest'
import { getOwnDesktopQuery } from '~/api/desktop/getOwnDesktopQuery'

const route = useRoute()
const $router = useRouter()
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

/** 是否已经申请了云桌面 */
const isApplyDesktop = ref(false)

onBeforeMount(async () => {
  loading.value = true

  const field = await getDataFields(route.query.dataId as string)
  tableFieldRows.value = field

  previewTable.value = (await getDataPreview(route.query.dataId as string).finally(() => {
    loading.value = false
  })).filter((row: any) => Object.values(row).some(v => v))

  // 不在云桌面 且 已通过认证，判断是否已申请云桌面
  if (!isDesktop.value && isVerify.value)
    getRequestInfo()
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
        <q-btn flat dense text-grey-6 h6 min-h6 w6 p0 @click="() => $router.back()">
          <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 12L0 6L6 0L7.4 1.4L2.8 6L7.4 10.6L6 12Z" fill="#6E7686" />
          </svg>
        </q-btn>
        <span text="grey-8 5" cursor-pointer @click="() => $router.back()">数据资源介绍</span>
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
        <span flex="~ row" text-4 font-600 text-grey-8> 表格数据预览</span>

        <BaseTable
          v-slot="{ props, col }"
          :loading="loading" :cols="previewTableData.col" :rows="previewTableData.row"
        >
          <div>
            {{ props.row[`${col}`] }}
          </div>
        </BaseTable>
      </div>

      <div text="primary-1 left" text-4 mt-6 v-text="`引用规范：${route.query.reference || '暂无引用规范'}`" />
    </div>

    <div flex="~ col" items-center gap-4 my-20>
      <template v-if="!isPurchased">
        <router-link v-if="!isDesktop && !isApplyDesktop" :to="{ path: '/request' }">
          <q-btn
            color="primary"
            square h12 outline w-36
          >
            <span text-4 font-600>数据申请使用</span>
          </q-btn>
        </router-link>
        <router-link v-else-if="!isDesktop && isApplyDesktop" :to="{ path: '/userCenter/cloudDesktop' }">
          <q-btn
            color="primary"
            square h12 outline w-44
          >
            <span text-4 font-600>请前往云桌面下载</span>
          </q-btn>
        </router-link>
        <template v-else>
          <Btn1
            w-36 label="数据下载"
            :disable="!isLogin"
            :color="!isLogin ? 'grey-5' : undefined"
            @click="downloadData()"
          />
          <div v-if="!isLogin" text="base grey-5" v-text="'您尚未登录请登录后重试'" />
        </template>
      </template>
      <template v-else>
        <Btn1
          w-36 label="建议采购"
          :disable="!isLogin || !isVerify"
          :color="!isLogin || !isVerify ? 'grey-5' : undefined"
          @click="dialog = true"
        />
        <div v-if="!isLogin" text="base grey-5">
          您尚未登录请
          <span
            font-600 text-primary-1 cursor-pointer
            underline="~ offset-2" decoration-2
            @click="$router.push('/auth/login')"
            v-text="'登录'"
          />
          后重试
        </div>
        <div v-else-if="!isVerify" text="base grey-5">
          用户认证通过后才能建议采购，请先前往
          <span
            font-600 text-primary-1 cursor-pointer
            underline="~ offset-2" decoration-2
            @click="$router.push('/userCenter/authentication')"
            v-text="'用户中心'"
          />
          进行认证
        </div>
      </template>
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
