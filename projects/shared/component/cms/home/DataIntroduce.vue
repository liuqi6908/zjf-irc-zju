<script lang="ts" setup>
interface Item{
    title:string
    richText:string
}

interface Props{
    list: Item[]
}
defineProps<Props>()
</script>

<template>
    <div w-full bg-grey-1  flex-center py-20 >
        <div flex="~ row" gap-20 items-center>
            <div h-60 w-80 class="introduce_bg-img" /> 
            <div max-w-xl class="col-grow" v-if="list && list.length">
                <div title-1 text-grey-8>{{ list[0].title }}</div>
                <br/>
                <div text-4.5 indent-1 text-grey-8 v-html="list[0].richText" />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.introduce_bg-img {
    background: no-repeat center / cover url("../../../assets/imgs/introduce.svg");
}
</style>