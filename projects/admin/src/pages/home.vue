<script setup lang="ts">
import type { Carousel } from 'shared/component/HomeCarousel.vue'
import HomeCarousel from 'shared/component/HomeCarousel.vue'

import type { CMSJSON } from 'zjf-types'

const imgFiles = ref([])
const requsetJSON = ref<CMSJSON<Carousel>>({
  id: 'home-carousel',
  list: [{
    img: 'https://cdn.quasar.dev/img/mountains.jpg',
    title: 'title1',
    content: 'cotent内容内内容',
    name: 'silder1',
  },
  {
    img: 'https://cdn.quasar.dev/img/parallax1.jpg',
    title: 'title2',
    content: 'cotent内容内内容',
    name: 'silder2',
  },
  {
    img: 'https://cdn.quasar.dev/img/parallax2.jpg',
    content: 'cotent内容内内容',
    title: 'title3',
    name: 'silder3',
  }],
})
const col = ['img', 'title', 'content', 'name']
</script>

<template>
  <div p-xl>
    <EditableGrid :row-name="[]" />

    <span>预览界面</span>
    <HomeCarousel :list="requsetJSON.list" />
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
