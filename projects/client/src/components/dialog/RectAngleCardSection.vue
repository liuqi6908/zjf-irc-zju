<script lang="ts" setup>
interface Props {
  title: string
  /** html */
  content: string
}
defineProps<Props>()
</script>

<template>
  <div flex="~ col" rounded-3 bg-grey-2 p-6>
    <header flex="~ row items-center justify-start">
      <div mr-4 h-2 w-2 rotate-45 bg-primary-1 />
      <span text-5 font-600 text-grey-8>{{ title }}</span>
    </header>

    <div w-full flex="~ row ">
      <div w-15 />
      <div class="col-grow" border-l-2 border-primary-1>
        <div p-4 text-grey-6 v-html="content" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>
