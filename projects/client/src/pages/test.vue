<script setup lang="ts">
import { md5 } from 'zjf-utils'

const src = ref('')
const md5str = computed(() => {
  return md5(src.value)
})
</script>

<template>
  <div text-dark>
    <div>md5: </div>
    <input v-model="src" text-white> => {{ md5str }}
  </div>
</template>
