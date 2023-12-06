<script lang="ts" setup>
interface Props {
  id: string
}

const { id } = defineProps<Props>()
const { getDataByRootId } = useDatabase()

const tabList = reactive([
  {
    label: '上传中间表',
    name: 'intermediateTable',
    component: markRaw(defineAsyncComponent(() => import('./IntermediateTable.vue')))
  },
  {
    label: '数据库介绍',
    name: 'introduce',
    component: markRaw(defineAsyncComponent(() => import('./Introduce.vue')))
  },
  {
    label: '引用规范',
    name: 'reference',
    component: markRaw(defineAsyncComponent(() => import('./Reference.vue')))
  }
])
const tab = ref(tabList[0].name)

onMounted(() => {
  getDataByRootId(id)
})
</script>

<template>
  <div full flex="~ row gap-6" p-4>
    <q-tabs
      v-model="tab"
      vertical
      class="text-teal"
    >
      <q-tab
        v-for="{ name, label } in tabList"
        :key="name"
        :name="name"
        :label="label"
        justify-end
      />
    </q-tabs>

    <q-tab-panels
      v-model="tab"
      vertical animated
      flex-1 w-0
    >
      <q-tab-panel
        v-for="{ name, component } in tabList"
        :key="name"
        :name="name"
        text-left p-0
      >
        <component :is="component" :id="id" />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<style lang="scss" scoped>
.q-tab {
  :deep(.q-tab__indicator) {
    width: 4px !important;
    height: 60% !important;
  }
}
</style>
