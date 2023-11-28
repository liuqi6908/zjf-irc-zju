<script lang="ts" setup>
interface Props {
  dbId: string
}

const props = defineProps<Props>()

const route = useRoute()
const { getDataByRootId, databaseTab, loading } = useDataBase()

const currentTab = ref<string | undefined>('')

const tab = computed({
  get: () => {
    if (currentTab.value && databaseTab.value.find(v => v.nameEN === currentTab.value))
      return currentTab.value
    else if (databaseTab.value.length)
      return databaseTab.value[0].nameEN as string
  },
  set: (val) => {
    currentTab.value = val
  },
})
const list = computed(() => databaseTab.value.find(i => i.id === tab.value))

watch(
  () => props.dbId,
  (newVal) => {
    if (newVal)
      getDataByRootId(newVal)
  },
)
</script>

<template>
  <div full min-h-3xl flex="~ col">
    <div v-if="!databaseTab || !databaseTab.length" mt-20 full>
      <EmptyData label="暂无数据" />
    </div>

    <div v-else w-full>
      <div flex="~" w-full items-start gap-2>
        <DbTabs
          v-model="tab"
          w0 flex="~ 1"
          :items="databaseTab"
        />
        <q-item flex-center pr0>
          <router-link
            :to="{ path: '/database/intorduce', query: { rootId: route.query.database, nameEN: list?.nameEN } }"
            shrink-0 text-nowrap text-primary-1 leading-18px border-b="1px solid primary-1"
          >
            查看数据库介绍
          </router-link>
        </q-item>
      </div>

      <div v-if="list?.children" flex="~ col nowrap" gap6 py6>
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
    </div>
  </div>
</template>
