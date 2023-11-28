<script setup lang="ts">
interface Props {
  label?: string
  icon?: boolean
  color?: string
  textColor?: string
}

withDefaults(defineProps<Props>(), {
  color: 'primary-1',
})
</script>

<template>
  <q-btn
    :color="color"
    :text-color="textColor"
    :label="label"
    h-12
    square size="16px" unelevated font-600
  >
    <slot />
    <template v-if="icon">
      <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg" ml-3>
        <path d="M10 12L8.6 10.55L12.15 7H0V5H12.15L8.6 1.45L10 0L16 6L10 12Z" fill="white" />
      </svg>
    </template>
  </q-btn>
</template>

<style scoped>
</style>
