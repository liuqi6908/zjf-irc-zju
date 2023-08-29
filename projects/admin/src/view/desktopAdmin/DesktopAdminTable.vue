<script lang="ts" setup>
import { Notify, type QTableProps, useQuasar } from 'quasar'
import { ref } from 'vue'
import moment from 'moment'
import BaseTable from '../../components/table/BaseTable.vue'

import { approveDesktop } from '~/api/desktopRequest/approveDesktop'
import { rejectDesktop } from '~/api/desktopRequest/rejectDesktop'
import { createDesktop } from '~/api/desktop/createDesktop'
import { stopDesktop } from '~/api/desktop/stopDesktop'
import { updateDesktop } from '~/api/desktop/updateDesktop'
import { assignDesktop } from '~/api/desktop/assignDesktop'
import { getUrlByToken } from '~/api/file/getUrl'

interface Props {
  tab: string
  rows: Array<any>
  cols: QTableProps['columns']
  queueingList: Array<any>
}
const props = defineProps<Props>()
const emits = defineEmits(['update:rows', 'update:desktopSelect', 'update:request'])

const { $getUri } = useRequest()
const baseTableRef = ref(null)
const rejectDialog = ref(false)
const tableRef = ref()
const userConfigDialog = ref(false)
const userConfigInfo = reactive({
  selectUserId: [],
  desktopId: '',
})

const userInfo = reactive({
  userId: '',
  reason: '',
})

const $q = useQuasar()

const input = ['id', 'internalIp', 'accessUrl', 'account', 'password']

const select = ['expiredAt']

const userConfigCol = [
  { name: 'name', field: 'name', label: '真实姓名', align: 'center' },
  { name: 'nickname', field: 'nickname', label: '昵称', align: 'center' },
  { name: 'email', field: 'email', label: '邮箱', align: 'center' },
  { name: 'duration', field: 'duration', label: '申请时长（天）', align: 'center' },
]

const userConfigTable = computed(() => {
  const row = props.queueingList.map((item) => {
    return {
      name: item.user?.verification?.name,
      email: item.user?.email,
      nickname: item.user?.nickname,
      id: item?.userId,
      duration: item?.duration,
    }
  })

  return {
    row,
    col: userConfigCol,
  }
})

async function accessRequest(userId: any) {
  $q.dialog({
    message: '确认通过申请？',
    cancel: true,
  }).onOk(async () => {
    const res = await approveDesktop(userId)
    emits('update:request')
  }).onCancel(() => {})
}

async function rejectRequest(userId: any) {
  rejectDialog.value = true
  userInfo.userId = userId
  // const res = await rejectDesktop(userId)
}

async function confirmReason() {
  const res = await rejectDesktop(userInfo.userId, userInfo.reason)
  emits('update:request')
}

async function createChanges(options: any) {
  const { id, internalIp, accessUrl, account, password, expiredAt } = options
  const formatData = dataFormat(expiredAt)
  $q.dialog({
    message: '确认创建云桌面？',
    cancel: true,
  }).onOk(async () => {
    const res = await createDesktop({ id, internalIp, accessUrl, account, password, formatData })
    if (res)
      notifySuccess('创建云桌面')
    emits('update:desktopSelect')
  })
}

async function endDesktop(id: any) {
  $q.dialog({
    message: '确认停用云桌面？',
    cancel: true,
  }).onOk(async () => {
    const res = await stopDesktop(id)
    emits('update:desktopSelect')
    if (res)
      notifySuccess('云桌面到期修改')
  })
}

async function updateDesktops(row: any) {
  let { id, internalIp, accessUrl, account, password, expiredAt } = row
  expiredAt = dataFormat(expiredAt)
  $q.dialog({
    message: '确认更新云桌面？',
    cancel: true,
  }).onOk(async () => {
    if (userConfigInfo.selectUserId[0]?.id) {
      const res = await assignDesktop(id, userConfigInfo.selectUserId[0]?.id)
    }
    const res = await updateDesktop(id, { internalIp, accessUrl, account, password, expiredAt })

    emits('update:desktopSelect')
    if (res)
      notifySuccess('云桌面更新')
  }).onCancel(() => {})
}

function dataFormat(date: string) {
  const format = 'YYYY-MM-DD HH:mm:ss'
  return moment(date, format).toDate()
}

function userConfig(row: any) {
  userConfigDialog.value = true
  userConfigInfo.desktopId = row.id
}

// async function assignDesktopUser() {
//   userConfigDialog.value = false

//   if (res)
//     notifySuccess('分配用户')
// }

function checkAttachments(row: any) {
  let imgHtml = ''

  for (const img of row.attachments) {
    const src = getUrlByToken(`file/private/desktop-request/${row.userId}/${img}`)
    imgHtml += `<img src=${src} /><br/><a href=${src} download>下载链接</a>`
  }

  $q.dialog({
    html: true,
    message: imgHtml,
    title: '查看申请材料',
  })
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
      <q-btn color="primary-1" flat label="查看申请材料" @click="checkAttachments(props.row)" />
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
    <div v-else-if="col === 'disabled'">
      {{ props.row[`${col}`] ? '已停用' : '使用中' }}
    </div>

    <div v-else-if="col === 'choseUser'">
      <q-btn :disable="props.row.opSaveChangeExpires !== true" flat text-primary-1 label="选择用户" @click="userConfig(props.row)" />
    </div>

    <div v-else-if="col === 'opSaveChangeExpires'">
      <BtnGroup
        v-if="props.row[`${col}`] === true"
        :types="['stop', 'save']"
        @update:stop="endDesktop(props.row.id)"
        @update:save="updateDesktops(props.row)"
      />
      <q-btn
        v-else
        label="保存创建的云桌面"
        color="teal"
        @click="createChanges(props.row)"
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

  <q-dialog v-model="userConfigDialog">
    <q-card min-w-2xl bg-grey-1 p-5>
      <header mb-10 text-6 font-500>
        待分配的用户
      </header>

      <q-table
        ref="tableRef"
        v-model:selected="userConfigInfo.selectUserId"
        flat bordered max-h-lg
        :rows="userConfigTable.row"
        :columns="userConfigCol"
        row-key="id"
        selection="single"
      >
        <template #body-selection="scope">
          <q-checkbox
            :model-value="scope.selected"
            @update:model-value="(val, evt) => { Object.getOwnPropertyDescriptor(scope, 'selected').set(val, evt) }"
          />
        </template>
      </q-table>

      <footer mt-5 flex="~ row justify-end">
        <q-btn flat text-alert-error label="取消" @click="userConfigDialog = false" />
        <q-btn label="确认选择" flat text-primary-1 @click="userConfigDialog = false" />
      </footer>
    </q-card>
  </q-dialog>
</template>
