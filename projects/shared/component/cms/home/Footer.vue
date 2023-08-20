<template >
    <div text-grey-1 v-for="(item,index) in list" :key="index" style="background-color: #001020;">
        <span>{{ item.title }}</span>
        <div>
            {{ item.content }}
        </div>
    </div>
</template>
<script lang="ts" setup>
interface footerItem {
    title: string
    content: string
    img: string
}
interface Props {
    list : footerItem[]
}
defineProps<Props>()
</script>
<style lang="">
    
</style>