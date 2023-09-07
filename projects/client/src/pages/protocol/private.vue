<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div bg-grey-1 p-20 text-grey-8>
    <header flex="~ row">
      <div i-material-symbols:arrow-back-ios-rounded cursor-pointer @click="() => router.back()" />
    </header>

    <PrivacyDoc />
  </div>
</template>
