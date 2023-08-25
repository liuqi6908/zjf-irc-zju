<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { type IQueryDto, type IVerificationHistory, PAGINATION_SIZE_MAX } from 'zjf-types'
import { queryList } from '../../api/work/queryList'
import BaseTable from '../../components/table/BaseTable.vue'
import { getUrlByToken } from '../../api/file/getUrl'

const workRows = ref([])
const wordCol = [
  { name: 'school', field: 'school', label: '学校' },
  { name: 'college', field: 'college', label: '学院' },
  { name: 'identify', field: 'identify', label: '身份' },
  { name: 'name', field: 'name', label: '真实姓名' },

  { name: 'title', field: 'title', label: '标题' },
  { name: 'author', field: 'author', label: '作者' },
  { name: 'filename', field: 'filename', label: '文件名称' },
  { name: 'operation', field: 'operation', label: '操作' },
]

const search = ref('')
const loading = ref(false)
const baseOptions: IQueryDto<IVerificationHistory> = {
  pagination: {
    page: 0,
    pageSize: PAGINATION_SIZE_MAX,
  },
  filters: [],
  sort: [],
  relations: {
    user: { verification: true },
  },
}

function downloadFile(id: string) {
  return getUrlByToken(`work/file/${id}`)
}

async function fetchQuery(options: any) {
  loading.value = true
  const res = await queryList(options).finally(() => {
    loading.value = false
  })
  workRows.value = res.data.map((item) => {
    return {
      ...item,
      operation: '',
      school: item.user.verification.school,
      name: item.user.verification.name,
      college: item.user.verification.college,
      identify: item.user.verification.identify,
    }
  })
}

onMounted(async () => {
  await fetchQuery(baseOptions)
})

watch(search, (val) => {
  const newOptions = {
    ...baseOptions,

  }
  if (val) {
    newOptions.filters = [
      {
        field: 'author',
        type: 'LIKE',
        value: val,
      },
    ]
  }
  else {
    newOptions.filters = []
  }

  fetchQuery(newOptions)
})
</script>

<template>
  <div>
    <BaseTable
      v-slot="{ col, props }"
      v-model:search="search "
      :cols="wordCol"
      :rows="workRows"
      :loading="loading"
      :operation="['search']"
    >
      <div v-if="col === 'operation'">
        <a :href="downloadFile(props.row.id)" download>
          <q-btn text-primary-1 label="下载" />
        </a>
      </div>
      <div v-else>
        {{ props.row[`${col}`] }}
      </div>
    </BaseTable>
  </div>
</template>

<style lang="">

</style>

<route lang="yaml">
meta:
  layout: home
</route>
