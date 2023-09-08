<script lang="ts" setup>
import BaseTable from 'shared/component/base/table/BaseTable.vue'
import { Notify } from 'quasar'
import type { IQueryConfig, IVerificationHistory } from 'zjf-types'
import { PAGINATION_SIZE_MAX } from 'zjf-types'
import { useDialog } from '../../../components/dialog/use-dialog'
import UploadFile from '~/components/file/UploadFile.vue'

import Btn from '~/components/btn/Btn.vue'

import { createWork } from '~/api/work/createWork'
import { upsertWork } from '~/api/work/upsertWork'
import { searchMyWorks } from '~/api/work/searchMyWorks'
import { deleteWork } from '~/api/work/deleteWrok'

// const router = useRouter()

const { showConfirmDialog } = useDialog()
const uploadDialog = ref(false)
const loading = ref(false)
const editType = ref<'add' | 'upsert'>()

const editInfo = reactive({
  id: '',
  title: '',
  author: '',
  file: null,
  read: false,
})

const workCol = [
  {
    name: 'title',
    field: 'title',
    align: 'center',
    label: '题目',
  },
  {
    name: 'author',
    field: 'author',
    align: 'center',
    label: '作者',
  },
  {
    name: 'filename',
    field: 'filename',
    align: 'center',
    label: '文件名称',
  },
  {
    name: 'operation',
    field: 'operation',
    align: 'center',
    label: '操作',
  },
]
const rows = ref<any[]>([])

const baseOptions = {
  filters: [],
  pagination: {
    pageSize: PAGINATION_SIZE_MAX,
    page: 0,
  },
  sort: [],
} as IQueryConfig<IVerificationHistory>

onMounted(async () => {
  await fetchSearchMyWorks()
})

async function fetchSearchMyWorks() {
  loading.value = true
  const res = await searchMyWorks(baseOptions).finally(() => {
    loading.value = false
  })
  rows.value = res.data.map((item: any) => {
    return {
      ...item,
      operation: '',
    }
  })
}

async function confirmWork() {
  const { id, file, title, author } = editInfo
  if (editType.value === 'add') {
    const res = await createWork(file, title, author)
    if (res)
      succNotify('增加作品')
  }
  else if (editType.value === 'upsert') {
    const res = await upsertWork(id, file, title, author)
    if (res)
      succNotify('修改作品')
  }

  await fetchSearchMyWorks()
}

async function deleteRow(id: string) {
  const dialog = await showConfirmDialog({
    title: '确认删除',
    color: '#F44336',
    okText: '删除',
    content: '确认删除该作品？删除后不可恢复',
  })
  dialog.onOk(async () => {
    editInfo.id = id
    const res = await deleteWork(editInfo.id)
    if (res)
      succNotify('删除作品')
    await fetchSearchMyWorks()
  })
}

function resetWork(id: string) {
  uploadDialog.value = true
  editType.value = 'upsert'
  editInfo.id = id
}

function succNotify(message: string) {
  Notify.create({
    message: `${message}成功`,
    type: 'success',
  })
}
</script>

<template>
  <div min-h-xl>
    <header flex="~ row" mb-8>
      <client-only>
        <q-btn

          flat square h12 bg-primary-1 text-white
          @click="uploadDialog = true, editType = 'add'"
        >
          <div flex="~" items-center gap2 text-4>
            <span>增加作品</span>
            <div i-material-symbols:add />
          </div>
        </q-btn>
      </client-only>
    </header>

    <div v-if="loading || rows.length" flex="~ col">
      <div flex="~ row" mb-5 text-grey-8>
        <span font-600 text="4 grey-8">我的作品</span>
      </div>

      <BaseTable v-slot="{ props, col }" :loading="loading" :cols="workCol" :rows="rows">
        <div v-if="col === 'operation'" flex="~ row justify-center">
          <Btn mr-4 min-w-22 outline label="重新上传" @click="resetWork(props.row.id)" />
          <Btn min-w-22 text-alert-error outline label="删除" bg-color="alert-error" @click="deleteRow(props.row.id)" />
        </div>
        <div v-else>
          {{ props.row[`${col}`] }}
        </div>
      </BaseTable>

      <ZDialog v-model="uploadDialog" title="添加作品" footer :disable-confirm="!editInfo.read" @ok="confirmWork">
        <div bg-grey-1 flex="~ col gap-2">
          <span font-500 text-grey-8>题目</span>
          <UserCodeInput v-model:user-code="editInfo.title" label="输入题目" :dark="false" />

          <span font-500 text-grey-8>作者</span>
          <UserCodeInput v-model:user-code="editInfo.author" label="输入作者" :dark="false" />

          <div flex="~ col" my-5>
            <div flex="~ row justify-between items-center">
              <span text-grey-8>上传资料（必须为PDF格式）</span>
              <UploadFile v-model="editInfo.file" label="选择文件" accept-file=".pdf" />
            </div>

            <div text-grey-8>
              {{ editInfo.file?.name }}
            </div>
          </div>

          <div flex="~ row">
            <!-- checked-icon="i-material-symbols:check-circle"
              unchecked-icon="i-material-symbols:lens-outline" -->
            <q-checkbox
              v-model="editInfo.read"
            />
            <div>
              <span text-grey-5>我已阅读并同意</span>
              <RouterLink cursor-pointer text-primary-1 :to="{ path: '/protocol/private' }">
                《「社科大数据平台」隐私政策》
              </RouterLink>

              <RouterLink cursor-pointer text-primary-1 :to="{ path: '/protocol/use' }">
                《「社科大数据平台」用户使用协议》
              </RouterLink>
            </div>
          </div>
        </div>
      </zdialog>
    </div>

    <div v-else flex="~ col" items-center justify-center gap6>
      <svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="128" cy="128" r="128" fill="#F5F7FA" />
        <path d="M54.0781 193.49V77.3965H201.675V193.49H54.0781Z" fill="#A6B1C2" />
        <path d="M63.2598 67.471L186.299 62.5098V169.673H63.2598V67.471Z" fill="white" />
        <path d="M54.0781 193.489V81.6133H104.683L109.644 91.7838H201.675V193.489H54.0781Z" fill="#6E7686" fill-opacity="0.4" />
        <path d="M54.0781 193.489V88.5586H99.7215L104.683 98.7291H201.675V193.489H54.0781Z" fill="#D4DDEA" />
        <rect x="70.4512" y="128.498" width="38.2016" height="7.44186" fill="white" fill-opacity="0.5" />
        <rect x="70.4512" y="147.846" width="63.0078" height="7.44186" fill="white" fill-opacity="0.5" />
      </svg>

      <div flex="~ col" items-center gap-2>
        <div text-4.5 text-gray-8>
          您还未添加任何作品
        </div>
        <div text-3.5 text-gray-5>
          点击左上角增加作品按钮，可以上传作品
        </div>
      </div>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: userCenter
</route>
