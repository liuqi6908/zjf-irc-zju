<script setup lang="ts">
import { DesktopQueueHistoryStatus, DesktopQueueStatus } from 'zjf-types'
import type { IDesktop } from 'zjf-types'
import { formatFileSize } from 'zjf-utils'
import { Notify, copyToClipboard } from 'quasar'
import moment from 'moment'

import { desktopQuery } from '~/api/desktop/desktopsQuery'
import { getOwnDesktopQuery } from '~/api/desktop/getOwnDesktopQuery'
import { openDesktop } from '~/api/desktopVm/openDesktop'
import { resetDesktop } from '~/api/desktopVm/resetDesktop'
import { closeDesktop } from '~/api/desktopVm/closeDesktop'
import type { VMBaseInfo } from '~/api/desktopVm/getDesktopVmStatus'
import { getDesktopVmStatus } from '~/api/desktopVm/getDesktopVmStatus'

import DesktopStatus from '~/view/userCenter/myDesktop/DesktopStatus.vue'
import Cloud from '~/view/request/cloud/index.vue'

const { isVerify, isLogin, useGetProfile, getVerify, latestVerifiy } = useUser()
const $router = useRouter()
const { pause, resume } = useIntervalFn(() => getVmInfo(), 3000, { immediate: false })

/** 用户认证状态 */
const userStatus = computed(() => latestVerifiy.value?.status)
const loading = ref(true)
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
    { label: '云桌面访问地址', href: desktopInfo.value?.accessUrl },
    { label: '云桌面账号', value: desktopInfo.value?.account },
    { label: '云桌面初始密码', value: desktopInfo.value?.password, hide: true },
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
  try {
    if (!isLogin.value) {
      latestVerifiy.value = undefined
    }
    else {
      await useGetProfile()
      if (!isVerify.value) {
        await getVerify()
      }
      else {
        await getRequestInfo()
        if (requestInfo.status === DesktopQueueStatus.Using) {
          await getDesktopInfo()
          getVmInfo()
          resume()
        }
      }
    }
  }
  catch (_) {}
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
  if (new Date(desktopInfo.value?.expiredAt).getTime() < new Date().getTime()) {
    requestInfo.status = DesktopQueueHistoryStatus.Expired
    desktopInfo.value = undefined
  }
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
  copyToClipboard(text)
    .then(() => {
      Notify.create({
        message: '已复制到剪切板',
        type: 'success',
      })
    })
    .catch(() => {
      Notify.create({
        message: '复制失败',
        type: 'danger',
      })
    })
}
</script>

<template>
  <div relative min-h-2xl>
    <!-- 加载中 -->
    <div v-if="loading" absolute full z-100 flex-center style="background: rgba(255, 255, 255, 0.6)">
      <q-spinner
        color="primary-1" size="5rem" :thickness="2" label-class="text-primary-1"
        label-style="font-size: 1.1em"
      />
    </div>
    <!-- 主要内容 -->
    <div v-else-if="desktopId">
      <!-- 状态及操作 -->
      <header flex="~ row justify-between">
        <DesktopStatus :status="requestInfo.status as DesktopQueueStatus" :duration="remainingTime" />
        <div flex="~ row gap-4" class="desktop-operation-buttons">
          <Btn
            :disable="vmStatus !== '已关机'" w28
            :bg-color="vmStatus !== '已关机' ? 'grey-4' : undefined"
            @click="desktopOperate('开机')"
          >
            <div text-base flex="~ gap-2 items-center">
              开机
              <q-icon name="fas fa-power-off" size="18px" />
            </div>
          </Btn>
          <Btn
            :disable="vmStatus !== '运行中'" w28
            :bg-color="vmStatus !== '运行中' ? 'grey-4' : undefined"
            @click="desktopOperate('关机')"
          >
            <div text-base flex="~ gap-2 items-center">
              关机
              <q-icon name="fas fa-power-off" size="18px" />
            </div>
          </Btn>
          <Btn
            :disable="vmStatus !== '运行中'" w28
            :bg-color="vmStatus !== '运行中' ? 'grey-4' : undefined"
            @click="desktopOperate('重启')"
          >
            <div text-base flex="~ gap-2 items-center">
              重启
              <q-icon name="fas fa-sync" size="18px" />
            </div>
          </Btn>
        </div>
      </header>
      <!-- 云桌面信息 -->
      <div w-full flex mt-6 border="1 solid grey-3" text="base left">
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
          <div overflow-hidden bg-grey-2 text-ellipsis whitespace-nowrap px-6 py-3 v-text="item.label" />
          <div flex pl-6 items-center justify-between h-11 pr-4>
            <a
              v-if="item.href"
              text-grey-8
              target="_blank"
              :href="item.href"
              v-text="item.href"
            />
            <div
              v-else
              w-0 overflow-hidden text-ellipsis whitespace-nowrap flex-1
              v-text="item.value !== '您的登录密码' && item.hide && hidePassword ? '********' : item.value"
            />
            <div text-grey-4 v-if="item.value !== '您的登录密码'">
              <q-btn v-if="item.hide" flat px-2 @click="hidePassword = !hidePassword">
                <div v-if="hidePassword" text-xl i-mingcute:eye-close-line />
                <div v-else text-xl i-mingcute:eye-2-line />
              </q-btn>
              <q-btn flat px-2 @click="copyText(item.value || item.href || '')">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 18V2H20V18H7ZM9 16H18V4H9V16ZM3 22V6H5V20H16V22H3Z" fill="#A6B1C2" />
                </svg>
              </q-btn>
            </div>
          </div>
        </div>
      </div>
      <!-- 虚拟机信息 -->
      <div flex mt-10 gap-10 text="base left">
        <!-- 基本信息 -->
        <div flex="~ 1 col" w-0 border="1 solid grey-3">
          <header bg-grey-2 p-4 font-600 v-text="'基本信息'" />
          <div class="base-info">
            <div
              v-for="(item, index) in vmInfo"
              :key="index"
              flex gap-2 px-4 py-8
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
    <div v-else flex="~ col" gap-10 items-center py-22>
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
              ? `您正在排队中，前面有 ${requestInfo.queueLength}个 用户正在排队，请耐心等待`
              : '管理员正在为您创建云桌面，请耐心等待并留意邮件通知'
          "
        />
        <!-- 已驳回 -->
        <div v-else-if="requestInfo.status === DesktopQueueHistoryStatus.Rejected">
          <EmptyCloud label="您的申请已被驳回，请重新提交" />
          <div flex="~ col" text="sm left" bg-grey-2 p-4 mt-2 font-500 w-80>
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
.base-info
  > div:nth-child(2n)
    background: rgba(2, 92, 185, 0.06)
</style>

<route lang="yaml">
meta:
  layout: userCenter
</route>
