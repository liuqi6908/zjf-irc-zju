<script lang="ts" setup>
import CurrentData from './CurrentData.vue'
import EmptyData from '~/components/empty/EmptyData.vue'

const { geRootData, rootData, loading } = useDataBase()

const databaseId = ref('')
const $router = useRouter()
const $route = useRoute()

onBeforeMount(() => {
  geRootData().finally(() => {
    if (rootData.value && rootData.value.length) {
      rootData.value = rootData.value.map((item) => {
        return {
          ...item,
          router: { path: '/database', query: { database: item.id, label: item.nameZH } },
        }
      })
    }
    const { database } = $route.query as Record<string, string>
    const obj = rootData.value.find(v => v.id === database) || rootData.value[0]

    databaseId.value = obj.id
    $router.push({ query: { database: obj.id, label: obj.nameZH } })
  },
  )
})

const empty = computed(() => !rootData.value || !rootData.value.length)
</script>

<template>
  <div flex="~ col" full min-h-4xl items-center bg-grey-1>
    <header class="database" w-full flex-center h-40>
      <div text-grey-1 title-1 v-text="'数据库'" />
    </header>
    <div
      class="col-grow" justify-center flex-start w-limited-1 mt-15
      flex="~ row gap-10"
    >
      <SliderList :list="rootData" :current-id="databaseId" router @update:current-id="(id) => databaseId = id" />

      <div flex="1" flex-center w0>
        <q-spinner
          v-if="loading"
          color="primary-1"
          size="5rem"
          :thickness="2"
          label-class="text-primary-1"
          label-style="font-size: 1.1em"
        />
        <div v-else-if="empty">
          <EmptyData label="暂无数据" />
        </div>
        <CurrentData v-else :db-id="databaseId" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.database {
    background: no-repeat center / cover url("../../assets/layout/database.png");
}
</style>

<route lang="yaml">
meta:
  layout: home
</route>
