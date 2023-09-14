<script setup lang="ts">
import Page from '~/view/home/index.vue'
</script>

<template>
  <div p-4 full absolute>
    <Page id="questionItem" page="question" />
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
