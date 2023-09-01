<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { DesktopQueueStatus } from 'zjf-types'
import { getDesktopTimeHostCpu } from '../../api/desktopHost/getDesktopTimeCpu'

import { getOwnDesktopQuery } from '../../api/desktop/getOwnDesktopQuery'
import { getDesktopHostList } from '../../api/desktopHost/getDesktopHostList'
import DesktopRequestDaialog from '../../view/request/DesktopRequestDaialog.vue'

import { getDesktopVm } from '~/api/desktopVm/getDesktopVm'
import HostPercent from '~/view/request/host/HostPercent.vue'
import HostTiming from '~/view/request/host/HostTiming.vue'
import VerificationDialog from '~/view/userCenter/verification/VerificationDialog.vue'
import { useUser } from '~/composables/useUser'

const queueLength = ref()

const requestDialog = ref(false)
const verificationDialog = ref(false)
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
  queueLength: '',
})

const { userInfo } = useUser()

const desktopList = computed(() => {
  if (hostList.value) {
    return hostList.value.map((item, index: number) => {
      const deskIndex = Number(index) + 1
      return {
        label: `主机${deskIndex}`,
        value: item.uuid,
        name: item.name,
      }
    })
  }
})

const isVerification = computed(() => {
  if (userInfo.value)
    return userInfo.value.verification
  return null
})

function requestDesktop() {
  requestDialog.value = true
}

onMounted(async () => {
  const res = await getOwnDesktopQuery()
  if (res) {
    requestInfo.status = res.queue.status
    requestInfo.queueLength = res.queueLength
  }
  else { requestInfo.status = '' }

  vmInfo.value = await getDesktopVm()

  hostList.value = await getDesktopHostList()
})

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

    <div v-if="!isVerification" flex="~ col items-center" full min-h-4xl bg-grey-1 pt-32>
      <EmptyVeri label="您还未进行身份认证" captions="用户认证通过后，才能申请云桌面" />
      <Btn
        mt-10
        min-w-50
        label="前往认证"
        @click="verificationDialog = true"
      >
        <template #icon>
          <div i-material-symbols:arrow-forward />
        </template>
      </Btn>
    </div>

    <div v-else>
      <div w-full flex="~ col items-center" bg-grey-1 py-10>
        <div class="request-flow" h-80 w-6xl />
        <div v-if="requestInfo.status !== DesktopQueueStatus.Using" flex="~ row justify-between" mt-10 w-6xl p-6 text-5 style="background:rgba(2, 92, 185, 0.08);">
          <div v-if="requestInfo.status === DesktopQueueStatus.Queueing">
            <span text-grey-8>
              云桌面排队情况：前面有
            </span>
            <span text-tab-bottom>
              {{ queueLength }}人
            </span>
            <span text-grey-8>
              在排队
            </span>
          </div>
          <div v-if="requestInfo.status === DesktopQueueStatus.Pending">
            <span text-grey-8>
              云桌面正在审核中
            </span>
          </div>

          <Btn label="申请使用" @click="requestDesktop" />
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
              color="white"
              text-color="black"
              :options="desktopList"
            />
          </header>
        </div>
        <HostPercent :uuid="model" />

        <HostTiming :uuid="model" />
      </div>
    </div>
    <DesktopRequestDaialog v-model="requestDialog" />
    <VerificationDialog v-model="verificationDialog" />
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
