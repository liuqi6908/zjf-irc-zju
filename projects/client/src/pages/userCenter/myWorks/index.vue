<script lang="ts" setup>
import BaseTable from 'shared/component/base/table/BaseTable.vue'
import { Notify } from 'quasar'
import type { IQueryConfig, IVerificationHistory } from 'zjf-types'
import { PAGINATION_SIZE_MAX } from 'zjf-types'
import UploadFile from '~/components/file/UploadFile.vue'

import Btn from '~/components/btn/Btn.vue'

import { createWork } from '~/api/work/createWork'
import { upsertWork } from '~/api/work/upsertWork'
import { searchMyWorks } from '~/api/work/searchMyWorks'
import { deleteWork } from '~/api/work/deleteWrok'

const router = useRouter()
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
const rows = ref([
  // {
  //   title: '',
  //   author: '',
  //   filename: '',
  //   operation: '',
  // },
])

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
  editInfo.id = id
  const res = await deleteWork(editInfo.id)
  if (res)
    succNotify('删除作品')
  await fetchSearchMyWorks()
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
        <Btn label="增加作品" @click="uploadDialog = true, editType = 'add'">
          <template #icon>
            <div i-material-symbols:add />
          </template>
        </Btn>
      </client-only>
    </header>

    <div flex="~ col">
      <div flex="~ row" mb-5 text-grey-8>
        <span font-600>我的作品</span>
      </div>

      <BaseTable v-slot="{ props, col }" :loading="loading" :cols="workCol" :rows="rows">
        <div v-if="col === 'operation'" flex="~ row justify-center">
          <Btn mr-4 outline label="重新上传" @click="resetWork(props.row.id)" />
          <Btn outline label="删除" bg-color="alert-error" @click="deleteRow(props.row.id)" />
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
  </div>
</template>

<route lang="yaml">
meta:
  layout: userCenter
</route>
