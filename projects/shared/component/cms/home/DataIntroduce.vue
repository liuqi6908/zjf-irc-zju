<script lang="ts" setup>
interface Item{
    title:string
    content:string
}

interface Props{
    list: Item[]
}
defineProps<Props>()
</script>

<template>
    <div w-full bg-grey-1  flex-center py-20 >
        <div flex="~ row gap-20">
            <div h-60 w-80 class="introduce_bg-img" /> 
            <div max-w-xl class="col-grow">
                <span title-1 text-grey-8>{{ list[0].title }}</span>
                <br/>
                <div indent-1 text-grey-8> {{ list[0].content }} </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.introduce_bg-img {
    background: no-repeat center / cover url("../../../assest/introduce.svg");
}
</style>