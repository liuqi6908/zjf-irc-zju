<script lang="ts" setup>
import { cmsConfig } from 'shared/constants'
import { getCms } from '~/api/cms/getCms'

const cmsId = ref('homeUpdateDescribe')
const list = ref<any>([])
const components = cmsConfig.find(i => i.id === 'home')?.children.find(i => i.id === cmsId.value)?.component

onMounted(async () => {
  const res = await getCms(cmsId.value)
  if (res)
    list.value = res.json
})
</script>

<template>
  <div class="col-grow">
    <component :is="components" v-if="list && list.length" :list="list" />
  </div>
</template>

<style lang="">

</style>
