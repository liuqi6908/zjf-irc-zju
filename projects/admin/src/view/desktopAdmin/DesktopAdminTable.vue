<script lang="ts" setup>
import { Notify, type QTableProps } from 'quasar'
import { ref } from 'vue'
import moment from 'moment'
import BaseTable from '../../components/table/BaseTable.vue'

import { approveDesktop } from '~/api/desktopRequest/approveDesktop'
import { rejectDesktop } from '~/api/desktopRequest/rejectDesktop'
import { createDesktop } from '~/api/desktop/createDesktop'
import { stopDesktop } from '~/api/desktop/stopDesktop'
import { updateDesktop } from '~/api/desktop/updateDesktop'

interface Props {
  tab: string
  rows: Array<any>
  cols: QTableProps['columns']
}
defineProps<Props>()
defineEmits(['update:rows'])

const baseTableRef = ref(null)
const rejectDialog = ref(false)
const userInfo = reactive({
  userId: '',
  reason: '',
})

const input = ['id', 'internalIp', 'accessUrl', 'account', 'password']

const select = ['expiredAt']

async function accessRequest(userId: any) {
  const res = await approveDesktop(userId)
}

async function rejectRequest(userId: any) {
  rejectDialog.value = true
  userInfo.userId = userId
  // const res = await rejectDesktop(userId)
}

async function confirmReason() {
  const res = await rejectDesktop(userInfo.userId, userInfo.reason)
}

async function createChanges(options: any) {
  const { id, internalIp, accessUrl, account, password, expiredAt } = options
  const formatData = dataFormat(expiredAt)
  const res = await createDesktop({ id, internalIp, accessUrl, account, password, formatData })
  if (res)
    notifySuccess('创建云桌面')
}

async function endDesktop(row: any) {
  const { id } = row
  const res = await stopDesktop(id)
  if (res)
    notifySuccess('云桌面到期修改')
}

async function updateDesktops(row: any) {
  const { id, internalIp, accessUrl, account, password, expiredAt } = row
  const formatDate = dataFormat(expiredAt)
  const res = await updateDesktop(id, { internalIp, accessUrl, account, password, formatDate })

  if (res)
    notifySuccess('云桌面更新')
}

function dataFormat(date: string) {
  const format = 'YYYY-MM-DD HH:mm:ss'
  return moment(date, format).toDate()
}

function notifySuccess(message: string) {
  Notify.create({
    message: `${message}成功`,
    type: 'success',
  })
}
</script>

<template>
  <BaseTable
    ref="baseTableRef"
    v-slot="{ props, col }"
    :operation="tab === 'desktopAssign' ? ['addRows'] : []"
    :rows="rows"
    :cols="cols"
    @update:rows="(val) => $emit('update:rows', val)"
  >
    <div v-if="col === 'operation'">
      <BtnGroup
        :types="['reject', 'access']"
        @update:access="accessRequest(props.row.user.id)"
        @update:reject="rejectRequest(props.row.user.id)"
      />
    </div>
    <div v-else-if="col === 'attachments'">
      查看申请材料
    </div>
    <div v-else-if="col === 'createdAt'">
      {{ moment(props.row[`${col}`]).format('YYYY-MM-DD HH:mm:ss') }}
    </div>

    <div v-else-if="input.includes(col)">
      <q-input v-model="props.row[`${col}`]" min-w-20 />
    </div>

    <div v-else-if="select.includes(col)">
      <q-input v-model="props.row[`${col}`]" filled>
        <template #prepend>
          <div i-material-symbols:calendar-month-outline class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-date v-model="props.row[`${col}`]" mask="YYYY-MM-DD HH:mm" />
            </q-popup-proxy>
          </div>
        </template>
      </q-input>
    </div>

    <div v-else-if="col === 'choseUser'">
      <q-btn flat text-primary-1 label="选择用户" @click="userConfig" />
    </div>
    <div v-else-if="col === 'opSaveChangeExpires'">
      <BtnGroup
        v-if="props.row[`${col}`]"
        :types="['expired', 'change']"
        @update:expired="endDesktop(props.row.id)"
        @update:change="updateDesktops(props.row)"
      />
      <BtnGroup
        v-else
        :types="['save']"
        @update:save="createChanges(props.row)"
      />
    </div>

    <div v-else>
      {{ props.row[`${col}`] }}
    </div>
  </BaseTable>

  <q-dialog v-model="rejectDialog">
    <q-card min-w-2xl p-10>
      <q-input v-model="userInfo.reason" label="请填写驳回理由" />
      <div mt-20 flex="~ row justify-end gap-10">
        <q-btn label="确认" flat text-primary-1 @click="confirmReason" />
        <q-btn v-close-popup flat label="取消" text-alert-error />
      </div>
    </q-card>
  </q-dialog>
</template>
