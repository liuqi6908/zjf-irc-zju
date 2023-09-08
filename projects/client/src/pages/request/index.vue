<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { DesktopQueueHistoryStatus, DesktopQueueStatus, VerificationStatus } from 'zjf-types'
import { getDesktopTimeHostCpu } from '../../api/desktopHost/getDesktopTimeCpu'
import { getOwnDesktopQuery } from '../../api/desktop/getOwnDesktopQuery'
import { getDesktopHostList } from '../../api/desktopHost/getDesktopHostList'
import DesktopRequestDialog from '../../view/request/DesktopRequestDaialog.vue'

import { getDesktopVm } from '~/api/desktopVm/getDesktopVm'
import HostPercent from '~/view/request/host/HostPercent.vue'
import HostTiming from '~/view/request/host/HostTiming.vue'
import { useUser } from '~/composables/useUser'

const requestDialog = ref(false)
const hostList = ref()

const cpuTimeList = ref([])

const vmInfo = ref({
  running: '',
  stopped: '',
  total: '',
})
const model = ref('')

const requestInfo = reactive({
  status: '',
  queueLength: 0,
  rejectReason: '',
})

const { userInfo, getVerify, latestVerifiy } = useUser()
const $router = useRouter()

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

const userStatus = computed(() => {
  return userInfo.value ? latestVerifiy.value?.status || 'notApply' : null
})

onMounted(async () => {
  await getVerify()
  await getRequestInfo()
  vmInfo.value = await getDesktopVm()
  hostList.value = await getDesktopHostList()
})

/**
 * 获取申请信息
 */
async function getRequestInfo() {
  const res = await getOwnDesktopQuery()
  if (res) {
    const { lastRejected, queue, queueLength } = res
    requestInfo.status = queue?.status || lastRejected?.status || ''
    requestInfo.queueLength = queueLength || 0
    requestInfo.rejectReason = lastRejected?.rejectReason
  }
  else {
    requestInfo.status = ''
  }
}

watch(desktopList, (val) => {
  if (!val)
    return
  model.value = val[0].value
})

watch(model, async (newModel) => {
  if (newModel)
    cpuTimeList.value = await getDesktopTimeHostCpu(newModel)
})
</script>

<template>
  <div full flex="~ col items-center">
    <header class="request" h-64 w-full flex-center shrink-0>
      <div text-grey-8 title-1>
        申请使用
      </div>
    </header>
    <!-- 未登录 / 未认证 -->
    <div v-if="userStatus !== VerificationStatus.APPROVED" flex="~ col items-center" w-limited-1 min-h-4xl bg-grey-1 pt-32>
      <template v-if="!userStatus">
        <EmptyVeri label="您还未登录系统" captions="用户登录并通过认证后，才能申请使用" />
        <Btn
          mt-10 max-h-8 min-w-50
          label="前往登录"
          @click="$router.push('/auth/login')"
        >
          <template #icon>
            <div i-material-symbols:arrow-forward ml-2 />
          </template>
        </Btn>
      </template>
      <template v-else-if="userStatus === 'notApply'">
        <EmptyVeri label="您还未进行身份认证" captions="用户认证通过后，才能申请使用" />
        <Btn
          mt-10 max-h-8 min-w-50
          label="前往认证"
          @click="$router.push('/userCenter/authentication')"
        >
          <template #icon>
            <div i-material-symbols:arrow-forward ml-2 />
          </template>
        </Btn>
      </template>
      <template v-else>
        <EmptyVeri label="您的身份认证尚未通过审核" captions="用户认证通过后，才能申请使用" />
        <div mt-10 flex gap-6>
          <VerifyStatus :status="userStatus" />
          <Btn
            label="前往认证"
            @click="$router.push('/userCenter/authentication')"
          >
            <template #icon>
              <div i-material-symbols:arrow-forward ml-2 />
            </template>
          </Btn>
        </div>
      </template>
    </div>
    <!-- 申请使用云桌面 -->
    <div v-else w-limited-1>
      <div w-full flex="~ col items-center" bg-grey-1 py-10>
        <div class="request-flow" w-full h-80 />
        <!-- 申请状态 -->
        <div
          flex="~ row"
          style="background:rgba(2, 92, 185, 0.08);"
          mt-10 w-full items-center justify-between p-6 font-600 text="xl grey-8"
        >
          <!-- 使用中 -->
          <template v-if="requestInfo.status === DesktopQueueStatus.Using">
            <div>
              您已经成功申请云桌面，前往
              <span text-tab-bottom v-text="'「 用户中心 / 我的云桌面 」'" />
              查看
            </div>
            <Btn
              label="前往查看"
              @click="$router.push('/userCenter/cloudDesktop')"
            >
              <template #icon>
                <q-icon name="fas fa-arrow-right" size="14px" ml-2 />
              </template>
            </Btn>
          </template>
          <template v-else>
            <!-- 排队中 -->
            <div v-if="requestInfo.status === DesktopQueueStatus.Queueing">
              <template v-if="requestInfo.queueLength">
                云桌面排队情况：前面有
                <span text-tab-bottom v-text="`${requestInfo.queueLength} 人`" />
                在排队
              </template>
              <template v-else>
                管理员正在为您创建云桌面，请耐心等待并留意邮件通知
              </template>
            </div>
            <!-- 待审核 -->
            <div v-else-if="requestInfo.status === DesktopQueueStatus.Pending">
              云桌面正在审核中
            </div>
            <!-- 已驳回 -->
            <div v-else-if="requestInfo.status === DesktopQueueHistoryStatus.Rejected">
              您的申请已被驳回，请重新提交
              <div flex="~ col" mt-2 w-75 bg-grey-2 p-4 text-sm font-500>
                <div flex="~ row" mb-2 text-grey-8>
                  驳回理由
                </div>
                <div flex="~ row" text-grey-8 text-left indent-0 v-text="requestInfo.rejectReason" />
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
            <!-- 未申请 -->
            <div v-else text="4.5 grey-8" font-400>
              您已经通过身份认证，请点击右侧按钮申请云桌面。
              <template v-if="requestInfo.queueLength">
                注意：前面有
                <span
                  text-tab-bottom v-text="`${requestInfo.queueLength} 人`"
                />正在排队。
              </template>
            </div>
            <Btn
              text-nowrap
              :label="!requestInfo.status || (Object.values(DesktopQueueStatus) as Array<string>).includes(requestInfo.status)
                ? '申请使用' : '重新申请'
              "
              :disable="(Object.values(DesktopQueueStatus) as Array<string>).includes(requestInfo.status)"
              @click="requestDialog = true"
            />
          </template>
        </div>
      </div>
    </div>
    <div w-full bg-grey-2>
      <div w-limited-1 flex="~ col nowrap" gap10>
        <div w-limited-1 mt-10 bg-grey-1 p-6>
          <header flex="~ row" text-grey-8 title-4>
            云主机情况
          </header>
          <div flex="~ wrap" items-center justify-center>
            <div class="desktopCode" h-60 w-60 />

            <!--  -->
            <section flex="~ row 1 center" gap10 min-w-500px w0>
              <div
                flex="~ col"
                style="background: linear-gradient(135deg, #F5F7FA 0%, rgba(245, 247, 250, 0.00) 100%);"
                p-6 min-h-34 min-w-34
              >
                <span text-primary-1 title-2>{{ vmInfo.total }}</span>
                <span text-4 text-grey-5>总数量</span>
              </div>

              <table min-w-80>
                <tr bg-grey-2 min-h-10>
                  <td>运行中</td>
                  <td>停止</td>
                </tr>
                <tr>
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
    <DesktopRequestDialog v-model="requestDialog" @callback="getRequestInfo()" />
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
