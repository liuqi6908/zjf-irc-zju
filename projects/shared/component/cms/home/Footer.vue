<template >
    <div flex="~ row justify-center" p-25 text-grey-1 w-full  style="background-color: #001020;">
      <div v-for="(item,index) in list" :key="index" mx-10 flex="~ row">
        <div v-if="index!==0" py-10 h-full w-0.25 class="border-color"  />
        <div flex="~ col" ml-15>
            <span text-4.5 font-600 mb-5>{{ item.title }}</span>
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
    
</style>