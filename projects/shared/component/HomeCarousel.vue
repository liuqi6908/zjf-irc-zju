<script setup lang="ts">
import { computed, ref, watch } from 'vue'
const autoplay = ref(true)

export interface Carousel {
  img: string,
  content: string,
  title: string,
  name: string
}

interface Props {
  list: Carousel[]
}

const props = defineProps<Props>()
const slidername = ref('')

const slider = computed({
  get: () => {
    return slidername.value
  },
  set: (val) => {
    slidername.value = val
  }
})

watch(()=>props.list, () => {
  if(props.list.length!==0){
    slidername.value = props.list[0].name
  }
}, { immediate: true })
</script>

<template>
  <div>
    <q-carousel v-model="slider" arrows animated height="400px" :autoplay="autoplay" @mouseenter="autoplay = false"
      @mouseleave="autoplay = true">
      <q-carousel-slide v-for="(l, index) in list" :key="index" :name="l.name" :img-src="l.img">
        <div class="absolute-bottom custom-caption">
          <div class="text-h2">{{ l.title }}</div>
          <div class="text-subtitle1">{{ l.content }}</div>
        </div>
      </q-carousel-slide>
    </q-carousel>
  </div>
</template>
