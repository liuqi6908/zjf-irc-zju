<script lang="ts" setup>
import Tabs from 'shared/component/base/tab/Tabs.vue'
import OutGoing from '~/view/userCenter/myData/OutGoing.vue'
import UpdateData from '~/view/userCenter/myData/UploadData.vue'
import History from '~/view/userCenter/myData/History.vue'

const { isDesktop } = useUser()

const tab = ref('')
const { userInfo } = useUser()
const tabslit = reactive([
  {
    label: '数据上传',
    id: 'updating',
  },
])
onBeforeMount(async () => {
  if (isDesktop.value && userInfo.value?.verification) {
    tabslit.unshift({
      label: '数据外发',
      id: 'outgoing',
    },
    {
      label: '历史记录',
      id: 'history',
    })
  }

  tab.value = tabslit[0].id
})
</script>

<template>
  <div min-h-2xl>
    <Tabs v-model="tab" :tab-list="tabslit" align="left">
      <OutGoing v-if="tab === 'outgoing'" />
      <UpdateData v-else-if="tab === 'updating'" />
      <History v-else-if="tab === 'history'" />
    </Tabs>
  </div>
</template>

<route lang="yaml">
meta:
  layout: userCenter
</route>
