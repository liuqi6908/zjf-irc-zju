<script setup lang="ts">
interface Props {
  color?: string
  textColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary-1',
  textColor: 'grey-1',
})
</script>

<template>
  <q-btn
    v-bind="props"
    square size="16px"
  >
    <slot />
  </q-btn>
</template>

<style scoped>
</style>
