<script setup lang="ts">
import { cmsConfig } from 'shared/constants/cms.constant'
import { getCms } from '~/api/cms/getCms'

const { cmsProps } = useCms()

const cmsId = 'home'
const cmsList = ref<any>([])
const question = ref<{
  title: string
  svg: string
  richText: string
}[]>()

/**
 * 获取组件
 * @param id
 */
function currCom(id: string) {
  return cmsConfig.find(v => v.id === cmsId)?.children
    .find(v => v.id === id)?.component
}

/**
 * 获取组件对应的参数
 */
const comProps = computed(() => (id: string) => {
  const json: any[] = []
  if (cmsList.value.length) {
    const cms = cmsList.value.find((v: any) => v.id === id)
    if (cms?.json) {
      cms.json.forEach((item: any, index: number) => {
        const { title, uploadImg, richText } = item
        json.push({
          name: `slider${index}`,
          title,
          img: uploadImg,
          richText,
        })
      })
    }
  }
  return json
})

onMounted(init)

/**
 * 初始化页面
 */
async function init() {
  const list = ['homeCarousel', 'homeDataIntroduce', 'homeContent']
  list.forEach(async (id) => {
    const res = await getCms(id)
    cmsList.value.push(res)
  })
  question.value = await cmsProps('questionItem')
}
</script>

<template>
  <div>
    <component
      v-if="comProps('homeCarousel') && comProps('homeCarousel')?.length"
      :is="currCom('homeCarousel')"
      :list="comProps('homeCarousel')"
    />

    <component
      v-if="comProps('homeDataIntroduce') && comProps('homeDataIntroduce')?.length"
      :is="currCom('homeDataIntroduce')"
      :list="comProps('homeDataIntroduce')"
    />

    <div v-if="comProps('homeContent') && comProps('homeContent')?.length" flex="~ justify-center" pb-20>
      <div w-full max-w-240>
        <component
          :is="currCom('homeContent')"
          :list="comProps('homeContent')"
        />
      </div>
    </div>

    <div flex-center bg-grey-2>
      <div grid my-20 max-w-4xl gap-12 lg:grid-cols-1 xl:grid-cols-2>
        <RouterLink
          v-for="(item, index) in question"
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
