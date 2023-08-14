<script setup lang="ts">
import type { Carousel } from 'shared/component/HomeCarousel.vue'
import HomeCarousel from 'shared/component/HomeCarousel.vue'

import _ from 'lodash'
import { Notify } from 'quasar'
import { getCms } from '~/api/cms/getCms'
import { upsertCms } from '~/api/cms/upsertCms'

const rows = ref<Array<any>>([])

const rowsJson = computed<Carousel[]>(() => {
  const json = [] as Carousel[]
  const cloneRow = _.cloneDeep(rows.value)
  if (cloneRow) {
    cloneRow.forEach((item, index) => {
      json.push({
        name: `silder${index}`,
        content: item.content,
        title: item.title,
        img: item.uploadImg,
      })
    })
  }

  return json
})

// 按从左到右的顺序
const col = ['title', 'content', 'uploadImg', 'delete']

async function saveRows() {
  const res = await upsertCms<Carousel>('homeCarousel', rows.value)
  if (res) {
    Notify.create({
      type: 'success',
      message: '保存成功',
    })
  }
}

onMounted(async () => {
  const res = await getCms('homeCarousel')
  if (res)
    rows.value = res.json
})
</script>

<template>
  <div p-xl>
    <EditableGrid v-model:rows="rows" :col-names="col" component-name="轮播图" @save="saveRows" />

    <span>预览界面</span>
    <HomeCarousel :list="rowsJson" />
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
