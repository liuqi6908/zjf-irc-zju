<script setup lang="ts">
defineOptions({
  name: 'IndexPage',
})

// onMounted(async () => {
//   queryAllApply({
//     pagination: {
//       page: 0,
//       pageSize: 20,
//     },
//     filters: [
//       {
//         field: 'string',
//         type: 'string',
//         value: {},
//       },
//     ],
//     sort: [
//       {
//         field: 'string',
//         order: 'string',
//       },
//     ],
//     relations: {},
//   },
//   )
// })
</script>

<template>
  <div>
    首页管理
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
