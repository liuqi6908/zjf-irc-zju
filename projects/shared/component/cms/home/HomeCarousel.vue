<script setup lang="ts">
import { computed, ref, watch } from 'vue'
const autoplay = ref(true)

export interface Carousel {
  img: string,
  richText: string,
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

watch(() => props.list, () => {
  if (props.list && props.list.length !== 0) {
    slidername.value = props.list[0].name
  }
}, { immediate: true })
</script>

<template>
  <div>
    <q-carousel navigation v-model="slider" arrows animated height="400px" :autoplay="autoplay"
      @mouseenter="autoplay = false" @mouseleave="autoplay = true">
      <q-carousel-slide pa-none  v-for="(l, index) in list" :key="index" :name="l.name" :img-src="l.img">
        <div class="custom-caption" flex-center>
          <div text-grey-1 max-w-4xl>
            <div title-2 font-600 >{{ l.title }}</div>
            <div v-html="l.richText"/>
          </div>
        </div>
      </q-carousel-slide>
      <template #navigation-icon="{ active, onClick }">
        <div rounded-1000 w3 h3 mx2 border-1 border-grey-1 :class="active ? 'bg-grey-1' : ''" @click="onClick" />
      </template>
    </q-carousel>
  </div>
</template>
<style scoped lang="scss">
.custom-caption {
  text-align: center;
  height: 100%;
  width: 100%;
  background-color: rgba(2, 92, 185, 0.70)
}
</style>