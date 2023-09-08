<script lang="ts" setup>
interface Props {
  title: string
  svg: string
  richText: string
}
const props = defineProps<Props>()
function htmlDecodeByRegExp(htmlStr: string) {
  return htmlStr.replace(/<(style|script|iframe)[^>]*?>[\s\S]+?<\/\1\s*>/gi, '').replace(/<[^>]+?>/g, '').replace(/\s+/g, ' ').replace(/ /g, ' ').replace(/&ldquo;/g, ' ').replace(/&rdquo;/g, ' ')
    .replace(/&nbsp;/ig, '')
    .replace(/>/g, ' ')
}

const fillReplacedSvg = computed(() => {
  return (props.svg?.replace(/fill=".*?"/g, 'fill="currentColor"') || '')
    .replace(/stroke=".*?"/g, 'stroke="currentColor"')
})
</script>

<template>
  <div flex="~ col items-center" gap3 border-rd-3 px10 py6>
    <div class="card-icon" h-12 w-12 flex-center p-2 text-primary-1 v-html="fillReplacedSvg" />

    <div text-5 font-600 text-grey-8>
      {{ title }}
    </div>
    <span
      line-clamp-5 break-all text-4 text-grey-6 class="ellipsis-3-lines"
    >
      {{ htmlDecodeByRegExp(richText) }}
    </span>
  </div>
</template>

<style lang="scss" scoped>
.card-icon {
    background: rgba(2, 92, 185, 0.08);
    border-radius: 50% !important;
         svg {
            width: 1.5rem !important;
            height: 1.5rem !important;
        }
    fill: currentColor;
    stroke: currentColor;
}
</style>
