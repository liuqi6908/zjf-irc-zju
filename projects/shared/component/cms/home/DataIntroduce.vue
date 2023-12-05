<script lang="ts" setup>
interface Item {
  title: string
  richText: string
}

interface Props {
  list: Item[]
}

defineProps<Props>()
</script>

<template>
  <div w-full bg-grey-1 flex-center py-20 >
    <div flex="~ row items-center gap-20">
      <div h-60 w-80 class="introduce-bg" />
      <div v-if="list && list.length" max-w-xl text-grey-8>
        <h1 text-8 leading-12 v-text="list[0].title" />
        <div text-lg mt-6 v-html="list[0].richText" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.introduce-bg {
  background: no-repeat center / cover url("../../../assets/imgs/introduce.svg");
}
</style>