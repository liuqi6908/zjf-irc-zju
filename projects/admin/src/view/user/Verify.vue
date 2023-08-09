<script lang="ts" setup>
import moment from 'moment'

import type { QTableProps } from 'quasar'
import { approveApply } from '~/api/verification/approveApply'
import { rejectApply } from '~/api/verification/rejectApply'
import { resetApply } from '~/api/verification/resetApply'

export interface Rows {
  user: string
  name: string
  email: string
  unit: string
  identify: string
  registerTime: string
  verifyTime: string
  attachments: []
  handle: '确认' | '驳回' | '确认/驳回'
}

interface Props {
  rows: Rows[]
}

const props = defineProps<Props>()

const verifyId = ref('')
const reason = ref('')
const tab = ref('confirm')
const dialogShow = ref(false)
const fileDialog = ref(false)

const columns = [
  {
    name: 'user',
    required: true,
    label: '用户',
    align: 'left',
    field: 'user',
    sortable: true,
  },
  { name: 'name', align: 'center', label: '真实姓名', field: 'name', sortable: true },
  { name: 'email', label: '邮箱', field: 'email', sortable: true },
  { name: 'unit', label: '单位', field: 'unit' },
  { name: 'identify', label: '身份', field: 'identify' },
  {
    name: 'registerTime',
    label: '注册时间',
    field: 'registerTime',
    required: true,
  },
  { name: 'verifyTime', label: '认证时间', field: 'verifyTime' },
  { name: 'attachments', label: '认证材料', field: 'attachments' },
  { name: 'handle', label: '操作', field: 'handle' },
] as QTableProps['columns']

// const rows = [
//   {
//     user: 'Frozen Yogurt',
//     name: 159,
//     email: 6.0,
//     unit: 24,
//     identify: 4.0,
//     registerTime: 87,
//     verifyTime: '14%',
//     attachments: '1%',
//     handle: '驳回',
//   },
// ]

function momentTime(name: string, row: string) {
  if (name === 'registerTime' || name === 'verifyTime')
    return moment(row).format('YYYY-MM-DD HH:mm:ss')
  else
    return row
}

function onRowClick(field: string, row: any) {
  // console.log(row.id)
  // eslint-disable-next-line max-statements-per-line
  if (field === 'attachments') { fileDialog.value = true }
  else if (field === 'handle' || row.handle) {
    dialogShow.value = true
    verifyId.value = row.id

    if (row.handle === '重置')
      tab.value = 'reset'
  }
}

async function confirm() {
  if (verifyId.value)
    await approveApply(verifyId.value)
}

async function reject() {
  if (!verifyId.value && !reason.value)
    return

  await rejectApply(verifyId.value, reason.value)
}
async function reset() {
  if (!verifyId.value)
    return
  await resetApply(verifyId.value)
}
</script>

<template>
  <div>
    <q-table
      flat
      bordered
      :rows="rows"
      :columns="columns"
      row-key="name"
    >
      <template #body="props">
        <q-tr :props="props">
          <q-td v-for="r in columns" :key="r.name" :props="props" @click="onRowClick(r.field, props.row)">
            {{ momentTime(r.name, props.row[r.name]) }}
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <q-dialog v-model="dialogShow">
      <q-card min-h-xs min-w-xs flex flex-col p-4>
        <header flex="~ row justify-end">
          <q-btn v-close-popup flat dense round>
            <div i-mingcute:close-line />
          </q-btn>
        </header>
        <q-tab-panels v-model="tab">
          <q-tab-panel name="confirm">
            <q-card-section class="col-grow" flex="~ col justify-end">
              <q-btn mb-2 font-500 text-grey-1 color="green" @click="confirm">
                通过审核
              </q-btn>
              <q-btn mt-10 font-500 text-grey-1 color="red" @click="tab = 'reject'">
                驳回审核
              </q-btn>
            </q-card-section>
          </q-tab-panel>

          <q-tab-panel name="reject">
            <q-card-section class="col-grow" flex="~ col justify-end">
              <q-input v-model="reason" label="请填写驳回理由" />
              <q-btn mt-10 font-500 text-grey-1 color="red" @click="reject">
                驳回审核
              </q-btn>
            </q-card-section>
          </q-tab-panel>

          <q-tab-panel name="reset">
            <q-card-section class="col-grow" flex="~ col justify-end">
              <q-btn mb-2 font-500 text-grey-1 color="orange" @click="reset">
                重置
              </q-btn>
            </q-card-section>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </q-dialog>

    <q-dialog v-model="fileDialog">
      img
    </q-dialog>
  </div>
</template>

<style lang="">

</style>
