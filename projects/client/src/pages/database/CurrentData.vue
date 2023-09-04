<script lang="ts" setup>
import Tabs from 'shared/component/base/tab/Tabs.vue'
import Tree from '~/components/tree/Tree.vue'
import EmptyData from '~/components/empty/EmptyData.vue'

interface Props {
  initDatabase: string
}
const props = defineProps<Props>()

const route = useRoute()

const { getDataByRootId, databaseTab, loading } = useDataBase()

const currentTab = ref('')

const tab = computed({
  get: () => {
    if (databaseTab.value.length)
      currentTab.value = currentTab.value || databaseTab.value[0].nameEN as string
    return currentTab.value
  },
  set: (val) => {
    currentTab.value = val
  },
})
const list = computed(() => {
  if (databaseTab.value) {
    const res = databaseTab.value.find(i => i.id === tab.value)
    return res
  }
})

watch(() => props.initDatabase, (database) => {
  if (!database)
    return
  getDataByRootId(database)
})
</script>

<template>
  <div
    full max-w-250 min-h-3xl flex="~ row" class="col-grow"
  >
    <div v-if="!databaseTab || !databaseTab.length" mt-20 full>
      <EmptyData label="暂无数据" />
    </div>

    <Tabs v-else v-model="tab" align="left" :text-style="{ color: '#292D36' }" class="col-6" :tab-list="databaseTab">
      <div v-if="list?.children">
        <Tree
          v-for="item in list.children"
          :id="item.id"
          :key="item.id"
          :loading="loading"
          :reference="list?.reference"
          :name-z-h="item.nameZH"
          :children="item.children"
          :label="route.query.label"
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
