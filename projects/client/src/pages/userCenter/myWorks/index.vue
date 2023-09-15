<script lang="ts" setup>
import BaseTable from 'shared/component/base/table/BaseTable.vue'
import { Notify } from 'quasar'
import type { IQueryConfig, IVerificationHistory } from 'zjf-types'
import { PAGINATION_SIZE_MAX } from 'zjf-types'
import { useDialog } from '~/components/dialog/use-dialog'

import { createWork } from '~/api/work/createWork'
import { upsertWork } from '~/api/work/upsertWork'
import { searchMyWorks } from '~/api/work/searchMyWorks'
import { deleteWork } from '~/api/work/deleteWrok'

const { showConfirmDialog } = useDialog()
const uploadDialog = ref(false)
const loading = ref(false)
const editType = ref<'add' | 'upsert'>()

const editInfo = reactive({
  id: '',
  title: '',
  author: '',
  file: null as any,
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

  resetForm()
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

function resetWork(row: any) {
  editInfo.title = row.title
  editInfo.author = row.author

  uploadDialog.value = true
  editType.value = 'upsert'
  editInfo.id = row.id
}

function succNotify(message: string) {
  Notify.create({
    message: `${message}成功`,
    type: 'success',
  })
}

function resetForm() {
  editInfo.id = ''
  editInfo.title = ''
  editInfo.author = ''
  editInfo.file = null
}
</script>

<template>
  <div min-h-xl>
    <header flex="~ row" mb-8>
      <client-only>
        <Btn1
          w-36 label="增加作品"
          @click="uploadDialog = true, editType = 'add'"
        >
          <div i-material-symbols:add h-6 w-6 ml-2 />
        </Btn1>
      </client-only>
    </header>

    <div v-if="loading || rows.length" flex="~ col">
      <div flex="~ row" mb-5 text-grey-8>
        <span font-600 text="4 grey-8">我的作品</span>
      </div>

      <BaseTable v-slot="{ props, col }" :loading="loading" :cols="workCol" :rows="rows">
        <div v-if="col === 'operation'" flex="~ row justify-center">
          <Btn outline mr-4 min-w-22 label="重新上传" @click="resetWork(props.row)" />
          <Btn min-w-22 text-alert-error outline label="删除" bg-color="alert-error" @click="deleteRow(props.row.id)" />
        </div>
        <div v-else>
          {{ props.row[`${col}`] }}
        </div>
      </BaseTable>
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

    <ZDialog
      v-model="uploadDialog"
      title="增加作品" footer :disable-confirm="!editInfo.read"
      @update:model-value="(val) => !val && resetForm()"
      @ok="confirmWork"
    >
      <div bg-grey-1 flex="~ col gap-2">
        <span font-500 text-grey-8>题目</span>
        <UserCodeInput v-model:user-code="editInfo.title" label="请输入题目" :dark="false" />

        <span font-500 text-grey-8 mt-4>作者</span>
        <UserCodeInput v-model:user-code="editInfo.author" label="请输入作者" :dark="false" />

        <div flex="~ col" my-4>
          <div flex="~ row justify-between items-center">
            <span text-grey-8>
              上传资料
              <span text-grey-6 font-400>（必须为 PDF 格式）</span>
            </span>
            <UploadFile v-model="editInfo.file" accept-file=".pdf">
              <q-btn bg="primary-1/12" flat square text-primary-1 h-8>
                <div flex="~" items-center gap-2>
                  <svg width="19" height="14" viewBox="0 0 19 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.935547 13.6673V0.333984H7.60221L9.26888 2.00065H17.6022V3.66732H8.58138L6.91471 2.00065H2.60221V12.0007L4.60221 5.33398H18.8522L16.3522 13.6673H0.935547ZM4.35221 12.0007H15.1022L16.6022 7.00065H5.85221L4.35221 12.0007Z" fill="#025CB9" />
                  </svg>
                  <span>提交文件</span>
                </div>
              </q-btn>
            </UploadFile>
          </div>

          <div v-if="editInfo.file" flex items-center justify-between text-grey-5 mt-2>
            <div flex items-center gap1>
              <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.570312 13.6673V0.333984H7.23698L11.237 4.33398V13.6673H0.570312ZM6.57031 5.00065V1.66732H1.90365V12.334H9.90365V5.00065H6.57031Z" fill="#6E7686" />
              </svg>
              <span text-grey-8>{{ editInfo.file?.name }}</span>
            </div>
            <div flex="~ center" cursor-pointer h4 w4 @click="editInfo.file = null">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.50495 10.334L6.90495 7.93398L9.30495 10.334L10.2383 9.40065L7.83828 7.00065L10.2383 4.60065L9.30495 3.66732L6.90495 6.06732L4.50495 3.66732L3.57161 4.60065L5.97161 7.00065L3.57161 9.40065L4.50495 10.334ZM6.90495 13.6673C5.98273 13.6673 5.11606 13.4922 4.30495 13.142C3.49384 12.7918 2.78828 12.3169 2.18828 11.7173C1.58828 11.1173 1.11339 10.4118 0.763615 9.60065C0.413837 8.78954 0.238726 7.92287 0.238281 7.00065C0.238281 6.07843 0.413392 5.21176 0.763615 4.40065C1.11384 3.58954 1.58873 2.88398 2.18828 2.28398C2.78828 1.68398 3.49384 1.2091 4.30495 0.859318C5.11606 0.50954 5.98273 0.334429 6.90495 0.333984C7.82717 0.333984 8.69384 0.509096 9.50495 0.859318C10.3161 1.20954 11.0216 1.68443 11.6216 2.28398C12.2216 2.88398 12.6967 3.58954 13.0469 4.40065C13.3972 5.21176 13.5721 6.07843 13.5716 7.00065C13.5716 7.92287 13.3965 8.78954 13.0463 9.60065C12.6961 10.4118 12.2212 11.1173 11.6216 11.7173C11.0216 12.3173 10.3161 12.7924 9.50495 13.1426C8.69384 13.4929 7.82717 13.6678 6.90495 13.6673Z" fill="#A6B1C2" />
              </svg>
            </div>
          </div>
        </div>

        <ProtocolFooter v-model="editInfo.read" />
      </div>
    </ZDialog>
  </div>
</template>

<route lang="yaml">
meta:
  layout: userCenter
</route>
