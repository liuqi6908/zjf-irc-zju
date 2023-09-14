<script setup lang="ts">
import type { Component } from 'vue'

export interface TabItem {
  id: string | number
  label: string
  component?: Component
  params?: any
}
interface Props {
  modelValue: string | number
  tabList: TabItem[]
  color?: string
}

withDefaults(defineProps<Props>(), {
  color: 'primary-1',
})
defineEmits(['update:modelValue'])
</script>

<template>
  <div full p-4>
    <q-card full flex="~ col">
      <!-- 导航 -->
      <q-tabs
        :model-value="modelValue"
        class="text-grey"
        :active-color="color"
        :indicator-color="color"
        align="justify"
        narrow-indicator
        @update:model-value="v => $emit('update:modelValue', v)"
      >
        <q-tab
          v-for="tab in tabList"
          :key="tab.id"
          :name="tab.id"
          text-base
        >
          <div font-600 v-text="tab.label" />
        </q-tab>
      </q-tabs>
      <!-- 分割线 -->
      <q-separator />
      <!-- 面板 -->
      <q-tab-panels :model-value="modelValue" animated flex-1>
        <q-tab-panel
          v-for="tab in tabList"
          :key="tab.id"
          :name="tab.id"
          p-0
        >
          <component
            :is="tab.component"
            v-if="tab.component"
            full
            v-bind="{
              title: tab.label,
              ...tab.params,
            }"
          />
          <slot />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>
