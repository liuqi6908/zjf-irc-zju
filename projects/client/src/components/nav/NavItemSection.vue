<script setup lang="ts">
interface Props {
  icon: string
  name: string
  back?: string
  iconSize?: number
}
const props = withDefaults(defineProps<Props>(), {
  iconSize: 24,
})

// function getImageUrl(url: string) {
//   return new URL(`${url}`, import.meta.url).href
// }
</script>

<template>
  <q-item-section avatar min-w-0 p-0>
    <div v-html="icon" />
  </q-item-section>
  <q-item-section ml-4 items-start font-600>
    {{ name }}
  </q-item-section>
  <q-item-section v-if="back" avatar min-w-0 items-end>
    <q-icon :name="back" :size="`${iconSize / 1.5}px`" />
  </q-item-section>
</template>

<style lang="scss">

</style>
