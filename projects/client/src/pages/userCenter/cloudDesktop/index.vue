<script setup lang="ts">
import { type IDesktop, type IQueryConfig, PAGINATION_SIZE_MAX } from 'zjf-types'
import { Notify } from 'quasar'

import moment from 'moment'
import DesktopTable from '../../../view/userCenter/myDesktop/DesktopTable.vue'
import { desktopQueryList } from '~/api/desktop/desktopsList'
import { getOwnDesktopQuery } from '~/api/desktop/getOwnDesktopQuery'
import { openDesktop } from '~/api/desktopVm/openDesktop'
import { resetDesktop } from '~/api/desktopVm/resetDesktop'
import { closeDesktop } from '~/api/desktopVm/closeDesktop'
import type { VMBaseInfo } from '~/api/desktopVm/getDesktopVmStatus'
import { getDesktopVmStatus } from '~/api/desktopVm/getDesktopVmStatus'

import Empty from '~/components/empty/Empty.vue'

import DesktopStatus from '~/view/userCenter/myDesktop/DesktopStatus.vue'
import Cloud from '~/view/request/cloud/Cloud.vue'

const { userInfo, useGetProfile } = useUser()

const router = useRouter()

const desktopInfo = ref([])
const vmInfoCol = ref([])
const vmStatus = ref('')
const loading = ref(false)

const desktopStatus = reactive({
  status: '',
  queueLength: '',
  laseRejected: '',
  duration: '',
})

const baseOpts: IQueryConfig<IDesktop> = {
  pagination: {
    page: 0,
    pageSize: PAGINATION_SIZE_MAX,
  },
  filters: [],
  sort: [],
  relations: {
    user: { desktop: true },
  },
}

const desktopCol = [
  { name: 'account', label: '云桌面账号' },
  { name: 'password', label: '云桌面密码' },
  { name: 'accessUrl', label: '云桌面访问地址' },
]
const desktopBaseCol = [
  { name: 'baseInfo', label: '基本信息' },
]

const baseInfoFeild: Record<keyof VMBaseInfo, { label: string; value: string }> = reactive({
  uuid: { label: 'UUID', value: '' },
  platform: { label: '平台', value: '' },
  architecture: { label: 'CPU架构', value: '' },
  hypervisorType: { label: '虚拟机类型', value: '' },
  memorySize: { label: '内存', value: '' },
  cpuNum: { label: 'CPU', value: '' },
  lastOpDate: { label: '最后操作时间', value: '' },
  state: { label: '启用状态', value: '' },
  guestOsType: { label: '操作系统', value: '' },
})

const desktopRow = computed(() => {
  if (desktopInfo.value)
    return desktopInfo.value
  return []
})
const desktopId = computed(() => {
  if (desktopInfo.value && desktopInfo.value?.length)
    return desktopInfo.value[0].id
})

const userID = computed(() => {
  if (userInfo.value)
    return userInfo.value.id
})

async function startDesktop(id: string) {
  const res = await openDesktop(id)
  if (res)
    desktopSuccessNotify('启动')
}
async function restartDesktop(id: string) {
  const res = await resetDesktop(id)
  if (res)
    desktopSuccessNotify('重启')
}

async function shutdownDesktop(id: string) {
  const res = await closeDesktop(id)
  if (res)
    desktopSuccessNotify('关闭')
}

function desktopSuccessNotify(message: string) {
  Notify.create({
    message: `云桌面${message}成功`,
    type: 'success',
  })
}

onMounted(() => {

})

onMounted(async () => {
  loading.value = true
  const deskStatus = await getOwnDesktopQuery()

  if (deskStatus) {
    const { laseRejected, queueLength } = deskStatus

    desktopStatus.laseRejected = laseRejected
    desktopStatus.queueLength = queueLength
    if (deskStatus.queue) {
      const { status, duration } = deskStatus.queue
      desktopStatus.status = status
      desktopStatus.duration = duration
    }
  }

  const options = { ...baseOpts }

  let value = ''

  await useGetProfile().finally(() => {
    if (userInfo.value)
      value = userInfo.value.id
  })

  options.filters = [
    {
      field: 'user.id',
      type: '=',
      value,
    },
  ]
  // }
  const res = await desktopQueryList(options)

  if (res && res.data.length)
    desktopInfo.value = res.data.map(item => item)

  const vmInfo = await getDesktopVmStatus(desktopId.value).finally(() => {
    loading.value = false
  })

  if (vmInfo) {
    vmStatus.value = vmInfo.state

    for (const item in vmInfo) {
      const field = baseInfoFeild[`${item}` as keyof VMBaseInfo]

      if (item === 'lastOpDate')
        vmInfo[item] = moment(new Date(vmInfo[item])).format('YYYY-MM-DD HH:mm')

      else if (item === 'cpuNum')
        vmInfo[item] = `${vmInfo[item]} 核`

      field.value = `${vmInfo[item]}`

      vmInfoCol.value.push({
        baseInfo: `<span w-25 class="row">${field.label}:</span>  <span>${field.value}</span>`,
      })
    }
  }
})
</script>

<template>
  <div min-h-2xl>
    <div v-if="loading" full flex-center>
      <q-spinner
        color="primary-1"
        size="5rem"
        :thickness="2"
        label-class="text-primary-1"
        label-style="font-size: 1.1em"
      />
    </div>

    <div v-else-if="desktopInfo && desktopInfo.length">
      <header flex="~ row justify-between">
        <DesktopStatus :status="desktopStatus.status" :duration="desktopStatus.duration" />
        <div flex="~ row gap-5">
          <Btn label="开机" :disable="baseInfoFeild.state.value === 'Running'" @click="startDesktop(desktopId)" />
          <Btn label="关机" :disable="baseInfoFeild.state.value === 'Stopped'" @click="shutdownDesktop(desktopId)" />
          <Btn label="重启" :disable="baseInfoFeild.state.value !== 'Stopped'" @click="restartDesktop(desktopId)" />
        </div>
      </header>
      <DesktopTable
        mt-6 w-full
        class="col-grow"
        :cols="desktopCol"
        :rows="desktopRow"
      />

      <div mt-20 flex="~ row gap-10 items-stretch">
        <DesktopTable
          align="evenly"
          min-w-lg
          class="col-grow"
          :cols="desktopBaseCol"
          :rows="vmInfoCol"
        />
        <Cloud class="col-grow" :uuid="desktopId" />
      </div>
    </div>

    <div v-else flex="~ col items-center">
      <Empty v-if="desktopStatus.status === 'pending'" label="云桌面审核中" />
      <Empty v-else-if="desktopStatus.laseRejected" label="您的申请已被驳回" />
      <EmptyCloud v-else label="您还未申请云桌面" />

      <div v-if="desktopStatus.laseRejected" flex-center bg-grey-2 p-4>
        <span text-grey-8>驳回理由： {{ desktopStatus.laseRejected }}</span>
      </div>

      <Btn mt-10 max-w-40 label="前往申请" @click="() => router.replace({ path: '/request' })">
        <template #icon>
          <div i-material-symbols:arrow-forward />
        </template>
      </Btn>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: userCenter
</route>
