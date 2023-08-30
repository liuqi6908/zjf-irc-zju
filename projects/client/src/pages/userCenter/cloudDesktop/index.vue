<script setup lang="ts">
import { type IDesktop, type IQueryConfig, PAGINATION_SIZE_MAX } from 'zjf-types'
import DesktopTable from '../../../view/userCenter/myDesktop/DesktopTable.vue'
import { desktopQueryList } from '~/api/desktop/desktopsList'
import { getOwnDesktopQuery } from '~/api/desktop/getOwnDesktopQuery'
import { openDesktop } from '~/api/desktopVm/openDesktop'
import { resetDesktop } from '~/api/desktopVm/resetDesktop'
import { closeDesktop } from '~/api/desktopVm/closeDesktop'
import { getDesktopVmStatus } from '~/api/desktopVm/getDesktopVmStatus'

import Empty from '~/components/empty/Empty.vue'

import DesktopStatus from '~/view/userCenter/myDesktop/DesktopStatus.vue'
import Cloud from '~/view/request/cloud/Cloud.vue'

const { userInfo, useGetProfile } = useUser()

const router = useRouter()

const desktopInfo = ref(null)
const vmInfoCol = ref([])
const pollCount = ref(0)

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

const baseInfoFeild = {
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
  // if (res.location)
  //   pllApi(res.location)
}

onMounted(async () => {
  if (!userInfo.value) {
    desktopInfo.value = null
    return
  }

  const deskStatus = await getOwnDesktopQuery()

  if (deskStatus) {
    const { laseRejected, queueLength } = deskStatus

    const { status, duration } = deskStatus.queue
    desktopStatus.status = status
    desktopStatus.duration = duration
    desktopStatus.laseRejected = laseRejected
    desktopStatus.queueLength = queueLength
  }

  const base = { ...baseOpts }
  base.filters = [
    {
      field: 'user.id',
      type: '=',
      value: userInfo.value.id,
    },
  ]

  const res = await desktopQueryList(base)

  desktopInfo.value = res.data.map(item => item)

  const baseInfo = await getDesktopVmStatus(desktopId.value)

  for (const item in baseInfo) {
    const field = baseInfoFeild[`${item}`]
    vmInfoCol.value.push({
      baseInfo: `${field} : ${item}`,
    })
  }
})
</script>

<template>
  <div min-h-2xl>
    <div v-if="!desktopInfo || !desktopInfo.length" flex="~ col items-center">
      <Empty :label="desktopStatus.laseRejected ? '您的申请已被驳回' : '您还未申请云桌面'" />

      <div v-if="desktopStatus.laseRejected" flex-center bg-grey-2>
        <span text-grey-8>{{ desktopStatus.laseRejected }}</span>
      </div>

      <Btn mt-10 max-w-40 label="前往申请" @click="() => router.replace({ path: '/request' })" />
    </div>

    <div v-else>
      <header flex="~ row justify-between">
        <DesktopStatus :status="desktopStatus.status" :duration="desktopStatus.duration" />
        <div flex="~ row gap-5">
          <Btn label="开机" @click="startDesktop(desktopId)" />
          <Btn label="关机" @click="closeDesktop(desktopId)" />
          <Btn label="重启" @click="resetDesktop(desktopId)" />
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
  </div>
</template>

<route lang="yaml">
meta:
  layout: userCenter
</route>
