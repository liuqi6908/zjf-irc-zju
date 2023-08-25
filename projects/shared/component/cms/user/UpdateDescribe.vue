<template>
    <div v-for="(item,index) in list" :key="index">
       <div v-html="item.richText" />

    </div>
</template>
<script lang="ts" setup>
interface RichText {
    richText: string
}

interface Props{
    list: RichText[]
}
defineProps<Props>()
</script>
<style>
    
</style>