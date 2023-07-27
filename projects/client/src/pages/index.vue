<script setup lang="ts">
import { decryptPasswordInHttp, encryptPasswordInHttp } from 'zjf-utils'

defineOptions({
  name: 'IndexPage',
})
const input = ref('')
const encrypted = computed(() => encryptPasswordInHttp(input.value))
const deprecated = computed(() => decryptPasswordInHttp(encrypted.value))
</script>

<template>
  <div>
    <div i-carbon:campsite inline-block />
    <input v-model="input">
    <div>{{ encrypted }}</div>
    <div>{{ deprecated }}</div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
