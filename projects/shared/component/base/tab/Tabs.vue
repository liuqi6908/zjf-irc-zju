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
  rightEvent?: string
  nameEN?:string
  tableData?: {
    row: QTableProps['rows']
    col: QTableProps['columns']
  }
  children?: TabItem[]
}
interface Props {
  modelValue: string
  tabList: TabItem[]
  align?:string
  showcaption?:boolean
  indicatorColor?:string
}

const props =   withDefaults(defineProps<Props>(),{
  indicatorColor: 'primary-1'
})

const emits = defineEmits(['update:modelValue', 'update:currTabObj','update:rightEvent'])

function editPopup(val: any, event: any){
  emits('update:rightEvent',{ val,event})
}

watch(
  () => props.modelValue,
  () => {
      const tabObj = props.tabList.find(i => i.id === props.modelValue)
      if (tabObj){
          emits('update:currTabObj', tabObj)
      }
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <div full>
    <div flex="~ row" :class="align ? `justify-${align}` : 'justify-center'">
      <q-tabs
        :indicator-color="indicatorColor"
        font-600
        bg-grey-1
        :model-value="modelValue"
        text-primary-1
        :align="align"
        @update:model-value="(tab) => $emit('update:modelValue', tab)"
      >
        <div v-for="tab in tabList" :key="tab.id" >
          <q-route-tab v-if="tab.to" :to="tab.to">
              {{ tab.label }}
          </q-route-tab>

          <q-tab
              v-else
              @click.right.prevent="editPopup(tab,$event)"
              text-4
              font-600
              :name="tab.id"
          >
            <div flex="~ col">
              <span>{{ tab.label }}</span>
              <span v-if="showcaption" style="text-transform: lowercase">{{ tab.nameEN }}</span>
            </div>
          </q-tab>
        </div>
      </q-tabs>
      <slot name="right"/>
    </div>

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
:deep(.q-tabs) {
  .q-tabs__content {
    flex-wrap: wrap !important;
    .q-tab {
      color: var(--grey-5);
      &.q-tab--active {
        color: var(--grey-8);
      }
      &.q-tab--inactive {
        opacity: 1;
      }
      .q-tab__content {
        flex-wrap: wrap !important;
      }
      .q-tab__indicator {
        width: 40%;
        height: 4px;
        margin: auto;
      }
    }
  }
}
</style>