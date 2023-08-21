<script lang="ts" setup>
interface Props {
  title: string
  svg: string
  richText: string
}
defineProps<Props>()
function htmlDecodeByRegExp(htmlStr: string) {
  return htmlStr.replace(/<(style|script|iframe)[^>]*?>[\s\S]+?<\/\1\s*>/gi, '').replace(/<[^>]+?>/g, '').replace(/\s+/g, ' ').replace(/ /g, ' ').replace(/&ldquo;/g, ' ').replace(/&rdquo;/g, ' ')
    .replace(/&nbsp;/ig, '')
    .replace(/>/g, ' ')
}
</script>

<template>
  <div border-rd-3 p-x-10 p-b-6 p-t-12 flex="~ col items-center">
    <div class="card-icon" h-12 w-12 flex-center>
      <div text-primary-1 v-html="svg" />
    </div>
    <div my-3 text-5 font-600 text-grey-8>
      {{ title }}
    </div>
    <br>
    <span indent-1 text-grey-6>
      {{ htmlDecodeByRegExp(richText) }}
    </span>
  </div>
</template>

<style lang="scss" scoped>
.card-icon {
    background: rgba(2, 92, 185, 0.08);
    border-radius: 50% !important;
}
</style>
