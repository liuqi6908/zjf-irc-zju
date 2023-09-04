<template>
    <div flex="~ row gap-15" max-w-6xl>
        <q-list text-grey-8 w-2xl>
            <q-item w-50 v-for="(item, index) in list" class="ellipsis" flex="~ col justify-center items-start" font-600
                clickable @click="scrollTo(item.title, index)" :active="link === item.title"
                active-class="text-primary-1 bg-grey-2">
                <q-item-section>
                    <q-item-label lines="1">
                        {{ item.title }}
                    </q-item-label>
                </q-item-section>
            </q-item>
        </q-list>
        <div flex="~ col" w-600>
            <q-expansion-item py-12 border-b border-grey-3 dense dense-toggle switch-toggle-side
                header-class="font-600 text-5 text-grayness-8" v-for="(item, index) in list" :key="index"
                :id="`title${index + 1}`" :label="item.title">
                <div mt-4 ml-20 w-150 border-l-1 border-primary-1 p-5>
                    <div w-150 v-html="item.richText" />
                </div>
            </q-expansion-item>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { useQuasar } from 'quasar';
import { ref } from 'vue';

interface Question {
    title: string
    richText: string
}

interface Props {
    list: Question[]
}
defineProps<Props>()

const link = ref('')

const $q = useQuasar()

function scrollTo(title: string, index: number) {
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
    .q-item {
        .q-item__section {
            align-items: start;
        }
    }
}
</style>