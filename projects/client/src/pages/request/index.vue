<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { DesktopQueueHistoryStatus, DesktopQueueStatus } from 'zjf-types'

import { getOwnDesktopQuery } from '~/api/desktop/getOwnDesktopQuery'
import { getDesktopHostList } from '~/api/desktopHost/getDesktopHostList'
import { getDesktopVm } from '~/api/desktopVm/getDesktopVm'

import DesktopRequestDialog from '~/view/request/DesktopRequestDialog.vue'
import HostPercent from '~/view/request/host/HostPercent.vue'
import HostTiming from '~/view/request/host/HostTiming.vue'

const { isLogin, isVerify, getVerify, latestVerifiy } = useUser()
const $router = useRouter()
/** 滚动至页面顶部 */
const { y } = useScroll(document)
y.value = 0

/** 用户认证状态 */
const userStatus = computed(() => latestVerifiy.value?.status)
/** 云桌面申请信息 */
const requestInfo = reactive({
  status: '',
  queueLength: 0,
  rejectReason: '',
})

/** 云桌面总览 */
const vmInfo = ref({
  running: '',
  stopped: '',
  total: '',
})
/** 云桌面物理机 */
const hostList = ref()
const desktopList = computed(() => {
  if (hostList.value) {
    return hostList.value.map((item: any, index: number) => {
      const deskIndex = Number(index) + 1
      return {
        label: `主机${deskIndex}`,
        value: item.uuid,
        name: item.name,
      }
    })
  }
})
const model = ref('')

const dialog = ref(false)

onMounted(async () => {
  if (!isLogin.value)
    return
  await getVerify()
  await getRequestInfo()
  vmInfo.value = await getDesktopVm()
  hostList.value = await getDesktopHostList()
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

watch(desktopList, (newVal) => {
  if (newVal)
    model.value = newVal[0].value
})
</script>

<template>
  <div full flex="~ col items-center">
    <!-- header -->
    <header class="request" h-64 w-full flex-center shrink-0>
      <div text-grey-8 title-1>
        申请使用
      </div>
    </header>
    <!-- 未登录 / 未认证 -->
    <div v-if="!isVerify" flex="~ col items-center" w-limited-1 min-h-4xl bg-grey-1 pt-32>
      <!-- 未登录 -->
      <template v-if="!isLogin">
        <EmptyVeri label="您还未登录系统" captions="用户登录并通过认证后，才能申请使用" />
        <Btn1
          label="前往登录" icon
          mt-10 w-53
          @click="$router.push('/auth/login')"
        />
      </template>
      <!-- 未申请 -->
      <template v-else-if="!userStatus">
        <EmptyVeri label="您还未进行身份认证" captions="用户认证通过后，才能申请使用" />
        <Btn1
          label="前往认证" icon
          mt-10 w-53
          @click="$router.push('/userCenter/authentication')"
        />
      </template>
      <!-- 其他状态 -->
      <template v-else>
        <EmptyVeri label="您的身份认证尚未通过审核" captions="用户认证通过后，才能申请使用" />
        <div mt-10 flex gap-6>
          <VerifyStatus :status="userStatus" />
          <Btn1
            label="前往认证" icon
            w-53
            @click="$router.push('/userCenter/authentication')"
          />
        </div>
      </template>
    </div>
    <!-- 已认证 -->
    <template v-else>
      <!-- 申请使用云桌面 -->
      <div w-limited-1>
        <div w-full flex="~ col items-center" bg-grey-1 py-10>
          <div class="request-flow" w-full h-80 />
          <!-- 申请状态 -->
          <div
            flex="~ row" style="background:rgba(2, 92, 185, 0.08);"
            mt-10 w-full items-center justify-between py-4 px-6
            font-600 text="lg grey-8"
          >
            <!-- 使用中 -->
            <template v-if="requestInfo.status === DesktopQueueStatus.Using">
              <div>
                您已经成功申请云桌面，前往
                <span text-tab-bottom v-text="'「 用户中心 / 我的云桌面 」'" />
                查看
              </div>
              <Btn1
                label="前往云桌面" icon w-40
                @click="$router.push('/userCenter/cloudDesktop')"
              />
            </template>
            <template v-else>
              <!-- 未申请 -->
              <div v-if="!requestInfo.status">
                您已经通过身份认证，请点击右侧按钮申请云桌面。
                <template v-if="requestInfo.queueLength">
                  注意：前面有
                  <span text-tab-bottom v-text="`${requestInfo.queueLength} 人`" />
                  正在排队。
                </template>
              </div>
              <!-- 待审核 -->
              <div v-else-if="requestInfo.status === DesktopQueueStatus.Pending">
                您的云桌面使用申请正在审核中，请耐心等待
              </div>
              <!-- 排队中 -->
              <div v-else-if="requestInfo.status === DesktopQueueStatus.Queueing">
                <template v-if="requestInfo.queueLength">
                  云桌面排队情况：前面有
                  <span text-tab-bottom v-text="`${requestInfo.queueLength} 人`" />
                  在排队
                </template>
                <template v-else>
                  管理员正在为您创建云桌面，请耐心等待并留意邮件通知
                </template>
              </div>
              <!-- 已驳回 -->
              <div v-else-if="requestInfo.status === DesktopQueueHistoryStatus.Rejected" text-left>
                您的申请已被驳回，请重新提交
                <div flex="~ col" mt-2 bg-grey-2 p-4 text-sm font-500 w-80>
                  <div mb-2>
                    驳回理由
                  </div>
                  <div break-all v-text="requestInfo.rejectReason" />
                </div>
              </div>
              <!-- 已取消 -->
              <div v-else-if="requestInfo.status === DesktopQueueHistoryStatus.Canceled">
                您的申请已取消，请重新提交
              </div>
              <!-- 已过期 -->
              <div v-else-if="requestInfo.status === DesktopQueueHistoryStatus.Expired">
                您的云桌面已过期，请重新提交申请
              </div>
              <Btn1
                :label="!requestInfo.status || (Object.values(DesktopQueueStatus) as Array<string>).includes(requestInfo.status)
                  ? '申请使用' : '重新申请'
                "
                class="w-28!"
                :disable="(Object.values(DesktopQueueStatus) as Array<string>).includes(requestInfo.status)"
                @click="dialog = true"
              />
            </template>
          </div>
        </div>
      </div>
      <!-- 云桌面 -->
      <div w-full bg-grey-2>
        <div w-limited-1 flex="~ col nowrap" gap10>
          <div w-limited-1 mt-10 bg-grey-1 p-6>
            <header flex="~ row" text-grey-8 title-4>
              云主机情况
            </header>
            <div flex="~ wrap" items-center justify-center mt-6>
              <div class="desktopCode" flex-1 h-60 />
              <section flex="~ 2 row center" min-w-500px gap-40 mr-10>
                <div
                  flex="~ col"
                  style="background: linear-gradient(135deg, #F5F7FA 0%, rgba(245, 247, 250, 0.00) 100%);"
                  p-6 min-h-34 min-w-34 justify-center
                >
                  <span text-primary-1 title-2>{{ vmInfo.total }}</span>
                  <span text-4 text-grey-5>总数量</span>
                </div>

                <table min-w-80>
                  <tr bg-grey-2 min-h-10 text-base>
                    <td>运行中</td>
                    <td>停止</td>
                  </tr>
                  <tr text-lg>
                    <td>{{ vmInfo.running }}</td>
                    <td>{{ vmInfo.stopped }}</td>
                  </tr>
                </table>
              </section>
            </div>
          </div>

          <div w-full bg-grey-1 px8 py10>
            <header v-if="model && desktopList" mb-10>
              <q-btn-toggle
                v-model="model"
                unelevated no-caps spread rounded-0
                toggle-color="primary-1"
                :flat="desktopList.length === 1 ? true : false"
                text-color="primary-1"
                :options="desktopList"
              />
            </header>
            <HostPercent :uuid="model" />
            <HostTiming :uuid="model" />
          </div>
        </div>
      </div>
      <!-- 申请使用 -->
      <DesktopRequestDialog v-model="dialog" @callback="getRequestInfo()" />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.request {
    background: no-repeat center / cover url("../../assets/layout/desktopRequest.png");
}
.request-flow {
    background: no-repeat center / contain url("../../assets/layout/requestFlow.svg");
}
.desktopCode {
    background: no-repeat center / contain url("../../assets/layout/desktopCode.png");
}
table,
td {
  border: 1px solid var(--grey-3);
  height: 68px;
}

thead,
tfoot {
  background-color: #D4DDEA;
}
</style>

<route lang="yaml">
meta:
  layout: home
</route>
