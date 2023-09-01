<template>
    <div flex="~ row gap-10" max-w-6xl>
        <q-list w-xl flex="~ col items-start">
            <q-item  
                v-for="(item,index) in list"
                flex="~ col justify-center"
                font-600 
                clickable
                @click="scrollTo(item.title,index)"
                :active="link === item.title"
                active-class="text-primary-1 bg-grey-2"
            >
                {{ item.title }}
            </q-item>
        </q-list>
        <div flex="~ col" w-600>
            <q-expansion-item
                dense
                dense-toggle
                switch-toggle-side
                header-class="font-600 text-5 text-grayness-8"
                v-for="(item,index) in list" 
                :key="index" 
                :id="`title${index + 1}`" 
                 mb-12 border-b border-grey-2
                :label="item.title"
            >
                <!-- <div title-4 text-grey-8 flex mb-4> {{  }}</div> -->
                <div mt-4 ml-20 border-l-1 border-primary-1 p-5>
                    <div v-html="item.richText"/>
                </div>
            </q-expansion-item>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

interface Question{
    title:string
    richText:string
}

interface Props{
    list:Question[]
}
defineProps<Props>()

const link = ref('')

function scrollTo(title:string,index:number){
    link.value = title
    const target = document.querySelector(`#title${index}`)
    if (target) {
        // 使用平滑滚动
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
}
</script>
<style lang="scss" scoped>
.q-expansion-item :deep(.q-expansion-item__container) {
    .q-item{
        .q-item__section{
            align-items: start;
        }
    }
}
</style>