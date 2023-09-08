<script lang="ts" setup>
import Tabs from 'shared/component/base/tab/Tabs.vue'
import OutGoing from '~/view/userCenter/myData/OutGoing.vue'
import UpdateData from '~/view/userCenter/myData/UploadData.vue'
import History from '~/view/userCenter/myData/History.vue'

const { isDesktop, isVerify } = useUser()

const tabList = computed<any[]>(() => {
  const arr = [
    { label: '数据外发', id: 'outgoing' },
    { label: '历史记录', id: 'history' },
    { label: '数据上传', id: 'updating', flag: true },
  ]
  return arr.filter(v => (isDesktop.value && isVerify.value) || v.flag)
})
const tab = ref('')

onMounted(() => {
  watch(
    tabList,
    (newVal) => {
      tab.value = newVal[0].id
    },
    {
      immediate: true,
    },
  )
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
