<script setup lang="ts">
/**
 * 返回首页
 */
function backHome() {
  const url = window.location.origin
  window.location.replace(url)
}
</script>

<template>
  <div class="flex-center fit column gap-2" absolute>
    <q-icon name="fas fa-exclamation-triangle" size="8rem" color="red-6" />
    <div class="text-red" my-2 text-xl>
      您没有权限访问
    </div>
    <q-btn color="primary" size="16px" label="返回首页" @click="backHome" />
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
