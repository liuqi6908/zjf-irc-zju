<script setup lang="ts">
export interface TabItem {
  label: string
  id: string
  to?: string
  nameEN?: string
  order?: number
}

interface Props {
  modelValue: string
  tabList: TabItem[]
  align?: 'center' | 'left' | 'right'
  showCaption?: boolean
  indicatorColor?: string
}

withDefaults(defineProps<Props>(), {
  indicatorColor: 'primary-1'
})

const emits = defineEmits(['update:modelValue', 'rightEvent'])
</script>

<template>
  <div full>
    <div flex="~ row" :justify="align ? align : 'center'">
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
            @click.right.prevent="$emit('rightEvent', { val: tab, event: $event })"
            text-4
            font-600
            :name="tab.id"
          >
            <div flex="~ col">
              <div v-text="tab.label" />
              <div
                v-if="showCaption"
                style="text-transform: lowercase"
                v-text="tab.nameEN"
              />
            </div>
          </q-tab>
        </div>
      </q-tabs>
      <slot name="right"/>
    </div>

    <q-tab-panels
      :model-value="modelValue"
      @update:model-value="(tab) => $emit('update:modelValue', tab)"
    >
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