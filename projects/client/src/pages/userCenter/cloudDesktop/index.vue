<script setup lang="ts">
import { getOwnDesktopQuery } from '~/api/desktop/getOwnDesktopQuery'

import DesktopStatus from '~/view/userCenter/myDesktop/DesktopStatus.vue'

const desktopClound = ref(null)

onMounted(async () => {
  const res = await getOwnDesktopQuery()
  desktopClound.value = res
})
</script>

<template>
  <div min-h-2xl>
    <header flex="~ row justify-between">
      <DesktopStatus :status="desktopClound?.queue.status" :duration="desktopClound?.queueLength" />
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
