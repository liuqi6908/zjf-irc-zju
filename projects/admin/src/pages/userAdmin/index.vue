<script setup lang="ts">
import { ref } from 'vue'

const tabsList = [
  { label: '注册用户', id: 'regiset' },
  { label: '待审核', id: 'pendding' },
  { label: '已认证', id: 'verification' },
  { label: '驳回记录', id: 'reject' },
]

const tab = ref(tabsList[0].id)
</script>

<template>
  <div>
    <header>
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab
          v-for="t in tabsList"
          :key="t.id"
          :label="t.label"
          :name="t.id"
        />
      </q-tabs>
    </header>
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel :name="tab">
        {{ tab }}
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
