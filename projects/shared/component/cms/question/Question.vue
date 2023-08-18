<template >
    <div v-for="(item,index) in list" :key="index" flex="~ col justify-start">
       <div title-4 text-grey-8 flex mb-4> {{ item.title }}</div>
       <div border-l-1 border-primary-1 p-5>
           <div v-html="item.richText"/>
       </div>
    </div>
</template>
<script lang="ts" setup>
interface Question{
    title:string
    richText:string
}

interface Props{
    list:Question[]
}
defineProps<Props>()
</script>
<style lang="scss">
    
</style>