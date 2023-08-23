<script lang="ts" setup>
import BaseTable from 'shared/component/base/table/BaseTable.vue'

const historyCol = [
  {
    name: 'filename',
    label: '文件名',
    field: 'filename',
    align: 'center',
  },
  {
    name: 'email',
    label: '邮箱地址',
    field: 'email',
    align: 'center',
  },
  {
    name: 'remark',
    label: '备注信息',
    field: 'remark',
    align: 'center',
  },
  {
    name: 'filesize',
    label: '文件名',
    field: 'filesize',
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
    name: 'outgoing',
    label: '外发',
    field: 'outgoing',
    align: 'center',
  },
]
const select = ref()
const seachFilename = ref('')
const selectList = ref([
  { label: '已完成', id: 'success' },
  { label: '失败', id: 'error' },
  { label: '审核中', id: 'pending' },
])
</script>

<template>
  <div p-5>
    <header flex="~ row justify-between items-center" mb-5>
      <div text-4 font-600 text-grey-8>
        外发记录
      </div>

      <!-- <div flex="~ row items-center gap-2">
        <span text-grey-8>筛选标签</span>
        <HistoryStatus status="error" />
      </div> -->
      <div flex="~ row gap-5">
        <ZSelect
          v-model="select"
          input-debounce="0"

          use-chips multiple min-w-20
          :options="selectList"
        />
        <UserCodeInput v-model:user-code="seachFilename" :dark="false" label="搜索文件名">
          <template #prepend>
            <div i-material-symbols:search-rounded />
          </template>
        </UserCodeInput>
      </div>
    </header>

    <BaseTable :cols="historyCol" />
  </div>
</template>

<style lang="scss">

</style>
