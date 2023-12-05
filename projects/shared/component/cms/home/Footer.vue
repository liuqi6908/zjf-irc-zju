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

<template >
  <div
    flex="~ row justify-center"
    p25 text="left grey-1" w-full bg="#001020"
    gap24
  >
    <div
      v-for="(item, index) in list"
      :key="index"
      class="footer-item"
    >
      <div flex="~ col gap-8">
        <div text-lg font-500 v-text="item.title" />
        <div text-sm v-html="item.richText" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.footer-item:not(:last-child) {
  position: relative;

  &::after {
    content: "";
    position: absolute;
    height: 65px;
    background: rgba(255,255,255,0.3);
    width: 1px;
    left: calc(100% + 48px);
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>