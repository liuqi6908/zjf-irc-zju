<script lang="ts" setup>
import moment from 'moment'
import { cloneDeep } from 'lodash-es'

import { Notify, type QTableProps } from 'quasar'

import { approveApply } from '~/api/verification/approveApply'
import { rejectApply } from '~/api/verification/rejectApply'
import { resetApply } from '~/api/verification/resetApply'
import { getVerifyFileUrl } from '~/api/file/getVerifyFile'

export interface Rows {
  user: string
  name: string
  email: string
  unit: string
  identify: string
  registerTime: string
  verifyTime: string
  attachments: []
  handle?: '重置' | '确认/驳回'
}

interface RowsData extends Rows {
  attachmentsList: string[]
}

interface Props {
  rows: Rows[]
  currentTab: string
}

const props = defineProps<Props>()

const verifyId = ref('')
const reason = ref('')
const tab = ref('confirm')

const dialogShow = ref(false)
const fileDialog = ref(false)

let clickedRow = reactive<RowsData>({})

const columns = [
  {
    name: 'user',
    required: true,
    label: '用户',
    align: 'left',
    field: 'user',
    sortable: true,
  },
  { name: 'name', align: 'left', label: '真实姓名', required: true, field: 'name', sortable: true },
  { name: 'email', align: 'left', label: '邮箱', field: 'email', sortable: true, required: true },
  { name: 'unit', align: 'left', label: '单位', field: 'unit', required: true },
  { name: 'identify', align: 'left', label: '身份', field: 'identify', required: true },
  {
    name: 'registerTime',
    align: 'left',
    label: '注册时间',
    field: 'registerTime',
    required: true,
  },
  { name: 'verifyTime', align: 'left', label: '认证时间', field: 'verifyTime', required: true },
  { name: 'attachments', align: 'left', label: '认证材料', field: 'attachments', required: true },
  { name: 'handle', align: 'left', label: '操作', field: 'handle' },

] as QTableProps['columns']

const visibleHandler = computed<Array<string>>(() => {
  if (props.currentTab === 'founder')
    return []
  else
    return ['handle']
})

function momentTime(name: string, row: string) {
  if (name === 'registerTime' || name === 'verifyTime')
    return moment(row).format('YYYY-MM-DD HH:mm:ss')
  else
    return row
}

function onRowClick(field: string, row: any) {
  clickedRow = cloneDeep(row)
  clickedRow.attachmentsList = []

  if (field === 'attachments') {
    fileDialog.value = true
    for (const i in row.attachments) {
      const url = getVerifyFileUrl(row.founderId, row.attachments[i])
      clickedRow.attachmentsList.push(url)
    }
  }
  else if (field === 'handle' && row.handle) {
    dialogShow.value = true
    verifyId.value = row.id

    if (row.handle === '重置')
      tab.value = 'reset'
  }
}

async function confirm() {
  if (verifyId.value) {
    const res = await approveApply(verifyId.value)
    notify(res)
  }
}

async function reject() {
  if (!verifyId.value && !reason.value)
    return
  const res = await rejectApply(verifyId.value, reason.value)
  notify(res)
}

async function reset() {
  if (!verifyId.value)
    return
  const res = await resetApply(verifyId.value)
  notify(res)
}
// async function fetchFile(userId: string, filename: string) {
//   const res =  getVerifyFileUrl(userId, filename)
//   // console.log('btoa', window.btoa(encodeURIComponent(res)))
//   imageData.value = `data:image/png;base64,${window.btoa(encodeURIComponent(res))}`
//   // imgShow.value?.onload=function()
//   // console.log({ imageData }, btoa(unescape(encodeURIComponent(res))))
// }

function notify(judge: any, event?: any) {
  if (judge) {
    Notify.create({
      type: 'success',
      message: '修改成功',
    })
  }
  else {
    Notify.create({
      type: 'error',
      message: '修改失败',
    })
  }
}
</script>

<template>
  <div>
    <q-table
      flat
      bordered
      :rows="rows"
      :columns="columns"
      :visible-columns="visibleHandler"
      row-key="name"
    >
      <template #body="props">
        <q-tr :props="props">
          <q-td v-for="r in columns" :key="r.name" :props="props" @click="onRowClick(r.field, props.row)">
            {{ r.name === 'attachments' ? '查看认证材料' : momentTime(r.name, props.row[r.name]) }}
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
      <q-card min-h-xs min-w-xs flex flex-col p-4>
        <header flex="~ row justify-end">
          <q-btn v-close-popup flat dense round>
            <div i-mingcute:close-line />
          </q-btn>
        </header>

        <q-card-section flex flex-col gap-10>
          <div v-if="(clickedRow.attachments.length === 0)">
            没有数据
          </div>
          <div v-for="(url, index) in clickedRow.attachmentsList" v-else :key="index" min-w-lg flex="~ row">
            <q-img
              mr-xl
              fit="contain"
              :src="url"
              style="height: 140px; max-width: 400px"
            />

            <a :href="url" download><q-btn color="teal">下载</q-btn></a>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<style lang=" " push>

</style>
