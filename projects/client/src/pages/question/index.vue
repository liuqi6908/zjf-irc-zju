<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { cmsConfig } from 'shared/constants/cms.constant'
import { useRoute } from 'vue-router'
import { getCms } from '../../api/cms/getCms'

const route = useRoute()

const pId = ref('question')
const comId = ref('questionItem')
const questionList = ref([])

function currCompontnt() {
  const list = cmsConfig.find(i => i.id === pId.value)?.children
  return list?.find(i => i.id === comId.value).component
}

const comProps = computed(() => {
  const json: any[] = []

  if (questionList.value.length) {
    const clone = questionList.value?.find(i => i.id === comId.value).json
    if (clone) {
      clone.forEach((item, index) => {
        json.push({
          title: item.title,
          richText: item.richText,
        })
      })
    }
  }
  return json
})

watch(() => route.name, async () => {
  const list = cmsConfig.find(i => i.id === pId.value)?.children
  if (!list)
    return
  for (const cms of list) {
    const res = await getCms(cms.id)
    questionList.value.push(res)
  }
}, { immediate: true })
</script>

<template>
  <div flex="~ col" full>
    <header class="questionTitle" h-40 w-full flex-center>
      <div text-grey-8 title-1>
        常见问题解答(Q&A)
      </div>
    </header>
    <div class="col-grow" mt-15 flex-center>
      <div max-w-4xl>
        <component :is="currCompontnt()" v-if="comProps && comProps.length" :list="comProps" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.questionTitle {
    background: no-repeat center / cover url("../../assets/layout/questionTitle.png");
}
</style>

<route lang="yaml">
meta:
  layout: home
</route>
