<script setup lang="ts">
import type { QTableProps } from 'quasar'
import { watch } from 'vue'

export interface TabItem {
    label: string
    /** tab名称 */
    id: string
    /** 当前tab是否已经请求数据 */
    isRequest: boolean
    to?: string
    currTabObj?: any
    tableData?: {
        row: QTableProps['rows']
        col: QTableProps['columns']
    }
}
interface Props {
    modelValue: string
    tabList: TabItem[]
    textClass?: string
}
const props = defineProps<Props>()
const emits = defineEmits(['update:modelValue', 'update:currTabObj'])

watch(() => props.modelValue,
    () => {
        const tabObj = props.tabList.find(i => i.id === props.modelValue)
        if (tabObj)
            emits('update:currTabObj', tabObj)
    },
    { immediate: true })
</script>

<template>
    <div full>
        <q-tabs 
            indicator-color="tab-bottom"
            font-600
            bg-grey-1 
            text-primary-1 
            :model-value="modelValue"
            @update:model-value="(tab) => $emit('update:modelValue', tab)">
            <template v-for="tab in tabList" :key="tab.id" >
                <q-route-tab v-if="tab.to" :to="tab.to">
                    {{ tab.label }}
                </q-route-tab>

                <q-tab v-else text-4 font-600 :name="tab.id">
                    {{ tab.label }}
                </q-tab>
            </template>
        
        </q-tabs>

        <q-tab-panels :model-value="modelValue" @update:model-value="(tab) => $emit('update:modelValue', tab)">
            <q-tab-panel p-none :name="modelValue">
                <div>
                    <slot />
                </div>
            </q-tab-panel>
        </q-tab-panels>
    </div>
</template>
<style lang="scss" scoped>
</style>