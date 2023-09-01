<template>
    <template v-for="(item,index) in list" :key="index">
        <div flex="~ col justify-start" my-12 border-b border-grey-2>
            <div title-4 text-grey-8 flex mb-4> {{ item.title }}</div>
            <div border-l-1 border-primary-1 p-5>
                <div v-html="item.richText"/>
            </div>
        </div>
        <div border-b bg-grey-2/>
    </template>
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