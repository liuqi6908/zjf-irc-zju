<script lang="ts" setup>
import { onMounted, ref } from 'vue'

import { getOwnDesktopQuery } from '../../api/desktop/getOwnDesktopQuery'
import DesktopRequestDaialog from '../../view/request/DesktopRequestDaialog.vue'

const queueLength = ref()
const requestDialog = ref(false)

onMounted(async () => {
  const res = await getOwnDesktopQuery()
  if (res)
    queueLength.value = res.queueLength
})

function requestDesktop() {
  requestDialog.value = true
}
</script>

<template>
  <div full flex="~ col items-center">
    <header class="request" h-40 w-full flex-center>
      <div text-grey-8 title-1>
        申请使用
      </div>
    </header>

    <div w-full flex="~ col items-center" bg-grey-1 py-10>
      <div class="request-flow" h-80 w-6xl />

      <div flex="~ row justify-between" mt-10 w-6xl p-6 text-5 style="background:rgba(2, 92, 185, 0.08);">
        <div>
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
        <Btn label="申请使用" @click="requestDesktop" />
      </div>
    </div>

    <DesktopRequestDaialog v-model="requestDialog" />

    <div mt-10 w-6xl bg-grey-1 p-6>
      <header flex="~ row" text-grey-8 title-4>
        云主机情况
      </header>
      <section flex="~ row items-center justify-around">
        <div class="desktopCode" ml-20 mt-6 h-60 w-60 />
        <div flex="~ col" ml-13 max-h-30 p-6 style="background: linear-gradient(135deg, #F5F7FA 0%, rgba(245, 247, 250, 0.00) 100%);">
          <span text-primary-1 title-2>23</span>
          <span text-4 text-grey-5>总数量</span>
        </div>

        <table min-w-80>
          <tr min-h-10 bg-grey-2>
            <td>运行中</td>
            <td>停止</td>
            <td>其他</td>
          </tr>
          <tr>
            <td>John</td>
            <td>Doe</td>
            <td>Doe</td>
          </tr>
        </table>
      </section>
    </div>

    <div mt-10>
      <RoundEchartsCard title="cpu占比" :value="0.7" color="#025CB9" />
    </div>

    <div mb-20 mt-10 max-w-6xl w-full>
      <LineEchartsCard title="占比" />
    </div>
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
