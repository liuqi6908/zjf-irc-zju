<script lang="ts" setup>
interface Item {
  richText: string
}

interface Props {
  list: Item[]
}

defineProps<Props>()
</script>

<template>
  <div v-for="(item,index) in list" :key="index">
    <div v-html="item.richText" />
  </div>
</template>
