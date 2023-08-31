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

const baseInfoFeild: Record<keyof VMBaseInfo, string> = {
  uuid: 'UUID',
  platform: '平台',
  architecture: 'CPU架构',
  hypervisorType: '虚拟机类型',
  memorySize: '内存',
  cpuNum: 'CPU',
  lastOpDate: '最后操作时间',
  state: '启用状态',
  guestOsType: '操作系统',
}

const desktopRow = computed(() => {
  if (desktopInfo.value)
    return desktopInfo.value
  return []
})
const desktopId = computed(() => {
  if (desktopInfo.value && desktopInfo.value?.length)
    return desktopInfo.value[0].id
})

// function pllApi(url: string) {
//   if (pollCount.value >= 4)
//     return

//   $http.get(url).then((res) => {
//     if (res)
//       return

//     pollCount.value++
//     setTimeout(pllApi(url), 1000)
//   }).catch((err) => {
//     console.error({ err })
//     pollCount.value++
//   })
// }

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

onMounted(async () => {
  const deskStatus = await getOwnDesktopQuery()

  if (deskStatus) {
    const { laseRejected, queueLength } = deskStatus

    const { status, duration } = deskStatus.queue
    desktopStatus.status = status
    desktopStatus.duration = duration
    desktopStatus.laseRejected = laseRejected
    desktopStatus.queueLength = queueLength
  }

  const options = { ...baseOpts }
  if (!userInfo.value) {
    useGetProfile()
    desktopInfo.value = []
  }
  else {
    options.filters = [
      {
        field: 'user.id',
        type: '=',
        value: userInfo.value.id,
      },
    ]
  }

  const res = await desktopQueryList(options)

  if (res && res.data.length)
    desktopInfo.value = res.data.map(item => item)

  const vmInfo = await getDesktopVmStatus(desktopId.value)

  if (vmInfo) {
    vmStatus.value = vmInfo.state

    for (const item in vmInfo) {
      const field = baseInfoFeild[`${item}` as keyof VMBaseInfo]

      if (item === 'lastOpDate')
        vmInfo[item] = moment(new Date(vmInfo[item])).format('YYYY-MM-DD HH:mm')

      else if (item === 'cpuNum')
        vmInfo[item] = `${vmInfo[item]} 核`

      vmInfoCol.value.push({
        baseInfo: `${field} : ${vmInfo[item]}`,
      })
    }
  }
})
</script>

<template>
  <div min-h-2xl>
    <div v-if="desktopInfo && desktopInfo.length">
      <header flex="~ row justify-between">
        <DesktopStatus :status="desktopStatus.status" :duration="desktopStatus.duration" />
        <div flex="~ row gap-5">
          <Btn label="开机" @click="startDesktop(desktopId)" />
          <Btn label="关机" @click="shutdownDesktop(desktopId)" />
          <Btn label="重启" @click="restartDesktop(desktopId)" />
        </div>
      </header>
      <DesktopTable
        mt-6 w-full
        class="col-grow"
        :cols="desktopCol"
        :rows="desktopRow"
      />

      <div mt-20 flex="~ row gap-10">
        <DesktopTable
          min-w-lg
          class="col-grow"
          :cols="desktopBaseCol"
          :rows="vmInfoCol"
        />
        <Cloud class="col-grow" :uuid="desktopId" />
      </div>
    </div>
    <div v-else flex="~ col items-center">
      <Empty v-if="desktopStatus.laseRejected" label="您的申请已被驳回" />
      <Empty v-else-if="desktopStatus.status === 'pending'" label="云桌面审核中" />

      <div v-if="desktopStatus.laseRejected" flex-center bg-grey-2>
        <span text-grey-8>{{ desktopStatus.laseRejected }}</span>
      </div>

      <Btn mt-10 max-w-40 label="前往申请" @click="() => router.replace({ path: '/request' })" />
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: userCenter
</route>
