<template >
    <div
      flex="~ row justify-center"
      p25 text-grey-1 w-full bg="#001020"
      gap24
    >
      <div v-for="(item,index) in list" :key="index" flex="~ row" class="footer-item">
        <div flex="~ col">
            <span text-4.5 font-500 mb-5>{{ item.title }}</span>
            <div class="col-grow items-center" v-html="item.richText"/>
        </div>
      </div>
  </div>
</template>

<script lang="ts" setup>
interface footerItem {
    title: string
    richText: string
}
interface Props {
    list : footerItem[]
}
defineProps<Props>()
</script>


<style lang="scss" scoped>
.border-color {
   background-color: var(--transparency-white-3, rgba(255, 255, 255, 0.30));;
}
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