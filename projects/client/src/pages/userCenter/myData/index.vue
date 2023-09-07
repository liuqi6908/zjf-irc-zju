<script lang="ts" setup>
import Tabs from 'shared/component/base/tab/Tabs.vue'
import OutGoing from '~/view/userCenter/myData/OutGoing.vue'
import UpdateData from '~/view/userCenter/myData/UploadData.vue'
import History from '~/view/userCenter/myData/History.vue'

const { isDesktop, isVerify } = useUser()

const tabList = reactive<any>([
  {
    label: '数据上传',
    id: 'updating',
  },
])
const tab = ref('')

onBeforeMount(() => {
  // if (isDesktop.value && isVerify.value) {
  tabList.unshift({
    label: '数据外发',
    id: 'outgoing',
  },
  {
    label: '历史记录',
    id: 'history',
  })
  // }
  tab.value = tabList[0].id
})
</script>

<template>
  <div min-h-2xl>
    <Tabs v-model="tab" :tab-list="tabList" align="left">
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
