<script lang="ts" setup>
import moment from 'moment'
import { cloneDeep } from 'lodash-es'

import { Notify, type QTableProps, useQuasar } from 'quasar'

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
  handle?: '重置' | '通过/驳回' | '通过'
}

interface RowsData extends Rows {
  attachmentsList: string[]
}

interface Props {
  rows: Rows[]
  currentTab: string
}

const props = defineProps<Props>()
const emits = defineEmits(['update:request'])

const verifyId = ref('')
const reason = ref('')
const $q = useQuasar()

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
  { name: 'school', align: 'left', label: '学校', field: 'school', required: true },
  { name: 'college', align: 'left', label: '学院', field: 'college', required: true },
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

function checkAttachment(row: any) {
  fileDialog.value = true
  clickedRow = cloneDeep(row)
  clickedRow.attachmentsList = []
  for (const i in row.attachments) {
    const url = getVerifyFileUrl(row.founderId, row.attachments[i])
    clickedRow.attachmentsList.push(url)
  }
}

async function approveRequest(row: any) {
  $q.dialog({
    message: '确认通过申请？',
    cancel: true,
  }).onOk(async () => {
    const res = await approveApply(row.id)
    emits('update:request')
  }).onCancel(() => {})
}

function rejectRequest(row: any) {
  verifyId.value = row.id
  dialogShow.value = true
}
async function reject() {
  if (!verifyId.value && !reason.value)
    return
  const res = await rejectApply(verifyId.value, reason.value)
  dialogShow.value = false
  emits('update:request')
  notify(res)
}

async function resetRequest(row: any) {
  $q.dialog({
    message: '确认重置申请？',
    cancel: true,
  }).onOk(async () => {
    const res = await resetApply(row.id)
    notify(res)
    emits('update:request')
  }).onCancel(() => {})
}

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
          <q-td v-for="r in columns" :key="r.name" :props="props">
            <div v-if="r.name === 'handle'">
              <div v-if="props.row.handle === '重置'">
                <q-btn flat label="重置" @click="resetRequest(props.row)" />
              </div>
              <div v-if="props.row.handle === '通过/驳回'">
                <q-btn flat label="通过" color="primary-1" @click="approveRequest(props.row)" />
                <q-btn label="驳回" flat color="red" @click="rejectRequest(props.row)" />
              </div>
              <div v-if="props.row.handle === '通过'">
                <!-- <q-btn flat label="通过" color="primary-1" @click="resetRequest(props.row)" /> -->
              </div>
              <!-- <q-btn flat :label="props.row.handle" @click="onRowClick(r.field, props.row)" /> -->
            </div>
            <div v-else-if="r.name === 'attachments'">
              <q-btn color="primary-1" flat label="查看认证材料" @click="checkAttachment(props.row)" />
            </div>
            <div v-else-if="r.name === 'registerTime' || r.name === 'verifyTime'">
              {{ momentTime(r.name, props.row[r.name]) }}
            </div>
            <div v-else>
              {{ props.row[r.name] }}
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <q-dialog v-model="dialogShow">
      <q-card min-w-xs flex flex-col>
        <q-card-section class="col-grow" flex="~ col justify-end">
          <q-input v-model="reason" label="请填写驳回理由" />
          <div flex="~ row justify-end">
            <q-btn flat mt-10 font-500 color="primary-1" label="确认" @click="reject" />
            <q-btn flat mt-10 font-500 color="red" label="取消" @click="dialogShow = false" />
          </div>
        </q-card-section>
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
