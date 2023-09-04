<script lang="ts" setup>
import Tree from '~/components/tree/Tree.vue'
import EmptyData from '~/components/empty/EmptyData.vue'

interface Props {
  initDatabase: string
}
const props = defineProps<Props>()

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

watch(() => props.initDatabase, async (database) => {
  if (database)
    await getDataByRootId(database)
})

const list = computed(() => {
  if (databaseTab.value) {
    const res = databaseTab.value.find(i => i.id === tab.value)
    return res
  }
})
</script>

<template>
  <div
    full max-w-250 min-h-3xl flex="~ col" class="col-grow"
  >
    <div v-if="!databaseTab || !databaseTab.length" mt-20 full>
      <EmptyData label="暂无数据" />
    </div>

    <div v-else w-full>
      <div flex="~" w-full items-start gap-2>
        <DbTabs
          v-model="tab"
          w0
          flex="~ 1"
          :items="databaseTab"
        />
        <q-item flex-center pr0>
          <router-link
            :to="{ path: '/database/intorduce', query: { rootId: route.query.database, nameEN: list?.nameEN } }"
            shrink-0 text-nowrap text-primary-1
          >
            查看数据库介绍
          </router-link>
        </q-item>
      </div>

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
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
