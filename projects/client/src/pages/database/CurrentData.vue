<script lang="ts" setup>
import Tabs from 'shared/component/base/tab/Tabs.vue'
import Tree from '~/components/tree/Tree.vue'

const route = useRoute()

const { getDataByRootId, databaseTab, loading } = useDataBase()

const tabb = ref('')

const tab = computed({
  get: () => {
    if (databaseTab.value.length)
      tabb.value = tabb.value || databaseTab.value[0].id
    return tabb.value
  },
  set: (val) => {
    tabb.value = val
  },
})

watch(() => route.query,
  async (query) => {
    if (query.database)
      await getDataByRootId(query.database)
  },
)

const list = computed(() => {
  if (databaseTab.value) {
    const res = databaseTab.value.find(i => i.id === tab.value)
    return res
  }
})
</script>

<template>
  <div
    full max-w-180 min-h-2xl flex="~ row" class="col-grow"
  >
    <Tabs v-model="tab" align="left" class="col-6" :tab-list="databaseTab">
      <div v-if="list?.children">
        <Tree
          v-for="item in list.children"
          :id="item.id"
          :key="item.id"
          :reference="list?.reference"
          :name-z-h="item.nameZH"
          :children="item.children"
        />
      </div>
      <template #right>
        <span

          mt-4 w-xs cursor-pointer text-primary-1
          @click="() => $router.push({ path: '/database/intorduce', query: { rootId: route.query.database, nameEN: list?.nameEN } })"
        >
          查看数据库介绍
        </span>
      </template>
    </Tabs>
  </div>
</template>

<style lang="scss" scoped>

</style>
