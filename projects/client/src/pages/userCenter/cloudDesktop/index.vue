<script setup lang="ts">
import { DesktopQueueHistoryStatus, DesktopQueueStatus } from 'zjf-types'
import type { IDesktop } from 'zjf-types'
import { formatFileSize } from 'zjf-utils'
import { Notify } from 'quasar'
import moment from 'moment'

import { desktopQuery } from '~/api/desktop/desktopsQuery'
import { getOwnDesktopQuery } from '~/api/desktop/getOwnDesktopQuery'
import { openDesktop } from '~/api/desktopVm/openDesktop'
import { resetDesktop } from '~/api/desktopVm/resetDesktop'
import { closeDesktop } from '~/api/desktopVm/closeDesktop'
import type { VMBaseInfo } from '~/api/desktopVm/getDesktopVmStatus'
import { getDesktopVmStatus } from '~/api/desktopVm/getDesktopVmStatus'

import DesktopStatus from '~/view/userCenter/myDesktop/DesktopStatus.vue'
import Cloud from '~/view/request/cloud/Cloud.vue'

const { isVerify, useGetProfile, getVerify, latestVerifiy } = useUser()
const $router = useRouter()
const { pause, resume } = useIntervalFn(() => getVmInfo(), 3000, { immediate: false })
const { copy } = useClipboard()

/** 用户认证状态 */
const userStatus = computed(() => latestVerifiy.value?.status)
const loading = ref(false)
/** 云桌面申请信息 */
const requestInfo = reactive({
  status: '',
  queueLength: 0,
  rejectReason: '',
})
/** 云桌面信息 */
const desktopInfo = ref<IDesktop>()
const hidePassword = ref(true)
const desktopTable = computed(() => {
  return [
    { label: '云桌面账号', value: desktopInfo.value?.account },
    { label: '云桌面密码', value: desktopInfo.value?.password, hide: true },
    { label: '云桌面访问地址', value: desktopInfo.value?.accessUrl },
  ]
})
/** 云桌面ID */
const desktopId = computed(() => desktopInfo.value?.id)
/** 到期时间 */
const remainingTime = computed(() => {
  const endTime = desktopInfo.value?.expiredAt
  if (!endTime)
    return 0
  else
    return Math.floor((new Date(endTime).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
})

/** 虚拟机信息 */
const vmInfo: Record<keyof VMBaseInfo, { label: string; value: string }> = reactive({
  state: { label: '启用状态', value: '' },
  hypervisorType: { label: '虚拟机类型', value: '' },
  architecture: { label: 'CPU架构', value: '' },
  cpuNum: { label: 'CPU', value: '' },
  memorySize: { label: '内存', value: '' },
  platform: { label: '平台', value: '' },
  guestOsType: { label: '操作系统', value: '' },
  uuid: { label: 'UUID', value: '' },
  lastOpDate: { label: '最后操作时间', value: '' },
})
/** 虚拟机状态 */
const vmStatus = computed(() => vmInfo.state.value)

onMounted(async () => {
  await useGetProfile()
  if (!isVerify.value)
    return getVerify()

  loading.value = true
  try {
    await getRequestInfo()
    if (requestInfo.status === DesktopQueueStatus.Using) {
      await getDesktopInfo()
      getVmInfo()
      resume()
    }
  }
  catch (_) { }
  finally {
    loading.value = false
  }
})

/**
 * 获取云桌面申请信息
 */
async function getRequestInfo() {
  try {
    const res = await getOwnDesktopQuery()
    if (res) {
      const { lastExpired, lastRejected, queue, queueLength } = res
      requestInfo.status = queue?.status || lastRejected?.status || (lastExpired?.id ? DesktopQueueHistoryStatus.Expired : '')
      requestInfo.queueLength = queueLength || 0
      requestInfo.rejectReason = lastRejected?.rejectReason
    }
    else {
      requestInfo.status = ''
    }
  }
  catch (_) {}
}

/**
 * 获取云桌面信息
 */
async function getDesktopInfo() {
  desktopInfo.value = await desktopQuery()
}

/**
 * 获取虚拟机信息
 */
async function getVmInfo() {
  if (!desktopId.value)
    return
  try {
    const data = await getDesktopVmStatus(desktopId.value)
    if (data) {
      for (const key in data) {
        const obj = vmInfo[key as keyof VMBaseInfo]
        if (key === 'lastOpDate')
          obj.value = moment(data[key]).format('YYYY-MM-DD HH:mm')
        else if (key === 'cpuNum')
          obj.value = `${data[key]} 核`
        else if (key === 'memorySize')
          obj.value = formatFileSize(data[key as keyof VMBaseInfo] as number)
        else if (key === 'state')
          obj.value = vmStatusList.find(v => v.value === data[key])?.label || ''
        else
          obj.value = data[key as keyof VMBaseInfo] as string
      }
    }
  }
  catch (_) {
    pause()
  }
  finally {
    if (vmStatusList.filter(v => v.flag).map(v => v.label).includes(vmStatus.value))
      pause()
  }
}

/**
 * 云桌面操作
 * @param type 操作类型
 */
async function desktopOperate(type: '开机' | '关机' | '重启') {
  if (!desktopId.value)
    return
  loading.value = true
  try {
    let res
    if (type === '开机')
      res = await openDesktop(desktopId.value)
    else if (type === '关机')
      res = await closeDesktop(desktopId.value)
    else if (type === '重启')
      res = await resetDesktop(desktopId.value)
    if (res) {
      Notify.create({
        message: `云桌面正在${type}中`,
        type: 'success',
      })
      getVmInfo()
      resume()
    }
  }
  catch (_) {}
  finally {
    loading.value = false
  }
}

function copyText(text: string) {
  copy(text)
  Notify.create({
    message: '已复制到剪切板',
    type: 'success',
  })
}
</script>

<template>
  <div relative min-h-2xl>
    <!-- 加载中 -->
    <div v-if="loading" full flex-center absolute z-100 style="background: rgba(255, 255, 255, 0.6)">
      <q-spinner
        color="primary-1" size="5rem" :thickness="2" label-class="text-primary-1"
        label-style="font-size: 1.1em"
      />
    </div>
    <!-- 主要内容 -->
    <div v-if="desktopId">
      <!-- 状态及操作 -->
      <header flex="~ row justify-between">
        <DesktopStatus :status="requestInfo.status as DesktopQueueStatus" :duration="remainingTime" />
        <div flex="~ row gap-5" class="desktop-operation-buttons">
          <Btn w28 label="开机" :disable="vmStatus !== '已关机'" @click="desktopOperate('开机')">
            <template #icon>
              <q-icon name="fas fa-power-off" size="16px" relative top="-0.5" ml-2 />
            </template>
          </Btn>
          <Btn w28 label="关机" :disable="vmStatus !== '运行中'" @click="desktopOperate('关机')">
            <template #icon>
              <q-icon name="fas fa-power-off" size="16px" relative top="-0.5" ml-2 />
            </template>
          </Btn>
          <Btn w28 label="重启" :disable="vmStatus !== '运行中'" @click="desktopOperate('重启')">
            <template #icon>
              <q-icon name="fas fa-sync" size="16px" relative top="-0.5" ml-2 />
            </template>
          </Btn>
        </div>
      </header>
      <!-- 云桌面信息 -->
      <div mt-10 w-full flex border="1 solid grey-3" text="base left">
        <div
          v-for="(item, index) in desktopTable"
          :key="index"
          flex="~ 1 col" w-0
          overflow-hidden
          border-b="solid grey-3"
          :style="{
            borderRightWidth: `${index === desktopTable.length - 1 ? 0 : 1}px`,
          }"
        >
          <div overflow-hidden bg-grey-2 px-6 text-ellipsis whitespace-nowrap py-3 v-text="item.label" />
          <div flex justify-between px-6 py-3>
            <div w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap v-text="item.hide && hidePassword ? '********' : item.value" />
            <div flex gap-2 text-grey-4>
              <q-btn v-if="item.hide" :icon="`fas fa-${hidePassword ? 'eye-slash' : 'eye'}`" flat size="sm" px-2 @click="hidePassword = !hidePassword" />
              <q-btn icon="fas fa-clone" flat size="sm" px-2 @click="copyText(item.value || '')" />
            </div>
          </div>
        </div>
      </div>
      <!-- 虚拟机信息 -->
      <div flex mt-20 gap-10 text="base left">
        <!-- 基本信息 -->
        <div flex="~ 1 col" w-0 border="1 solid grey-3">
          <header bg-grey-2 p-4 font-600 v-text="'基本信息'" />
          <div px-4>
            <div
              v-for="(item, index) in vmInfo"
              :key="index"
              flex gap-2.5 py-11.5
              border-b="solid grey-3"
              :style="{
                borderBottomWidth: `${index === Object.keys(vmInfo).pop() ? 0 : 1}px`,
              }"
            >
              <div w-30 v-text="`${item.label}：`" />
              <div flex-1 v-text="item.value" />
            </div>
          </div>
        </div>
        <!-- 监控数据 -->
        <div flex="~ 1 col" w-0 border="1 solid grey-3">
          <header bg-grey-2 p-4 font-600 v-text="'监控数据'" />
          <Cloud :uuid="desktopId" />
        </div>
      </div>
    </div>
    <!-- 未认证/未申请 -->
    <div v-else flex="~ col" items-center gap-10 py-22>
      <!-- 未认证 -->
      <template v-if="!isVerify">
        <template v-if="!userStatus">
          <EmptyVeri label="您还未进行身份认证" captions="用户认证通过后，才能申请使用" />
          <Btn1
            label="前往认证" icon w-53
            @click="$router.push('/userCenter/authentication')"
          />
        </template>
        <template v-else>
          <EmptyVeri label="您的身份认证尚未通过审核" captions="用户认证通过后，才能申请使用" />
          <div flex gap-6>
            <VerifyStatus :status="userStatus" />
            <Btn1
              label="前往认证" icon w-53
              @click="$router.push('/userCenter/authentication')"
            />
          </div>
        </template>
      </template>
      <template v-else>
        <!-- 未申请 -->
        <EmptyCloud
          v-if="!requestInfo.status"
          label="您还未申请云桌面"
        />
        <!-- 待审核 -->
        <EmptyCloud
          v-else-if="requestInfo.status === DesktopQueueStatus.Pending"
          label="您的云桌面使用申请正在审核中，请耐心等待"
        />
        <!-- 排队中 -->
        <EmptyCloud
          v-else-if="requestInfo.status === DesktopQueueStatus.Queueing"
          :label="
            requestInfo.queueLength
              ? `云桌面排队情况：前面有 ${requestInfo.queueLength}人 在排队`
              : '管理员正在为您创建云桌面，请耐心等待并留意邮件通知'
          "
        />
        <!-- 已驳回 -->
        <div v-else-if="requestInfo.status === DesktopQueueHistoryStatus.Rejected">
          <EmptyCloud label="您的申请已被驳回，请重新提交" />
          <div flex="~ col" mt-2 bg-grey-2 p-4 text="sm left" font-500 w-80>
            <div mb-2>
              驳回理由
            </div>
            <div break-all v-text="requestInfo.rejectReason" />
          </div>
        </div>
        <!-- 已取消 -->
        <EmptyCloud
          v-else-if="requestInfo.status === DesktopQueueHistoryStatus.Canceled"
          label="您的申请已取消，请重新提交"
        />
        <!-- 已过期 -->
        <EmptyCloud
          v-else-if="requestInfo.status === DesktopQueueHistoryStatus.Expired"
          label="您的云桌面已过期，请重新提交申请"
        />
        <Btn1
          label="前往申请" icon w-53
          @click="$router.push('/request')"
        />
      </template>
    </div>
  </div>
</template>

<style lang="sass">
.desktop-operation-buttons
  .q-btn.disabled
    opacity: 1 !important
    background: var(--grey-4)
</style>

<route lang="yaml">
meta:
  layout: userCenter
</route>
