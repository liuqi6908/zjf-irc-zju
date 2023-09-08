<script setup lang="ts">
import { cmsConfig } from 'shared/constants/cms.constant'
import { getCms } from '~/api/cms/getCms'
import { useCms } from '~/composables/useCms'

const cmsId = ref('home')
const homeList = ref([])
const questionProps = ref<[{ title: string; svg: string; richText: string }]>()
const route = useRoute()
const { cmsProps } = useCms()

function currCom(id: string) {
  const list = cmsConfig.find(i => i.id === cmsId.value)?.children
  const item = list?.find(i => i.id === id)
  if (item)
    return item.component
}
const comProps = computed(() => (currId: string) => {
  const json: any[] = []
  if (homeList.value.length) {
    const clone = homeList.value.find(i => i.id === currId)
    if (!clone)
      return
    const jsons = clone.json
    if (jsons && json) {
      jsons.forEach((item: any, index: number) => {
        json.push({
          name: `silder${index}`,
          content: item.content,
          title: item.title,
          img: item.uploadImg,
          richText: item.richText,
        })
      })
    }
  }
  return json
})

onMounted(async () => {
  questionProps.value = await cmsProps('questionItem')
})
watch(() => route.name, async () => {
  // Do something here...
  const list = cmsConfig.find(i => i.id === cmsId.value)?.children
  if (!list)
    return
  for (const cms of list) {
    const res = await getCms(cms.id)
    homeList.value.push(res)
  }
}, { immediate: true })
</script>

<template>
  <div>
    <component :is="currCom('homeCarousel')" v-if="comProps('homeCarousel') && comProps('homeCarousel')?.length && currCom('homeCarousel')" :list="comProps('homeCarousel')" />

    <component :is="currCom('homeDataIntroduce')" v-if="comProps('homeDataIntroduce') && comProps('homeDataIntroduce')?.length" :list="comProps('homeDataIntroduce')" />

    <div flex-center bg-grey-2>
      <div grid my-20 max-w-4xl gap-12 lg:grid-cols-1 xl:grid-cols-2>
        <RouterLink
          v-for="(item, index) in questionProps"
          :key="index"
          :to="{ path: '/question', query: { title: item.title, index } }"
        >
          <DisplayCard
            v-bind="{ ...item }"
          />
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
