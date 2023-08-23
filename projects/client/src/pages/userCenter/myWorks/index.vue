<script lang="ts" setup>
import BaseTable from 'shared/component/base/table/BaseTable.vue'
import UploadFile from '~/components/file/UploadFile.vue'

const router = useRouter()
const uploadDialog = ref(false)
const readed = ref(false)

const editInfo = reactive({
  title: '',
  author: '',
  files: [],
  readed: false,
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
const rows = [
  {
    title: '',
    author: '',
    filename: '',
    operation: '',
  },
]

function addWork() {
  uploadDialog.value = true
}
</script>

<template>
  <div min-h-xl>
    <header flex="~ row" mb-8>
      <btn label="增加作品" @click="addWork">
        <template #icon>
          <div i-material-symbols:add />
        </template>
      </btn>
    </header>

    <div flex="~ col">
      <div flex="~ row" text-grey-8>
        <span font-600>我的作品</span>
      </div>

      <BaseTable v-slot="{ props, col }" :loading="loading" :cols="workCol" :rows="rows">
        <div v-if="col === 'operation'">
          <btn mr-4 outline label="重新上传" />
          <btn outline label="删除" bg-color="alert-error" />
        </div>
        <div v-else>
          {{ props.row[`${col}`] }}
        </div>
      </BaseTable>

      <ZDialog v-model="uploadDialog" title="增加作品" :footer="true">
        <div bg-grey-1 flex="~ col gap-2">
          <span font-500 text-grey-8>题目</span>
          <UserCodeInput v-model:user-code="editInfo.title" label="输入题目" :dark="false" />

          <span font-500 text-grey-8>作者</span>
          <UserCodeInput v-model:user-code="editInfo.author" label="输入作者" :dark="false" />

          <div flex="~ row justify-between items-center" my-5>
            <span text-grey-8>上传资料（必须为PDF格式）</span>
            <UploadFile v-model="editInfo.files" label="选择文件" />
          </div>

          <div flex="~ row">
            <!-- checked-icon="i-material-symbols:check-circle"
              unchecked-icon="i-material-symbols:lens-outline" -->
            <q-checkbox
              v-model="editInfo.readed"
            />
            <div>
              <span text-grey-5>我已阅读并同意</span>
              <span cursor-pointer text-primary-1 @click="() => router.replace('/protocol/private')">
                《「社科大数据平台」隐私政策》
              </span>
              <span cursor-pointer text-primary-1 @click="() => router.replace('/protocol/use')">
                《「社科大数据平台」用户使用协议》
              </span>
            </div>
          </div>
        </div>
      </ZDialog>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: userCenter
</route>
