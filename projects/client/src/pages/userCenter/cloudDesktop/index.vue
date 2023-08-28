<script setup lang="ts">
import type { IDesktop, IQueryConfig } from 'zjf-types'
import { desktopQueryList } from '~/api/desktop/desktopsList'
import { getOwnDesktopQuery } from '~/api/desktop/getOwnDesktopQuery'

import DesktopStatus from '~/view/userCenter/myDesktop/DesktopStatus.vue'

const desktopClound = ref(null)
const desktopStatus = reactive({
  status: '',
  queueLength: '',
  laseRejected: '',
  duration: '',
})
const baseOpts: IQueryConfig<IDesktop> = {
  pagination: {
    page: 0,
    pageSize: 20,
  },
  filters: [
  ],
  sort: [

  ],
  relations: {
    user: { desktop: true },
  },
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
  const res = await desktopQueryList(baseOpts)
  desktopClound.value = res
})
</script>

<template>
  <div min-h-2xl>
    <header flex="~ row justify-between">
      <DesktopStatus :status="desktopStatus.status" :duration="desktopStatus.duration" />
      <div flex="~ row gap-5">
        <Btn label="开机" />
        <Btn label="关机" />
        <Btn label="重启" />
      </div>
    </header>
  </div>
</template>

<route lang="yaml">
meta:
  layout: userCenter
</route>
