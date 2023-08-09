<script setup lang="ts">
interface Props {
  name: string
  icon?: string
  backIcon?: string
  back?: boolean
  iconSize?: number
}
defineProps<Props>()
</script>

<template>
  <q-item-section v-if="icon" avatar min-w-0 p-0>
    <div :class="icon" :style="{ width: `${iconSize}px`, height: `${iconSize}px` }" />
  </q-item-section>
  <q-item-section :class="icon ? 'ml-4' : 'ml-0'" items-start font-600>
    {{ name }}
  </q-item-section>
  <q-item-section v-if="back" avatar min-w-0 items-end>
    <div :class="backIcon" :style="{ width: `${iconSize}px`, height: `${iconSize}px` }" />
  </q-item-section>
</template>
