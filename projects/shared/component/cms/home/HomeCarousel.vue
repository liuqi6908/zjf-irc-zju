<script setup lang="ts">
import { ref, watch } from 'vue'
const autoplay = ref(true)

export interface Carousel {
  name: string
  title: string,
  img: string,
  richText: string,
}

interface Props {
  list: Carousel[]
}

const props = defineProps<Props>()
const sliderName = ref('')

watch(
  () => props.list,
  () => {
    if (props.list && props.list.length !== 0) {
      sliderName.value = props.list[0].name
    }
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <q-carousel
    v-model="sliderName"
    class="home-carousel"
    navigation arrows animated
    height="400px" :autoplay="autoplay"
    @mouseenter="autoplay = false"
    @mouseleave="autoplay = true"
  >
    <q-carousel-slide
      v-for="(item, index) in list"
      :key="index"
      :name="item.name"
      :img-src="item.img"
      pa-none
    >
      <div flex-center full text-center bg="#025cb9b3">
        <div text-grey-1 max-w-4xl>
          <div
            title-2 font-600
            v-text="item.title"
          />
          <div v-html="item.richText"/>
        </div>
      </div>
    </q-carousel-slide>
    <template #navigation-icon="{ active, onClick }">
      <div
        rounded-full
        w3 h3 mx2 cursor-pointer
        border-1 border-grey-1
        :class="active ? 'bg-grey-1' : ''"
        @click="onClick"
      />
    </template>
  </q-carousel>
</template>

<style lang="scss">
.home-carousel {
  .q-carousel__arrow {
    opacity: 0;
    transition: opacity .3s;
  }

  &:hover .q-carousel__arrow {
    opacity: 1;
  }
}
</style>
