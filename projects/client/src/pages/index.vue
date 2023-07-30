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
  <div full />
</template>

<route lang="yaml">
redirect: /home
meta:
  layout: home
</route>
