<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { DesktopQueueHistoryStatus, DesktopQueueStatus, VerificationStatus } from 'zjf-types'
import { getDesktopTimeHostCpu } from '../../api/desktopHost/getDesktopTimeCpu'
import { getOwnDesktopQuery } from '../../api/desktop/getOwnDesktopQuery'
import { getDesktopHostList } from '../../api/desktopHost/getDesktopHostList'
import DesktopRequestDaialog from '../../view/request/DesktopRequestDaialog.vue'

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
    <header class="request" h-40 w-full flex-center>
      <div text-grey-8 title-1>
        申请使用
      </div>
    </header>
    <!-- 未通过身份认证 -->
    <div v-if="userStatus !== VerificationStatus.APPROVED" flex="~ col items-center" full min-h-4xl bg-grey-1 pt-32>
      <template v-if="!userStatus">
        <EmptyVeri label="您还未登录系统" captions="用户登录并通过认证后，才能申请使用" />
        <Btn
          mt-10 max-h-8 min-w-50
          label="前往登录"
          @click="$router.push('/auth/login')"
        >
          <template #icon>
            <div i-material-symbols:arrow-forward />
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
            <div i-material-symbols:arrow-forward />
          </template>
        </Btn>
      </template>
      <template v-else>
        <EmptyVeri label="您的身份认证尚未通过审核" captions="用户认证通过后，才能申请使用" />
        <VerifyStatus :status="userStatus" mt-10 />
      </template>
    </div>
    <!-- 申请使用云桌面 -->
    <div v-else>
      <div w-full flex="~ col items-center" bg-grey-1 py-10>
        <div class="request-flow" h-80 w-6xl />
        <!-- 申请状态 -->
        <div flex="~ row justify-between" style="background:rgba(2, 92, 185, 0.08);" mt-10 w-6xl p-6 font-600 text-xl>
          <!-- 使用中 -->
          <template v-if="requestInfo.status === DesktopQueueStatus.Using">
            <span text-grey-8>
              您已经成功申请云桌面，前往【用户中心/我的云桌面】查看
            </span>
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
              <span text-grey-8>
                云桌面排队情况：前面有
              </span>
              <span text-tab-bottom v-text="`${requestInfo.queueLength} 人`" />
              <span text-grey-8>
                在排队
              </span>
            </div>
            <!-- 待审核 -->
            <div v-else-if="requestInfo.status === DesktopQueueStatus.Pending">
              <span text-grey-8>
                云桌面正在审核中
              </span>
            </div>
            <!-- 已驳回 -->
            <div v-else-if="requestInfo.status === DesktopQueueHistoryStatus.Rejected">
              <span text-grey-8>
                您的申请已被驳回，请重新提交
              </span>
              <div flex="~ col" bg-grey-2 p-4 text-sm mt-2 font-500 w-75>
                <div flex="~ row" mb-2 text-grey-8>
                  驳回理由
                </div>
                <div flex="~ row" indent-0 text-grey-8 text-left v-text="requestInfo.rejectReason" />
              </div>
            </div>
            <!-- 已取消 -->
            <div v-else-if="requestInfo.status === DesktopQueueHistoryStatus.Canceled">
              <span text-grey-8>
                您的申请已取消，请重新提交
              </span>
            </div>
            <!-- 已过期 -->
            <div v-else-if="requestInfo.status === DesktopQueueHistoryStatus.Expired">
              <span text-grey-8>
                您的云桌面已过期，请重新提交申请
              </span>
            </div>
            <Btn
              :label="!requestInfo.status || (Object.values(DesktopQueueStatus) as Array<string>).includes(requestInfo.status)
                ? '申请使用' : '重新申请'
              "
              :disable="(Object.values(DesktopQueueStatus) as Array<string>).includes(requestInfo.status)"
              @click="requestDialog = true"
            />
          </template>
        </div>
      </div>

      <div mt-10 w-6xl bg-grey-1 p-6>
        <header flex="~ row" text-grey-8 title-4>
          云主机情况
        </header>
        <section flex="~ row items-center justify-around">
          <div class="desktopCode" ml-20 mt-6 h-60 w-60 />
          <div flex="~ col" ml-13 max-h-30 p-6 style="background: linear-gradient(135deg, #F5F7FA 0%, rgba(245, 247, 250, 0.00) 100%);">
            <span text-primary-1 title-2>{{ vmInfo.total }}</span>
            <span text-4 text-grey-5>总数量</span>
          </div>

          <table min-w-80>
            <tr min-h-10 bg-grey-2>
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

      <div bg-grey-1>
        <div mt-10 w-6xl px-6 py-10>
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
        </div>
        <HostPercent :uuid="model" />
        <HostTiming :uuid="model" />
      </div>
    </div>
    <DesktopRequestDaialog v-model="requestDialog" @callback="getRequestInfo()" />
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
  border: 1px solid #F5F7FA;
  height: 40px;
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
