<script setup lang="ts">
import { cmsConfig } from 'shared/constants/cms.constant'
import { getCms } from '~/api/cms/getCms'
import { useCms } from '~/composables/useCms'

const cardList = [
  {
    icon: '<div i-mingcute:download-3-line w-7 h-7  />',
    title: '如何申请下载数据？',
    richText: '通过云桌面服务器、数据库服务器以及环境服务器三者协同，为用户提供离线、安全和多人协同的数据分析和学术生产环境。云桌面服务器为用户提供虚拟主机，运行性能灵活可控，并基于传统的Windows操作系统，为学者提供熟悉的办公分析环境；数据库服务器，为用户提供必需的大数据存取服务；环境服务器方便用户便捷、离线配置计量分析工具和协同写作。',
  },
  {
    icon: '<div i-mingcute:align-arrow-right-line w-7 h-7 />',
    title: '如何登录智能云科研平台 - 云桌面？',
    richText: '通过云桌面服务器、数据库服务器以及环境服务器三者协同，为用户提供离线、安全和多人协同的数据分析和学术生产环境。云桌面服务器为用户提供虚拟主机，运行性能灵活可控，并基于传统的Windows操作系统，为学者提供熟悉的办公分析环境；数据库服务器，为用户提供必需的大数据存取服务；环境服务器方便用户便捷、离线配置计量分析工具和协同写作。',
  },
  {
    icon: '<div i-mingcute:send-line w-7 h-7 />',
    title: '如何外发研究成果？外发注意点？',
    richText: '通过云桌面服务器、数据库服务器以及环境服务器三者协同，为用户提供离线、安全和多人协同的数据分析和学术生产环境。云桌面服务器为用户提供虚拟主机，运行性能灵活可控，并基于传统的Windows操作系统，为学者提供熟悉的办公分析环境；数据库服务器，为用户提供必需的大数据存取服务；环境服务器方便用户便捷、离线配置计量分析工具和协同写作。',
  },
  {
    icon: '<div i-mingcute:chat-4-line w-7 h-7 />',
    title: '云桌面常见问题？',
    richText: '通过云桌面服务器、数据库服务器以及环境服务器三者协同，为用户提供离线、安全和多人协同的数据分析和学术生产环境。云桌面服务器为用户提供虚拟主机，运行性能灵活可控，并基于传统的Windows操作系统，为学者提供熟悉的办公分析环境；数据库服务器，为用户提供必需的大数据存取服务；环境服务器方便用户便捷、离线配置计量分析工具和协同写作。',
  },
]
// const cmsList = reactive<Array<ICms>>([])
const cmsId = ref('home')
const homeList = ref([])
const questionProps = ref([])
const route = useRoute()
const { cmsProps } = useCms()

function currCompontnt(id: string) {
  const list = cmsConfig.find(i => i.id === cmsId.value)?.children
  return list?.find(i => i.id === id).component
}
const comProps = computed(() => (currId: string) => {
  const json: any[] = []
  if (homeList.value.length) {
    const clone = homeList.value.find(i => i.id === currId)
    if (!clone)
      return
    const jsons = clone.json
    if (jsons && json) {
      jsons.forEach((item, index) => {
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
    <div>
      <component :is="currCompontnt('homeCarousel')" v-if="comProps('homeCarousel') && currCompontnt('homeCarousel')" :list="comProps('homeCarousel')" />

      <div v-else>
        暂无cms组件,清到后台编辑
      </div>
    </div>

    <component :is="currCompontnt('homeDataIntroduce')" :list="comProps('homeDataIntroduce')" />

    <div flex-center>
      <div grid my-20 max-w-4xl gap-12 lg:grid-cols-1 xl:grid-cols-2>
        <RouterLink
          v-for="(item, index) in questionProps"
          :key="index"
          to="/question"
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
