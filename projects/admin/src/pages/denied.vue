<template>
  <div class="flex-center fit column">
    <q-icon name="fas fa-exclamation-triangle" size="5rem" color="red-6" />
    <div class="text-red" my-2>
      您没有权限访问
    </div>
    <q-btn color="primary" label="返回首页" @click="$router.push('/')" />
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
