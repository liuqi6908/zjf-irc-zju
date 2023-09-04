<script setup lang="ts">
import { PAGINATION_SIZE_MAX, VerificationStatus } from 'zjf-types'
import type { IQueryDto, IVerificationHistory } from 'zjf-types'
import { computed, reactive, ref, watch } from 'vue'

import { cloneDeep } from 'lodash-es'
import { queryAllApply } from '../../api/verification/queryAllApply'
import type { Rows } from '../../view/user/Verify.vue'
import Verify from '../../view/user/Verify.vue'

// data
const tabsList = reactive<Array<{ label: string; id: string;isRequest: boolean; rows?: Rows[] }>>([
  {
    label: '所有申请用户',
    id: 'founder',
    isRequest: false,
    rows: [],
  },
  { label: '待审核', id: VerificationStatus.PENDING, isRequest: false, rows: [] },
  { label: '已认证', id: VerificationStatus.APPROVED, isRequest: false, rows: [] },
  { label: '驳回记录', id: VerificationStatus.REJECTED, isRequest: false, rows: [] },
])

const tab = ref(tabsList[0].id)

const baseQuery = ({
  page: 0,
  pageSize: PAGINATION_SIZE_MAX,
  filters: [],
  sort: [],
  relations: {
    founder: { verification: true },
  },
}) as IQueryDto<IVerificationHistory>

const queryFormat = computed(() => {
  const status = findCurrentTab(tab.value)?.id
  if (status === 'founder')
    return baseQuery
  return formatFilter({ status })
})

function formatFilter(options: { status?: VerificationStatus }) {
  const filterQuery = cloneDeep(baseQuery)
  if (options.status) {
    filterQuery.filters?.push({
      field: 'status',
      type: '=',
      value: options.status,
    })
    return filterQuery
  }
}

function findCurrentTab(tab: string) {
  return tabsList.find(i => i.id === tab)
}

function changeTab(t: string) {
  const obj = findCurrentTab(t)
  if (!obj)
    return
  obj.isRequest = true
}

function handleField(tab: string) {
  if (tab === VerificationStatus.PENDING)
    return '通过/驳回'

  else if (tab === VerificationStatus.APPROVED)
    return '重置'
  else if (tab === VerificationStatus.REJECTED)
    return '通过'
}

async function queryAllList() {
  const currentObj = findCurrentTab(tab.value)
  if (currentObj?.isRequest)
    return

  const res = await queryAllApply(queryFormat.value)
  const currentRow = currentObj?.rows

  res.data.forEach((data) => {
    if (!currentRow)
      return
    currentRow.push({
      user: data.founder.account,
      name: data.name,
      email: data.founder.email,
      school: data.school,
      college: data.college,
      identify: data.identify,
      registerTime: data.founder.createdAt,
      verifyTime: data.updatedAt,
      attachments: data.attachments,
      handle: handleField(tab.value),
      id: data.id,
      idCard: data.idCard,
      founderId: data.founderId,
    })
  })
}

watch(tab, () => {
  if (!tab.value)
    return
  queryAllList()
  changeTab(tab.value)
}, { immediate: true })
</script>

<template>
  <div class="fit">
    <header>
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab
          v-for="t in tabsList"
          :key="t.id"
          :label="t.label"
          :name="t.id"
        />
      </q-tabs>
    </header>
    <q-tab-panels v-model="tab" animated bg-grey-2>
      <q-tab-panel :name="tab">
        <KeepAlive>
          <Verify :rows="findCurrentTab(tab)?.rows" :current-tab="tab" @update:request="queryAllList()" />
        </KeepAlive>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
