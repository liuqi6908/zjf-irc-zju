<script setup lang="ts">
const $router = useRouter()
</script>

<template>
  <main p="x4 y10" text="base center primary-1">
    <div text-5xl>
      <div i-carbon:warning inline-block />
    </div>
    <RouterView />
    <q-btn label="返回首页" color="primary-1" mt-3 @click="$router.push('/')" />
  </main>
</template>
